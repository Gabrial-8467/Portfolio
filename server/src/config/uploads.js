import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = ALLOWED[file.mimetype];
    const name = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
    cb(null, `${name}${ext}`);
  },
});

import { getPlanConfig } from './plans.js';

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Physical server upper ceiling (100MB)
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) {
      const err = new Error('Only image files are allowed (jpg, png, webp, gif, avif)');
      err.status = 400;
      return cb(err);
    }
    return cb(null, true);
  },
});

export const imageUrl = (filename) => `/uploads/${filename}`;