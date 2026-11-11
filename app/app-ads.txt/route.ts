import { ADSENSE_ADS_TXT_RECORDS } from '@/lib/ads-config';

export const dynamic = 'force-static';
export const revalidate = 86400;

/**
 * Serves `app-ads.txt` at the domain root.
 *
 * Required by Google AdSense for any app (Android / iOS) built on this
 * domain, and harmless for the web-only deployment. It carries the same
 * `DIRECT` authorisation record as `/ads.txt`.
 */
export async function GET() {
  return new Response(`${ADSENSE_ADS_TXT_RECORDS}\n`, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
