// Entrance effects play once per visit (tab session); later views show the finished state.
const read = (k) => { try { return sessionStorage.getItem(k) === '1'; } catch { return false; } };
const write = (k) => { try { sessionStorage.setItem(k, '1'); } catch {} };
export const seen = read;
export const mark = write;
export const once = (k) => { if (read(k)) return false; write(k); return true; };
