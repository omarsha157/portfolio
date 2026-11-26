// Hero name as GPU particles: the dot-matrix "OMAR SHA" is sampled into small squares that
// pour in on load, scatter away from the pointer and drift apart on scroll.
// The real <h1> stays in the page (for search, screen readers and as the fallback);
// it is only made transparent once the particles are drawing.
import { WebGLRenderer, Scene, OrthographicCamera, BufferGeometry, BufferAttribute, Points, ShaderMaterial, Color } from 'three';

const vert = /* glsl */ `
attribute vec2 aTarget;
attribute vec2 aStart;
attribute float aSeed;
attribute float aKind;          // 0 = letter, 1 = dust, 2 = accent dust
uniform vec2 uRes;
uniform float uTime, uIntro, uScroll, uSize, uRadius, uPush, uDpr;
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
    alpha = smoothstep(0.0, 0.25, t);
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
  float size = aKind < 0.5 ? uSize * (1.0 - 0.45 * f) : uSize * (aKind > 1.5 ? 0.9 : 0.6);
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
}`;

export function start(h1) {
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
    uSize: { value: 3 }, uRadius: { value: 90 }, uPush: { value: 0 }, uDpr: { value: dpr },
    uMouse: { value: [-9999, -9999] },
    uInk: { value: new Color(css.getPropertyValue('--ink').trim() || '#121211') },
    uAccent: { value: new Color(css.getPropertyValue('--accent').trim() || '#e4572e') },
  };
  const material = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthTest: false, depthWrite: false });
  let points = null;
  let origin = { x: 0, y: 0 };

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

    const target = [], start = [], seed = [], kind = [];
    for (let y = step / 2; y < H; y += step) {
      for (let x = step / 2; x < W; x += step) {
        if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] < 128) continue;
        target.push(x, y);
        const a = Math.random() * Math.PI * 2, r = (0.35 + Math.random() * 0.65) * Math.max(W, H) * 0.7;
        start.push(W / 2 + Math.cos(a) * r, H * 0.45 + Math.sin(a) * r * 0.6);
        seed.push(Math.random()); kind.push(0);
      }
    }
    const dust = Math.round(Math.min(110, W * 0.08));
    for (let i = 0; i < dust; i++) {
      target.push(Math.random() * W, Math.random() * H);
      start.push(0, 0); seed.push(Math.random()); kind.push(Math.random() < 0.12 ? 2 : 1);
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(kind.length * 3), 3));
    geo.setAttribute('aTarget', new BufferAttribute(new Float32Array(target), 2));
    geo.setAttribute('aStart', new BufferAttribute(new Float32Array(start), 2));
    geo.setAttribute('aSeed', new BufferAttribute(new Float32Array(seed), 1));
    geo.setAttribute('aKind', new BufferAttribute(new Float32Array(kind), 1));
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

  let raf = 0, visible = true, t0 = performance.now(), introDone = false;
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
  hero.classList.add('particles-on');
  run();

  return function dispose() {
    stop(); io.disconnect();
    removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onMove);
    removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis);
    points?.geometry.dispose(); material.dispose(); renderer.dispose(); canvas.remove();
    hero.classList.remove('particles-on');
  };
}
