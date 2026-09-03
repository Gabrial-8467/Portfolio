import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
  clientAdminUrl: process.env.CLIENT_ADMIN_URL || 'http://localhost:5174',
  clientLandingUrl: process.env.CLIENT_LANDING_URL || 'http://localhost:5176',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@gabrialdeora.com',
  seedAdminPassword:
    process.env.SEED_ADMIN_PASSWORD ||
    (process.env.NODE_ENV === 'production' ? undefined : 'ChangeMe123!'),
};
