import { ApiKey } from '../models/ApiKey.js';
import { Portfolio } from '../models/Portfolio.js';
import { generateApiKey } from '../utils/apiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const baseKey = (key) => ({
  _id: key._id,
  id: key._id,
  portfolioId: key.portfolio,
  name: key.name,
  prefix: key.prefix,
  isActive: key.isActive,
  lastUsedAt: key.lastUsedAt,
  createdAt: key.createdAt,
  updatedAt: key.updatedAt,
});

export const listMyKeys = asyncHandler(async (req, res) => {
  const keys = await ApiKey.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();
  const portfolios = await Portfolio.find({ owner: req.user._id }).select('_id name slug').lean();
  const nameById = new Map(portfolios.map((p) => [String(p._id), p.name]));

  return res.json({
    success: true,
    data: keys.map((k) => ({ ...baseKey(k), portfolioName: nameById.get(String(k.portfolio)) || '' })),
  });
});

export const createKey = asyncHandler(async (req, res) => {
  const { portfolioId, name } = req.body;
  if (!portfolioId) throw new ApiError(400, 'portfolioId is required');

  const portfolio = await Portfolio.findOne({ _id: portfolioId, owner: req.user._id });
  if (!portfolio) throw new ApiError(403, 'You do not have access to this portfolio');

  const { key, prefix, keyHash } = generateApiKey();
  const doc = await ApiKey.create({
    owner: req.user._id,
    portfolio: portfolio._id,
    name: name?.trim() || `${portfolio.name} key`,
    prefix,
    keyHash,
  });

  return res.status(201).json({
    success: true,
    data: { key, apiKey: baseKey(doc) },
  });
});

export const revokeKey = asyncHandler(async (req, res) => {
  const key = await ApiKey.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!key) throw new ApiError(404, 'API key not found');

  await key.deleteOne();
  return res.json({ success: true, data: { id: key._id } });
});