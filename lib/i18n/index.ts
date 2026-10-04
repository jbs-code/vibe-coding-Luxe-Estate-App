import { en, Dictionary } from './dictionaries/en';
import { es } from './dictionaries/es';
import { Locale } from './config';

export * from './config';
export { en, es };
export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
