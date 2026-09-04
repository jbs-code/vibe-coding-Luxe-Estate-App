'use client';

import React from 'react';
import { PropertyCategory } from '@/types/property';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  onToggleFiltersModal?: () => void;
}

const CATEGORIES: { label: string; value: PropertyCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Penthouse', value: 'penthouse' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  onToggleFiltersModal,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.();
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
          Find your{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium dark:text-hint-of-green">sanctuary</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 dark:bg-hint-of-green/20 -rotate-1 z-0 rounded-sm" />
          </span>
          .
        </h1>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted dark:text-hint-of-green/60 text-2xl group-focus-within:text-mosque dark:group-focus-within:text-hint-of-green transition-colors">
              search
            </span>
          </div>
          <input
            id="property-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-12 pr-28 sm:pr-32 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 dark:placeholder-white/40 focus:ring-2 focus:ring-mosque dark:focus:ring-hint-of-green focus:bg-white dark:focus:bg-white/10 transition-all text-base sm:text-lg outline-none"
            placeholder="Search by city, neighborhood, or address..."
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-5 sm:px-6 bg-mosque hover:bg-mosque/90 dark:bg-hint-of-green dark:text-nordic-dark dark:hover:bg-hint-of-green/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer text-sm sm:text-base"
          >
            Search
          </button>
        </form>

        {/* Category Pills & Filters */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark shadow-lg shadow-nordic-dark/10 -translate-y-0.5'
                    : 'bg-white dark:bg-white/5 border border-nordic-dark/5 dark:border-white/10 text-nordic-muted dark:text-hint-of-green/70 hover:text-nordic-dark dark:hover:text-hint-of-green hover:border-mosque/50 hover:bg-mosque/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          <div className="w-px h-6 bg-nordic-dark/10 dark:bg-white/10 mx-2 flex-shrink-0" />

          <button
            onClick={onToggleFiltersModal}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark dark:text-hint-of-green/80 hover:dark:text-hint-of-green font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="material-icons text-base">tune</span>
            <span>Filters</span>
          </button>
        </div>
      </div>
    </section>
  );
};
