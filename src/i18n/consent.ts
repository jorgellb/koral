import { useTranslations } from './utils';
import { pathFor, type Lang } from './routes';

/** Consent sentence for forms, linking to the legal pages in the visitor's language. */
export const consentHtml = (lang: Lang) => {
  const t = useTranslations(lang);
  const link = (href: string, label: string) =>
    `<a href="${href}" target="_blank" rel="noopener" class="font-semibold text-accent underline underline-offset-2">${label}</a>`;
  return t('consent.text')
    .replace('{privacy}', link(pathFor('privacy', lang), t('consent.privacy')))
    .replace('{legal}', link(pathFor('legal', lang), t('consent.legal')));
};
