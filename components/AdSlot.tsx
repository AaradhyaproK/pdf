'use client';

import { useEffect, useState } from 'react';
import { trackAdImpression, getAdsConfig, getAdsConfigFromFirestore, AdsManagerConfig } from '@/lib/admin-store';

export interface AdSlotProps {
  slotType: 'header-leaderboard' | 'sticky-sidebar' | 'post-download';
  clientAdId?: string;
  className?: string;
}

const DEFAULT_SUPPORT_URL = '/';

// 728x90 Leaderboard Banner with In-Window Fallback if Blocked
function AdsterraLeaderboardBanner({ adKey, supportUrl }: { adKey: string; supportUrl: string }) {
  const key = adKey || '1f0ffa4c1356415c0882b66a415fa778';
  const targetUrl = supportUrl || DEFAULT_SUPPORT_URL;

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
            font-family: system-ui, -apple-system, sans-serif;
          }
          #ad-box {
            width: 100%;
            max-width: 728px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #fallback-box {
            display: none;
            width: 100%;
            max-width: 728px;
            height: 90px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            box-sizing: border-box;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          #fallback-box:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }
          .fallback-btn {
            background: #4f46e5;
            color: #ffffff;
            padding: 9px 16px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 800;
            white-space: nowrap;
            transition: background 0.2s;
          }
          .fallback-btn:hover {
            background: #4338ca;
          }
          @media (max-width: 520px) {
            #fallback-box {
              padding: 8px 12px;
              height: auto;
              min-height: 80px;
            }
            .fallback-title {
              font-size: 11px !important;
            }
            .fallback-sub {
              font-size: 9px !important;
            }
            .fallback-btn {
              padding: 6px 10px !important;
              font-size: 10px !important;
            }
          }
        </style>
        <script type="text/javascript">
          var adLoaded = false;
          function showFallback() {
            var adBox = document.getElementById('ad-box');
            var fbBox = document.getElementById('fallback-box');
            if (adBox) adBox.style.display = 'none';
            if (fbBox) fbBox.style.display = 'flex';
          }
          function detectAd() {
            if (adLoaded) return true;
            var adBox = document.getElementById('ad-box');
            if (!adBox) return false;
            var iframes = adBox.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
              if (iframes[i].offsetHeight > 10 || iframes[i].clientHeight > 10) {
                adLoaded = true;
                return true;
              }
            }
            var media = adBox.querySelectorAll('img, canvas, ins, object, embed, svg');
            if (media.length > 0) { adLoaded = true; return true; }
            var children = adBox.children;
            for (var j = 0; j < children.length; j++) {
              if (children[j].tagName !== 'SCRIPT' && children[j].id !== 'fallback-box' && (children[j].offsetHeight > 10 || children[j].scrollHeight > 10)) {
                adLoaded = true;
                return true;
              }
            }
            return false;
          }
          window.showFallback = showFallback;
          window.detectAd = detectAd;
          var pollTimer = setInterval(function() {
            if (detectAd()) { clearInterval(pollTimer); }
          }, 400);
          setTimeout(function() {
            clearInterval(pollTimer);
            if (!detectAd()) { showFallback(); }
          }, 3500);
        </script>
      </head>
      <body>
        <div id="ad-box">
          <script type="text/javascript">
            atOptions = {
              'key' : '${key}',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highrevenueformat.com/${key}/invoke.js" onerror="window.showFallback && window.showFallback()"></script>
        </div>

        <a id="fallback-box" href="${targetUrl}" target="_self">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:22px;">⚡</span>
            <div style="text-align:left;">
              <div class="fallback-title" style="font-size:13px; font-weight:900; color:#0f172a;">Fast, Private, In-Browser File Tools</div>
              <div class="fallback-sub" style="font-size:11px; font-weight:600; color:#64748b; margin-top:2px;">100% client-side memory execution with zero server file uploads.</div>
            </div>
          </div>
          <div class="fallback-btn">Explore Free Tools →</div>
        </a>
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

// Tall Skyscraper Sidebar Banner with In-Window Fallback if Blocked
function AdsterraSidebarTallBanner({ sidebarKey, scriptUrl, containerId, supportUrl }: { sidebarKey: string; scriptUrl: string; containerId: string; supportUrl: string }) {
  const key = sidebarKey || 'ae79652e11f3a4d27e0103e1bbfa3b96';
  const script = scriptUrl || 'https://pl31153051.profitableratecpmnetwork.com/1c9f44a13215d061cf2fa93f0e7157ff/invoke.js';
  const cId = containerId || 'container-1c9f44a13215d061cf2fa93f0e7157ff';
  const targetUrl = supportUrl || DEFAULT_SUPPORT_URL;

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
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: transparent;
            font-family: system-ui, -apple-system, sans-serif;
          }
          ::-webkit-scrollbar { display: none; }
          #ad-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          #${cId} {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #fallback-box {
            display: none;
            width: 100%;
            height: 100%;
            min-height: 480px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 24px 20px;
            box-sizing: border-box;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          #fallback-box:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            transform: translateY(-1px);
          }
          .fallback-btn {
            background: #4f46e5;
            color: #ffffff;
            padding: 12px 22px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 800;
            margin-top: 18px;
            box-shadow: 0 4px 12px rgba(79,70,229,0.25);
            transition: background 0.2s;
          }
          .fallback-btn:hover {
            background: #4338ca;
          }
        </style>
        <script type="text/javascript">
          var adLoaded = false;
          function showFallback() {
            var adBox = document.getElementById('ad-box');
            var fbBox = document.getElementById('fallback-box');
            if (adBox) adBox.style.display = 'none';
            if (fbBox) fbBox.style.display = 'flex';
          }
          function detectAd() {
            if (adLoaded) return true;
            var adBox = document.getElementById('ad-box');
            if (!adBox) return false;
            var iframes = adBox.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
              if (iframes[i].offsetHeight > 10 || iframes[i].clientHeight > 10) {
                adLoaded = true;
                return true;
              }
            }
            var container = document.getElementById('${cId}');
            if (container && (container.offsetHeight > 10 || container.clientHeight > 10 || container.children.length > 0)) {
              adLoaded = true;
              return true;
            }
            var media = adBox.querySelectorAll('img, canvas, ins, object, embed, svg');
            if (media.length > 0) { adLoaded = true; return true; }
            return false;
          }
          window.showFallback = showFallback;
          window.detectAd = detectAd;
          var pollTimer = setInterval(function() {
            if (detectAd()) { clearInterval(pollTimer); }
          }, 400);
          setTimeout(function() {
            clearInterval(pollTimer);
            if (!detectAd()) { showFallback(); }
          }, 3500);
        </script>
      </head>
      <body>
        <div id="ad-box">
          <script type="text/javascript">
            atOptions = {
              'key' : '${key}',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highrevenueformat.com/${key}/invoke.js" onerror="window.showFallback && window.showFallback()"></script>
          <div id="${cId}"></div>
          <script async="async" data-cfasync="false" src="${script}" onerror="window.showFallback && window.showFallback()"></script>
        </div>

        <a id="fallback-box" href="${targetUrl}" target="_self">
          <div style="font-size:42px; margin-bottom:12px;">🛡️</div>
          <div style="font-size:16px; font-weight:900; color:#0f172a;">Fast, Private, In-Browser Tools</div>
          <div style="font-size:13px; font-weight:700; color:#475569; margin-top:4px;">100% Client-Side Studio</div>
          <div style="font-size:12px; font-weight:500; color:#64748b; margin-top:8px; max-width:240px; line-height:1.4;">All conversion engines execute strictly in your device browser with zero file uploads.</div>
          <div class="fallback-btn">Explore All Tools →</div>
        </a>
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

// Native Container Banner with In-Window Fallback if Blocked
function AdsterraContainerBanner({ scriptUrl, containerId, supportUrl }: { scriptUrl: string; containerId: string; supportUrl: string }) {
  const script = scriptUrl || 'https://pl31153051.profitableratecpmnetwork.com/1c9f44a13215d061cf2fa93f0e7157ff/invoke.js';
  const cId = containerId || 'container-1c9f44a13215d061cf2fa93f0e7157ff';
  const targetUrl = supportUrl || DEFAULT_SUPPORT_URL;

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
            font-family: system-ui, -apple-system, sans-serif;
          }
          #ad-box {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #${cId} {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #fallback-box {
            display: none;
            width: 100%;
            max-width: 800px;
            height: 100%;
            min-height: 200px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            align-items: center;
            justify-content: space-between;
            padding: 20px 28px;
            box-sizing: border-box;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          #fallback-box:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }
          .fallback-btn {
            background: #4f46e5;
            color: #ffffff;
            padding: 11px 22px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(79,70,229,0.2);
            transition: background 0.2s;
          }
          .fallback-btn:hover {
            background: #4338ca;
          }
          @media (max-width: 580px) {
            #fallback-box {
              flex-direction: column;
              text-align: center;
              gap: 12px;
              padding: 16px;
              min-height: 180px;
            }
          }
        </style>
        <script type="text/javascript">
          var adLoaded = false;
          function showFallback() {
            var adBox = document.getElementById('ad-box');
            var fbBox = document.getElementById('fallback-box');
            if (adBox) adBox.style.display = 'none';
            if (fbBox) fbBox.style.display = 'flex';
          }
          function detectAd() {
            if (adLoaded) return true;
            var container = document.getElementById('${cId}');
            var adBox = document.getElementById('ad-box');
            if (container && (container.offsetHeight > 10 || container.clientHeight > 10 || container.children.length > 0)) {
              adLoaded = true;
              return true;
            }
            if (adBox) {
              var iframes = adBox.getElementsByTagName('iframe');
              for (var i = 0; i < iframes.length; i++) {
                if (iframes[i].offsetHeight > 10 || iframes[i].clientHeight > 10) {
                  adLoaded = true;
                  return true;
                }
              }
              var media = adBox.querySelectorAll('img, canvas, ins, object, embed, svg');
              if (media.length > 0) { adLoaded = true; return true; }
            }
            return false;
          }
          window.showFallback = showFallback;
          window.detectAd = detectAd;
          var pollTimer = setInterval(function() {
            if (detectAd()) { clearInterval(pollTimer); }
          }, 400);
          setTimeout(function() {
            clearInterval(pollTimer);
            if (!detectAd()) { showFallback(); }
          }, 3500);
        </script>
      </head>
      <body>
        <div id="ad-box">
          <div id="${cId}"></div>
          <script async="async" data-cfasync="false" src="${script}" onerror="window.showFallback && window.showFallback()"></script>
        </div>

        <a id="fallback-box" href="${targetUrl}" target="_self">
          <div style="display:flex; align-items:center; gap:16px;">
            <span style="font-size:32px;">⚡</span>
            <div style="text-align:left;">
              <div style="font-size:15px; font-weight:900; color:#0f172a;">Fast, Private, In-Browser File Tools</div>
              <div style="font-size:12px; font-weight:500; color:#64748b; margin-top:3px;">Process PDFs, images, and documents 100% privately in device memory.</div>
            </div>
          </div>
          <div class="fallback-btn">Explore Free Tools →</div>
        </a>
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

// Custom Code Embed Runner with In-Window Fallback if Blocked
function CustomAdEmbed({ code, height = 250, supportUrl }: { code: string; height?: number; supportUrl: string }) {
  const targetUrl = supportUrl || DEFAULT_SUPPORT_URL;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; font-family: system-ui, -apple-system, sans-serif; }
          #fallback-box { display: none; width: 100%; height: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; align-items: center; justify-content: center; text-decoration: none; flex-direction: column; padding: 12px; box-sizing: border-box; text-align: center; }
          .fallback-btn { background: #4f46e5; color: #ffffff; padding: 8px 16px; border-radius: 12px; font-size: 12px; font-weight: 800; margin-top: 6px; }
        </style>
        <script type="text/javascript">
          function showFallback() {
            var adBox = document.getElementById('ad-box');
            var fbBox = document.getElementById('fallback-box');
            if (adBox) adBox.style.display = 'none';
            if (fbBox) fbBox.style.display = 'flex';
          }
          function checkAd() {
            var adBox = document.getElementById('ad-box');
            if (!adBox) { showFallback(); return; }
            var iframes = adBox.getElementsByTagName('iframe');
            var hasAd = false;
            for (var i = 0; i < iframes.length; i++) {
              if (iframes[i].offsetHeight > 10 || iframes[i].clientHeight > 10) {
                hasAd = true;
                break;
              }
            }
            if (!hasAd) {
              var media = adBox.querySelectorAll('img, canvas, ins, object, embed, svg');
              if (media.length > 0) hasAd = true;
            }
            if (!hasAd) {
              var children = adBox.children;
              for (var j = 0; j < children.length; j++) {
                if (children[j].tagName !== 'SCRIPT' && (children[j].offsetHeight > 10 || children[j].scrollHeight > 10)) {
                  hasAd = true;
                  break;
                }
              }
            }
            if (!hasAd) {
              showFallback();
            }
          }
          window.showFallback = showFallback;
          window.checkAd = checkAd;
          setTimeout(checkAd, 1500);
          setTimeout(checkAd, 3500);
        </script>
      </head>
      <body>
        <div id="ad-box" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
          ${code}
        </div>
        <a id="fallback-box" href="${targetUrl}" target="_self">
          <div style="font-size:13px; font-weight:900; color:#0f172a;">Fast, Private, In-Browser File Tools</div>
          <div style="font-size:11px; font-weight:500; color:#64748b; margin-top:2px;">100% client-side file tools with zero server file uploads.</div>
          <div class="fallback-btn">Explore Free Tools →</div>
        </a>
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

  const supportUrl = config.fallbackSupportUrl || DEFAULT_SUPPORT_URL;

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
            <CustomAdEmbed code={config.customHeaderCode} height={90} supportUrl={supportUrl} />
          ) : (
            <AdsterraLeaderboardBanner adKey={config.adsterraHeaderKey} supportUrl={supportUrl} />
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
            <CustomAdEmbed code={config.customSidebarCode} height={530} supportUrl={supportUrl} />
          ) : (
            <AdsterraSidebarTallBanner
              sidebarKey={config.adsterraSidebarKey}
              scriptUrl={config.adsterraContainerScript}
              containerId={config.adsterraContainerId}
              supportUrl={supportUrl}
            />
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
          <CustomAdEmbed code={config.customPostDownloadCode} height={250} supportUrl={supportUrl} />
        ) : (
          <AdsterraContainerBanner
            scriptUrl={config.adsterraContainerScript}
            containerId={config.adsterraContainerId}
            supportUrl={supportUrl}
          />
        )}
      </div>
    </div>
  );
}
