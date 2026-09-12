import type { Track, ArtistInfo, Category } from '../types/track';

export const CATEGORIES_LIST: Category[] = [
  'الكل',
  'زفات عروس',
  'زفات عريس',
  'زفات مولودة',
  'زفات مولود',
  'زفات تخرج بنت',
  'زفات تخرج ولد',
  'زفات عيد ميلاد',
  'زفات عقد قران',
  'زفات ذكرى زواج',
];

// Completely empty by default - populated dynamically via admin panel later
export const ARTISTS_LIST: ArtistInfo[] = [];

// Completely empty by default - populated dynamically via admin panel later
export const MOCK_TRACKS: Track[] = [];
