import React from 'react';
import { ARTISTS_LIST } from '../../data/mockTracks';
import type { Artist } from '../../types/track';
import { Mic2, Check, Sparkles, UserCheck } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface ArtistsSectionProps {
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist | null) => void;
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  selectedArtist,
  onSelectArtist,
}) => {
  const hasArtists = ARTISTS_LIST.length > 0;

  return (
    <section id="artists" className="py-12 relative overflow-hidden bg-white/70 border-y border-brand-borderSoft">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold-dark mb-1 font-tajawal">
              <Mic2 className="w-4 h-4 text-brand-gold" />
              <span>نخبة الأصوات والنجوم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cairo text-brand-text-primary">
              أصوات الفنانين
            </h2>
            <p className="text-sm text-brand-text-muted font-tajawal mt-1">
              اختر صوت فنانك المفضل للاستماع لزفاته الملكية الخاصة
            </p>
          </div>

          {selectedArtist && (
            <button
              onClick={() => onSelectArtist(null)}
              className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-bold font-cairo text-brand-gold-dark bg-brand-ivory border border-brand-border hover:bg-brand-gold hover:text-white transition-all duration-200"
            >
              عرض كل الأصوات (إلغاء التصفية)
            </button>
          )}
        </div>

        {/* Dynamic / Empty State for Artists */}
        {hasArtists ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {ARTISTS_LIST.map((artist) => {
              const isSelected = selectedArtist === artist.name;

              return (
                <button
                  key={artist.name}
                  onClick={() => onSelectArtist(isSelected ? null : artist.name)}
                  className="group flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-300 relative focus:outline-none"
                >
                  <div className="relative mb-3">
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-brand-gold via-amber-400 to-brand-gold shadow-md scale-105'
                          : 'bg-brand-ivory group-hover:bg-brand-gold/40'
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-brand-ivory relative">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-gold/40 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white font-black stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-brand-border text-brand-gold-dark shadow-sm whitespace-nowrap">
                      {artist.trackCount} زفات
                    </span>
                  </div>

                  <span
                    className={`text-sm font-bold font-cairo transition-colors duration-200 ${
                      isSelected ? 'text-brand-gold-dark' : 'text-brand-text-primary group-hover:text-brand-gold-dark'
                    }`}
                  >
                    {artist.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="لا توجد أصوات فنانين مضافة حالياً"
            description="سيتم ربط وإتاحة باقة تسجيلات كبار الفنانين عبر لوحة التحكم قريباً، أو يمكنك طلب تنفيذ زفة بصوت أي فنان ترغب به مباشرة."
            showCustomOrderCta={true}
          />
        )}

      </div>
    </section>
  );
};
