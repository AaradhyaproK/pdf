import { MetadataRoute } from 'next';
import { SEO_REGISTRY } from '@/lib/seo-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filezenith.com';

  const toolRoutes = Object.entries(SEO_REGISTRY)
    .filter(([_, tool]) => tool.category !== 'social')
    .map(([slug]) => ({
      url: `${baseUrl}${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: slug.includes('compress') ? 0.9 : 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...toolRoutes,
  ];
}
