import React, { useState, useEffect } from 'react';
import { api, type BackendTrack, type DynamicSettings, getFullAudioUrl, clearAuthToken } from '../../api/client';
import {
  Music,
  UploadCloud,
  Trash2,
  Save,
  LogOut,
  ExternalLink,
  PlusCircle,
  ListMusic,
  DollarSign,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

const CATEGORIES = [
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

const ARTISTS = [
  'حسين الجسمي',
  'محمد عبده',
  'إبراهيم عباس',
  'ماجد المهندس',
  'عايل القطري',
  'عايض',
  'فؤاد عبدالواحد',
  'جابر الكاسر',
];

interface AdminDashboardProps {
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onGoToSite }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'tracks' | 'settings' | 'security'>('upload');
  
  // Tracks State
  const [tracks, setTracks] = useState<BackendTrack[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<DynamicSettings>({ newWordsPrice: 1000, editPrice: 500 });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Track Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [artist, setArtist] = useState(ARTISTS[0]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Mini audio player for previewing uploaded tracks in table
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load Initial Data
  const loadTracks = async () => {
    setIsLoadingTracks(true);
    const data = await api.getTracks();
    setTracks(data);
    setIsLoadingTracks(false);
  };

  const loadSettings = async () => {
    const data = await api.getSettings();
    setSettings(data);
  };

  useEffect(() => {
    loadTracks();
    loadSettings();

    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, []);

  // Handle Track Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      showNotification('error', 'يرجى اختيار ملف MP3 صوتي.');
      return;
    }
    if (!title.trim()) {
      showNotification('error', 'يرجى إدخال عنوان الزفة.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('category', category);
    formData.append('artist', artist);
    formData.append('audio', audioFile);

    const res = await api.uploadTrack(formData);
    setIsUploading(false);

    if (res.success) {
      showNotification('success', 'تم رفع الزفة وحفظها بنجاح!');
      setTitle('');
      setAudioFile(null);
      // Reset file input
      const fileInput = document.getElementById('audio-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      loadTracks();
      setActiveTab('tracks');
    } else {
      showNotification('error', res.message || 'فشل رفع الزفة، يرجى التحقق من اتصال الخادم.');
    }
  };

  // Handle Track Deletion
  const handleDeleteTrack = async (id: string, trackTitle: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف زفة "${trackTitle}" نهائياً من الخادم؟`)) {
      return;
    }

    if (previewTrackId === id && audioPlayer) {
      audioPlayer.pause();
      setPreviewTrackId(null);
    }

    const res = await api.deleteTrack(id);
    if (res.success) {
      showNotification('success', `تم حذف زفة "${trackTitle}" بنجاح.`);
      loadTracks();
    } else {
      showNotification('error', res.message || 'فشل حذف الزفة.');
    }
  };

  // Handle Settings Save
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const res = await api.updateSettings({
      newWordsPrice: Number(settings.newWordsPrice),
      editPrice: Number(settings.editPrice),
    });
    setIsSavingSettings(false);

    if (res.success) {
      showNotification('success', 'تم تحديث أسعار الباقات بنجاح!');
    } else {
      showNotification('error', res.message || 'فشل حفظ الأسعار.');
    }
  };

  // Handle Admin Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showNotification('error', 'يرجى إدخال كلمة المرور الحالية والجديدة.');
      return;
    }
    if (newPassword.trim().length < 6) {
      showNotification('error', 'يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('error', 'كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور.');
      return;
    }

    setIsChangingPassword(true);
    const res = await api.changePassword({
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    });
    setIsChangingPassword(false);

    if (res.success) {
      showNotification('success', res.message || 'تم تحديث كلمة المرور بنجاح!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showNotification('error', res.message || 'فشل تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية.');
    }
  };

  // Toggle Table Preview Player
  const togglePreview = (track: BackendTrack) => {
    const trackId = track._id || track.id || '';
    if (previewTrackId === trackId) {
      audioPlayer?.pause();
      setPreviewTrackId(null);
      return;
    }

    if (audioPlayer) {
      audioPlayer.pause();
    }

    const fullUrl = getFullAudioUrl(track.audioUrl);
    const newAudio = new Audio(fullUrl);
    newAudio.play().catch((err) => console.warn('Audio preview error:', err));
    newAudio.onended = () => setPreviewTrackId(null);
    setAudioPlayer(newAudio);
    setPreviewTrackId(trackId);
  };

  const handleLogoutClick = () => {
    clearAuthToken();
    if (audioPlayer) audioPlayer.pause();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-tajawal pb-20">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-borderSoft shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-ivory border border-brand-border flex items-center justify-center shadow-sm">
                <Music className="w-6 h-6 text-brand-gold-dark" />
              </div>
              <div>
                <h1 className="text-2xl font-normal font-rakkas text-brand-text-primary flex items-center gap-2">
                  <span>لوحة التحكم الإدارية</span>
                  <span className="text-[10px] font-bold font-cairo px-2 py-0.5 rounded-md bg-brand-gold/15 text-brand-gold-dark border border-brand-gold/30">
                    Admin
                  </span>
                </h1>
                <p className="text-xs text-brand-text-muted font-amiri font-semibold">زفات أطياف - الإدارة والتحكم</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onGoToSite}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-text-secondary hover:text-brand-text-primary bg-brand-ivory border border-brand-borderSoft hover:border-brand-border transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>معاينة الموقع</span>
              </button>

              <button
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Notification Toast */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-brand-borderSoft pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-brand-gold to-amber-500 text-white shadow-sm'
                : 'bg-white text-brand-text-secondary hover:text-brand-text-primary border border-brand-borderSoft'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>رفع زفة جديدة</span>
          </button>

          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all ${
              activeTab === 'tracks'
                ? 'bg-gradient-to-r from-brand-gold to-amber-500 text-white shadow-sm'
                : 'bg-white text-brand-text-secondary hover:text-brand-text-primary border border-brand-borderSoft'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            <span>إدارة الزفات ({tracks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-brand-gold to-amber-500 text-white shadow-sm'
                : 'bg-white text-brand-text-secondary hover:text-brand-text-primary border border-brand-borderSoft'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>باقات الأسعار</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-brand-gold to-amber-500 text-white shadow-sm'
                : 'bg-white text-brand-text-secondary hover:text-brand-text-primary border border-brand-borderSoft'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>كلمة المرور والأمان</span>
          </button>
        </div>

        {/* Tab 1: Upload New Track */}
        {activeTab === 'upload' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-soft relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-borderSoft">
              <div className="p-3 rounded-2xl bg-brand-ivory text-brand-gold-dark border border-brand-borderSoft">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal font-rakkas text-brand-text-primary">
                  رفع زفة جديدة (MP3)
                </h2>
                <p className="text-xs text-brand-text-muted font-amiri">
                  سيتم حفظ الملف في مسار التخزين المحلي المعزول `/uploads/audio/`
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              
              {/* Audio File Input */}
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  ملف الصوت (MP3) *
                </label>
                <div className="relative border-2 border-dashed border-brand-border hover:border-brand-gold rounded-2xl p-6 text-center bg-brand-ivory/30 transition-all cursor-pointer">
                  <input
                    id="audio-upload-input"
                    type="file"
                    accept=".mp3,audio/mpeg,audio/mp3,audio/m4a,audio/wav"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 text-brand-gold-dark mb-2 animate-bounce" />
                    <span className="text-sm font-bold text-brand-text-primary">
                      {audioFile ? audioFile.name : 'انقر لاختيار ملف الزفة الصوتي أو اسحبه هنا'}
                    </span>
                    <span className="text-xs text-brand-text-muted mt-1 font-mono">
                      {audioFile
                        ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'صيغ الصوت (MP3 / WAV / M4A) بجودة Studio Master - بدون حد أقصى للحجم'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  عنوان الزفة *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: أقبلت شمس الصبايا (طلة ملكية)..."
                  className="w-full px-4 py-3 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all"
                  required
                />
              </div>

              {/* Category & Artist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                    التصنيف (الأقسام الـ 9) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Artist Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                    الفنان *
                  </label>
                  <select
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold transition-all"
                  >
                    {ARTISTS.map((art) => (
                      <option key={art} value={art}>
                        {art}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3.5 px-6 rounded-2xl font-cairo font-bold text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:from-amber-500 hover:to-brand-gold shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جارٍ رفع الزفة وتخزين الملف...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>حفظ ونشر الزفة</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Tab 2: Existing Tracks Table */}
        {activeTab === 'tracks' && (
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft overflow-hidden">
            
            <div className="p-6 border-b border-brand-borderSoft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-normal font-rakkas text-brand-text-primary">
                  قائمة الزفات المرفوعة ({tracks.length})
                </h2>
                <p className="text-xs text-brand-text-muted font-amiri">
                  المسارات الصوتية النشطة المخزنة في النظام
                </p>
              </div>

              <button
                onClick={loadTracks}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-brand-gold-dark bg-brand-ivory border border-brand-borderSoft hover:bg-brand-gold hover:text-white transition-colors"
              >
                تحديث القائمة
              </button>
            </div>

            {isLoadingTracks ? (
              <div className="py-20 text-center text-brand-text-muted">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-gold" />
                <span className="text-sm">جارٍ تحميل الزفات...</span>
              </div>
            ) : tracks.length === 0 ? (
              <div className="py-16 text-center text-brand-text-muted">
                <Music className="w-12 h-12 text-brand-gold/40 mx-auto mb-3" />
                <h4 className="text-base font-bold font-cairo text-brand-text-primary">
                  لا توجد زفات مرفوعة بعد
                </h4>
                <p className="text-xs text-brand-text-muted mt-1 mb-4">
                  ابدأ برفع أول زفة عبر تبويب "رفع زفة جديدة".
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-5 py-2 rounded-xl text-xs font-bold font-cairo text-white bg-gradient-to-r from-brand-gold to-amber-500 shadow-sm"
                >
                  رفع أول زفة الآن
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead className="bg-brand-ivory/60 text-brand-text-secondary font-cairo font-bold border-b border-brand-borderSoft">
                    <tr>
                      <th className="px-6 py-3.5">المعاينة</th>
                      <th className="px-6 py-3.5">اسم الزفة</th>
                      <th className="px-6 py-3.5">التصنيف</th>
                      <th className="px-6 py-3.5">الفنان</th>
                      <th className="px-6 py-3.5">المسار النسبي</th>
                      <th className="px-6 py-3.5">تاريخ الإضافة</th>
                      <th className="px-6 py-3.5 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-borderSoft font-tajawal">
                    {tracks.map((track) => {
                      const trackId = track._id || track.id || '';
                      const isPlayingThis = previewTrackId === trackId;

                      return (
                        <tr key={trackId} className="hover:bg-brand-ivory/30 transition-colors">
                          
                          {/* Play preview */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => togglePreview(track)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isPlayingThis
                                  ? 'bg-brand-gold text-white shadow-sm scale-105'
                                  : 'bg-brand-ivory hover:bg-brand-gold/20 text-brand-gold-dark border border-brand-borderSoft'
                              }`}
                              title={isPlayingThis ? 'إيقاف' : 'استماع'}
                            >
                              {isPlayingThis ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-[-1px]" />}
                            </button>
                          </td>

                          <td className="px-6 py-4 font-bold font-amiri text-base text-brand-text-primary">
                            {track.title}
                          </td>

                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-ivory text-brand-gold-dark border border-brand-borderSoft font-cairo">
                              {track.category}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-brand-text-secondary font-amiri font-bold text-sm">
                            {track.artist}
                          </td>

                          <td className="px-6 py-4 font-mono text-[11px] text-brand-text-muted" dir="ltr">
                            {track.audioUrl}
                          </td>

                          <td className="px-6 py-4 text-brand-text-muted text-xs">
                            {new Date(track.createdAt).toLocaleDateString('ar-SA')}
                          </td>

                          {/* Delete */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteTrack(trackId, track.title)}
                              className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-colors"
                              title="حذف الزفة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Dynamic Price Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-soft relative overflow-hidden">
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-borderSoft">
              <div className="p-3 rounded-2xl bg-brand-ivory text-brand-gold-dark border border-brand-borderSoft">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal font-rakkas text-brand-text-primary">
                  إعدادات قائمة الأسعار العامة
                </h2>
                <p className="text-xs text-brand-text-muted font-amiri">
                  تنطبق هذه الأسعار فورياً على بنر الواجهة الرئيسية بالموقع
                </p>
              </div>
            </div>

            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              
              {/* New Words Price */}
              <div className="p-4 rounded-2xl bg-brand-ivory/50 border border-brand-borderSoft">
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  سعر "كلمات جديدة بالكامل" (ريال سعودي)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={settings.newWordsPrice}
                    onChange={(e) => setSettings({ ...settings, newWordsPrice: Number(e.target.value) })}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-brand-border text-base font-bold font-cairo text-brand-gold-dark focus:outline-none focus:border-brand-gold"
                    required
                  />
                  <span className="text-sm font-bold text-brand-text-muted font-tajawal">ريال سعودي</span>
                </div>
              </div>

              {/* Edit Existing Track Price */}
              <div className="p-4 rounded-2xl bg-brand-ivory/50 border border-brand-borderSoft">
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  سعر "تعديل زفة جاهزة" (ريال سعودي)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={settings.editPrice}
                    onChange={(e) => setSettings({ ...settings, editPrice: Number(e.target.value) })}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-brand-border text-base font-bold font-cairo text-amber-600 focus:outline-none focus:border-brand-gold"
                    required
                  />
                  <span className="text-sm font-bold text-brand-text-muted font-tajawal">ريال سعودي</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-3.5 px-6 rounded-2xl font-cairo font-bold text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:from-amber-500 hover:to-brand-gold shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جارٍ حفظ التحديثات...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>حفظ الأسعار وتحديث الموقع</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        {/* Tab 4: Admin Password & Security */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-soft relative overflow-hidden">
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-borderSoft">
              <div className="p-3 rounded-2xl bg-brand-ivory text-brand-gold-dark border border-brand-borderSoft">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal font-rakkas text-brand-text-primary">
                  إنشاء وتعديل كلمة مرور المشرف
                </h2>
                <p className="text-xs text-brand-text-muted font-amiri">
                  تأمين حساب الإدارة وتحديث بيانات الدخول الخاصة بلوحة التحكم
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  كلمة المرور الحالية *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الحالية..."
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-text-muted hover:text-brand-text-primary"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  كلمة المرور الجديدة *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="كلمة مرور جديدة قوية (6 أحرف على الأقل)..."
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-text-muted hover:text-brand-text-primary"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-brand-text-muted mt-1 font-tajawal">
                  يُفضّل أن تحتوي على حروف وأرقام لضمان أعلى مستويات الأمان.
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
                  تأكيد كلمة المرور الجديدة *
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور الجديدة..."
                  className={`w-full px-4 py-3 rounded-xl bg-brand-ivory/50 border text-sm font-tajawal text-brand-text-primary focus:outline-none transition-all ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-brand-borderSoft focus:border-brand-gold'
                  }`}
                  dir="ltr"
                  required
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[11px] text-rose-600 mt-1 font-tajawal">
                    كلمات المرور غير متطابقة.
                  </p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-tajawal flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>كلمات المرور متطابقة بنجاح.</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-3.5 px-6 rounded-2xl font-cairo font-bold text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:from-amber-500 hover:to-brand-gold shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جارٍ تحديث كلمة المرور...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>تحديث وحفظ كلمة المرور الجديدة</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
};
