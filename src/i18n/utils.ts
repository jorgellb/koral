import { ui, defaultLang } from './ui';
import { extra } from './extra';

type Lang = keyof typeof ui;
export type TranslationKey = keyof (typeof ui)[typeof defaultLang] | keyof (typeof extra)[typeof defaultLang];

// Redesign strings (extra.ts) are layered on top of the original ones (ui.ts).
const dictionaries = Object.fromEntries(
  (Object.keys(ui) as Lang[]).map((lang) => [lang, { ...ui[lang], ...extra[lang] }]),
) as Record<Lang, Record<TranslationKey, string>>;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return dictionaries[lang]?.[key] || dictionaries[defaultLang][key];
  };
}
