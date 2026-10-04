export const SUPPORTED_LOCALES = ['en', 'es'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleMetadata {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LOCALES_METADATA: Record<Locale, LocaleMetadata> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸',
  },
  es: {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸',
  },
};

export const LOCALE_STORAGE_KEY = 'luxe_estate_locale';
