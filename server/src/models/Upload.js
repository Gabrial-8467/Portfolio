import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true, index: true },
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, default: '' },
    size: { type: Number, default: 0 },
    mimetype: { type: String, default: '' },
  },
  { timestamps: true }
);

uploadSchema.index({ portfolio: 1, createdAt: -1 });

export const Upload = mongoose.model('Upload', uploadSchema);
