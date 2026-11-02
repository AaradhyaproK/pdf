import { NextResponse } from 'next/server';

function isPrivateIp(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '::1' ||
    lower === '0.0.0.0' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // Check IPv4 private ranges
  const ipv4Match = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const octet1 = parseInt(ipv4Match[1], 10);
    const octet2 = parseInt(ipv4Match[2], 10);
    if (octet1 === 10) return true;
    if (octet1 === 127) return true;
    if (octet1 === 169 && octet2 === 254) return true;
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;
    if (octet1 === 192 && octet2 === 168) return true;
    if (octet1 === 0) return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let targetUrl = body?.url?.trim();

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are allowed.' }, { status: 400 });
    }

    if (isPrivateIp(parsed.hostname)) {
      return NextResponse.json({ error: 'Access to private and local network addresses is restricted.' }, { status: 403 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 FileZenith/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Target website returned status ${response.status} (${response.statusText})` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml') && !contentType.includes('text/plain')) {
      return NextResponse.json(
        { error: `URL did not return an HTML document (received ${contentType || 'unknown type'}).` },
        { status: 400 }
      );
    }

    let html = await response.text();

    // Extract title if present
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : parsed.hostname;

    // Inject <base href="..."> so that relative images, CSS, and fonts resolve cleanly
    const baseTag = `<base href="${targetUrl}">`;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, `$&${baseTag}`);
    } else {
      html = `${baseTag}${html}`;
    }

    // Strip frame-busting scripts to ensure clean rendering in iframe preview
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (scriptBlock) => {
      if (
        scriptBlock.includes('top.location') ||
        scriptBlock.includes('parent.location') ||
        scriptBlock.includes('window.location.replace')
      ) {
        return '<!-- frame buster removed -->';
      }
      return scriptBlock;
    });

    return NextResponse.json({
      success: true,
      html,
      title,
      url: targetUrl,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out after 10 seconds. The target website may be slow or blocking automated requests.' }, { status: 504 });
    }
    return NextResponse.json({ error: err.message || 'Failed to fetch the requested URL.' }, { status: 500 });
  }
}

