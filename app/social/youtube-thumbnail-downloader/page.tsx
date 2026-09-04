'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { parseSocialMediaURL } from '@/lib/social-engine';
import { toast } from 'sonner';
import { Video, Download, Image as ImageIcon, Copy, Check, Sparkles } from 'lucide-react';

export default function YouTubeThumbnailDownloaderPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube video URL.');
      return;
    }
    setLoading(true);
    try {
      const data = await parseSocialMediaURL(url);
      if (data.videoId) {
        setVideoId(data.videoId);
        toast.success('Extracted YouTube cover thumbnail!');
      } else {
        toast.error('Could not extract YouTube video ID from URL.');
      }
    } catch {
      toast.error('Failed to parse YouTube URL.');
    } finally {
      setLoading(false);
    }
  };

  const downloadThumbnail = async (imgUrl: string, filename: string) => {
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Downloaded thumbnail image!');
    } catch {
      window.open(imgUrl, '_blank');
    }
  };

  return (
    <ToolLayout
      slug="/social/youtube-thumbnail-downloader"
      title="YouTube Thumbnail Downloader (1080p Full HD Grabber)"
      subtitle="Download YouTube video cover thumbnails free in 1080p MaxRes, 640p HD, and 480p HQ resolutions."
      badgeText="Social Media Tool"
    >
      <div className="space-y-6 text-slate-900">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <label className="block text-xs font-black uppercase text-slate-700">Paste YouTube Video or Shorts URL</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-1 p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <button
              onClick={handleFetch}
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition shrink-0"
            >
              <Video className="w-4 h-4" /> {loading ? 'Fetching...' : 'Get Thumbnails'}
            </button>
          </div>
        </div>

        {/* Thumbnail Preview Grid */}
        {videoId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1080p MaxRes */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-900">1080p Full HD (MaxRes)</span>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-full">Max Quality</span>
              </div>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="1080p YouTube Thumbnail"
                className="w-full h-auto rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
              <button
                onClick={() => downloadThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, `yt-thumbnail-1080p-${videoId}.jpg`)}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Download 1080p HD Image
              </button>
            </div>

            {/* 640p Standard HD */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-900">640p Standard HD</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-extrabold rounded-full">Standard</span>
              </div>
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="640p YouTube Thumbnail"
                className="w-full h-auto rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
              <button
                onClick={() => downloadThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, `yt-thumbnail-640p-${videoId}.jpg`)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Download 640p Image
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
