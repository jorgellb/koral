import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rename, rm } from 'node:fs/promises';

// Cloudflare Pages serves the nearest `404.html` with a 404 status, so each
// language folder needs its own file (Astro emits them as /xx/404/index.html).
const localizedNotFound = () => ({
  name: 'localized-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      for (const lang of ['en', 'de', 'nl', 'fr']) {
        await rename(new URL(`${lang}/404/index.html`, dir), new URL(`${lang}/404.html`, dir));
        await rm(new URL(`${lang}/404/`, dir), { recursive: true });
      }
    },
  },
});

// Fully static site. The only dynamic part, the form email endpoint, is a
// Cloudflare Pages Function in /functions/api/send-email.js.
export default defineConfig({
  site: 'https://clinicadentalkoral.es',
  integrations: [
    sitemap({
      // Legal pages are noindex (see src/i18n/routes.ts), so keep them out of the sitemap.
      filter: (page) =>
        !/\/(aviso-legal|politica-privacidad|cookies|legal-notice|privacy-policy|cookie-policy|impressum|datenschutz|juridische-mededeling|privacybeleid|mentions-legales|politique-de-confidentialite)\/$/.test(
          new URL(page).pathname,
        ),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-GB',
          de: 'de-DE',
          nl: 'nl-NL',
          fr: 'fr-FR',
        },
      },
    }),
    localizedNotFound(),
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de', 'nl', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
