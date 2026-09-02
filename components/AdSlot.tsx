'use client';

import { useEffect, useRef } from 'react';
import { trackAdImpression } from '@/lib/admin-store';
import { ExternalLink, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11707727';

export function AdSlot({ slotType, clientAdId, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackAdImpression(slotType);
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // Ignored for development / ad-blockers
    }
  }, [slotType, clientAdId]);

  if (slotType === 'header-leaderboard') {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Sponsored Announcement
        </span>
        <div
          ref={adRef}
          className="w-full max-w-[728px] min-h-[70px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between p-3.5 overflow-hidden transition-all shadow-sm"
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
              className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>High-Speed Cloud Tools & Developer APIs</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </h4>
                  <p className="text-[11px] text-slate-300 hidden sm:block">
                    Exclusive partner offer for fast batch PDF & image processing engines.
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shrink-0 shadow-sm transition-all flex items-center gap-1">
                <span>View Offer</span>
                <span className="text-[10px]">↗</span>
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
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Sponsored Partner
        </span>
        <div
          ref={adRef}
          className="w-full max-w-[300px] min-h-[360px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-between text-center overflow-hidden transition-all shadow-md"
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
              className="w-full flex flex-col items-center justify-between h-full space-y-4 group py-2"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-105 transition-transform shadow-inner">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    Premium Partner
                  </span>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                    Automated PDF & Media Workflow APIs
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Boost your productivity with cloud conversion solutions & fast server integrations.
                </p>
              </div>

              <div className="w-full space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Partner Offer</span>
                </div>
                <span className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5">
                  <span>Explore Special Offer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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
    <div className={`w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md flex flex-col items-center justify-center text-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-extrabold mb-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
        Sponsored Partner Offer
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
          className="space-y-2.5 max-w-md w-full p-3 rounded-2xl hover:bg-white/5 transition-all group block"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto text-lg font-bold border border-indigo-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5">
            <span>High-Performance Cloud & API Partner</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Need automated batch PDF processing or cloud media tools? Explore our partner special offers.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1 px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-sm transition-all">
              <span>Check Partner Offer</span>
              <span className="text-[10px]">↗</span>
            </span>
          </div>
        </a>
      )}
    </div>
  );
}
