'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getAdsConfig, GoogleAdsConfig } from '@/lib/admin-store';

export function GoogleAdSenseScript() {
  const [config, setConfig] = useState<GoogleAdsConfig | null>(null);

  useEffect(() => {
    setConfig(getAdsConfig());
  }, []);

  if (!config || !config.adSenseScriptEnabled || !config.publisherId) return null;

  const pubId = config.publisherId.startsWith('ca-pub-')
    ? config.publisherId
    : `ca-pub-${config.publisherId}`;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
