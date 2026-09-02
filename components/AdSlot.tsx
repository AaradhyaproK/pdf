'use client';

import { useEffect, useRef, useState } from 'react';
import { trackAdImpression } from '@/lib/admin-store';
import {
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Heart,
  HeartHandshake,
  Rocket,
} from 'lucide-react';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11707727';

// High-CTR Developer Support & Sponsor Variants
const HIGH_CTR_OFFERS = [
  {
    tag: '❤️ Support Dev • Keep Tools Free',
    title: 'Help Us Keep FileZenith 100% Free Forever!',
    desc: 'FileZenith has zero subscriptions and zero paywalls. Visiting our sponsor link takes 2 seconds and directly covers our server & dev costs.',
    cta: 'Click Here to Support Developer ↗',
    benefitBadge: 'Takes 2 Seconds • 100% Free Support',
    icon: HeartHandshake,
  },
  {
    tag: '⚡ 1-Click Free Tools Support',
    title: 'Love Using Private PDF Tools for Free?',
    desc: 'Support independent development! A quick click on our sponsor partner keeps FileZenith fast, private, and free for students & pros worldwide.',
    cta: 'Support Dev & Visit Sponsor ↗',
    benefitBadge: 'Zero Cost To You • 100% Safe',
    icon: Heart,
  },
  {
    tag: '🎁 Keep Private Suite 100% Free',
    title: 'Support Dev & Keep All 25+ Tools Unlocked!',
    desc: 'No credit card or signup needed. Simply visiting our partner offer helps us maintain browser privacy engines without ever charging user fees.',
    cta: 'Click to Support & Open Partner ↗',
    benefitBadge: 'Verified Partner Link • Instant Support',
    icon: Rocket,
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
      <div className={`w-full flex flex-col items-center justify-center my-3 sm:my-5 ${className}`}>
        <div className="w-full flex items-center justify-center gap-1.5 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-rose-700 font-extrabold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
            Support Developer & Keep Tools 100% Free
          </span>
        </div>
        <div
          ref={adRef}
          className="w-full min-h-[90px] bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all shadow-xs hover:shadow-md hover:border-indigo-500 group"
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
              className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-600 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-rose-700 transition-colors text-white">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-rose-700 font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                      {activeOffer.tag}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {activeOffer.benefitBadge}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2 leading-snug">
                    <span>{activeOffer.title}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {activeOffer.desc}
                  </p>
                </div>
              </div>

              <span className="w-full lg:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shrink-0 shadow-xs transition-all flex items-center justify-center gap-2.5 group-hover:scale-[1.02] active:scale-95">
                <Heart className="w-4 h-4 fill-white" />
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
        <div className="w-full flex items-center justify-start gap-1.5 mb-2 px-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-rose-700 font-extrabold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            Support Developer
          </span>
        </div>
        <div
          ref={adRef}
          className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all shadow-xs hover:shadow-md hover:border-indigo-500 group cursor-pointer space-y-5"
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
              className="w-full flex flex-col items-center justify-between space-y-5"
            >
              {/* Solid Corporate Dark Slate Developer Card */}
              <div className="w-full space-y-4">
                <div className="relative w-full p-5 rounded-2xl bg-slate-900 text-white shadow-xs space-y-2.5 overflow-hidden text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-[10px] uppercase font-extrabold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>100% Free Mission</span>
                    </span>
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  </div>

                  <h3 className="text-base font-extrabold leading-snug text-white pt-1">
                    Support Our Developer & Keep FileZenith Free!
                  </h3>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    1 quick click on our sponsor takes 2 seconds and directly covers our serverless costs so you never have to pay subscriptions!
                  </p>
                </div>

                <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="inline-block text-[10px] uppercase tracking-wider text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100/80 border border-indigo-200 mb-1">
                    {activeOffer.tag}
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug flex items-center justify-between gap-1.5">
                    <span>{activeOffer.title}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeOffer.desc}
                  </p>
                </div>
              </div>

              {/* Solid Call To Action */}
              <div className="w-full space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-extrabold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-max mx-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{activeOffer.benefitBadge}</span>
                </div>
                <span className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95">
                  <Heart className="w-4 h-4 fill-white" />
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
    <div className={`w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-500 transition-all flex flex-col items-center justify-center text-center group ${className}`}>
      <span className="text-[11px] uppercase tracking-wider text-rose-700 font-extrabold mb-3 px-4 py-1 rounded-full bg-rose-50 border border-rose-200 flex items-center gap-1.5">
        <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
        Support Developer & Keep Tools Free
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
          className="space-y-4 w-full p-4 sm:p-5 rounded-2xl hover:bg-slate-50 transition-all block text-center cursor-pointer border border-transparent"
        >
          {/* Solid Deep Indigo Hero Box */}
          <div className="w-full p-5 rounded-2xl bg-indigo-950 text-white shadow-xs space-y-2 group-hover:scale-[1.01] transition-transform text-center">
            <div className="flex items-center justify-center gap-2 text-indigo-200 font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Enjoyed Using FileZenith for Free?</span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-white">
              Support the Developer to Keep 25+ PDF Tools 100% Free!
            </h4>
            <p className="text-xs text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
              Your file was processed 100% privately on your device. Taking 2 seconds to click our sponsor link directly supports our dev costs so we never add paid plans.
            </p>
          </div>

          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 pt-1">
            <span>{activeOffer.title}</span>
            <ExternalLink className="w-4.5 h-4.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-xl mx-auto">
            {activeOffer.desc}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all group-hover:scale-[1.02] active:scale-95">
              <Heart className="w-4 h-4 fill-white" />
              <span>{activeOffer.cta}</span>
            </span>
            <span className="text-xs text-emerald-800 font-extrabold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              ✓ {activeOffer.benefitBadge}
            </span>
          </div>
        </a>
      )}
    </div>
  );
}


