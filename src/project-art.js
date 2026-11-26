// 3D project art: the flat dot illustrations rebuilt as objects made of small square blocks.
// Each one turns with scroll (plus a slow idle spin) and tilts towards the pointer.
// The SVG stays in the page as the fallback and is hidden only once the 3D version has drawn.
import {
  WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, InstancedMesh, MeshLambertMaterial,
  HemisphereLight, DirectionalLight, Object3D, Color, Group,
} from 'three';
import { shapes } from '../scripts/dot-art.js';

const INK = '#4a4843', ACCENT = '#e4572e';

// Each builder returns block positions [x, y, z, size, accent?] in roughly a -1..1 box.
const builders = {
  // The gear from the 2D art, extruded: thick teeth and rim, a thin hub ring.
  gear() {
    const out = [], N = 40;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = (i + 0.5) / N, y = (j + 0.5) / N;
      const d = shapes.gear(x, 0.5 + (y - 0.5) / 1.15);
      if (d < 0.5) continue;
      const depth = d > 0.92 ? 3 : 2;
      for (let k = 0; k < depth; k++) {
        out.push([(x - 0.5) * 2, (0.5 - y) * 2, (k - (depth - 1) / 2) * (2 / N), 2 / N, Math.random() < 0.015]);
      }
    }
    return out;
  },
  // A cube shell whose three pairs of faces use three block sizes: one object, many faces.
  cube() {
    const out = [], N = 9, s = 2 / N;
    const faceSize = { y: 1, x: 0.62, z: 0.32 };
    const seen = new Set();
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
      const onX = i === 0 || i === N - 1, onY = j === 0 || j === N - 1, onZ = k === 0 || k === N - 1;
      if (!onX && !onY && !onZ) continue;
      const key = `${i},${j},${k}`; if (seen.has(key)) continue; seen.add(key);
      const size = Math.max(onY ? faceSize.y : 0, onX ? faceSize.x : 0, onZ ? faceSize.z : 0);
      out.push([(i - (N - 1) / 2) * s, (j - (N - 1) / 2) * s, (k - (N - 1) / 2) * s, s * size, Math.random() < 0.02]);
    }
    return out;
  },
};

export function mount(box, kind) {
  const make = builders[kind];
  if (!make) return null;
  const svg = box.querySelector('svg');
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
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);
  scene.add(new HemisphereLight(0xffffff, 0x3a3935, 3.2));
  const sun = new DirectionalLight(0xffffff, 3.4); sun.position.set(-2, 3, 4); scene.add(sun);

  const blocks = make();
  const geo = new BoxGeometry(1, 1, 1);
  const mat = new MeshLambertMaterial({ color: 0xffffff });
  const mesh = new InstancedMesh(geo, mat, blocks.length);
  const o = new Object3D(), ink = new Color(INK), accent = new Color(ACCENT);
  blocks.forEach(([x, y, z, s, a], i) => {
    o.position.set(x, y, z); o.scale.setScalar(s * 0.78); o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix); mesh.setColorAt(i, a ? accent : ink);
  });
  const group = new Group(); group.add(mesh); scene.add(group);
  // Fit: scale so the object's furthest block (in any rotation) fills ~80% of the frame height.
  const reach = Math.max(...blocks.map(([x, y, z]) => Math.hypot(x, y, z)));
  group.scale.setScalar(1.25 / reach);
  const base = kind === 'cube' ? { x: 0.52, y: -0.62 } : { x: -0.42, y: 0.38 };

  // Cover exactly the area of the SVG it replaces, so the layout never moves.
  function size() {
    const bb = box.getBoundingClientRect(), sb = svg.getBoundingClientRect();
    const w = Math.max(1, sb.width), h = Math.max(1, sb.height);
    renderer.setSize(w, h, false);
    Object.assign(canvas.style, { width: `${w}px`, height: `${h}px`, left: `${sb.left - bb.left}px`, top: `${sb.top - bb.top}px` });
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2 || 1)));
    pointer.ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2 || 1)));
  };
  addEventListener('pointermove', onMove, { passive: true });

  let raf = 0, visible = false, t0 = performance.now(), shown = false;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const r = box.getBoundingClientRect();
    const progress = (innerHeight - (r.top + r.height / 2)) / (innerHeight + r.height); // ~0 entering, ~1 leaving
    pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
    const spin = progress * Math.PI * 1.2 + t * 0.12;
    if (kind === 'gear') {
      group.rotation.set(base.x + pointer.y * 0.25, base.y + pointer.x * 0.35, -spin);
    } else {
      group.rotation.set(base.x + pointer.y * 0.25, base.y + spin + pointer.x * 0.35, 0);
    }
    renderer.render(scene, camera);
    if (!shown) { shown = true; box.classList.add('art-3d'); }
  }
  const run = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); });
  io.observe(box);
  const onVis = () => (document.hidden ? stop() : run());
  document.addEventListener('visibilitychange', onVis);
  const ro = new ResizeObserver(() => { size(); if (!raf) renderer.render(scene, camera); });
  ro.observe(box);
  size();

  return function dispose() {
    stop(); io.disconnect(); ro.disconnect();
    removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
    geo.dispose(); mat.dispose(); mesh.dispose(); renderer.dispose(); canvas.remove();
    box.classList.remove('art-3d');
  };
}
