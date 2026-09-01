import { User } from '../models/User.js';
import { Portfolio } from '../models/Portfolio.js';
import { ApiKey } from '../models/ApiKey.js';
import { signToken } from '../middleware/auth.js';
import { generateApiKey } from '../utils/apiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { slugify } from '../utils/slugify.js';
import { logger } from '../utils/logger.js';

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