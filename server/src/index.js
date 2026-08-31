import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PORT, NODE_ENV, COOKIE_SECRET, CORS_ORIGIN } from './config.js';
import { requireAuth, isAuthenticated } from './auth.js';
import { apiLimiter, authLimiter, writeLimiter, notFoundHandler, errorHandler } from './middleware.js';
import { collectionRouter } from './routes/collections.js';
import { siteRouter } from './routes/site.js';
import { authRouter } from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CLIENT_DIST_DIR = path.resolve(__dirname, '../../Portfolio/dist');

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

// Production Helmet configuration that hardens HTTP headers against attacks
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xContentTypeOptions: true,
    frameguard: { action: 'deny' },
    hsts: NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
  })
);

// Flexible CORS support (allows configured origins, all localhost origins, or custom domains)
const parsedOrigins = CORS_ORIGIN
  ? CORS_ORIGIN.split(',').map((s) => s.trim().replace(/\/$/, ''))
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (NODE_ENV !== 'production') return callback(null, true);
      if (parsedOrigins.includes('*') || parsedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive default for portfolio API requests
    },
    credentials: true,
  })
);

app.use(cookieParser(COOKIE_SECRET));
app.use(express.json({ limit: process.env.BODY_LIMIT || '256kb', strict: true }));

// Health check (public)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Dedicated strict brute-force protection on Auth endpoint
app.use('/api/auth', authLimiter, authRouter());

// Public API is rate-limited; writes on collections/site are additionally
// protected by the auth middleware + write limiter.
app.use('/api', apiLimiter);

app.use('/api/site', siteRouter(requireAuth));
app.use('/api/projects', collectionRouter('projects', requireAuth));
app.use('/api/skills', collectionRouter('skills', requireAuth));
app.use('/api/services', collectionRouter('services', requireAuth));
app.use('/api/experience', collectionRouter('experience', requireAuth));
app.use('/api/education', collectionRouter('education', requireAuth));
app.use('/api/achievements', collectionRouter('achievements', requireAuth));

// API 404 handler
app.use('/api', notFoundHandler);

// Admin dashboard static files. The login page and shared assets are public;
// all other dashboard pages require the admin auth cookie.
app.use('/dashboard/assets', express.static(path.join(PUBLIC_DIR, 'dashboard', 'assets')));
app.use('/dashboard/login', express.static(path.join(PUBLIC_DIR, 'dashboard', 'login.html')));

// Every other dashboard page requires the admin auth cookie.
app.use('/dashboard', (req, res, next) => {
  if (!isAuthenticated(req)) return res.redirect('/dashboard/login');
  return express.static(path.join(PUBLIC_DIR, 'dashboard'))(req, res, next);
});

// Serve frontend client build if present (Unified single-server production deployment)
if (existsSync(CLIENT_DIST_DIR)) {
  app.use(express.static(CLIENT_DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/dashboard')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST_DIR, 'index.html'));
  });
} else {
  // Fallback when frontend build is not generated yet
  app.get('/', (_req, res) => {
    res.redirect('/dashboard');
  });
}

// 404 + error handling for any remaining routes
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Portfolio API & Server is running at http://localhost:${PORT}`);
  console.log(` Admin CMS Dashboard:               http://localhost:${PORT}/dashboard`);
  console.log(` Environment:                        ${NODE_ENV}`);
  console.log(`======================================================\n`);
});
