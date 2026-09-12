import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  return (
    <div className="relative flex items-center w-full max-w-md">
      <div className="relative w-full">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-brand-gold">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم الزفة، الفنان، أو الكود..."
          className="w-full pr-11 pl-10 py-3 rounded-2xl bg-white border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary placeholder-brand-text-light focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-text-light hover:text-brand-text-primary"
            title="مسح البحث"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-1 mr-3 text-xs text-brand-text-muted font-tajawal whitespace-nowrap">
        <span>({totalResults} نتيجة)</span>
      </div>
    </div>
  );
};
