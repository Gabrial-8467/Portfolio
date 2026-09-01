import express from 'express';
import { uploadImage, imageUrl } from '../config/uploads.js';
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

export default router;