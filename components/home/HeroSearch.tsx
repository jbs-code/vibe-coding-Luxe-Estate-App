'use client';

import React, { useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyCategory, PropertyStatusFilter } from '@/types/property';
import { SearchFilterModal } from './SearchFilterModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface HeroSearchProps {
  searchQuery: string;
  selectedCategory: PropertyCategory;
  statusFilter: PropertyStatusFilter;
}

const CATEGORY_VALUES: PropertyCategory[] = ['all', 'house', 'apartment', 'villa', 'penthouse', 'studio'];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  selectedCategory,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { t, getLocalizedCategory } = useLanguage();

  // Count active extra filters from URL
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const beds = searchParams.get('beds');
  const baths = searchParams.get('baths');
  const amenities = searchParams.get('amenities');
  const activeFilterCount = [minPrice, maxPrice, beds, baths, amenities].filter(Boolean).length;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter change
      params.delete('page');
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string) ?? '';
    updateParam('q', q);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
          {t.hero.titlePrefix}{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium dark:text-hint-of-green">
              {t.hero.titleHighlight}
            </span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 dark:bg-hint-of-green/20 -rotate-1 z-0 rounded-sm" />
          </span>
          {t.hero.titleSuffix}
        </h1>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted dark:text-hint-of-green/60 text-2xl group-focus-within:text-mosque dark:group-focus-within:text-hint-of-green transition-colors">
              search
            </span>
          </div>
          <input
            id="property-search-input"
            name="q"
            type="text"
            defaultValue={searchQuery}
            className="block w-full pl-12 pr-28 sm:pr-32 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 dark:placeholder-white/40 focus:ring-2 focus:ring-mosque dark:focus:ring-hint-of-green focus:bg-white dark:focus:bg-white/10 transition-all text-base sm:text-lg outline-none"
            placeholder={t.hero.searchPlaceholder}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-5 sm:px-6 bg-mosque hover:bg-mosque/90 dark:bg-hint-of-green dark:text-nordic-dark dark:hover:bg-hint-of-green/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer text-sm sm:text-base"
          >
            {t.hero.searchButton}
          </button>
        </form>

        {/* Category Pills & Filter Modal Button */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {CATEGORY_VALUES.map((catValue) => {
            const isSelected = selectedCategory === catValue;
            const localizedLabel = getLocalizedCategory(catValue);
            return (
              <button
                key={catValue}
                onClick={() => updateParam('type', catValue)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark shadow-lg shadow-nordic-dark/10 -translate-y-0.5'
                    : 'bg-white dark:bg-white/5 border border-nordic-dark/5 dark:border-white/10 text-nordic-muted dark:text-hint-of-green/70 hover:text-nordic-dark dark:hover:text-hint-of-green hover:border-mosque/50 hover:bg-mosque/5'
                }`}
              >
                {localizedLabel}
              </button>
            );
          })}

          <div className="w-px h-6 bg-nordic-dark/10 dark:bg-white/10 mx-1 flex-shrink-0" />

          {/* Button to open Filters Modal */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer shadow-sm ${
              activeFilterCount > 0
                ? 'bg-mosque text-white dark:bg-hint-of-green dark:text-nordic-dark shadow-mosque/20 -translate-y-0.5'
                : 'bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white hover:border-mosque/50 hover:bg-mosque/5'
            }`}
          >
            <span className="material-icons text-lg">tune</span>
            <span>{t.hero.filtersButton}</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-white text-mosque dark:bg-nordic-dark dark:text-hint-of-green">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Filter Modal */}
      <SearchFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </section>
  );
};
