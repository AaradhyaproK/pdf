import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';

/**
 * Admin login endpoint.
 *
 * The admin console is a client-side tool, but the *login* itself must be
 * validated on the server, otherwise anyone could grant themselves a session
 * simply by typing four characters into the password field.
 *
 * Credentials come from environment variables:
 *   ADMIN_EMAIL    — the administrator's email address
 *   ADMIN_PASSWORD — a strong, unique passphrase
 *
 * If they are not configured, the endpoint refuses every attempt rather than
 * falling back to a permissive check.
 */

/** Constant-time string comparison to avoid leaking length/content via timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Still perform a comparison so the timing does not reveal the length.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  if (!expectedEmail || !expectedPassword) {
    console.error('[admin-login] ADMIN_EMAIL / ADMIN_PASSWORD are not configured.');
    return NextResponse.json(
      { error: 'Admin access is not configured on this deployment.' },
      { status: 503 },
    );
  }

  const emailOk = safeEqual(email, expectedEmail);
  const passwordOk = safeEqual(password, expectedPassword);

  if (!emailOk || !passwordOk) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Issue a short-lived, signed session token. The browser stores it and
  // presents it on subsequent admin requests.
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8; // 8 hours
  const payload = `${email}.${expiresAt}`;
  const secret = process.env.ADMIN_SESSION_SECRET || expectedPassword;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');

  return NextResponse.json({
    success: true,
    token: `${payload}.${signature}`,
    expiresAt,
  });
}
