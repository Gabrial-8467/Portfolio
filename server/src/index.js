import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { uploadsDir } from './config/uploads.js';
import { authRequired } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/authRoutes.js';
import publicApiKeyRoutes from './routes/publicApiKeyRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import billingRoutes from './routes/billingRoutes.js';

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Security is enforced by authentication (API key / JWT), not CORS.
// All origins are allowed so any frontend can consume the API via credentials.
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-portfolio-id'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts, please try again later' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' },
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/v1', publicApiKeyRoutes);
app.use('/api/portfolios', authRequired, portfolioRoutes);
app.use('/api/api-keys', authRequired, apiKeyRoutes);
app.use('/api/uploads', authRequired, uploadRoutes);
app.use('/api/billing', billingRoutes);

// Favicon handler
app.get(['/favicon.ico', '/favicon.svg'], (_req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.svg'));
});

app.get('/', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.get('host') || `localhost:${config.port}`;
  const baseUrl = config.serverUrl || `${protocol}://${host}`;

  res.json({
    name: 'Portfolio CMS API',
    version: '1.0.0',
    status: 'online',
    baseUrl,
    endpoints: {
      health: '/health',
      portfolio: 'GET /api/v1/portfolio  (Authorization: Bearer <apiKey>)',
      section: 'GET /api/v1/section/:key  (Authorization: Bearer <apiKey>)',
      sections: 'GET /api/v1/sections  (Authorization: Bearer <apiKey>)',
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      v1OwnerApi: [
        'PUT /api/v1/portfolio',
        'GET /api/v1/portfolio/full',
        'GET /api/v1/portfolio/settings',
        'PUT /api/v1/portfolio/settings',
        'POST /api/v1/section',
        'PUT /api/v1/section/:key',
        'DELETE /api/v1/section/:key',
        'PUT /api/v1/sections/reorder',
        'GET /api/v1/api-keys',
        'POST /api/v1/api-keys',
        'DELETE /api/v1/api-keys/:id',
      ],
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

let server;

async function start() {
  try {
    await connectDB();
    server = app.listen(config.port, () => {
      const url = `http://localhost:${config.port}`;
      logger.success(`Portfolio CMS Server active on ${url} [${config.nodeEnv}]`);
      logger.info(`Health: ${url}/health | API: ${url}/api/v1/portfolio (Authorization: Bearer <apiKey>)`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use by another process. Run: npx kill-port ${config.port}`);
      } else {
        logger.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

function gracefulShutdown(signal) {
  logger.info(`Received ${signal} — shutting down server gracefully...`);
  if (server) {
    server.close(() => {
      logger.success('HTTP server closed successfully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

start();