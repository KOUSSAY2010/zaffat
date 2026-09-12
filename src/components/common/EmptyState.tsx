import React from 'react';
import { Music, Sparkles, MessageCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  categoryName?: string;
  showCustomOrderCta?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'لا توجد زفات في هذا القسم حالياً',
  description = 'يمكنك طلب تصميم وتنفيذ زفة خاصة وحصرية لك بالكامل بالأسماء والألحان التي تفضلها.',
  categoryName,
  showCustomOrderCta = true,
}) => {
  const dynamicMessage = categoryName && categoryName !== 'الكل'
    ? `لا توجد زفات في قسم "${categoryName}" حالياً`
    : title;

  const whatsappUrl = `https://wa.me/966500856597?text=${encodeURIComponent(
    `السلام عليكم، أود طلب تنفيذ زفة خاصة${categoryName && categoryName !== 'الكل' ? ` في قسم (${categoryName})` : ''}.`
  )}`;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 sm:my-10 p-6 sm:p-10 md:p-14 rounded-3xl bg-white border border-brand-border/60 shadow-soft text-center relative overflow-hidden">
      
      {/* Decorative background glow & festive shapes */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-brand-rose-soft rounded-full blur-2xl pointer-events-none" />
      
      {/* Floating subtle musical notes SVGs */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Soft Faded Musical Icon */}
        <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-brand-ivory border border-brand-border/80 flex items-center justify-center mb-5 sm:mb-6 shadow-sm relative group">
          <div className="absolute inset-0 rounded-full bg-brand-gold/10 animate-ping opacity-30" />
          <Music className="w-8 sm:w-10 h-8 sm:h-10 text-brand-gold/60 stroke-[1.5]" />
          <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-brand-gold absolute top-2 right-2 animate-pulse" />
        </div>

        {/* Beautiful Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-cairo text-brand-text-primary mb-2 sm:mb-3">
          {dynamicMessage}
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-brand-text-muted font-tajawal max-w-md mx-auto leading-relaxed mb-6 sm:mb-8">
          {description}
        </p>

        {/* Direct WhatsApp Custom Order Action */}
        {showCustomOrderCta && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-cairo font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:from-amber-500 hover:to-brand-gold shadow-md hover:shadow-gold-glow hover:scale-105 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span>طلب تنفيذ زفة خاصة بالاسم عبر واتساب</span>
          </a>
        )}

      </div>
    </div>
  );
};
