import { defaultLang, languages } from './ui';

export type Lang = keyof typeof languages;
export const LANGS = Object.keys(languages) as Lang[];

export const SITE_URL = 'https://clinicadentalkoral.es';

/**
 * Every page of the site, keyed by a stable id, with its URL in each language.
 * This is the single source of truth for hreflang, the language switcher,
 * breadcrumbs, menus and internal links.
 */
export const ROUTES = {
  home: { es: '/', en: '/en/', de: '/de/', nl: '/nl/', fr: '/fr/' },
  team: { es: '/equipo/', en: '/en/equipo/', de: '/de/equipo/', nl: '/nl/equipo/', fr: '/fr/equipo/' },
  contact: { es: '/contacto/', en: '/en/contacto/', de: '/de/contacto/', nl: '/nl/contacto/', fr: '/fr/contacto/' },
  pricing: {
    es: '/precio-y-financiacion/',
    en: '/en/pricing-and-financing/',
    de: '/de/pricing-and-financing/',
    nl: '/nl/pricing-and-financing/',
    fr: '/fr/pricing-and-financing/',
  },
  ortodoncia: { es: '/ortodoncia/', en: '/en/ortodoncia/', de: '/de/ortodoncia/', nl: '/nl/ortodoncia/', fr: '/fr/ortodoncia/' },
  implantes: {
    es: '/implantes-dentales/',
    en: '/en/implantes-dentales/',
    de: '/de/implantes-dentales/',
    nl: '/nl/implantes-dentales/',
    fr: '/fr/implantes-dentales/',
  },
  odontopediatria: {
    es: '/odontopediatria/',
    en: '/en/odontopediatria/',
    de: '/de/odontopediatria/',
    nl: '/nl/odontopediatria/',
    fr: '/fr/odontopediatria/',
  },
  endodoncia: { es: '/endodoncia/', en: '/en/endodoncia/', de: '/de/endodoncia/', nl: '/nl/endodoncia/', fr: '/fr/endodoncia/' },
  estetica: {
    es: '/estetica-dental/',
    en: '/en/estetica-dental/',
    de: '/de/estetica-dental/',
    nl: '/nl/estetica-dental/',
    fr: '/fr/estetica-dental/',
  },
  rehabilitacion: {
    es: '/rehabilitacion-oral/',
    en: '/en/rehabilitacion-oral/',
    de: '/de/rehabilitacion-oral/',
    nl: '/nl/rehabilitacion-oral/',
    fr: '/fr/rehabilitacion-oral/',
  },
  periodoncia: { es: '/periodoncia/', en: '/en/periodoncia/', de: '/de/periodoncia/', nl: '/nl/periodoncia/', fr: '/fr/periodoncia/' },
  cirugia: { es: '/cirugia-oral/', en: '/en/cirugia-oral/', de: '/de/cirugia-oral/', nl: '/nl/cirugia-oral/', fr: '/fr/cirugia-oral/' },
  armonia: {
    es: '/armonia-orofacial/',
    en: '/en/armonia-orofacial/',
    de: '/de/armonia-orofacial/',
    nl: '/nl/armonia-orofacial/',
    fr: '/fr/armonia-orofacial/',
  },
  legal: {
    es: '/aviso-legal/',
    en: '/en/legal-notice/',
    de: '/de/impressum/',
    nl: '/nl/juridische-mededeling/',
    fr: '/fr/mentions-legales/',
  },
  privacy: {
    es: '/politica-privacidad/',
    en: '/en/privacy-policy/',
    de: '/de/datenschutz/',
    nl: '/nl/privacybeleid/',
    fr: '/fr/politique-de-confidentialite/',
  },
  cookies: { es: '/cookies/', en: '/en/cookie-policy/', de: '/de/cookies/', nl: '/nl/cookies/', fr: '/fr/cookies/' },
  // Local landing pages: the hub and one page per town the clinic serves.
  areas: {es: '/dentista-levante-almeriense/', en: '/en/dentist-levante-almeriense/', de: '/de/zahnarzt-levante-almeriense/', nl: '/nl/tandarts-levante-almeriense/', fr: '/fr/dentiste-levante-almeriense/' },
  vera: {es: '/dentista-vera/', en: '/en/dentist-vera/', de: '/de/zahnarzt-vera/', nl: '/nl/tandarts-vera/', fr: '/fr/dentiste-vera/' },
  garrucha: {es: '/dentista-garrucha/', en: '/en/dentist-garrucha/', de: '/de/zahnarzt-garrucha/', nl: '/nl/tandarts-garrucha/', fr: '/fr/dentiste-garrucha/' },
  mojacar: {es: '/dentista-mojacar/', en: '/en/dentist-mojacar/', de: '/de/zahnarzt-mojacar/', nl: '/nl/tandarts-mojacar/', fr: '/fr/dentiste-mojacar/' },
  cuevas: {es: '/dentista-cuevas-del-almanzora/', en: '/en/dentist-cuevas-del-almanzora/', de: '/de/zahnarzt-cuevas-del-almanzora/', nl: '/nl/tandarts-cuevas-del-almanzora/', fr: '/fr/dentiste-cuevas-del-almanzora/' },
  palomares: {es: '/dentista-palomares/', en: '/en/dentist-palomares/', de: '/de/zahnarzt-palomares/', nl: '/nl/tandarts-palomares/', fr: '/fr/dentiste-palomares/' },
  antas: {es: '/dentista-antas/', en: '/en/dentist-antas/', de: '/de/zahnarzt-antas/', nl: '/nl/tandarts-antas/', fr: '/fr/dentiste-antas/' },
  turre: {es: '/dentista-turre/', en: '/en/dentist-turre/', de: '/de/zahnarzt-turre/', nl: '/nl/tandarts-turre/', fr: '/fr/dentiste-turre/' },
  gallardos: {es: '/dentista-los-gallardos/', en: '/en/dentist-los-gallardos/', de: '/de/zahnarzt-los-gallardos/', nl: '/nl/tandarts-los-gallardos/', fr: '/fr/dentiste-los-gallardos/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof ROUTES;

/** Legal pages are kept out of the index and the sitemap (thin content). */
export const NOINDEX_ROUTES: RouteKey[] = ['legal', 'privacy', 'cookies'];

export type TreatmentKey =
  | 'ortodoncia'
  | 'implantes'
  | 'odontopediatria'
  | 'endodoncia'
  | 'estetica'
  | 'rehabilitacion'
  | 'periodoncia'
  | 'cirugia'
  | 'armonia';

/** Treatments in menu order, with the translation keys used to label them. */
export const TREATMENTS: { key: TreatmentKey; label: string; desc: string }[] = [
  { key: 'implantes', label: 'nav.treatments.implantes', desc: 'treatments.implantes.desc' },
  { key: 'ortodoncia', label: 'nav.treatments.ortodoncia', desc: 'treatments.ortodoncia.desc' },
  { key: 'estetica', label: 'nav.treatments.estetica', desc: 'treatments.estetica.desc' },
  { key: 'endodoncia', label: 'nav.treatments.endodoncia', desc: 'treatments.endodoncia.desc' },
  { key: 'odontopediatria', label: 'nav.treatments.odontopediatria', desc: 'treatments.odontopediatria.desc' },
  { key: 'periodoncia', label: 'nav.treatments.periodoncia', desc: 'treatments.periodoncia.desc' },
  { key: 'rehabilitacion', label: 'nav.treatments.rehabilitacion', desc: 'treatments.rehabilitacion.desc' },
  { key: 'cirugia', label: 'nav.treatments.cirugia', desc: 'treatments.cirugia.desc' },
  { key: 'armonia', label: 'nav.treatments.armonia', desc: 'treatments.relleno.desc' },
];

/**
 * Hand-picked "related treatments" for internal linking: each treatment
 * links to the ones a patient is most likely to need next.
 */
export const RELATED: Record<TreatmentKey, TreatmentKey[]> = {
  implantes: ['cirugia', 'rehabilitacion', 'periodoncia'],
  ortodoncia: ['estetica', 'odontopediatria', 'periodoncia'],
  estetica: ['ortodoncia', 'armonia', 'rehabilitacion'],
  endodoncia: ['rehabilitacion', 'cirugia', 'implantes'],
  odontopediatria: ['ortodoncia', 'endodoncia', 'periodoncia'],
  periodoncia: ['implantes', 'cirugia', 'estetica'],
  rehabilitacion: ['implantes', 'estetica', 'periodoncia'],
  cirugia: ['implantes', 'periodoncia', 'rehabilitacion'],
  armonia: ['estetica', 'ortodoncia', 'rehabilitacion'],
};

export type TownKey = 'vera' | 'garrucha' | 'mojacar' | 'cuevas' | 'palomares' | 'antas' | 'turre' | 'gallardos';

/** Towns with their own landing page, ordered by distance to the clinic. */
export const TOWN_KEYS: TownKey[] = ['vera', 'garrucha', 'cuevas', 'palomares', 'antas', 'gallardos', 'turre', 'mojacar'];

export const HTML_LANG: Record<Lang, string> = { es: 'es-ES', en: 'en-GB', de: 'de-DE', nl: 'nl-NL', fr: 'fr-FR' };
export const OG_LOCALE: Record<Lang, string> = { es: 'es_ES', en: 'en_GB', de: 'de_DE', nl: 'nl_NL', fr: 'fr_FR' };

const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/** URL of a page in a given language. */
export const pathFor = (key: RouteKey, lang: Lang | string): string =>
  ROUTES[key][(lang in languages ? lang : defaultLang) as Lang];

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

/** Finds which page a pathname belongs to (in any language). */
export const routeKeyFromPath = (pathname: string): RouteKey | undefined => {
  const normalized = withSlash(pathname);
  return (Object.keys(ROUTES) as RouteKey[]).find((key) =>
    LANGS.some((lang) => ROUTES[key][lang] === normalized),
  );
};

/** hreflang alternates for a pathname, or undefined if the page is not in the map. */
export const alternatesFor = (pathname: string) => {
  const key = routeKeyFromPath(pathname);
  if (!key) return undefined;
  return LANGS.map((lang) => ({ lang, href: absoluteUrl(ROUTES[key][lang]) }));
};
