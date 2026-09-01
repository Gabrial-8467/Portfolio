import { Router } from 'express';
import { login, register, me } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';
import { sanitize, validators } from '../middleware/validate.js';

const router = Router();

router.post(
  '/login',
  sanitize({ email: validators.str, password: validators.str }),
  login
);
router.post(
  '/register',
  sanitize({
    email: validators.str,
    password: validators.str,
    name: validators.str(100),
    portfolioName: validators.str(200),
  }),
  register
);
router.get('/me', authRequired, me);

export default router;