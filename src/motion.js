// Scroll motion (GSAP + ScrollTrigger). Loaded only when the visitor allows motion.
// - Dot-matrix headings "decode" like a departure board when they come into view.
// - Content blocks come in one after another instead of a single fade.
// Nothing here holds or hijacks scrolling: the page always scrolls normally.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { seen, mark } from './once.js';

gsap.registerPlugin(ScrollTrigger);

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#+*/<>=';

// Cycle each character through random glyphs, settling left to right.
function decode(el) {
  const text = el.textContent;
  const chars = [...text];
  const state = { p: 0 };
  el.setAttribute('aria-label', text);
  const width = el.getBoundingClientRect().width;
  el.style.minWidth = `${width}px`;          // keep the line from jumping while glyphs change
  return gsap.to(state, {
    p: 1,
    duration: Math.min(1.4, 0.5 + chars.length * 0.06),
    ease: 'none',
    onUpdate() {
      const settled = Math.floor(state.p * (chars.length + 3)) - 3;
      el.textContent = chars.map((c, i) => (c.trim() === '' || i <= settled ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    },
    onComplete() { el.textContent = text; el.removeAttribute('aria-label'); el.style.minWidth = ''; },
  });
}

export function start() {
  // Headings and dot-matrix labels (the hero name has its own particle entrance).
  const decodeTargets = [
    ...document.querySelectorAll('.dot-title, .dot-num, .stack-list li, .cell .dot-md'),
    ...document.querySelectorAll('.dot-xl a'),
  ];
  for (const el of decodeTargets) {
    if (el.children.length) continue;  // only plain-text elements
    const key = `decode:${el.textContent.trim()}`;
    if (seen(key)) continue;   // each label decodes once per visit, the first time it is actually seen
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => { mark(key); decode(el); } });
  }

  // Staggered reveals. .reveal blocks are hidden by CSS until JS shows them, so nothing flashes.
  for (const block of document.querySelectorAll('.reveal')) {
    const kids = block.classList.contains('feature-art') ? [block] : [...block.children];
    gsap.set(block, { opacity: 1, y: 0, transition: 'none' });
    if (kids[0] !== block) gsap.set(kids, { opacity: 0, y: 24 });
    else gsap.set(block, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: block, start: 'top 85%', once: true,
      onEnter: () => gsap.to(kids, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09, clearProps: 'transform' }),
    });
  }
  // Below-the-fold blocks without .reveal (strip cells, long-form sections, contact columns).
  const extra = document.querySelectorAll('.strip .cell, .prose > h2, .prose > p, .prose > ul, .prose > ol, .prose > table, .contact-grid > *');
  const fold = innerHeight;
  const later = [...extra].filter((el) => el.getBoundingClientRect().top > fold);
  gsap.set(later, { opacity: 0, y: 24 });
  ScrollTrigger.batch(later, {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' }),
  });

  // Fonts and 3D canvases can change heights after load; re-measure once things settle.
  addEventListener('load', () => ScrollTrigger.refresh());
}
