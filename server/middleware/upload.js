import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target upload directory: server/uploads/audio
const uploadDir = path.join(__dirname, '..', 'uploads', 'audio');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe, unique filename
    const ext = path.extname(file.originalname).toLowerCase() || '.mp3';
    const cleanName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `zaffah-${cleanName}-${uniqueSuffix}${ext}`);
  },
});

// File filter to only accept MP3 audio
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.mp3', '.m4a', '.wav'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (
    file.mimetype.startsWith('audio/') ||
    file.mimetype === 'application/octet-stream' ||
    allowedExts.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error('صيغة الملف غير مدعومة. يُرجى رفع ملف صوتي بصيغة MP3.'), false);
  }
};

export const uploadAudio = multer({
  storage,
  fileFilter,
  // بدون حد أقصى للحجم لرفع ملفات الأستوديو بأعلى جودة
});
