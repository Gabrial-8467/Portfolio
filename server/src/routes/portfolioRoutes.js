import { Router } from 'express';
import {
  listMine,
  getMine,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getSettings,
  updateSettings,
} from '../controllers/portfolioController.js';
import {
  listSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  updateSectionsOrder,
} from '../controllers/sectionController.js';
import { loadPortfolio } from '../middleware/auth.js';
import { sanitize, validators } from '../middleware/validate.js';

const router = Router();

const portfolioFields = {
  name: validators.str(200),
  slug: validators.slug,
  isActive: validators.bool,
};

router.get('/', listMine);
router.post('/', sanitize(portfolioFields), createPortfolio);

const settingsFields = { settings: validators.jsonContent };

router.get('/:portfolioId', loadPortfolio(), getMine);
router.put('/:portfolioId', loadPortfolio(), sanitize(portfolioFields), updatePortfolio);
router.delete('/:portfolioId', loadPortfolio(), deletePortfolio);
router.get('/:portfolioId/settings', loadPortfolio(), getSettings);
router.put(
  '/:portfolioId/settings',
  loadPortfolio(),
  sanitize(settingsFields),
  updateSettings
);

const sectionFields = {
  key: validators.slug,
  label: validators.str(200),
  content: validators.jsonContent,
  isPublished: validators.bool,
  order: validators.num,
};

router.get('/:portfolioId/sections', loadPortfolio(), listSections);
router.post('/:portfolioId/sections', loadPortfolio(), sanitize(sectionFields), createSection);
router.put(
  '/:portfolioId/sections/order/reorder',
  loadPortfolio(),
  sanitize({ ids: validators.strArr(200, 200) }),
  updateSectionsOrder
);
router.get('/:portfolioId/sections/:sectionId', loadPortfolio(), getSection);
router.put(
  '/:portfolioId/sections/:sectionId',
  loadPortfolio(),
  sanitize(sectionFields),
  updateSection
);
router.delete(
  '/:portfolioId/sections/:sectionId',
  loadPortfolio(),
  deleteSection
);

export default router;