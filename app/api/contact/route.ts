import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot field — real users never fill this. */
  website?: unknown;
}

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

/** Simple in-memory sliding window limiter (per instance). */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(key, recent);
    return true;
  }
  recent.push(now);
  submissions.set(key, recent);
  return false;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

function cleanString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/**
 * Validates and delivers a contact form submission.
 *
 * Delivery uses a pluggable webhook so no third-party SDK is required:
 * set `CONTACT_WEBHOOK_URL` to a Formspree / Zapier / Make / Slack / Discord
 * endpoint (or any HTTPS receiver that accepts a JSON POST) and the message is
 * delivered there. Without the variable configured the endpoint still
 * validates the payload and returns a clear configuration error rather than
 * silently pretending the message was sent.
 */
export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: silently accept so bots do not learn they were detected.
  if (cleanString(body.website, 200)) {
    return NextResponse.json({ success: true });
  }

  const name = cleanString(body.name, MAX_NAME);
  const email = cleanString(body.email, MAX_EMAIL);
  const subject = cleanString(body.subject, MAX_SUBJECT);
  const message = cleanString(body.message, MAX_MESSAGE);

  if (!name) {
    return NextResponse.json({ error: 'Please provide your name.' }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: 'Please provide your email address.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: 'Please provide a message.' }, { status: 400 });
  }

  const key = clientKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: 'Too many messages sent from this device. Please try again later.' },
      { status: 429 },
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    // No delivery channel configured. Be explicit rather than silently
    // dropping the message.
    console.error('[contact] CONTACT_WEBHOOK_URL is not configured. Message not delivered.', {
      name,
      email,
      subject,
    });
    return NextResponse.json(
      {
        error:
          'Message delivery is not configured yet. Please email us directly at contact@filezenith.com.',
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
        source: 'filezenith.com/contact',
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('[contact] Webhook delivery failed with status', response.status);
      return NextResponse.json(
        { error: 'We could not send your message right now. Please email contact@filezenith.com.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Webhook delivery threw', err);
    return NextResponse.json(
      { error: 'We could not send your message right now. Please email contact@filezenith.com.' },
      { status: 502 },
    );
  }
}
