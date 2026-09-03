import { ApiError } from "./errorHandler.js";
import { Portfolio } from "../models/Portfolio.js";
import { ApiKey } from "../models/ApiKey.js";
import { User } from "../models/User.js";
import { getPlanConfig } from "../config/plans.js";

/**
 * Resolve the current user's plan. Reads the plan that was already resolved
 * during authentication (req.planName) or set on the JWT user, so no database
 * query is issued per request except as a rare fallback.
 */
async function resolveUserPlan(req) {
  if (req.planName) return req.planName;
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
 * Middleware: Enforces maximum number of portfolios allowed on user plan
 */
export async function guardPortfolioQuota(req, res, next) {
  try {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const plan = getPlanConfig(req.user.plan);
    if (plan.maxPortfolios === Infinity) return next();

    const currentCount = await Portfolio.countDocuments({ owner: req.user._id });
    if (currentCount >= plan.maxPortfolios) {
      throw new ApiError(
        403,
        `Portfolio limit reached for your ${plan.name} tier (${plan.maxPortfolios} max). Upgrade to Pro or Agency for additional workspaces.`,
        {
          code: "PLAN_QUOTA_EXCEEDED",
          plan: plan.id,
          currentCount,
          maxAllowed: plan.maxPortfolios,
          upgradeUrl: "/#pricing",
        }
      );
    }
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware: Enforces maximum number of API keys per portfolio allowed on user plan
 */
export async function guardApiKeyQuota(req, res, next) {
  try {
    const ownerId = (req.apiKey && req.apiKey.owner) || (req.user && req.user._id);
    if (!ownerId) throw new ApiError(401, "Authentication required");

    const planName = await resolveUserPlan(req);
    const plan = getPlanConfig(planName);

    if (plan.maxApiKeysPerPortfolio === Infinity) return next();

    const portfolioId =
      req.body.portfolioId ||
      req.portfolio?._id ||
      (req.apiKey && req.apiKey.portfolio) ||
      req.query.portfolioId;

    if (!portfolioId) {
      throw new ApiError(400, "Unable to determine portfolio for API key quota check");
    }

    const keyCount = await ApiKey.countDocuments({ portfolio: portfolioId });
    if (keyCount >= plan.maxApiKeysPerPortfolio) {
      throw new ApiError(
        403,
        `API key limit reached for this portfolio on the ${plan.name} tier (max ${plan.maxApiKeysPerPortfolio} key). Upgrade to Developer Pro for unlimited API keys.`,
        {
          code: "PLAN_QUOTA_EXCEEDED",
          plan: plan.id,
          currentCount: keyCount,
          maxAllowed: plan.maxApiKeysPerPortfolio,
          upgradeUrl: "/#pricing",
        }
      );
    }
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware: Enforces maximum file size limit for uploaded media assets based on user plan
 */
export async function guardUploadQuota(req, res, next) {
  if (!req.file) return next();
  try {
    const planName = await resolveUserPlan(req);
    const plan = getPlanConfig(planName);

    if (req.file.size > plan.maxUploadSizeBytes) {
      const limitMb = Math.round(plan.maxUploadSizeBytes / (1024 * 1024));
      return next(
        new ApiError(
          413,
          `File size exceeds the ${limitMb}MB limit for your ${plan.name} tier. Upgrade to Developer Pro or Agency for larger file uploads.`,
          {
            code: "FILE_SIZE_LIMIT_EXCEEDED",
            plan: plan.id,
            fileSize: req.file.size,
            maxAllowedBytes: plan.maxUploadSizeBytes,
            upgradeUrl: "/#pricing",
          }
        )
      );
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
