import { rateLimit } from 'express-rate-limit';
import { NODE_ENV } from './config.js';

// General API rate limit (all /api routes). Keeps a single admin/site from
// hammering the file store. Generous enough for normal browsing + dashboard use.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Dedicated strict brute-force protection for login attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 10, // Max 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

// Stricter limiter for write operations to deter abuse.
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, please slow down.' },
});

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  if (NODE_ENV === 'production') {
    return res.status(status >= 500 ? 500 : status).json({
      error: status >= 500 ? 'Internal server error' : (err.message || 'Request failed'),
    });
  }
  console.error('[error]', err);
  res.status(status).json({ error: err.message || 'Internal server error' });
}
