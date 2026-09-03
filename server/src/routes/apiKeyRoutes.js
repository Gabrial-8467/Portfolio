import { Router } from 'express';
import { listMyKeys, createKey, revokeKey } from '../controllers/apiKeyController.js';
import { guardApiKeyQuota } from '../middleware/quotaGuard.js';

const router = Router();

router.get('/', listMyKeys);
router.post('/', guardApiKeyQuota, createKey);
router.delete('/:id', revokeKey);

export default router;