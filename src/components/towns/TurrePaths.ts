/**
 * Compact SVG path helpers for the Turre page (contour lines and rings).
 * Curves are quadratic segments through the midpoints of the input polyline,
 * written with relative integer coordinates to keep the HTML small.
 */
type Pt = readonly [number, number];

/** Joins numbers the short SVG way: "5-3 9" instead of "5 -3 9". */
const nums = (ns: number[]) => ns.reduce((s, n, i) => s + (i && n >= 0 ? ' ' : '') + n, '');

/** Smooth path through `pts`; `closed` ends with Z and wraps around. */
export const smoothPath = (pts: Pt[], closed = false): string => {
  if (pts.length < 3) return '';
  const p = closed ? [...pts, pts[0], pts[1]] : pts;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const r = (v: number) => Math.round(v);
  const start = closed ? mid(p[0], p[1]) : p[0];
  let cx = r(start[0]);
  let cy = r(start[1]);
  let d = `M${nums([cx, cy])}`;
  for (let k = 1; k < p.length - 1; k++) {
    const [mx, my] = mid(p[k], p[k + 1]);
    const qx = r(p[k][0]);
    const qy = r(p[k][1]);
    const ex = r(mx);
    const ey = r(my);
    d += `q${nums([qx - cx, qy - cy, ex - cx, ey - cy])}`;
    cx = ex;
    cy = ey;
  }
  if (closed) return `${d}Z`;
  const last = p[p.length - 1];
  return `${d}l${nums([r(last[0]) - cx, r(last[1]) - cy])}`;
};

/** Organic concentric rings (never crossing) around a centre. */
export const contourRings = (cx: number, cy: number, n: number, r0: number, gap: number, seed: number, stretch = 1.25) =>
  Array.from({ length: n }, (_, k) => {
    const r = r0 + k * gap;
    const pts = Array.from({ length: 18 }, (_, s): Pt => {
      const th = (s / 18) * Math.PI * 2;
      const w = 1 + 0.07 * Math.sin(3 * th + seed + k * 0.12) + 0.04 * Math.sin(5 * th + seed * 2 - k * 0.08);
      return [cx + Math.cos(th) * r * w * stretch, cy + Math.sin(th) * r * w];
    });
    return smoothPath(pts, true);
  });
