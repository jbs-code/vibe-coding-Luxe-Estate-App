'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyCategory } from '@/types/property';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMENITY_OPTIONS = [
  { id: 'Swimming Pool', icon: 'pool' },
  { id: 'Gym', icon: 'fitness_center' },
  { id: 'Parking', icon: 'local_parking' },
  { id: 'Air Conditioning', icon: 'ac_unit' },
  { id: 'High-speed Wifi', icon: 'wifi' },
  { id: 'Patio / Terrace', icon: 'deck' },
];

const PROPERTY_TYPES: PropertyCategory[] = [
  'all',
  'house',
  'apartment',
  'villa',
  'penthouse',
  'studio',
];

const MIN_LIMIT = 0;
const MAX_LIMIT = 20000000;
const STEP = 100000;

function formatPriceDisplay(price: number): string {
  if (price >= 1000000) {
    const val = (price / 1000000).toFixed(1).replace('.0', '');
    return `$${val}M`;
  }
  if (price >= 1000) {
    const val = Math.round(price / 1000);
    return `$${val}K`;
  }
  return `$${price}`;
}

function formatNumberWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, getLocalizedCategory, getLocalizedAmenity } = useLanguage();

  // Local state for all filters
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState<number>(MIN_LIMIT);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_LIMIT);
  const [propertyType, setPropertyType] = useState<PropertyCategory>('all');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Initialize from searchParams when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const q = searchParams.get('q') || '';
    const type = (searchParams.get('type') as PropertyCategory) || 'all';
    const minP = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : MIN_LIMIT;
    const maxP = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : MAX_LIMIT;
    const beds = searchParams.get('beds') ? Number(searchParams.get('beds')) : 0;
    const baths = searchParams.get('baths') ? Number(searchParams.get('baths')) : 0;
    const amenitiesParam = searchParams.get('amenities');
    const amList = amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : [];

    setLocation(q);
    setPropertyType(type);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setBedrooms(beds);
    setBathrooms(baths);
    setSelectedAmenities(amList);
  }, [isOpen, searchParams]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleAmenity = useCallback((id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  const handleClear = () => {
    setLocation('');
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setPropertyType('all');
    setBedrooms(0);
    setBathrooms(0);
    setSelectedAmenities([]);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (location.trim()) {
      params.set('q', location.trim());
    } else {
      params.delete('q');
    }

    if (propertyType && propertyType !== 'all') {
      params.set('type', propertyType);
    } else {
      params.delete('type');
    }

    if (minPrice > MIN_LIMIT) {
      params.set('minPrice', minPrice.toString());
    } else {
      params.delete('minPrice');
    }

    if (maxPrice < MAX_LIMIT) {
      params.set('maxPrice', maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    if (bedrooms > 0) {
      params.set('beds', bedrooms.toString());
    } else {
      params.delete('beds');
    }

    if (bathrooms > 0) {
      params.set('baths', bathrooms.toString());
    } else {
      params.delete('baths');
    }

    if (selectedAmenities.length > 0) {
      params.set('amenities', selectedAmenities.join(','));
    } else {
      params.delete('amenities');
    }

    // Reset pagination
    params.delete('page');

    router.push(`?${params.toString()}`, { scroll: false });
    onClose();
  };

  if (!isOpen) return null;

  // Percentage calculations for dual range visual
  const minPercent = Math.min(100, Math.max(0, ((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Container */}
      <main className="relative z-50 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t.filters.modalTitle}
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 cursor-pointer"
            aria-label={t.filters.closeFilters}
          >
            <span className="material-icons text-xl block">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scroll p-6 sm:p-8 space-y-8 sm:space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t.filters.location}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque dark:group-focus-within:text-hint-of-green transition-colors">
                location_on
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-background-light dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-mosque dark:focus:ring-hint-of-green focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm outline-none text-sm sm:text-base"
                placeholder={t.filters.locationPlaceholder}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.filters.priceRange}
              </label>
              <span className="text-sm font-medium text-mosque dark:text-hint-of-green">
                {formatPriceDisplay(minPrice)} – {maxPrice >= MAX_LIMIT ? '$20M+' : formatPriceDisplay(maxPrice)}
              </span>
            </div>

            {/* Custom Range Slider Track */}
            <div className="relative h-12 flex items-center mb-6 px-2">
              <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="absolute h-full bg-mosque dark:bg-hint-of-green rounded-full"
                  style={{
                    left: `${minPercent}%`,
                    width: `${Math.max(0, maxPercent - minPercent)}%`,
                  }}
                />
              </div>

              {/* Dual Range Inputs (Transparent Overlays) */}
              <input
                type="range"
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                step={STEP}
                value={minPrice}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), maxPrice - STEP);
                  setMinPrice(val);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto h-12 z-20"
              />
              <input
                type="range"
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                step={STEP}
                value={maxPrice}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), minPrice + STEP);
                  setMaxPrice(val);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto h-12 z-20"
              />

              {/* Visual Handles */}
              <div
                className="absolute w-6 h-6 bg-white border-2 border-mosque dark:border-hint-of-green rounded-full shadow-md pointer-events-none -ml-3 z-10"
                style={{ left: `${minPercent}%` }}
              />
              <div
                className="absolute w-6 h-6 bg-white border-2 border-mosque dark:border-hint-of-green rounded-full shadow-md pointer-events-none -ml-3 z-10"
                style={{ left: `${maxPercent}%` }}
              />
            </div>

            {/* Min / Max Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background-light dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/40 dark:focus-within:border-hint-of-green/40 transition-colors">
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                  {t.filters.minPrice}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm outline-none"
                    type="text"
                    value={formatNumberWithCommas(minPrice)}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                      setMinPrice(Math.min(num, maxPrice));
                    }}
                  />
                </div>
              </div>
              <div className="bg-background-light dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/40 dark:focus-within:border-hint-of-green/40 transition-colors">
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                  {t.filters.maxPrice}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm outline-none"
                    type="text"
                    value={formatNumberWithCommas(maxPrice)}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                      setMaxPrice(Math.max(num, minPrice));
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.filters.propertyType}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyCategory)}
                  className="w-full bg-background-light dark:bg-gray-800 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-mosque dark:focus:ring-hint-of-green cursor-pointer outline-none text-sm sm:text-base shadow-sm"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt} value={pt} className="dark:bg-gray-800">
                      {pt === 'all' ? t.filters.anyType : getLocalizedCategory(pt)}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-3.5 text-gray-400 pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            {/* Rooms (Bedrooms & Bathrooms) */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.filters.bedrooms}
                </span>
                <div className="flex items-center space-x-3 bg-background-light dark:bg-gray-800 rounded-full p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setBedrooms((prev) => Math.max(0, prev - 1))}
                    disabled={bedrooms === 0}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque dark:hover:text-hint-of-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-8 text-center text-gray-900 dark:text-white">
                    {bedrooms === 0 ? t.filters.any : `${bedrooms}+`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBedrooms((prev) => Math.min(8, prev + 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque dark:text-hint-of-green hover:bg-mosque hover:text-white dark:hover:bg-hint-of-green dark:hover:text-nordic-dark transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.filters.bathrooms}
                </span>
                <div className="flex items-center space-x-3 bg-background-light dark:bg-gray-800 rounded-full p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setBathrooms((prev) => Math.max(0, prev - 1))}
                    disabled={bathrooms === 0}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque dark:hover:text-hint-of-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-8 text-center text-gray-900 dark:text-white">
                    {bathrooms === 0 ? t.filters.any : `${bathrooms}+`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBathrooms((prev) => Math.min(8, prev + 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque dark:text-hint-of-green hover:bg-mosque hover:text-white dark:hover:bg-hint-of-green dark:hover:text-nordic-dark transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities & Features */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {t.filters.amenitiesAndFeatures}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                const localizedAmenity = getLocalizedAmenity(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`relative cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'border-mosque bg-mosque/5 dark:bg-hint-of-green/10 text-mosque dark:text-hint-of-green shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span
                      className={`material-icons text-lg ${
                        isSelected ? 'text-mosque dark:text-hint-of-green' : 'text-gray-400'
                      }`}
                    >
                      {amenity.icon}
                    </span>
                    <span>{localizedAmenity}</span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-mosque dark:bg-hint-of-green rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 sm:px-8 py-5 sm:py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4 cursor-pointer"
          >
            {t.filters.clearAll}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-mosque hover:bg-mosque/90 dark:bg-hint-of-green dark:text-nordic-dark dark:hover:bg-hint-of-green/90 text-white px-7 sm:px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            <span>{t.filters.showHomes}</span>
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
};
