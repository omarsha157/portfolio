// Contact form endpoint. Static pages are served straight from dist/ by Cloudflare;
// this Worker only runs for /api/* (see run_worker_first in wrangler.jsonc).
//
// POST /api/contact  (multipart or urlencoded form)
//   name, email, message, company (honeypot, must be empty), cf-turnstile-response
// -> verifies Turnstile, then emails the message to the owner via Email Routing.
import { EmailMessage } from 'cloudflare:email';

const FROM = 'contact@omarsha.com';
const LIMITS = { name: 100, email: 200, message: 5000 };

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);

    let form;
    try { form = await request.formData(); } catch { return json({ ok: false, error: 'Invalid form.' }, 400); }
    const field = (k) => String(form.get(k) ?? '').trim();
    const name = field('name'), email = field('email'), message = field('message');

    // Bots fill hidden fields. Pretend it worked so they don't retry.
    if (field('company')) return json({ ok: true });

    if (!name || !email || !message) return json({ ok: false, error: 'Please fill in every field.' }, 400);
    if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message)
      return json({ ok: false, error: 'That message is too long.' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'Please check your email address.' }, 400);

    const token = field('cf-turnstile-response');
    if (!token) return json({ ok: false, error: 'Please complete the check above the button.' }, 400);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET || '', response: token, remoteip: request.headers.get('cf-connecting-ip') || '' }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!verify.success) return json({ ok: false, error: 'The spam check failed. Please reload the page and try again.' }, 403);

    try {
      await env.EMAIL.send(new EmailMessage(FROM, env.CONTACT_TO, mime({ name, email, message, to: env.CONTACT_TO })));
    } catch (e) {
      console.error('send failed', e);
      return json({ ok: false, error: 'The message could not be sent. Please email me directly.' }, 502);
    }
    return json({ ok: true });
  },
};

// A plain-text email, built by hand (no dependencies). Header values are stripped of
// line breaks so form input can't inject headers; non-ASCII goes through base64.
function mime({ name, email, message, to }) {
  const one = (s) => s.replace(/[\r\n]+/g, ' ');
  const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const word = (s) => `=?UTF-8?B?${b64(one(s))}?=`;
  const body = `From: ${name} <${email}>\n\n${message}\n\n— Sent from the contact form on omarsha.com`;
  return [
    `From: ${word('Portfolio contact form')} <${FROM}>`,
    `To: <${to}>`,
    `Reply-To: ${word(name)} <${one(email)}>`,
    `Subject: ${word(`New message from ${name}`)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@omarsha.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(body).replace(/.{76}/g, '$&\r\n'),
  ].join('\r\n');
}
