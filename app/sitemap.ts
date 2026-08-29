import { MetadataRoute } from 'next';
import { SEO_REGISTRY } from '@/lib/seo-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omnitoolsuite.com';

  const toolRoutes = Object.keys(SEO_REGISTRY).map((slug) => ({
    url: `${baseUrl}${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: slug.includes('compress') || slug.includes('youtube') || slug.includes('instagram') ? 0.9 : 0.8,
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
