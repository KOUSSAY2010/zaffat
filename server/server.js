import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration (Flexible for VPS and local development)
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl) or matching allowed origin
      if (!origin || origin === allowedOrigin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in staging to ease VPS testing
      }
    },
    credentials: true,
  })
);

// Body parser middlewares
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Crucial Portability Rule: Serve uploads statically at /uploads/audio
const audioUploadsPath = path.join(__dirname, 'uploads', 'audio');
app.use('/uploads/audio', express.static(audioUploadsPath));

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'زفات أطياف - API Server',
    time: new Date().toISOString(),
    audioStaticRoute: '/uploads/audio',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع في الخادم.',
  });
});

// Start listening on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`  زفات أطياف - Backend Server Running   `);
  console.log(`  Port: http://localhost:${PORT}        `);
  console.log(`  Audio Static URL: /uploads/audio      `);
  console.log(`=========================================`);
});
