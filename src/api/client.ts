const getDynamicApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getDynamicApiBaseUrl();

export interface DynamicSettings {
  newWordsPrice: number;
  editPrice: number;
  updatedAt?: string;
}

export interface BackendTrack {
  _id: string;
  id?: string;
  title: string;
  category: string;
  artist: string;
  audioUrl: string; // Relative e.g. /uploads/audio/filename.mp3
  originalFilename?: string;
  fileSize?: number;
  createdAt: string;
}

// Construct dynamic full audio URL adhering to portability rules
export const getFullAudioUrl = (relativeAudioUrl?: string): string => {
  if (!relativeAudioUrl) return '';
  if (relativeAudioUrl.startsWith('http://') || relativeAudioUrl.startsWith('https://')) {
    return relativeAudioUrl;
  }
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = relativeAudioUrl.startsWith('/') ? relativeAudioUrl : `/${relativeAudioUrl}`;
  return `${cleanBase}${cleanPath}`;
};

// Auth Token Helpers
const TOKEN_KEY = 'atyaf_admin_jwt';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API Methods
export const api = {
  // Public
  async getSettings(): Promise<DynamicSettings> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
      return { newWordsPrice: 1000, editPrice: 500 };
    } catch (err) {
      console.warn('Failed to fetch settings from API, using defaults:', err);
      return { newWordsPrice: 1000, editPrice: 500 };
    }
  },

  async getTracks(params?: { category?: string; artist?: string; search?: string }): Promise<BackendTrack[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'الكل') query.append('category', params.category);
      if (params?.artist) query.append('artist', params.artist);
      if (params?.search) query.append('search', params.search);

      const url = `${API_BASE_URL}/api/tracks${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch tracks from API:', err);
      return [];
    }
  },

  // Admin Auth
  async login(username: string, password: string):Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (err: any) {
      return { success: false, message: 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.' };
    }
  },

  async verifyToken(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        return true;
      }
      clearAuthToken();
      return false;
    } catch {
      return false;
    }
  },

  // Protected Admin Actions
  async updateSettings(settings: { newWordsPrice: number; editPrice: number }): Promise<{ success: boolean; message?: string }> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'فشل تحديث الأسعار.' };
    }
  },

  async uploadTrack(formData: FormData): Promise<{ success: boolean; data?: BackendTrack; message?: string }> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'فشل رفع الزفة.' };
    }
  },

  async deleteTrack(trackId: string): Promise<{ success: boolean; message?: string }> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'فشل حذف الزفة.' };
    }
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message?: string }> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'فشل تحديث كلمة المرور.' };
    }
  },
};
