import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, 'site');
const pages = fs.existsSync(root)
  ? fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f))
  : [];

export default defineConfig({
  root,
  build: { outDir: '../dist', emptyOutDir: true, rollupOptions: { input: pages } },
  server: { fs: { allow: [import.meta.dirname] } },
});
