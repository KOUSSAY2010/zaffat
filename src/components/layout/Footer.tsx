import React from 'react';
import { Music2, MessageCircle, Phone, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  const whatsappUrl = `https://wa.me/966500856597?text=${encodeURIComponent(
    'السلام عليكم، أود الاستفسار عن تفاصيل الزفات والخدمات الصوتية.'
  )}`;

  return (
    <footer className="bg-white border-t border-brand-borderSoft pt-16 pb-24 text-brand-text-muted font-tajawal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-amber-500 p-0.5 shadow-sm">
                <div className="w-full h-full bg-brand-ivory rounded-[10px] flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-brand-gold-dark" />
                </div>
              </div>
              <span className="text-3xl font-normal font-rakkas text-brand-text-primary">
                زفات أطياف
              </span>
            </div>

            <p className="text-base font-amiri leading-relaxed max-w-md text-brand-text-secondary">
              مؤسسة متخصصة في إنتاج وتوزيع أرقى الزفات والشيلات الحصرية بأصوات كبار فناني الخليج والعالم العربي. نقدم هندسة صوتية باحترافية استوديوهات عالمية لتخليد أجمل ليالي العمر.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-brand-ivory border border-brand-borderSoft flex items-center justify-center text-emerald-600 hover:text-white hover:bg-emerald-600 transition-colors shadow-sm"
                title="واتساب"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="tel:0500856597"
                className="w-10 h-10 rounded-xl bg-brand-ivory border border-brand-borderSoft flex items-center justify-center text-brand-gold-dark hover:text-white hover:bg-brand-gold transition-colors shadow-sm"
                title="اتصال هاتف"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold font-cairo text-brand-text-primary">روابط سريعة</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="#hero" className="hover:text-brand-gold-dark transition-colors">الرئيسية</a></li>
              <li><a href="#pricing" className="hover:text-brand-gold-dark transition-colors">قائمة الأسعار والخدمات</a></li>
              <li><a href="#categories" className="hover:text-brand-gold-dark transition-colors">أقسام ومناسبات الزفات</a></li>
              <li><a href="#artists" className="hover:text-brand-gold-dark transition-colors">أصوات الفنانين</a></li>
              <li><a href="#tracks" className="hover:text-brand-gold-dark transition-colors">المكتبة الصوتية</a></li>
              {onNavigateAdmin && (
                <li>
                  <button
                    onClick={onNavigateAdmin}
                    className="text-brand-gold-dark/80 hover:text-brand-gold-dark transition-colors flex items-center gap-1 text-xs font-bold pt-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>دخول لوحة الإدارة</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-base font-bold font-cairo text-brand-text-primary">خدمة العملاء والطلب</h4>
            <p className="text-sm text-brand-text-secondary">
              متاحون للرد على استفساراتكم وتنفيذ حجوزاتكم على مدار الساعة.
            </p>
            <div className="p-3.5 rounded-2xl bg-brand-ivory/80 border border-brand-borderSoft space-y-1 text-xs">
              <div className="text-brand-gold-dark font-bold font-mono text-sm" dir="ltr">
                +966 50 085 6597
              </div>
              <div className="text-brand-text-muted">المملكة العربية السعودية وجميع دول الخليج</div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-brand-borderSoft flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-text-light font-medium">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} لـ <span className="text-brand-gold-dark font-bold">زفات أطياف</span>
          </div>
          <div className="flex items-center gap-1">
            <span>صُنعت بكل</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>لأفراحكم السعيدة</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
