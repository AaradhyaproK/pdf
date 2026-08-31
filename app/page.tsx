import Link from 'next/link';
import Script from 'next/script';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { AdSlot } from '@/components/AdSlot';
import { LandingToolGrid } from '@/components/LandingToolGrid';
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Lock,
  Star,
  Cpu,
  Globe,
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
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              4.9/5 Star Rating
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

      {/* High-Trust Features Grid Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-12 shadow-2xs space-y-8 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-rose-100">
              Zero-Server Security Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Millions Trust FileZenith
            </h2>
            <p className="text-xs sm:text-base text-slate-600 font-medium">
              Traditional cloud tools upload your confidential PDFs to remote servers. FileZenith executes 100% of conversions directly on your local device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Your PDF and image files are processed strictly inside your device RAM. Zero file uploads or data storage guaranteed.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Instant Local Speed</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                No internet bandwidth bottlenecks or uploading delays. Large 100MB PDFs compress and convert instantly on your CPU.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Advanced AI & Wasm</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Powered by compiled WebAssembly engines including pdf-lib, qpdf-wasm, Tesseract.js OCR, and canvas background isolation.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Cross-Platform Everywhere</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Works seamlessly on iPhone, Android, Mac, Windows, and Linux. No software installation or app store download required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mb-12">
        <div className="p-5 sm:p-10 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 shadow-2xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Everything you need to know about FileZenith privacy, zero-server architecture, and limits.
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {HOMEPAGE_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200/80 space-y-1.5">
                <h3 className="text-xs sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="text-rose-600 font-black">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-5 sm:pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
