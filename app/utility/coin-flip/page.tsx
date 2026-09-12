'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { RandomSuiteNav } from '@/components/RandomSuiteNav';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Sparkles,
  History,
  Trash2,
  Settings2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

type DecisionMode = 'heads-tails' | 'yes-no' | 'custom';

interface FlipHistoryItem {
  id: string;
  results: ('heads' | 'tails')[];
  timestamp: string;
  labels: { heads: string; tails: string };
}

export default function CoinFlipPage() {
  const [numCoins, setNumCoins] = useState<number>(1);
  const [mode, setMode] = useState<DecisionMode>('heads-tails');
  const [customHeads, setCustomHeads] = useState('Option A');
  const [customTails, setCustomTails] = useState('Option B');

  const [isFlipping, setIsFlipping] = useState(false);
  const [rotations, setRotations] = useState<number[]>([0, 0, 0, 0]);
  const [coinResults, setCoinResults] = useState<('heads' | 'tails')[]>(['heads']);
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    heads: 0,
    tails: 0,
    currentStreakCount: 0,
    currentStreakSide: null as 'heads' | 'tails' | null,
  });

  const [history, setHistory] = useState<FlipHistoryItem[]>([]);

  // Sound generator via Web Audio API (100% offline & instant)
  const playSound = useCallback((type: 'flip' | 'land') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        // Metallic clink sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2600, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.25);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(4200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const getLabel = useCallback((side: 'heads' | 'tails') => {
    if (mode === 'heads-tails') return side === 'heads' ? 'HEADS' : 'TAILS';
    if (mode === 'yes-no') return side === 'heads' ? 'YES' : 'NO';
    return side === 'heads' ? customHeads || 'Option A' : customTails || 'Option B';
  }, [mode, customHeads, customTails]);

  const flipCoins = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    playSound('flip');

    const newResults: ('heads' | 'tails')[] = [];
    const newRotations = [...rotations];

    for (let i = 0; i < numCoins; i++) {
      const isHeads = Math.random() < 0.5;
      const result: 'heads' | 'tails' = isHeads ? 'heads' : 'tails';
      newResults.push(result);

      // Add minimum 5 full spins (1800deg) + target face angle
      const spins = 5 + Math.floor(Math.random() * 3); // 5, 6 or 7 full flips
      const currentRot = newRotations[i] || 0;
      const baseNext = currentRot + spins * 360;
      // heads: rotation % 360 === 0; tails: rotation % 360 === 180
      const targetRemainder = result === 'heads' ? 0 : 180;
      const currentRemainder = baseNext % 360;
      const adjust = (targetRemainder - currentRemainder + 360) % 360;
      newRotations[i] = baseNext + adjust;
    }

    setRotations(newRotations);

    // After animation finishes (900ms)
    setTimeout(() => {
      setCoinResults(newResults);
      setIsFlipping(false);
      playSound('land');

      // Update statistics
      let headsCount = 0;
      let tailsCount = 0;
      newResults.forEach((res) => {
        if (res === 'heads') headsCount++;
        else tailsCount++;
      });

      setStats((prev) => {
        const nextTotal = prev.total + numCoins;
        const nextHeads = prev.heads + headsCount;
        const nextTails = prev.tails + tailsCount;

        // Streak check for single coin mode
        let nextStreak = prev.currentStreakCount;
        let nextStreakSide = prev.currentStreakSide;
        if (numCoins === 1) {
          const single = newResults[0];
          if (single === prev.currentStreakSide) {
            nextStreak++;
          } else {
            nextStreak = 1;
            nextStreakSide = single;
          }
        }

        return {
          total: nextTotal,
          heads: nextHeads,
          tails: nextTails,
          currentStreakCount: nextStreak,
          currentStreakSide: nextStreakSide,
        };
      });

      // Format summary
      let outcomeStr = '';
      if (numCoins === 1) {
        outcomeStr = getLabel(newResults[0]);
      } else {
        outcomeStr = `${headsCount} ${getLabel('heads')} • ${tailsCount} ${getLabel('tails')}`;
      }
      setLastOutcome(outcomeStr);

      // Record History
      const historyItem: FlipHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        results: newResults,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        labels: { heads: getLabel('heads'), tails: getLabel('tails') },
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 24)]);

      // Confetti celebration if 3+ streak in single flip or all matching in multi-flip
      if ((numCoins === 1 && stats.currentStreakCount >= 3) || (numCoins > 1 && (headsCount === numCoins || tailsCount === numCoins))) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, 950);
  }, [isFlipping, numCoins, rotations, getLabel, playSound, stats.currentStreakCount]);

  // Spacebar keyboard shortcut to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        flipCoins();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipCoins]);

  const resetStats = () => {
    setStats({
      total: 0,
      heads: 0,
      tails: 0,
      currentStreakCount: 0,
      currentStreakSide: null,
    });
    setHistory([]);
    toast.success('Stats & history reset');
  };

  const headsPercentage = stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 50;
  const tailsPercentage = stats.total > 0 ? 100 - headsPercentage : 50;

  return (
    <ToolLayout
      slug="/utility/coin-flip"
      title="Coin Flip Online"
      subtitle="Free 3D coin toss simulator with realistic physics, custom decision labels, sound effects, and streak stats."
      badgeText="3D Coin Simulator"
    >
      <div className="w-full space-y-6">
        {/* Chance Suite Switcher Bar */}
        <RandomSuiteNav currentSlug="/utility/coin-flip" />

        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Number of Coins Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Number of Coins:
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setNumCoins(n);
                      setRotations([0, 0, 0, 0]);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      numCoins === n
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Action Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
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

              <button
                onClick={resetStats}
                className="p-1.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Reset Stats & History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decision Modes */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 mr-1">Decision Mode:</span>
            <button
              onClick={() => setMode('heads-tails')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'heads-tails'
                  ? 'bg-amber-100 text-amber-900 font-black ring-1 ring-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🪙 Heads / Tails
            </button>
            <button
              onClick={() => setMode('yes-no')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'yes-no'
                  ? 'bg-emerald-100 text-emerald-900 font-black ring-1 ring-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ✅ Yes / No
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'custom'
                  ? 'bg-indigo-100 text-indigo-900 font-black ring-1 ring-indigo-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ✏️ Custom Labels
            </button>
          </div>

          {/* Custom Labels Inputs */}
          {mode === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Side A (Replaces Heads)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={customHeads}
                  onChange={(e) => setCustomHeads(e.target.value)}
                  placeholder="e.g. Option A, Team 1"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Side B (Replaces Tails)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={customTails}
                  onChange={(e) => setCustomTails(e.target.value)}
                  placeholder="e.g. Option B, Team 2"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3D Coin Stage Area */}
        <div className="p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-indigo-500/10 border border-amber-200/60 shadow-inner flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none -top-10" />

          {/* Outcome Announcement */}
          <div className="min-h-[44px] flex items-center justify-center mb-6">
            {lastOutcome && !isFlipping ? (
              <div className="animate-in zoom-in-95 duration-200 px-5 py-2 rounded-full bg-white/95 border-2 border-amber-400 shadow-lg flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  {lastOutcome}
                </span>
              </div>
            ) : isFlipping ? (
              <span className="text-sm font-black uppercase tracking-widest text-amber-700 animate-pulse">
                Flipping in the air...
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                Click coin or press Spacebar to flip
              </span>
            )}
          </div>

          {/* Coins Grid (1 to 4 coins) */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 perspective-[1200px] my-2">
            {Array.from({ length: numCoins }).map((_, idx) => {
              const rotation = rotations[idx] || 0;
              const result = coinResults[idx] || 'heads';

              return (
                <div
                  key={idx}
                  onClick={flipCoins}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="relative w-36 h-36 sm:w-44 sm:h-44 transition-transform select-none"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${rotation}deg)`,
                      transitionDuration: isFlipping ? '0.95s' : '0.2s',
                      transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    {/* HEADS FACE */}
                    <div
                      className="absolute inset-0 rounded-full border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 ring-4 ring-amber-500/40"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="w-full h-full rounded-full border-2 border-dashed border-amber-600/60 flex flex-col items-center justify-center p-2 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-inner">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-700/40 flex items-center justify-center bg-amber-500/20 mb-1 shadow-inner">
                          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" />
                        </div>
                        <span className="font-black text-xs sm:text-sm text-amber-950 uppercase tracking-widest px-1 line-clamp-2 drop-shadow-xs">
                          {getLabel('heads')}
                        </span>
                        <span className="text-[9px] font-extrabold text-amber-800/80 tracking-widest mt-0.5">
                          ★ LIBERTY ★
                        </span>
                      </div>
                    </div>

                    {/* TAILS FACE (Rotated 180deg) */}
                    <div
                      className="absolute inset-0 rounded-full border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 ring-4 ring-amber-600/40"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="w-full h-full rounded-full border-2 border-dashed border-amber-700/60 flex flex-col items-center justify-center p-2 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-inner">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-900/40 flex items-center justify-center bg-amber-600/20 mb-1 shadow-inner">
                          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
                        </div>
                        <span className="font-black text-xs sm:text-sm text-amber-950 uppercase tracking-widest px-1 line-clamp-2 drop-shadow-xs">
                          {getLabel('tails')}
                        </span>
                        <span className="text-[9px] font-extrabold text-amber-900/80 tracking-widest mt-0.5">
                          ★ IN LUCK WE TRUST ★
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coin Drop Shadow */}
                  <div
                    className={`w-28 sm:w-36 h-3 bg-amber-900/20 rounded-full blur-sm transition-all duration-300 ${
                      isFlipping ? 'scale-75 opacity-40 translate-y-2' : 'scale-100 opacity-80'
                    }`}
                  />

                  {/* Sub-label for individual coin when multi-coin */}
                  {numCoins > 1 && !isFlipping && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-2xs">
                      Coin {idx + 1}: {getLabel(result)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Big Flip Button */}
          <button
            onClick={flipCoins}
            disabled={isFlipping}
            className="mt-8 group relative px-10 py-4 sm:px-14 sm:py-4.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black text-base sm:text-lg shadow-[0_10px_30px_-5px_rgba(245,158,11,0.5)] hover:shadow-[0_15px_40px_-5px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer overflow-hidden"
          >
            <span className="relative flex items-center justify-center gap-2">
              <RotateCcw className={`w-5 h-5 ${isFlipping ? 'animate-spin' : ''}`} />
              <span>{isFlipping ? 'FLIPPING...' : 'FLIP COIN'}</span>
              <span className="text-[10px] uppercase font-bold text-amber-950/70 ml-1 px-1.5 py-0.5 rounded bg-black/10 hidden sm:inline">
                Space
              </span>
            </span>
          </button>
        </div>

        {/* Live Statistics & Streaks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Flips</span>
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-600 block uppercase truncate">
              {getLabel('heads')}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{stats.heads}</span>
              <span className="text-xs font-bold text-slate-400">({headsPercentage}%)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-700 block uppercase truncate">
              {getLabel('tails')}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{stats.tails}</span>
              <span className="text-xs font-bold text-slate-400">({tailsPercentage}%)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-indigo-600 block uppercase">Current Streak</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {stats.currentStreakCount}
              </span>
              {stats.currentStreakSide && (
                <span className="text-xs font-bold text-indigo-600 truncate">
                  {getLabel(stats.currentStreakSide)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Flip Ratio Bar */}
        {stats.total > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-amber-600">{getLabel('heads')}: {headsPercentage}%</span>
              <span className="text-amber-800">{getLabel('tails')}: {tailsPercentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-amber-100 overflow-hidden flex">
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${headsPercentage}%` }}
              />
              <div
                className="bg-amber-600 transition-all duration-500"
                style={{ width: `${tailsPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Flip History Log */}
        {history.length > 0 && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-sm text-slate-900">Recent Flips History</h3>
              </div>
              <button
                onClick={() => setHistory([])}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs font-bold"
                >
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  <div className="flex items-center gap-1">
                    {item.results.map((res, i) => (
                      <span
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          res === 'heads'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-yellow-100 text-yellow-900'
                        }`}
                      >
                        {item.labels[res]}
                      </span>
                    ))}
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
