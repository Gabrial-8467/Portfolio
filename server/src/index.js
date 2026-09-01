import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { uploadsDir } from './config/uploads.js';
import { authRequired } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import publicApiKeyRoutes from './routes/publicApiKeyRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import superadminRoutes from './routes/superadminRoutes.js';

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, same-origin)
    if (!origin) return callback(null, true);

    // In development mode, allow any origin (e.g. localhost:3000, localhost:5173, 127.0.0.1, LAN IPs)
    if (config.nodeEnv !== 'production') {
      return callback(null, true);
    }

    if (config.corsOrigins.includes(origin) || config.corsOrigins.includes('*')) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

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

app.use('/api/p', cors({ origin: true }), publicRoutes);
app.use('/api/v1', cors({ origin: true }), publicApiKeyRoutes);
app.use('/api/portfolios', authRequired, portfolioRoutes);
app.use('/api/api-keys', authRequired, apiKeyRoutes);
app.use('/api/uploads', authRequired, uploadRoutes);
app.use('/api/admin', authRequired, superadminRoutes);

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
      portfolioBySlug: '/api/p/:slug',
      sectionBySlug: '/api/p/:slug/section/:key',
      portfolioByKey: 'GET /api/v1/portfolio  (Authorization: Bearer <apiKey>)',
      sectionByKey: 'GET /api/v1/section/:key  (Authorization: Bearer <apiKey>)',
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      ownerApi: [
        'GET /api/portfolios',
        'POST /api/portfolios',
        'GET /api/portfolios/:portfolioId/sections',
        'GET /api/api-keys',
        'POST /api/uploads',
      ],
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    const url = `http://localhost:${config.port}`;
    console.log('');
    console.log(`  Server running in ${config.nodeEnv} mode`);
    console.log(`  Backend API     ${url}`);
    console.log(`  Health check    ${url}/health`);
    console.log(`  Landing (signup) http://localhost:5176  |  Admin panel http://localhost:5174`);
    console.log('  Public data     GET /api/p/:slug  |  GET /api/v1/portfolio (API key)');
    console.log('');
  });
}

start();