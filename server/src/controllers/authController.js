import { User } from '../models/User.js';
import { Portfolio } from '../models/Portfolio.js';
import { Section } from '../models/Section.js';
import { ApiKey } from '../models/ApiKey.js';
import { Upload } from '../models/Upload.js';
import path from 'node:path';
import fs from 'node:fs';
import { uploadsDir } from '../config/uploads.js';
import { signToken } from '../middleware/auth.js';
import { generateApiKey } from '../utils/apiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { slugify } from '../utils/slugify.js';
import { logger } from '../utils/logger.js';
import { getPlanConfig } from '../config/plans.js';

async function createUniqueSlug(base) {
  const slug = slugify(base) || 'portfolio';
  let candidate = slug;
  let suffix = 2;
  while (await Portfolio.exists({ slug: candidate })) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  user.lastLogin = new Date();
  await user.save();

  logger.auth(`User logged in: ${user.email} (${user.name})`);

  const portfolios = await Portfolio.find({ owner: user._id }).sort({ createdAt: 1 }).lean();
  const token = signToken(user);
  return res.json({
    success: true,
    data: { token, user: user.toSafeObject(), portfolios },
  });
});

export const register = asyncHandler(async (req, res) => {
  const { email, password, name, portfolioName } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');
  if (String(password).length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
  if (!name) throw new ApiError(400, 'Name is required');

  const exists = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (exists) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ email, password, name, role: 'admin' });

  try {
    const slug = await createUniqueSlug(portfolioName || name);
    const portfolio = await Portfolio.create({
      slug,
      name: (portfolioName || name).trim(),
      owner: user._id,
    });

    const { key, prefix, keyHash } = generateApiKey();
    await ApiKey.create({
      owner: user._id,
      portfolio: portfolio._id,
      name: `${portfolio.name} key`,
      prefix,
      keyHash,
    });

    logger.auth(`New user registered: ${user.email} -> Portfolio: "${portfolio.name}" (${slug})`);

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      data: {
        token,
        user: user.toSafeObject(),
        portfolios: [portfolio],
        apiKey: key,
      },
    });
  } catch (err) {
    await Promise.allSettled([
      ApiKey.deleteMany({ owner: user._id }),
      Portfolio.deleteMany({ owner: user._id }),
      User.findByIdAndDelete(user._id),
    ]);
    throw err;
  }
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');
  const portfolios = await Portfolio.find({ owner: user._id }).sort({ createdAt: 1 }).lean();
  return res.json({ success: true, data: { user: user.toSafeObject(), portfolios } });
});

/**
 * Change the authenticated user's password (requires current password).
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }
  if (String(newPassword).length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters');
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  // Users without a password (OAuth-only accounts) cannot use password auth.
  if (!user.password) {
    throw new ApiError(400, 'This account uses GitHub sign-in and has no password set');
  }

  const match = await user.comparePassword(currentPassword);
  if (!match) throw new ApiError(401, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  logger.auth('Password changed for user: ' + user.email);
  return res.json({ success: true, message: 'Password updated successfully' });
});

/**
 * Permanently delete the authenticated user's account and all associated data.
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  // For accounts with a password, require it to confirm deletion.
  if (user.password) {
    if (!password) throw new ApiError(400, 'Password is required to delete your account');
    const match = await user.comparePassword(password);
    if (!match) throw new ApiError(401, 'Password is incorrect');
  }

  const portfolios = await Portfolio.find({ owner: user._id }).select('_id').lean();
  const portfolioIds = portfolios.map((p) => p._id);

  const uploads = await Upload.find({
    $or: [{ owner: user._id }, { portfolio: { $in: portfolioIds } }],
  }).select('filename').lean();

  await Promise.all([
    ApiKey.deleteMany({ owner: user._id }),
    Section.deleteMany({ portfolio: { $in: portfolioIds } }),
    Portfolio.deleteMany({ owner: user._id }),
    Upload.deleteMany({ owner: user._id }),
    User.findByIdAndDelete(user._id),
  ]);

  // Best-effort cleanup of uploaded files on disk.
  await Promise.allSettled(
    uploads.map((u) => {
      const safe = path.basename(u.filename || '');
      const filePath = path.join(uploadsDir, safe);
      if (safe && filePath.startsWith(uploadsDir + path.sep)) {
        return fs.promises.unlink(filePath);
      }
      return Promise.resolve();
    })
  );

  logger.auth('Account deleted: ' + user.email);
  return res.json({ success: true, message: 'Account deleted successfully' });
});

/**
 * Return the user's current plan, quota limits, and current usage.
 */
export const planStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select('plan email name').lean();
  if (!user) throw new ApiError(404, 'User not found');

  const planName = user.plan || 'hobby';
  const plan = getPlanConfig(planName);

  const portfolioCount = await Portfolio.countDocuments({ owner: userId });
  const portfolioIds = await Portfolio.find({ owner: userId }).select('_id').lean();
  const portfolioIdList = portfolioIds.map((p) => p._id);
  const apiKeyCount = await ApiKey.countDocuments({ owner: userId });

  return res.json({
    success: true,
    data: {
      plan: planName,
      planName: plan.name,
      limits: {
        maxPortfolios: plan.maxPortfolios === Infinity ? 'Unlimited' : plan.maxPortfolios,
        maxApiKeysPerPortfolio:
          plan.maxApiKeysPerPortfolio === Infinity ? 'Unlimited' : plan.maxApiKeysPerPortfolio,
        maxUploadSizeBytes: plan.maxUploadSizeBytes,
        rateLimitPerMin: plan.rateLimitPerMin,
      },
      usage: {
        portfolios: portfolioCount,
        totalApiKeys: apiKeyCount,
        apiKeysPerPortfolio: portfolioIdList.length
          ? await Promise.all(
              portfolioIdList.map(async (pid) => ({
                portfolioId: pid,
                count: await ApiKey.countDocuments({ portfolio: pid }),
              }))
            )
          : [],
      },
    },
  });
});