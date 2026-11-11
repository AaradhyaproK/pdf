import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || request.nextUrl.host;

  // Perform 301 Permanent Redirect from non-www domain filezenith.com to www.filezenith.com preserving path and query string
  if (host.toLowerCase() === 'filezenith.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.filezenith.com';
    url.port = '';

    // ads.txt / app-ads.txt must be served at the exact domain root without a
    // redirect so that Google's ads.txt crawler always resolves the record.
    // Serving the identical content on both hosts is the recommended setup.
    const isAdsTxt =
      url.pathname === '/ads.txt' || url.pathname === '/app-ads.txt';

    if (!isAdsTxt) {
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - heavy binary media and script assets (*.svg, *.png, *.webp, *.jpg, *.mjs, *.wasm, etc.)
     * Note: .txt and .xml (robots.txt, sitemap.xml, ads.txt) are deliberately MATCHED so
     * non-www to www 301 canonical redirects are guaranteed. ads.txt and app-ads.txt
     * are explicitly allowed through without a redirect (see above).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|eot|mjs|wasm|json|css|js)$).*)',
  ],
};
