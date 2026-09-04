'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { convertTextCase } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Type, Copy, Check, RefreshCw } from 'lucide-react';

export default function CaseConverterPage() {
  const [text, setText] = useState('FileZenith free online utility tools and calculators');
  const [copied, setCopied] = useState(false);

  const handleConvert = (mode: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'sentence') => {
    const res = convertTextCase(text, mode);
    setText(res);
    toast.success(`Converted to ${mode.toUpperCase()} case!`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied text to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/case-converter"
      title="Text Case Converter (UPPERCASE, lowercase, Title Case, camelCase)"
      subtitle="Convert text case instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case."
      badgeText="Writing Tool"
    >
      <div className="space-y-6 text-slate-900">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-black uppercase text-slate-700">Enter or Paste Text</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            aria-label="Text Input for Case Converter"
            placeholder="Type or paste your text here..."
            className="w-full p-4 rounded-2xl border border-slate-300 font-medium text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <button
              onClick={() => handleConvert('upper')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => handleConvert('lower')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              lowercase
            </button>
            <button
              onClick={() => handleConvert('title')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              Title Case
            </button>
            <button
              onClick={() => handleConvert('sentence')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              Sentence case
            </button>
            <button
              onClick={() => handleConvert('camel')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              camelCase
            </button>
            <button
              onClick={() => handleConvert('snake')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              snake_case
            </button>
            <button
              onClick={() => handleConvert('kebab')}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition"
            >
              kebab-case
            </button>
            <button
              onClick={() => setText('')}
              className="py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs transition"
            >
              Clear Text
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
