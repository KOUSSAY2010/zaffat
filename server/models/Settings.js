import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    newWordsPrice: {
      type: Number,
      required: true,
      default: 1000,
    },
    editPrice: {
      type: Number,
      required: true,
      default: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Helper to ensure singleton settings document
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      newWordsPrice: 1000,
      editPrice: 500,
    });
  }
  return settings;
};

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
