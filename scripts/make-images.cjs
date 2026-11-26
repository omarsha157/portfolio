// Renders the favicon set and the social preview image into public/.
// Run rarely (when the brand changes), inside the Playwright container:
//   docker run --rm -m 1g -v ~/portfolio:/w -w /w mcr.microsoft.com/playwright:v1.49.1-noble \
//     sh -c "cd /tmp && npm i -s playwright@1.49.1 >/dev/null && cd /w && NODE_PATH=/tmp/node_modules node scripts/make-images.cjs"
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
const INK = '#121211', BG = '#eeece7', LIGHT = '#f8f7f4', ACCENT = '#e4572e';

// 5x7 dot-matrix glyphs, matching the Doto look of the header tile.
const GLYPH = {
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
};
function mark({ rounded = true } = {}) {
  // 32-unit tile, glyph pixels 2 units with 0.3 gap, "OS" centred.
  let d = '';
  const px = 2.4, size = 2, w = 11 * px - (px - size), h = 7 * px - (px - size);
  const x0 = (32 - w) / 2, y0 = (32 - h) / 2;
  ['O', 'S'].forEach((ch, gi) => GLYPH[ch].forEach((row, j) => [...row].forEach((c, i) => {
    if (c === '#') d += `M${(x0 + (gi * 6 + i) * px).toFixed(2)} ${(y0 + j * px).toFixed(2)}h${size}v${size}h-${size}z`;
  })));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="${rounded ? 7 : 0}" fill="${INK}"/><path d="${d}" fill="${LIGHT}"/></svg>`;
}

function ico(pngs) { // ICO container holding PNG images
  const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length; const dir = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
    offset += buf.length; dir.push(e);
  }
  return Buffer.concat([head, ...dir, ...pngs.map((p) => p.buf)]);
}

(async () => {
  const { dotArt } = await import(path.join(ROOT, 'scripts/dot-art.js'));
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'favicon.svg'), mark());
  const browser = await chromium.launch();
  const render = async (svg, size, file) => {
    const p = await browser.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
    const buf = await p.screenshot({ omitBackground: true });
    if (file) fs.writeFileSync(path.join(OUT, file), buf);
    await p.close(); return buf;
  };
  const i16 = await render(mark(), 16), i32 = await render(mark(), 32), i48 = await render(mark(), 48);
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), ico([{ size: 16, buf: i16 }, { size: 32, buf: i32 }, { size: 48, buf: i48 }]));
  await render(mark({ rounded: false }), 180, 'apple-touch-icon.png');
  await render(mark(), 192, 'icon-192.png');
  await render(mark(), 512, 'icon-512.png');

  // Social preview, 1200x630, in the site's own type.
  const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource-variable', f)).toString('base64');
  const plain = (s) => s.replace(/\*/g, '');
  const art = dotArt('gear', { seed: 11, label: '' }).replace('<svg ', `<svg fill="${INK}" `);
  const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(`<style>
    @font-face{font-family:Doto;src:url(${font('doto/files/doto-latin-wght-normal.woff2')});font-weight:100 900}
    @font-face{font-family:Inter;src:url(${font('inter/files/inter-latin-wght-normal.woff2')});font-weight:100 900}
    html,body{margin:0}body{width:1200px;height:630px;background:${BG};color:${INK};font-family:Inter;box-sizing:border-box;padding:72px 80px;display:grid;grid-template-columns:1fr 330px;gap:40px;align-items:center}
    .k{font-size:22px;letter-spacing:.08em;text-transform:uppercase;color:#6b6862;margin:0 0 28px}
    h1{font:800 124px/.92 Doto;text-transform:uppercase;margin:0 0 34px}
    p.l{font-size:31px;line-height:1.35;margin:0;color:#6b6862;max-width:640px}p.l b{color:${INK};font-weight:500}
    .u{position:absolute;left:80px;bottom:56px;font-size:22px;display:flex;align-items:center;gap:12px}.u i{width:14px;height:14px;background:${ACCENT};display:block}
    svg{width:330px;height:auto}</style>
    <div><p class="k">${site.role} · ${site.location}</p><h1>${site.name}</h1><p class="l">${site.headline.replace(/\*([^*]+)\*/g, '<b>$1</b>')}</p></div>${art}
    <div class="u"><i></i>omarsha.com</div>`);
  await p.evaluate(() => document.fonts.ready);
  fs.writeFileSync(path.join(OUT, 'og.png'), await p.screenshot());
  await browser.close();
  console.log('wrote', fs.readdirSync(OUT).join(', '));
})();
