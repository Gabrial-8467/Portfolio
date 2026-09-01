import { Section } from '../models/Section.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const baseSection = (section) => ({
  _id: section._id,
  id: section._id,
  portfolioId: section.portfolio,
  key: section.key,
  label: section.label,
  content: section.content,
  order: section.order,
  isPublished: section.isPublished,
  createdAt: section.createdAt,
  updatedAt: section.updatedAt,
});

export const listSections = asyncHandler(async (req, res) => {
  const sections = await Section.find({ portfolio: req.portfolio._id })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return res.json({ success: true, data: sections.map(baseSection) });
});

export const getSection = asyncHandler(async (req, res) => {
  const section = await Section.findOne({
    _id: req.params.sectionId,
    portfolio: req.portfolio._id,
  }).lean();
  if (!section) throw new ApiError(404, 'Section not found');
  return res.json({ success: true, data: baseSection(section) });
});

export const createSection = asyncHandler(async (req, res) => {
  const { key, label, content, isPublished } = req.body;
  if (!key) throw new ApiError(400, 'Section key is required');

  const normalizedKey = key.toLowerCase();
  const existing = await Section.findOne({
    portfolio: req.portfolio._id,
    key: normalizedKey,
  });
  if (existing) throw new ApiError(409, `Section "${normalizedKey}" already exists`);

  const maxOrder = await Section.findOne({ portfolio: req.portfolio._id })
    .sort({ order: -1 })
    .select('order')
    .lean();
  const section = await Section.create({
    portfolio: req.portfolio._id,
    key: normalizedKey,
    label: label || '',
    content: content ?? null,
    isPublished: isPublished ?? true,
    order: (maxOrder?.order ?? 0) + 1,
  });

  return res.status(201).json({ success: true, data: baseSection(section) });
});

export const updateSection = asyncHandler(async (req, res) => {
  const section = await Section.findOne({
    _id: req.params.sectionId,
    portfolio: req.portfolio._id,
  });
  if (!section) throw new ApiError(404, 'Section not found');

  const { key, label, content, isPublished, order } = req.body;

  if (key !== undefined && key.toLowerCase() !== section.key) {
    const conflict = await Section.findOne({
      portfolio: req.portfolio._id,
      key: key.toLowerCase(),
      _id: { $ne: section._id },
    });
    if (conflict) throw new ApiError(409, `Section "${key.toLowerCase()}" already exists`);
    section.key = key.toLowerCase();
  }
  if (label !== undefined) section.label = label;
  if (content !== undefined) {
    section.content = content;
    section.markModified('content');
  }
  if (isPublished !== undefined) section.isPublished = isPublished;
  if (order !== undefined) section.order = order;

  await section.save();
  return res.json({ success: true, data: baseSection(section) });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const section = await Section.findOneAndDelete({
    _id: req.params.sectionId,
    portfolio: req.portfolio._id,
  });
  if (!section) throw new ApiError(404, 'Section not found');
  return res.json({ success: true, data: { id: section._id } });
});

export const updateSectionsOrder = asyncHandler(async (req, res) => {
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