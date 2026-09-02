'use client';

import Script from 'next/script';

export function MonetagAdScript() {
  return (
    <>
      {/* Monetag Main Tag Script */}
      <Script
        src="https://5gvci.com/act/files/tag.min.js"
        data-zone="11707483"
        strategy="afterInteractive"
      />
    </>
  );
}
