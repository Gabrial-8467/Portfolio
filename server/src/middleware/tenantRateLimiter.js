import rateLimit from "express-rate-limit";
import { getPlanConfig } from "../config/plans.js";
import { User } from "../models/User.js";

/**
 * Resolve the plan for the current request.
 * - API-key authenticated requests set req.apiKey (with .owner) but not req.user,
 *   so we must load the owner's plan from DB to honor Pro/Agency rate limits.
 */
async function resolvePlan(req) {
  if (req.user && req.user.plan) return req.user.plan;
  if (req.apiKey && req.apiKey.owner) {
    try {
      const owner = await User.findById(req.apiKey.owner).select("plan").lean();
      if (owner && owner.plan) return owner.plan;
    } catch {
      /* fallthrough */
    }
  }
  return "hobby";
}

/**
 * Tenant-aware rate limiter:
 * Uses the API key or Portfolio ID as the rate limit bucket key
 * instead of a shared global IP. This ensures that one tenant's high traffic
 * never blocks or slows down any other tenant. Limits scale with the plan.
 */
export const tenantRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: async (req) => {
    const planName = await resolvePlan(req);
    const plan = getPlanConfig(planName);
    return plan.rateLimitPerMin || 60;
  },
  keyGenerator: (req) => {
    // 1. If authenticated by API key, use API key hash / ID as bucket
    if (req.apiKey && req.apiKey._id) {
      return `api_key:${req.apiKey._id}`;
    }
    // 2. If authenticated by JWT with portfolio attached, use portfolio ID as bucket
    if (req.portfolio && req.portfolio._id) {
      return `portfolio:${req.portfolio._id}`;
    }
    // 3. Fallback to IP address
    return req.ip || req.headers["x-forwarded-for"] || "anonymous";
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: async (req) => {
    const planName = await resolvePlan(req);
    const plan = getPlanConfig(planName);
    return {
      success: false,
      error: `Rate limit exceeded for your ${plan.name} plan (${plan.rateLimitPerMin} req/min). Upgrade to Pro or Agency for higher throughput.`,
      code: "RATE_LIMIT_EXCEEDED",
      tier: plan.id,
      limit: plan.rateLimitPerMin,
      upgradeUrl: "/#pricing",
    };
  },
});
