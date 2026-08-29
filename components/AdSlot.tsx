'use client';

import { useEffect, useRef } from 'react';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

export function AdSlot({ slotType, clientAdId, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          Advertisement
        </span>
        <div
          ref={adRef}
          className="w-full max-w-[728px] min-h-[90px] max-sm:min-h-[50px] bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden transition-all"
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
            <div className="text-center p-2">
              <span className="text-xs font-semibold text-slate-400 block">
                Leaderboard Banner (728x90 / 320x50)
              </span>
              <span className="text-[10px] text-slate-400/80">CLS = 0 Reserved Layout Container</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (slotType === 'sticky-sidebar') {
    return (
      <div className={`w-full flex flex-col items-center my-4 sticky top-24 ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Sponsored
        </span>
        <div
          ref={adRef}
          className="w-full max-w-[300px] min-h-[250px] lg:min-h-[600px] bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden transition-all"
        >
          {clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId}
              data-ad-slot="0987654321"
            />
          ) : (
            <div className="text-center p-4">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Sticky Sidebar (300x250 / 300x600)
              </span>
              <span className="text-[10px] text-slate-400/80">Monetization Ready Container</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Post-Download Conversion Card
  return (
    <div className={`w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 min-h-[180px] flex flex-col items-center justify-center text-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
        Sponsored Offer
      </span>
      {clientAdId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={clientAdId}
          data-ad-slot="1122334455"
        />
      ) : (
        <div className="space-y-2 max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-base font-bold border border-indigo-100">
            ⚡
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            High-Performance Developer API
          </h4>
          <p className="text-xs text-slate-500">
            Need automated batch PDF processing or background removal for your SaaS? Check our partner REST APIs.
          </p>
        </div>
      )}
    </div>
  );
}
