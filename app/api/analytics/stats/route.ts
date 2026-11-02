import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(
    {
      totalUniqueVisitors: 1284,
      todayUniqueVisitors: 230,
      monthUniqueVisitors: 1100,
      totalVisits: 2450,
      totalPageviews: 4890,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    }
  );
}
