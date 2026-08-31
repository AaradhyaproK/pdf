import Link from 'next/link';
import Script from 'next/script';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { AdSlot } from '@/components/AdSlot';
import { LandingToolGrid } from '@/components/LandingToolGrid';
import { HomepageTrustSection } from '@/components/HomepageTrustSection';
import { HomepageFAQAccordion } from '@/components/HomepageFAQAccordion';
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
    a: 'Unlike traditional cloud tools like iLovePDF or Smallpdf that require uploading your private documents to remote cloud servers, FileZenith processes 100% of your PDFs, images, and files locally inside your browser using client-side WebAssembly technology. Your confidential files never touch external servers or the internet.',
  },
  {
    q: 'Is FileZenith really 100% free with no hidden fees or subscriptions?',
    a: "Yes! FileZenith is 100% free forever. You don't need to register an account, enter a credit card, or pay any subscription fees to access all 25+ PDF, image, and utility tools with unlimited file sizes.",
  },
  {
    q: 'Can I compress PDF files under 200KB for government job portals and college admissions?',
    a: 'Absolutely! Our specialized PDF compression tool allows students and job applicants to shrink PDF documents under 200KB or 50KB to meet strict portal requirements for government applications, passport forms, and college admissions.',
  },
  {
    q: 'Are my uploaded files or documents saved on any server?',
    a: "Never. FileZenith operates on a strict 100% Zero-Server architecture. Your files stay strictly in your computer or phone's local RAM and CPU memory during processing.",
  },
  {
    q: 'Does FileZenith work on mobile devices and tablets?',
    a: 'Yes! FileZenith is fully responsive and optimized for Android phones, iPhones, iPads, MacBooks, Windows PCs, and Linux devices using any modern web browser.',
  },
];

const JSON_LD_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FileZenith',
    url: 'https://filezenith.com',
    description: '100% Free Online iLovePDF Alternative. All PDF, Image & Utility Tools in One Place. Zero Server File Uploads.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://filezenith.com/?q={search_term_string}',
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
        <Script
          key={idx}
          id={`homepage-json-ld-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Desktop Hero Banner Section (Hidden on Mobile for App Dashboard View) */}
      <section className="hidden sm:block relative overflow-hidden pt-12 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2">
            <PrivacyBadge />
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold border border-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              100% Free Mobile & Desktop Studio
            </span>
          </div>

          {/* High-Contrast Bold Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Every tool you need to work with <span className="text-rose-600">PDFs</span> & <span className="text-sky-600">Images</span>, in one place
          </h1>

          {/* Crisp Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            100% FREE! Merge, split, compress, convert, edit, protect, and OCR your files with zero server uploads — powered by local browser WebAssembly.
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
              Zero Cloud Upload Risk
            </span>
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

      {/* Interactive Mobile-Optimized FAQ Accordion Section */}
      <HomepageFAQAccordion faqs={HOMEPAGE_FAQS} />
    </main>
  );
}

