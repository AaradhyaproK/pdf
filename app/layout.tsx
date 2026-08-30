import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { GoogleAdSenseScript } from '@/components/GoogleAdSenseScript';
import { PWAInstaller } from '@/components/PWAInstaller';
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
  keywords: 'filezenith, file zenith, pdf compressor, edit pdf online, merge pdf, pics to pdf, png to jpg, png to pdf, remove background, qr generator, client-side web tools',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FileZenith',
  },
  icons: {
    icon: '/1.png',
    shortcut: '/1.png',
    apple: '/1.png',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth light">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/70 text-slate-900 antialiased`}>
        <GoogleAdSenseScript />
        <AnalyticsTracker />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsent />
        <PWAInstaller />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
