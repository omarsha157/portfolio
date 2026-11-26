// Hero name as GPU particles: the dot-matrix "OMAR SHA" is sampled into small squares that
// pour in on load, scatter away from the pointer and drift apart on scroll.
// The real <h1> stays in the page (for search, screen readers and as the fallback);
// it is only made transparent once the particles are drawing.
import { WebGLRenderer, Scene, OrthographicCamera, BufferGeometry, BufferAttribute, Points, ShaderMaterial, Color } from 'three';

const vert = /* glsl */ `
attribute vec2 aTarget;
attribute vec2 aStart;
attribute float aSeed;
attribute float aKind;
attribute float aSize;          // 0 = letter, 1 = dust, 2 = accent dust
uniform vec2 uRes;
uniform float uTime, uIntro, uScroll, uSize, uRadius, uPush, uDpr, uLetters;
uniform vec2 uMouse;
varying float vAlpha;
varying float vKind;

void main() {
  vec2 p;
  float alpha = 1.0;
  if (aKind < 0.5) {
    // Letters: staggered ease from the scattered start to the glyph.
    float t = clamp(uIntro * 1.7 - aSeed * 0.7, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 4.0);
    vec2 swirl = vec2(-(aTarget.y - aStart.y), aTarget.x - aStart.x) * 0.18 * sin(t * 3.14159);
    p = mix(aStart, aTarget, e) + swirl;
    alpha = smoothstep(0.0, 0.25, t) * uLetters;
  } else {
    // Dust: slow drift around its home position.
    p = aTarget + vec2(sin(uTime * 0.21 + aSeed * 40.0), cos(uTime * 0.17 + aSeed * 31.0)) * 14.0;
    alpha = (aKind > 1.5 ? 0.85 : 0.25) * smoothstep(0.0, 1.0, uIntro * 2.0 - aSeed);
  }

  // Pointer: push particles out of a soft circle, with a little per-particle jitter.
  vec2 d = p - uMouse;
  float dist = length(d);
  float f = smoothstep(uRadius, 0.0, dist) * uPush;
  p += (d / max(dist, 0.001)) * f * uRadius * (0.35 + aSeed * 0.45);

  // Scroll: the name lifts and comes apart as the hero leaves the screen.
  float s = uScroll;
  p += vec2((aSeed - 0.5) * 2.2, -0.6 - aSeed) * s * s * uRes.y * 0.9;
  alpha *= 1.0 - smoothstep(0.35, 0.95, s);

  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  float size = aKind < 0.5 ? aSize * (1.0 - 0.45 * f) : uSize * (aKind > 1.5 ? 0.9 : 0.6);
  gl_PointSize = max(1.0, size * uDpr);
  vAlpha = alpha;
  vKind = aKind;
}`;

const frag = /* glsl */ `
precision mediump float;
uniform vec3 uInk, uAccent;
varying float vAlpha;
varying float vKind;
void main() {
  gl_FragColor = vec4(vKind > 1.5 ? uAccent : uInk, vAlpha);
  #include <colorspace_fragment>
}`;

export function start(h1, { intro = true } = {}) {
  const hero = h1.closest('.hero');
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  } catch { canvas.remove(); return null; }
  const dpr = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);  // positions are set in the shader
  const css = getComputedStyle(document.documentElement);
  const uniforms = {
    uRes: { value: [1, 1] }, uTime: { value: 0 }, uIntro: { value: 0 }, uScroll: { value: 0 },
    uSize: { value: 3 }, uRadius: { value: 90 }, uPush: { value: 0 }, uDpr: { value: dpr }, uLetters: { value: 1 },
    uMouse: { value: [-9999, -9999] },
    uInk: { value: new Color(css.getPropertyValue('--ink').trim() || '#121211') },
    uAccent: { value: new Color(css.getPropertyValue('--accent').trim() || '#e4572e') },
  };
  const material = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthTest: false, depthWrite: false });
  let points = null;
  let origin = { x: 0, y: 0 };
  let nameBox = { x0: 0, y0: 0, x1: 0, y1: 0 };  // the letters' extent, canvas px

  // Sample the h1's glyphs where the browser actually laid them out (handles wrapping and spacing).
  function build() {
    const W = document.documentElement.clientWidth;
    const heroBox = hero.getBoundingClientRect();
    const H = Math.ceil(heroBox.height);
    origin = { x: heroBox.left, y: heroBox.top };
    canvas.style.left = `${-heroBox.left}px`;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    renderer.setSize(W, H, false);
    uniforms.uRes.value = [W, H];

    const fs = parseFloat(getComputedStyle(h1).fontSize);
    const step = Math.max(2, Math.round(fs / 30));
    uniforms.uSize.value = step;
    uniforms.uRadius.value = Math.max(34, fs * 0.6);

    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.font = `800 ${fs}px "Doto Variable"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#000';
    const node = [...h1.childNodes].find((n) => n.nodeType === 3);
    const text = node.textContent;
    const range = document.createRange();
    for (let i = 0; i < text.length; i++) {
      if (!text[i].trim()) continue;
      range.setStart(node, i); range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      // Place the baseline where the browser put it: centre the font's ascent+descent in the glyph box.
      const m = ctx.measureText(text[i].toUpperCase());
      const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
      ctx.fillText(text[i].toUpperCase(), r.left + r.width / 2, r.top - heroBox.top + (r.height - asc - desc) / 2 + asc);
    }
    const data = ctx.getImageData(0, 0, W, H).data;
    const hb = h1.getBoundingClientRect();
    nameBox = { x0: hb.left, y0: hb.top - heroBox.top, x1: hb.right, y1: hb.bottom - heroBox.top };

    // Find each round dot of the font (connected ink), then tile it exactly with small squares,
    // so at rest the particles reproduce the font's dots rather than a resampled grid.
    const x0 = Math.max(0, Math.floor(nameBox.x0) - 4), x1 = Math.min(W, Math.ceil(nameBox.x1) + 4);
    const y0 = Math.max(0, Math.floor(nameBox.y0) - 4), y1 = Math.min(H, Math.ceil(nameBox.y1) + 4);
    const ink = (x, y) => data[(y * W + x) * 4 + 3] >= 128;
    const seen = new Uint8Array(W * H), stack = [], dots = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (seen[y * W + x] || !ink(x, y)) continue;
      let bx0 = x, bx1 = x, by0 = y, by1 = y;
      stack.push(x, y); seen[y * W + x] = 1;
      while (stack.length) {
        const cy = stack.pop(), cx = stack.pop();
        if (cx < bx0) bx0 = cx; if (cx > bx1) bx1 = cx; if (cy < by0) by0 = cy; if (cy > by1) by1 = cy;
        for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
          if (nx < x0 || nx >= x1 || ny < y0 || ny >= y1 || seen[ny * W + nx] || !ink(nx, ny)) continue;
          seen[ny * W + nx] = 1; stack.push(nx, ny);
        }
      }
      dots.push([bx0, by0, bx1 + 1, by1 + 1]);
    }
    const sizes = dots.map((d) => Math.min(d[2] - d[0], d[3] - d[1])).sort((a, b) => a - b);
    const dotSize = sizes[sizes.length >> 1] || step;
    const n = Math.max(1, Math.round(dotSize / Math.max(2, step)));  // sub-squares per dot side
    const sub = dotSize / n;
    const target = [], start = [], seed = [], kind = [], size = [];
    for (const [ax, ay, bx, by] of dots) {
      const cols = Math.max(1, Math.round((bx - ax) / sub)), rows = Math.max(1, Math.round((by - ay) / sub));
      const sw = (bx - ax) / cols, sh = (by - ay) / rows;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const cx = ax + (i + 0.5) * sw, cy = ay + (j + 0.5) * sh;
        if (!ink(Math.min(W - 1, Math.floor(cx)), Math.min(H - 1, Math.floor(cy)))) continue;
        target.push(cx, cy); size.push(Math.max(sw, sh));
        const a = Math.random() * Math.PI * 2, r = (0.35 + Math.random() * 0.65) * Math.max(W, H) * 0.7;
        start.push(W / 2 + Math.cos(a) * r, H * 0.45 + Math.sin(a) * r * 0.6);
        seed.push(Math.random()); kind.push(0);
      }
    }
    const dust = Math.round(Math.min(110, W * 0.08));
    for (let i = 0; i < dust; i++) {
      target.push(Math.random() * W, Math.random() * H);
      start.push(0, 0); seed.push(Math.random()); kind.push(Math.random() < 0.12 ? 2 : 1); size.push(step);
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(kind.length * 3), 3));
    geo.setAttribute('aTarget', new BufferAttribute(new Float32Array(target), 2));
    geo.setAttribute('aStart', new BufferAttribute(new Float32Array(start), 2));
    geo.setAttribute('aSeed', new BufferAttribute(new Float32Array(seed), 1));
    geo.setAttribute('aKind', new BufferAttribute(new Float32Array(kind), 1));
    geo.setAttribute('aSize', new BufferAttribute(new Float32Array(size), 1));
    if (points) { scene.remove(points); points.geometry.dispose(); }
    points = new Points(geo, material);
    points.frustumCulled = false;
    scene.add(points);
  }

  // Pointer: smoothed position; the push fades out when the pointer rests or leaves.
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, last: 0 };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    if (mouse.x < -9000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    mouse.last = performance.now();
  };
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerdown', onMove, { passive: true });

  let raf = 0, visible = true, t0 = performance.now(), introDone = !intro, lastText = intro ? 0 : 1;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    uniforms.uTime.value = t;
    uniforms.uIntro.value = introDone ? 1 : Math.min(1, t / 2.2);
    if (uniforms.uIntro.value >= 1) introDone = true;
    mouse.x += (mouse.tx - mouse.x) * 0.18; mouse.y += (mouse.ty - mouse.y) * 0.18;
    uniforms.uMouse.value = [mouse.x, mouse.y];
    const want = now - mouse.last < 900 ? 1 : 0;
    uniforms.uPush.value += (want - uniforms.uPush.value) * (want ? 0.15 : 0.04);
    uniforms.uScroll.value = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight * 0.9)));
    // At rest the real dot-matrix text is shown; particles take over only while something moves
    // the letters (intro, a pointer near them, scrolling). Both are aligned, so the swap is invisible.
    const R = uniforms.uRadius.value;
    const near = mouse.x > nameBox.x0 - R && mouse.x < nameBox.x1 + R && mouse.y > nameBox.y0 - R && mouse.y < nameBox.y1 + R;
    const busy = !introDone || uniforms.uScroll.value > 0.002 || (near && uniforms.uPush.value > 0.01) || (uniforms.uPush.value > 0.01 && uniforms.uLetters.value > 0.5);
    const L = uniforms.uLetters.value + ((busy ? 1 : 0) - uniforms.uLetters.value) * (busy ? 0.5 : 0.25);
    uniforms.uLetters.value = L < 0.01 ? 0 : L > 0.99 ? 1 : L;
    const textOn = 1 - uniforms.uLetters.value;
    if (textOn !== lastText) { h1.style.color = textOn ? `rgb(18 18 17 / ${textOn})` : ''; lastText = textOn; }
    renderer.render(scene, camera);
  }
  const run = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); });
  io.observe(hero);
  const onVis = () => (document.hidden ? stop() : run());
  document.addEventListener('visibilitychange', onVis);
  let rt;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { introDone = true; build(); }, 150); };
  addEventListener('resize', onResize);

  build();
  if (!intro) { uniforms.uIntro.value = 1; uniforms.uLetters.value = 0; h1.style.color = 'rgb(18 18 17 / 1)'; }
  hero.classList.add('particles-on');
  run();

  return function dispose() {
    stop(); io.disconnect();
    removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onMove);
    removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis);
    points?.geometry.dispose(); material.dispose(); renderer.dispose(); canvas.remove();
    hero.classList.remove('particles-on'); h1.style.color = '';
  };
}
