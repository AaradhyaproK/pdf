'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { trackAdImpression } from '@/lib/admin-store';
import { ExternalLink, Sparkles, Zap, ShieldCheck, Download, Server, Cpu } from 'lucide-react';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11707727';

// High-CTR Dynamic Offer Variants to maximize user click-through rate
const HIGH_CTR_OFFERS = [
  {
    tag: '⚡ Fast Server Partner',
    title: 'High-Speed Cloud Storage & Fast Mirror Engine',
    desc: 'Accelerate downloads with 10x faster cloud processing servers.',
    cta: 'Access Fast Mirror ↗',
    icon: Server,
    color: 'from-amber-500 to-orange-500',
  },
  {
    tag: '🔥 Featured Pro Offer',
    title: 'DocuFlow AI: Batch PDF & Image Suite',
    desc: 'Intelligent AI extraction, OCR tools & unlimited cloud file tools.',
    cta: 'Claim Free Trial ↗',
    icon: Cpu,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    tag: '🎁 Exclusive Partner Deal',
    title: 'Unlimited High-Speed Batch Media Converter',
    desc: 'Convert 500+ files instantly with zero waiting time.',
    cta: 'Get Partner Access ↗',
    icon: Download,
    color: 'from-emerald-500 to-teal-500',
  },
];

export function AdSlot({ slotType, clientAdId, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [offerIndex, setOfferIndex] = useState(0);

  useEffect(() => {
    trackAdImpression(slotType);
    // Pick a random high-CTR offer variant on mount for fresh engagement
    setOfferIndex(Math.floor(Math.random() * HIGH_CTR_OFFERS.length));

    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // Ignored for development / ad-blockers
    }
  }, [slotType, clientAdId]);

  const activeOffer = HIGH_CTR_OFFERS[offerIndex];
  const IconComponent = activeOffer.icon;

  if (slotType === 'header-leaderboard') {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Sponsored Partner Announcement
          </span>
        </div>
        <div
          ref={adRef}
          className="w-full max-w-[728px] min-h-[90px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-2.5 overflow-hidden transition-all shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-500/60 group"
        >
          {clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId}
              data-ad-slot="1234567890"
              data-ad-format="auto"
            />
          ) : (
            <a
              href={MONETAG_DIRECT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-left p-1 cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-indigo-500/40 group-hover:scale-105 transition-transform shadow-md">
                  <Image
                    src="/ad-poster.jpg"
                    alt="Sponsored Ad"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-black px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                      {activeOffer.tag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>{activeOffer.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-slate-300 hidden sm:block font-medium">
                    {activeOffer.desc}
                  </p>
                </div>
              </div>

              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs shrink-0 shadow-md transition-all flex items-center gap-1.5 group-hover:scale-105 active:scale-95">
                <span>{activeOffer.cta}</span>
              </span>
            </a>
          )}
        </div>
      </div>
    );
  }

  if (slotType === 'sticky-sidebar') {
    return (
      <div className={`w-full flex flex-col items-center my-4 sticky top-24 ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Sponsored Partner Ad
          </span>
        </div>
        <div
          ref={adRef}
          className="w-full max-w-[300px] min-h-[430px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 flex flex-col items-center justify-between text-center overflow-hidden transition-all shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-500/60 group cursor-pointer"
        >
          {clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId}
              data-ad-slot="0987654321"
            />
          ) : (
            <a
              href={MONETAG_DIRECT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex flex-col items-center justify-between h-full space-y-4"
            >
              {/* Top Banner Graphic Poster */}
              <div className="w-full space-y-3">
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-indigo-500/40 group-hover:scale-[1.03] transition-transform shadow-lg">
                  <Image
                    src="/ad-poster.jpg"
                    alt="Monetag Sponsored Ad Poster"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-500/50 text-[9px] uppercase font-black text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Sponsored Partner</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="inline-block text-[9px] uppercase tracking-wider text-amber-400 font-black px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 mb-1">
                    {activeOffer.tag}
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors leading-tight">
                    {activeOffer.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {activeOffer.desc}
                  </p>
                </div>
              </div>

              {/* Bottom High-CTR Call To Action */}
              <div className="w-full space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Monetag Deal</span>
                </div>
                <span className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 group-hover:scale-105 active:scale-95">
                  <span>{activeOffer.cta}</span>
                </span>
              </div>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Post-Download Conversion Card
  return (
    <div className={`w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-indigo-500/30 shadow-xl hover:border-indigo-500/60 transition-all flex flex-col items-center justify-center text-center group ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-black mb-2 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
        🔥 Exclusive Partner Deal
      </span>
      {clientAdId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={clientAdId}
          data-ad-slot="1122334455"
        />
      ) : (
        <a
          href={MONETAG_DIRECT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="space-y-3 max-w-lg w-full p-3.5 rounded-2xl hover:bg-white/5 transition-all block text-center cursor-pointer"
        >
          <div className="relative w-full h-[140px] sm:h-[170px] rounded-2xl overflow-hidden border border-indigo-500/40 group-hover:scale-[1.02] transition-transform shadow-lg mb-3">
            <Image
              src="/ad-poster.jpg"
              alt="Monetag Special Offer Poster"
              fill
              className="object-cover"
            />
          </div>

          <h4 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5">
            <span>{activeOffer.title}</span>
            <ExternalLink className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {activeOffer.desc}
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs shadow-lg transition-all group-hover:scale-105 active:scale-95">
              <span>{activeOffer.cta}</span>
            </span>
          </div>
        </a>
      )}
    </div>
  );
}
