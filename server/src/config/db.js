import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 3000;

export async function connectDB() {
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected — mongoose will attempt to reconnect');
  });
  mongoose.connection.on('reconnected', () => {
    logger.success('MongoDB reconnected');
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const conn = await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
      const host = conn.connection.host;
      const dbName = conn.connection.name;
      logger.success(`MongoDB connected: ${host}/${dbName}`);
      return;
    } catch (err) {
      logger.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
      if (attempt === MAX_RETRIES) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, BASE_RETRY_DELAY_MS * attempt));
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
