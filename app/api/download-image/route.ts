import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'img.youtube.com',
  'i.ytimg.com',
  'images.unsplash.com',
  'filezenith.com',
  'www.filezenith.com',
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'cover.jpg';

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL parameter' }, { status: 400 });
  }

  try {
    const parsed = new URL(imageUrl);

    // Whitelist only approved public media CDN hostnames
    if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
      return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
    }

    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.statusText}`);
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('content-type') || 'image/jpeg');
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    return new NextResponse(res.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
