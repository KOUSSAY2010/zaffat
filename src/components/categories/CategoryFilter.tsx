import React from 'react';
import type { Category } from '../../types/track';
import { CATEGORIES_LIST } from '../../data/mockTracks';
import { Heart, Sparkles, GraduationCap, Cake, Gem, Baby, Calendar } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'زفات عروس':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 shrink-0" />;
      case 'زفات عريس':
        return <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'زفات مولودة':
        return <Baby className="w-4 h-4 text-pink-400 shrink-0" />;
      case 'زفات مولود':
        return <Baby className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'زفات تخرج بنت':
      case 'زفات تخرج ولد':
        return <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'زفات عيد ميلاد':
        return <Cake className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'زفات عقد قران':
        return <Gem className="w-4 h-4 text-brand-gold-dark shrink-0" />;
      case 'زفات ذكرى زواج':
        return <Calendar className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />;
    }
  };

  return (
    <section id="categories" className="py-8 sm:py-10 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-2 text-center md:text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-gold-dark font-bold mb-1 justify-center md:justify-start">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
              تصنيفات ومناسبات الأفراح
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cairo text-brand-text-primary">
              اختر المناسبة واستمتع بأروع الزفات
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-text-muted font-tajawal">
            تصفح التشكيلة بحسب نوع المناسبة السعيدة
          </p>
        </div>

        {/* Categories Tab Bar: Perfectly wrapping flex container */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          {CATEGORIES_LIST.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] ?? 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`group whitespace-nowrap shrink-0 inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-cairo text-xs sm:text-sm transition-all duration-200 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold text-white font-bold shadow-md border-transparent scale-[1.02]'
                    : 'bg-white hover:bg-brand-ivory text-brand-text-secondary hover:text-brand-text-primary border-brand-borderSoft hover:border-brand-border shadow-sm'
                }`}
              >
                <span>{getCategoryIcon(category)}</span>
                <span className="font-semibold">{category}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-brand-ivory text-brand-text-muted group-hover:text-brand-gold-dark'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
