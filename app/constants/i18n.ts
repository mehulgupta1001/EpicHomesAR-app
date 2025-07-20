import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from '../../locales/en.json';
import ms from '../../locales/ms.json';

// @ts-ignore
i18n.fallbacks = true;
// @ts-ignore
i18n.translations = { en, ms };
// @ts-ignore
const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
// @ts-ignore
i18n.locale = deviceLang.startsWith('ms') ? 'ms' : 'en';

// @ts-ignore
export const t = (key: string, config?: any) => i18n.t(key, config); 