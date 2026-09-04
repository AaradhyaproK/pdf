'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Shuffle,
  Trash2,
  Volume2,
  VolumeX,
  Trophy,
  Maximize,
  Minimize,
  Users,
  X,
  Sparkles,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';

const COLORS = [
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#6366f1', // indigo-500
];

export default function SpinTheWheelPage() {
  const [namesText, setNamesText] = useState('Alice\nBob\nCharlie\nDiana\nEvan\nFiona\nGeorge\nHannah');
  const [names, setNames] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsTheme, setFsTheme] = useState<'day' | 'night'>('day');
  const [isEntriesOpenOnMobile, setIsEntriesOpenOnMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);

  // Web Audio fallback for offline PWA tick & win sounds
  const playSynthTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  const playSynthWin = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
      });
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (tickAudio.current) {
        tickAudio.current.currentTime = 0;
        tickAudio.current.play().catch(() => playSynthTick());
      } else {
        playSynthTick();
      }
    } catch {
      playSynthTick();
    }
  }, [soundEnabled, playSynthTick]);

  const playWin = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (winAudio.current) {
        winAudio.current.currentTime = 0;
        winAudio.current.play().catch(() => playSynthWin());
      } else {
        playSynthWin();
      }
    } catch {
      playSynthWin();
    }
  }, [soundEnabled, playSynthWin]);

  const updateNames = (text: string) => {
    const parsed = text
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    setNames(parsed.length > 0 ? parsed : ['Add names']);
  };

  useEffect(() => {
    tickAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    winAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    updateNames(namesText);

    const handleFullscreenChange = () => {
      const isNativeFs = !!document.fullscreenElement || !!(document as any).webkitFullscreenElement;
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Lock body scroll in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNamesText(e.target.value);
    updateNames(e.target.value);
    setWinner(null);
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 14;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const numSlices = names.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    for (let i = 0; i < numSlices; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';

      // Adaptive font size
      const fontSize = Math.max(13, Math.min(26, Math.floor(400 / numSlices)));
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;

      const text = names[i];
      const maxTextLength = 14;
      const displayText = text.length > maxTextLength ? text.substring(0, maxTextLength) + '…' : text;

      ctx.fillText(displayText, radius - 24, 6);
      ctx.restore();
    }

    // Center circular badge
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();
  }, [names]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning || names.length <= 1) return;

    setIsSpinning(true);
    setWinner(null);

    const spins = Math.floor(Math.random() * 5) + 6;
    const extraDegree = Math.floor(Math.random() * 360);
    const totalDegree = spins * 360 + extraDegree;

    let currentDegree = rotation;
    const targetDegree = rotation + totalDegree;

    let startTimestamp: number | null = null;
    const duration = 4200;

    let lastTickDegree = currentDegree;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;

      const easeProgress = 1 - Math.pow(1 - Math.min(progress / duration, 1), 4);
      currentDegree = rotation + (targetDegree - rotation) * easeProgress;

      if (canvasRef.current) {
        canvasRef.current.style.transform = `rotate(${currentDegree}deg)`;
      }

      const sliceDegree = 360 / names.length;
      if (currentDegree - lastTickDegree >= sliceDegree) {
        playTick();
        lastTickDegree = currentDegree;
      }

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setRotation(currentDegree % 360);
        setIsSpinning(false);

        const normalizedRotation = currentDegree % 360;
        const pointerAngle = (270 - normalizedRotation + 360) % 360;
        const winningIndex = Math.floor(pointerAngle / sliceDegree);

        const winningName = names[winningIndex];
        setWinner(winningName);
        playWin();
        confetti({
          particleCount: 160,
          spread: 85,
          origin: { y: 0.6 },
          colors: COLORS,
        });
      }
    };

    requestAnimationFrame(animate);
  };

  const shuffleNames = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNamesText(shuffled.join('\n'));
    updateNames(shuffled.join('\n'));
    setWinner(null);
    setRotation(0);
    if (canvasRef.current) canvasRef.current.style.transform = `rotate(0deg)`;
  };

  const clearNames = () => {
    setNamesText('');
    updateNames('');
    setWinner(null);
    setRotation(0);
    if (canvasRef.current) canvasRef.current.style.transform = `rotate(0deg)`;
  };

  const removeWinner = () => {
    if (!winner) return;
    const filtered = names.filter((n) => n !== winner);
    const newText = filtered.join('\n');
    setNamesText(newText);
    updateNames(newText);
    setWinner(null);
    setRotation(0);
    if (canvasRef.current) canvasRef.current.style.transform = `rotate(0deg)`;
    toast.success(`Removed "${winner}" from the wheel`);
  };

  // Hybrid Fullscreen: Standard Desktop Fullscreen + Mobile Safari / iOS / PWA Immersive Mode
  const toggleFullscreen = async () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      setIsEntriesOpenOnMobile(false);
      try {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        }
      } catch {
        // Ignore fallback
      }
    } else {
      setIsFullscreen(true);
      try {
        const el = containerRef.current;
        if (el?.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any)?.webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        }
      } catch {
        // Handled via custom CSS fullscreen mode
      }
    }
  };

  return (
    <ToolLayout
      slug="/utility/spin-the-wheel"
      title="Random Name Picker & Spin the Wheel"
      subtitle="Free online random choice generator. Enter names, spin the wheel, and pick a random winner instantly."
      badgeText="Wheel Spinner"
    >
      <div
        ref={containerRef}
        className={`transition-all duration-300 relative select-none ${
          isFullscreen
            ? `fixed inset-0 z-[99999] w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between p-3 sm:p-6 overscroll-none pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] transition-colors duration-300 ${
                fsTheme === 'night' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
              }`
            : 'w-full'
        }`}
      >
        {/* Fullscreen Top Navigation Bar */}
        {isFullscreen && (
          <div
            className={`relative z-40 flex items-center justify-between w-full pb-2 border-b ${
              fsTheme === 'night' ? 'border-slate-800/90 bg-slate-950 text-white' : 'border-slate-200/80 bg-slate-50 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border shadow-2xs ${
                  fsTheme === 'night'
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{names.length} Options</span>
              </span>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  fsTheme === 'night'
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-2xs'
                }`}
                title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Mobile Entries Drawer Button */}
              <button
                onClick={() => setIsEntriesOpenOnMobile(!isEntriesOpenOnMobile)}
                className={`lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                  fsTheme === 'night'
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Edit Names</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Day / Night Mode Toggle Button (ONLY in Fullscreen) */}
              <button
                onClick={() => {
                  const nextTheme = fsTheme === 'day' ? 'night' : 'day';
                  setFsTheme(nextTheme);
                  toast(nextTheme === 'night' ? 'Night Mode Active' : 'Day Mode Active', { duration: 1500 });
                }}
                className={`p-2 rounded-xl transition-all border cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  fsTheme === 'night'
                    ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-indigo-700 border-slate-200 shadow-2xs'
                }`}
                title={fsTheme === 'night' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              >
                {fsTheme === 'night' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Day</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline">Night</span>
                  </>
                )}
              </button>

              {/* Exit Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs cursor-pointer transition-all border ${
                  fsTheme === 'night'
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/90'
                }`}
                title="Exit Fullscreen (Esc)"
              >
                <Minimize className="w-4 h-4 text-slate-500" />
                <span className="hidden xs:inline">Exit Fullscreen</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Workspace: Side-by-side on desktop, stacked or drawer on mobile */}
        <div
          className={`flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch flex-1 ${
            isFullscreen ? 'overflow-hidden my-auto' : ''
          }`}
        >
          {/* Controls Panel (Always visible in normal mode; on mobile in fullscreen it acts as a slide-over modal) */}
          <div
            className={`w-full lg:w-1/3 flex flex-col transition-all ${
              isFullscreen
                ? isEntriesOpenOnMobile
                  ? `fixed inset-x-2 bottom-2 top-16 z-50 p-4 rounded-3xl border flex flex-col shadow-2xl backdrop-blur-xl ${
                      fsTheme === 'night'
                        ? 'bg-slate-900/98 border-slate-800 text-white'
                        : 'bg-white/98 border-slate-200 text-slate-900'
                    }`
                  : 'hidden lg:flex lg:h-full lg:justify-center'
                : 'order-2 lg:order-1'
            }`}
          >
            <div
              className={`p-5 rounded-3xl border shadow-sm flex-1 flex flex-col ${
                isFullscreen && fsTheme === 'night'
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white border-slate-200/90 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                  <span>Wheel Entries ({names.length})</span>
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={shuffleNames}
                    title="Shuffle Names"
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isFullscreen && fsTheme === 'night'
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                        : 'hover:bg-indigo-50 text-slate-400 hover:text-indigo-600'
                    }`}
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearNames}
                    title="Clear All"
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isFullscreen && fsTheme === 'night'
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-rose-400'
                        : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {isFullscreen && isEntriesOpenOnMobile && (
                    <button
                      onClick={() => setIsEntriesOpenOnMobile(false)}
                      className={`p-2 rounded-lg ml-1 cursor-pointer ${
                        fsTheme === 'night' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={namesText}
                onChange={handleTextChange}
                placeholder="Enter names here...&#10;One name per line"
                className={`w-full flex-1 min-h-[140px] lg:min-h-[260px] p-4 rounded-2xl border resize-none font-medium text-xs sm:text-sm shadow-inner transition-all leading-relaxed outline-none focus:ring-2 ${
                  isFullscreen && fsTheme === 'night'
                    ? 'bg-slate-800/90 border-slate-700 text-white focus:ring-indigo-500 placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-800 placeholder:text-slate-400'
                }`}
              />

              {/* Normal mode footer controls */}
              {!isFullscreen && (
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors px-2 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1.5 text-xs font-black text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span>Fullscreen View</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Wheel Stage Area */}
          <div
            className={`flex flex-col items-center justify-center relative overflow-hidden transition-all flex-1 ${
              isFullscreen
                ? fsTheme === 'night'
                  ? 'w-full h-full bg-slate-900/60 rounded-3xl border border-slate-800/80 p-3 sm:p-6 shadow-inner'
                  : 'w-full h-full bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 rounded-3xl border border-indigo-100 p-3 sm:p-6 shadow-inner'
                : 'order-1 lg:order-2 w-full lg:w-2/3 p-6 sm:p-10 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/70 rounded-3xl border border-indigo-100 shadow-inner min-h-[380px]'
            }`}
          >
            {/* Winner Floating Banner with Option to Remove */}
            {winner && !isSpinning && (
              <div className="absolute top-3 sm:top-6 z-30 animate-in slide-in-from-top-6 fade-in duration-300 px-2 max-w-full">
                <div className="bg-white text-slate-900 px-5 sm:px-8 py-3 rounded-2xl sm:rounded-full shadow-2xl border-2 sm:border-4 border-indigo-500 flex flex-wrap items-center justify-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-500 shrink-0 animate-bounce" />
                  <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-xs text-center">
                    {winner}
                  </span>
                  <button
                    onClick={removeWinner}
                    className="flex items-center gap-1 text-[11px] font-black bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 px-2.5 py-1 rounded-full transition-colors shrink-0 cursor-pointer"
                    title="Remove winner from wheel"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}

            {/* Wheel Canvas Container */}
            <div className="relative my-auto flex flex-col items-center justify-center">
              {/* Pointer Marker */}
              <div className="absolute -top-5 sm:-top-7 left-1/2 -translate-x-1/2 z-20 drop-shadow-xl pointer-events-none">
                <div
                  className={`w-0 h-0 border-l-[14px] sm:border-l-[18px] border-l-transparent border-r-[14px] sm:border-r-[18px] border-r-transparent border-t-[28px] sm:border-t-[38px] ${
                    isFullscreen && fsTheme === 'night' ? 'border-t-white' : 'border-t-slate-900'
                  }`}
                />
              </div>

              {/* Wheel Disc */}
              <div className="relative rounded-full shadow-2xl ring-4 sm:ring-8 ring-white bg-white p-1.5 sm:p-2.5 max-w-full">
                <div className="rounded-full shadow-inner bg-slate-50 p-1 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className="rounded-full drop-shadow-sm transition-transform max-w-[min(82vw,44dvh,460px)] max-h-[min(82vw,44dvh,460px)] w-auto h-auto"
                    style={{ transformOrigin: 'center center' }}
                  />
                </div>
              </div>
            </div>

            {/* Big Spin Action Button */}
            <button
              onClick={spin}
              disabled={isSpinning || names.length <= 1}
              className="mt-4 sm:mt-6 z-20 group relative px-8 py-3.5 sm:px-14 sm:py-5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-base sm:text-xl shadow-[0_0_35px_-8px_rgba(99,102,241,0.6)] hover:shadow-[0_0_50px_-8px_rgba(99,102,241,0.8)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden w-full max-w-[280px] sm:max-w-none sm:w-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                <RotateCcw className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Fullscreen Quick-Dismiss Footer Bar */}
        {isFullscreen && (
          <div
            className={`relative z-20 flex items-center justify-between text-[11px] font-bold pt-2 border-t mt-2 ${
              fsTheme === 'night' ? 'border-slate-900 text-slate-500 bg-slate-950' : 'border-slate-200 text-slate-400 bg-slate-50'
            }`}
          >
            <span>FileZenith Random Wheel</span>
            <button
              onClick={toggleFullscreen}
              className={`underline cursor-pointer ${fsTheme === 'night' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Exit Fullscreen (Esc)
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
