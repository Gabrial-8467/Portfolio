import { Router } from 'express';
import { listAllPortfolios, listAllUsers } from '../controllers/superadminController.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireRole('superadmin'));

router.get('/portfolios', listAllPortfolios);
router.get('/users', listAllUsers);

export default router;