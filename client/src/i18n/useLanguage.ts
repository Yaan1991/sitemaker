import { useLocation } from "wouter";
import { translations } from "./translations";

export type Lang = 'ru' | 'en';

export function useLanguage() {
  const [location] = useLocation();

  const lang: Lang = location === '/en' || location.startsWith('/en/') ? 'en' : 'ru';
  const t = translations[lang];
  const prefix = lang === 'en' ? '/en' : '';

  return { lang, t, prefix };
}
