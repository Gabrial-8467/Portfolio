import { Router } from 'express';
import { listMyKeys, createKey, revokeKey } from '../controllers/apiKeyController.js';

const router = Router();

router.get('/', listMyKeys);
router.post('/', createKey);
router.delete('/:id', revokeKey);

export default router;