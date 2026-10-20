import { MetadataRoute } from 'next';
import { SEO_REGISTRY } from '@/lib/seo-config';
import { PRESET_REGISTRY } from '@/lib/presets-data';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';

  const categoryRoutes = Object.keys(CATEGORY_REGISTRY).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const toolRoutes = Object.entries(SEO_REGISTRY).map(([slug]) => ({
    url: `${baseUrl}${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: slug.includes('compress') || slug.includes('edit') || slug.includes('pics-to-pdf') ? 0.95 : 0.85,
  }));

  const presetRoutes = Object.keys(PRESET_REGISTRY).map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/download-app',
    '/privacy',
    '/security',
    '/studio',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/blog' ? 0.85 : 0.7,
  }));

  const blogPosts = getAllPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...presetRoutes, ...blogRoutes];

  // Deduplicate by URL (preserving higher priority)
  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of allRoutes) {
    const existing = routeMap.get(item.url);
    if (!existing || (item.priority ?? 0) > (existing.priority ?? 0)) {
      routeMap.set(item.url, item);
    }
  }

  return Array.from(routeMap.values());
}
