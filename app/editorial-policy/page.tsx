import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Building2,
  Mail,
  AlertTriangle,
  Scale,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Policy & Research Standards — FileZenith',
  description:
    'Discover FileZenith’s editorial policy: our research methodology, primary sourcing standards, calculation verification, and editorial independence.',
  keywords: [
    'FileZenith editorial policy',
    'document standards research',
    'source verification guidelines',
    'editorial independence',
    'calculation verification',
    'correction policy',
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/editorial-policy',
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
  openGraph: {
    title: 'Editorial Policy & Research Standards — FileZenith',
    description:
      'How FileZenith researches, verifies, tests, and updates document tools, exam photo guidelines, and calculators.',
    url: 'https://www.filezenith.com/editorial-policy',
    siteName: 'FileZenith',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Policy & Research Standards — FileZenith',
    description:
      'Research standards, calculation testing, and editorial integrity protocols at FileZenith.',
  },
};

export default function EditorialPolicyPage() {
  const lastUpdated = 'October 2026';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.filezenith.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Editorial Policy',
        item: 'https://www.filezenith.com/editorial-policy',
      },
    ],
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Editorial Policy & Research Standards — FileZenith',
    url: 'https://www.filezenith.com/editorial-policy',
    description:
      'Official documentation of FileZenith editorial standards, source verification rules, and tool validation protocols.',
    publisher: {
      '@type': 'Organization',
      name: 'Snab Innovations',
      url: 'https://snab.co.in',
    },
  };

  return (
    <main className="min-h-screen bg-slate-50/70 pt-6 pb-24 px-3 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold">Editorial Policy</span>
        </nav>

        {/* Header Title Section */}
        <div className="space-y-3 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-200/80">
            <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
            <span>Editorial Standards &amp; E-E-A-T Framework</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Editorial Policy &amp; Standards
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Research Standards, Source Verification &amp; Technical Accuracy Protocols &bull; Published by Snab Innovations &bull; Last updated: {lastUpdated}
          </p>
        </div>

        {/* Core Content Canvas */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 space-y-8 shadow-2xs text-slate-700 text-sm leading-relaxed">
          {/* Author Byline & Core Commitment */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs">
                <UserCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-900">Authored &amp; Maintained by Aaradhya Pathak</p>
                <p className="text-[11px] text-indigo-700 font-bold">Founder &amp; Lead Full-Stack Developer &bull; Snab Innovations</p>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Because job applicants, students, accountants, and businesses rely on FileZenith to generate official passport photos, format exam signatures, calculate statutory taxes, and compress legal contracts, mathematical precision, primary sourcing, and absolute data privacy are non-negotiable.
            </p>
          </div>

          {/* Section 1: Editorial Mission */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">1. Editorial Mission &amp; Purpose</h2>
            <p>
              FileZenith (filezenith.com) is an independent client-side digital utility studio. We deliver 80+ document conversion tools, PDF manipulation tools, exam photo resizers, and financial calculators without requiring server uploads, logins, or paid subscription gates.
            </p>
            <p>
              Every tutorial, calculation preset, and guide on FileZenith is written to provide authoritative, step-by-step assistance. We strictly reject AI-generated generic filler, unverified hearsay, and uncorroborated specifications.
            </p>
          </section>

          {/* Section 2: Sourcing Standards & Official Government Documents */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">2. Primary Sourcing &amp; Regulatory Verification</h2>
            <p>
              Every preset dimension, file size restriction (e.g., 20KB, 50KB, 100KB, 200KB), and statutory financial formula is verified directly against official primary sources:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Exam Recruitment Portals</span>
                </div>
                <p className="text-slate-600 font-medium">
                  Official notification guidelines published by the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), National Testing Agency (NEET, JEE, CUET), and Institute of Banking Personnel Selection (IBPS).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Statutory Tax &amp; Finance Authorities</span>
                </div>
                <p className="text-slate-600 font-medium">
                  Official tax schedules, standard deduction updates, and slab tables published by the Central Board of Direct Taxes (CBDT), Ministry of Finance, and the Reserve Bank of India (RBI).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>ISO Document Standards</span>
                </div>
                <p className="text-slate-600 font-medium">
                  Standard ISO 32000 specifications for PDF document structures, font embedding rules, raster image downsampling parameters, and client-side WebAssembly execution engines.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Technical Validation & Calculation Testing */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">3. Mathematical Verification &amp; Tool Testing</h2>
            <p>
              Before deploying any calculation engine or image processing preset, our team conducts thorough automated and manual edge-case evaluations:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Binary Search Precision:</strong> For strict target file sizes (such as compressing photos under 20KB or 50KB for government job portals), our client-side image engine conducts an iterative binary search across WebP/JPEG quality levels to ensure output lands safely within the portal bracket (e.g. ~45KB).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Two-Way Mathematical Parity:</strong> Financial formulas (EMI amortization schedules, compound interest for SIPs, Old vs. New tax regime comparison) are verified against official government calculators to confirm 100% decimal precision without rounding drift.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Browser Memory Sandbox Testing:</strong> All tools are validated across mobile Chrome, iOS Safari, desktop Firefox, and Edge to confirm 0-byte server transmission.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Routine Updates & Revision Protocol */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">4. Update Cycles &amp; Notification Tracking</h2>
            <p>
              Exam notification rules, format requirements, and fiscal tax slabs change over time. We maintain an active monitoring protocol:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                <RefreshCw className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Recruitment Cycle Audits:</strong> Whenever annual recruitment notifications are issued by SSC, UPSC, NTA, or State PSCs, our preset dimensions (e.g. 3.5cm x 4.5cm, 20-50KB) are audited immediately for changes.
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                <RefreshCw className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Annual Union Budget Reviews:</strong> Income Tax regime slabs, surcharge thresholds, and rebate amendments are updated every fiscal year upon official government gazette publication.
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                <RefreshCw className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Transparent Revision Dates:</strong> Every article and guide contains clear published and modified timestamps so users can evaluate currency.
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Editorial Independence & Advertising */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">5. Editorial Independence &amp; Commercial Separation</h2>
            <p>
              FileZenith enforces strict firewalls between editorial content and advertising partnerships:
            </p>
            <p>
              Advertisers and affiliate networks have zero influence over which tools we develop, how our algorithms compress files, or what recommendations our educational guides provide. We do not accept sponsored content that requires positive ratings or restricts critical evaluation.
            </p>
            <p>
              For further commercial information, please read our{' '}
              <Link href="/affiliate-disclosure" className="text-indigo-600 font-bold underline hover:text-indigo-700">
                Affiliate Disclosure
              </Link>.
            </p>
          </section>

          {/* Section 6: Professional Advice Disclaimer & Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">6. Professional Advice Disclaimer &amp; Contact</h2>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-2 text-xs text-amber-950 font-medium">
              <div className="font-black flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Notice on Financial, Legal &amp; Examination Decisions</span>
              </div>
              <p>
                Calculations and tutorials provided on FileZenith are intended for general utility and educational guidance. While our formulas are rigorously verified, they do not constitute formal financial, chartered accountancy, or legal advice. Users must always consult their official recruitment notification or licensed tax professional for high-stakes applications.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-xs space-y-1.5 text-slate-700 font-medium pt-4 mt-4">
              <div><strong>Publishing Entity:</strong> Snab Innovations</div>
              <div><strong>Lead Developer:</strong> Aaradhya Pathak</div>
              <div><strong>Corporate Address:</strong> Nashik, Maharashtra, India (PIN: 422005)</div>
              <div>
                <strong>Editorial Contact &amp; Corrections:</strong>{' '}
                <a href="mailto:hello@snab.co.in" className="text-indigo-600 underline font-bold hover:text-indigo-700">
                  hello@snab.co.in
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
