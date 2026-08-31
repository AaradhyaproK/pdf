'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getAdsConfig, GoogleAdsConfig } from '@/lib/admin-store';

const DEFAULT_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-9075710959353163';

export function GoogleAdSenseScript() {
  const [config, setConfig] = useState<GoogleAdsConfig | null>(null);

  useEffect(() => {
    setConfig(getAdsConfig());
  }, []);

  const isEnabled = config ? config.adSenseScriptEnabled : true;
  const publisherId = config?.publisherId || DEFAULT_PUB_ID;

  if (!isEnabled || !publisherId) return null;

  const pubId = publisherId.startsWith('ca-pub-')
    ? publisherId
    : `ca-pub-${publisherId}`;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

