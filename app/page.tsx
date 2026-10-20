import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { AdSlot } from '@/components/AdSlot';
import { LandingToolGrid } from '@/components/LandingToolGrid';
import { HomepageTrustSection } from '@/components/HomepageTrustSection';
import { HomepageFAQAccordion } from '@/components/HomepageFAQAccordion';
import { HomepageBlogSection } from '@/components/HomepageBlogSection';
import { HomepageGuidesCluster } from '@/components/HomepageGuidesCluster';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  Star,
  Sparkles,
} from 'lucide-react';

const HOMEPAGE_FAQS = [
  {
    q: 'How is FileZenith different from online tools like iLovePDF or Smallpdf?',
    a: 'Unlike traditional cloud tools like iLovePDF or Smallpdf that require uploading your private documents to remote cloud servers, your PDF is processed directly in your browser, helping keep your document processing private. Your confidential files never touch external servers or leave your device.',
  },
  {
    q: 'Is FileZenith really 100% free with no hidden fees or subscriptions?',
    a: "Yes! FileZenith is 100% free forever. You don't need to register an account, enter a credit card, or pay any subscription fees to access all 80+ PDF, image, and utility tools with unlimited file sizes.",
  },
  {
    q: 'Can I compress PDF files under 200KB for government job portals and college admissions?',
    a: 'Absolutely! Our specialized PDF compression tool allows students and job applicants to shrink PDF documents under 200KB or 50KB to meet strict portal requirements for government applications, passport forms, and college admissions.',
  },
  {
    q: 'Are my uploaded files or documents saved on any server?',
    a: "Never. FileZenith operates on a strict 100% Zero-Server architecture. Your PDF is processed directly in your browser, helping keep your document processing private.",
  },
  {
    q: 'Does FileZenith work on mobile devices and tablets?',
    a: 'Yes! FileZenith is fully responsive and optimized for Android phones, iPhones, iPads, MacBooks, Windows PCs, and Linux devices using any modern web browser.',
  },
];

export const metadata: Metadata = {
  title: 'FileZenith — 100% Free Online PDF, Image & Utility Studio',
  description: 'All-in-one private online file studio with 80+ tools. Compress PDF, convert images, resize exam photos, and calculate EMI/SIP/GST — 100% free, zero server upload.',
  alternates: {
    canonical: 'https://www.filezenith.com/',
  },
  openGraph: {
    title: 'FileZenith — 100% Free Online PDF, Image & Utility Studio',
    description: 'All-in-one private online file studio with 80+ tools. Compress PDF, convert images, resize exam photos, and calculate EMI/SIP/GST — 100% free, zero server upload.',
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
    description: 'All-in-one private online file studio. 80+ tools. Zero server upload.',
    images: ['https://www.filezenith.com/filezenith-og.png'],
  },
};

const JSON_LD_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FileZenith',
    url: 'https://www.filezenith.com',
    description: '100% Free Online iLovePDF Alternative. All PDF, Image & Utility Tools in One Place. Zero Server File Uploads.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.filezenith.com/studio?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FileZenith Online PDF & Image Studio',
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: 'BusinessApplication',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '58420',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/70">
      {/* Inject Structured Data Schemas */}
      {JSON_LD_SCHEMAS.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Authority Hero Banner Section (Visible on Mobile & Desktop for SEO & User Trust) */}
      <section className="block relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-slate-50">
        {/* 3D Floating Ecosystem Background Artwork */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/bging.webp"
            alt="FileZenith In-Browser File Studio"
            className="w-full h-full object-cover object-center scale-[1.02] transform-gpu"
          />
          {/* Precision Center-Vignette: Keeps center text razor-sharp while showcasing colorful 3D file icons on flanks */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.75)_0%,_rgba(255,255,255,0.40)_50%,_rgba(255,255,255,0.15)_100%)]" />
          {/* Seamless bottom fade transition into the page canvas */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/50 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <PrivacyBadge />
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold border border-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              100% Free Mobile & Desktop Studio
            </span>
            <a
              href="https://www.producthunt.com/products/filezenith/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-filezenith"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black border border-amber-200 transition-all hover:scale-105 shadow-2xs"
            >
              <span className="text-orange-600 font-black">★</span>
              <span>Review us on Product Hunt</span>
            </a>
          </div>

          {/* High-Contrast Bold Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Every tool you need to work with <span className="text-rose-600">PDFs</span> & <span className="text-sky-600">Images</span>, in one place
          </h1>

          {/* Crisp Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            100% FREE! Merge, split, compress, convert, edit, protect, and OCR your files. Your PDF is processed directly in your browser, helping keep your document processing private.
          </p>

          {/* Trust Badges Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Free • Unlimited Usage
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
              <Lock className="w-4 h-4 text-indigo-600" />
              No Sign-Up Required
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Private In-Browser Processing
            </span>
          </div>

          {/* Official Product Hunt Embed Badge */}
          <div className="pt-3 flex items-center justify-center">
            <a
              href="https://www.producthunt.com/products/filezenith/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-filezenith"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-95 transition-all hover:scale-105"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1336391&theme=light"
                alt="FileZenith - 100% private in-browser PDF, image & document studio | Product Hunt"
                style={{ width: '250px', height: '54px' }}
                width={250}
                height={54}
                className="w-[230px] sm:w-[250px] h-[50px] sm:h-[54px] rounded-xl shadow-xs"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Leaderboard Ad Slot */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-6">
        <AdSlot slotType="header-leaderboard" />
      </div>

      {/* All Tools Showcase Section with Search & Category Filters (Immediate Focus on Mobile) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6">
        <LandingToolGrid />
      </section>

      {/* Mobile App-Centric High-Trust Features Grid Section */}
      <HomepageTrustSection />

      {/* Guides & Knowledge Base Cluster Section */}
      <HomepageGuidesCluster />

      {/* Latest Blog & Guides Showcase Section */}
      <HomepageBlogSection />

      {/* Interactive Mobile-Optimized FAQ Accordion Section */}
      <HomepageFAQAccordion faqs={HOMEPAGE_FAQS} />
    </main>
  );
}
