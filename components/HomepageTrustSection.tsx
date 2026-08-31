'use client';

import { ShieldCheck, Zap, Cpu, Globe, Star, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export function HomepageTrustSection() {
  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: '100% Client-Side Privacy',
      badge: '0 Bytes Uploaded',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accentBorder: 'border-emerald-200/80',
      desc: 'Your PDF and image files are processed strictly inside your device RAM memory. Zero file uploads or data tracking guaranteed.',
    },
    {
      icon: Zap,
      title: 'Instant Local Speed',
      badge: 'Wasm Accelerated',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      accentBorder: 'border-rose-200/80',
      desc: 'No cloud server queueing or upload bottlenecks. Large 100MB PDFs compress and convert in milliseconds on your local CPU.',
    },
    {
      icon: Cpu,
      title: 'Advanced AI & WebAssembly',
      badge: 'Client Wasm Engine',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      accentBorder: 'border-indigo-200/80',
      desc: 'Powered by compiled WebAssembly engines including pdf-lib, qpdf-wasm, Tesseract.js AI OCR, and HTML5 Canvas processing.',
    },
    {
      icon: Globe,
      title: 'Cross-Platform App',
      badge: '100% Mobile Ready',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      accentBorder: 'border-amber-200/80',
      desc: 'Works seamlessly on iPhone, Android, Mac, Windows, and Linux devices. No app store installation or subscription required.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-14">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-10 shadow-xs space-y-6 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Zero-Server Security Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Why Millions Trust FileZenith
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            Traditional cloud PDF tools upload your sensitive documents to remote servers. FileZenith executes 100% of conversions directly on your local device.
          </p>
        </div>

        {/* Mobile Swipeable Card Carousel / Desktop Responsive Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-1 px-1 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 scrollbar-none">
          {trustFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`snap-center shrink-0 w-[85vw] max-w-[290px] sm:w-auto p-5 rounded-2xl sm:rounded-3xl bg-slate-50/70 hover:bg-white border ${item.accentBorder} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-2xl border ${item.iconBg} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center text-[10px] font-bold text-slate-500 gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Free & Unlimited</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Trust Metrics Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80">
            <span className="text-base sm:text-xl font-black text-emerald-800 block">4.9 / 5.0</span>
            <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" /> 58,400+ Reviews
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80">
            <span className="text-base sm:text-xl font-black text-indigo-900 block">0 Bytes</span>
            <span className="text-[10px] sm:text-xs text-indigo-700 font-semibold flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-indigo-600" /> Cloud Upload Risk
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100/80">
            <span className="text-base sm:text-xl font-black text-rose-900 block">100% Free</span>
            <span className="text-[10px] sm:text-xs text-rose-700 font-semibold">No Fees or Limits</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100/80">
            <span className="text-base sm:text-xl font-black text-amber-950 block">Offline Ready</span>
            <span className="text-[10px] sm:text-xs text-amber-800 font-semibold">Mobile PWA Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
