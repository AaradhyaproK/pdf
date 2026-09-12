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
  Unlock,
  Dices,
  Sparkles,
  Trophy,
  Layers,
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

  const [dice, setDice] = useState<DieState[]>([
    { id: 1, value: 3, isHeld: false, rotation: 0 },
    { id: 2, value: 4, isHeld: false, rotation: 0 },
  ]);

  const [history, setHistory] = useState<RollHistoryItem[]>([]);

  // Adjust dice array size when numDice changes
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

  // Web Audio synth for realistic dice rattling and bouncing
  const playRollSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Simulate 4 successive dice impacts
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

  const rollDice = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    playRollSound();

    const maxVal = DICE_MAX[diceType];

    // Rapid intermediate tumbling rolls
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

    // Final outcome
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

      // Record History
      const item: RollHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        diceValues: rollValues,
        sum: totalSum,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        diceType,
      };
      setHistory((prev) => [item, ...prev.slice(0, 24)]);

      // Confetti celebration if all dice are maximum or matching in D6
      const allMax = rollValues.every((v) => v === maxVal);
      const allMatching = rollValues.length > 1 && rollValues.every((v) => v === rollValues[0]);
      if (allMax || allMatching) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
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

  const totalSum = dice.reduce((acc, d) => acc + d.value, 0);
  const highestValue = Math.max(...dice.map((d) => d.value));
  const lowestValue = Math.min(...dice.map((d) => d.value));
  const averageValue = (totalSum / (dice.length || 1)).toFixed(1);

  // Render authentic D6 pip layout
  const renderPips = (val: number, currentTheme: DiceTheme) => {
    const pipColor = THEMES[currentTheme].pip;

    // Standard D6 faces layout
    return (
      <div className="w-full h-full p-2 sm:p-3 grid grid-cols-3 grid-rows-3 items-center justify-items-center">
        {/* Pip 1: Top-Left */}
        <div className="w-full h-full flex items-center justify-center">
          {(val === 2 || val === 3 || val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>

        {/* Pip 2: Top-Center */}
        <div className="w-full h-full flex items-center justify-center" />

        {/* Pip 3: Top-Right */}
        <div className="w-full h-full flex items-center justify-center">
          {(val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>

        {/* Pip 4: Middle-Left */}
        <div className="w-full h-full flex items-center justify-center">
          {val === 6 && <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />}
        </div>

        {/* Pip 5: Center */}
        <div className="w-full h-full flex items-center justify-center">
          {(val === 1 || val === 3 || val === 5) && (
            <div className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full ${pipColor}`} />
          )}
        </div>

        {/* Pip 6: Middle-Right */}
        <div className="w-full h-full flex items-center justify-center">
          {val === 6 && <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />}
        </div>

        {/* Pip 7: Bottom-Left */}
        <div className="w-full h-full flex items-center justify-center">
          {(val === 4 || val === 5 || val === 6) && (
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${pipColor}`} />
          )}
        </div>

        {/* Pip 8: Bottom-Center */}
        <div className="w-full h-full flex items-center justify-center" />

        {/* Pip 9: Bottom-Right */}
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
      subtitle="Free 3D virtual dice rolling simulator. Roll 1 to 12 dice with tumbling physics, sound effects, freeze/hold features, and tabletop RPG options."
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

          {/* Dice Types & Theme Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Dice Types (D6, D4, D8, D10, D12, D20, D100) */}
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

          {/* Sum Display Header */}
          <div className="min-h-[50px] flex items-center justify-center mb-6">
            {!isRolling ? (
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

                  {/* Individual Die Footer label */}
                  <span className="text-[10px] font-bold text-slate-500">
                    {die.isHeld ? 'Held' : 'Tap to Hold'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Big Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="mt-8 group relative px-10 py-4 sm:px-14 sm:py-4.5 rounded-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-black text-base sm:text-lg shadow-[0_10px_30px_-5px_rgba(225,29,72,0.5)] hover:shadow-[0_15px_40px_-5px_rgba(225,29,72,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer overflow-hidden"
          >
            <span className="relative flex items-center justify-center gap-2">
              <RotateCcw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'ROLLING...' : 'ROLL THE DICE'}</span>
              <span className="text-[10px] uppercase font-bold text-white/70 ml-1 px-1.5 py-0.5 rounded bg-black/20 hidden sm:inline">
                Space
              </span>
            </span>
          </button>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
