import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRESET_REGISTRY } from '@/lib/presets-data';
import { ExamResizerStudio } from '@/components/tools/ExamResizerStudio';
import { AdSlot } from '@/components/AdSlot';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  FileCheck,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PRESET_REGISTRY).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = PRESET_REGISTRY[slug];

  if (!preset) return {};

  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/${slug}`;

  return {
    title: preset.title,
    description: preset.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: preset.title,
      description: preset.metaDescription,
      url: url,
      siteName: 'FileZenith',
      type: 'website',
      images: [`${siteUrl}/filezenith-logo.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: preset.title,
      description: preset.metaDescription,
      images: [`${siteUrl}/filezenith-logo.png`],
    },
  };
}

export default async function ToolPresetPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = PRESET_REGISTRY[slug];

  if (!preset) {
    notFound();
  }

  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/${slug}`;

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: preset.h1,
    url: url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas support.',
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${siteUrl}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: preset.portalName,
        item: url,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preset.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 text-slate-900">
      {/* Inject JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Tools</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold">{preset.portalName}</span>
        </nav>

        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>100% Client-Side Private Tool</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {preset.h1}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            {preset.shortDescription} {preset.longDescription}
          </p>
        </div>

        {/* Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

        {/* Interactive Studio Component */}
        <ExamResizerStudio {...preset} />

        {/* How to Use Section */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              How to Use {preset.portalName} Resizer
            </h2>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
            {preset.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Official Portal Guidelines & Verification Disclaimer */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Official Requirements: {preset.portalName}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {preset.officialGuidelines}
          </p>

          <ul className="space-y-2 text-xs font-bold text-slate-700">
            {preset.requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>

          {/* Official Verification Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="uppercase text-[10px] font-black">Official Verification Disclaimer</span>
            </div>
            <p className="text-amber-800/90 font-medium">
              Always verify the latest requirements on the official application website before submission. Last verified: <strong className="font-extrabold">{preset.lastVerifiedDate}</strong>.
            </p>
          </div>
        </section>

        {/* Pro Tips Section */}
        {preset.tips && preset.tips.length > 0 && (
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Tips for Best Results
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-700">
              {preset.tips.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Collapsible FAQ Section */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {preset.faq.map((item, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-2xl p-4 cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
              >
                <summary className="font-extrabold text-xs sm:text-sm text-slate-900 flex justify-between items-center select-none">
                  <span>{item.question}</span>
                  <span className="text-indigo-600 font-bold group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-200/60">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Tools Grid System */}
        {preset.relatedTools && preset.relatedTools.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Related Exam Image Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {preset.relatedTools.map((rel, idx) => (
                <Link
                  key={idx}
                  href={rel.slug}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{rel.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug">
                      {rel.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                    Use Tool →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
