'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { repeatText } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Repeat, Copy, Check, Share2 } from 'lucide-react';

export default function TextRepeaterPage() {
  const [inputText, setInputText] = useState('FileZenith ❤️');
  const [count, setCount] = useState(100);
  const [addNewline, setAddNewline] = useState(true);
  const [copied, setCopied] = useState(false);

  const repeatedOutput = useMemo(() => {
    return repeatText(inputText, count, ' ', addNewline);
  }, [inputText, count, addNewline]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(repeatedOutput);
      setCopied(true);
      toast.success(`Copied ${count} repeated instances to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  const handleShareWhatsApp = () => {
    const msg = repeatedOutput.slice(0, 1000);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <ToolLayout
      slug="/utility/text-repeater"
      title="Text Repeater (Repeat Words Up to 10,000 Times)"
      subtitle="Repeat words, phrases, or emojis up to 10,000 times with custom new line or space separators."
      badgeText="Viral Tool"
    >
      <div className="space-y-6 text-slate-900">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-slate-700">Text or Emoji to Repeat</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text or emoji..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-slate-700">Repetition Count (1 to 10,000)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="newline"
              checked={addNewline}
              onChange={(e) => setAddNewline(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="newline" className="text-xs font-bold text-slate-700 cursor-pointer">
              Add New Line Between Repetitions
            </label>
          </div>
        </div>

        {/* Output Workspace */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-700">Generated Output ({count} Times)</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-500 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy All'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition"
              >
                <Share2 className="w-3.5 h-3.5" /> WhatsApp
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={repeatedOutput}
            rows={10}
            aria-label="Generated Repeated Output"
            className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs text-slate-900 bg-slate-50 focus:outline-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
