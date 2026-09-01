'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { analyzeTextMetrics } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Type,
  Clock,
  Hash,
  BarChart2,
  Clipboard,
  Copy,
  Trash2,
  Sparkles,
  AlignLeft,
  Scissors,
  Check,
} from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => analyzeTextMetrics(text), [text]);

  // Handle Clipboard Paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
        toast.success('Pasted text from clipboard!');
      } else {
        toast.error('Clipboard is empty.');
      }
    } catch {
      toast.error('Unable to access clipboard. Please paste manually using Ctrl+V / Cmd+V.');
    }
  };

  // Handle Copy
  const handleCopy = async () => {
    if (!text.trim()) {
      toast.error('Nothing to copy.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied text to clipboard!');
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  // Handle Clear
  const handleClear = () => {
    setText('');
    toast.info('Cleared text editor.');
  };

  // Case Transformations
  const transformCase = (mode: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!text.trim()) return;
    let converted = text;

    if (mode === 'upper') {
      converted = text.toUpperCase();
    } else if (mode === 'lower') {
      converted = text.toLowerCase();
    } else if (mode === 'title') {
      converted = text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    } else if (mode === 'sentence') {
      converted = text.toLowerCase().replace(/(^\s*|\.\s*)([a-z])/g, (m) => m.toUpperCase());
    }

    setText(converted);
    toast.success(`Converted text to ${mode}case!`);
  };

  // Text Cleaners
  const cleanExtraSpaces = () => {
    if (!text.trim()) return;
    const cleaned = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
    setText(cleaned);
    toast.success('Removed extra spaces!');
  };

  const removeLineBreaks = () => {
    if (!text.trim()) return;
    const cleaned = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    setText(cleaned);
    toast.success('Removed line breaks!');
  };

  return (
    <ToolLayout
      slug="/utility/word-counter"
      title="Real-Time Word & Character Counter Online"
      subtitle="Count words, characters, sentences, paragraphs, estimated reading speed, and analyze keyword frequency density in real time."
      badgeText="Real-Time Text Analyzer"
    >
      <div className="space-y-8 pb-24 md:pb-6">
        {/* Metric Cards Banner in Pure Day Mode White Cards with High Contrast Black Text */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Words */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 text-slate-900">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600">
              <span className="flex items-center gap-1.5">
                <Type className="w-4 h-4 text-indigo-600" /> Words
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              Clean Word Tokens
            </div>
          </div>

          {/* Characters */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 text-slate-900">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600">
              <span className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-emerald-600" /> Characters
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats.charactersWithSpaces.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              No Spaces: {stats.charactersWithoutSpaces.toLocaleString()}
            </div>
          </div>

          {/* Reading Time */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 text-slate-900">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" /> Reading Time
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ~{stats.readingTimeMinutes} min
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              Speaking: ~{stats.speakingTimeMinutes} min
            </div>
          </div>

          {/* Sentences */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 text-slate-900">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-600" /> Sentences
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats.sentences.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              Paragraphs: {stats.paragraphs.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Editor Main Container Card (White Card with Black Text) */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 text-slate-900">
          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Paste Clipboard Content"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste Text</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy Text to Clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!text}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 disabled:opacity-40 border border-rose-200 text-rose-700 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Clear Editor"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* Case Converters & Cleaners */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-[10px] font-black text-slate-500 uppercase px-1">Case:</span>
                <button
                  type="button"
                  onClick={() => transformCase('upper')}
                  className="px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 text-slate-900 font-black cursor-pointer shadow-2xs"
                  title="UPPERCASE"
                >
                  AA
                </button>
                <button
                  type="button"
                  onClick={() => transformCase('lower')}
                  className="px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 text-slate-900 font-black cursor-pointer shadow-2xs"
                  title="lowercase"
                >
                  aa
                </button>
                <button
                  type="button"
                  onClick={() => transformCase('title')}
                  className="px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 text-slate-900 font-black cursor-pointer shadow-2xs"
                  title="Title Case"
                >
                  Aa
                </button>
              </div>

              <button
                type="button"
                onClick={cleanExtraSpaces}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                title="Remove Extra Spaces"
              >
                <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Trim Spaces</span>
              </button>
            </div>
          </div>

          {/* Live Textarea Input in Day Mode (White BG & Black Text) */}
          <div className="relative">
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your essay, blog draft, article, or text snippet here for real-time word count, character metrics, reading speed, and keyword density analysis..."
              className="w-full p-4 sm:p-5 rounded-2xl border border-slate-300 bg-white text-slate-900 font-bold text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs placeholder:text-slate-400 placeholder:font-medium"
            />

            {!text && (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Clipboard className="w-4 h-4" />
                <span>Click Here to Paste Text from Clipboard</span>
              </button>
            )}
          </div>

          {/* Summary Row */}
          <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>Clean Characters (no spaces): <strong className="text-slate-900 font-black">{stats.charactersWithoutSpaces.toLocaleString()}</strong></span>
            </span>
            <span>Total Paragraphs: <strong className="text-slate-900 font-black">{stats.paragraphs.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Keyword Density Analysis Table */}
        {stats.topKeywords.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Top Keyword Density & Frequency
              </h4>
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                SEO Density Map
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.topKeywords.map((kw, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-slate-900 capitalize truncate" title={kw.word}>
                      {kw.word}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200 shrink-0">
                      {kw.count}×
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Density:</span>
                      <span className="font-extrabold text-indigo-700">{kw.densityPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, kw.densityPercentage * 10)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Mobile Action Bottom Navbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-2.5 flex items-center justify-between gap-2 md:hidden text-slate-900">
        <div className="flex items-center gap-2 pl-2">
          <Type className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black text-slate-900">
            {stats.words.toLocaleString()} Words • {stats.charactersWithSpaces.toLocaleString()} Chars
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePaste}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1 shrink-0 shadow-md cursor-pointer"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1 shrink-0 border border-slate-200 disabled:opacity-40 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
