// Turns content/ into static HTML pages under site/ (Vite's root).
// Every word on the site comes from content/; this file only arranges it.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { dotArt } from './dot-art.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const C = (...p) => path.join(ROOT, 'content', ...p);
const OUT = path.join(ROOT, 'site');

const site = JSON.parse(fs.readFileSync(C('site.json'), 'utf8'));
const read = (file) => matter(fs.readFileSync(file, 'utf8'));

// Placeholders: {{TODO: what is needed}}. Shown as a quiet dashed marker, counted at build.
const TODO_RE = /\{\{TODO:\s*([^}]*)\}\}/g;
const todos = [];
const drafts = [];
const isTodo = (s) => typeof s === 'string' && /\{\{TODO:/.test(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const todo = (html) => html.replace(TODO_RE, (_, t) => {
  t = t.trim();
  if (t === 'in progress') return '<span class="pending">In progress</span>';
  todos.push(t);
  return `<span class="ph" title="Placeholder">${t}</span>`;
});
const t = (s) => todo(esc(s));
const md = (s) => todo(marked.parse(s));
const inline = (s) => todo(marked.parseInline(esc(s)));   // *word* = emphasised (ink), rest grey
const plain = (s) => String(s).replace(TODO_RE, '').replace(/\*/g, '').trim();
const arrow = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const btn = (href, label, cls = '') => `<a class="btn ${cls}" href="${href}"><span class="btn-icon" aria-hidden="true">${arrow}</span>${esc(label)}</a>`;

const name = plain(site.name);
const wordmark = name || 'Your Name';
const initials = (name || 'Y N').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function layout({ route, title, description, body, depth = route.split('/').filter(Boolean).length }) {
  const up = '../'.repeat(depth + 1); // site/<route>/index.html -> project root
  const nav = site.nav.filter((n) => !n.primary).map((n) => {
    const cur = n.href === route || (n.href !== '/' && route.startsWith(n.href));
    return `<a href="${n.href}"${cur ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`;
  }).join('');
  const cta = site.nav.find((n) => n.primary);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#eeece7">
<title>${esc(title === 'Home' ? `${wordmark} — ${site.role}` : `${title} — ${wordmark}`)}</title>
<meta name="description" content="${esc(plain(description))}">
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="${up}src/style.css">
<script type="module" src="${up}src/main.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="bar">
    <a class="brand" href="/" aria-label="${esc(wordmark)}, home"><span class="mono-tile" aria-hidden="true">${esc(initials)}</span><span class="brand-name">${esc(wordmark)}</span></a>
    <nav aria-label="Main">${nav}</nav>
    <a class="nav-cta" href="${cta.href}"${route.startsWith(cta.href) ? ' aria-current="page"' : ''}>${esc(cta.label)}</a>
  </div>
</header>
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function footer() {
  const email = isTodo(site.email) ? t(site.email) : `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`;
  const links = site.links.map((l) => isTodo(l.url)
    ? `<li><span>${esc(l.label)}</span></li>`
    : `<li><a href="${esc(l.url)}" rel="me noopener">${esc(l.label)}</a></li>`).join('');
  return `<footer class="foot">
  <div class="wrap">
    <p class="dot-xl"><a href="/contact/">Let’s talk.</a></p>
    <div class="foot-row">
      <p class="foot-email">${email}</p>
      <ul class="foot-links">${links}</ul>
    </div>
    <p class="foot-note">${t(site.footer)}</p>
  </div>
</footer>`;
}

function write(route, page, file = path.join(OUT, route, 'index.html')) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout({ route, ...page }));
}

fs.rmSync(OUT, { recursive: true, force: true });

// ---------- projects ----------
const projects = fs.readdirSync(C('projects')).filter((f) => f.endsWith('.md'))
  .map((f) => read(C('projects', f)))
  .sort((a, b) => a.data.order - b.data.order)
  .map((p) => ({ ...p.data, href: `/work/${p.data.slug}/`, body: p.content }));
for (const p of projects) if (p.draft) drafts.push(`work/${p.slug}`);
const ART = { 'self-managing': ['gear', 11], 'many-worlds': ['cube', 5] };
const art = (p) => dotArt(ART[p.slug]?.[0] || 'loop', { seed: ART[p.slug]?.[1] || 3, label: `Dot illustration for ${p.title}` });
const num = (i) => String(i + 1).padStart(2, '0');

const feature = (p, i) => `<section class="feature${i % 2 ? ' flip' : ''}" aria-labelledby="p-${p.slug}">
  <div class="feature-text reveal">
    <p class="kicker"><span class="dot-num">${num(i)}</span> ${esc(p.status)}</p>
    <h2 id="p-${p.slug}" class="statement"><a href="${p.href}">${esc(p.title)}</a> <span class="grey">${esc(p.tagline || '')}</span></h2>
    <p class="feature-sum">${t(p.summary)}</p>
    ${btn(p.href, 'Read more', 'light')}
  </div>
  <div class="feature-art reveal">${art(p)}</div>
</section>`;

// Home
const home = read(C('home.md'));
if (site.headlineDraft) drafts.push('headline');
write('/', {
  title: 'Home', description: home.data.description,
  body: `<section class="hero wrap">
  <p class="kicker in d1">${t(site.role)} · ${t(site.location)}</p>
  <h1 class="dot-hero in d1">${esc(wordmark)}</h1>
  <p class="hero-line in d3">${inline(site.headline)}</p>
  <p class="hero-ctas in d3">${btn('/work/', 'See the work')}<a class="btn-text" href="/contact/">Get in touch</a></p>
</section>
<section class="strip wrap" aria-label="At a glance">
  <div class="strip-in">
    <div class="cell"><p class="cap-label">Stack</p><ul class="stack-list"><li>ANGULAR</li><li>NODE.JS</li><li>POSTGRESQL</li><li class="more">+ AND MORE</li></ul></div>
    <div class="cell"><p class="cap-label">Based in</p><p class="dot-md">INDIA</p></div>
    <div class="cell cell-text"><p class="cap-label">How I work</p><p>${inline(site.aiStatement)}</p>${btn('/about/', 'More about me', 'light')}</div>
  </div>
</section>
<div class="wrap features">${projects.map(feature).join('')}</div>`,
});

// Work index + project pages
write('/work/', {
  title: 'Work', description: 'Projects: a self-managing app and one app shown as many 3D worlds.',
  body: `<section class="page-head wrap">
  <p class="kicker in d1">Work</p>
  <h1 class="dot-title in d1">Projects</h1>
  <p class="lede in d2">${inline(site.aiStatement)}</p>
</section>
<div class="wrap features">${projects.map(feature).join('')}</div>`,
});
for (const p of projects) {
  write(p.href, {
    title: p.title, description: p.description,
    body: `<article>
  <header class="page-head wrap project-head">
    <div>
      <a class="back in d1" href="/work/">← All work</a>
      <h1 class="title in d1">${esc(p.title)} <span class="grey">${esc(p.tagline || '')}</span></h1>
      <p class="lede in d2">${t(p.summary)}</p>
      <dl class="meta in d3">
        <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
        <div><dt>My role</dt><dd>Architecture, decisions, testing, operation</dd></div>
        <div><dt>Approach</dt><dd>AI-assisted development</dd></div>
      </dl>
    </div>
    <div class="project-art in d2">${art(p)}</div>
  </header>
  <div class="prose wrap">${md(p.body)}</div>
</article>`,
  });
}

// About
const about = read(C('about.md'));
if (about.data.draft) drafts.push('about');
const skills = Object.entries(site.skills).map(([k, v]) =>
  `<h3>${esc(k)}</h3><ul class="tags">${v.map((s) => `<li>${t(s)}</li>`).join('')}</ul>`).join('');
write('/about/', {
  title: about.data.title, description: about.data.description,
  body: `<section class="page-head wrap">
  <p class="kicker in d1">About</p>
  <h1 class="dot-title in d1">About</h1>
  <p class="lede in d2">${inline(site.headline)}</p>
</section>
<div class="prose wrap">${md(about.content).replace('<!-- skills -->', skills)}</div>`,
});

// Contact
// The form posts to the Worker at /api/contact (worker/index.js). It stays switched off
// until a Turnstile site key is set in site.json, so it never looks live when it isn't.
function contactForm() {
  const key = site.turnstileSiteKey;
  const off = key ? '' : ' disabled';
  return `<form class="card contact-form" action="/api/contact" method="post" novalidate aria-describedby="form-note">
    <h2 class="h-md">Send a message</h2>
    <p id="form-note" class="note">${key ? 'I usually reply within a couple of days.' : 'The form isn’t switched on yet. Please use email for now.'}</p>
    <label>Name <input name="name" autocomplete="name" maxlength="100" required${off}></label>
    <label>Email <input name="email" type="email" autocomplete="email" maxlength="200" required${off}></label>
    <label>Message <textarea name="message" rows="5" maxlength="5000" required${off}></textarea></label>
    <label class="hp" aria-hidden="true">Company <input name="company" tabindex="-1" autocomplete="off"></label>
    ${key ? `<div class="cf-turnstile" data-sitekey="${esc(key)}" data-theme="light" data-size="flexible"></div>` : ''}
    <button class="btn" type="submit"${off}><span class="btn-icon" aria-hidden="true">${arrow}</span>Send</button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>${key ? '\n<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}`;
}
const contact = read(C('contact.md'));
const email = isTodo(site.email) ? t(site.email) : `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`;
write('/contact/', {
  title: contact.data.title, description: contact.data.description,
  body: `<section class="page-head wrap">
  <p class="kicker in d1">Contact</p>
  <h1 class="dot-title in d1">Contact</h1>
  <div class="lede in d2">${md(contact.content).replace('<!-- contact -->', '')}</div>
  <p class="contact-email in d2">${email}</p>
</section>
<section class="wrap contact-grid">
  ${contactForm()}
  <div>
    <h2 class="h-md">Elsewhere</h2>
    <ul class="elsewhere">${site.links.map((l) => `<li>${isTodo(l.url) ? `${esc(l.label)} <span class="ph">${esc(l.url.replace(TODO_RE, '$1'))}</span>` : `<a href="${esc(l.url)}" rel="me noopener">${esc(l.label)} ${arrow}</a>`}</li>`).join('')}</ul>
  </div>
</section>`,
});

// Error pages. Cloudflare Pages uses 404.html; nginx (local) maps the rest.
const ERRORS = [
  ['404', 'Page not found', 'This page doesn’t exist, or it has moved.'],
  ['403', 'Access denied', 'You don’t have permission to view this page.'],
  ['500', 'Something went wrong', 'The server hit an error. Please try again in a moment.'],
  ['503', 'Temporarily unavailable', 'The site is down for a moment, likely maintenance. Please try again shortly.'],
];
for (const [code, title, msg] of ERRORS) {
  write(`/${code}`, { title, description: `${title}.`, depth: 0, body: `<section class="page-head wrap"><p class="kicker">Error ${code}</p><h1 class="dot-title">${code}</h1><p class="lede">${esc(msg)}</p><p class="hero-ctas">${btn('/', 'Back home')}<a class="btn-text" href="/contact/">Get in touch</a></p></section>` }, path.join(OUT, `${code}.html`));
}

console.log(`content: ${todos.length} placeholders, drafts to review: ${drafts.join(', ') || 'none'}`);
