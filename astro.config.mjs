import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
