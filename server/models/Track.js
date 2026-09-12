import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'اسم الزفة مطلوب'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'تصنيف الزفة مطلوب'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'اسم الفنان مطلوب'],
      trim: true,
    },
    // Crucial rule: Stored as relative path (e.g., /uploads/audio/filename.mp3)
    audioUrl: {
      type: String,
      required: [true, 'مسار الملف الصوتي مطلوب'],
      trim: true,
    },
    originalFilename: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Track = mongoose.models.Track || mongoose.model('Track', trackSchema);
