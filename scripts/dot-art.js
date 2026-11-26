// Build-time dot-matrix illustrations: a density field sampled on a grid,
// drawn as squares whose size follows the density. One <path> per piece, no JS.

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Each shape maps (x, y) in 0..1 to a density 0..1.
export const shapes = {
  // A loop with a gap and an arrowhead: the fix cycle.
  loop(x, y) {
    const dx = x - 0.5, dy = (y - 0.5) * 1.15;
    const r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    const R = 0.3;
    let d = Math.exp(-(((r - R) / 0.055) ** 2));
    if (a > -0.35 && a < 0.35) d *= 0.08;                 // the gap
    const hx = 0.5 + R * Math.cos(-0.5), hy = 0.5 + (R * Math.sin(-0.5)) / 1.15;
    const h = Math.hypot(x - hx, (y - hy) * 1.15);
    d = Math.max(d, h < 0.085 ? 1 - h / 0.085 : 0);        // arrowhead blob
    const core = Math.hypot(dx, dy);
    d = Math.max(d, core < 0.06 ? 0.9 : 0);                 // the point being healed
    return d;
  },
  // A gear: a ring with teeth around a hollow hub — the app running itself.
  gear(x, y) {
    const dx = x - 0.5, dy = (y - 0.5) * 1.15;
    const r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    const teeth = 10;
    const tooth = Math.cos(a * teeth) > 0.2 ? 0.075 : 0;   // square-ish teeth
    const outer = 0.28 + tooth, inner = 0.19, hub = 0.085;
    if (r > outer || r < hub) return 0;
    if (r < inner) return r < hub + 0.035 ? 0.9 : 0.12;     // thin hub ring, light web
    return 0.95;
  },
  // An isometric cube with three faces at three densities: one object, many faces.
  cube(x, y) {
    const cx = 0.5, cy = 0.52, s = 0.34;
    const px = (x - cx) / s, py = (y - cy) / (s * 1.15);
    const k = Math.sqrt(3) / 2;
    // pointy-top hexagon of radius 1 = the cube's outline
    const ax = Math.abs(px), ay = Math.abs(py);
    const out = Math.max(ax - k, ay - (1 - ax / (2 * k)));
    if (out > 0) return out < 0.07 ? 0.12 : 0;
    // a one-cell seam along the three inner edges so the faces read apart
    const seam = Math.min(ax < 0.06 && py > 0 ? 0 : 1, Math.abs(py + ax / (2 * k)) < 0.06 ? 0 : 1);
    if (!seam) return 0;
    if (py < -ax / (2 * k)) return 1;      // top face
    return px < 0 ? 0.55 : 0.18;           // left / right faces
  },
};

// The squares of an illustration: [x, y, size] in viewBox units (10 per cell).
export function dotCells(kind, { cols = 46, rows = 40, seed = 7 } = {}) {
  const f = shapes[kind];
  const rand = rng(seed);
  const step = 10, cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = (i + 0.5) / cols, y = (j + 0.5) / rows;
      let v = f(x, y);
      v += (rand() - 0.5) * 0.14;                       // grain
      if (v < 0.12) { if (rand() > 0.985) v = 0.25; else continue; } // sparse speckle
      const size = Math.max(1, Math.min(7, Math.round(1 + v * 6)));
      cells.push([i * step + (step - size) / 2, j * step + (step - size) / 2, size]);
    }
  }
  return cells;
}

export function dotArt(kind, { cols = 46, rows = 40, seed = 7, label = '' } = {}) {
  const d = dotCells(kind, { cols, rows, seed }).map(([x, y, s]) => `M${x} ${y}h${s}v${s}h-${s}z`).join('');
  return `<svg class="dot-art" viewBox="0 0 ${cols * 10} ${rows * 10}" role="img" aria-label="${label}"><path d="${d}"/></svg>`;
}
