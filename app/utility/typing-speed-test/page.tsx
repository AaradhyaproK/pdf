'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { TYPING_TEST_PARAGRAPHS } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
  Trophy,
  Sparkles,
  Award,
  Download,
  X,
} from 'lucide-react';

export default function TypingSpeedTestPage() {
  const [duration, setDuration] = useState<number>(60);
  const [targetText, setTargetText] = useState<string>('');
  const [inputVal, setInputVal] = useState<string>('');

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('Alex Johnson');
  const [certTheme, setCertTheme] = useState<'gold' | 'dark' | 'emerald' | 'indigo'>('gold');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const certCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize random text
  const initTest = (dur = duration) => {
    const randomPara = TYPING_TEST_PARAGRAPHS[Math.floor(Math.random() * TYPING_TEST_PARAGRAPHS.length)];
    setTargetText(randomPara);
    setInputVal('');
    setDuration(dur);
    setTimeLeft(dur);
    setIsActive(false);
    setIsFinished(false);
  };

  useEffect(() => {
    initTest(60);
  }, []);

  // Web Audio click synth
  const playBeep = (freq = 800) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!isActive && val.length > 0) {
      setIsActive(true);
    }

    playBeep(val.length > inputVal.length ? 700 : 300);
    setInputVal(val);

    if (val.length >= targetText.length) {
      setIsActive(false);
      setIsFinished(true);
    }
  };

  // Compute live typing stats
  const stats = useMemo(() => {
    const timeSpentSeconds = Math.max(1, duration - timeLeft);
    const timeSpentMinutes = timeSpentSeconds / 60;

    let correctChars = 0;
    let errorChars = 0;

    for (let i = 0; i < inputVal.length; i++) {
      if (inputVal[i] === targetText[i]) {
        correctChars++;
      } else {
        errorChars++;
      }
    }

    const totalTyped = inputVal.length;
    const grossWPM = Math.round(totalTyped / 5 / timeSpentMinutes);
    const netWPM = Math.max(0, Math.round((correctChars / 5 - errorChars) / timeSpentMinutes));
    const accuracy = totalTyped > 0 ? Math.min(100, Math.round((correctChars / totalTyped) * 100)) : 100;
    const cpm = Math.round(correctChars / timeSpentMinutes);

    return {
      grossWPM: isNaN(grossWPM) ? 0 : grossWPM,
      netWPM: isNaN(netWPM) ? 0 : netWPM,
      accuracy: isNaN(accuracy) ? 100 : accuracy,
      cpm: isNaN(cpm) ? 0 : cpm,
      errors: errorChars,
      correct: correctChars,
    };
  }, [inputVal, targetText, duration, timeLeft]);

  const handleShareWhatsApp = () => {
    const msg = `⚡ My Typing Speed Result: ${stats.netWPM} WPM with ${stats.accuracy}% Accuracy! Can you beat my score? Test your speed on FileZenith: https://www.filezenith.com/utility/typing-speed-test`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Render Certificate on Canvas
  const renderCertificate = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Background & Borders based on theme
    let bgColor = '#fafaf9';
    let primaryColor = '#d97706';
    let textColor = '#1e293b';
    let badgeBg = '#fef3c7';
    let badgeText = '#92400e';

    if (certTheme === 'dark') {
      bgColor = '#0f172a';
      primaryColor = '#38bdf8';
      textColor = '#f8fafc';
      badgeBg = '#0284c7';
      badgeText = '#ffffff';
    } else if (certTheme === 'emerald') {
      bgColor = '#064e3b';
      primaryColor = '#34d399';
      textColor = '#ecfdf5';
      badgeBg = '#059669';
      badgeText = '#ffffff';
    } else if (certTheme === 'indigo') {
      bgColor = '#1e1b4b';
      primaryColor = '#a78bfa';
      textColor = '#f5f3ff';
      badgeBg = '#6d28d9';
      badgeText = '#ffffff';
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1200, 800);

    // Outer & Inner Borders
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 1104, 704);

    // Certificate Header Title
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FILEZENITH OFFICIAL CERTIFICATION BOARD', 600, 110);

    ctx.fillStyle = textColor;
    ctx.font = 'black 46px serif';
    ctx.fillText('CERTIFICATE OF TYPING PROFICIENCY', 600, 175);

    // Decorative Line
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(400, 205);
    ctx.lineTo(800, 205);
    ctx.stroke();

    // Subtitle text
    ctx.fillStyle = textColor;
    ctx.font = '22px sans-serif';
    ctx.fillText('This is to officially certify that', 600, 260);

    // Candidate Name
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 52px serif';
    ctx.fillText(candidateName || 'Alex Johnson', 600, 335);

    // Underline for name
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 355);
    ctx.lineTo(850, 355);
    ctx.stroke();

    // Description text
    ctx.fillStyle = textColor;
    ctx.font = '20px sans-serif';
    ctx.fillText(
      `has successfully completed the ${duration}-second standardized typing speed benchmark with outstanding results:`,
      600,
      410
    );

    // Score Pill Badge
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.roundRect(350, 450, 500, 95, 20);
    ctx.fill();

    ctx.fillStyle = badgeText;
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`${stats.netWPM} WPM`, 470, 512);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Accuracy: ${stats.accuracy}%`, 720, 510);

    // Footer Info & Verification Seal
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = textColor;
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${today}`, 100, 680);
    ctx.fillText(`Verification ID: FZ-WPM-${Math.floor(100000 + Math.random() * 900000)}`, 100, 710);

    ctx.textAlign = 'right';
    ctx.fillText('FileZenith Speed Evaluation Engine', 1100, 680);
    ctx.font = 'italic 16px serif';
    ctx.fillText('Authorized Digital Signature', 1100, 710);
  };

  useEffect(() => {
    if (showCertModal) {
      renderCertificate();
    }
  }, [showCertModal, candidateName, certTheme, stats]);

  const handleDownloadCertificate = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `FileZenith_Typing_Certificate_${stats.netWPM}WPM.png`;
    a.click();
    toast.success('WPM Certificate downloaded in high resolution!');
  };

  return (
    <ToolLayout
      slug="/utility/typing-speed-test"
      title="Online Typing Speed Test (WPM & Certificate Exporter)"
      subtitle="Test your words per minute (WPM), accuracy, and CPM. Export official high-resolution PNG typing certificates with custom candidate name."
      badgeText="Viral WPM Certificate"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Controls Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">
          {/* Duration Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-black text-slate-500 uppercase px-2">Time:</span>
            {[15, 30, 60, 120].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => initTest(t)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  duration === t ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => initTest(duration)}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Test</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Header Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase">Time Left</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase">Net Speed (WPM)</div>
            <div className="text-3xl font-black text-rose-600 tracking-tight">{stats.netWPM}</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase">Accuracy</div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">{stats.accuracy}%</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase">CPM / Errors</div>
            <div className="text-2xl font-black text-indigo-600 tracking-tight">
              {stats.cpm} <span className="text-xs text-rose-500 font-bold">({stats.errors} err)</span>
            </div>
          </div>
        </div>

        {/* Typing Display Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          {/* Target Text Display with Highlight */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-lg sm:text-2xl font-mono leading-relaxed select-none min-h-[140px] cursor-text tracking-wide"
          >
            {targetText.split('').map((char, idx) => {
              let color = 'text-slate-400';
              if (idx < inputVal.length) {
                color =
                  inputVal[idx] === char
                    ? 'text-emerald-600 bg-emerald-100/60 font-bold rounded'
                    : 'text-white bg-rose-600 font-bold rounded';
              }
              const isCurrent = idx === inputVal.length && !isFinished;
              return (
                <span key={idx} className={`${color} ${isCurrent ? 'border-b-4 border-indigo-600 animate-pulse' : ''}`}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* User Typing Textarea */}
          <div className="relative">
            <textarea
              ref={inputRef}
              rows={3}
              value={inputVal}
              onChange={handleInputChange}
              disabled={isFinished}
              placeholder={
                isFinished
                  ? 'Test Completed! Click Export Certificate below or Restart.'
                  : 'Start typing here to trigger the timer automatically...'
              }
              className="w-full p-4 rounded-2xl border border-slate-300 bg-white font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
            />
          </div>
        </div>

        {/* Final Score Card on Finish */}
        {isFinished && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-6 border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider">
                <Trophy className="w-5 h-5 text-amber-400" /> Test Complete - Score Summary
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Generate WPM Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Score</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Speed (WPM)</span>
                <div className="text-4xl font-black text-rose-400">{stats.netWPM}</div>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Accuracy</span>
                <div className="text-4xl font-black text-emerald-400">{stats.accuracy}%</div>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">CPM</span>
                <div className="text-4xl font-black text-sky-400">{stats.cpm}</div>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Errors</span>
                <div className="text-4xl font-black text-amber-400">{stats.errors}</div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => initTest(duration)}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again to Improve Score</span>
              </button>
            </div>
          </div>
        )}

        {/* WPM Certificate Export Modal */}
        {showCertModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-rose-600 font-black text-lg">
                  <Award className="w-6 h-6" />
                  <span>WPM Typing Certificate Exporter</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Inputs & Theme Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Candidate Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Certificate Style Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gold', name: 'Gold' },
                      { id: 'dark', name: 'Dark' },
                      { id: 'emerald', name: 'Emerald' },
                      { id: 'indigo', name: 'Indigo' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setCertTheme(th.id as any)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          certTheme === th.id
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Canvas Container */}
              <div className="flex justify-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 p-2 shadow-inner">
                <canvas ref={certCanvasRef} className="max-w-full h-auto rounded-xl shadow-lg" />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs font-bold text-slate-500">
                  High-res 1200x800 PNG • Instant Client-side Download
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCertificate}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
