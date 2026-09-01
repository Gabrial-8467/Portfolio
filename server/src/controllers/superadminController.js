import { User } from '../models/User.js';
import { Portfolio } from '../models/Portfolio.js';
import { asyncHandler } from '../middleware/errorHandler.js';

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 50));
  return { page, limit, skip: (page - 1) * limit };
}

export const listAllPortfolios = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const [total, portfolios] = await Promise.all([
    Portfolio.countDocuments(),
    Portfolio.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);
  return res.json({
    success: true,
    data: portfolios,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const listAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);
  return res.json({
    success: true,
    data: users,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});