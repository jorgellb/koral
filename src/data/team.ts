import type { TranslationKey } from '../i18n/utils';

export type TeamMember = {
  name: string;
  role: TranslationKey;
  image: string;
  /** Dentists are listed as `Person` entities in structured data. */
  doctor?: boolean;
};

export const TEAM: TeamMember[] = [
  { name: 'Dra. Ana Padilla', role: 'role.director', image: '/equipo/Ana-padilla.jpg', doctor: true },
  { name: 'Dra. Ana Soler', role: 'role.ortho', image: '/equipo/ana-soler.jpg', doctor: true },
  { name: 'Dra. Ángeles Parra', role: 'role.endo', image: '/equipo/angeles-parrar.jpg', doctor: true },
  { name: 'Dra. Lorraynne Barbosa', role: 'role.general', image: '/equipo/Lorraynne-Barbosa.jpg', doctor: true },
  { name: 'Blaneirys Peña', role: 'role.hygienist', image: '/equipo/blaneirys.jpg' },
  { name: 'Minerva Aznar', role: 'role.hygienist', image: '/equipo/minerva.jpg' },
  { name: 'Ellé-Louise Warner', role: 'role.advisor', image: '/equipo/elle-louise-warner.jpg' },
  { name: 'Melina Bernkopf', role: 'role.reception', image: '/equipo/Melina-bernkopf.jpg' },
  { name: 'Ángela Pérez', role: 'role.assistant', image: '/equipo/angela-perez-.jpg' },
  { name: 'Anda Dorela', role: 'role.assistant', image: '/equipo/Anda-dorela.jpg' },
  { name: 'María Luisa Aguacil', role: 'role.assistant', image: '/equipo/maria-luisa.jpg' },
];
