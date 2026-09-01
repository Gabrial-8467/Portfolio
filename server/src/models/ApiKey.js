import mongoose from 'mongoose';

const ApiKeySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    name: { type: String, trim: true, default: 'Default' },
    prefix: { type: String, required: true },
    keyHash: { type: String, required: true, unique: true, index: true },
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date },
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model('ApiKey', ApiKeySchema);