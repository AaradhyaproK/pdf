import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { Toaster } from 'sonner';
import { ADSENSE_PUBLISHER_ID } from '@/lib/ads-config';
import { CONSENT_DEFAULT_SNIPPET } from '@/lib/consent';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const GA4_MEASUREMENT_ID = 'G-J7BLZG6H57';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com'),
  title: {
    default: 'FileZenith — Free PDF, Image & Online Utility Tools',
    template: '%s | FileZenith',
  },
  description: 'FileZenith is an all-in-one private online file studio. Compress PDF, edit documents, convert PNG to JPG, pics to PDF, remove background, and generate QR codes 100% privately inside your browser.',
  keywords: 'filezenith, file zenith, filezenith.com, pdf compressor, edit pdf online, merge pdf, pics to pdf, png to jpg, png to pdf, remove background, qr generator, client-side web tools, compress pdf to 200kb, ssc photo resizer, signature resizer',
  authors: [{ name: 'Aaradhya Pathak', url: 'https://www.filezenith.com/about' }],
  creator: 'Aaradhya Pathak',
  publisher: 'Snab Innovations',
  category: 'technology',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    types: {
      'application/opensearchdescription+xml': [
        { url: '/opensearch.xml', title: 'FileZenith Tools' },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FileZenith',
  },
  icons: {
    icon: [
      { url: '/filezenith-logo.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: '/filezenith-logo.png',
    apple: [
      { url: '/filezenith-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'FileZenith — 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file studio with 100+ tools. Compress PDF, convert images, resize exam photos, and calculate EMI/SIP/GST — 100% free, zero server upload.',
    url: 'https://www.filezenith.com',
    siteName: 'FileZenith',
    images: [
      {
        url: 'https://www.filezenith.com/filezenith-og.png',
        width: 1200,
        height: 630,
        alt: 'FileZenith — Free PDF and Image Tools',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileZenith — 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file studio. 100+ tools. Zero server upload.',
    images: ['https://www.filezenith.com/filezenith-og.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'google-adsense-account': ADSENSE_PUBLISHER_ID,
  },
};

import { CloudflareAnalytics } from '@/components/CloudflareAnalytics';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { PWAInstaller } from '@/components/PWAInstaller';
import { AppSplashScreen } from '@/components/AppSplashScreen';
import { NavigationProgressBar } from '@/components/NavigationProgressBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FileZenith',
    alternateName: ['File Zenith', 'FileZenith PDF & Image Studio'],
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/studio?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="h-full scroll-smooth light">
      {/*
        Explicit <head> so the consent default can be emitted as a real,
        synchronous inline script inside the document head.

        The ordering here is REQUIRED by Google Consent Mode v2: the
        `gtag('consent','default', ...)` call must execute *before* any Google
        tag (gtag.js / adsbygoogle.js) runs, otherwise those tags fire with
        implicit consent.

        React 19 hoists raw `<script async src=...>` elements to the very top
        of <head>, which would place them ahead of this snippet. The Google tag
        loaders therefore use `next/script` with `strategy="afterInteractive"`
        (bottom of <body>), so the Next.js runtime injects them only after the
        document has been parsed and this consent default has already run.
      */}
      <head>
        {/* 1. Consent Mode v2 defaults — MUST be the first script to run. */}
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }}
        />

        {/* 2. Resource hints for the Google origins we use. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fundingchoicesmessages.google.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* 3. Site-wide structured data. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/70 text-slate-900 antialiased`}>
        <NavigationProgressBar />
        <CloudflareAnalytics />
        <Navbar />
        <div className="flex-1 pb-24 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
        <PWAInstaller />
        <AppSplashScreen />
        <CookieConsent />
        <Toaster position="top-right" richColors />

        {/*
          4. Google AdSense loader. Present on every page so that AdSense Auto
          Ads can place units anywhere, and so Google's certified CMP
          (Funding Choices) can be served to EEA / UK / CH visitors.
        */}
        <Script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* 5. Google Analytics 4 loader + config. */}
        <Script
          id="ga4-loader"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}', {
              anonymize_ip: true,
              allow_google_signals: false,
              ads_data_redaction: true,
              send_page_view: true,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
