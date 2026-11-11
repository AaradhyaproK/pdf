import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';

  return {
    rules: [
      {
        // Google's advertising crawler. It must be able to reach every page,
        // including ads.txt, or ad serving and the policy review are affected.
        userAgent: ['Mediapartners-Google', 'AdsBot-Google'],
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot'],
        allow: ['/llms.txt', '/llms-full.txt', '/llm.txt'],
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: ['Bytespider', 'PetalBot', 'Amazonbot', 'CCBot'],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
