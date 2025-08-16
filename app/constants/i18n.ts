import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../../locales/en.json';
import ms from '../../locales/ms.json';

// Create i18n instance properly
const i18n = new I18n({
  en,
  ms,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
i18n.locale = deviceLang.startsWith('ms') ? 'ms' : 'en';

export const t = (key: string, config?: any) => i18n.t(key, config); 