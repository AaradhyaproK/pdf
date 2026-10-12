import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  FileCheck,
  Scale,
  Sparkles,
  Lock,
  Mail,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure & Commercial Transparency — FileZenith',
  description:
    'Read FileZenith’s affiliate disclosure. Learn how we maintain editorial independence, evaluate digital tools, and disclose commercial compensation.',
  keywords: [
    'FileZenith affiliate disclosure',
    'commercial transparency',
    'editorial independence',
    'referral compensation policy',
    'FTC disclosure',
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/affiliate-disclosure',
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
    title: 'Affiliate Disclosure & Commercial Transparency — FileZenith',
    description:
      'Transparent disclosure of affiliate relationships, evaluation standards, and editorial independence on FileZenith.',
    url: 'https://www.filezenith.com/affiliate-disclosure',
    siteName: 'FileZenith',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Disclosure & Commercial Transparency — FileZenith',
    description:
      'Transparent disclosure of affiliate relationships, evaluation standards, and editorial independence on FileZenith.',
  },
};

export default function AffiliateDisclosurePage() {
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
        name: 'Affiliate Disclosure',
        item: 'https://www.filezenith.com/affiliate-disclosure',
      },
    ],
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Affiliate Disclosure & Commercial Transparency — FileZenith',
    url: 'https://www.filezenith.com/affiliate-disclosure',
    description:
      'FileZenith affiliate disclosure statement, commercial guidelines, and editorial independence standards.',
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
          <span className="text-slate-900 font-extrabold">Affiliate Disclosure</span>
        </nav>

        {/* Header Title Section */}
        <div className="space-y-3 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-200/80">
            <Scale className="h-3.5 w-3.5 text-indigo-600" />
            <span>Trust, Ethics &amp; Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Affiliate Disclosure
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Official Policy Document &bull; Last updated: {lastUpdated} &bull; Snab Innovations
          </p>
        </div>

        {/* Core Content Canvas */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 space-y-8 shadow-2xs text-slate-700 text-sm leading-relaxed">
          {/* Core Primary Disclosure Callout */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <ShieldAlert className="h-5 w-5 text-indigo-600 shrink-0" />
              <span>Clear &amp; Conspicuous Statement</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-semibold">
              Certain outbound links on FileZenith may be affiliate or referral links. If you click on an affiliate link and subsequently purchase or register for a service, FileZenith may receive a referral commission at zero additional cost to you.
            </p>
          </div>

          {/* Section 1: Purpose of Commercial Disclosures */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">1. Purpose of Commercial Disclosures</h2>
            <p>
              FileZenith (filezenith.com), published by <strong>Snab Innovations</strong>, is dedicated to absolute transparency with our readers. This disclosure aligns with consumer protection frameworks, including the United States Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising, the UK Advertising Standards Authority (ASA), and Indian Consumer Protection (E-Commerce) Rules.
            </p>
            <p>
              Our mission is to provide 80+ fast, private, and 100% free web utilities (including PDF compression, OCR, document conversion, passport photo makers, exam photo resizers, and financial calculators). To keep these tools entirely free and accessible with zero mandatory subscriptions, we offset infrastructure, research, and development costs through contextual advertisements and select affiliate partnerships.
            </p>
          </section>

          {/* Section 2: How Affiliate Links Work */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">2. How Affiliate Links Work</h2>
            <p>
              When you click on an outbound link identified as an affiliate or partner referral link, a standard tracking cookie or parameter may be utilized by the destination platform or affiliate network (e.g., PartnerStack, Impact, CJ, or direct SaaS affiliate portals). If you choose to open an account or purchase a subscription, the provider pays FileZenith a small referral commission.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Zero Cost Surcharge</span>
                </div>
                <p className="text-slate-600 font-medium">
                  You never pay a single cent more by clicking a link on FileZenith. Pricing, discounts, and terms remain identical to or better than standard direct provider channels.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Explicit Context</span>
                </div>
                <p className="text-slate-600 font-medium">
                  Commercial relationships are openly disclosed on pages where affiliate recommendations or tool sponsorships exist.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Editorial Independence */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">3. Editorial Independence &amp; Integrity</h2>
            <p>
              Our guides, calculation explanations, and tool evaluations are created by our editorial desk and founder, Aaradhya Pathak, with strict factual rigor. Commercial partnerships never dictate our tool rankings or technical verdicts:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Objective Benchmarks:</strong> We evaluate tools based strictly on performance, security, speed, and genuine utility to students, job applicants, and professionals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Pay-for-Rank:</strong> External software vendors cannot purchase higher rankings, favorable reviews, or biased comparison scores on FileZenith.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Inclusion of Non-Affiliates:</strong> We regularly highlight, document, and build presets for government portals (SSC, UPSC, NTA, IBPS) and open-source standards with which we have zero commercial connection.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: 100% In-Browser Privacy Guarantee */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">4. Zero File Transmission &amp; Privacy Guarantee</h2>
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                <span>Zero Server Upload Architecture</span>
              </div>
              <p className="leading-relaxed font-medium">
                Affiliate partnerships and advertising scripts have zero access to your uploaded files, PDFs, photos, or calculator inputs. All document operations execute strictly in your client-side browser sandbox (WASM/RAM). Your sensitive files are never transmitted to FileZenith, Snab Innovations, or any third-party commercial partner.
              </p>
            </div>
          </section>

          {/* Section 5: Independent Verification with Providers */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">5. Independent Verification with External Providers</h2>
            <p>
              Software pricing, portal exam specifications, and statutory tax slabs evolve over time. While our editorial desk continually updates our 80+ tools and documentation, we strongly urge users to independently verify third-party pricing, terms of service, and official recruitment notifications directly on respective official government or provider portals.
            </p>
          </section>

          {/* Section 6: Corporate Contact & Feedback */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-black text-slate-900">6. Corporate Contact &amp; Questions</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              FileZenith is developed, maintained, and operated by <strong>Snab Innovations</strong>. If you have questions about our commercial relationships, wish to report an inaccurate recommendation, or need further details:
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-xs space-y-1.5 text-slate-700 font-medium">
              <div><strong>Operating Entity:</strong> Snab Innovations</div>
              <div><strong>Founder &amp; Lead Creator:</strong> Aaradhya Pathak</div>
              <div><strong>Registered Address:</strong> Nashik, Maharashtra, India (PIN: 422005)</div>
              <div>
                <strong>Official Email:</strong>{' '}
                <a href="mailto:hello@snab.co.in" className="text-indigo-600 underline font-bold hover:text-indigo-700">
                  hello@snab.co.in
                </a>
              </div>
              <div>
                <strong>Related Policies:</strong>{' '}
                <Link href="/editorial-policy" className="text-indigo-600 underline font-bold hover:text-indigo-700">
                  Editorial Policy
                </Link>
                {' '}&bull;{' '}
                <Link href="/privacy" className="text-indigo-600 underline font-bold hover:text-indigo-700">
                  Privacy Policy
                </Link>
                {' '}&bull;{' '}
                <Link href="/terms" className="text-indigo-600 underline font-bold hover:text-indigo-700">
                  Terms of Service
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
