// 3D project art: the flat dot illustration, turned into blocks.
// Every square of the SVG becomes a cube of the same size, in the same place and colour, seen
// face-on through an orthographic camera, so when the project is centred on screen the 3D
// version looks exactly like the original. Scrolling away turns it and spreads the blocks in
// depth; the pointer tilts it. The SVG stays in the page as the fallback.
import {
  WebGLRenderer, Scene, OrthographicCamera, BoxGeometry, InstancedBufferGeometry,
  InstancedBufferAttribute, Mesh, ShaderMaterial, Color,
} from 'three';
import { dotCells } from '../scripts/dot-art.js';

const COLS = 46, ROWS = 40, VW = COLS * 10, VH = ROWS * 10;
const PAD = 1.35;   // the canvas is larger than the SVG so turned blocks aren't clipped

const vert = /* glsl */ `
attribute vec3 aOffset;     // square centre (x, y) in viewBox units, centred on 0
attribute float aSize;
attribute float aSeed;
attribute vec3 aStart;      // where the block flies in from on first view
uniform float uSpread, uIntro;
varying vec3 vNormal;
void main() {
  // First view: staggered flight from a scattered start into the drawing, blocks growing in.
  float t = clamp(uIntro * 1.7 - aSeed * 0.7, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 4.0);
  vec3 home = aOffset + vec3(0.0, 0.0, (aSeed - 0.5) * uSpread);
  vec3 swirl = vec3(-(home.y - aStart.y), home.x - aStart.x, 0.0) * 0.18 * sin(t * 3.14159);
  vec3 p = position * aSize * smoothstep(0.0, 0.3, t) + mix(aStart, home, e) + swirl;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const frag = /* glsl */ `
precision mediump float;
uniform vec3 uFront, uSide;
varying vec3 vNormal;
void main() {
  vec3 n = normalize(vNormal);
  // Faces towards the viewer keep the illustration's exact colour; side faces are lighter
  // so the depth reads as the blocks turn.
  float side = 1.0 - smoothstep(0.55, 0.9, abs(n.z));
  vec3 sideCol = mix(uSide, vec3(1.0), clamp(n.y * 0.35 + 0.1, 0.0, 0.4));
  gl_FragColor = vec4(mix(uFront, sideCol, side), 1.0);
  #include <colorspace_fragment>
}`;

export function mount(box, kind, seed) {
  const svg = box.querySelector('svg');
  if (!svg) return null;
  const canvas = document.createElement('canvas');
  canvas.className = 'art-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  box.append(canvas);

  let renderer;
  try { renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch { canvas.remove(); return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera((-VW / 2) * PAD, (VW / 2) * PAD, (VH / 2) * PAD, (-VH / 2) * PAD, -2000, 2000);
  camera.position.z = 1000;

  // Same squares as the SVG (same function, same seed).
  const cells = dotCells(kind, { cols: COLS, rows: ROWS, seed });
  const n = cells.length;
  const offset = new Float32Array(n * 3), size = new Float32Array(n), seeds = new Float32Array(n), starts = new Float32Array(n * 3);
  let r = (seed * 7919) % 233280;
  const rand = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  cells.forEach(([x, y, s], i) => {
    offset.set([x + s / 2 - VW / 2, VH / 2 - (y + s / 2), 0], i * 3);
    size[i] = s; seeds[i] = rand();
    const a = rand() * Math.PI * 2, d = (0.45 + rand() * 0.7) * VW;
    starts.set([Math.cos(a) * d, Math.sin(a) * d * 0.8, (rand() - 0.5) * VW], i * 3);
  });
  const geo = new InstancedBufferGeometry().copy(new BoxGeometry(1, 1, 1));
  geo.instanceCount = n;
  geo.setAttribute('aOffset', new InstancedBufferAttribute(offset, 3));
  geo.setAttribute('aSize', new InstancedBufferAttribute(size, 1));
  geo.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 1));
  geo.setAttribute('aStart', new InstancedBufferAttribute(starts, 3));

  // Front colour = the SVG's ink at 82% over the page background, as a solid colour.
  const css = getComputedStyle(document.documentElement);
  // Mixed in sRGB, the way the browser blends the SVG's 82% opacity over the page.
  const srgb = (v) => { const c = new Color(v); c.convertLinearToSRGB(); return c; };
  const ink = srgb(css.getPropertyValue('--ink').trim() || '#121211');
  const bg = srgb(css.getPropertyValue('--bg').trim() || '#eeece7');
  const mixed = (t) => bg.clone().lerp(ink, t).convertSRGBToLinear();
  const uniforms = {
    uSpread: { value: 0 }, uIntro: { value: 0 },
    uFront: { value: mixed(0.82) },
    uSide: { value: mixed(0.45) },
  };
  const mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  scene.add(mesh);

  // The canvas is centred on the SVG and PAD times its size; the camera frames the same area.
  function fit() {
    const bb = box.getBoundingClientRect(), sb = svg.getBoundingClientRect();
    const w = Math.max(1, sb.width * PAD), h = Math.max(1, sb.height * PAD);
    renderer.setSize(w, h, false);
    Object.assign(canvas.style, {
      width: `${w}px`, height: `${h}px`,
      left: `${sb.left - bb.left - (w - sb.width) / 2}px`, top: `${sb.top - bb.top - (h - sb.height) / 2}px`,
    });
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    const b = svg.getBoundingClientRect();
    const inside = e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom;
    pointer.tx = inside ? (e.clientX - (b.left + b.width / 2)) / (b.width / 2) : 0;
    pointer.ty = inside ? (e.clientY - (b.top + b.height / 2)) / (b.height / 2) : 0;
  };
  addEventListener('pointermove', onMove, { passive: true });

  let raf = 0, visible = false, shown = false, introStart = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (introStart) uniforms.uIntro.value = Math.min(1, (now - introStart) / 2200);
    const b = box.getBoundingClientRect();
    // -1 = entering at the bottom, 0 = centred, +1 = leaving at the top.
    const pos = Math.max(-1, Math.min(1, ((innerHeight / 2) - (b.top + b.height / 2)) / (innerHeight / 2 + b.height / 2)));
    pointer.x += (pointer.tx - pointer.x) * 0.08; pointer.y += (pointer.ty - pointer.y) * 0.08;
    const away = Math.pow(Math.abs(pos), 1.3);                     // 0 when centred
    const hover = Math.min(1, Math.hypot(pointer.x, pointer.y));
    // While its project is pinned (desktop), the art makes one full turn, opening up mid-turn.
    const turn = box.__turn || 0;
    uniforms.uSpread.value = away * 150 + hover * 60 + Math.sin(turn * Math.PI) * 170;
    mesh.rotation.y = pos * 0.7 + pointer.x * 0.45 + turn * Math.PI * 2;
    mesh.rotation.x = -pos * 0.25 + pointer.y * 0.3;
    renderer.render(scene, camera);
    if (!shown) { shown = true; box.classList.add('art-3d'); }
  }
  const run = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  // Draw while on screen; the fly-in starts once a third of the art is visible.
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!introStart && e.intersectionRatio >= 0.35) introStart = performance.now();
    visible ? run() : stop();
  }, { threshold: [0, 0.35] });
  io.observe(box);
  const onVis = () => (document.hidden ? stop() : run());
  document.addEventListener('visibilitychange', onVis);
  const ro = new ResizeObserver(fit);
  ro.observe(box);
  fit();

  return function dispose() {
    stop(); io.disconnect(); ro.disconnect();
    removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
    geo.dispose(); mat.dispose(); renderer.dispose(); canvas.remove();
    box.classList.remove('art-3d');
  };
}
