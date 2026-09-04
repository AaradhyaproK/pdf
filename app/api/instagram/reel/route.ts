import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inputUrl = searchParams.get('url');

  if (!inputUrl) {
    return NextResponse.json({ error: 'Missing Instagram Reel URL parameter' }, { status: 400 });
  }

  const shortcodeMatch = inputUrl.match(/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/);
  const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';

  if (!shortcode) {
    return NextResponse.json({ error: 'Invalid Instagram Reel URL format.' }, { status: 400 });
  }

  const reelUrl = `https://www.instagram.com/reel/${shortcode}/`;

  let videoUrl: string | null = null;
  let thumbnailUrl: string | null = null;
  let title = `Instagram Reel (${shortcode})`;

  // 1. Try Cobalt API instances
  const cobaltInstances = [
    'https://api.cobalt.tools/api/json',
    'https://co.wuk.sh/api/json',
  ];

  for (const instance of cobaltInstances) {
    try {
      const res = await fetch(instance, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: reelUrl,
          videoQuality: '1080',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          videoUrl = data.url;
          break;
        } else if (data.picker && data.picker.length > 0) {
          videoUrl = data.picker[0].url;
          if (data.picker[0].thumb) thumbnailUrl = data.picker[0].thumb;
          break;
        }
      }
    } catch {
      //
    }
  }

  // 2. Fallback: Scraping Instagram Embed Caption Page
  if (!videoUrl) {
    try {
      const embedRes = await fetch(`https://www.instagram.com/reel/${shortcode}/embed/captioned/`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        },
      });

      if (embedRes.ok) {
        const html = await embedRes.text();

        // Extract video URL from embedded HTML
        const vMatch = html.match(/video_url\\":\\"([^\\"]+)\\"/) || html.match(/src="([^"]+\.mp4[^"]*)"/);
        if (vMatch && vMatch[1]) {
          videoUrl = vMatch[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
        }

        // Extract thumbnail poster from embedded HTML
        const tMatch = html.match(/display_url\\":\\"([^\\"]+)\\"/) || html.match(/poster="([^"]+)"/);
        if (tMatch && tMatch[1]) {
          thumbnailUrl = tMatch[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
        }

        // Extract caption title
        const capMatch = html.match(/CaptionComments">([^<]+)</);
        if (capMatch && capMatch[1]) {
          title = capMatch[1].trim().slice(0, 80);
        }
      }
    } catch {
      //
    }
  }

  // 3. Fallback: DDInstagram OpenGraph Resolver
  if (!videoUrl) {
    try {
      const ddRes = await fetch(`https://ddinstagram.com/reel/${shortcode}/`, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        },
      });

      if (ddRes.ok) {
        const html = await ddRes.text();
        const ogVideo = html.match(/property="og:video"\s+content="([^"]+)"/);
        if (ogVideo && ogVideo[1]) {
          videoUrl = ogVideo[1];
        }
        const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/);
        if (ogImage && ogImage[1]) {
          thumbnailUrl = ogImage[1];
        }
      }
    } catch {
      //
    }
  }

  if (!videoUrl) {
    // Return direct video stream fallback endpoint
    videoUrl = `/api/stream?url=${encodeURIComponent(reelUrl)}&filename=${shortcode}.mp4`;
  }

  if (!thumbnailUrl) {
    thumbnailUrl = `https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=80`;
  }

  return NextResponse.json({
    success: true,
    shortcode,
    title,
    videoUrl,
    thumbnailUrl,
    sourceUrl: reelUrl,
  });
}
