import { timingSafeEqual, createHash } from 'node:crypto';
import { ADMIN_PASSWORD, ADMIN_USERNAME, COOKIE_SECRET, NODE_ENV } from './config.js';

const COOKIE_NAME = 'portfolio_admin';

// Constant-time hash of the password so the raw value is never stored/compared
// as plaintext in timing attacks.
function hash(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

const EXPECTED = hash(ADMIN_PASSWORD);

// Opaque token stored in the signed cookie. Signed by cookie-parser with the
// secret, so it cannot be forged without COOKIE_SECRET.
const TOKEN = hash(COOKIE_SECRET);

/** Returns true if the supplied password matches the configured admin password. */
export function verifyPassword(password) {
  if (typeof password !== 'string') return false;
  const supplied = hash(password);
  const a = Buffer.from(supplied);
  const b = Buffer.from(EXPECTED);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Returns true if the request carries a valid admin cookie. */
export function isAuthenticated(req) {
  const token = req.signedCookies?.[COOKIE_NAME];
  if (token === undefined) return false;
  const a = Buffer.from(String(token));
  const b = Buffer.from(TOKEN);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Express middleware that blocks non-authenticated requests with 401. */
export function requireAuth(req, res, next) {
  if (isAuthenticated(req)) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

/** Sets the admin auth cookie on the response. */
export function setAuthCookie(res) {
  res.cookie(COOKIE_NAME, TOKEN, {
    httpOnly: true,
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    secure: NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/',
    signed: true,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    path: '/',
    signed: true,
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    secure: NODE_ENV === 'production',
  });
}

export { COOKIE_NAME, ADMIN_USERNAME };
