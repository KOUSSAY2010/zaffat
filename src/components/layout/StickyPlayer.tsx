import React from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle,
  X,
  Music2,
  Loader2,
} from 'lucide-react';

export const StickyPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    togglePlay,
    pauseTrack,
    closePlayer,
    seek,
    setVolume,
    toggleMute,
    formatTime,
  } = useAudio();

  if (!currentTrack) return null;

  const activeDuration = duration || 240;
  const progressPercent = activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0;

  const whatsappMessage = `السلام عليكم، أرغب في طلب زفة: ${currentTrack.title} - كود: ${currentTrack.id}`;
  const whatsappUrl = `https://wa.me/966500856597?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="backdrop-blur-2xl bg-white/95 border border-brand-border rounded-3xl p-3 sm:p-4 shadow-xl ring-1 ring-brand-gold/20">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left/Track Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-ivory shrink-0 border border-brand-borderSoft">
                  {currentTrack.coverImage ? (
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-brand-gold-dark" />
                    </div>
                  )}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-brand-gold/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-brand-gold-dark animate-ping" />
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <h4 className="text-sm font-bold font-cairo text-brand-text-primary line-clamp-1">
                    {currentTrack.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-brand-text-muted font-tajawal">
                    <span className="text-brand-gold-dark font-semibold">{currentTrack.artist}</span>
                    <span>•</span>
                    <span>{currentTrack.category}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Play Button */}
              <button
                onClick={() => togglePlay(currentTrack)}
                className="sm:hidden p-3 rounded-full bg-gradient-to-r from-brand-gold to-amber-500 text-white shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>
            </div>

            {/* Middle Controls */}
            <div className="flex-1 max-w-xl w-full px-2">
              <div className="flex items-center gap-3">
                
                {/* Desktop Play/Pause */}
                <button
                  onClick={() => togglePlay(currentTrack)}
                  className="hidden sm:flex p-2.5 rounded-full bg-gradient-to-r from-brand-gold to-amber-500 hover:brightness-105 text-white shadow-sm hover:scale-105 transition-all shrink-0"
                  aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                  )}
                </button>

                {/* Scrubbing Bar */}
                <span className="text-[11px] font-mono text-brand-text-muted shrink-0 w-10 text-left">
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min="0"
                  max={activeDuration}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-brand-ivory rounded-lg appearance-none cursor-pointer accent-brand-gold"
                  style={{
                    background: `linear-gradient(to left, #c99a2c ${progressPercent}%, #e7e5e4 ${progressPercent}%)`,
                  }}
                />

                <span className="text-[11px] font-mono text-brand-text-muted shrink-0 w-10 text-right">
                  {formatTime(activeDuration)}
                </span>
              </div>
            </div>

            {/* Right/WhatsApp CTA & Volume */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-brand-text-muted hover:text-brand-text-primary transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-brand-ivory rounded appearance-none cursor-pointer accent-brand-gold"
                />
              </div>

              {/* Direct Order WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial py-2 px-4 rounded-xl font-cairo font-bold text-xs text-white bg-gradient-to-r from-brand-gold to-amber-500 hover:brightness-105 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب هذه الزفة</span>
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={closePlayer}
                className="p-2 text-brand-text-muted hover:text-rose-500 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer shrink-0"
                title="إغلاق المشغل"
                aria-label="إغلاق المشغل"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
