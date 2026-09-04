'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { RotateCcw, Shuffle, Trash2, Volume2, VolumeX, Trophy, Maximize, Minimize } from 'lucide-react';

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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tickAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    winAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    updateNames(namesText);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const updateNames = (text: string) => {
    const parsed = text.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    setNames(parsed.length > 0 ? parsed : ['Add some names!']);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNamesText(e.target.value);
    updateNames(e.target.value);
    setWinner(null);
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

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
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, 24 - numSlices)}px Inter, sans-serif`;
      
      const text = names[i];
      const maxTextLength = 15;
      const displayText = text.length > maxTextLength ? text.substring(0, maxTextLength) + '...' : text;
      
      ctx.fillText(displayText, radius - 20, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel();
  }, [names]);

  const playTick = () => {
    if (soundEnabled && tickAudio.current) {
      tickAudio.current.currentTime = 0;
      tickAudio.current.play().catch(() => {});
    }
  };

  const playWin = () => {
    if (soundEnabled && winAudio.current) {
      winAudio.current.currentTime = 0;
      winAudio.current.play().catch(() => {});
    }
  };

  const spin = () => {
    if (isSpinning || names.length <= 1) return;
    
    setIsSpinning(true);
    setWinner(null);

    const spins = Math.floor(Math.random() * 5) + 5;
    const extraDegree = Math.floor(Math.random() * 360);
    const totalDegree = spins * 360 + extraDegree;
    
    let currentDegree = rotation;
    const targetDegree = rotation + totalDegree;
    
    let startTimestamp: number | null = null;
    const duration = 4000;

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
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: COLORS
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => toast.error('Fullscreen not supported'));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <ToolLayout
      slug="/utility/spin-the-wheel"
      title="Random Name Picker & Spin the Wheel"
      subtitle="Free online random choice generator. Enter names, spin the wheel, and pick a random winner instantly."
      badgeText="Viral Tool"
    >
      <div 
        ref={containerRef}
        className={`flex flex-col lg:flex-row gap-8 items-stretch transition-all relative ${
          isFullscreen 
            ? 'w-screen h-screen bg-white fixed inset-0 z-50 p-4 md:p-8 overflow-y-auto' 
            : ''
        }`}
      >
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-50 shadow-sm"
          >
            <Minimize className="w-6 h-6" />
          </button>
        )}

        {/* Left Side: Controls */}
        <div className={`order-2 lg:order-1 w-full lg:w-1/3 flex flex-col ${isFullscreen ? 'lg:h-full lg:justify-center' : ''}`}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                Entries ({names.length})
              </h3>
              <div className="flex gap-2">
                <button onClick={shuffleNames} title="Shuffle Names" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={clearNames} title="Clear All" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <textarea
              value={namesText}
              onChange={handleTextChange}
              placeholder="Enter names here...&#10;One name per line"
              className="w-full flex-1 min-h-[150px] lg:min-h-[300px] p-5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none font-medium text-[15px] shadow-inner transition-all leading-relaxed"
            />
            
            <div className="mt-5 flex items-center justify-between">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </button>
              
              {!isFullscreen && (
                <button onClick={toggleFullscreen} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl hover:bg-slate-50">
                  <Maximize className="w-5 h-5" />
                  <span>Full Screen</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Wheel */}
        <div className="order-1 lg:order-2 w-full lg:w-2/3 flex flex-col items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 shadow-inner relative overflow-hidden flex-1 min-h-[400px]">
          
          {winner && !isSpinning && (
            <div className="absolute top-8 z-30 animate-in slide-in-from-top-8 fade-in duration-500">
              <div className="bg-white/95 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl border-4 border-indigo-500 flex items-center gap-4 transform scale-110">
                <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
                <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate max-w-xs text-center">
                  {winner}
                </span>
                <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
              </div>
            </div>
          )}

          <div className="relative mt-8 mb-8 z-10">
            {/* Pointer */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 drop-shadow-2xl">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-slate-800" />
            </div>
            
            {/* Wheel Canvas */}
            <div className="relative rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ring-8 ring-white bg-white p-3">
              <div className="rounded-full shadow-inner bg-slate-50 p-1">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={500}
                  className="rounded-full w-full max-w-[500px] h-auto drop-shadow-sm"
                  style={{ transformOrigin: 'center center' }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || names.length <= 1}
            className="mt-6 z-20 group relative px-8 py-4 md:px-16 md:py-6 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-lg md:text-2xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.8)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden w-full max-w-[320px] md:max-w-none md:w-auto"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            <span className="relative flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap">
              <RotateCcw className={`w-5 h-5 md:w-8 md:h-8 flex-shrink-0 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
            </span>
          </button>
          
          {isFullscreen && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-50 z-10 select-none pointer-events-none">
              <span className="text-sm font-bold text-slate-500 tracking-wider">
                Powered by FileZenith.com
              </span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
