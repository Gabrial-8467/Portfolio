import { Router } from 'express';
import { requireApiKey } from '../middleware/apiKeyAuth.js';
import { sanitize, validators } from '../middleware/validate.js';
import { uploadImage } from '../config/uploads.js';
import { guardApiKeyQuota, guardUploadQuota } from '../middleware/quotaGuard.js';
import { tenantRateLimiter } from '../middleware/tenantRateLimiter.js';
import {
  getPortfolio,
  getPortfolioFull,
  getSection,
  listSections,
  updatePortfolio,
  getSettings,
  updateSettings,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  listKeys,
  createKey,
  revokeKey,
  uploadFile,
  deleteFile,
  listUploads,
} from '../controllers/v1Controller.js';

const router = Router();

const portfolioFields = {
  name: validators.str(200),
  settings: validators.jsonContent,
  isActive: validators.bool,
};

const settingsFields = { settings: validators.jsonContent };

const sectionFields = {
  key: validators.slug,
  label: validators.str(200),
  content: validators.jsonContent,
  isPublished: validators.bool,
  order: validators.num,
};

router.use(requireApiKey);
router.use(tenantRateLimiter);

router.get('/portfolio', getPortfolio);
router.get('/portfolio/full', getPortfolioFull);
router.get('/portfolio/settings', getSettings);
router.put('/portfolio', sanitize(portfolioFields), updatePortfolio);
router.put('/portfolio/settings', sanitize(settingsFields), updateSettings);

router.get('/sections', listSections);
router.post('/section', sanitize(sectionFields), createSection);
router.get('/section/:key', getSection);
router.put('/section/:key', sanitize(sectionFields), updateSection);
router.delete('/section/:key', deleteSection);
router.put('/sections/reorder', sanitize({ ids: validators.strArr(200, 200) }), reorderSections);

router.get('/api-keys', listKeys);
router.post('/api-keys', guardApiKeyQuota, sanitize({ name: validators.str(100) }), createKey);
router.delete('/api-keys/:id', revokeKey);

router.post('/upload', uploadImage.single('file'), guardUploadQuota, uploadFile);
router.get('/uploads', listUploads);
router.delete('/upload/:filename', deleteFile);

export default router;
