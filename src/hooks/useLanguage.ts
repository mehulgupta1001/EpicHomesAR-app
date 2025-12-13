import { useState, useEffect } from 'react';
import { setLocale, getCurrentLocale, t } from '../constants/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@epic_homes_ar_language';

export const useLanguage = () => {
  const [locale, setLocaleState] = useState<'en' | 'ms'>('en');

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage === 'ms' || savedLanguage === 'en') {
          setLocale(savedLanguage);
          setLocaleState(savedLanguage);
        } else {
          // Default to English if no preference saved
          setLocale('en');
          setLocaleState('en');
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        // Default to English on error
        setLocale('en');
        setLocaleState('en');
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (newLocale: 'en' | 'ms') => {
    try {
      setLocale(newLocale);
      setLocaleState(newLocale);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ms' : 'en';
    changeLanguage(newLocale);
  };

  return {
    locale,
    changeLanguage,
    toggleLanguage,
    t,
  };
};

