/**
 * Tool Search & Recommendation Engine
 * Provides intelligent search, synonym matching, and smart ranking.
 */

export interface GenericToolItem {
  id?: string;
  name: string;
  slug: string;
  desc?: string;
  badge?: string;
  category?: string;
  keywords?: string[];
  [key: string]: any;
}

/**
 * Detects if a search query is looking for Image/Photo/Scan to PDF conversion.
 * (e.g. "jpg to pdf", "png to pdf", "photo to pdf", "image to pdf", "jpg2pdf", "photos into pdf")
 */
export function isPicsToPdfQuery(query: string): boolean {
  const q = query.trim().toLowerCase().replace(/[-_]/g, ' ');
  if (!q) return false;

  // Direct fast matches
  const directMatches = [
    'jpg to pdf',
    'jpeg to pdf',
    'png to pdf',
    'image to pdf',
    'images to pdf',
    'photo to pdf',
    'photos to pdf',
    'pic to pdf',
    'pics to pdf',
    'picture to pdf',
    'pictures to pdf',
    'jpg2pdf',
    'png2pdf',
    'jpeg2pdf',
    'img to pdf',
    'scan to pdf',
    'camera to pdf',
    'heic to pdf',
    'webp to pdf',
    'photo pdf',
    'photos pdf',
    'jpg pdf',
    'png pdf',
    'image pdf',
    'images pdf',
    'pics pdf',
    'picture pdf',
    'pictures pdf',
  ];

  if (directMatches.some((dm) => q.includes(dm) || dm.includes(q))) {
    return true;
  }

  // Guard against reverse conversions: "pdf to jpg", "pdf to image", "pdf to png"
  if (
    q.startsWith('pdf to') ||
    q.startsWith('pdf 2') ||
    q.includes('pdf to jpg') ||
    q.includes('pdf to png') ||
    q.includes('pdf to image') ||
    q.includes('pdf to pic') ||
    q.includes('pdf to photo')
  ) {
    return false;
  }

  // Token-based matching: has an image-related term AND a pdf-related term
  const imageTerms = [
    'jpg',
    'jpeg',
    'png',
    'image',
    'images',
    'photo',
    'photos',
    'pic',
    'pics',
    'picture',
    'pictures',
    'scan',
    'scans',
    'camera',
    'heic',
    'webp',
    'img',
  ];

  const words = q.split(/\s+/);
  const hasImage = words.some((w) => imageTerms.includes(w) || imageTerms.some((it) => w.startsWith(it)));
  const hasPdf = words.some((w) => w === 'pdf' || w.includes('pdf'));

  return hasImage && hasPdf;
}

/**
 * Intelligent tool search matcher that supports:
 * - Substring matching across name, desc, slug, badge
 * - Bidirectional keyword matching
 * - Multi-word query token matching
 * - Special alias routing (e.g. jpg to pdf -> Pics to PDF)
 */
export function matchTool(tool: GenericToolItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const isImageToPdf = isPicsToPdfQuery(q);
  const isPicsToPdfTool =
    tool.slug === '/image/pics-to-pdf' ||
    tool.slug === '/image/to-pdf' ||
    tool.id === 'pics-to-pdf' ||
    tool.id === 'to-pdf';

  if (isImageToPdf && isPicsToPdfTool) {
    return true;
  }

  const name = tool.name?.toLowerCase() || '';
  const desc = tool.desc?.toLowerCase() || '';
  const slug = tool.slug?.toLowerCase() || '';
  const badge = tool.badge?.toLowerCase() || '';
  const keywords = Array.isArray(tool.keywords) ? tool.keywords.map((k) => k.toLowerCase()) : [];

  // Direct substring check
  if (name.includes(q) || desc.includes(q) || slug.includes(q) || badge.includes(q)) {
    return true;
  }

  // Bidirectional keyword check
  if (keywords.some((k) => k.includes(q) || q.includes(k))) {
    return true;
  }

  // Multi-word token check: all words in query match across combined fields
  const queryTokens = q.split(/\s+/).filter(Boolean);
  if (queryTokens.length > 1) {
    const combinedContent = `${name} ${desc} ${slug} ${badge} ${keywords.join(' ')}`;
    const allTokensMatch = queryTokens.every((token) => combinedContent.includes(token));
    if (allTokensMatch) {
      return true;
    }
  }

  return false;
}

/**
 * Sorts and prioritizes tools for a given search query.
 * For example, if searching "jpg to pdf" or "png to pdf", places Pics to PDF at the very top.
 */
export function rankToolsForSearch<T extends GenericToolItem>(tools: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;

  const isImageToPdf = isPicsToPdfQuery(q);

  return [...tools].sort((a, b) => {
    const aIsPics = a.slug === '/image/pics-to-pdf' || a.id === 'pics-to-pdf' || a.slug === '/image/to-pdf';
    const bIsPics = b.slug === '/image/pics-to-pdf' || b.id === 'pics-to-pdf' || b.slug === '/image/to-pdf';

    if (isImageToPdf) {
      if (aIsPics && !bIsPics) return -1;
      if (!aIsPics && bIsPics) return 1;
    }

    // Exact name match priority
    const aExact = a.name.toLowerCase() === q;
    const bExact = b.name.toLowerCase() === q;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // Starts with match priority
    const aStarts = a.name.toLowerCase().startsWith(q);
    const bStarts = b.name.toLowerCase().startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return 0;
  });
}
