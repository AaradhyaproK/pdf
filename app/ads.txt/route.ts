export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const content = 'google.com, pub-1291898061670715, DIRECT, f08c47fec0942fa0\n';

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
