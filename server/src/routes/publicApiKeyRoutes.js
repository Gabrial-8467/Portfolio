import { Router } from 'express';
import { requireApiKey } from '../middleware/apiKeyAuth.js';
import { getPortfolioByKey, getSectionByKey } from '../controllers/publicController.js';

const router = Router();

router.get('/portfolio', requireApiKey, getPortfolioByKey);
router.get('/section/:key', requireApiKey, getSectionByKey);

export default router;