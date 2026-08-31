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
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://filezenith.com'),
  title: 'FileZenith - 100% Free Online PDF, Image & Utility Studio',
  description: 'FileZenith is an all-in-one private online file studio. Compress PDF, edit documents, convert PNG to JPG, pics to PDF, remove background, and generate QR codes 100% privately inside your browser.',
  keywords: 'filezenith, file zenith, filezenith.com, pdf compressor, edit pdf online, merge pdf, pics to pdf, png to jpg, png to pdf, remove background, qr generator, client-side web tools',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FileZenith',
  },
  icons: {
    icon: [
      { url: '/1.png', sizes: 'any', type: 'image/png' },
      { url: '/logo.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: '/1.png',
    apple: [
      { url: '/1.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'FileZenith - 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file tool suite. Zero server file uploads. 100% Free & Secure.',
    siteName: 'FileZenith',
    type: 'website',
    images: [{ url: '/1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileZenith - 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file tool suite. Zero server file uploads.',
    images: ['/1.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

import { CloudflareAnalytics } from '@/components/CloudflareAnalytics';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { PWAInstaller } from '@/components/PWAInstaller';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FileZenith',
    alternateName: ['File Zenith', 'FileZenith PDF & Image Studio'],
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://filezenith.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://filezenith.com'}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="h-full scroll-smooth light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/70 text-slate-900 antialiased`}>
        <GoogleAdSenseScript />
        <CloudflareAnalytics />
        <AnalyticsTracker />
        <Navbar />
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
        <PWAInstaller />
        <CookieConsent />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
