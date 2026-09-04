'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Camera,
  Copy,
  Sparkles,
  Check,
  CheckCircle2,
  Share2,
  Scissors,
  Tag,
  Hash,
  RotateCcw,
} from 'lucide-react';

const HASHTAG_PRESETS: Record<string, { label: string; tags: string[] }> = {
  reels: {
    label: '🚀 Viral Reels',
    tags: [
      '#reels',
      '#reelsinstagram',
      '#viralreels',
      '#trending',
      '#explore',
      '#explorepage',
      '#fyp',
      '#foryou',
      '#instareels',
      '#viralvideo',
    ],
  },
  travel: {
    label: '✈️ Travel & Life',
    tags: [
      '#travel',
      '#wanderlust',
      '#nature',
      '#travelgram',
      '#instatravel',
      '#adventure',
      '#vacation',
      '#explore',
      '#landscape',
      '#travelphotography',
    ],
  },
  fitness: {
    label: '🏋️ Fitness & Gym',
    tags: [
      '#fitness',
      '#gym',
      '#workout',
      '#fit',
      '#fitnessmotivation',
      '#bodybuilding',
      '#training',
      '#fitfam',
      '#health',
      '#lifestyle',
    ],
  },
  tech: {
    label: '💻 Tech & AI',
    tags: [
      '#tech',
      '#technology',
      '#ai',
      '#coding',
      '#developer',
      '#software',
      '#digital',
      '#innovation',
      '#startup',
      '#webdev',
    ],
  },
  fashion: {
    label: '👗 Fashion & Style',
    tags: [
      '#fashion',
      '#style',
      '#ootd',
      '#fashionblogger',
      '#instafashion',
      '#outfit',
      '#model',
      '#beauty',
      '#streetwear',
      '#trendy',
    ],
  },
  food: {
    label: '🍔 Food & Cooking',
    tags: [
      '#food',
      '#foodie',
      '#instafood',
      '#foodphotography',
      '#yummy',
      '#delicious',
      '#foodstagram',
      '#chef',
      '#recipe',
      '#foodblogger',
    ],
  },
};

export default function InstagramCaptionCopierPage() {
  const [captionInput, setCaptionInput] = useState<string>(
    '🚀 5 Mind-Blowing Coding Hacks Every Developer Needs to Know in 2026!\n\nSave this reel for later 📌 and share with a dev friend!\n\n👇 Which hack was your favorite? Comment below!'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('reels');

  // Clean caption text (remove consecutive blank lines, trim extra spaces)
  const cleanCaption = (raw: string) => {
    return raw
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/[^\S\r\n]+/g, ' ')
      .trim();
  };

  const handleCleanText = () => {
    const cleaned = cleanCaption(captionInput);
    setCaptionInput(cleaned);
    toast.success('Caption formatted cleanly!');
  };

  const currentTags = HASHTAG_PRESETS[selectedCategory]?.tags || [];

  const handleAppendHashtags = () => {
    const tagString = '\n\n' + currentTags.join(' ');
    setCaptionInput((prev) => prev.trim() + tagString);
    toast.success(`Appended ${currentTags.length} viral hashtags!`);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionInput);
    toast.success('Caption & hashtags copied to clipboard!');
  };

  const handleCopyHashtagsOnly = () => {
    navigator.clipboard.writeText(currentTags.join(' '));
    toast.success('Hashtags copied to clipboard!');
  };

  const stats = useMemo(() => {
    const text = captionInput.trim();
    const characters = text.length;
    const words = text ? text.split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    return { characters, words, lines };
  }, [captionInput]);

  return (
    <ToolLayout
      slug="/social/instagram-caption-copier"
      title="Instagram Reels Caption Cleaner & Viral Hashtag Copier"
      subtitle="Clean Instagram caption formatting, remove unwanted clutter/linebreaks, generate trending viral hashtags by niche, and copy text with 1-click."
      badgeText="Instagram Caption Helper"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Caption Editor Workspace */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-pink-600" />
                <span>Caption Cleaner & Formatter</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste draft captions, trim unwanted spaces, and append trending hashtags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCleanText}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5 text-pink-600" />
                <span>Clean Formatting</span>
              </button>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Caption</span>
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <textarea
              rows={6}
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="Paste or write your Instagram Reel caption..."
              className="w-full p-4 rounded-2xl border border-slate-300 font-sans text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50 focus:bg-white shadow-inner"
            />

            {/* Live Stats Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 font-semibold">
              <div className="flex items-center gap-4">
                <span>{stats.characters} Characters</span>
                <span>{stats.words} Words</span>
                <span>{stats.lines} Lines</span>
              </div>
              <span className={stats.characters > 2200 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                Max Limit: 2,200 chars
              </span>
            </div>
          </div>
        </div>

        {/* Viral Hashtag Generator Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-600" />
                <span>Viral Hashtags Generator by Niche</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select category to fetch high-engagement hashtags.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyHashtagsOnly}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Tags</span>
              </button>
              <button
                type="button"
                onClick={handleAppendHashtags}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Append to Caption</span>
              </button>
            </div>
          </div>

          {/* Niche Categories */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(HASHTAG_PRESETS).map(([key, data]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {data.label}
              </button>
            ))}
          </div>

          {/* Hashtag Pills Grid */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-xl bg-white text-purple-700 font-mono text-xs font-bold border border-purple-200 shadow-2xs select-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
