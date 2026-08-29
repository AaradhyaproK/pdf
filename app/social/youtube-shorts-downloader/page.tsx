'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { parseSocialMediaURL, downloadSocialAsset, ParsedSocialMedia } from '@/lib/social-engine';
import { toast } from 'sonner';
import { Download, Film, Video, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function YouTubeShortsDownloaderPage() {
  const [url, setUrl] = useState('https://www.youtube.com/shorts/dQw4w9WgXcQ');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedSocialMedia | null>(null);

  const handleFetchMedia = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube Shorts link.');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await parseSocialMediaURL(url);
      setParsedData(data);
      toast.success('YouTube Shorts video extracted!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch Shorts video.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/social/youtube-shorts-downloader"
      title="YouTube Shorts Downloader Online Free (1080p MP4)"
      subtitle="Download YouTube Shorts videos in 1080p Full HD MP4 quality. Fast, free, private client-side processing."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Film className="w-4 h-4 text-rose-600" />
            Paste YouTube Shorts Link
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/shorts/..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:border-rose-500 min-h-[48px]"
              />
              <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleFetchMedia}
              disabled={isProcessing}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Fetching Shorts...' : 'Fetch Shorts Video'}</span>
            </button>
          </div>
        </div>

        {parsedData && (
          <div className="space-y-6 pt-6 border-t border-slate-200 animate-in fade-in duration-200">
            <div className="p-4 rounded-3xl bg-rose-50 border border-rose-100 flex flex-col sm:flex-row items-center gap-4">
              <img src={parsedData.thumbnailUrl} alt="Shorts" className="w-36 h-48 object-cover rounded-2xl border" />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700">1080p Shorts</span>
                <h3 className="text-base font-extrabold text-slate-900">{parsedData.title}</h3>
                <p className="text-xs text-slate-500">Duration: {parsedData.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {parsedData.formats.map((format, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-rose-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{format.quality}</p>
                      <p className="text-[11px] text-slate-400">{format.sizeLabel}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadSocialAsset(format, parsedData.title, parsedData.sourceUrl)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
