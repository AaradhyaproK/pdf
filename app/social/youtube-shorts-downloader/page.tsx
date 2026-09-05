'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { parseSocialMediaURL, downloadSocialAsset, ParsedSocialMedia, MediaFormat } from '@/lib/social-engine';
import { toast } from 'sonner';
import { Download, Film, Video, Music, Image as ImageIcon, Link as LinkIcon, Sparkles, Loader2 } from 'lucide-react';

export default function YouTubeShortsDownloaderPage() {
  const [url, setUrl] = useState('https://www.youtube.com/shorts/J---aiyznGQ');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
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

  const handleDownload = async (format: MediaFormat) => {
    if (!parsedData || downloadingQuality) return;
    setDownloadingQuality(format.quality);
    try {
      await downloadSocialAsset(format, parsedData.title, parsedData.sourceUrl);
    } finally {
      setDownloadingQuality(null);
    }
  };

  return (
    <ToolLayout
      slug="/social/youtube-shorts-downloader"
      title="YouTube Shorts Downloader Online Free (1080p MP4)"
      subtitle="Download YouTube Shorts videos in 1080p Full HD MP4 quality and audio. Fast, free, 100% direct client processing."
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
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-200" />
                  <span>Fetching Shorts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  <span>Fetch Shorts Video</span>
                </>
              )}
            </button>
          </div>
        </div>

        {parsedData && (
          <div className="space-y-6 pt-6 border-t border-slate-200 animate-in fade-in duration-200">
            <div className="p-4 rounded-3xl bg-rose-50/60 border border-rose-100 flex flex-col sm:flex-row items-center gap-4">
              <img src={parsedData.thumbnailUrl} alt="Shorts" className="w-36 h-48 object-cover rounded-2xl border border-rose-200 shadow-xs" />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 tracking-wider">
                  YouTube Shorts
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{parsedData.title}</h3>
                <p className="text-xs text-slate-500">
                  Creator: <strong className="text-slate-800">{parsedData.author}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Available Formats
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {parsedData.formats.map((format, idx) => {
                  const isCurrentDownloading = downloadingQuality === format.quality;

                  return (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-rose-300 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl ${format.format === 'mp4' ? 'bg-rose-50 text-rose-600' : format.format === 'mp3' ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600'}`}>
                          {format.format === 'mp4' ? <Video className="w-5 h-5" /> : format.format === 'mp3' ? <Music className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{format.quality}</p>
                          <p className="text-[11px] text-slate-400">{format.format.toUpperCase()} • {format.sizeLabel}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(format)}
                        disabled={downloadingQuality !== null}
                        className={`px-4 py-2 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-xs ${
                          isCurrentDownloading
                            ? 'bg-rose-600 text-white animate-pulse'
                            : downloadingQuality !== null
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 hover:bg-rose-600 text-white cursor-pointer'
                        }`}
                      >
                        {isCurrentDownloading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
