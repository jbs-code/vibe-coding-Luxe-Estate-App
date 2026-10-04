'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALES_METADATA,
  LocaleMetadata,
} from './config';
import { dictionaries, Dictionary, getDictionary } from './index';
import { PropertyCategory, PropertyStatus } from '@/types/property';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  locales: typeof LOCALES_METADATA;
  currentLocaleMeta: LocaleMetadata;
  interpolate: (template: string, params: Record<string, string | number>) => string;
  getLocalizedCategory: (category: PropertyCategory | string) => string;
  getLocalizedAmenity: (amenity: string) => string;
  getLocalizedTag: (tag?: string) => string | undefined;
  getLocalizedStatusBadge: (status: PropertyStatus | string) => string;
  getLocalizedPricePeriod: (period?: string) => string | undefined;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined' || !window.navigator) {
    return DEFAULT_LOCALE;
  }

  // 1. Check local storage
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      return saved;
    }
  } catch {
    // localStorage might be unavailable in private browsing
  }

  // 2. Check navigator.languages / navigator.language
  const browserLangs = window.navigator.languages || [window.navigator.language];
  for (const lang of browserLangs) {
    if (!lang) continue;
    const cleanLang = lang.toLowerCase().split('-')[0] as Locale;
    if (SUPPORTED_LOCALES.includes(cleanLang)) {
      return cleanLang;
    }
  }

  return DEFAULT_LOCALE;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Initialize and detect on client mount
  useEffect(() => {
    const detected = detectBrowserLocale();
    setLocaleState(detected);
    document.documentElement.lang = detected;
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      // Also set cookie for SSR / middleware compatibility if needed
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
    document.documentElement.lang = newLocale;
  }, []);

  const t = useMemo(() => getDictionary(locale), [locale]);

  const interpolate = useCallback(
    (template: string, params: Record<string, string | number>): string => {
      if (!template) return '';
      return Object.entries(params).reduce(
        (acc, [key, val]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val)),
        template
      );
    },
    []
  );

  const getLocalizedCategory = useCallback(
    (category: PropertyCategory | string): string => {
      const catKey = category.toLowerCase() as keyof Dictionary['categories'];
      return t.categories[catKey] || category;
    },
    [t]
  );

  const getLocalizedAmenity = useCallback(
    (amenity: string): string => {
      const localized = t.amenities[amenity as keyof Dictionary['amenities']];
      return localized || amenity;
    },
    [t]
  );

  const getLocalizedTag = useCallback(
    (tag?: string): string | undefined => {
      if (!tag) return undefined;
      const lower = tag.toLowerCase().trim();
      if (lower === 'exclusive' || lower === 'exclusivo') return t.featured.exclusive;
      if (lower === 'new arrival' || lower === 'nuevo ingreso' || lower === 'nuevo') return t.featured.newArrival;
      if (lower === 'premium') return t.featured.premium;
      return tag;
    },
    [t]
  );

  const getLocalizedStatusBadge = useCallback(
    (status: PropertyStatus | string): string => {
      const lower = status.toLowerCase();
      if (lower === 'rent' || lower === 'alquiler') {
        return t.status.forRentBadge;
      }
      return t.status.forSaleBadge;
    },
    [t]
  );

  const getLocalizedPricePeriod = useCallback(
    (period?: string): string | undefined => {
      if (!period) return undefined;
      if (period.includes('mo') || period.includes('mes')) {
        return t.propertyDetails.pricePerMonth;
      }
      return period;
    },
    [t]
  );

  const value: LanguageContextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      locales: LOCALES_METADATA,
      currentLocaleMeta: LOCALES_METADATA[locale] || LOCALES_METADATA[DEFAULT_LOCALE],
      interpolate,
      getLocalizedCategory,
      getLocalizedAmenity,
      getLocalizedTag,
      getLocalizedStatusBadge,
      getLocalizedPricePeriod,
    }),
    [
      locale,
      setLocale,
      t,
      interpolate,
      getLocalizedCategory,
      getLocalizedAmenity,
      getLocalizedTag,
      getLocalizedStatusBadge,
      getLocalizedPricePeriod,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
