import { User } from '../models/User.js';
import { Portfolio } from '../models/Portfolio.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const listAllPortfolios = asyncHandler(async (req, res) => {
  const portfolios = await Portfolio.find().sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: portfolios });
});

export const listAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: users });
});