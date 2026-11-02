import { Metadata } from 'next';
import Link from 'next/link';
import { HtmlToPdfStudio } from '@/components/tools/HtmlToPdfStudio';
import { AdSlot } from '@/components/AdSlot';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Printer,
  FileCheck,
  HelpCircle,
  FileCode,
  Lock,
  Table,
  Layers,
  FileText,
  Info,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Code2,
  Globe,
  Sliders,
  Check,
  X as XIcon,
  Download,
  Award,
  Link2,
  Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'HTML & URL to PDF Converter — Convert Webpage Link, Code & File [Free, No Watermark] | FileZenith',
  description:
    'Convert any webpage URL link, raw HTML code, or .html file into crisp A4/Letter vector PDF documents. 1-click web link fetcher, live split-screen paper preview, custom margins, CSS backgrounds, and starter templates. 100% free, private in-browser, no watermarks.',
  keywords: [
    'url to pdf converter',
    'convert url to pdf online free',
    'webpage to pdf converter',
    'website to pdf converter free',
    'save webpage as pdf',
    'convert link to pdf',
    'web link to pdf converter',
    'html to pdf',
    'html to pdf converter',
    'convert html to pdf online free',
    'html code to pdf',
    'save html as pdf',
    'html to pdf converter free without watermark',
    'raw html to pdf with css',
    'convert html file to pdf',
    'url to pdf a4 size',
    'fetch url to pdf online',
    'website link to pdf converter no watermark',
    'invoice html to pdf free',
    'convert htm to pdf free online',
    'html to pdf with background graphics',
    'export html table to pdf',
    'html to pdf multi page breaks',
    'convert article url to pdf',
    'free html to pdf without signup',
    'html to pdf vector text',
    'developer html to pdf tool',
    'best url to pdf converter online 2026',
    'html resume to pdf converter',
    'html receipt to pdf free'
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/tools/html-to-pdf',
  },
  openGraph: {
    title: 'HTML & URL to PDF Converter — Convert Webpage Link, Code & File [Free, No Watermark] | FileZenith',
    description:
      'Convert live website URLs, raw HTML code, or local .html files into professional vector PDFs directly in your browser. Complete styling control, zero server uploads, 100% free.',
    url: 'https://www.filezenith.com/tools/html-to-pdf',
    siteName: 'FileZenith',
    type: 'website',
    images: [
      {
        url: 'https://www.filezenith.com/api/og?title=HTML%20%26%20URL%20to%20PDF%20Converter&category=Developer%20%26%20Office%20Tools&desc=Convert%20webpage%20URLs%2C%20HTML%20code%20and%20files%20into%20crisp%20vector%20PDFs.%20100%25%20private%20in-browser%20processing.&badge=Instant%20%26%20No%20Watermark',
        width: 1200,
        height: 630,
        alt: 'HTML and URL to PDF Converter Online Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML & URL to PDF Converter — Free & 100% Private | FileZenith',
    description:
      'Convert website links, HTML code, and files into crisp vector PDFs directly in your browser. 100% private, zero server uploads.',
    images: ['https://www.filezenith.com/api/og?title=HTML%20%26%20URL%20to%20PDF%20Converter&category=Developer%20%26%20Office%20Tools&desc=Convert%20webpage%20URLs%2C%20HTML%20code%20and%20files%20into%20crisp%20vector%20PDFs.&badge=100%25%20Free%20%26%20Private'],
  },
};

const HTML_TO_PDF_FAQS = [
  {
    question: 'How do I convert a webpage URL link to PDF for free?',
    answer:
      'Click the "Fetch from URL" tab, paste any website or article address (e.g., https://example.com/invoice), and click "Fetch & Convert". Our engine fetches the live webpage HTML, automatically injects base paths so images and styles resolve cleanly, and displays an instant A4 paper sheet preview ready for 1-click PDF download.'
  },
  {
    question: 'How do I convert raw HTML code or an .html file to PDF?',
    answer:
      'Simply paste your HTML and CSS markup directly into the "Code Editor" tab, or drag and drop your .html/.htm file into the "Upload .HTML" tab. Review your live document in the real-time paper preview on the right, customize your page format (A4, Letter, Legal) and margins, and click "Download PDF" or "Vector Print".'
  },
  {
    question: 'Are my private invoices, company reports, or URL contents saved on any server?',
    answer:
      'Never. FileZenith operates entirely on 100% client-side zero-knowledge architecture. All code parsing, live rendering, style computation, and PDF compilation take place locally inside your device’s web browser memory. Your documents and sensitive data are never stored, logged, or shared across external databases.'
  },
  {
    question: 'How do I ensure background colors, table headers, and CSS gradients print in the PDF?',
    answer:
      'Our studio automatically enables "-webkit-print-color-adjust: exact" and "print-color-adjust: exact" in the print stylesheet. You can also toggle the "CSS Backgrounds" switch in the toolbar to ensure your custom background colors, button fills, and colored table headers print with 100% visual vibrancy.'
  },
  {
    question: 'How do I add page breaks to prevent tables or cards from getting cut midway?',
    answer:
      'Click the "+ Page Break" button in the toolbar or insert: <div style="page-break-after: always; break-after: page;"></div>. In addition, you can prevent tables, cards, or signatures from splitting awkwardly across pages by adding style="page-break-inside: avoid; break-inside: avoid;" to the container element.'
  },
  {
    question: 'Can I convert HTML and URLs to different paper sizes like A4, US Letter, or Legal?',
    answer:
      'Yes. Our studio lets you choose from standard international formats including A4 (210 × 297 mm), US Letter (8.5 × 11 in), Legal (8.5 × 14 in), A3 (large poster/ledger), and A5 (booklet). You can also toggle between Portrait and Landscape orientations instantly.'
  },
  {
    question: 'Why is Vector Print better than image-based PDF converters?',
    answer:
      'Many cloud converters rasterize your webpage into low-resolution images, resulting in blurry text when zoomed and unsearchable documents. FileZenith provides both an instant raster/vector download and a native Vector Print engine that preserves 100% sharp vector typography, selectable text for copying, and clickable hyperlinks.'
  }
];

export default function HtmlToPdfPage() {
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/html-to-pdf`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HTML & URL to PDF Converter Studio',
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All (Web Browser)',
    description:
      'Free client-side HTML and Webpage URL to PDF converter. Convert live website links, HTML files, web code, and CSS into crisp vector A4 and Letter PDF documents with zero server uploads.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '4120',
    },
    featureList: [
      'Fetch and convert live website URLs into PDF',
      '100% Client-Side In-Browser Rendering',
      'Dual Input: Live Code Editor & .HTML File Drag-and-Drop',
      'Real-Time Live Sheet Preview with Exact Aspect Ratios',
      'A4, US Letter, Legal, A3, and A5 Paper Formats',
      'Portrait and Landscape Orientations',
      'Preserve CSS Background Graphics and Gradients',
      'Pre-built Starter Templates for Invoices, Reports, and Resumes',
      'Vector Print Output with Selectable Text & Hyperlinks',
      'Zero Watermarks & Unlimited Document Conversions'
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas & Iframe support.',
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
        name: 'PDF Tools',
        item: `${siteUrl}/pdf-tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'HTML & URL to PDF Converter',
        item: url,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HTML_TO_PDF_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Convert HTML Code or Webpage URL to PDF',
    description: '3 simple steps to convert web links, code, or HTML documents into publication-ready PDF files.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Provide URL or HTML Content',
        text: 'Paste a public webpage URL in the "Fetch from URL" tab, enter HTML/CSS code in the "Code Editor", or drag-and-drop a local .html file.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Customize Paper & Print Styling',
        text: 'Select your preferred page size (A4, Letter, Legal), orientation (Portrait or Landscape), margins, and zoom scale using the top controls toolbar.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Download or Print Your PDF',
        text: 'Click "Download PDF" to instantly save the document to your device, or click "Vector Print" to export a 100% selectable vector document with active hyperlinks.',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 text-slate-900">
      {/* Inject Structured JSON-LD Schemas */}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <Link href="/pdf-tools" className="hover:text-blue-600 transition-colors">
            PDF Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-900 font-semibold truncate">
            HTML &amp; URL to PDF Converter
          </span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              100% Free &bull; No Watermark
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              URL to PDF &bull; HTML Code &bull; .HTML Files
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              A4 &bull; US Letter &bull; Vector Print
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-purple-700" />
              100% In-Browser Private
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            HTML &amp; URL to PDF Converter Online
          </h1>

          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
            Convert any <strong>website URL link</strong>, <strong>raw HTML code</strong>, or <strong>local .html file</strong> into crisp, publication-ready PDF documents. Features 1-click web page fetching, real-time split-screen paper preview, custom margins, CSS backgrounds, and professional invoice/report templates. <strong>100% private, zero server uploads, and no watermarks.</strong>
          </p>
        </div>

        {/* Top Leaderboard AdSlot */}
        <div className="w-full">
          <AdSlot slotType="header-leaderboard" />
        </div>

        {/* The Core Interactive Studio */}
        <HtmlToPdfStudio />

        {/* Mid-Content AdSlot */}
        <div className="w-full">
          <AdSlot slotType="post-download" />
        </div>

        {/* Competitor Comparison Matrix (Why FileZenith is #1) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Why FileZenith Beats Other HTML &amp; URL to PDF Converters
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Most online converters upload your confidential financial invoices, customer details, or proprietary code to third-party cloud servers. Here is how FileZenith delivers a superior, private experience:
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                  <th className="py-3 px-4 font-bold">Feature / Capability</th>
                  <th className="py-3 px-4 font-bold text-blue-700 bg-blue-50/50">FileZenith Studio</th>
                  <th className="py-3 px-4 font-bold text-slate-700">Standard Cloud Converters (iLovePDF, CloudConvert)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Fetch Webpage from URL</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    Instant 1-Click with Live Preview
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Often blocked by paywalls or captcha
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Confidentiality &amp; Privacy</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    100% In-Browser (Zero server storage)
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <XIcon className="w-4 h-4 inline-block mr-1 text-rose-400" />
                    Uploaded to remote cloud servers
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Live Real-Time Preview</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    Instant split-screen paper sheet mockup
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <XIcon className="w-4 h-4 inline-block mr-1 text-rose-400" />
                    None (Blind conversion queue)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Vector Text &amp; Selectable Text</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    100% Crisp Vector (Copyable text &amp; links)
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Often flattened into blurry images
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">CSS Background Colors &amp; Gradients</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    Automatic exact print color adjust
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Often strips background colors to save ink
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Starter Design Templates</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    Built-in Invoices, Reports, Resumes, Receipts
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <XIcon className="w-4 h-4 inline-block mr-1 text-rose-400" />
                    None provided
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">File Limits &amp; Watermarks</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    Zero Watermarks &amp; 100% Free Forever
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Paid paywalls, daily conversion caps
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 Practical Everyday Use Cases Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Invoices &amp; Billing Slips</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Convert itemized client invoices, receipts, and order confirmations with exact CSS table background colors, borders, and payment details.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Web Articles &amp; Documentation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fetch live Wikipedia articles, blog tutorials, and developer docs into cleanly paginated, printable reading sheets with working links.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Resumes &amp; Portfolios</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compile modern HTML/CSS developer resumes and CVs into razor-sharp vector A4 documents without blurry fonts or broken lines.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Dashboards &amp; Receipts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export data dashboards, transaction logs, and retail POS checkout slips with automated repeating table headers across every page.
            </p>
          </div>
        </section>

        {/* Developer Print CSS Cheat Sheet Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Code2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Developer Print CSS Cheat Sheet &amp; Best Practices
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              When converting HTML code or webpages to PDF, use these proven CSS rules to guarantee consistent page breaks, repeatable headers, and razor-sharp printing:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Snippet 1 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
              <div className="text-blue-400 font-bold font-sans text-xs flex items-center justify-between">
                <span>1. Clean Multi-Page Breaks</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">CSS</span>
              </div>
              <p className="text-slate-400 font-sans text-[11px]">Forces content after this element onto a brand new page:</p>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
{`.page-break {
  page-break-after: always;
  break-after: page;
}`}
              </pre>
            </div>

            {/* Snippet 2 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
              <div className="text-blue-400 font-bold font-sans text-xs flex items-center justify-between">
                <span>2. Prevent Awkward Card / Row Splits</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">CSS</span>
              </div>
              <p className="text-slate-400 font-sans text-[11px]">Prevents tables, signatures, or cards from being sliced across pages:</p>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
{`.card, tr, .signature-box {
  page-break-inside: avoid;
  break-inside: avoid;
}`}
              </pre>
            </div>

            {/* Snippet 3 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
              <div className="text-blue-400 font-bold font-sans text-xs flex items-center justify-between">
                <span>3. Preserve Background Colors &amp; Fills</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">CSS</span>
              </div>
              <p className="text-slate-400 font-sans text-[11px]">Forces browsers to print table header colors and badges:</p>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
{`* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}`}
              </pre>
            </div>

            {/* Snippet 4 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
              <div className="text-blue-400 font-bold font-sans text-xs flex items-center justify-between">
                <span>4. Repeat Table Headers on Every Page</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">CSS</span>
              </div>
              <p className="text-slate-400 font-sans text-[11px]">Ensures multi-page invoice tables repeat header titles automatically:</p>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
{`thead {
  display: table-header-group;
}
tfoot {
  display: table-footer-group;
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                How to Convert HTML or URL to PDF in 3 Easy Steps
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Transform any web link, markup, or template into a beautifully formatted PDF document in under 10 seconds:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Paste URL or HTML Code</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter any public website URL in the <strong>Fetch from URL</strong> tab, paste raw HTML &amp; CSS into the <strong>Code Editor</strong>, or upload a local <code className="text-blue-600 font-semibold">.html</code> file.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Configure Paper &amp; Margins</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose your paper format (A4, Letter, Legal), orientation (Portrait or Landscape), margins, and zoom level. The live paper sheet preview updates in real time.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Export Instant or Vector PDF</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Click <strong>Download PDF</strong> for an instant direct file download, or click <strong>Vector Print</strong> for 100% crisp vector fonts, selectable text, and clickable links.
              </p>
            </div>
          </div>
        </section>

        {/* Deep-Dive FAQ Accordion Section (Matching PAN & Signature Tools) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Frequently Asked Questions (HTML &amp; URL to PDF)
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Clear answers to the most common questions about URL fetching, page breaking, CSS background colors, and document security:
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {HTML_TO_PDF_FAQS.map((faq, idx) => (
              <details key={idx} className="group py-4 cursor-pointer" open={idx < 2}>
                <summary className="flex items-center justify-between font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors list-none">
                  <span className="flex items-start gap-2.5">
                    <span className="text-blue-600 font-black shrink-0 text-sm">Q{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-7 pr-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* High-Traffic Search Keywords & Supported Queries Matrix (Goldmine SEO) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              High Search Intent Queries &bull; HTML &amp; Webpage PDF Conversion
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            FileZenith’s in-browser conversion engine is calibrated for high-performance developer workflows, invoice printing, and public web article archiving:
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'url to pdf converter',
              'convert url to pdf online free',
              'webpage to pdf converter',
              'website to pdf converter free',
              'save webpage as pdf a4',
              'convert link to pdf',
              'web link to pdf converter',
              'html to pdf converter',
              'convert html to pdf online free',
              'html code to pdf',
              'save html as pdf without watermark',
              'raw html to pdf with css',
              'convert html file to pdf',
              'url to pdf a4 size',
              'fetch url to pdf online',
              'website link to pdf converter no watermark',
              'invoice html to pdf free',
              'convert htm to pdf free online',
              'html to pdf with background graphics',
              'export html table to pdf',
              'html to pdf multi page breaks',
              'convert article url to pdf',
              'free html to pdf without signup',
              'html to pdf vector text',
              'developer html to pdf tool',
              'html resume to pdf converter',
              'html receipt to pdf free',
              'best url to pdf converter online 2026'
            ].map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* Related Document & PDF Tools Hub (Matching FileZenith Standards) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Productivity &amp; Document Suite
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Explore More Fast In-Browser File Tools
            </h2>
            <p className="text-sm text-slate-600">
              Every tool on FileZenith operates 100% inside your browser memory for uncompromising privacy and speed:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/tools/online-signature-maker"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    Online Signature Maker
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Draw or type authentic digital signatures and export as transparent PNG or 300 DPI JPEG.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                <span>Create Signature &rarr;</span>
              </div>
            </Link>

            <Link
              href="/pdf/compress"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                    Compress PDF Online
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reduce PDF document file size by up to 80% without losing readable text sharpness.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                <span>Compress PDF &rarr;</span>
              </div>
            </Link>

            <Link
              href="/pdf/merge"
              className="group p-4 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    Merge PDF Documents
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Combine multiple PDF pages, marksheets, and receipts into one uniform master file.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-purple-600 font-bold group-hover:translate-x-1 transition-transform">
                <span>Merge Files &rarr;</span>
              </div>
            </Link>

            <Link
              href="/pdf/pdf-to-word"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    PDF to Word DOCX
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Convert PDF documents into fully editable Microsoft Word (.docx) files 100% offline.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-bold group-hover:translate-x-1 transition-transform">
                <span>Convert to DOCX &rarr;</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Bottom Leaderboard AdSlot */}
        <div className="w-full pt-4">
          <AdSlot slotType="header-leaderboard" />
        </div>
      </div>
    </main>
  );
}
