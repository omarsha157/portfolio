// Hero particles (three.js), loaded only on the home page, only where it will run well.
// The hero name is hidden while they load; any failure brings the plain text back.
const heroName = document.querySelector('.dot-hero');
const canParticles = heroName
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && (navigator.hardwareConcurrency || 4) >= 4
  && (navigator.deviceMemory || 4) >= 2
  && (() => { try { return !!document.createElement('canvas').getContext('webgl'); } catch { return false; } })();
if (canParticles) {
  const hero = heroName.closest('.hero');
  hero.classList.add('particles-pending');
  heroName.classList.remove('in', 'd1');
  const giveUp = setTimeout(() => hero.classList.remove('particles-pending'), 4000);
  Promise.all([import('./hero-particles.js'), document.fonts.load('800 64px "Doto Variable"')])
    .then(([m]) => { clearTimeout(giveUp); if (!m.start(heroName)) throw new Error('no webgl'); })
    .catch(() => {})
    .finally(() => hero.classList.remove('particles-pending'));
}


// Reveal rows as they scroll in. Content is visible without JS; reduced motion skips this entirely.
const els = document.querySelectorAll('.reveal');
if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  els.forEach((el) => el.classList.add('seen'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

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
