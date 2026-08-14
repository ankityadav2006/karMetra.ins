import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

const TRANSLATIONS: Record<SupportedLanguage, any> = { en, hi, mr };
const STORAGE_KEY = 'karmetra_app_language';

export function getStoredLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch (e) {}
  return 'en';
}

export function setStoredLanguage(lang: SupportedLanguage) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  } catch (e) {}
}

export function directT(key: string, lang: SupportedLanguage = 'en', fallback?: string): string {
  const parts = key.split('.');
  let dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  for (const part of parts) {
    if (dict && typeof dict === 'object' && part in dict) {
      dict = dict[part];
    } else {
      dict = undefined;
      break;
    }
  }
  if (typeof dict === 'string') return dict;

  // Fallback to English
  let fallbackDict = TRANSLATIONS.en;
  for (const part of parts) {
    if (fallbackDict && typeof fallbackDict === 'object' && part in fallbackDict) {
      fallbackDict = fallbackDict[part];
    } else {
      fallbackDict = undefined;
      break;
    }
  }
  if (typeof fallbackDict === 'string') return fallbackDict;

  return fallback || key;
}

interface I18nContextType {
  lang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => getStoredLanguage());

  const setLanguage = (newLang: SupportedLanguage) => {
    setStoredLanguage(newLang);
    setLangState(newLang);
  };

  const t = (key: string, fallback?: string): string => {
    return directT(key, lang, fallback);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
export const useTranslation = () => useContext(I18nContext);
export const t = directT;
