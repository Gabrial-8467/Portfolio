import { Router } from "express";
import { createOrder, verifyPayment, handleWebhook } from "../controllers/razorpayController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// Create Razorpay order for authenticated user
router.post("/create-order", authRequired, createOrder);

// Verify signature and upgrade plan
router.post("/verify-payment", authRequired, verifyPayment);

// Public Razorpay webhook listener
router.post("/webhook", handleWebhook);

export default router;
