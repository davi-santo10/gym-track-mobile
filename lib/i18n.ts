import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './locales/en.json';
import pt from './locales/pt.json';

const i18n = new I18n({
  en,
  pt,
});

// Set the locale based on device language
i18n.locale = Localization.getLocales()[0].languageCode || 'en';

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

// Configure default options for interpolation
i18n.defaultLocale = 'en';

// Helper function for pluralization
export const t = (key: string, options: any = {}) => {
  if (options.count !== undefined) {
    const pluralKey = options.count === 1 ? `${key}_one` : `${key}_other`;
    return i18n.t(pluralKey, options);
  }
  return i18n.t(key, options);
};

export default i18n;