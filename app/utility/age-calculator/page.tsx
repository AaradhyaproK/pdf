'use client';

import { useState, useMemo, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateDetailedAge } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Heart,
  Sparkles,
  Share2,
  Copy,
  Gift,
  Star,
  RefreshCw,
  Sun,
  Activity,
  Check,
} from 'lucide-react';

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [targetDate, setTargetDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [copied, setCopied] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);

  // Live ticking counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ageData = useMemo(() => {
    return calculateDetailedAge(birthDate, targetDate);
  }, [birthDate, targetDate, liveSeconds]);

  const handleShareWhatsApp = () => {
    if (!ageData) return;
    const msg = `🎉 Age Summary: I am ${ageData.years} Years, ${ageData.months} Months, and ${ageData.days} Days old! Total days lived: ${ageData.totalDays.toLocaleString()} days. Zodiac: ${ageData.zodiacSymbol} ${ageData.zodiacSign}. Calculate your exact age at FileZenith: https://www.filezenith.com/utility/age-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    if (!ageData) return;
    const summary = `Exact Age: ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days\nTotal Days: ${ageData.totalDays.toLocaleString()}\nBorn on: ${ageData.dayOfWeekBorn}\nZodiac: ${ageData.zodiacSymbol} ${ageData.zodiacSign} (${ageData.chineseZodiac})\nNext Birthday: In ${ageData.nextBirthday.months}M ${ageData.nextBirthday.days}D (${ageData.nextBirthday.dayOfWeek})`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('Copied age summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/age-calculator"
      title="Exact Age Calculator & Birthday Countdown"
      subtitle="Calculate your exact age in years, months, days, hours, minutes, and seconds. Discover your zodiac sign, day of week born, and next birthday countdown."
      badgeText="#1 Age Tool"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Date Selector Inputs */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Date of Birth (DOB)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Age at Date (Default: Today)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black text-slate-500 uppercase">Presets:</span>
            {[
              { label: 'Born in 2000', dob: '2000-01-01' },
              { label: 'Born in 1995', dob: '1995-06-15' },
              { label: 'Born in 1990', dob: '1990-08-20' },
              { label: 'Born in 2005', dob: '2005-03-10' },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setBirthDate(p.dob)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {ageData && (
          <>
            {/* Main Primary Age Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-indigo-600 text-white shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Your Exact Age Today
                  </span>
                  <div className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    {ageData.years} <span className="text-xl sm:text-2xl font-bold text-rose-100">Years</span>{' '}
                    {ageData.months} <span className="text-xl sm:text-2xl font-bold text-rose-100">Months</span>{' '}
                    {ageData.days} <span className="text-xl sm:text-2xl font-bold text-rose-100">Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs flex items-center gap-2 border border-white/30 transition-all cursor-pointer active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Next Birthday Banner */}
              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-extrabold">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-300" />
                  <span>
                    Next Birthday in:{' '}
                    <strong className="text-amber-300 font-black">
                      {ageData.nextBirthday.months} Months, {ageData.nextBirthday.days} Days
                    </strong>{' '}
                    ({ageData.nextBirthday.daysTotal} days total)
                  </span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                  Day: {ageData.nextBirthday.dayOfWeek}
                </span>
              </div>
            </div>

            {/* Grid of Detailed Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-black uppercase text-slate-500">Total Months Lived</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">{ageData.totalMonths.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Months</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-black uppercase text-slate-500">Total Weeks Lived</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">{ageData.totalWeeks.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Weeks</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-black uppercase text-slate-500">Total Days Lived</div>
                <div className="text-xl sm:text-2xl font-black text-rose-600">{ageData.totalDays.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Days</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-black uppercase text-slate-500">Total Hours</div>
                <div className="text-xl sm:text-2xl font-black text-indigo-600">{ageData.totalHours.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Hours</div>
              </div>
            </div>

            {/* Astrology & Life Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Astrology & Birth Info */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" /> Astrology & Birth Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 block">Zodiac Sign</span>
                    <span className="text-base font-black text-slate-900">{ageData.zodiacSymbol} {ageData.zodiacSign}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 block">Chinese Zodiac</span>
                    <span className="text-base font-black text-slate-900">{ageData.chineseZodiac}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                    <span className="text-[10px] font-bold text-slate-500 block">Day of the Week You Were Born</span>
                    <span className="text-sm font-black text-rose-600">{ageData.dayOfWeekBorn}</span>
                  </div>
                </div>
              </div>

              {/* Life Milestone Estimates */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600" /> Life Stats & Milestones
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-xl border border-rose-100">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-600" /> Estimated Heartbeats:
                    </span>
                    <strong className="font-black text-rose-700">{ageData.milestones.heartbeats}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-sky-50/50 rounded-xl border border-sky-100">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-sky-600" /> Total Sleep Years:
                    </span>
                    <strong className="font-black text-sky-700">~{ageData.milestones.sleepYears} Years</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="font-bold text-slate-700">Days to Age {ageData.milestones.nextBigAge}:</span>
                    <strong className="font-black text-emerald-700">{ageData.milestones.daysToNextBigAge} Days</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
