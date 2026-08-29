import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://omnitoolsuite.com'),
  title: 'OmniTool Suite - 100% Client-Side PDF, Image & Utility Platform',
  description: 'Compress PDF, merge documents, resize images, remove background, generate QR codes and format JSON 100% privately inside your browser without uploading files.',
  keywords: 'pdf compressor, merge pdf, resize image, remove background, qr generator, json formatter, client-side web tools',
  openGraph: {
    title: 'OmniTool Suite - 100% Client-Side PDF, Image & Utility Platform',
    description: 'All-in-one private online tool suite. Zero server file uploads.',
    siteName: 'OmniTool Suite',
    type: 'website',
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
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsent />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
