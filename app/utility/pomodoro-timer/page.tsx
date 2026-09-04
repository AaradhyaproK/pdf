'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Timer,
  Maximize,
  Minimize,
  Settings2,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { toast } from 'sonner';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

const MODES: Record<TimerMode, { label: string; defaultMinutes: number; icon: any; color: string; ringColor: string; bg: string }> = {
  pomodoro: { label: 'Pomodoro', defaultMinutes: 25, icon: Brain, color: 'text-rose-600', ringColor: 'ring-rose-500', bg: 'bg-rose-50' },
  shortBreak: { label: 'Short Break', defaultMinutes: 5, icon: Coffee, color: 'text-emerald-600', ringColor: 'ring-emerald-500', bg: 'bg-emerald-50' },
  longBreak: { label: 'Long Break', defaultMinutes: 15, icon: Timer, color: 'text-blue-600', ringColor: 'ring-blue-500', bg: 'bg-blue-50' },
  custom: { label: 'Custom', defaultMinutes: 10, icon: Settings2, color: 'text-indigo-600', ringColor: 'ring-indigo-500', bg: 'bg-indigo-50' },
};

export default function PomodoroTimerPage() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsTheme, setFsTheme] = useState<'day' | 'night'>('day');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  // Synthesize Web Audio chime fallback for offline PWA mode
  const playSynthBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
      });
    } catch {
      // Ignore audio policy errors
    }
  }, [soundEnabled]);

  const triggerAlarm = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (alarmAudio.current) {
        alarmAudio.current.currentTime = 0;
        alarmAudio.current.play().catch(() => playSynthBeep());
      } else {
        playSynthBeep();
      }
    } catch {
      playSynthBeep();
    }
  }, [soundEnabled, playSynthBeep]);

  // Handle Fullscreen state change events across standard & WebKit browsers
  useEffect(() => {
    alarmAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

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

  // Lock body scroll when in fullscreen or mobile PWA mode
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

  // Countdown timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      triggerAlarm();

      if (mode === 'pomodoro') {
        setSessionsCompleted((prev) => prev + 1);
      }

      toast.success(`${MODES[mode].label} session completed!`, { duration: 5000 });

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FileZenith Timer', {
          body: `${MODES[mode].label} session completed! Take a break.`,
          icon: '/icon.png',
        });
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, triggerAlarm]);

  // Tab Title ticker
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${formattedTime} • ${MODES[mode].label} | FileZenith`;
  }, [timeLeft, mode]);

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const getTargetMinutes = (m: TimerMode) => (m === 'custom' ? customMinutes : MODES[m].defaultMinutes);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getTargetMinutes(mode) * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(getTargetMinutes(newMode) * 60);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    const clamped = Math.max(1, Math.min(val, 999));
    setCustomMinutes(clamped);
    if (mode === 'custom') {
      setTimeLeft(clamped * 60);
      setIsActive(false);
    }
  };

  // Hybrid Fullscreen: Supports Desktop HTML5 Fullscreen + Mobile Safari / iOS / PWA Immersive Mode
  const toggleFullscreen = async () => {
    if (isFullscreen) {
      // Exit fullscreen
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        }
      } catch {
        // Fallback gracefully
      }
    } else {
      // Enter fullscreen: Activate state first so iOS / PWA immediately displays immersive UI
      setIsFullscreen(true);
      try {
        const el = containerRef.current;
        if (el?.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any)?.webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        }
      } catch {
        // Native requestFullscreen not permitted or unsupported on iOS Safari/PWA.
        // The custom CSS fullscreen mode is already active and works flawlessly.
      }
    }
  };

  const targetSec = getTargetMinutes(mode) * 60;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = Math.min(100, Math.max(0, 100 - (timeLeft / targetSec) * 100));
  const modeData = MODES[mode];

  return (
    <ToolLayout
      slug="/utility/pomodoro-timer"
      title="Pomodoro Timer & Study Clock"
      subtitle="Free online Pomodoro timer to boost your productivity. Aesthetic study clock for deep work, PWA focus, and revision."
      badgeText="Focus Clock"
    >
      <div
        ref={containerRef}
        className={`transition-all duration-300 relative flex flex-col justify-between select-none ${
          isFullscreen
            ? `fixed inset-0 z-[99999] w-full h-[100dvh] max-h-[100dvh] p-4 sm:p-8 overflow-hidden overscroll-none pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] transition-colors duration-300 ${
                fsTheme === 'night' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
              }`
            : 'max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-10 min-h-[580px] overflow-hidden'
        }`}
      >
        {/* Dynamic Progress Background Layer */}
        <div
          className={`absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-1000 ease-linear ${
            isFullscreen && fsTheme === 'night'
              ? 'opacity-10 bg-indigo-500'
              : `opacity-[0.08] ${modeData.bg.replace('50', '200')}`
          }`}
          style={{ height: `${progress}%` }}
        />

        {/* Top Header Bar: Mode & Action Icons */}
        <div className="relative z-20 flex items-center justify-between gap-2 w-full pb-4">
          {/* Status & Session Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs ${
                isFullscreen && fsTheme === 'night'
                  ? 'bg-slate-900 text-slate-200 border border-slate-800'
                  : 'bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Session #{sessionsCompleted + 1}</span>
            </span>

            {/* Sound Mute/Unmute Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast(soundEnabled ? 'Alarm Sound Muted' : 'Alarm Sound Active', { duration: 1500 });
              }}
              className={`p-2 rounded-xl transition-all border ${
                isFullscreen && fsTheme === 'night'
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200/80'
              }`}
              title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Day / Night Mode Toggle Button (ONLY visible in Fullscreen) */}
            {isFullscreen && (
              <button
                onClick={() => {
                  const nextTheme = fsTheme === 'day' ? 'night' : 'day';
                  setFsTheme(nextTheme);
                  toast(nextTheme === 'night' ? 'Night Mode Active' : 'Day Mode Active', { duration: 1500 });
                }}
                className={`p-2 rounded-xl transition-all border cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  fsTheme === 'night'
                    ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-indigo-700 border-slate-200/80'
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
            )}

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-2xs cursor-pointer border ${
                isFullscreen && fsTheme === 'night'
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
              }`}
              title={isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Fullscreen Mode'}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-4 h-4 shrink-0" />
                  <span className="hidden xs:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4 shrink-0" />
                  <span className="hidden xs:inline">Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="relative z-20 flex justify-center w-full my-2">
          <div
            className={`flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-2xl border transition-all ${
              isFullscreen && fsTheme === 'night'
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-slate-100/90 border-slate-200/70 shadow-inner'
            }`}
          >
            {(Object.keys(MODES) as TimerMode[]).map((m) => {
              const Icon = MODES[m].icon;
              const isSelected = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? isFullscreen && fsTheme === 'night'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : isFullscreen && fsTheme === 'night'
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? (isFullscreen && fsTheme === 'night' ? 'text-white' : MODES[m].color) : ''}`} />
                  <span>{MODES[m].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Timer Input Slider / Number Box */}
        {mode === 'custom' && (
          <div className="relative z-20 flex justify-center my-2 animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                isFullscreen && fsTheme === 'night'
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-indigo-50/70 border-indigo-100 text-indigo-950'
              }`}
            >
              <span>Duration:</span>
              <input
                type="number"
                min={1}
                max={999}
                value={customMinutes}
                onChange={handleCustomChange}
                className={`w-16 px-2 py-1 rounded-lg border text-center font-black text-sm outline-none focus:ring-2 ${
                  isFullscreen && fsTheme === 'night'
                    ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-500'
                    : 'bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500'
                }`}
              />
              <span>minutes</span>
            </div>
          </div>
        )}

        {/* Giant Adaptive Clock Display */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center py-4 my-auto">
          <div
            className={`font-black tracking-tighter tabular-nums select-none leading-none drop-shadow-sm transition-all duration-300 text-center ${
              isFullscreen
                ? fsTheme === 'night'
                  ? 'text-white text-[22vw] sm:text-[140px] md:text-[200px] lg:text-[240px]'
                  : `text-[22vw] sm:text-[140px] md:text-[200px] lg:text-[240px] ${modeData.color}`
                : `text-[18vw] xs:text-[76px] sm:text-[110px] md:text-[140px] lg:text-[160px] ${modeData.color}`
            }`}
          >
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>

          {/* Current Mode Subtitle Indicator */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span
              className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                isFullscreen && fsTheme === 'night' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {isActive ? `${modeData.label} in Progress` : 'Timer Paused'}
            </span>
          </div>
        </div>

        {/* Controls: Reset & Big Start/Pause Button */}
        <div className="relative z-20 flex items-center justify-center gap-6 sm:gap-8 pt-4 pb-2">
          {/* Reset Button */}
          <button
            onClick={resetTimer}
            className={`p-4 sm:p-5 rounded-2xl transition-all shadow-sm active:scale-95 cursor-pointer border ${
              isFullscreen && fsTheme === 'night'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full text-white transition-all duration-300 active:scale-95 hover:scale-105 shadow-xl cursor-pointer ${
              isActive
                ? 'bg-slate-900 hover:bg-black shadow-slate-900/30'
                : isFullscreen && fsTheme === 'night'
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/50'
                : `${modeData.color.replace('text-', 'bg-')} hover:brightness-105 shadow-md`
            }`}
            title={isActive ? 'Pause Timer' : 'Start Timer'}
          >
            {isActive ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Fullscreen Quick-Dismiss Footer Bar */}
        {isFullscreen && (
          <div
            className={`relative z-20 flex items-center justify-between text-[11px] font-bold pt-3 border-t ${
              fsTheme === 'night' ? 'text-slate-500 border-slate-900' : 'text-slate-400 border-slate-100'
            }`}
          >
            <span>FileZenith Focus Clock</span>
            <button
              onClick={toggleFullscreen}
              className={`underline ${fsTheme === 'night' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Close Fullscreen (Esc)
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
