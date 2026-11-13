import { TOWNS, CLINIC } from './towns';
import { SITE_URL, HTML_LANG, absoluteUrl, pathFor, type Lang, type TownKey } from '../i18n/routes';

/**
 * Structured data for a town landing page. The clinic stays in Vera (no fake
 * local address): the town is the `areaServed` of a dental Service provided by
 * the Dentist entity defined in Layout.astro. FAQ and breadcrumbs are emitted by
 * their own components.
 */
export const townSchema = (opts: { town: TownKey; lang: Lang; title: string; description: string; serviceName: string }) => {
  const town = TOWNS[opts.town];
  const url = absoluteUrl(pathFor(opts.town, opts.lang));
  const main = town.routes[0];
  const place = {
    '@type': 'City',
    '@id': `${SITE_URL}/#place-${town.key}`,
    name: town.name,
    geo: { '@type': 'GeoCoordinates', latitude: town.lat, longitude: town.lon },
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Almería, Andalucía, España' },
  };
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: opts.title,
        description: opts.description,
        inLanguage: HTML_LANG[opts.lang],
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#dentist` },
        mainEntity: { '@id': `${url}#service` },
        spatialCoverage: { '@id': place['@id'] },
        audience: { '@type': 'PeopleAudience', geographicArea: { '@id': place['@id'] } },
        lastReviewed: '2026-11-13',
      },
      place,
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: opts.serviceName,
        serviceType: 'Dentistry',
        provider: { '@id': `${SITE_URL}/#dentist` },
        areaServed: { '@id': place['@id'] },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: url,
          servicePhone: { '@type': 'ContactPoint', telephone: '+34950395319', availableLanguage: ['es', 'en', 'de', 'nl', 'fr'] },
          serviceLocation: {
            '@type': 'Place',
            name: 'Clínica Dental Koral',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Av. de Baria, 4, local',
              addressLocality: 'Vera',
              postalCode: '04620',
              addressRegion: 'Almería',
              addressCountry: 'ES',
            },
            geo: { '@type': 'GeoCoordinates', latitude: CLINIC.lat, longitude: CLINIC.lon },
          },
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'distanceKm', value: main.km },
          { '@type': 'PropertyValue', name: 'drivingTimeMinutes', value: main.min },
        ],
      },
    ],
  });
};
