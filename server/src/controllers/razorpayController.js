import Razorpay from "razorpay";
import crypto from "node:crypto";
import { User } from "../models/User.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Plan Pricing in INR (Paise) or USD (Cents)
const PLAN_PRICES = {
  pro: {
    amount: 79900, // ₹799 / month (79900 paise)
    currency: "INR",
    name: "Developer Pro Plan",
    planId: "pro",
  },
  agency: {
    amount: 249900, // ₹2,499 / month (249900 paise)
    currency: "INR",
    name: "Agency & Team Plan",
    planId: "agency",
  },
};

function getRazorpayInstance() {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    throw new ApiError(
      503,
      "Payments are not configured yet. Please try again later or contact support.",
    );
  }
  return new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret,
  });
}

/**
 * 1. Create a Razorpay Order for Subscription Upgrade
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { planId } = req.body;
  if (!planId || !PLAN_PRICES[planId]) {
    throw new ApiError(400, "Invalid plan selected. Choose 'pro' or 'agency'");
  }

  const selectedPlan = PLAN_PRICES[planId];
  const rzp = getRazorpayInstance();

  const options = {
    amount: selectedPlan.amount,
    currency: selectedPlan.currency,
    receipt: "rcpt_" + Date.now() + "_" + String(req.user._id).slice(-4),
    notes: {
      userId: String(req.user._id),
      userEmail: req.user.email,
      targetPlan: planId,
    },
  };

  let order;
  try {
    order = await rzp.orders.create(options);
  } catch (err) {
    logger.error(
      "Razorpay order creation failed: " + (err?.error?.description || err?.message || String(err)),
    );
    throw new ApiError(
      err?.statusCode && err.statusCode < 500 ? 502 : 502,
      "Could not create payment order with Razorpay. " +
        (err?.error?.description || err?.message || "Please try again."),
    );
  }

  // Bind the pending upgrade to this user server-side so the client cannot
  // tamper with the plan or order id during verification.
  await User.findByIdAndUpdate(req.user._id, {
    pendingPlan: planId,
    pendingOrderId: order.id,
  });

  return res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: planId,
      keyId: config.razorpayKeyId,
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});

/**
 * 2. Verify Razorpay Payment Signature and Upgrade User Plan
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Payment verification details are incomplete");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  // The plan and order id must come from the server-stored pending upgrade,
  // NOT from the client, to prevent pricing tampering (buying pro, claiming agency).
  const planId = user.pendingPlan;
  const razorpay_order_id = user.pendingOrderId;
  if (!planId || !razorpay_order_id) {
    throw new ApiError(400, "No pending payment found. Please start a new checkout.");
  }
  if (!PLAN_PRICES[planId]) {
    throw new ApiError(400, "Invalid pending plan");
  }

  // Cryptographic HMAC SHA-256 signature verification against the bound order id
  const expectedSignature = crypto
    .createHmac("sha256", config.razorpayKeySecret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature verification failed");
  }

  // Prevent accidental downgrades: only allow moving up the plan ladder.
  const PLAN_LEVELS = { hobby: 0, pro: 1, agency: 2 };
  const currentLevel = PLAN_LEVELS[user.plan] ?? 0;
  const targetLevel = PLAN_LEVELS[planId] ?? 0;
  if (targetLevel < currentLevel) {
    throw new ApiError(400, "Cannot downgrade to a lower plan via checkout");
  }

  // Update user subscription plan
  user.plan = planId;
  user.razorpaySubscriptionId = razorpay_payment_id;
  user.pendingPlan = null;
  user.pendingOrderId = null;
  await user.save();

  logger.auth("User upgraded plan via Razorpay: " + user.email + " -> " + planId + " (" + razorpay_payment_id + ")");

  return res.json({
    success: true,
    message: "Payment successfully verified! Your workspace has been upgraded to " + planId.toUpperCase() + ".",
    data: {
      user: user.toSafeObject(),
    },
  });
});

/**
 * 3. Razorpay Webhook Handler
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const secret = config.razorpayWebhookSecret || config.razorpayKeySecret;

  if (signature && secret) {
    // Use the original raw body (captured before JSON parsing) for a correct HMAC.
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    if (expectedSignature !== signature) {
      logger.error("Razorpay webhook signature mismatch");
      return res.status(400).json({ success: false, error: "Invalid webhook signature" });
    }
  }

  const event = req.body.event;
  const payload = req.body.payload;

  logger.info("Razorpay webhook received event: " + event);

  if (event === "payment.captured" || event === "order.paid") {
    const payment = payload?.payment?.entity;
    const userId = payment?.notes?.userId;
    const targetPlan = payment?.notes?.targetPlan;

    if (userId && targetPlan) {
      await User.findByIdAndUpdate(userId, {
        plan: targetPlan,
        razorpaySubscriptionId: payment.id,
      });
      logger.info("Webhook upgraded user " + userId + " to " + targetPlan);
    }
  }

  return res.json({ status: "ok" });
});
