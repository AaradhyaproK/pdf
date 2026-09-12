'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { RandomSuiteNav } from '@/components/RandomSuiteNav';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Volume2,
  VolumeX,
  History,
  Trash2,
  Check,
  ArrowUpDown,
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  numbers: number[];
  range: string;
  timestamp: string;
}

export default function RandomNumberPickerPage() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const [results, setResults] = useState<number[]>([42]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Web Audio Synth for rolling sound & chime
  const playSound = useCallback((type: 'tick' | 'done') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else {
        // Success Chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc1.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.24); // C6

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc1.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc1.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const generateNumbers = useCallback(() => {
    if (min >= max) {
      toast.error('Minimum value must be less than Maximum value');
      return;
    }

    const availableCount = max - min + 1;
    if (!allowDuplicates && quantity > availableCount) {
      toast.error(`Cannot generate ${quantity} unique numbers in a range of ${availableCount} numbers.`);
      return;
    }

    setIsGenerating(true);

    // Dynamic slot-machine rapid animation
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      playSound('tick');
      const tempSample: number[] = [];
      for (let i = 0; i < Math.min(quantity, 8); i++) {
        tempSample.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      setResults(tempSample);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);

      // Generate actual final draw
      let finalNumbers: number[] = [];

      if (!allowDuplicates) {
        if (availableCount <= 50000) {
          // Reservoir / shuffle algorithm for uniform distribution without duplicates
          const pool: number[] = [];
          for (let i = min; i <= max; i++) pool.push(i);
          for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
          }
          finalNumbers = pool.slice(0, quantity);
        } else {
          // Large range: Set-based sampling
          const chosen = new Set<number>();
          while (chosen.size < quantity) {
            const val = Math.floor(Math.random() * (max - min + 1)) + min;
            chosen.add(val);
          }
          finalNumbers = Array.from(chosen);
        }
      } else {
        for (let i = 0; i < quantity; i++) {
          finalNumbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
      }

      // Apply sort if chosen
      if (sortOrder === 'asc') {
        finalNumbers.sort((a, b) => a - b);
      } else if (sortOrder === 'desc') {
        finalNumbers.sort((a, b) => b - a);
      }

      setResults(finalNumbers);
      setIsGenerating(false);
      playSound('done');

      // Record History
      const histItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        numbers: finalNumbers,
        range: `${min} to ${max} (${quantity} picked)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setHistory((prev) => [histItem, ...prev.slice(0, 24)]);

      // Confetti for single number roll or lottery set
      confetti({
        particleCount: quantity <= 6 ? 45 : 30,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 600);
  }, [min, max, quantity, allowDuplicates, sortOrder, playSound]);

  // Spacebar trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        generateNumbers();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNumbers]);

  // Apply Presets
  const applyPreset = (newMin: number, newMax: number, newQty: number, unique: boolean) => {
    setMin(newMin);
    setMax(newMax);
    setQuantity(newQty);
    setAllowDuplicates(!unique);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    toast.success('Numbers copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (type: 'txt' | 'csv') => {
    const content = type === 'txt' ? results.join('\n') : results.join(',');
    const blob = new Blob([content], { type: type === 'txt' ? 'text/plain' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random_numbers_${Date.now()}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported as .${type}`);
  };

  return (
    <ToolLayout
      slug="/utility/random-number-picker"
      title="Random Number Picker & Generator"
      subtitle="Free online random number generator (RNG). Pick truly random single or multiple numbers without duplicates, lottery sets, and PINs."
      badgeText="Crypto-Grade RNG"
    >
      <div className="w-full space-y-6">
        {/* Chance Suite Switcher Bar */}
        <RandomSuiteNav currentSlug="/utility/random-number-picker" />

        {/* Configuration Panel */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
          {/* Quick Presets Bar */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Popular Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => applyPreset(1, 10, 1, true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                1 - 10
              </button>
              <button
                onClick={() => applyPreset(1, 50, 1, true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                1 - 50
              </button>
              <button
                onClick={() => applyPreset(1, 100, 1, true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                1 - 100
              </button>
              <button
                onClick={() => applyPreset(1, 1000, 1, true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                1 - 1,000
              </button>
              <button
                onClick={() => applyPreset(1, 49, 6, true)}
                className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs transition-colors cursor-pointer"
              >
                🎰 6/49 Lottery
              </button>
              <button
                onClick={() => applyPreset(0, 9, 4, false)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                🔑 4-Digit PIN
              </button>
              <button
                onClick={() => applyPreset(0, 9, 6, false)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                📱 6-Digit OTP
              </button>
              <button
                onClick={() => applyPreset(1, 6, 1, true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                🎲 D6 (1-6)
              </button>
              <button
                onClick={() => applyPreset(1, 20, 1, true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                ⚔️ D20 (1-20)
              </button>
            </div>
          </div>

          {/* Range & Quantity Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Minimum Value
              </label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Maximum Value
              </label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Numbers to Generate
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(1000, Number(e.target.value))))}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Rules & Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Duplicates Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!allowDuplicates}
                  onChange={(e) => setAllowDuplicates(!e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 rounded-md"
                />
                <span className="text-xs font-black text-slate-800">
                  Unique Numbers Only (No duplicates)
                </span>
              </label>
            </div>

            {/* Sort Order Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Sort:</span>
              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setSortOrder('none')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sortOrder === 'none'
                      ? 'bg-white text-emerald-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  As Drawn
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sortOrder === 'asc'
                      ? 'bg-white text-emerald-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ascending (Low-High)
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sortOrder === 'desc'
                      ? 'bg-white text-emerald-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Descending (High-Low)
                </button>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display Stage Area */}
        <div className="p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-200/60 shadow-inner flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none -top-10" />

          {/* Results Area */}
          <div className="w-full flex flex-col items-center justify-center my-4">
            {quantity === 1 ? (
              // Single Number Hero Display
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`px-8 py-5 sm:px-14 sm:py-8 rounded-3xl bg-white border-4 border-emerald-400 shadow-2xl flex items-center justify-center min-w-[180px] sm:min-w-[240px] transition-transform duration-200 ${
                    isGenerating ? 'scale-95 blur-[1px]' : 'scale-100'
                  }`}
                >
                  <span className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent font-mono tracking-tight drop-shadow-sm">
                    {results[0] ?? 0}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 mt-2">
                  Range: {min} to {max}
                </span>
              </div>
            ) : (
              // Multi Number Grid / Chips
              <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-h-[320px] overflow-y-auto p-2">
                {results.map((num, i) => (
                  <div
                    key={i}
                    className="px-4 py-2.5 rounded-2xl bg-white border-2 border-emerald-300/80 shadow-md flex items-center justify-center min-w-[60px] sm:min-w-[70px] animate-in zoom-in-90 duration-150"
                  >
                    <span className="text-lg sm:text-xl font-black text-emerald-800 font-mono">
                      {num}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar: Big Generate Button & Quick Copy */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 z-10">
            <button
              onClick={generateNumbers}
              disabled={isGenerating}
              className="group relative px-10 py-4 sm:px-14 sm:py-4.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-base sm:text-lg shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_40px_-5px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer overflow-hidden"
            >
              <span className="relative flex items-center justify-center gap-2">
                <RotateCcw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'GENERATING...' : 'PICK NUMBER'}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-100/80 ml-1 px-1.5 py-0.5 rounded bg-black/20 hidden sm:inline">
                  Space
                </span>
              </span>
            </button>

            {/* Quick Copy Button */}
            <button
              onClick={copyToClipboard}
              className="px-5 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-black">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Export Options */}
          {results.length > 1 && (
            <div className="flex items-center gap-2 mt-4 z-10">
              <span className="text-xs font-bold text-slate-500">Export:</span>
              <button
                onClick={() => downloadFile('txt')}
                className="px-3 py-1 rounded-xl bg-white/80 hover:bg-white text-[11px] font-black border border-slate-200 text-slate-700 shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>.TXT</span>
              </button>
              <button
                onClick={() => downloadFile('csv')}
                className="px-3 py-1 rounded-xl bg-white/80 hover:bg-white text-[11px] font-black border border-slate-200 text-slate-700 shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>.CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* History Log */}
        {history.length > 0 && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900">Recent Picks History</h3>
              </div>
              <button
                onClick={() => setHistory([])}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-1 max-h-56 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    <span className="text-[10px] font-black text-slate-500 px-2 py-0.5 rounded bg-slate-200/70">
                      {item.range}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-black text-emerald-700 text-sm">
                      {item.numbers.length <= 10
                        ? item.numbers.join(', ')
                        : `${item.numbers.slice(0, 10).join(', ')}... (${item.numbers.length} items)`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
