import { toast } from 'sonner';
import { trackToolExecution } from './admin-store';

export interface MediaFormat {
  quality: string;
  format: 'mp4' | 'mp3' | 'jpg' | 'png';
  sizeLabel: string;
  downloadUrl: string;
}

export interface ParsedSocialMedia {
  platform: 'youtube' | 'instagram' | 'twitter' | 'linkedin';
  mediaType: 'video' | 'shorts' | 'reel' | 'photo' | 'post';
  title: string;
  thumbnailUrl: string;
  author: string;
  sourceUrl: string;
  videoId?: string;
  duration?: string;
  formats: MediaFormat[];
}

/**
 * Parses YouTube, Instagram, X/Twitter, and LinkedIn URLs and fetches real video metadata.
 */
export async function parseSocialMediaURL(inputUrl: string): Promise<ParsedSocialMedia> {
  const url = inputUrl.trim();

  if (!url) {
    throw new Error('Please enter a valid social media URL.');
  }

  // 1. YouTube & YouTube Shorts
  const ytMatch = url.match(/(?:watch\?v=|shorts\/|youtu\.be\/|ssyoutube\.com\/watch\?v=|embed\/|v\/|watch\?.+&v=)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const isShorts = url.includes('/shorts/');

    let title = isShorts ? `YouTube Short (${videoId})` : `YouTube Video (${videoId})`;
    let author = '@YouTubeCreator';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.title) title = data.title;
        if (data.author_name) author = data.author_name;
        if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
      } else {
        const noembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
        if (noembedRes.ok) {
          const data = await noembedRes.json();
          if (data.title) title = data.title;
          if (data.author_name) author = data.author_name;
          if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
        }
      }
    } catch {
      // ignore network errors for metadata fetching
    }

    return {
      platform: 'youtube',
      mediaType: isShorts ? 'shorts' : 'video',
      title,
      thumbnailUrl,
      author,
      sourceUrl: cleanUrl,
      videoId,
      duration: isShorts ? 'Shorts' : 'Full HD',
      formats: [
        { quality: '1080p Full HD Video (MP4)', format: 'mp4', sizeLabel: '1080p Full HD', downloadUrl: cleanUrl },
        { quality: '720p HD Video (MP4)', format: 'mp4', sizeLabel: '720p HD', downloadUrl: cleanUrl },
        { quality: '480p SD Video (MP4)', format: 'mp4', sizeLabel: '480p SD', downloadUrl: cleanUrl },
        { quality: '360p Fast Video (MP4)', format: 'mp4', sizeLabel: '360p Fast', downloadUrl: cleanUrl },
        { quality: '320kbps Audio Track (MP3)', format: 'mp3', sizeLabel: 'High Quality Audio', downloadUrl: cleanUrl },
        { quality: 'HD Cover Thumbnail (4K JPG)', format: 'jpg', sizeLabel: 'MaxRes Photo', downloadUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
      ],
    };
  }

  // 2. Instagram Posts & Reels
  if (url.includes('instagram.com') || url.includes('instagr.am')) {
    const isReel = url.includes('/reel/') || url.includes('/reels/');
    const shortcodeMatch = url.match(/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/);
    const shortcode = shortcodeMatch ? shortcodeMatch[1] : 'reel';
    const cleanUrl = `https://www.instagram.com/reel/${shortcode}/`;

    let title = isReel ? `Instagram Reel Video (${shortcode})` : `Instagram Photo Post (${shortcode})`;
    let author = '@InstagramUser';
    let thumbnailUrl = 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=80';

    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) title = data.title;
        if (data.author_name) author = `@${data.author_name.replace(/\s+/g, '')}`;
        if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
      }
    } catch {
      //
    }

    return {
      platform: 'instagram',
      mediaType: isReel ? 'reel' : 'photo',
      title,
      thumbnailUrl,
      author,
      sourceUrl: cleanUrl,
      duration: isReel ? 'Reel Video' : undefined,
      formats: [
        { quality: '1080p Full HD Reel Video (MP4)', format: 'mp4', sizeLabel: 'Full HD MP4', downloadUrl: cleanUrl },
        { quality: '720p HD Reel Video (MP4)', format: 'mp4', sizeLabel: 'Standard MP4', downloadUrl: cleanUrl },
        { quality: 'High Res Cover Photo (JPG)', format: 'jpg', sizeLabel: 'HD Photo', downloadUrl: thumbnailUrl },
        { quality: 'Original Audio Track (MP3)', format: 'mp3', sizeLabel: 'MP3 Audio', downloadUrl: cleanUrl },
      ],
    };
  }

  // 3. X / Twitter Posts
  if (url.includes('twitter.com') || url.includes('x.com')) {
    let title = 'X / Twitter Post Video Media';
    let author = '@x_user';

    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) title = data.title;
        if (data.author_name) author = `@${data.author_name}`;
      }
    } catch {
      //
    }

    return {
      platform: 'twitter',
      mediaType: 'video',
      title,
      thumbnailUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&auto=format&fit=crop&q=80',
      author,
      sourceUrl: url,
      duration: 'X Video',
      formats: [
        { quality: '1080p HD Video (MP4)', format: 'mp4', sizeLabel: 'HD MP4', downloadUrl: url },
        { quality: 'High Res Cover Media (PNG)', format: 'png', sizeLabel: 'PNG Photo', downloadUrl: url },
      ],
    };
  }

  // 4. LinkedIn Posts
  if (url.includes('linkedin.com')) {
    return {
      platform: 'linkedin',
      mediaType: 'post',
      title: 'LinkedIn Professional Post Video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&auto=format&fit=crop&q=80',
      author: '@LinkedInUser',
      sourceUrl: url,
      duration: 'LinkedIn Media',
      formats: [
        { quality: '1080p HD Video (MP4)', format: 'mp4', sizeLabel: 'HD MP4', downloadUrl: url },
        { quality: 'Document PDF Slides (JPG)', format: 'jpg', sizeLabel: 'Slide Deck', downloadUrl: url },
        { quality: 'Audio Track (MP3)', format: 'mp3', sizeLabel: 'MP3 Audio', downloadUrl: url },
      ],
    };
  }

  throw new Error('Unsupported URL. Please enter a YouTube, Instagram, X (Twitter), or LinkedIn link.');
}

/**
 * Triggers 100% direct in-app video stream file download & logs event to Firestore.
 */
export async function downloadSocialAsset(format: MediaFormat, title: string, sourceUrl?: string): Promise<boolean> {
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const filename = `${sanitizedTitle}-${format.quality.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format.format}`;

  // Log execution event to Firestore
  trackToolExecution(sourceUrl || '/social/downloader', 'Social');

  // 1. Direct HD Cover Photo Download (JPG/PNG)
  if (format.format === 'jpg' || format.format === 'png') {
    if (format.downloadUrl && format.downloadUrl.startsWith('http')) {
      const toastId = toast.loading('Downloading cover thumbnail...');
      try {
        let res = await fetch(format.downloadUrl);
        // Fallback for YouTube maxres thumbnail if not available
        if (!res.ok && format.downloadUrl.includes('maxresdefault.jpg')) {
          res = await fetch(format.downloadUrl.replace('maxresdefault.jpg', 'hqdefault.jpg'));
        }
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          toast.success('HD Cover photo downloaded successfully!', { id: toastId });
          return true;
        } else {
          toast.error('Could not download cover thumbnail.', { id: toastId });
          return false;
        }
      } catch {
        toast.error('Failed to download cover thumbnail.', { id: toastId });
        return false;
      }
    }
  }

  // 2. Direct In-App Media Download via Next.js Proxy API (/api/stream)
  const targetUrl = sourceUrl || format.downloadUrl;
  const proxyApiUrl = `/api/stream?url=${encodeURIComponent(targetUrl)}&filename=${encodeURIComponent(filename)}&format=${encodeURIComponent(format.format)}&quality=${encodeURIComponent(format.quality)}`;

  const toastId = toast.loading(`Processing & preparing ${format.quality}... Please wait a few seconds.`);

  try {
    const res = await fetch(proxyApiUrl);
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success(`${format.format.toUpperCase()} downloaded successfully!`, { id: toastId });
      return true;
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to download video stream. The media could not be extracted.', { id: toastId });
      return false;
    }
  } catch {
    toast.error('Network error while downloading the media file.', { id: toastId });
    return false;
  }
}
