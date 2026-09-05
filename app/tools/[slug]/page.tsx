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
  Table,
  ExternalLink,
  Info,
  Check,
  X as XIcon,
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
    keywords: preset.keywords,
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
        name: 'Govt Job Tools',
        item: `${siteUrl}/govt-job-tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: preset.portalName,
        item: url,
      },
    ],
  };

  // 3. HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to resize photo for ${preset.portalName}`,
    description: preset.shortDescription,
    step: preset.instructions.map((inst, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: inst,
    })),
  };

  // 4. FAQPage Schema
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/govt-job-tools" className="hover:text-indigo-600 transition-colors">
            Govt Job Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold truncate">{preset.portalName}</span>
        </nav>

        {/* Page Hero Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>100% Client-Side Private Tool • Zero Server Uploads</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {preset.h1}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            {preset.shortDescription} {preset.longDescription}
          </p>
        </div>

        {/* Top Header Leaderboard Ad Slot */}
        <div className="w-full">
          <AdSlot slotType="header-leaderboard" />
        </div>

        {/* 2-Column Responsive Layout (Main Studio + Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Interactive Studio Component */}
            <ExamResizerStudio {...preset} />

            {/* In-Feed Post Download Ad Slot */}
            <div className="w-full">
              <AdSlot slotType="post-download" />
            </div>

            {/* Official Portal Comparison Specs Table (Goldmine SEO) */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Indian Govt Exam Photo & Signature Specifications (2026-27)
                  </h2>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  Official Standards
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/60">
                      <th className="p-2.5 rounded-l-xl">Recruitment Portal</th>
                      <th className="p-2.5">Target Size (KB)</th>
                      <th className="p-2.5">Dimensions</th>
                      <th className="p-2.5">Name & Date?</th>
                      <th className="p-2.5 rounded-r-xl">Background</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className={slug === 'ssc-photo-resizer' ? 'bg-indigo-50/50 font-bold text-indigo-950' : ''}>
                      <td className="p-2.5">SSC (CGL, CHSL, MTS, GD)</td>
                      <td className="p-2.5 text-emerald-700 font-bold">20 KB – 50 KB</td>
                      <td className="p-2.5">3.5 × 4.5 cm (100×120 px)</td>
                      <td className="p-2.5 text-rose-700 font-bold">Yes (Mandatory)</td>
                      <td className="p-2.5">White / Light</td>
                    </tr>
                    <tr className={slug === 'upsc-photo-resizer' ? 'bg-indigo-50/50 font-bold text-indigo-950' : ''}>
                      <td className="p-2.5">UPSC Civil Services (OTR)</td>
                      <td className="p-2.5 text-emerald-700 font-bold">20 KB – 300 KB</td>
                      <td className="p-2.5">350 × 350 px (Square 1:1)</td>
                      <td className="p-2.5 text-indigo-700">Recommended</td>
                      <td className="p-2.5">White / Plain</td>
                    </tr>
                    <tr className={slug === 'signature-resizer-10-to-20kb' ? 'bg-indigo-50/50 font-bold text-indigo-950' : ''}>
                      <td className="p-2.5">Bank (IBPS, SBI, RRB) Signature</td>
                      <td className="p-2.5 text-emerald-700 font-bold">10 KB – 20 KB</td>
                      <td className="p-2.5">140 × 60 px (2:1 Ratio)</td>
                      <td className="p-2.5 text-slate-400">No</td>
                      <td className="p-2.5">Pure White Ink</td>
                    </tr>
                    <tr className={slug === 'neet-photo-resizer' ? 'bg-indigo-50/50 font-bold text-indigo-950' : ''}>
                      <td className="p-2.5">NTA NEET UG Passport & Postcard</td>
                      <td className="p-2.5 text-emerald-700 font-bold">10 KB – 200 KB</td>
                      <td className="p-2.5">Passport & 4×6 inch Postcard</td>
                      <td className="p-2.5 text-rose-700 font-bold">Yes (DOP Stamp)</td>
                      <td className="p-2.5">White Background</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Railway RRB (ALP, Tech, NTPC)</td>
                      <td className="p-2.5 text-emerald-700 font-bold">30 KB – 70 KB</td>
                      <td className="p-2.5">35 × 45 mm</td>
                      <td className="p-2.5 text-slate-400">Optional</td>
                      <td className="p-2.5">White / Plain</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* How to Use Step-by-Step */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  How to Use {preset.portalName} Resizer Online
                </h2>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                {preset.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Official Portal Guidelines & Requirements */}
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
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="uppercase text-[10px] font-black">Official Verification Disclaimer</span>
                </div>
                <p className="text-amber-800/90 font-medium">
                  Always verify the latest requirements on the official application website before final submission. Last verified: <strong className="font-extrabold">{preset.lastVerifiedDate}</strong>.
                </p>
              </div>
            </section>

            {/* Pro Tips Section */}
            {preset.tips && preset.tips.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Pro Tips to Prevent Form Rejection
                  </h2>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  {preset.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Collapsible Goldmine FAQ Section */}
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

            {/* High-Traffic Goldmine Search Keywords & Supported Portals Section */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Popular Government Exam & Sarkari Recruitment Portals
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  FileZenith’s binary-search compression engine is calibrated to the official photograph and signature submission guidelines of all major central and state government examinations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> SSC Examinations
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      SSC CGL, CHSL, MTS, CPO SI, GD Constable, Stenographer Grade C & D, Selection Posts (3.5×4.5 cm, 20–50 KB with Name & Date DOP).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> UPSC Civil Services & Defense
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      UPSC IAS, IPS, IFS, NDA, CDS, CAPF (AC), IES, and OTR One-Time Registration (350×350 px, 20–300 KB).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Banking & Insurance Portals
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      IBPS PO, IBPS Clerk, IBPS RRB Scale I/II/III, SBI PO, SBI Clerk, RBI Grade B, LIC AAO (Photo 20–50 KB, Signature 10–20 KB).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Railway RRB & Police
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      RRB NTPC, RRB Group D, RRB ALP, Technician, Delhi Police, UP Police SI, Bihar Police (30–70 KB, white background).
                    </p>
                  </div>
                </div>

                {/* Search Keywords Tags Matrix */}
                <div className="pt-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                    High Search Intent Queries:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {preset.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Related Tools Grid */}
            {preset.relatedTools && preset.relatedTools.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Related Govt Exam & ID Tools
                  </h2>
                  <Link href="/govt-job-tools" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    View All Govt Tools →
                  </Link>
                </div>
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
                        Open Tool →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Top Sticky Sidebar Ad Unit */}
            <div className="w-full">
              <AdSlot slotType="sticky-sidebar" />
            </div>

            {/* Quick Specification Cheat Sheet Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Info className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {preset.portalName} Quick Specs
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Target File Size</span>
                  <span className="font-bold text-slate-900">{preset.targetSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Minimum Limit</span>
                  <span className="font-bold text-slate-900">{preset.minimumSize || '10 KB'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Maximum Limit</span>
                  <span className="font-bold text-slate-900">{preset.maximumSize || '50 KB'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Output Dimensions</span>
                  <span className="font-bold text-slate-900">
                    {preset.fixedWidth && preset.fixedHeight
                      ? `${preset.fixedWidth} × ${preset.fixedHeight} px`
                      : preset.width || 'Official Ratio'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Name & Date Bar</span>
                  <span className="font-bold text-slate-900">
                    {preset.allowNameDate ? 'Supported' : 'Not Required'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Allowed Formats</span>
                  <span className="font-bold text-slate-900">
                    {preset.allowedFormats.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Indian Recruitment Portals Link Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Official Application Portals
              </h3>
              <div className="space-y-2 text-xs font-bold">
                <a
                  href="https://ssc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span>SSC Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://upsconline.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span>UPSC OTR Registration</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://exams.nta.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span>NTA Examination Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://myaadhaar.uidai.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span>UIDAI MyAadhaar Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* 100% In-Browser Privacy Trust Notice */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Upload</span>
              </div>
              <p className="text-[11px] font-medium text-emerald-900 leading-relaxed">
                All image compression, dimension cropping, and name stamping occur purely inside your browser memory using HTML5 Canvas. Your biometric photos never touch our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
