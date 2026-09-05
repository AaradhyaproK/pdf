import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { GoogleAdSenseScript } from '@/components/GoogleAdSenseScript';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com'),
  title: {
    default: 'FileZenith — Free PDF & File Tools',
    template: '%s | FileZenith',
  },
  description: 'FileZenith is an all-in-one private online file studio. Compress PDF, edit documents, convert PNG to JPG, pics to PDF, remove background, and generate QR codes 100% privately inside your browser.',
  keywords: 'filezenith, file zenith, filezenith.com, pdf compressor, edit pdf online, merge pdf, pics to pdf, png to jpg, png to pdf, remove background, qr generator, client-side web tools',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
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
    title: 'FileZenith - 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file tool suite. Zero server file uploads. 100% Free & Secure.',
    url: 'https://www.filezenith.com',
    siteName: 'FileZenith',
    type: 'website',
    images: [{ url: '/filezenith-logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileZenith - 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file tool suite. Zero server file uploads.',
    images: ['/filezenith-logo.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

import { CloudflareAnalytics } from '@/components/CloudflareAnalytics';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { PWAInstaller } from '@/components/PWAInstaller';
import { AppSplashScreen } from '@/components/AppSplashScreen';

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
      <head>
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Search FileZenith Tools" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/70 text-slate-900 antialiased`}>
        <AppSplashScreen />
        <GoogleAdSenseScript />
        <CloudflareAnalytics />
        <AnalyticsTracker />
        <Navbar />
        <div className="flex-1 pb-24 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
        <PWAInstaller />
        <CookieConsent />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
