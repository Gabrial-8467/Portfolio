import { User } from "../models/User.js";
import { Portfolio } from "../models/Portfolio.js";
import { ApiKey } from "../models/ApiKey.js";
import { signToken } from "../middleware/auth.js";
import { generateApiKey } from "../utils/apiKey.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import { config } from "../config/env.js";
import { slugify } from "../utils/slugify.js";
import { logger } from "../utils/logger.js";

const ALLOWED_REDIRECT_ORIGINS = [config.clientAdminUrl, config.clientLandingUrl, config.serverUrl].filter(Boolean);

function isAllowedRedirectUrl(urlString) {
  try {
    const url = new URL(urlString);
    return ALLOWED_REDIRECT_ORIGINS.some((allowed) => {
      const allowedUrl = new URL(allowed);
      return url.origin === allowedUrl.origin;
    });
  } catch {
    return false;
  }
}

async function createUniqueSlug(base) {
  const slug = slugify(base) || "portfolio";
  let candidate = slug;
  let suffix = 2;
  while (await Portfolio.exists({ slug: candidate })) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

/**
 * 1. Redirect to GitHub OAuth Authorization Page
 */
export const githubLoginRedirect = (req, res) => {
  if (!config.githubClientId) {
    throw new ApiError(500, "GITHUB_CLIENT_ID is not configured on the server");
  }
  const returnTo = req.query.return_to || req.headers.referer || config.clientAdminUrl;
  const redirectUri = `${config.serverUrl}/api/auth/github/callback`;
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=user:email&state=${encodeURIComponent(returnTo)}`;
  return res.redirect(githubUrl);
};

/**
 * 2. Handle GitHub OAuth Callback
 */
export const githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw new ApiError(400, "Authorization code is missing");

  // Exchange code for access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (tokenData.error || !tokenData.access_token) {
    throw new ApiError(400, `GitHub OAuth failed: ${tokenData.error_description || tokenData.error}`);
  }

  // Fetch GitHub User profile
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "Portfolio-CMS-OAuth",
    },
  });
  const ghProfile = await userResponse.json();

  // If email is private, fetch emails list
  let userEmail = ghProfile.email;
  if (!userEmail) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "Portfolio-CMS-OAuth",
      },
    });
    const emails = await emailsRes.json();
    const primary = Array.isArray(emails) ? emails.find((e) => e.primary && e.verified) || emails[0] : null;
    userEmail = primary?.email;
  }

  if (!userEmail) {
    throw new ApiError(400, "Unable to retrieve verified email from GitHub account");
  }

  const normalizedEmail = userEmail.trim().toLowerCase();
  const ghIdStr = String(ghProfile.id);

  // 1. First search by exact GitHub ID
  let user = await User.findOne({ githubId: ghIdStr });

  // 2. If not found by GitHub ID, check by email
  if (!user) {
    const existingByEmail = await User.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      // If found by email and has no githubId or matches, link it
      if (!existingByEmail.githubId) {
        existingByEmail.githubId = ghIdStr;
        user = existingByEmail;
      } else if (existingByEmail.githubId === ghIdStr) {
        user = existingByEmail;
      }
    }
  }

  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = await User.create({
      email: normalizedEmail,
      name: ghProfile.name || ghProfile.login || "Developer",
      githubId: ghIdStr,
      avatar: ghProfile.avatar_url || "",
      role: "admin",
      plan: "hobby",
    });

    // Auto-create initial portfolio & API key
    const slug = await createUniqueSlug(user.name);
    const portfolio = await Portfolio.create({
      slug,
      name: user.name + " Portfolio",
      owner: user._id,
    });

    const { key: apiKey, prefix, keyHash } = generateApiKey();
    await ApiKey.create({
      owner: user._id,
      portfolio: portfolio._id,
      name: portfolio.name + " key",
      prefix,
      keyHash,
    });

    logger.auth("New user signed up via GitHub: " + user.email + " (" + ghProfile.login + ")");
  } else {
    // Update existing user with avatar and last login
    if (!user.githubId) user.githubId = ghIdStr;
    if (!user.avatar && ghProfile.avatar_url) user.avatar = ghProfile.avatar_url;
    user.lastLogin = new Date();
    await user.save();
    logger.auth("User logged in via GitHub: " + user.email);
  }

  const token = signToken(user);

  // Set auth cookie on the server response so root domains can access it
  res.cookie('portfolio_admin_token', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  });

  // Redirect back to target URL (landing or admin) — validate against allowed origins
  let targetUrl = config.clientAdminUrl + '/login';
  if (req.query.state) {
    try {
      const decoded = decodeURIComponent(req.query.state);
      if (isAllowedRedirectUrl(decoded)) {
        targetUrl = decoded;
      }
    } catch {
      /* ignore — fall back to default */
    }
  }

  const clientRedirectUrl = new URL(targetUrl);
  clientRedirectUrl.searchParams.set("oauth_token", token);
  clientRedirectUrl.searchParams.set("provider", "github");
  if (isNewUser) {
    clientRedirectUrl.searchParams.set("is_new", "true");
    clientRedirectUrl.searchParams.set("api_key", apiKey);
  }

  return res.redirect(clientRedirectUrl.toString());
});
