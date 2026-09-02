'use client';

import Script from 'next/script';

export function MonetagAdScript() {
  return (
    <>
      {/* Monetag Tag Script */}
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="275617"
        data-cfasync="false"
        async
        strategy="afterInteractive"
      />
    </>
  );
}
