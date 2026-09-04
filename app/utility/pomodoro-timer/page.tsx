'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer, Maximize, Minimize, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

const MODES: Record<TimerMode, { label: string; defaultMinutes: number; icon: any; color: string; bg: string }> = {
  pomodoro: { label: 'Pomodoro', defaultMinutes: 25, icon: Brain, color: 'text-rose-600', bg: 'bg-rose-50' },
  shortBreak: { label: 'Short Break', defaultMinutes: 5, icon: Coffee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  longBreak: { label: 'Long Break', defaultMinutes: 15, icon: Timer, color: 'text-blue-600', bg: 'bg-blue-50' },
  custom: { label: 'Custom', defaultMinutes: 10, icon: Settings2, color: 'text-indigo-600', bg: 'bg-indigo-50' }
};

export default function PomodoroTimerPage() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (alarmAudio.current) {
        alarmAudio.current.currentTime = 0;
        alarmAudio.current.play().catch(() => {});
      }
      toast.success(`${MODES[mode].label} session completed!`, { duration: 5000 });
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FileZenith Timer', {
          body: `${MODES[mode].label} session completed!`,
          icon: '/favicon.ico'
        });
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${formattedTime} - ${MODES[mode].label} | FileZenith`;
  }, [timeLeft, mode]);

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const getTargetMinutes = (m: TimerMode) => m === 'custom' ? customMinutes : MODES[m].defaultMinutes;

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => toast.error('Fullscreen not supported'));
    } else {
      document.exitFullscreen();
    }
  };

  const targetSec = getTargetMinutes(mode) * 60;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 100 - (timeLeft / targetSec) * 100;
  const modeData = MODES[mode];

  return (
    <ToolLayout
      slug="/utility/pomodoro-timer"
      title="Pomodoro Timer & Study Clock"
      subtitle="Free online Pomodoro timer to boost your productivity. Aesthetic study clock for deep work and focus."
      badgeText="Focus Tool"
    >
      <div 
        ref={containerRef}
        className={`max-w-3xl mx-auto flex flex-col items-center justify-center p-8 transition-colors duration-500 relative overflow-hidden ${
          isFullscreen 
            ? 'w-screen h-screen bg-white rounded-none fixed inset-0 z-50' 
            : 'bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[600px]'
        }`}
      >
        {/* Progress Background */}
        <div 
          className={`absolute bottom-0 left-0 right-0 opacity-[0.08] transition-all duration-1000 ease-linear ${modeData.bg.replace('50', '200')}`}
          style={{ height: `${progress}%` }}
        />

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-20 shadow-sm"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {/* Mode Selector */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-3 mb-10 bg-slate-50/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-200/60 shadow-sm">
          {(Object.keys(MODES) as TimerMode[]).map((m) => {
            const Icon = MODES[m].icon;
            const isSelected = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isSelected 
                    ? `bg-white shadow-md border-transparent text-slate-900 ring-1 ring-slate-200/50` 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? MODES[m].color : ''}`} />
                {MODES[m].label}
              </button>
            );
          })}
        </div>

        {/* Custom Timer Input */}
        <div className={`relative z-10 transition-all duration-300 overflow-hidden ${mode === 'custom' ? 'h-14 opacity-100 mb-6' : 'h-0 opacity-0 mb-0'}`}>
          <div className="flex items-center gap-3 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
            <span className="text-sm font-semibold text-indigo-900">Custom Time:</span>
            <input 
              type="number" 
              min={1} 
              max={999} 
              value={customMinutes}
              onChange={handleCustomChange}
              className="w-20 px-3 py-1.5 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center font-bold text-indigo-900 bg-white"
            />
            <span className="text-sm font-semibold text-indigo-900">min</span>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative z-10 flex items-center justify-center mb-16 mt-4 select-none">
          <div className={`text-[120px] md:text-[200px] leading-none font-black tracking-tighter tabular-nums drop-shadow-sm transition-colors duration-500 ${modeData.color}`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-8">
          <button
            onClick={resetTimer}
            className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm hover:shadow active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw className="w-7 h-7" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center w-24 h-24 rounded-full text-white transition-all duration-300 active:scale-95 hover:scale-105 shadow-xl ${
              isActive 
                ? 'bg-slate-900 hover:bg-black shadow-slate-900/30' 
                : `${modeData.color.replace('text-', 'bg-')} shadow-${modeData.color.replace('text-', '')}/40`
            }`}
          >
            {isActive ? (
              <Pause className="w-10 h-10 fill-current" />
            ) : (
              <Play className="w-10 h-10 fill-current ml-2" />
            )}
          </button>
        </div>
        
        {/* Fullscreen Watermark */}
        {isFullscreen && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-40 select-none pointer-events-none">
            <span className="text-sm font-bold text-slate-500 tracking-wider">
              Powered by FileZenith.com
            </span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
