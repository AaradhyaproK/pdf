'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackAdImpression, getAdsConfig, getAdsConfigFromFirestore, AdsManagerConfig } from '@/lib/admin-store';
import { ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

// In-House Clean Feature Highlights (Zero 3rd-party ad scripts to ensure instant AdSense approval)
function CompliantHeaderBanner() {
  return (
    <Link
      href="/studio"
      className="w-full max-w-[728px] h-[90px] bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 border border-slate-200/90 rounded-2xl px-4 sm:px-6 flex items-center justify-between hover:border-indigo-300 transition-all group shadow-2xs"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Fast, Private, In-Browser File Studio</span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hidden sm:inline-block">100% Client-Side</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">Zero server uploads. Your PDF &amp; image files never leave your device.</p>
        </div>
      </div>
      <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 shrink-0">
        <span>Explore Tools</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

function CompliantSidebarBanner() {
  return (
    <div className="w-full max-w-[300px] h-full min-h-[480px] bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 border border-slate-200/90 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-2xs">
      <div className="space-y-4 flex flex-col items-center pt-2">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            Privacy First
          </span>
          <h4 className="text-base font-black text-slate-900 pt-2 leading-snug">
            100% Private In-Browser Engine
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
            All PDF, image, and document conversion tools run entirely in device memory.
          </p>
        </div>
      </div>

      <div className="w-full space-y-3 pb-2">
        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 font-semibold space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-emerald-700">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Zero Cloud Uploads</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-700">
            <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Instant WebAssembly Speed</span>
          </div>
        </div>

        <Link
          href="/studio"
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>Explore All 50+ Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CompliantContainerBanner() {
  return (
    <Link
      href="/studio"
      className="w-full max-w-4xl p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 border border-slate-200/90 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-indigo-300 transition-all group shadow-2xs"
    >
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-sm sm:text-base font-black text-slate-900">
              Fast, Private, In-Browser File Studio
            </h4>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Safe &amp; Free
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Edit, compress, convert, and protect your files with zero server file uploads.
          </p>
        </div>
      </div>

      <span className="px-4 py-2.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0">
        <span>Explore All Tools</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

// Custom Code Embed Runner (only when explicitly provided)
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
  const [config, setConfig] = useState<AdsManagerConfig | null>(null);

  useEffect(() => {
    trackAdImpression(slotType);
    setConfig(getAdsConfig());

    // Sync live Firebase Firestore stored ad configurations & support texts
    getAdsConfigFromFirestore().then((liveConfig) => {
      if (liveConfig) {
        setConfig(liveConfig);
      }
    });
  }, [slotType]);

  if (!config) return null;

  // Check if slot is disabled by Admin settings
  if (slotType === 'header-leaderboard' && !config.headerBannerEnabled) return null;
  if (slotType === 'sticky-sidebar' && !config.sidebarEnabled) return null;
  if (slotType === 'post-download' && !config.toolInFeedEnabled) return null;

  // Google AdSense Policy Compliance:
  // Publishers may ONLY label ad blocks with "Advertisement" or "Sponsored" (or blank).
  // Any text encouraging clicks is strictly prohibited.
  const adLabel = config.adLabelText !== undefined ? config.adLabelText : 'Advertisement';

  if (slotType === 'header-leaderboard') {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-7 sm:my-8 ${className}`}>
        {adLabel && (
          <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mb-2 block select-none text-center">
            {adLabel}
          </span>
        )}
        <div className="w-full min-h-[105px] bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-3 shadow-2xs flex items-center justify-center">
          {config.adProvider === 'adsense' || clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId || config.publisherId}
              data-ad-slot="1234567890"
              data-ad-format="auto"
            />
          ) : config.adProvider === 'custom' && config.customHeaderCode ? (
            <CustomAdEmbed code={config.customHeaderCode} height={90} />
          ) : (
            <CompliantHeaderBanner />
          )}
        </div>
      </div>
    );
  }

  if (slotType === 'sticky-sidebar') {
    return (
      <div className={`w-full flex flex-col items-center my-7 sm:my-8 sticky top-24 ${className}`}>
        {adLabel && (
          <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mb-2 block select-none text-center">
            {adLabel}
          </span>
        )}
        <div className="w-full min-h-[550px] bg-white border border-slate-200/90 rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-start text-center shadow-2xs">
          {config.adProvider === 'adsense' || clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId || config.publisherId}
              data-ad-slot="0987654321"
            />
          ) : config.adProvider === 'custom' && config.customSidebarCode ? (
            <CustomAdEmbed code={config.customSidebarCode} height={530} />
          ) : (
            <CompliantSidebarBanner />
          )}
        </div>
      </div>
    );
  }

  // Post-Download / In-Feed Banner Slot (Enforces strict >= 25px clear margin from interactive buttons)
  return (
    <div className={`w-full my-8 sm:my-10 flex flex-col items-center justify-center ${className}`}>
      {adLabel && (
        <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mb-2 block select-none text-center">
          {adLabel}
        </span>
      )}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col items-center justify-center text-center">
        {config.adProvider === 'adsense' || clientAdId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={clientAdId || config.publisherId}
            data-ad-slot="1122334455"
          />
        ) : config.adProvider === 'custom' && config.customPostDownloadCode ? (
          <CustomAdEmbed code={config.customPostDownloadCode} height={250} />
        ) : (
          <CompliantContainerBanner />
        )}
      </div>
    </div>
  );
}
