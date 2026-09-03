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
  Share2,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const basic = analyzeTextMetrics(text);

    // Advanced character breakdown
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const symbols = Math.max(0, text.length - letters - digits - spaces);

    // Social Media limits
    const twitterPct = Math.min(100, Math.round((text.length / 280) * 100));
    const igBioPct = Math.min(100, Math.round((text.length / 150) * 100));
    const linkedInPct = Math.min(100, Math.round((text.length / 3000) * 100));
    const metaDescPct = Math.min(100, Math.round((text.length / 160) * 100));

    // Flesch Reading Ease score estimate
    let fleschScore = 100;
    if (basic.words > 0 && basic.sentences > 0) {
      const syllables = (text.match(/[aeiouy]{1,2}/gi) || []).length || basic.words;
      fleschScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(206.835 - 1.015 * (basic.words / basic.sentences) - 84.6 * (syllables / basic.words))
        )
      );
    }

    let readabilityLabel = 'Easy to Read';
    if (fleschScore < 30) readabilityLabel = 'Very Difficult (Academic)';
    else if (fleschScore < 50) readabilityLabel = 'Difficult (College Level)';
    else if (fleschScore < 70) readabilityLabel = 'Standard / Medium';
    else readabilityLabel = 'Easy / Conversation';

    return {
      ...basic,
      letters,
      digits,
      spaces,
      symbols,
      social: {
        twitterPct,
        igBioPct,
        linkedInPct,
        metaDescPct,
      },
      fleschScore,
      readabilityLabel,
    };
  }, [text]);

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

  const handleClear = () => {
    setText('');
    toast.info('Cleared text editor.');
  };

  // Advanced Case Transformations
  const transformCase = (mode: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab') => {
    if (!text.trim()) return;
    let converted = text;

    if (mode === 'upper') {
      converted = text.toUpperCase();
    } else if (mode === 'lower') {
      converted = text.toLowerCase();
    } else if (mode === 'title') {
      converted = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    } else if (mode === 'sentence') {
      converted = text.toLowerCase().replace(/(^\s*|\.\s*)([a-z])/g, (m) => m.toUpperCase());
    } else if (mode === 'camel') {
      converted = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    } else if (mode === 'snake') {
      converted = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    } else if (mode === 'kebab') {
      converted = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    }

    setText(converted);
    toast.success(`Converted text to ${mode} mode!`);
  };

  const cleanExtraSpaces = () => {
    if (!text.trim()) return;
    const cleaned = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
    setText(cleaned);
    toast.success('Removed extra spaces!');
  };

  return (
    <ToolLayout
      slug="/utility/word-counter"
      title="Word & Character Counter (Upgraded)"
      subtitle="Count words, characters, sentences, paragraphs, reading speed, keyword density, Flesch readability, and social media post limits in real time."
      badgeText="Pro Text Engine"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5"><Type className="w-4 h-4 text-indigo-600" /> Words</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{stats.words.toLocaleString()}</div>
            <div className="text-[11px] font-bold text-slate-400">Total Word Tokens</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-emerald-600" /> Characters</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{stats.charactersWithSpaces.toLocaleString()}</div>
            <div className="text-[11px] font-bold text-slate-400">No Spaces: {stats.charactersWithoutSpaces.toLocaleString()}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> Reading Time</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">~{stats.readingTimeMinutes} min</div>
            <div className="text-[11px] font-bold text-slate-400">Speaking: ~{stats.speakingTimeMinutes} min</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4 text-purple-600" /> Readability</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">{stats.fleschScore} / 100</div>
            <div className="text-[11px] font-bold text-slate-400 truncate">{stats.readabilityLabel}</div>
          </div>
        </div>

        {/* Text Area Main Container */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={!text}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 disabled:opacity-40 border border-rose-200 text-rose-700 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* Extended Case Converters */}
            <div className="flex items-center gap-1 flex-wrap text-xs font-bold bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black text-slate-500 uppercase px-1">Case:</span>
              <button type="button" onClick={() => transformCase('upper')} className="px-2 py-0.5 rounded-lg bg-white font-black hover:bg-slate-200 cursor-pointer">UPPER</button>
              <button type="button" onClick={() => transformCase('lower')} className="px-2 py-0.5 rounded-lg bg-white font-black hover:bg-slate-200 cursor-pointer">lower</button>
              <button type="button" onClick={() => transformCase('title')} className="px-2 py-0.5 rounded-lg bg-white font-black hover:bg-slate-200 cursor-pointer">Title</button>
              <button type="button" onClick={() => transformCase('camel')} className="px-2 py-0.5 rounded-lg bg-white font-black hover:bg-slate-200 cursor-pointer">camelCase</button>
              <button type="button" onClick={() => transformCase('snake')} className="px-2 py-0.5 rounded-lg bg-white font-black hover:bg-slate-200 cursor-pointer">snake_case</button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text snippet here to measure words, character breakdown, social media limits, reading speed, and SEO density in real time..."
              className="w-full p-4 sm:p-5 rounded-2xl border border-slate-300 bg-white text-slate-900 font-bold text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs placeholder:text-slate-400 font-medium"
            />
            {!text && (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Clipboard className="w-4 h-4" />
                <span>Paste Text from Clipboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Character Breakdown Grid */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" /> Detailed Character & Symbol Breakdown
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Letters (A-Z)</span>
              <strong className="text-base font-black text-slate-900">{stats.letters}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Digits (0-9)</span>
              <strong className="text-base font-black text-slate-900">{stats.digits}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Spaces</span>
              <strong className="text-base font-black text-slate-900">{stats.spaces}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Symbols</span>
              <strong className="text-base font-black text-slate-900">{stats.symbols}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Sentences</span>
              <strong className="text-base font-black text-slate-900">{stats.sentences}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Paragraphs</span>
              <strong className="text-base font-black text-slate-900">{stats.paragraphs}</strong>
            </div>
          </div>
        </div>

        {/* Social Media Character Progress Gauges */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-600" /> Social Media & SEO Limit Progress
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Twitter */}
            <div className="space-y-1 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>Twitter / X (280 chars)</span>
                <span className={stats.charactersWithSpaces > 280 ? 'text-rose-600' : 'text-slate-600'}>
                  {stats.charactersWithSpaces} / 280
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stats.charactersWithSpaces > 280 ? 'bg-rose-600' : 'bg-sky-500'
                  }`}
                  style={{ width: `${stats.social.twitterPct}%` }}
                />
              </div>
            </div>

            {/* Instagram Bio */}
            <div className="space-y-1 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>Instagram Bio (150 chars)</span>
                <span className={stats.charactersWithSpaces > 150 ? 'text-rose-600' : 'text-slate-600'}>
                  {stats.charactersWithSpaces} / 150
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stats.charactersWithSpaces > 150 ? 'bg-rose-600' : 'bg-purple-500'
                  }`}
                  style={{ width: `${stats.social.igBioPct}%` }}
                />
              </div>
            </div>

            {/* LinkedIn Post */}
            <div className="space-y-1 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>LinkedIn Post (3,000 chars)</span>
                <span>{stats.charactersWithSpaces} / 3,000</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${stats.social.linkedInPct}%` }} />
              </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-1 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>SEO Meta Description (160 chars)</span>
                <span className={stats.charactersWithSpaces > 160 ? 'text-rose-600' : 'text-emerald-600'}>
                  {stats.charactersWithSpaces} / 160
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stats.charactersWithSpaces > 160 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${stats.social.metaDescPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Density Table */}
        {stats.topKeywords.length > 0 && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Top Keyword Density Map
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.topKeywords.map((kw, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between font-black text-slate-900">
                    <span className="capitalize truncate">{kw.word}</span>
                    <span className="text-indigo-600">{kw.count}×</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">Density: {kw.densityPercentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
