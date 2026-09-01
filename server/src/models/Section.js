import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    label: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ portfolio: 1, key: 1 }, { unique: true });
sectionSchema.index({ portfolio: 1, order: 1 });

export const Section = mongoose.model('Section', sectionSchema);