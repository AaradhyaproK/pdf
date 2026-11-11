import { ADSENSE_ADS_TXT_RECORDS } from '@/lib/ads-config';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

/**
 * Serves the IANA ads.txt record at the domain root.
 *
 * Google fetches `/ads.txt` on the apex domain when the site is submitted for
 * AdSense review. The `DIRECT` record authorises Google to serve ads on our
 * behalf; adding a second line without the matching `f08c47fec0942fa0`
 * certification string would cause Google to reject the file.
 *
 * The content is derived from a single source of truth (`lib/ads-config.ts`)
 * so it can never drift from the publisher id used in the page tags.
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
