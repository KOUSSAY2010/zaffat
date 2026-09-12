import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const songsDir = path.join(projectRoot, 'songs');
const serverUploadsDir = path.join(projectRoot, 'server', 'uploads', 'audio');
const publicUploadsDir = path.join(projectRoot, 'public', 'uploads', 'audio');
const fallbackStoreFile = path.join(projectRoot, 'server', 'uploads', 'tracks_store.json');

// Find the mp3 file in songs
const files = fs.readdirSync(songsDir);
const mp3File = files.find(f => f.endsWith('.mp3'));

if (!mp3File) {
  console.error('No mp3 file found in songs directory!');
  process.exit(1);
}

console.log('Found file:', mp3File);
const srcPath = path.join(songsDir, mp3File);
const stats = fs.statSync(srcPath);

// Target filename
const targetFilename = 'zaffah-najdi_alzeen-1741790000000.mp3';

// Ensure directories exist
if (!fs.existsSync(serverUploadsDir)) fs.mkdirSync(serverUploadsDir, { recursive: true });
if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true });

// Copy to server uploads
const serverDestPath = path.join(serverUploadsDir, targetFilename);
fs.copyFileSync(srcPath, serverDestPath);
console.log('Copied to server uploads:', serverDestPath);

// Copy to public uploads
const publicDestPath = path.join(publicUploadsDir, targetFilename);
fs.copyFileSync(srcPath, publicDestPath);
console.log('Copied to public uploads:', publicDestPath);

// Track record
const trackItem = {
  _id: 'ATY-9001',
  id: 'ATY-9001',
  title: 'زفة نجدي الزين باسم جميلة',
  category: 'زفات عروس',
  artist: 'زفات أطياف',
  audioUrl: `/uploads/audio/${targetFilename}`,
  originalFilename: mp3File,
  fileSize: stats.size,
  createdAt: new Date().toISOString()
};

// Update tracks_store.json
let currentTracks = [];
if (fs.existsSync(fallbackStoreFile)) {
  try {
    currentTracks = JSON.parse(fs.readFileSync(fallbackStoreFile, 'utf-8'));
  } catch (_) {
    currentTracks = [];
  }
}

// Check if already exists
const existingIndex = currentTracks.findIndex(t => t.id === trackItem.id || t.title === trackItem.title);
if (existingIndex >= 0) {
  currentTracks[existingIndex] = trackItem;
} else {
  currentTracks.unshift(trackItem);
}

fs.writeFileSync(fallbackStoreFile, JSON.stringify(currentTracks, null, 2), 'utf-8');
console.log('Updated tracks_store.json with track:', trackItem.title);
