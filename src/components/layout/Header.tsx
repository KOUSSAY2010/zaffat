import React, { useState } from 'react';
import { Music2, MessageCircle, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onNavigateAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappDirectUrl = `https://wa.me/966500856597?text=${encodeURIComponent(
    'السلام عليكم، أود الاستفسار عن خدمات زفات أطياف وتفاصيل الأسعار والحجوزات.'
  )}`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-brand-borderSoft shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gold to-amber-500 p-0.5 shadow-sm group-hover:shadow-gold-glow transition-all duration-300">
              <div className="w-full h-full bg-brand-ivory rounded-[14px] flex items-center justify-center">
                <Music2 className="w-6 h-6 text-brand-gold-dark group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-normal font-rakkas tracking-wide text-brand-text-primary group-hover:text-brand-gold-dark transition-colors">
                زفات أطياف
              </span>
              <span className="text-sm text-brand-gold-dark font-amiri font-semibold tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                فخامة اللحظة وصوت الفرح
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-text-secondary font-tajawal">
            <a href="#hero" className="hover:text-brand-gold-dark transition-colors duration-200">الرئيسية</a>
            <a href="#pricing" className="hover:text-brand-gold-dark transition-colors duration-200">الأسعار والباقات</a>
            <a href="#categories" className="hover:text-brand-gold-dark transition-colors duration-200">أقسام الزفات</a>
            <a href="#artists" className="hover:text-brand-gold-dark transition-colors duration-200">أصوات الفنانين</a>
            <a href="#tracks" className="hover:text-brand-gold-dark transition-colors duration-200">المكتبة الصوتية</a>
          </nav>

          {/* Quick Contact Button & Admin Link */}
          <div className="hidden sm:flex items-center gap-3">
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="p-2.5 rounded-xl text-brand-text-muted hover:text-brand-gold-dark bg-brand-ivory/60 hover:bg-brand-ivory border border-brand-borderSoft transition-all shadow-xs"
                title="لوحة الإدارة"
                aria-label="لوحة الإدارة"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden px-5 py-2.5 rounded-full font-cairo font-bold text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:from-amber-500 hover:to-brand-gold transition-all duration-300 shadow-sm hover:shadow-gold-glow flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>تواصل سريع</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="p-2.5 rounded-xl text-brand-text-muted hover:text-brand-gold-dark bg-brand-ivory border border-brand-borderSoft"
                title="لوحة الإدارة"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-brand-text-secondary hover:text-brand-gold-dark bg-brand-ivory border border-brand-borderSoft"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-brand-borderSoft px-6 py-5 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3 text-base font-tajawal font-medium text-brand-text-secondary">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-gold-dark transition-colors"
            >
              الرئيسية
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-gold-dark transition-colors"
            >
              الأسعار والباقات
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-gold-dark transition-colors"
            >
              أقسام الزفات
            </a>
            <a
              href="#artists"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-gold-dark transition-colors"
            >
              أصوات الفنانين
            </a>
            <a
              href="#tracks"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-gold-dark transition-colors"
            >
              المكتبة الصوتية
            </a>
          </nav>
          <div className="pt-3 border-t border-brand-borderSoft flex flex-col gap-2">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-cairo font-bold text-center text-sm text-white bg-gradient-to-r from-brand-gold to-amber-500 flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل واتساب فوري</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
