import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://clinicadentalkoral.es',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-GB',
          de: 'de-DE',
          nl: 'nl-NL',
          fr: 'fr-FR'
        }
      }
    })
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de', 'nl', 'fr'],
    routing: {
      prefixDefaultLocale: false
    }
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: true
    }
  },

  compressHTML: true,

  image: {
    domains: ['clinicadentalkoral.es']
  }
});
