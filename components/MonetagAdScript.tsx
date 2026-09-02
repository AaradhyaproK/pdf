'use client';

import Script from 'next/script';

export function MonetagAdScript() {
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

