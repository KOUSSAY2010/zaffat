import React, { useState, useEffect, useMemo } from 'react';
import { AudioProvider } from './context/AudioContext';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/hero/HeroSection';
import { CategoryFilter } from './components/categories/CategoryFilter';
import { ArtistsSection } from './components/artists/ArtistsSection';
import { TrackCard } from './components/audio/TrackCard';
import { SearchBar } from './components/common/SearchBar';
import { EmptyState } from './components/common/EmptyState';
import { StickyPlayer } from './components/layout/StickyPlayer';
import { Footer } from './components/layout/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { api, getAuthToken, clearAuthToken, type DynamicSettings, type BackendTrack } from './api/client';
import type { Category, Artist, Track } from './types/track';
import { Music, Filter, RotateCcw, MessageCircle, Sparkles, Loader2 } from 'lucide-react';

function AppContent() {
  // Navigation Route State: 'site' or 'admin'
  const [currentRoute, setCurrentRoute] = useState<'site' | 'admin'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || hash === '#admin' ? 'admin' : 'site';
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState<boolean>(true);

  // Dynamic Data States (STRICT: NO mock data, live API with empty states)
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(true);
  const [pricingSettings, setPricingSettings] = useState<DynamicSettings>({
    newWordsPrice: 1000,
    editPrice: 500,
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<Category>('الكل');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize browser history / URL
  const navigateTo = (route: 'site' | 'admin') => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setCurrentRoute(path === '/admin' || hash === '#admin' ? 'admin' : 'site');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check Admin Authentication
  useEffect(() => {
    const verifyAuth = async () => {
      setIsVerifyingAdmin(true);
      const token = getAuthToken();
      if (token) {
        const isValid = await api.verifyToken();
        setIsAdminLoggedIn(isValid);
      } else {
        setIsAdminLoggedIn(false);
      }
      setIsVerifyingAdmin(false);
    };
    verifyAuth();
  }, [currentRoute]);

  // Load Public Data from Backend API (Empty state by default if no tracks uploaded yet)
  const fetchPublicData = async () => {
    setIsLoadingTracks(true);
    try {
      const [fetchedTracks, fetchedSettings] = await Promise.all([
        api.getTracks(),
        api.getSettings(),
      ]);

      // Map BackendTrack to Frontend Track model
      const formattedTracks: Track[] = (fetchedTracks || []).map((t: BackendTrack) => ({
        id: t._id || t.id || '',
        _id: t._id,
        title: t.title,
        category: t.category,
        artist: t.artist,
        audioUrl: t.audioUrl,
        createdAt: t.createdAt,
      }));

      setTracks(formattedTracks);
      if (fetchedSettings) {
        setPricingSettings(fetchedSettings);
      }
    } catch (err) {
      console.warn('Error loading public tracks/settings from backend API:', err);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  useEffect(() => {
    if (currentRoute === 'site') {
      fetchPublicData();
    }
  }, [currentRoute]);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      الكل: tracks.length,
    };
    tracks.forEach((track) => {
      counts[track.category] = (counts[track.category] || 0) + 1;
    });
    return counts;
  }, [tracks]);

  // Filtered tracks based on category, artist, and search query
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      if (selectedCategory !== 'الكل' && track.category !== selectedCategory) {
        return false;
      }
      if (selectedArtist && track.artist !== selectedArtist) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = track.title.toLowerCase().includes(query);
        const matchArtist = track.artist.toLowerCase().includes(query);
        const matchId = track.id.toLowerCase().includes(query);
        const matchCategory = track.category.toLowerCase().includes(query);
        if (!matchTitle && !matchArtist && !matchId && !matchCategory) {
          return false;
        }
      }
      return true;
    });
  }, [tracks, selectedCategory, selectedArtist, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('الكل');
    setSelectedArtist(null);
    setSearchQuery('');
  };

  const whatsappGeneralUrl = `https://wa.me/966500856597?text=${encodeURIComponent(
    'السلام عليكم، أرغب في الاستفسار والطلب من زفات أطياف.'
  )}`;

  // ==========================================
  // ROUTE 1: ADMIN PANEL (/admin)
  // ==========================================
  if (currentRoute === 'admin') {
    if (isVerifyingAdmin) {
      return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4">
          <Loader2 className="w-10 h-10 text-brand-gold animate-spin mb-3" />
          <p className="text-sm font-bold font-cairo text-brand-text-secondary">
            جارٍ التحقق من صلاحيات الدخول...
          </p>
        </div>
      );
    }

    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
          onBackToHome={() => navigateTo('site')}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => {
          clearAuthToken();
          setIsAdminLoggedIn(false);
        }}
        onGoToSite={() => navigateTo('site')}
      />
    );
  }

  // ==========================================
  // ROUTE 2: PUBLIC USER INTERFACE
  // ==========================================
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-tajawal selection:bg-brand-gold/20 selection:text-brand-gold-dark relative overflow-x-hidden">
      
      {/* Subtle Warm Background Glow Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-0 w-96 h-96 bg-brand-rose-soft rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main Header */}
      <Header onNavigateAdmin={() => navigateTo('admin')} />

      <main>
        {/* Hero Section with Dynamic Pricing Banner */}
        <HeroSection
          newWordsPrice={pricingSettings.newWordsPrice}
          editPrice={pricingSettings.editPrice}
        />

        {/* Category Navigation Tabs (9 categories + All) */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          categoryCounts={categoryCounts}
        />

        {/* Dedicated Artists Section */}
        <ArtistsSection
          selectedArtist={selectedArtist}
          onSelectArtist={(artist) => setSelectedArtist(artist)}
        />

        {/* Tracks Library Section */}
        <section id="tracks" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-borderSoft">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold-dark mb-1">
                <Music className="w-4 h-4 text-brand-gold" />
                <span>المكتبة الصوتية المتميزة</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-normal font-rakkas text-brand-text-primary flex items-center gap-3">
                <span>استمع واحجز زفتك الآن</span>
                <span className="text-xs font-tajawal px-2.5 py-1 rounded-full bg-brand-ivory text-brand-gold-dark border border-brand-borderSoft font-semibold">
                  {filteredTracks.length} زفة متاحة
                </span>
              </h2>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalResults={filteredTracks.length}
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'الكل' || selectedArtist || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-brand-text-muted flex items-center gap-1 font-cairo font-medium">
                <Filter className="w-3 h-3 text-brand-gold" />
                الفلاتر النشطة:
              </span>

              {selectedCategory !== 'الكل' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-white border border-brand-border text-brand-gold-dark font-bold shadow-sm">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('الكل')}
                    className="hover:text-brand-text-primary mr-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedArtist && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-white border border-brand-border text-brand-gold-dark font-bold shadow-sm">
                  بصوت: {selectedArtist}
                  <button
                    onClick={() => setSelectedArtist(null)}
                    className="hover:text-brand-text-primary mr-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-white border border-brand-borderSoft text-brand-text-secondary shadow-sm">
                  بحث: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-brand-text-primary mr-1"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 mr-2 transition-colors font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط الفلاتر</span>
              </button>
            </div>
          )}

          {/* Tracks Grid or Empty State */}
          {isLoadingTracks ? (
            <div className="py-20 text-center text-brand-text-muted">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-gold" />
              <span className="text-sm font-bold font-cairo">جارٍ جلب الزفات الصوتية...</span>
            </div>
          ) : filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            /* Joyful Empty State Component (Shown when no tracks exist) */
            <EmptyState
              categoryName={selectedCategory}
              title="لا توجد زفات مسجلة في هذا القسم حالياً"
              description="لم تتم إضافة زفات في هذا القسم بعد. يمكنك عبر لوحة التحكم رفع ملفات صوتية MP3، أو طلب تنفيذ زفة خاصة بالأسماء والكلمات التي ترغب بها الآن."
              showCustomOrderCta={true}
            />
          )}

          {/* Direct Custom Request Banner */}
          <div className="mt-10 sm:mt-14 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-ivory via-white to-brand-ivory border border-brand-border shadow-soft relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-right">
                <div className="inline-flex items-center gap-1.5 text-xs text-brand-gold-dark font-bold">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span>تنفيذ خاص حسب رغبتكم</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-amiri text-brand-text-primary">
                  هل تبحث عن زفة حصرية بكلمات خاصة وأسماء العائلات؟
                </h3>
                <p className="text-sm sm:text-base text-brand-text-secondary font-amiri max-w-2xl leading-relaxed">
                  فريقنا من أمهر الشعراء والملحنين ومهندسي الصوت جاهزون لصياغة زفتك من الصفر بأسماء العروسين وأصوات كبار الفنانين، مع تسليم في وقت قياسي.
                </p>
              </div>
              <a
                href={whatsappGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto whitespace-nowrap px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-cairo font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:shadow-gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل مع الإدارة للطلب الخاص</span>
              </a>
            </div>
          </div>

        </section>
      </main>

      {/* Footer with Admin Access Link */}
      <Footer onNavigateAdmin={() => navigateTo('admin')} />

      {/* Sticky Bottom Audio Player Bar */}
      <StickyPlayer />

    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}
