/**
 * The Garrucha → clinic route (src/data/towns.ts) split into four legs for the
 * "10 minutes" timeline and the chart waypoints. Leg lengths come from the real
 * geometry and are scaled so they add up to the route's km; minutes are shared
 * out in proportion and always add up to the route's minutes. Approximate by
 * design: only the totals are exact.
 */
import { TOWNS } from '../../data/towns';

export const GARRUCHA_ROUTE = TOWNS.garrucha.routes[0];

/** Indices of the path points where each leg ends (first = origin). */
export const GARRUCHA_CUTS = [0, 4, 6, 13, GARRUCHA_ROUTE.path.length - 1];

const toRad = Math.PI / 180;
const haversine = ([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) => {
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
};
const bearing = ([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) => {
  const y = Math.sin((lon2 - lon1) * toRad) * Math.cos(lat2 * toRad);
  const x = Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) - Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos((lon2 - lon1) * toRad);
  return (Math.round(Math.atan2(y, x) / toRad) + 360) % 360;
};

export type GarruchaLeg = { road: string; km: number; min: number; share: number; course: number; from: number; to: number };

export const garruchaLegs = (): GarruchaLeg[] => {
  const { path, km, min, roads } = GARRUCHA_ROUTE;
  const raw = GARRUCHA_CUTS.slice(1).map((end, i) => {
    const start = GARRUCHA_CUTS[i];
    let d = 0;
    for (let j = start + 1; j <= end; j++) d += haversine(path[j - 1], path[j]);
    return { start, end, d };
  });
  const total = raw.reduce((s, r) => s + r.d, 0);
  // Largest-remainder rounding so the minutes add up exactly (at least 1 per leg)
  const exact = raw.map((r) => (r.d / total) * min);
  const mins = exact.map((e) => Math.max(1, Math.floor(e)));
  let left = min - mins.reduce((s, m) => s + m, 0);
  const order = exact.map((e, i) => [e - Math.floor(e), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) mins[order[k][1]]++;
  const names = ['Garrucha', ...roads];
  return raw.map((r, i) => ({
    road: names[i] ?? roads[roads.length - 1],
    km: Math.round((r.d / total) * km * 10) / 10,
    min: mins[i],
    share: r.d / total,
    course: bearing(path[r.start], path[r.end]),
    from: r.start,
    to: r.end,
  }));
};
