import { NextResponse } from 'next/server';
import { getAdsConfig } from '@/lib/admin-store';

export async function GET() {
  const config = getAdsConfig();

  const adsContent = config.adsTxtContent || `google.com, pub-9075710959353163, DIRECT, f08c47fec0942fa0
# FileZenith Monetization Ads.txt
`;

  return new NextResponse(adsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
