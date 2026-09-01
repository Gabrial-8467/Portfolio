import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  // Extract a clean body summary for mutations (with sensitive keys redacted)
  let bodySummary = '';
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && typeof req.body === 'object') {
    const keys = Object.keys(req.body);
    if (keys.length > 0) {
      const sanitized = {};
      for (const k of keys.slice(0, 5)) {
        if (/password|secret|token|apiKey/i.test(k)) {
          sanitized[k] = '***';
        } else if (typeof req.body[k] === 'string' && req.body[k].length > 40) {
          sanitized[k] = `${req.body[k].slice(0, 37)}...`;
        } else {
          sanitized[k] = req.body[k];
        }
      }
      bodySummary = JSON.stringify(sanitized);
    }
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const meta = {};
    if (req.user?.email) {
      meta.user = req.user.email;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer pk_')) {
      meta.apiKey = `${authHeader.slice(7, 18)}...`;
    }
    if (bodySummary) {
      meta.bodySummary = bodySummary;
    }

    logger.http(method, originalUrl, statusCode, duration, meta);
  });

  next();
};
