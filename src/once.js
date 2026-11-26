// Entrance effects (name particles, title decoding, 3D art fly-in):
// - play on every fresh load: a refresh, or arriving from another site / a typed URL;
// - play once while moving between pages inside the site (in-app navigation, back/forward).
const PREFIXES = ['intro:', 'decode:'];
const read = (k) => { try { return sessionStorage.getItem(k) === '1'; } catch { return false; } };
const write = (k) => { try { sessionStorage.setItem(k, '1'); } catch {} };

(function resetOnFreshLoad() {
  const nav = performance.getEntriesByType?.('navigation')[0];
  let internal = false;
  try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch {}
  const fresh = nav?.type === 'reload' || !internal;
  if (!fresh) return;
  try {
    for (const k of Object.keys(sessionStorage)) if (PREFIXES.some((p) => k.startsWith(p))) sessionStorage.removeItem(k);
  } catch {}
})();

export const seen = read;
export const mark = write;
export const once = (k) => { if (read(k)) return false; write(k); return true; };
