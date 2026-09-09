import { NextResponse } from 'next/server';
import { getAdsConfig } from '@/lib/admin-store';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours standard IAB / Google ads.txt caching

export async function GET() {
  const config = getAdsConfig();

  const adsContent = (
    config.adsTxtContent || 'google.com, pub-9075710959353163, DIRECT, f08c47fec0942fa0'
  ).trim() + '\n';

  return new NextResponse(adsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

