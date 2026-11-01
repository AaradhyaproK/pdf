import { NextResponse } from 'next/server';

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
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
