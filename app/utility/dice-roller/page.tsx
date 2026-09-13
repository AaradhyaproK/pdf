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
  History,
  Trash2,
  Lock,
  Dices,
  Sparkles,
  Trophy,
  Share2,
  Zap,
  Flame,
} from 'lucide-react';

type DiceType = 'd6' | 'd4' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
type DiceTheme = 'ivory' | 'ruby' | 'onyx' | 'emerald' | 'purple';

interface DieState {
  id: number;
  value: number;
  isHeld: boolean;
  rotation: number;
}

interface RollHistoryItem {
  id: string;
  diceValues: number[];
  sum: number;
  timestamp: string;
  diceType: DiceType;
  specialBadge?: string;
}

const THEMES: Record<DiceTheme, { name: string; bg: string; border: string; pip: string; shadow: string; heldBg: string }> = {
  ivory: {
    name: 'Classic Ivory',
    bg: 'bg-white',
    border: 'border-slate-300',
    pip: 'bg-slate-900',
    shadow: 'shadow-[0_12px_24px_-6px_rgba(0,0,0,0.25)]',
    heldBg: 'ring-4 ring-amber-400 bg-amber-50/80',
  },
  ruby: {
    name: 'Casino Ruby',
    bg: 'bg-gradient-to-br from-rose-500 to-red-700',
    border: 'border-rose-400',
    pip: 'bg-white',
    shadow: 'shadow-[0_12px_24px_-6px_rgba(225,29,72,0.4)]',
    heldBg: 'ring-4 ring-amber-300',
  },
  onyx: {
    name: 'Onyx & Gold',
    bg: 'bg-gradient-to-br from-slate-900 to-zinc-950',
    border: 'border-amber-500/80',
    pip: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    shadow: 'shadow-[0_12px_24px_-6px_rgba(0,0,0,0.6)]',
    heldBg: 'ring-4 ring-amber-400',
  },
  emerald: {
    name: 'Emerald Neon',
    bg: 'bg-gradient-to-br from-emerald-600 to-teal-800',
    border: 'border-emerald-400',
    pip: 'bg-white',
    shadow: 'shadow-[0_12px_24px_-6px_rgba(16,185,129,0.4)]',
    heldBg: 'ring-4 ring-amber-300',
  },
  purple: {
    name: 'Cosmic Purple',
    bg: 'bg-gradient-to-br from-purple-600 to-indigo-900',
    border: 'border-purple-400',
    pip: 'bg-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.6)]',
    shadow: 'shadow-[0_12px_24px_-6px_rgba(147,51,234,0.4)]',
    heldBg: 'ring-4 ring-amber-300',
  },
};

const DICE_MAX: Record<DiceType, number> = {
  d6: 6,
  d4: 4,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 100,
};

export default function DiceRollerPage() {
  const [numDice, setNumDice] = useState<number>(2);
  const [diceType, setDiceType] = useState<DiceType>('d6');
  const [theme, setTheme] = useState<DiceTheme>('ivory');
  const [isRolling, setIsRolling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [specialCallout, setSpecialCallout] = useState<string | null>(null);

  const [dice, setDice] = useState<DieState[]>([
    { id: 1, value: 3, isHeld: false, rotation: 0 },
    { id: 2, value: 4, isHeld: false, rotation: 0 },
  ]);

  const [history, setHistory] = useState<RollHistoryItem[]>([]);

  useEffect(() => {
    setDice((prev) => {
      if (prev.length === numDice) return prev;
      if (prev.length < numDice) {
        const added: DieState[] = [];
        for (let i = prev.length; i < numDice; i++) {
          added.push({
            id: i + 1,
            value: Math.floor(Math.random() * DICE_MAX[diceType]) + 1,
            isHeld: false,
            rotation: 0,
          });
        }
        return [...prev, ...added];
      } else {
        return prev.slice(0, numDice);
      }
    });
  }, [numDice, diceType]);

  const playRollSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const times = [0, 0.08, 0.18, 0.28, 0.4];
      times.forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160 + Math.random() * 80, ctx.currentTime + t);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + t + 0.06);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.07);
      });
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  const toggleHold = (id: number) => {
    if (isRolling) return;
    setDice((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isHeld: !d.isHeld } : d))
    );
  };

  // Crowd-magnet: Detect game combinations (Monopoly doubles, Yahtzee, Catan, Craps, D&D Nat 20)
  const detectGameCombo = (values: number[], type: DiceType): string | null => {
    if (type === 'd20' && values.length === 1) {
      if (values[0] === 20) return '🔥 CRITICAL HIT! (NAT 20)';
      if (values[0] === 1) return '💀 CRITICAL FAIL! (NAT 1)';
    }

    if (type === 'd6') {
      // 2 Dice combos
      if (values.length === 2) {
        if (values[0] === values[1]) {
          if (values[0] === 1) return '🐍 Snake Eyes! (Double 1s)';
          if (values[0] === 6) return '🎲 Boxcars! (Double 6s)';
          return `🎉 DOUBLES! (${values[0]} & ${values[1]})`;
        }
        const sum = values[0] + values[1];
        if (sum === 7) return '⚡ Lucky 7! (Catan Robber / Craps)';
        if (sum === 11) return '✨ Yo-leven 11! (Craps Win)';
      }

      // 5 Dice Yahtzee combos
      if (values.length === 5) {
        const counts: Record<number, number> = {};
        values.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
        const freqs = Object.values(counts);

        if (freqs.includes(5)) return '🏆 YAHTZEE! (All 5 Matching!)';
        if (freqs.includes(4)) return '🌟 4 of a Kind!';
        if (freqs.includes(3) && freqs.includes(2)) return '🏠 Full House!';

        const sorted = Array.from(new Set(values)).sort((a, b) => a - b);
        if (sorted.length === 5 && (sorted[4] - sorted[0] === 4)) return '🌈 Large Straight!';
      }
    }

    return null;
  };

  const rollDice = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setSpecialCallout(null);
    playRollSound();

    const maxVal = DICE_MAX[diceType];

    const interval = setInterval(() => {
      setDice((prev) =>
        prev.map((d) =>
          d.isHeld
            ? d
            : {
                ...d,
                value: Math.floor(Math.random() * maxVal) + 1,
                rotation: d.rotation + (Math.random() > 0.5 ? 90 : -90),
              }
        )
      );
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalDice = dice.map((d) => {
        if (d.isHeld) return d;
        return {
          ...d,
          value: Math.floor(Math.random() * maxVal) + 1,
          rotation: (Math.floor(Math.random() * 4)) * 360,
        };
      });

      setDice(finalDice);
      setIsRolling(false);

      const rollValues = finalDice.map((d) => d.value);
      const totalSum = rollValues.reduce((a, b) => a + b, 0);

      const combo = detectGameCombo(rollValues, diceType);
      if (combo) {
        setSpecialCallout(combo);
        confetti({
          particleCount: combo.includes('YAHTZEE') || combo.includes('CRITICAL') ? 80 : 40,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      const item: RollHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        diceValues: rollValues,
        sum: totalSum,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        diceType,
        specialBadge: combo || undefined,
      };
      setHistory((prev) => [item, ...prev.slice(0, 24)]);
    }, 650);
  }, [isRolling, dice, diceType, playRollSound]);

  // Spacebar to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        rollDice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rollDice]);

  // Instant 100 Rolls Simulation (Crowd Magnet)
  const run100Rolls = () => {
    const maxVal = DICE_MAX[diceType];
    let sum = 0;
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < numDice; j++) {
        sum += Math.floor(Math.random() * maxVal) + 1;
      }
    }
    const avg = (sum / (100 * numDice)).toFixed(2);
    const expected = ((maxVal + 1) / 2).toFixed(2);
    toast.success(`⚡ 100 Rolls Simulated! Average roll per die: ${avg} (Theoretical Expected: ${expected})`, {
      duration: 4500,
    });
  };

  const shareRoll = () => {
    const rollValues = dice.map((d) => d.value).join(', ');
    const text = `🎲 Rolled ${totalSum} [${rollValues}] on FileZenith 3D Dice Roller! Roll yours at https://www.filezenith.com/utility/dice-roller`;
    navigator.clipboard.writeText(text);
    toast.success('Roll result copied to clipboard! Share on Discord, WhatsApp or X.');
  };

  const applyGamePreset = (type: DiceType, count: number, presetName: string) => {
    setDiceType(type);
    setNumDice(count);
    toast.success(`Applied preset: ${presetName}`);
  };

  const totalSum = dice.reduce((acc, d) => acc + d.value, 0);
  const highestValue = Math.max(...dice.map((d) => d.value));
  const lowestValue = Math.min(...dice.map((d) => d.value));
  const averageValue = (totalSum / (dice.length || 1)).toFixed(1);

  const renderPips = (val: number, currentTheme: DiceTheme) => {
    const pipColor = THEMES[currentTheme].pip;

    return (
      <div className="w-full h-full p-2 sm:p-3 grid grid-cols-3 grid-rows-3 items-center justify-items-center">
        <div className="w-full h-full flex items-center justify-center">
          {(val === 2 || val === 3 || val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center" />
        <div className="w-full h-full flex items-center justify-center">
          {(val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {val === 6 && <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {(val === 1 || val === 3 || val === 5) && (
            <div className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full ${pipColor}`} />
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {val === 6 && <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {(val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center" />
        <div className="w-full h-full flex items-center justify-center">
          {(val === 2 || val === 3 || val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      slug="/utility/dice-roller"
      title="Dice Roller Online"
      subtitle="Free 3D virtual dice rolling simulator. Roll 1 to 12 dice with tumbling physics, sound effects, freeze/hold features, and game presets."
      badgeText="3D Dice Simulator"
    >
      <div className="w-full space-y-6">
        {/* Chance Suite Switcher Bar */}
        <RandomSuiteNav currentSlug="/utility/dice-roller" />

        {/* Control Toolbar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Number of Dice */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Number of Dice:
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-x-auto max-w-[280px] sm:max-w-none">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumDice(n)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      numDice === n
                        ? 'bg-white text-rose-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & History reset */}
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
                onClick={() => setHistory([])}
                className="p-1.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Clear Roll History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viral Game Presets Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                Game Presets:
              </span>
              <button
                onClick={() => applyGamePreset('d6', 2, 'Monopoly (2d6)')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                🎩 Monopoly (2d6)
              </button>
              <button
                onClick={() => applyGamePreset('d6', 2, 'Catan (2d6)')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                🌾 Catan (2d6)
              </button>
              <button
                onClick={() => applyGamePreset('d6', 5, 'Yahtzee (5d6)')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                🎲 Yahtzee (5d6)
              </button>
              <button
                onClick={() => applyGamePreset('d6', 2, 'Craps (2d6)')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                🎰 Craps (2d6)
              </button>
              <button
                onClick={() => applyGamePreset('d20', 1, 'D&D D20')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                ⚔️ D&D D20
              </button>
              <button
                onClick={() => applyGamePreset('d20', 2, 'D&D Advantage (2d20)')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                🛡️ D&D Advantage (2d20)
              </button>
            </div>
          </div>

          {/* Dice Types & Theme Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Dice Types */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">Type:</span>
              {(['d6', 'd4', 'd8', 'd10', 'd12', 'd20', 'd100'] as DiceType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setDiceType(t)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    diceType === t
                      ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Theme:</span>
              {(Object.keys(THEMES) as DiceTheme[]).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setTheme(thm)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    theme === thm
                      ? 'bg-slate-900 text-white font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {THEMES[thm].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dice Arena Board */}
        <div className="p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-purple-500/10 border border-rose-200/60 shadow-inner flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-80 h-80 rounded-full bg-rose-400/20 blur-3xl pointer-events-none -top-10" />

          {/* Sum & Special Combo Announcement */}
          <div className="min-h-[50px] flex flex-col items-center justify-center mb-6 gap-2">
            {!isRolling ? (
              <>
                <div className="animate-in zoom-in-95 duration-200 px-6 py-2 rounded-full bg-white/95 border-2 border-rose-400 shadow-xl flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Total Roll:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-600 to-red-700 bg-clip-text text-transparent">
                    {totalSum}
                  </span>
                  {numDice > 1 && (
                    <span className="text-[11px] font-bold text-slate-400 border-l pl-2.5">
                      Avg: {averageValue}
                    </span>
                  )}
                </div>

                {specialCallout && (
                  <div className="animate-in bounce-in duration-300 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-black shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{specialCallout}</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-sm font-black uppercase tracking-widest text-rose-700 animate-pulse">
                Rolling dice...
              </span>
            )}
          </div>

          {/* Dice Grid Area */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-2 max-w-4xl">
            {dice.map((die) => {
              const currentThm = THEMES[theme];

              return (
                <div
                  key={die.id}
                  onClick={() => toggleHold(die.id)}
                  className="flex flex-col items-center gap-2 cursor-pointer group select-none"
                  title="Click to Hold/Freeze die"
                >
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl border-2 sm:border-3 ${
                      currentThm.border
                    } ${currentThm.bg} ${currentThm.shadow} ${
                      die.isHeld ? currentThm.heldBg : ''
                    } flex items-center justify-center transition-all duration-150 ${
                      isRolling && !die.isHeld ? 'scale-105 rotate-12' : 'hover:scale-105 active:scale-95'
                    }`}
                    style={{
                      transform: isRolling && !die.isHeld ? `rotate(${die.rotation}deg)` : undefined,
                    }}
                  >
                    {/* Hold Badge */}
                    {die.isHeld && (
                      <div className="absolute -top-2.5 -right-2.5 z-20 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* D6 Pips vs RPG Numbers */}
                    {diceType === 'd6' ? (
                      renderPips(die.value, theme)
                    ) : (
                      <div className="flex flex-col items-center justify-center p-1">
                        <span
                          className={`text-2xl sm:text-3xl font-black ${
                            theme === 'ivory' ? 'text-slate-900' : 'text-white'
                          } drop-shadow-sm`}
                        >
                          {die.value}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase ${
                            theme === 'ivory' ? 'text-slate-400' : 'text-white/70'
                          }`}
                        >
                          {diceType}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-500">
                    {die.isHeld ? 'Held' : 'Tap to Hold'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons: Roll, 100 Rolls, Share */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 z-10">
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="group relative px-10 py-4 sm:px-14 sm:py-4.5 rounded-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-black text-base sm:text-lg shadow-[0_10px_30px_-5px_rgba(225,29,72,0.5)] hover:shadow-[0_15px_40px_-5px_rgba(225,29,72,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer overflow-hidden"
            >
              <span className="relative flex items-center justify-center gap-2">
                <RotateCcw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{isRolling ? 'ROLLING...' : 'ROLL THE DICE'}</span>
                <span className="text-[10px] uppercase font-bold text-white/70 ml-1 px-1.5 py-0.5 rounded bg-black/20 hidden sm:inline">
                  Space
                </span>
              </span>
            </button>

            {/* Instant 100 Rolls */}
            <button
              onClick={run100Rolls}
              className="px-4 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Simulate 100 dice rolls instantly"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>100 Rolls</span>
            </button>

            {/* Share Roll */}
            <button
              onClick={shareRoll}
              className="px-4 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-rose-600" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Sum</span>
            <span className="text-2xl font-black text-slate-900">{totalSum}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-rose-600 block uppercase">Highest Die</span>
            <span className="text-2xl font-black text-slate-900">{highestValue}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Lowest Die</span>
            <span className="text-2xl font-black text-slate-900">{lowestValue}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-indigo-600 block uppercase">Average</span>
            <span className="text-2xl font-black text-slate-900">{averageValue}</span>
          </div>
        </div>

        {/* Roll History */}
        {history.length > 0 && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-rose-600" />
                <h3 className="font-black text-sm text-slate-900">Recent Rolls History</h3>
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
                    {item.diceValues.map((val, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-black text-slate-800"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-black text-rose-600">
                    = {item.sum}
                  </span>
                  {item.specialBadge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {item.specialBadge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
