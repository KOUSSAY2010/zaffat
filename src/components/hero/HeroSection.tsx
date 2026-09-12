import React from 'react';
import { Music, Headphones, ShieldCheck, Zap, MessageCircle, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreTracks?: () => void;
  newWordsPrice?: number;
  editPrice?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreTracks,
  newWordsPrice = 1000,
  editPrice = 500,
}) => {
  const customOrderUrl = `https://wa.me/966500856597?text=${encodeURIComponent(
    'السلام عليكم، أرغب في طلب تصميم وتنفيذ زفة خاصة وجديدة بالكامل.'
  )}`;

  return (
    <section id="hero" className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-music-pattern border-b border-brand-borderSoft/60">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-rose-soft/80 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Decorative Musical Elements (Light SVGs) */}
      <div className="absolute top-12 left-8 text-brand-gold/20 animate-float-slow pointer-events-none hidden lg:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
      <div className="absolute bottom-16 right-10 text-brand-gold/20 animate-float-slow pointer-events-none hidden lg:block" style={{ animationDelay: '1.5s' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal font-rakkas text-brand-text-primary leading-[1.3] sm:leading-tight">
            أصواتٌ تُخلّد الفرحة..{' '}
            <span className="bg-gradient-to-l from-brand-gold-dark via-amber-600 to-brand-gold bg-clip-text text-transparent">
              وزفاتٌ تُعانق السماء
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary font-amiri leading-relaxed max-w-3xl mx-auto px-2">
            نصنع لأفراحكم ومناسباتكم الغالية أجمل الألحان بأعذب أصوات نخبة نجوم الخليج والعالم العربي.
            هندسة صوتية فائقة الدقة وكلمات صُممت خصيصاً لتليق بليلتكم المميزة.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a
              href="#tracks"
              onClick={onExploreTracks}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-2xl font-cairo font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold shadow-sm hover:shadow-gold-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Headphones className="w-5 h-5" />
              <span>استمع إلى النماذج والزفات</span>
            </a>

            <a
              href={customOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-2xl font-cairo font-bold text-sm sm:text-base text-brand-text-primary bg-white hover:bg-brand-ivory border border-brand-border hover:border-brand-gold transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>طلب زفة خاصة بالأسماء</span>
            </a>
          </div>

          {/* Pricing Highlight Banner (كلمات جديدة: 1000 ريال / تعديل: 500 ريال) */}
          <div id="pricing" className="pt-8 sm:pt-10 max-w-4xl mx-auto w-full">
            <div className="relative group rounded-3xl p-0.5 bg-gradient-to-r from-brand-gold/40 via-amber-400/40 to-brand-gold/40 shadow-soft overflow-hidden">
              <div className="bg-white rounded-[22px] p-5 sm:p-7 md:p-8 border border-brand-borderSoft/80 overflow-hidden">
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  
                  {/* Title & Badge */}
                  <div className="text-center lg:text-right shrink-0">
                    <div className="inline-flex items-center gap-2 mb-1.5 justify-center lg:justify-start">
                      <Zap className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-bold font-cairo">باقات الأسعار المعتمدة</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-amiri text-brand-text-primary">
                      شفافية مطلقة وأسعار تبدأ من:
                    </h3>
                  </div>

                  {/* Price Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full lg:w-auto flex-1 max-w-lg">
                    
                    {/* New Lyrics */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border hover:border-brand-gold transition-colors">
                      <div className="text-right">
                        <span className="block text-xs font-amiri text-brand-text-muted font-semibold mb-0.5">كلمات جديدة بالكامل</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black font-amiri text-brand-gold-dark leading-none">{newWordsPrice}</span>
                          <span className="text-xs text-brand-gold-dark font-amiri font-bold">ريال</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-brand-gold/15 text-brand-gold-dark border border-brand-gold/30 shrink-0 font-cairo">
                        تنفيذ خاص
                      </span>
                    </div>

                    {/* Modification */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border hover:border-brand-gold transition-colors">
                      <div className="text-right">
                        <span className="block text-xs font-amiri text-brand-text-muted font-semibold mb-0.5">تعديل زفة جاهزة</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black font-amiri text-amber-600 leading-none">{editPrice}</span>
                          <span className="text-xs text-brand-gold-dark font-amiri font-bold">ريال</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 font-cairo">
                        تعديل فوري
                      </span>
                    </div>

                  </div>
                </div>

                {/* Features bar */}
                <div className="mt-6 pt-5 border-t border-brand-borderSoft grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-text-secondary font-tajawal font-medium text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ضمان الرضا وتعديل مجاني</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Music className="w-4 h-4 text-brand-gold-dark shrink-0" />
                    <span>جودة صوتية أصلية Studio Master</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>تسليم سريع خلال 24 - 48 ساعة</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
