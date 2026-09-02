'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getAdsConfig } from '@/lib/admin-store';

export function MonetagAdScript() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const config = getAdsConfig();
    if (config && config.monetagEnabled === false) {
      setEnabled(false);
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Monetag Banner Ad Script */}
      <Script
        id="monetag-banner-ad"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='11707828',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }}
      />
    </>
  );
}
