import React from 'react';
import type { Track } from '../../types/track';
import { useAudio } from '../../context/AudioContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface TrackCardProps {
  track: Track;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    togglePlay,
    seek,
    volume,
    isMuted,
    toggleMute,
    formatTime,
  } = useAudio();

  const isThisPlaying = currentTrack?.id === track.id && isPlaying;
  const isThisActive = currentTrack?.id === track.id;
  const isThisLoading = isThisActive && isLoading;

  const activeDuration = isThisActive ? duration || 240 : 240;
  const activeCurrentTime = isThisActive ? currentTime : 0;
  const progressPercent = activeDuration > 0 ? (activeCurrentTime / activeDuration) * 100 : 0;

  const whatsappMessage = `السلام عليكم، أرغب في طلب زفة: ${track.title} - كود: ${track.id}`;
  const whatsappUrl = `https://wa.me/966500856597?text=${encodeURIComponent(whatsappMessage)}`;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    seek(value);
  };

  return (
    <div
      className={`group relative rounded-3xl p-5 transition-all duration-300 border flex flex-col justify-between ${
        isThisActive
          ? 'bg-brand-ivory/80 border-brand-gold shadow-md ring-1 ring-brand-gold/40'
          : 'bg-white hover:bg-brand-cardHover border-brand-borderSoft hover:border-brand-border shadow-soft'
      }`}
    >
      {/* Top Section: Cover Image & Badges */}
      <div>
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-brand-ivory">
          {track.coverImage ? (
            <img
              src={track.coverImage}
              alt={track.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isThisPlaying ? 'scale-105' : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-brand-ivory flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </div>
          )}

          {/* Category Badge & Code */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-cairo bg-white/95 text-brand-gold-dark border border-brand-border shadow-sm">
              {track.category}
            </span>
          </div>

          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-semibold bg-white/95 text-brand-text-muted border border-brand-borderSoft shadow-sm">
              {track.id}
            </span>
          </div>

          {/* Play / Pause Big Center Button Overlay */}
          <button
            onClick={() => togglePlay(track)}
            className="absolute inset-0 flex items-center justify-center m-auto w-14 h-14 rounded-full bg-gradient-to-r from-brand-gold to-amber-500 text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200 z-10"
            aria-label={isThisPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isThisLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : isThisPlaying ? (
              <Pause className="w-6 h-6 fill-current text-white" />
            ) : (
              <Play className="w-6 h-6 fill-current text-white translate-x-[-2px]" />
            )}
          </button>

          {/* Live Soundwaves indicator when playing */}
          {isThisPlaying && (
            <div className="absolute bottom-3 left-3 flex items-end gap-1 h-5 px-2 py-1 rounded-md bg-white/95 shadow-sm border border-brand-border">
              <span className="w-1 bg-brand-gold rounded-full animate-wave [animation-delay:0.1s] h-3" />
              <span className="w-1 bg-amber-500 rounded-full animate-wave [animation-delay:0.3s] h-5" />
              <span className="w-1 bg-brand-gold rounded-full animate-wave [animation-delay:0.2s] h-4" />
              <span className="w-1 bg-amber-400 rounded-full animate-wave [animation-delay:0.4s] h-2" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="space-y-1 mb-4">
          <h3 className="text-lg sm:text-xl font-bold font-amiri text-brand-text-primary group-hover:text-brand-gold-dark transition-colors line-clamp-1">
            {track.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-brand-text-muted font-tajawal">
            <span className="flex items-center gap-1 text-brand-gold-dark font-amiri font-bold text-sm">
              بصوت: {track.artist}
            </span>
            <span className="text-brand-text-muted font-mono">
              {isThisActive ? formatTime(activeDuration) : track.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Player Controls */}
      <div className="space-y-3 pt-3 border-t border-brand-borderSoft">
        
        {/* Progress Bar (Scrubbable) */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={activeDuration || 100}
              step="0.1"
              value={isThisActive ? activeCurrentTime : 0}
              onChange={handleSeekChange}
              disabled={!isThisActive}
              className="w-full h-1.5 bg-brand-ivory rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: `linear-gradient(to left, ${
                  isThisActive ? '#c99a2c' : '#d6d3d1'
                } ${progressPercent}%, #e7e5e4 ${progressPercent}%)`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-brand-text-muted">
            <span>{isThisActive ? formatTime(activeCurrentTime) : '00:00'}</span>
            <span>{isThisActive ? formatTime(activeDuration) : track.duration}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePlay(track)}
              className="p-2 rounded-xl bg-brand-ivory hover:bg-brand-border/60 border border-brand-borderSoft text-brand-gold-dark transition-colors"
              title={isThisPlaying ? 'إيقاف' : 'تشغيل'}
            >
              {isThisPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-brand-ivory hover:bg-brand-border/60 border border-brand-borderSoft text-brand-text-muted hover:text-brand-text-primary transition-colors"
              title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* WhatsApp Direct Order */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl font-cairo font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-gold to-amber-500 hover:brightness-105 shadow-sm transition-all flex items-center justify-center gap-2 group/btn"
          >
            <MessageCircle className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
            <span className="whitespace-nowrap">طلب عبر واتساب</span>
          </a>

        </div>

      </div>
    </div>
  );
};
