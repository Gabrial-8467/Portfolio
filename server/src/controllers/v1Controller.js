import { Section } from '../models/Section.js';
import { ApiKey } from '../models/ApiKey.js';
import { Upload } from '../models/Upload.js';
import path from 'node:path';
import fs from 'node:fs';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { generateApiKey } from '../utils/apiKey.js';
import { uploadsDir, imageUrl } from '../config/uploads.js';

const basePortfolio = (p) => ({
  _id: p._id,
  id: p._id,
  slug: p.slug,
  name: p.name,
  settings: p.settings || {},
  isActive: p.isActive,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

const baseSection = (s) => ({
  _id: s._id,
  id: s._id,
  portfolioId: s.portfolio,
  key: s.key,
  label: s.label,
  content: s.content,
  order: s.order,
  isPublished: s.isPublished,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

const serializePublicSection = (s) => ({
  key: s.key,
  label: s.label,
  content: s.content,
  order: s.order,
  updatedAt: s.updatedAt,
});

export const getPortfolioFull = asyncHandler(async (req, res) => {
  const sections = await Section.find({ portfolio: req.portfolio._id })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return res.json({
    success: true,
    data: {
      ...basePortfolio(req.portfolio),
      sections: sections.map(baseSection),
    },
  });
});

export const getPortfolio = asyncHandler(async (req, res) => {
  const sections = await Section.find({ portfolio: req.portfolio._id, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return res.json({
    success: true,
    data: {
      slug: req.portfolio.slug,
      name: req.portfolio.name,
      config: req.portfolio.settings || {},
      sections: sections.map(serializePublicSection),
    },
  });
});

export const getSection = asyncHandler(async (req, res) => {
  const key = String(req.params.key || '').toLowerCase();
  const section = await Section.findOne({
    portfolio: req.portfolio._id,
    key,
  }).lean();
  if (!section) throw new ApiError(404, `Section "${key}" not found`);
  return res.json({ success: true, data: baseSection(section) });
});

export const listSections = asyncHandler(async (req, res) => {
  const sections = await Section.find({ portfolio: req.portfolio._id })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return res.json({ success: true, data: sections.map(baseSection) });
});

export const updatePortfolio = asyncHandler(async (req, res) => {
  const { name, settings, isActive } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) throw new ApiError(400, 'Portfolio name is required');
    req.portfolio.name = name.trim();
  }
  if (isActive !== undefined) req.portfolio.isActive = !!isActive;
  if (settings !== undefined) {
    req.portfolio.settings = settings || {};
    req.portfolio.markModified('settings');
  }

  await req.portfolio.save();
  return res.json({ success: true, data: basePortfolio(req.portfolio) });
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

export const createSection = asyncHandler(async (req, res) => {
  const { key, label, content, isPublished, order } = req.body;
  if (!key) throw new ApiError(400, 'Section key is required');

  const normalizedKey = String(key).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(normalizedKey)) {
    throw new ApiError(400, 'Section key may only contain lowercase letters, numbers, and hyphens');
  }

  const existing = await Section.findOne({ portfolio: req.portfolio._id, key: normalizedKey });
  if (existing) throw new ApiError(409, `Section "${normalizedKey}" already exists`);

  const maxOrder = await Section.findOne({ portfolio: req.portfolio._id })
    .sort({ order: -1 })
    .select('order')
    .lean();
  const orderNum = Number(order);
  const nextOrder = (maxOrder?.order ?? 0) + 1;

  const section = await Section.create({
    portfolio: req.portfolio._id,
    key: normalizedKey,
    label: label || '',
    content: content ?? null,
    isPublished: isPublished ?? true,
    order: Number.isFinite(orderNum) ? orderNum : nextOrder,
  });

  return res.status(201).json({ success: true, data: baseSection(section) });
});

export const updateSection = asyncHandler(async (req, res) => {
  const key = String(req.params.key || '').toLowerCase();
  const section = await Section.findOne({ portfolio: req.portfolio._id, key });
  if (!section) throw new ApiError(404, `Section "${key}" not found`);

  const { key: newKey, label, content, isPublished, order } = req.body;

  if (newKey !== undefined && String(newKey).toLowerCase() !== section.key) {
    const conflict = await Section.findOne({
      portfolio: req.portfolio._id,
      key: String(newKey).toLowerCase(),
      _id: { $ne: section._id },
    });
    if (conflict) throw new ApiError(409, `Section "${String(newKey).toLowerCase()}" already exists`);
    section.key = String(newKey).toLowerCase();
  }
  if (label !== undefined) section.label = label;
  if (content !== undefined) {
    section.content = content;
    section.markModified('content');
  }
  if (isPublished !== undefined) section.isPublished = !!isPublished;
  if (order !== undefined) section.order = order;

  await section.save();
  return res.json({ success: true, data: baseSection(section) });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const key = String(req.params.key || '').toLowerCase();
  const section = await Section.findOneAndDelete({ portfolio: req.portfolio._id, key });
  if (!section) throw new ApiError(404, `Section "${key}" not found`);
  return res.json({ success: true, data: { id: section._id } });
});

export const reorderSections = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) throw new ApiError(400, 'ids array is required');

  const owned = await Section.find({ portfolio: req.portfolio._id }).sort({ order: 1 }).lean();
  const ownedIds = new Set(owned.map((s) => String(s._id)));
  const validIds = [...new Set(ids.map((id) => String(id)))];

  if (validIds.some((id) => !ownedIds.has(id))) {
    throw new ApiError(400, 'Cannot reorder sections you do not own');
  }

  const normalized = [
    ...validIds,
    ...owned.map((s) => String(s._id)).filter((id) => !validIds.includes(id)),
  ];

  const ops = normalized.map((id, index) => ({
    updateOne: { filter: { _id: id, portfolio: req.portfolio._id }, update: { $set: { order: index + 1 } } },
  }));

  if (ops.length) await Section.bulkWrite(ops);

  const sections = await Section.find({ portfolio: req.portfolio._id }).sort({ order: 1 }).lean();
  return res.json({ success: true, data: sections.map(baseSection) });
});

export const listKeys = asyncHandler(async (req, res) => {
  const keys = await ApiKey.find({ portfolio: req.portfolio._id }).sort({ createdAt: -1 }).lean();
  return res.json({
    success: true,
    data: keys.map((k) => ({
      _id: k._id,
      id: k._id,
      portfolioId: k.portfolio,
      name: k.name,
      prefix: k.prefix,
      isActive: k.isActive,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
    })),
  });
});

export const createKey = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const keyName = typeof name === 'string' ? name.trim() : '';
  const { key, prefix, keyHash } = generateApiKey();
  const owner = (req.apiKey && req.apiKey.owner) || (req.user && req.user._id);
  if (!owner) throw new ApiError(401, 'Authentication required');
  const doc = await ApiKey.create({
    owner,
    portfolio: req.portfolio._id,
    name: keyName || `${req.portfolio.name} key`,
    prefix,
    keyHash,
  });

  return res.status(201).json({
    success: true,
    data: {
      key,
      apiKey: {
        _id: doc._id,
        id: doc._id,
        portfolioId: doc.portfolio,
        name: doc.name,
        prefix: doc.prefix,
        isActive: doc.isActive,
        lastUsedAt: doc.lastUsedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    },
  });
});

export const revokeKey = asyncHandler(async (req, res) => {
  const key = await ApiKey.findOne({
    _id: req.params.id,
    portfolio: req.portfolio._id,
  });
  if (!key) throw new ApiError(404, 'API key not found');
  await key.deleteOne();
  return res.json({ success: true, data: { id: key._id } });
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const owner = (req.apiKey && req.apiKey.owner) || (req.user && req.user._id);
  if (!owner) throw new ApiError(401, 'Authentication required');

  const upload = await Upload.create({
    owner,
    portfolio: req.portfolio._id,
    filename: req.file.filename,
    originalName: req.file.originalname || req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });

  const url = imageUrl(req.file.filename);
  return res.status(201).json({
    success: true,
    data: {
      id: upload._id,
      url,
      filename: req.file.filename,
      originalName: req.file.originalname || req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: upload.createdAt,
    },
  });
});

export const listUploads = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ portfolio: req.portfolio._id })
    .sort({ createdAt: -1 })
    .lean();

  const data = uploads.map((u) => ({
    id: u._id,
    url: imageUrl(u.filename),
    filename: u.filename,
    originalName: u.originalName || u.filename,
    size: u.size,
    mimeType: u.mimetype,
    uploadedAt: u.createdAt,
  }));

  return res.json({ success: true, data });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const safe = path.basename(req.params.filename || '');
  if (!safe || safe === '.' || safe === '..' || !safe.includes('.')) {
    throw new ApiError(400, 'Invalid filename');
  }

  const owner = (req.apiKey && req.apiKey.owner) || (req.user && req.user._id);
  if (!owner) throw new ApiError(401, 'Authentication required');

  // Enforce ownership: only the owner (or scoped portfolio) may delete this file.
  const upload = await Upload.findOne({
    filename: safe,
    owner,
    portfolio: req.portfolio._id,
  });
  if (!upload) throw new ApiError(404, 'File not found');

  const filePath = path.join(uploadsDir, safe);
  if (!filePath.startsWith(uploadsDir + path.sep)) {
    throw new ApiError(400, 'Invalid filename');
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') throw new ApiError(404, 'File not found');
    throw err;
  }

  await Upload.deleteOne({ _id: upload._id });

  return res.json({ success: true, data: { filename: safe } });
});
