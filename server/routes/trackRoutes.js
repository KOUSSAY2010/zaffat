import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Track } from '../models/Track.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadAudio } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Local file storage fallback when MongoDB daemon is not running
const fallbackDataFile = path.join(__dirname, '..', 'uploads', 'tracks_store.json');

const readLocalTracks = () => {
  try {
    if (!fs.existsSync(fallbackDataFile)) {
      return [];
    }
    const content = fs.readFileSync(fallbackDataFile, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.warn('Error reading fallback tracks:', err.message);
    return [];
  }
};

const writeLocalTracks = (tracks) => {
  try {
    const dir = path.dirname(fallbackDataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fallbackDataFile, JSON.stringify(tracks, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing fallback tracks:', err.message);
  }
};

// @route   GET /api/tracks
// @desc    Get all tracks (filterable by category or artist)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, artist, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category && category !== 'الكل') {
        filter.category = category;
      }
      if (artist) {
        filter.artist = artist;
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
        ];
      }

      const tracks = await Track.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: tracks.length,
        data: tracks,
      });
    }

    // Fast local file fallback
    let tracks = readLocalTracks();
    if (category && category !== 'الكل') {
      tracks = tracks.filter((t) => t.category === category);
    }
    if (artist) {
      tracks = tracks.filter((t) => t.artist === artist);
    }
    if (search) {
      const q = search.toLowerCase();
      tracks = tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    tracks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: tracks.length,
      data: tracks,
    });
  } catch (error) {
    console.error('Fetch tracks error:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الزفات.',
      error: error.message,
    });
  }
});

// @route   GET /api/tracks/:id
// @desc    Get single track by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const track = await Track.findById(req.params.id);
      if (!track) {
        return res.status(404).json({
          success: false,
          message: 'الزفة غير موجودة.',
        });
      }
      return res.status(200).json({
        success: true,
        data: track,
      });
    }

    const tracks = readLocalTracks();
    const track = tracks.find((t) => (t._id || t.id) === req.params.id);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'الزفة غير موجودة.',
      });
    }

    return res.status(200).json({
      success: true,
      data: track,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تفاصيل الزفة.',
    });
  }
});

// @route   POST /api/tracks
// @desc    Upload MP3 and create new track record
// @access  Protected (Admin only)
router.post('/', protectAdmin, uploadAudio.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'يرجى اختيار ملف MP3 صوتي لرفعه.',
      });
    }

    const { title, category, artist } = req.body;

    if (!title || !category || !artist) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة (اسم الزفة، التصنيف، واسم الفنان).',
      });
    }

    // Crucial Portability Rule: Store ONLY relative path starting with /uploads/audio/
    const relativeAudioUrl = `/uploads/audio/${req.file.filename}`;

    if (mongoose.connection.readyState === 1) {
      const newTrack = await Track.create({
        title: title.trim(),
        category: category.trim(),
        artist: artist.trim(),
        audioUrl: relativeAudioUrl,
        originalFilename: req.file.originalname,
        fileSize: req.file.size,
      });

      return res.status(201).json({
        success: true,
        message: 'تم رفع وإضافة الزفة بنجاح في قاعدة البيانات.',
        data: newTrack,
      });
    }

    // Local fallback persistence
    const localId = `ATY-${Date.now().toString().slice(-4)}`;
    const newTrack = {
      _id: localId,
      id: localId,
      title: title.trim(),
      category: category.trim(),
      artist: artist.trim(),
      audioUrl: relativeAudioUrl,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      createdAt: new Date().toISOString(),
    };

    const currentTracks = readLocalTracks();
    currentTracks.unshift(newTrack);
    writeLocalTracks(currentTracks);

    return res.status(201).json({
      success: true,
      message: 'تم رفع وإضافة الزفة بنجاح.',
      data: newTrack,
    });
  } catch (error) {
    console.error('Upload track error:', error);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع وحفظ الزفة.',
      error: error.message,
    });
  }
});

// @route   DELETE /api/tracks/:id
// @desc    Delete track from database and physical audio file from disk
// @access  Protected (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    let audioUrlToDelete = null;

    if (mongoose.connection.readyState === 1) {
      const track = await Track.findById(req.params.id);
      if (!track) {
        return res.status(404).json({
          success: false,
          message: 'الزفة غير موجودة أو تم حذفها مسبقاً.',
        });
      }
      audioUrlToDelete = track.audioUrl;
      await Track.findByIdAndDelete(req.params.id);
    } else {
      const tracks = readLocalTracks();
      const trackIndex = tracks.findIndex((t) => (t._id || t.id) === req.params.id);
      if (trackIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'الزفة غير موجودة أو تم حذفها مسبقاً.',
        });
      }
      audioUrlToDelete = tracks[trackIndex].audioUrl;
      tracks.splice(trackIndex, 1);
      writeLocalTracks(tracks);
    }

    // Delete physical audio file from disk if it exists
    if (audioUrlToDelete) {
      const filename = path.basename(audioUrlToDelete);
      const filePath = path.join(__dirname, '..', 'uploads', 'audio', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fsErr) {
          console.warn(`Could not delete physical file ${filePath}:`, fsErr);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'تم حذف الزفة وملفها الصوتي بنجاح.',
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error('Delete track error:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الزفة.',
      error: error.message,
    });
  }
});

export default router;
