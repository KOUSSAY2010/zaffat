import express from 'express';
import mongoose from 'mongoose';
import { Settings } from '../models/Settings.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-memory fallback if MongoDB is not connected in current local environment
let memorySettings = {
  newWordsPrice: 1000,
  editPrice: 500,
  updatedAt: new Date(),
};

// @route   GET /api/settings
// @desc    Get dynamic pricing settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const settings = await Settings.getSettings();
      return res.status(200).json({
        success: true,
        data: {
          newWordsPrice: settings.newWordsPrice,
          editPrice: settings.editPrice,
          updatedAt: settings.updatedAt,
        },
      });
    }

    // Fast instant fallback if MongoDB is not running locally
    return res.status(200).json({
      success: true,
      data: memorySettings,
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(200).json({
      success: true,
      data: memorySettings,
    });
  }
});

// @route   PUT /api/settings
// @desc    Update dynamic pricing settings
// @access  Protected (Admin only)
router.put('/', protectAdmin, async (req, res) => {
  try {
    const { newWordsPrice, editPrice } = req.body;

    if (
      newWordsPrice === undefined ||
      editPrice === undefined ||
      isNaN(newWordsPrice) ||
      isNaN(editPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال أرقام صحيحة لأسعار الكلمات الجديدة والتعديل.',
      });
    }

    const newWords = Number(newWordsPrice);
    const edit = Number(editPrice);

    if (mongoose.connection.readyState === 1) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      settings.newWordsPrice = newWords;
      settings.editPrice = edit;
      await settings.save();

      return res.status(200).json({
        success: true,
        message: 'تم تحديث قائمة الأسعار بنجاح في قاعدة البيانات.',
        data: {
          newWordsPrice: settings.newWordsPrice,
          editPrice: settings.editPrice,
          updatedAt: settings.updatedAt,
        },
      });
    }

    // In-memory fallback
    memorySettings = {
      newWordsPrice: newWords,
      editPrice: edit,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'تم تحديث قائمة الأسعار بنجاح.',
      data: memorySettings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حفظ الأسعار الجديدة.',
      error: error.message,
    });
  }
});

export default router;
