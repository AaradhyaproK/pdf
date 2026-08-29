'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { parseSocialMediaURL, downloadSocialAsset, ParsedSocialMedia } from '@/lib/social-engine';
import { toast } from 'sonner';
import { Download, Share2, Video, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function TwitterDownloaderPage() {
  const [url, setUrl] = useState('https://x.com/twitter/status/1234567890');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedSocialMedia | null>(null);

  const handleFetchMedia = async () => {
    if (!url.trim()) {
      toast.error('Please enter an X / Twitter post URL.');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await parseSocialMediaURL(url);
      setParsedData(data);
      toast.success('Twitter / X post media extracted!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch X media.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/social/twitter-downloader"
      title="X / Twitter Video & Media Downloader"
      subtitle="Download X (Twitter) videos, GIFs, and post photos in 1080p HD MP4 format. Fast, free, client-side downloader."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-sky-500" />
            Paste X / Twitter Post URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://x.com/username/status/..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:border-sky-500 min-h-[48px]"
              />
              <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleFetchMedia}
              disabled={isProcessing}
              className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4 text-sky-100" />
              <span>{isProcessing ? 'Fetching X Video...' : 'Fetch X Media'}</span>
            </button>
          </div>
        </div>

        {parsedData && (
          <div className="space-y-6 pt-6 border-t border-slate-200 animate-in fade-in duration-200">
            <div className="p-4 rounded-3xl bg-sky-50 border border-sky-100 flex flex-col sm:flex-row items-center gap-4">
              <img src={parsedData.thumbnailUrl} alt="Twitter Video" className="w-44 h-28 object-cover rounded-2xl border" />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-700">X / Twitter Video</span>
                <h3 className="text-base font-extrabold text-slate-900">{parsedData.title}</h3>
                <p className="text-xs text-slate-500">Author: <strong className="text-slate-800">{parsedData.author}</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {parsedData.formats.map((format, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-sky-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{format.quality}</p>
                      <p className="text-[11px] text-slate-400">Format: {format.format.toUpperCase()} • {format.sizeLabel}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadSocialAsset(format, parsedData.title, parsedData.sourceUrl)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
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
