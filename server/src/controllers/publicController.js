import { Section } from '../models/Section.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

function serializeSections(sections) {
  return sections.map((s) => ({
    key: s.key,
    label: s.label,
    content: s.content,
    order: s.order,
    updatedAt: s.updatedAt,
  }));
}

export const getPortfolioByKey = asyncHandler(async (req, res) => {
  const sections = await Section.find({ portfolio: req.portfolio._id, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return res.json({
    success: true,
    data: {
      slug: req.portfolio.slug,
      name: req.portfolio.name,
      config: req.portfolio.settings || {},
      sections: serializeSections(sections),
    },
  });
});

export const getSectionByKey = asyncHandler(async (req, res) => {
  const key = String(req.params.key || '').toLowerCase();
  const section = await Section.findOne({
    portfolio: req.portfolio._id,
    key,
    isPublished: true,
  }).lean();
  if (!section) throw new ApiError(404, `Section "${key}" not found`);

  return res.json({
    success: true,
    data: {
      key: section.key,
      label: section.label,
      content: section.content,
      order: section.order,
      updatedAt: section.updatedAt,
    },
  });
});