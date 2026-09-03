/**
 * SaaS Subscription Tier Configurations & Quota Limits
 * 
 * Matches the landing page pricing tiers:
 * - Hobby: 1 Portfolio Workspace, 1 Scoped API Key, 5MB file upload, 60 req/min
 * - Pro: 5 Portfolio Workspaces, Unlimited API Keys, 50MB file upload, 300 req/min
 * - Agency: Unlimited Workspaces, Unlimited API Keys, 100MB file upload, 1000 req/min
 */

export const PLANS = {
  hobby: {
    id: "hobby",
    name: "Hobby",
    maxPortfolios: 1,
    maxApiKeysPerPortfolio: 1,
    maxUploadSizeBytes: 5 * 1024 * 1024, // 5MB
    rateLimitPerMin: 60,
  },
  pro: {
    id: "pro",
    name: "Developer Pro",
    maxPortfolios: 5,
    maxApiKeysPerPortfolio: 50,
    maxUploadSizeBytes: 50 * 1024 * 1024, // 50MB
    rateLimitPerMin: 300,
  },
  agency: {
    id: "agency",
    name: "Agency & Team",
    maxPortfolios: Infinity,
    maxApiKeysPerPortfolio: Infinity,
    maxUploadSizeBytes: 100 * 1024 * 1024, // 100MB
    rateLimitPerMin: 1000,
  },
};

export function getPlanConfig(planName = "hobby") {
  const normalized = String(planName || "").toLowerCase().trim();
  return PLANS[normalized] || PLANS.hobby;
}
