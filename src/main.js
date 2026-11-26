import { once, seen, mark } from './once.js';
// Hero particles (three.js), loaded only on the home page, only where it will run well.
// The hero name is hidden while they load; any failure brings the plain text back.
const can3D = !matchMedia('(prefers-reduced-motion: reduce)').matches
  && (navigator.hardwareConcurrency || 4) >= 4
  && (navigator.deviceMemory || 4) >= 2
  && (() => { try { return !!document.createElement('canvas').getContext('webgl'); } catch { return false; } })();
const heroName = document.querySelector('.dot-hero');
const canParticles = heroName && can3D;
if (canParticles) {
  const hero = heroName.closest('.hero');
  const intro = once('intro:hero');
  if (intro) { hero.classList.add('particles-pending'); heroName.classList.remove('in', 'd1'); }
  const giveUp = setTimeout(() => hero.classList.remove('particles-pending'), 4000);
  Promise.all([import('./hero-particles.js'), document.fonts.load('800 64px "Doto Variable"')])
    .then(([m]) => { clearTimeout(giveUp); if (!m.start(heroName, { intro })) throw new Error('no webgl'); })
    .catch(() => {})
    .finally(() => hero.classList.remove('particles-pending'));
}


// 3D project art: each illustration loads its 3D version shortly before it scrolls into view.
const disposers = [];
if (can3D) {
  const arts = document.querySelectorAll('[data-art]');
  if (arts.length) {
    let lib;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        (lib ||= import('./project-art.js')).then((m) => { const d = m.mount(e.target, e.target.dataset.art, Number(e.target.dataset.seed) || 3); if (d) disposers.push(d); }).catch(() => {});
      }
    }, { rootMargin: '300px 0px' });
    arts.forEach((a) => io.observe(a));
  }
}
// Free GPU memory when leaving the page.
addEventListener('pagehide', () => { while (disposers.length) disposers.pop()(); });

// Scroll motion (GSAP). Content is visible without JS; reduced motion gets no animation;
// if the motion bundle can't load, the simple reveal below takes over.
const els = document.querySelectorAll('.reveal');
const showAll = () => els.forEach((el) => el.classList.add('seen'));
function simpleReveal() {
  if (!('IntersectionObserver' in window)) return showAll();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches) showAll();
else import('./motion.js').then((m) => m.start()).catch(simpleReveal);


// Contact form: send without leaving the page. Without JS the Turnstile check can't run,
// so the email address above the form is the fallback.
const form = document.querySelector('.contact-form[action]');
if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type=submit]');
  const say = (msg, kind) => { status.textContent = msg; status.className = `form-status ${kind}`; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { say('Please fill in your name, a valid email and a message.', 'err'); return; }
    button.disabled = true;
    say('Sending…', '');
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) { form.reset(); say('Thanks — your message is on its way. I’ll reply by email.', 'ok'); }
      else say(out.error || 'Something went wrong. Please email me directly.', 'err');
    } catch { say('Couldn’t reach the server. Please check your connection or email me directly.', 'err'); }
    window.turnstile?.reset();
    button.disabled = false;
  });
}

// Copy-email button.
for (const b of document.querySelectorAll('[data-copy]')) {
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; }
    catch { b.textContent = 'Copy failed — select it above'; }
    setTimeout(() => { b.textContent = 'Copy address'; }, 2000);
  });
}

// Desktop pointer touches: magnetic buttons and the orange square over the project art.
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const magnets = [...document.querySelectorAll('.btn, .nav-cta, .pill')].filter((b) => !b.disabled);
  const arts = [...document.querySelectorAll('[data-art]')];
  const dot = arts.length ? Object.assign(document.createElement('div'), { className: 'art-cursor' }) : null;
  if (dot) { dot.setAttribute('aria-hidden', 'true'); document.body.append(dot); }
  let px = 0, py = 0, queued = false;
  addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  function update() {
    queued = false;
    for (const b of magnets) {
      const r = b.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
      const reach = Math.max(r.width, r.height) / 2 + 40;
      const near = Math.abs(dx) < reach && Math.abs(dy) < reach;
      const clamp = (v) => Math.max(-6, Math.min(6, v)).toFixed(1);   // a gentle lean, never onto a neighbour
      b.style.setProperty('--mx', near ? `${clamp(dx * 0.12)}px` : '0px');
      b.style.setProperty('--my', near ? `${clamp(dy * 0.2)}px` : '0px');
    }
    if (dot) {
      const over = arts.some((a) => { const r = a.getBoundingClientRect(); return px > r.left && px < r.right && py > r.top && py < r.bottom; });
      dot.classList.toggle('on', over);
      if (over) dot.style.transform = `translate(${px + 14}px, ${py + 14}px)`;
    }
  }
  // Scrolling moves things under a still pointer; recheck without ever touching the scroll.
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
}

// Footer: live local time, back-to-top, and the pixel figure's walk to its spot.
for (const c of document.querySelectorAll('.clock[data-tz]')) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: c.dataset.tz, hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { c.textContent = `${fmt.format(new Date())} IST`; };
  tick(); setInterval(tick, 20000);
}
for (const a of document.querySelectorAll('.to-top')) {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.querySelector('#main')?.focus({ preventScroll: true });
  });
}
const walker = document.querySelector('.walker');
if (walker && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches && !seen('intro:walker')) {
  const ground = walker.parentElement;
  // Distance from its resting spot to just past the panel's left edge (SVG has no offsetLeft).
  const offLeft = () => { const g = ground.getBoundingClientRect(), w = walker.getBoundingClientRect(); return -(w.right - g.left); };
  let start = offLeft();                                              // measured at the resting spot
  walker.style.transform = `translateX(${start}px)`;                 // wait out of sight until the footer is seen
  addEventListener('resize', () => { if (walker.style.transform) { walker.style.transform = ''; start = offLeft(); walker.style.transform = `translateX(${start}px)`; } });
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect(); mark('intro:walker');
    walker.classList.add('walking');
    const walk = walker.animate([{ transform: `translateX(${start}px)` }, { transform: 'translateX(0)' }], { duration: 3200, easing: 'linear' });
    walker.style.transform = '';
    walk.finished.then(() => { clearInterval(steps); walker.classList.remove('walking', 'step-a'); });
    const steps = setInterval(() => walker.classList.toggle('step-a'), 170);
  }, { threshold: 0.6 });
  io.observe(ground);
}
