import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import pt from './locales/pt.json';
import en from './locales/en.json';

const i18n = new I18n({
  en,
  pt,
});

// REMOVE or COMMENT OUT the following line
// i18n.locale = Localization.getLocales()[0].languageCode;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

export default i18n;