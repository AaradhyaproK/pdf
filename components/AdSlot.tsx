'use client';

import { useEffect } from 'react';
import { trackAdImpression } from '@/lib/admin-store';
import { Heart } from 'lucide-react';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

// Full-Width 728x90 Leaderboard Adsterra Banner
function AdsterraLeaderboardBanner() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '1f0ffa4c1356415c0882b66a415fa778',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/1f0ffa4c1356415c0882b66a415fa778/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center overflow-x-auto py-1">
      <iframe
        srcDoc={htmlContent}
        width="728"
        height="90"
        title="Adsterra 728x90 Leaderboard Banner"
        className="border-0 overflow-hidden max-w-full rounded-xl"
        scrolling="no"
      />
    </div>
  );
}

// Tall Skyscraper Sidebar Adsterra Banner (Height 530px+)
function AdsterraSidebarTallBanner() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: transparent;
            gap: 16px;
          }
          ::-webkit-scrollbar { display: none; }
          #container-1c9f44a13215d061cf2fa93f0e7157ff {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : 'ae79652e11f3a4d27e0103e1bbfa3b96',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/ae79652e11f3a4d27e0103e1bbfa3b96/invoke.js"></script>

        <div id="container-1c9f44a13215d061cf2fa93f0e7157ff"></div>
        <script async="async" data-cfasync="false" src="https://pl31153051.profitableratecpmnetwork.com/1c9f44a13215d061cf2fa93f0e7157ff/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center py-1">
      <iframe
        srcDoc={htmlContent}
        width="300"
        height="530"
        title="Adsterra Tall Skyscraper Sidebar Banner"
        className="border-0 overflow-hidden max-w-full rounded-2xl"
        scrolling="no"
      />
    </div>
  );
}

// Native Container Adsterra Banner
function AdsterraContainerBanner() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
          }
          #container-1c9f44a13215d061cf2fa93f0e7157ff {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <div id="container-1c9f44a13215d061cf2fa93f0e7157ff"></div>
        <script async="async" data-cfasync="false" src="https://pl31153051.profitableratecpmnetwork.com/1c9f44a13215d061cf2fa93f0e7157ff/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center py-1">
      <iframe
        srcDoc={htmlContent}
        width="100%"
        height="250"
        title="Adsterra Native Container Banner"
        className="border-0 overflow-hidden w-full max-w-4xl rounded-2xl"
        scrolling="no"
      />
    </div>
  );
}

export function AdSlot({ slotType, clientAdId, className = '' }: AdSlotProps) {
  useEffect(() => {
    trackAdImpression(slotType);
  }, [slotType]);

  if (slotType === 'header-leaderboard') {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-3 sm:my-5 ${className}`}>
        <div className="w-full flex items-center justify-center gap-1.5 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-rose-700 font-extrabold flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-4 py-1.5 rounded-full shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
            Support Developer by Clicking Ads • Keeps All Tools 100% Free
          </span>
        </div>
        <div className="w-full min-h-[115px] bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-center justify-center">
          {clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId}
              data-ad-slot="1234567890"
              data-ad-format="auto"
            />
          ) : (
            <AdsterraLeaderboardBanner />
          )}
        </div>
      </div>
    );
  }

  if (slotType === 'sticky-sidebar') {
    return (
      <div className={`w-full flex flex-col items-center my-4 sticky top-20 ${className}`}>
        <div className="w-full flex items-center justify-center gap-1.5 mb-2 px-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-rose-700 font-extrabold flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            Support Developer by Clicking Ads
          </span>
        </div>
        <div className="w-full min-h-[580px] bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-start text-center shadow-2xs space-y-3">
          {clientAdId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={clientAdId}
              data-ad-slot="0987654321"
            />
          ) : (
            <AdsterraSidebarTallBanner />
          )}
        </div>
      </div>
    );
  }

  // Post-Download / In-Feed Banner Slot
  return (
    <div className={`w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-2xs flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-full flex items-center justify-center gap-1.5 mb-3">
        <span className="text-[11px] uppercase tracking-wider text-rose-700 font-extrabold flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
          Enjoyed Free Tools? Support Developer by Clicking Ads Below!
        </span>
      </div>
      {clientAdId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={clientAdId}
          data-ad-slot="1122334455"
        />
      ) : (
        <AdsterraContainerBanner />
      )}
    </div>
  );
}
