import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { GoogleAdSenseScript } from '@/components/GoogleAdSenseScript';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aurea.co.in'),
  title: 'Aurea - 100% Client-Side PDF, Image & Social Downloader Studio',
  description: 'Compress PDF, merge documents, resize images, remove background, download YouTube & Instagram videos, generate QR codes 100% privately inside your browser.',
  keywords: 'aurea, pdf compressor, merge pdf, resize image, remove background, youtube downloader, instagram reels downloader, qr generator, client-side web tools',
  icons: {
    icon: '/1.png',
    shortcut: '/1.png',
    apple: '/1.png',
  },
  openGraph: {
    title: 'Aurea - 100% Client-Side PDF, Image & Social Studio',
    description: 'All-in-one private online tool suite. Zero server file uploads.',
    siteName: 'Aurea',
    type: 'website',
    images: [{ url: '/1.png' }],
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
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
