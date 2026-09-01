import { Router } from 'express';
import { getPublicPortfolio, getPublicSection } from '../controllers/publicController.js';

const router = Router();

router.get('/:slug', getPublicPortfolio);
router.get('/:slug/section/:key', getPublicSection);

export default router;