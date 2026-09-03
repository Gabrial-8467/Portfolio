import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  register,
  me,
  changePassword,
  deleteAccount,
  planStatus,
} from '../controllers/authController.js';
import { githubLoginRedirect, githubCallback } from '../controllers/oauthController.js';
import { authRequired } from '../middleware/auth.js';
import { sanitize, validators } from '../middleware/validate.js';

const router = Router();

// Brute-force protection for credential endpoints only (not for /me, /plan,
// OAuth redirects, or authenticated account routes).
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts, please try again later' },
});

// Standard Password Authentication
router.post(
  '/login',
  credentialLimiter,
  sanitize({ email: validators.str, password: validators.str }),
  login
);
router.post(
  '/register',
  credentialLimiter,
  sanitize({
    email: validators.str,
    password: validators.str,
    name: validators.str(100),
    portfolioName: validators.str(200),
  }),
  register
);
router.get('/me', authRequired, me);
router.get('/plan', authRequired, planStatus);
router.post(
  '/change-password',
  authRequired,
  sanitize({
    currentPassword: validators.str,
    newPassword: validators.str,
  }),
  changePassword
);
router.post(
  '/delete-account',
  authRequired,
  sanitize({ password: validators.str }),
  deleteAccount
);

// GitHub OAuth Endpoints
router.get('/github', githubLoginRedirect);
router.get('/github/callback', githubCallback);

export default router;