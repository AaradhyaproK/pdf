'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [isAdFilled, setIsAdFilled] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (config.adProvider === 'custom') {
      setIsAdFilled(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const checkFilled = () => {
      const ins = container.querySelector('ins.adsbygoogle');
      if (!ins) return;

      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled') {
        setIsAdFilled(true);
        return;
      }
      if (status === 'unfilled') {
        setIsAdFilled(false);
        return;
      }

      // Check for real rendered ad iframe with affirmative height
      const iframe = container.querySelector('iframe');
      if (iframe) {
        const h = iframe.offsetHeight || parseInt(iframe.getAttribute('height') || '0', 10);
        if (h > 20) {
          setIsAdFilled(true);
          return;
        }
      }
    };

    checkFilled();

    const observer = new MutationObserver(() => {
      checkFilled();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-ad-status', 'data-adsbygoogle-status', 'style'],
    });

    const timer = setTimeout(checkFilled, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [slotType, config.adProvider]);

  const publisherId = config?.publisherId || 'ca-pub-1291898061670715';

  if (slotType === 'header-leaderboard') {
    return (
      <div
        ref={containerRef}
        className={`w-full max-w-[728px] mx-auto flex flex-col items-center justify-center transition-all duration-300 ${
          isAdFilled
            ? 'my-6 sm:my-8 opacity-100 overflow-visible'
            : 'h-0 min-h-0 m-0 p-0 overflow-hidden opacity-0 pointer-events-none has-[ins[data-ad-status="filled"]]:h-auto has-[ins[data-ad-status="filled"]]:my-6 has-[ins[data-ad-status="filled"]]:sm:my-8 has-[ins[data-ad-status="filled"]]:opacity-100 has-[ins[data-ad-status="filled"]]:overflow-visible has-[ins[data-ad-status="filled"]]:pointer-events-auto'
        } ${className}`}
      >
        <div className="w-full flex items-center justify-center overflow-hidden">
          {config.adProvider === 'custom' && config.customHeaderCode ? (
            <CustomAdEmbed code={config.customHeaderCode} height={90} />
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: 0 }}
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
      <div
        ref={containerRef}
        className={`w-full max-w-[300px] mx-auto flex flex-col items-center justify-center text-center transition-all duration-300 ${
          isAdFilled
            ? 'my-4 opacity-100 overflow-visible'
            : 'h-0 min-h-0 m-0 p-0 overflow-hidden opacity-0 pointer-events-none has-[ins[data-ad-status="filled"]]:h-auto has-[ins[data-ad-status="filled"]]:my-4 has-[ins[data-ad-status="filled"]]:opacity-100 has-[ins[data-ad-status="filled"]]:overflow-visible has-[ins[data-ad-status="filled"]]:pointer-events-auto'
        } ${className}`}
      >
        <div className="w-full flex flex-col items-center justify-center text-center overflow-hidden">
          {config.adProvider === 'custom' && config.customSidebarCode ? (
            <CustomAdEmbed code={config.customSidebarCode} height={600} />
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: 0 }}
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
    <div
      ref={containerRef}
      className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center transition-all duration-300 ${
        isAdFilled
          ? 'my-6 sm:my-8 opacity-100 overflow-visible'
          : 'h-0 min-h-0 m-0 p-0 overflow-hidden opacity-0 pointer-events-none has-[ins[data-ad-status="filled"]]:h-auto has-[ins[data-ad-status="filled"]]:my-6 has-[ins[data-ad-status="filled"]]:sm:my-8 has-[ins[data-ad-status="filled"]]:opacity-100 has-[ins[data-ad-status="filled"]]:overflow-visible has-[ins[data-ad-status="filled"]]:pointer-events-auto'
      } ${className}`}
    >
      <div className="w-full flex items-center justify-center overflow-hidden">
        {config.adProvider === 'custom' && config.customPostDownloadCode ? (
          <CustomAdEmbed code={config.customPostDownloadCode} height={120} />
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: 0 }}
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
