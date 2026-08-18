import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from '@/types';

import uk from '@/locales/uk.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';

const messages = { uk, ru, en } as const;

type Dict = typeof uk;

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'alexora-lang';

function detectInitialLang(): Language {
  if (typeof window === 'undefined') return 'uk';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'uk' || stored === 'ru' || stored === 'en') return stored;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('uk')) return 'uk';
  if (browser.startsWith('ru')) return 'ru';
  if (browser.startsWith('en')) return 'en';
  return 'uk';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('uk');

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: messages[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
