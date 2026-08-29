'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { analyzeTextMetrics } from '@/lib/utility-engine';
import { Type, Clock, Hash, BarChart2 } from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => analyzeTextMetrics(text), [text]);

  return (
    <ToolLayout
      slug="/utility/word-counter"
      title="Word Counter & Keyword Density Analyzer"
      subtitle="Count words, characters, sentences, estimated reading speed, and analyze keyword frequency density in real time."
    >
      <div className="space-y-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-300">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Type className="w-4 h-4 text-indigo-500" /> Words
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.words}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-900 dark:text-sky-300">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Hash className="w-4 h-4 text-sky-500" /> Characters
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.charactersWithSpaces}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-4 h-4 text-emerald-500" /> Reading Time
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              ~{stats.readingTimeMinutes} min
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-300">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <BarChart2 className="w-4 h-4 text-purple-500" /> Sentences
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.sentences}
            </div>
          </div>
        </div>

        {/* Live Text Area Input */}
        <div className="space-y-2">
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here for real-time word count and keyword density analysis..."
            className="w-full p-5 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
          <div className="flex justify-between text-xs text-slate-400 px-2">
            <span>Clean Chars (no spaces): {stats.charactersWithoutSpaces}</span>
            <span>Paragraphs: {stats.paragraphs}</span>
          </div>
        </div>

        {/* Keyword Density Table */}
        {stats.topKeywords.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Top Keyword Density
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.topKeywords.map((kw, idx) => (
                <div key={idx} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize truncate max-w-[100px]">
                    {kw.word}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {kw.count} ({kw.densityPercentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
