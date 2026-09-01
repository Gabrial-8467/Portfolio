import { Portfolio } from '../models/Portfolio.js';
import { Section } from '../models/Section.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

export const getPublicPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!portfolio) throw new ApiError(404, 'Portfolio not found');

  const sections = await Section.find({ portfolio: portfolio._id, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return res.json({
    success: true,
    data: {
      slug: portfolio.slug,
      name: portfolio.name,
      config: portfolio.settings || {},
      sections: sections.map((s) => ({
        key: s.key,
        label: s.label,
        content: s.content,
        order: s.order,
        updatedAt: s.updatedAt,
      })),
    },
  });
});

export const getPublicSection = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!portfolio) throw new ApiError(404, 'Portfolio not found');

  const section = await Section.findOne({
    portfolio: portfolio._id,
    key: req.params.key,
    isPublished: true,
  }).lean();
  if (!section) throw new ApiError(404, `Section "${req.params.key}" not found`);

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