import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { authRequired } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import superadminRoutes from './routes/superadminRoutes.js';

const app = express();

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

app.use('/api/p', publicRoutes);
app.use('/api/portfolios', authRequired, portfolioRoutes);
app.use('/api/admin', authRequired, superadminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}

start();