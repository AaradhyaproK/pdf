'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { generateAllFancyTexts } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  Type,
  Search,
  Zap,
} from 'lucide-react';

export default function FancyTextGeneratorPage() {
  const [inputText, setInputText] = useState('FileZenith');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const styles = useMemo(() => {
    return generateAllFancyTexts(inputText);
  }, [inputText]);

  const filteredStyles = useMemo(() => {
    if (categoryFilter === 'all') return styles;
    return styles.filter((s) => s.category === categoryFilter);
  }, [styles, categoryFilter]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied fancy font to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  const handleShareWhatsApp = (text: string) => {
    const msg = `${text}\nGenerated with FileZenith Fancy Text: https://www.filezenith.com/utility/fancy-text-generator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <ToolLayout
      slug="/utility/fancy-text-generator"
      title="Fancy Text Generator & Cool Font Converter"
      subtitle="Convert plain text into 30+ stylish Unicode fonts, gothic letters, cursive scripts, bold symbols, and gaming nickname tags for Instagram, WhatsApp & Free Fire."
      badgeText="30+ Cool Font Styles"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Live Input Field Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Type Your Name or Text Below
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your name, bio, or status here..."
              className="w-full p-4 sm:p-5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base sm:text-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All 30+ Styles' },
              { id: 'popular', label: 'Popular' },
              { id: 'bold', label: 'Bold & Sans' },
              { id: 'gothic', label: 'Gothic / Fraktur' },
              { id: 'cursive', label: 'Cursive / Script' },
              { id: 'symbols', label: 'Gaming & Frames' },
              { id: 'funky', label: 'Flip & Vaporwave' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fancy Styles Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredStyles.map((item, idx) => {
            const isCopied = copiedId === `style-${idx}`;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-slate-400">Unicode 100% Compatible</span>
                </div>

                {/* Generated Result Text */}
                <div className="text-base sm:text-xl font-bold text-slate-900 break-words py-2 select-all leading-normal">
                  {item.result}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(`style-${idx}`, item.result)}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(item.result)}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
