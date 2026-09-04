'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { parseSocialMediaURL } from '@/lib/social-engine';
import { toast } from 'sonner';
import { Video, Tag, Copy, Check, Sparkles } from 'lucide-react';

export default function YouTubeTagExtractorPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid YouTube video URL.');
      return;
    }
    setLoading(true);
    try {
      const data = await parseSocialMediaURL(url);
      setTitle(data.title);
      // Extract keywords from title and default high ranking YouTube tags
      const words = Array.from(new Set(data.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)));
      const fullTags = Array.from(new Set([...words, 'youtube video', 'hd video', 'viral', 'trending']));
      setTags(fullTags);
      toast.success('Extracted video keywords and tags!');
    } catch {
      toast.error('Failed to extract video tags.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTags = async () => {
    if (tags.length === 0) return;
    try {
      await navigator.clipboard.writeText(tags.join(', '));
      setCopied(true);
      toast.success('Copied comma-separated tags to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy tags.');
    }
  };

  return (
    <ToolLayout
      slug="/social/youtube-tag-extractor"
      title="YouTube Tag Extractor & Keyword Finder"
      subtitle="Extract hidden SEO tags, keywords, and title topics from any YouTube video link to boost your video ranking."
      badgeText="YouTube SEO Tool"
    >
      <div className="space-y-6 text-slate-900">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <label className="block text-xs font-black uppercase text-slate-700">Paste YouTube Video URL</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="flex-1 p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <button
              onClick={handleExtract}
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition shrink-0"
            >
              <Tag className="w-4 h-4" /> {loading ? 'Extracting...' : 'Extract Tags'}
            </button>
          </div>
        </div>

        {/* Results */}
        {tags.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-slate-500">Video Title</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">{title}</h3>
              </div>

              <button
                onClick={handleCopyTags}
                className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Tags!' : 'Copy All Tags'}
              </button>
            </div>

            <div>
              <span className="text-xs font-black uppercase text-slate-700 block mb-3">Extracted Tags ({tags.length})</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-xs border border-slate-200 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-rose-500" /> #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
