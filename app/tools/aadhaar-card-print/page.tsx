import { Metadata } from 'next';
import Link from 'next/link';
import { AadhaarPrintStudio } from '@/components/tools/AadhaarPrintStudio';
import { AdSlot } from '@/components/AdSlot';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Printer,
  FileCheck,
  HelpCircle,
  Scissors,
  CreditCard,
  Lock,
  Table,
  Layers,
  FileText,
  Info,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { TOOL_DEEP_DIVES } from '@/lib/tool-deep-dives';

export const metadata: Metadata = {
  title: 'Aadhaar Card Print Tool Online (e-Aadhaar to A4 & PVC Card) | FileZenith',
  description:
    'Crop and print e-Aadhaar PDF or scanned card on A4 paper and PVC card (exact 85.6x54 mm). 100% private in-browser decryption, zero server uploads, 1-click print-ready PDF for cyber cafes.',
  keywords: [
    'aadhaar card print tool',
    'eaadhaar to pvc card print',
    'aadhaar card crop and print a4',
    'aadhaar card print online',
    'aadhaar card exact size 85.6x54 mm',
    'print eaadhaar pdf without password',
    'aadhaar card print action file photoshop alternative',
    'print aadhaar card front and back on single page',
    'aadhaar card lamination size 65x95',
    'eaadhaar pdf password format',
    'aadhaar card a4 size print cyber cafe',
    'print pvc aadhaar card at home',
    'sarkari aadhaar card print tool',
    'crop aadhaar card front and back online',
    'print 5 copies of aadhaar card on a4 paper',
    'eaadhaar to a4 sheet instant print',
    'aadhaar card size in cm for print',
    'uidai eaadhaar print ready pdf'
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/tools/aadhaar-card-print',
  },
  openGraph: {
    title: 'Aadhaar Card Print Tool Online (e-Aadhaar to A4 & PVC Card) | FileZenith',
    description:
      'Crop and print e-Aadhaar PDF or scanned card on A4 paper and PVC card. 100% private in-browser decryption, zero server uploads.',
    url: 'https://www.filezenith.com/tools/aadhaar-card-print',
    siteName: 'FileZenith',
    type: 'website',
    images: [
      {
        url: 'https://www.filezenith.com/api/og?title=Aadhaar%20Card%20Print%20Tool&category=ID%20Card%20Studio&desc=Crop%20and%20print%20e-Aadhaar%20PDF%20on%20A4%20and%20PVC%20card%20(85.6x54mm).%20100%25%20private%20in-browser.',
        width: 1200,
        height: 630,
        alt: 'Aadhaar Card Print Tool Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aadhaar Card Print Tool Online (e-Aadhaar to A4 & PVC Card) | FileZenith',
    description:
      'Crop and print e-Aadhaar PDF or scanned card on A4 paper and PVC card (exact 85.6x54 mm). 100% client-side privacy.',
    images: ['https://www.filezenith.com/api/og?title=Aadhaar%20Card%20Print%20Tool&category=ID%20Card%20Studio&desc=Crop%20and%20print%20e-Aadhaar%20PDF%20on%20A4%20and%20PVC%20card%20(85.6x54mm).%20100%25%20private%20in-browser.'],
  },
};

export default function AadhaarCardPrintPage() {
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/aadhaar-card-print`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Aadhaar Card Print Tool',
    url: url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'INR',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas support.',
  };

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
        name: 'Aadhaar Card Print Tool',
        item: url,
      },
    ],
  };

  const aadhaarDeepDive = TOOL_DEEP_DIVES['/tools/aadhaar-card-print'];
  const aadhaarFaqs = aadhaarDeepDive?.faqs || [];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aadhaarFaqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 text-slate-900">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs font-bold text-slate-500 gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/govt-job-tools" className="hover:text-indigo-600 transition-colors">
            Govt Job Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold truncate">Aadhaar Card Print Tool</span>
        </nav>

        {/* Hero Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cyber Cafe & CSC Print Ready • Exact ISO ID-1 Standard</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Aadhaar Card Print Tool (e-Aadhaar to A4 & PVC Card)
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
            Unlock e-Aadhaar PDF, crop front & back cards, and format onto standard A4 paper or PVC card with exact ISO 85.6 × 54.0 mm dimensions. 100% private in-browser processing.
          </p>
        </header>

        {/* Top Header Leaderboard Ad Slot */}
        <div className="w-full">
          <AdSlot slotType="header-leaderboard" />
        </div>

        {/* 2-Column Responsive Layout (Main Studio + Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Studio Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Aadhaar Print Studio Component */}
            <AadhaarPrintStudio />

            {/* In-Feed Post-Download Ad Unit (Strictly >= 25px clear margin to prevent accidental clicks) */}
            <div className="w-full pt-4 sm:pt-6">
              <AdSlot slotType="post-download" />
            </div>

            {/* Standard ID-1 Physical Dimensions Table */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-rose-600" />
                  Standard Aadhaar Card Dimensions & Printing Specifications
                </h2>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                  ISO/IEC 7810 ID-1
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-extrabold text-slate-500 uppercase tracking-wider">Card Width</span>
                  <p className="text-lg font-black text-slate-900">85.60 mm (3.37 in)</p>
                  <p className="text-slate-500">Standard wallet card size matching bank debit & credit cards.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-extrabold text-slate-500 uppercase tracking-wider">Card Height</span>
                  <p className="text-lg font-black text-slate-900">53.98 mm (2.125 in)</p>
                  <p className="text-slate-500">Exact physical size for standard 65×95mm lamination film pouches.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-extrabold text-slate-500 uppercase tracking-wider">Resolution</span>
                  <p className="text-lg font-black text-slate-900">300 DPI High-Res</p>
                  <p className="text-slate-500">Crystal sharp QR codes, biometric photo portrait, and address text.</p>
                </div>
              </div>

              {/* Paper & Compatibility Guide */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Paper Types & Printer Compatibility
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" /> A4 Bond (75-80 GSM)
                    </span>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Best for document submission, self-attested photocopies, and office verifications.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-rose-600" /> Glossy Photo (200+ GSM)
                    </span>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Ideal for wallet card lamination. Fold front & back and slip into standard pouch.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> PVC Card Tray (CR80)
                    </span>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      For dedicated Epson / Canon inkjet ID card trays (L805, G570, etc.).
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Step Guide */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  How to Format and Print Your Aadhaar Card in 3 Steps
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-xs font-medium text-slate-700 leading-relaxed">
                  <li>
                    <strong>Upload Document:</strong> Select your downloaded e-Aadhaar PDF or upload scanned photos of the front and back of your card.
                  </li>
                  <li>
                    <strong>Unlock if Password Protected:</strong> Enter the first 4 letters of your name in CAPITAL followed by your birth year (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">ANIL1995</code>).
                  </li>
                  <li>
                    <strong>Choose Sheet & Print:</strong> Select your preferred paper layout (A4 Sheet, 4×6 Photo Paper, or PVC) and click <em>Print Now</em> or <em>Download Print-Ready PDF</em>.
                  </li>
                </ol>
              </div>
            </section>

            {/* Privacy Guarantee Card */}
            <section className="bg-emerald-50/70 border border-emerald-200 p-6 sm:p-8 rounded-3xl space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <h3 className="text-base font-black text-emerald-950">
                  100% Client-Side Privacy Guarantee for Indian Citizens
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                We value your privacy and UIDAI compliance. FileZenith does not transmit, store, or log your Aadhaar numbers, demographic data, or PDF passwords. All image decoding and PDF rendering take place in sandbox memory directly inside your web browser.
              </p>
            </section>

            {/* Comprehensive In-Depth Editorial Guide (800+ Words for Superior SEO & E-E-A-T) */}
            {TOOL_DEEP_DIVES['/tools/aadhaar-card-print'] && (() => {
              const deepDive = TOOL_DEEP_DIVES['/tools/aadhaar-card-print'];
              return (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700">
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-black uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>{deepDive.badge}</span>
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                      {deepDive.heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      {deepDive.subheading}
                    </p>
                  </div>

                  <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-medium">
                    {deepDive.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-2.5">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </span>
                          <span>{sec.title}</span>
                        </h3>
                        {sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-slate-600 leading-relaxed">
                            {p}
                          </p>
                        ))}
                        {sec.bullets && sec.bullets.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                            {sec.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Frequently Asked Questions */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <HelpCircle className="w-5 h-5 text-rose-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-3">
                {faqSchema.mainEntity.map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-200 rounded-2xl p-4 cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
                  >
                    <summary className="font-extrabold text-xs sm:text-sm text-slate-900 flex justify-between items-center select-none">
                      <span>{item.name}</span>
                      <span className="text-rose-600 font-bold group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-200/60">
                      {item.acceptedAnswer.text}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* High-Traffic Goldmine Search Keywords & Printing Guide Section */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Popular e-Aadhaar Print & PVC Card Search Queries
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  FileZenith’s Aadhaar print studio replaces complex Photoshop actions and manual Microsoft Word cropping for cyber cafes, CSC digital seva kendras, and citizens across India:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> Standard Lamination Sheet
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Pre-aligned Front and Back cards with cutting guidelines ready for standard 65×95 mm (125 to 250 micron) hot thermal lamination pouches.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> Direct PVC Card Trays (CR80)
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Formatted to exact physical dimensions (85.60 mm × 53.98 mm) for Epson L805, Canon G570, and PVC tray printers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> Cyber Cafe Batch Printing
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Print 5 duplicate cards on a single A4 photo sheet to maximize paper economy and reduce per-card printing costs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> 100% In-Browser Privacy
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Zero server uploads. Your e-Aadhaar PDF password, Aadhaar number, and biometric data never leave your browser memory.
                    </p>
                  </div>
                </div>

                {/* Search Keywords Tags Matrix */}
                <div className="pt-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                    High Search Volume Queries:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'e-Aadhaar Card Print Online',
                      'e-Aadhaar to PVC Card Converter',
                      'Aadhaar Card Size in mm (85.6 x 54.0 mm)',
                      'Aadhaar Card Size in cm (8.56 x 5.398 cm)',
                      'Print e-Aadhaar Front & Back on Single A4',
                      'Cyber Cafe Aadhaar Photoshop Action Alternative',
                      'Unlock e-Aadhaar PDF Password Online',
                      'Aadhaar Card Lamination Size 65x95 mm',
                      '5 Copies Aadhaar Batch Sheet on A4',
                      'Crop Aadhaar Card Online Free',
                      'UIDAI Compliant e-Aadhaar Card Printer',
                      'How to Print e-Aadhaar on Photo Paper',
                      'Aadhaar Card Print Ready PDF',
                      'e-Aadhaar PDF Password Format ANIL1995',
                      'Print PVC Aadhaar Card at Home',
                      'Sarkari Aadhaar Card Print Tool Free',
                      'Epson Canon Inkjet Aadhaar Print Scaling 100%',
                    ].map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-bold text-slate-600 hover:text-rose-600 transition-colors"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Related Tools Section */}
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Related Govt Exam & Utility Tools
                </h2>
                <Link href="/govt-job-tools" className="text-xs font-bold text-rose-600 hover:text-rose-700">
                  View All Govt Tools →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: 'SSC Photo Resizer',
                    slug: '/tools/ssc-photo-resizer',
                    desc: 'Format SSC photo 20-50KB with Name & Date.',
                  },
                  {
                    name: 'Signature Resizer 10 to 20KB',
                    slug: '/tools/signature-resizer-10-to-20kb',
                    desc: 'Clean signature scan with Magic B&W cleanup.',
                  },
                  {
                    name: 'UPSC Photo Resizer',
                    slug: '/tools/upsc-photo-resizer',
                    desc: '350x350 px square photo for UPSC OTR registration.',
                  },
                ].map((rel, idx) => (
                  <Link
                    key={idx}
                    href={rel.slug}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-500 shadow-xs hover:shadow-md transition-all group space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-rose-600 transition-colors flex items-center justify-between">
                        <span>{rel.name}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug">
                        {rel.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider">
                      Open Tool →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Sticky Sidebar Ad Unit */}
            <div className="w-full">
              <AdSlot slotType="sticky-sidebar" />
            </div>

            {/* Quick ID-1 Specification Cheat Sheet */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Info className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  ID-1 Print Cheat Sheet
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Standard Card Width</span>
                  <span className="font-bold text-slate-900">85.60 mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Standard Card Height</span>
                  <span className="font-bold text-slate-900">53.98 mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Print Resolution</span>
                  <span className="font-bold text-slate-900">300 DPI Vector</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Printer Scaling</span>
                  <span className="font-black text-rose-600">100% (Actual Size)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Lamination Pouch</span>
                  <span className="font-bold text-slate-900">65 × 95 mm (125 Mic)</span>
                </div>
              </div>
            </div>

            {/* Cyber Cafe Quick Steps Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Cyber Cafe Tips
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Choose <strong>5 Copies Batch</strong> on A4 to minimize paper wastage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Use scissors guide border for clean, straight rotary paper cutting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Set printer quality to <strong>High / Photo Quality</strong> for crisp QR scanning.</span>
                </li>
              </ul>
            </div>

            {/* 100% In-Browser Privacy Trust Notice */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Upload</span>
              </div>
              <p className="text-[11px] font-medium text-emerald-900 leading-relaxed">
                All decryption, card auto-cropping, and high-res layout generation occur strictly within your browser. FileZenith does not upload, store, or log Aadhaar numbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
