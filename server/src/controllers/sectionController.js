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

  const existing = await Section.findOne({
    portfolio: req.portfolio._id,
    key,
  });
  if (existing) throw new ApiError(409, `Section "${key}" already exists`);

  const count = await Section.countDocuments({ portfolio: req.portfolio._id });
  const section = await Section.create({
    portfolio: req.portfolio._id,
    key: key.toLowerCase(),
    label: label || '',
    content: content ?? null,
    isPublished: isPublished ?? true,
    order: count + 1,
  });

  await section.save();
  return res.status(201).json({ success: true, data: baseSection(section) });
});

export const updateSection = asyncHandler(async (req, res) => {
  const section = await Section.findOne({
    _id: req.params.sectionId,
    portfolio: req.portfolio._id,
  });
  if (!section) throw new ApiError(404, 'Section not found');

  const { key, label, content, isPublished, order } = req.body;

  if (key !== undefined && key !== section.key) {
    const conflict = await Section.findOne({ portfolio: req.portfolio._id, key: key.toLowerCase() });
    if (conflict) throw new ApiError(409, `Section "${key}" already exists`);
    section.key = key.toLowerCase();
  }
  if (label !== undefined) section.label = label;
  if (content !== undefined) section.content = content;
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

  const owned = await Section.find({ portfolio: req.portfolio._id }).select('_id').lean();
  const ownedIds = new Set(owned.map((s) => String(s._id)));
  const validIds = ids.map((id) => String(id));

  if (validIds.some((id) => !ownedIds.has(id))) {
    throw new ApiError(400, 'Cannot reorder sections you do not own');
  }

  const ops = validIds.map((id, index) => ({
    updateOne: { filter: { _id: id, portfolio: req.portfolio._id }, update: { $set: { order: index + 1 } } },
  }));

  if (ops.length) await Section.bulkWrite(ops);

  const sections = await Section.find({ portfolio: req.portfolio._id }).sort({ order: 1 }).lean();
  return res.json({ success: true, data: sections.map(baseSection) });
});