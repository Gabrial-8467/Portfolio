import { Portfolio } from '../models/Portfolio.js';
import { Section } from '../models/Section.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { slugify } from '../utils/slugify.js';

const basePortfolio = (portfolio) => ({
  _id: portfolio._id,
  id: portfolio._id,
  slug: portfolio.slug,
  name: portfolio.name,
  settings: portfolio.settings || {},
  isActive: portfolio.isActive,
  createdAt: portfolio.createdAt,
  updatedAt: portfolio.updatedAt,
});

export const listMine = asyncHandler(async (req, res) => {
  const portfolios = await Portfolio.find({ owner: req.user._id }).sort({ createdAt: 1 }).lean();
  return res.json({ success: true, data: portfolios.map(basePortfolio) });
});

export const getMine = asyncHandler(async (req, res) => {
  return res.json({ success: true, data: basePortfolio(req.portfolio) });
});

export const createPortfolio = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  if (!name) throw new ApiError(400, 'Portfolio name is required');

  const baseSlug = slug || slugify(name);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(baseSlug)) {
    throw new ApiError(400, 'Slug may only contain lowercase letters, numbers, and hyphens');
  }
  let candidate = baseSlug;
  let suffix = 2;
  while (await Portfolio.exists({ slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const portfolio = await Portfolio.create({
    slug: candidate,
    name: name.trim(),
    owner: req.user._id,
  });

  return res.status(201).json({ success: true, data: basePortfolio(portfolio) });
});

export const updatePortfolio = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  if (name !== undefined) req.portfolio.name = name.trim();
  if (isActive !== undefined) req.portfolio.isActive = isActive;
  await req.portfolio.save();
  return res.json({ success: true, data: basePortfolio(req.portfolio) });
});

export const deletePortfolio = asyncHandler(async (req, res) => {
  await Section.deleteMany({ portfolio: req.portfolio._id });
  await Portfolio.findByIdAndDelete(req.portfolio._id);
  return res.json({ success: true, data: { id: req.portfolio._id } });
});

export const getSettings = asyncHandler(async (req, res) => {
  return res.json({ success: true, data: req.portfolio.settings || {} });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  req.portfolio.settings = settings || {};
  req.portfolio.markModified('settings');
  await req.portfolio.save();
  return res.json({ success: true, data: req.portfolio.settings });
});