import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { uploadImage, imageUrl, uploadsDir } from '../config/uploads.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post(
  '/',
  uploadImage.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');
    return res.status(201).json({
      success: true,
      data: { url: imageUrl(req.file.filename), name: req.file.filename, size: req.file.size },
    });
  })
);

router.delete(
  '/:filename',
  asyncHandler(async (req, res) => {
    const safe = path.basename(req.params.filename || '');
    if (!safe || safe === '.' || safe === '..' || !safe.includes('.')) {
      throw new ApiError(400, 'Invalid filename');
    }
    const filePath = path.join(uploadsDir, safe);
    if (!filePath.startsWith(uploadsDir + path.sep)) {
      throw new ApiError(400, 'Invalid filename');
    }

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') throw new ApiError(404, 'File not found');
      throw err;
    }

    return res.json({ success: true, data: { filename: safe } });
  })
);

export default router;