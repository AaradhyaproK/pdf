'use client';

import { useState, useMemo, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateLovePercentage, DetailedLoveMatch } from '@/lib/utility-engine';
import { Heart, Sparkles, Share2, Download, Copy, Check, Star, Compass, Coffee, Flame, Crown } from 'lucide-react';
import { toast } from 'sonner';

const ZODIAC_SIGNS = [
  'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
  'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
  'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
];

const VIBES = [
  { id: 'romantic', label: 'Romantic 💖' },
  { id: 'adventurous', label: 'Adventurous 🏞️' },
  { id: 'cozy', label: 'Cozy & Chill ☕' },
  { id: 'foodie', label: 'Foodie 🍕' },
  { id: 'party', label: 'Music & Party 🎉' }
];

const STAGES = [
  { id: 'crush', label: 'Crush 💘' },
  { id: 'dating', label: 'Dating 💑' },
  { id: 'engaged', label: 'Engaged 💍' },
  { id: 'married', label: 'Married 🏠' },
  { id: 'besties', label: 'Best Friends 🤝' }
];

export default function LoveCalculatorPage() {
  const [name1, setName1] = useState('Rahul');
  const [name2, setName2] = useState('Priya');
  const [zodiac1, setZodiac1] = useState('Leo ♌');
  const [zodiac2, setZodiac2] = useState('Libra ♎');
  const [vibe1, setVibe1] = useState('romantic');
  const [vibe2, setVibe2] = useState('romantic');
  const [stage, setStage] = useState('dating');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const loveData: DetailedLoveMatch = useMemo(() => {
    return calculateLovePercentage(name1, name2, zodiac1, zodiac2, stage, vibe1, vibe2);
  }, [name1, name2, zodiac1, zodiac2, stage, vibe1, vibe2]);

  const handleShareWhatsApp = () => {
    const msg = `💖 Love Match Result:\n${name1 || 'Person 1'} & ${name2 || 'Person 2'} = ${loveData.overallScore}% Overall Match! ${loveData.soulmateTag}\n\n✨ Emotional Chemistry: ${loveData.emotionalChemistry}%\n⭐ Zodiac Alignment: ${loveData.zodiacMatch}%\n🔥 Vibe Match: ${loveData.vibeCompatibility}%\n\n💡 Best Date Idea: ${loveData.bestDateIdea}\n\nCheck your love match on FileZenith: https://www.filezenith.com/utility/love-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `Love Compatibility Card:\n${name1} & ${name2}\nOverall Score: ${loveData.overallScore}%\nSoulmate Status: ${loveData.soulmateTag}\nEmotional Chemistry: ${loveData.emotionalChemistry}%\nZodiac Alignment: ${loveData.zodiacMatch}%\nVibe Match: ${loveData.vibeCompatibility}%\nRelationship Superpower: ${loveData.relationshipSuperpower}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied love card summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  // High-Resolution Card Canvas Exporter for Instagram & WhatsApp Status
  const handleDownloadCardImage = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        toast.error('Canvas context not supported');
        setDownloading(false);
        return;
      }

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
      grad.addColorStop(0, '#f43f5e'); // rose-500
      grad.addColorStop(0.5, '#e11d48'); // rose-600
      grad.addColorStop(1, '#881337'); // rose-900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Decorative Floating Circles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(200, 200, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(1000, 1000, 240, 0, Math.PI * 2);
      ctx.fill();

      // Card Header Tag
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.roundRect(400, 80, 400, 60, 30);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(loveData.soulmateTag.toUpperCase(), 600, 120);

      // Couple Names
      ctx.font = 'bold 54px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${name1 || 'Person 1'}  ❤️  ${name2 || 'Person 2'}`, 600, 240);

      // Score Circle Outer Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.arc(600, 480, 160, 0, Math.PI * 2);
      ctx.stroke();

      // Score Circle Active Progress
      ctx.strokeStyle = '#fbbf24'; // amber-400
      ctx.lineWidth = 24;
      ctx.beginPath();
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (loveData.overallScore / 100) * (Math.PI * 2);
      ctx.arc(600, 480, 160, startAngle, endAngle);
      ctx.stroke();

      // Big Percentage Score Text
      ctx.font = '900 110px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${loveData.overallScore}%`, 600, 500);

      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#fecdd3';
      ctx.fillText('LOVE MATCH SCORE', 600, 550);

      // Headline
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(loveData.statusHeadline, 600, 710);

      // Metric Bars Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.roundRect(150, 770, 900, 280, 40);
      ctx.fill();

      // Metrics
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'left';

      // Emotional
      ctx.fillStyle = '#ffe4e6';
      ctx.fillText(`Emotional Chemistry: ${loveData.emotionalChemistry}%`, 200, 830);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(200, 845, 800, 14);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(200, 845, 800 * (loveData.emotionalChemistry / 100), 14);

      // Zodiac
      ctx.fillStyle = '#ffe4e6';
      ctx.fillText(`Zodiac Alignment (${zodiac1} & ${zodiac2}): ${loveData.zodiacMatch}%`, 200, 910);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(200, 925, 800, 14);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(200, 925, 800 * (loveData.zodiacMatch / 100), 14);

      // Vibe
      ctx.fillStyle = '#ffe4e6';
      ctx.fillText(`Vibe & Lifestyle Match: ${loveData.vibeCompatibility}%`, 200, 990);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(200, 1005, 800, 14);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(200, 1005, 800 * (loveData.vibeCompatibility / 100), 14);

      // Footer branding
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('Calculated live at FileZenith.com/utility/love-calculator', 600, 1140);

      // Export Image Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `love-match-${name1}-${name2}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Downloaded Love Card Image for Instagram/WhatsApp!');
    } catch {
      toast.error('Failed to generate image card.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/love-calculator"
      title="Love Calculator & Name Match Compatibility"
      subtitle="Calculate overall love score, emotional chemistry, zodiac horoscope alignment, vibe match, and download shareable Instagram & WhatsApp Status card images."
      badgeText="Viral Designer Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Multi-Input Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Couple Details & Astrological Inputs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person 1 */}
            <div className="space-y-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 block">Person 1 Details</span>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">First Name</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Zodiac Sign</label>
                <select
                  value={zodiac1}
                  onChange={(e) => setZodiac1(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  {ZODIAC_SIGNS.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Favorite Vibe</label>
                <select
                  value={vibe1}
                  onChange={(e) => setVibe1(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  {VIBES.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Person 2 */}
            <div className="space-y-3 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
              <span className="text-xs font-black uppercase tracking-wider text-pink-700 block">Person 2 Details</span>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Partner / Crush Name</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Enter partner name..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Zodiac Sign</label>
                <select
                  value={zodiac2}
                  onChange={(e) => setZodiac2(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                >
                  {ZODIAC_SIGNS.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Favorite Vibe</label>
                <select
                  value={vibe2}
                  onChange={(e) => setVibe2(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                >
                  {VIBES.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-700">Relationship Stage</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStage(s.id)}
                  className={`py-2.5 rounded-xl font-black text-xs border transition ${stage === s.id ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HIGH IMPACT DESIGNER LOVE CARD (Visual Result) */}
        <div
          ref={cardRef}
          className="relative bg-gradient-to-br from-rose-600 via-pink-600 to-rose-900 text-white p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6 overflow-hidden border border-rose-400/40"
        >
          {/* Subtle Glowing Background Accents */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-pink-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

          {/* Top Header Badge & Couple Names */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left relative z-10 border-b border-rose-400/30 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {loveData.soulmateTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {name1 || 'Person 1'} <span className="text-rose-200">❤️</span> {name2 || 'Person 2'}
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={handleDownloadCardImage}
                disabled={downloading}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Card PNG
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-rose-600" /> Share WhatsApp
              </button>
            </div>
          </div>

          {/* Centerpiece: Big Score Circle & Headline */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#fbbf24"
                    strokeWidth="14"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * loveData.overallScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-white">{loveData.overallScore}%</span>
                  <span className="text-[10px] font-black uppercase text-amber-200 tracking-wider">Overall Match</span>
                </div>
              </div>

              <h4 className="text-lg font-black text-white text-center mt-4 leading-snug">
                {loveData.statusHeadline}
              </h4>
            </div>

            {/* Metrics Breakdown */}
            <div className="md:col-span-7 space-y-4 bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/15">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-200">Compatibility Dimensions</h4>

              <div className="space-y-3 text-xs font-extrabold text-white">
                {/* Emotional */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Emotional Chemistry</span>
                    <span className="text-amber-300 font-black">{loveData.emotionalChemistry}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${loveData.emotionalChemistry}%` }} />
                  </div>
                </div>

                {/* Zodiac */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Zodiac Horoscope Alignment ({zodiac1} & {zodiac2})</span>
                    <span className="text-amber-300 font-black">{loveData.zodiacMatch}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${loveData.zodiacMatch}%` }} />
                  </div>
                </div>

                {/* Vibe */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Vibe & Lifestyle Match</span>
                    <span className="text-amber-300 font-black">{loveData.vibeCompatibility}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${loveData.vibeCompatibility}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-rose-200 uppercase block">Ideal Date Concept:</span>
                  <span className="font-semibold text-white leading-tight block mt-0.5">{loveData.bestDateIdea}</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-rose-200 uppercase block">Secret Superpower:</span>
                  <span className="font-semibold text-white leading-tight block mt-0.5">{loveData.relationshipSuperpower}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
