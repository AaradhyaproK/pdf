'use client';

import { useEffect, useState } from 'react';
import { trackAdImpression, getAdsConfig, getAdsConfigFromFirestore, AdsManagerConfig } from '@/lib/admin-store';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

// Custom Code Embed Runner (when explicitly provided)
function CustomAdEmbed({ code, height = 250 }: { code: string; height?: number }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; font-family: system-ui, -apple-system, sans-serif; }
        </style>
      </head>
      <body>
        <div id="ad-box" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
          ${code}
        </div>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center py-1">
      <iframe
        srcDoc={htmlContent}
        width="100%"
        height={height}
        title="Custom Ad Embed"
        className="border-0 overflow-hidden w-full rounded-2xl"
        scrolling="no"
      />
    </div>
  );
}

export function AdSlot({ slotType, clientAdId, className = '' }: AdSlotProps) {
  const [config, setConfig] = useState<AdsManagerConfig>(getAdsConfig());

  useEffect(() => {
    trackAdImpression(slotType);

    // Sync live Firebase Firestore stored ad configurations & publisher IDs
    getAdsConfigFromFirestore().then((liveConfig) => {
      if (liveConfig) {
        setConfig(liveConfig);
      }
    });

    // Request Google AdSense to fill slot if approved
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // Silently handled before AdSense approval
    }
  }, [slotType]);

  const publisherId = config?.publisherId || 'ca-pub-1291898061670715';
  const adLabel = config?.adLabelText !== undefined ? config.adLabelText : 'Advertisement';

  if (slotType === 'header-leaderboard') {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-6 sm:my-8 ${className}`}>
        {adLabel && (
          <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mb-2 block select-none text-center">
            {adLabel}
          </span>
        )}
        <div className="w-full max-w-[728px] min-h-[90px] bg-slate-50/40 border border-slate-200/60 rounded-2xl p-1 flex items-center justify-center overflow-hidden shadow-2xs">
          {config.adProvider === 'custom' && config.customHeaderCode ? (
            <CustomAdEmbed code={config.customHeaderCode} height={90} />
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '90px' }}
              data-ad-client={publisherId}
              data-ad-slot={clientAdId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          )}
        </div>
      </div>
    );
  }

  if (slotType === 'sticky-sidebar') {
    return (
      <div className={`w-full flex flex-col items-center my-6 sm:my-8 sticky top-24 ${className}`}>
        {adLabel && (
          <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mb-2 block select-none text-center">
            {adLabel}
          </span>
        )}
        <div className="w-full max-w-[300px] min-h-[500px] sm:min-h-[600px] bg-slate-50/40 border border-slate-200/60 rounded-3xl p-1 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xs">
          {config.adProvider === 'custom' && config.customSidebarCode ? (
            <CustomAdEmbed code={config.customSidebarCode} height={600} />
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '500px' }}
              data-ad-client={publisherId}
              data-ad-slot={clientAdId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          )}
        </div>
      </div>
    );
  }

  // Post-Download / In-Feed Banner Slot
  return (
    <div className={`w-full my-6 sm:my-8 flex flex-col items-center justify-center ${className}`}>
      {adLabel && (
        <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mb-2 block select-none text-center">
          {adLabel}
        </span>
      )}
      <div className="w-full max-w-4xl min-h-[120px] bg-slate-50/40 border border-slate-200/60 rounded-3xl p-1 flex items-center justify-center overflow-hidden shadow-2xs">
        {config.adProvider === 'custom' && config.customPostDownloadCode ? (
          <CustomAdEmbed code={config.customPostDownloadCode} height={120} />
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '120px' }}
            data-ad-client={publisherId}
            data-ad-slot={clientAdId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
