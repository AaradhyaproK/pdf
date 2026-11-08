import { MetadataRoute } from 'next';
import { SEO_REGISTRY, NOINDEX_SLUGS } from '@/lib/seo-config';
import { PRESET_REGISTRY } from '@/lib/presets-data';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';
  const defaultOgImage = `${baseUrl}/filezenith-og.png`;
  const siteBuildDate = new Date('2026-11-08T00:00:00.000Z');

  const categoryRoutes = Object.keys(CATEGORY_REGISTRY).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: siteBuildDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    images: [defaultOgImage],
  }));

  const toolRoutes = Object.entries(SEO_REGISTRY).map(([slug]) => ({
    url: `${baseUrl}${slug}`,
    lastModified: siteBuildDate,
    changeFrequency: 'daily' as const,
    priority: slug.includes('compress') || slug.includes('edit') || slug.includes('pics-to-pdf') || slug.includes('excel') || slug.includes('azw3') ? 0.95 : 0.85,
    images: [defaultOgImage],
  }));

  const presetRoutes = Object.keys(PRESET_REGISTRY).map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: siteBuildDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    images: [defaultOgImage],
  }));

  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/csc-cyber-cafe-tools',
    '/download-app',
    '/editorial-policy',
    '/affiliate-disclosure',
    '/privacy',
    '/security',
    '/studio',
    '/terms',
    '/tools/online-signature-maker',
    '/tools/pan-card-photo-resizer',
    '/tools/aadhaar-card-print',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: siteBuildDate,
    changeFrequency: 'weekly' as const,
    priority:
      route === ''
        ? 1.0
        : route.startsWith('/tools/')
          ? 0.95
          : route === '/blog' || route === '/csc-cyber-cafe-tools'
            ? 0.9
            : 0.7,
    images: [defaultOgImage],
  }));

  const blogPosts = getAllPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    images: [post.image ? `${baseUrl}${post.image}` : defaultOgImage],
  }));

  // Explicitly exclude redirected URLs so sitemap only contains clean 200 OK canonicals
  const REDIRECTED_SLUGS = new Set([
    // Category Aliases
    '/pdf',
    '/image',
    '/utility',
    '/social',

    // PDF Compression Consolidations
    '/pdf/compress-to-100kb',
    '/pdf/compress-to-200kb',
    '/pdf/compress-to-300kb',
    '/pdf/compress-to-500kb',
    '/pdf/compress-to-1mb',

    // Image Compression Consolidations
    '/image/compress-to-20kb',
    '/image/compress-to-50kb',
    '/image/compress-to-100kb',

    // Exam Resizer Consolidations
    '/tools/railway-rrb-photo-resizer',
    '/tools/ibps-photo-resizer',
    '/tools/sbi-po-photo-resizer',
    '/tools/ssc-cgl-photo-signature-resizer',
    '/tools/upsc-otr-photo-resizer',
    '/tools/jee-photo-resizer',
    '/tools/cuet-photo-resizer',

    // Signature Suite Consolidations
    '/tools/signature-resizer-10-to-20kb',
    '/tools/gate-signature-resizer',
    '/tools/clean-black-white-signature',

    // Novelty Duplicates
    '/utility/roll-the-dice',

    // Legacy Redirects
    '/image/to-pdf',
    '/image/png-to-pdf',
    '/image/heic-to-jpg',
    '/image/passport-photo-maker',
    '/image/resize-signature',
    '/image/convert',
    '/tools/compress-image-to-20kb',
    '/tools/compress-image-to-50kb',
    '/tools/compress-image-to-100kb',
    '/blog/income-tax-slabs-fy-2025-26',
    '/utility/love-calculator',
    '/presets/ssc-pdf-200kb',
    '/presets/upsc-pdf-300kb',
  ]);

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...presetRoutes, ...blogRoutes].filter((item) => {
    const slug = item.url.replace(baseUrl, '');
    return !REDIRECTED_SLUGS.has(slug) && !NOINDEX_SLUGS.has(slug);
  });

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
