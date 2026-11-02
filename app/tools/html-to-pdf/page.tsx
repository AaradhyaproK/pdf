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
  Cpu,
  Zap,
  Globe,
  Sliders,
  Check,
  X as XIcon,
  Download,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'HTML to PDF Converter — Convert HTML Code & Files to PDF [Free, Instant & 100% Private] | FileZenith',
  description:
    'Convert HTML files, raw code, and web templates into high-resolution vector PDF documents. Support for A4, Letter, custom margins, CSS backgrounds, starter templates, and multi-page pagination. 100% private in-browser, no watermarks, no limits.',
  keywords: [
    'html to pdf',
    'html to pdf converter',
    'convert html to pdf online free',
    'html code to pdf',
    'save html as pdf',
    'html to pdf converter free without watermark',
    'raw html to pdf with css',
    'convert html file to pdf',
    'html to pdf in browser client side',
    'html to pdf a4 size',
    'invoice html to pdf free',
    'webpage code to pdf converter',
    'convert htm to pdf free online',
    'html to pdf with background graphics',
    'export html table to pdf',
    'html to pdf multi page breaks',
    'free html to pdf without signup',
    'html to pdf vector text',
    'developer html to pdf tool',
    'best html to pdf converter online 2026',
    'html to pdf responsive print css',
    'html resume to pdf converter',
    'html receipt to pdf free',
    'fast html to pdf generator'
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/tools/html-to-pdf',
  },
  openGraph: {
    title: 'HTML to PDF Converter — Convert HTML Code & Files to PDF [Free, Instant & 100% Private] | FileZenith',
    description:
      'Turn raw HTML code or .html files into professional vector PDFs directly in your browser. Complete styling control, zero server uploads, 100% free.',
    url: 'https://www.filezenith.com/tools/html-to-pdf',
    siteName: 'FileZenith',
    type: 'website',
    images: [
      {
        url: 'https://www.filezenith.com/api/og?title=HTML%20to%20PDF%20Converter&category=Developer%20%26%20Office%20Tools&desc=Convert%20HTML%20code%20and%20files%20into%20crisp%20vector%20PDFs.%20100%25%20private%20in-browser%20processing.&badge=Instant%20%26%20No%20Watermark',
        width: 1200,
        height: 630,
        alt: 'HTML to PDF Converter Online Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML to PDF Converter — Free & 100% Private | FileZenith',
    description:
      'Convert HTML code and files into crisp vector PDFs directly in your browser. 100% private, zero server uploads.',
    images: ['https://www.filezenith.com/api/og?title=HTML%20to%20PDF%20Converter&category=Developer%20%26%20Office%20Tools&desc=Convert%20HTML%20code%20and%20files%20into%20crisp%20vector%20PDFs.&badge=100%25%20Free%20%26%20Private'],
  },
};

const HTML_TO_PDF_FAQS = [
  {
    question: 'How do I convert an HTML file or raw code to PDF for free?',
    answer:
      'Simply paste your HTML and CSS code directly into the Code Editor tab, or upload your .html or .htm file using the Upload tab. Review your live document in the real-time paper preview on the right, customize your page format (A4, Letter, Legal) and margins, and click "Download PDF" for an instant file download or "Vector Print / PDF" for 100% selectable vector text.'
  },
  {
    question: 'Are my HTML files, private invoices, or sensitive data uploaded to your server?',
    answer:
      'Never. FileZenith operates entirely on 100% client-side zero-knowledge architecture. All code parsing, rendering, style computation, and PDF compilation take place locally inside your device’s web browser memory. Not a single character or image is transmitted across the internet, guaranteeing complete compliance with GDPR, HIPAA, and corporate confidentiality policies.'
  },
  {
    question: 'How do I ensure background colors, table borders, and gradients appear in the PDF?',
    answer:
      'Our studio automatically enables "-webkit-print-color-adjust: exact" and "print-color-adjust: exact" in the generated print stylesheet. You can also toggle the "CSS Backgrounds" switch in the toolbar to ensure your custom background colors, button fills, and colored table headers print with 100% visual vibrancy.'
  },
  {
    question: 'How do I add page breaks to split my HTML document across multiple pages?',
    answer:
      'You can insert a page break anywhere in your HTML code by clicking the "+ Page Break" button in the toolbar, or by adding the CSS rule: <div style="page-break-after: always; break-after: page;"></div>. In addition, you can prevent tables or cards from awkwardly splitting midway across pages by adding style="page-break-inside: avoid;" to the container element.'
  },
  {
    question: 'Can I convert HTML to different paper sizes like US Letter, A4, or Legal?',
    answer:
      'Yes. Our studio lets you choose from standard international formats including A4 (210 × 297 mm), US Letter (8.5 × 11 in), Legal (8.5 × 14 in), A3 (large poster/ledger), and A5 (booklet). You can also toggle between Portrait and Landscape orientations instantly.'
  },
  {
    question: 'Does this tool support external CSS stylesheets, images, and Google Web Fonts?',
    answer:
      'Yes! You can link standard web fonts (like Google Fonts via <link> or @import), reference public image URLs (https://...), or embed inline Base64 data URIs (e.g., data:image/png;base64,...) directly in your HTML code. When using Vector Print, all external fonts and web resources render at pristine vector clarity.'
  },
  {
    question: 'Why is Vector Print better than image-based PDF converters?',
    answer:
      'Many cloud converters rasterize your HTML into low-resolution images, resulting in blurry text when zoomed and unsearchable documents. FileZenith provides both an instant raster/vector download and a native Vector Print engine that preserves 100% sharp vector typography, selectable text for copying, and clickable hyperlinks.'
  }
];

export default function HtmlToPdfPage() {
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/html-to-pdf`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HTML to PDF Converter Studio',
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All (Web Browser)',
    description:
      'Free client-side HTML to PDF converter. Convert HTML files, web code, and CSS into crisp vector A4 and Letter PDF documents with zero server uploads.',
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
      ratingCount: '3890',
    },
    featureList: [
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
        name: 'HTML to PDF Converter',
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
    name: 'How to Convert HTML Code or Files to PDF',
    description: '3 simple steps to convert web code or HTML documents into publication-ready PDF files.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Provide Your HTML Content',
        text: 'Paste your HTML code directly into the Code Editor or drag and drop your .html file into the Upload tab. You can also pick from our pre-built invoice, report, or resume templates.',
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
        text: 'Click "Download PDF" to instantly save the document to your device, or click "Vector Print / PDF" to export a 100% selectable vector document.',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
            HTML to PDF Converter
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
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Vector Print &bull; A4 &bull; Letter
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
              <Code2 className="w-3.5 h-3.5 text-amber-700" />
              Live Split-Screen Code Studio
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-purple-700" />
              100% In-Browser Private
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            HTML to PDF Converter — Free Online Studio
          </h1>

          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
            Convert HTML files, raw markup, and CSS into crisp, high-resolution PDF documents directly in your browser. Complete with live split-screen paper preview, custom margins, page break controls, and professional invoice/report templates. <strong>100% private, zero server uploads, and no watermarks.</strong>
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
                Why FileZenith Beats Other HTML to PDF Converters
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Most online HTML to PDF converters upload your confidential financial invoices, customer details, or proprietary code to third-party cloud servers. Here is how FileZenith delivers a superior, private experience:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                  <th className="py-3 px-4">Feature / Capability</th>
                  <th className="py-3 px-4 text-blue-700 bg-blue-50/50">FileZenith Studio</th>
                  <th className="py-3 px-4">Standard Cloud Converters (iLovePDF, CloudConvert)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Confidentiality & Privacy</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    100% In-Browser (Zero server upload)
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
                  <td className="py-3.5 px-4 font-medium text-slate-900">Vector Text & Selectable Text</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    100% Crisp Vector (Copyable text & links)
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Often flattened into blurry images
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">CSS Background Colors & Gradients</td>
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
                  <td className="py-3.5 px-4 font-medium text-slate-900">File Limits & Watermarks</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 bg-blue-50/20">
                    <Check className="w-4 h-4 inline-block mr-1 text-emerald-500" />
                    Zero Watermarks & 100% Free Forever
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Paid paywalls, daily conversion caps
                  </td>
                </tr>
              </tbody>
            </table>
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
              When building HTML templates for PDF conversion, use these proven CSS snippets to guarantee consistent page breaks, headers, and razor-sharp printing across all browsers:
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
                <span>3. Preserve Background Colors & Fills</span>
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
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                How to Convert HTML to PDF in 3 Easy Steps
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Transform any web markup or template into a beautifully formatted PDF document in under 10 seconds:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Input HTML or Template</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Paste your raw HTML and CSS code, upload a local <code className="text-blue-600">.html</code> file, or choose from our starter invoice, business report, or resume presets.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Configure Page Styling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose your paper format (A4, Letter, Legal), orientation (Portrait or Landscape), margins, and zoom level. The live paper preview reflects your layout in real time.
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

        {/* Comprehensive FAQs */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Frequently Asked Questions (FAQs)
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Clear answers to common questions about HTML to PDF conversion, styling, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HTML_TO_PDF_FAQS.map((faq, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2"
              >
                <h3 className="font-semibold text-slate-900 text-sm flex items-start gap-2">
                  <span className="text-blue-600 shrink-0 font-bold">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Tool Recommendations */}
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
              Complete Productivity Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Explore More Free Client-Side Tools
            </h2>
            <p className="text-sm text-slate-400">
              Every tool on FileZenith operates 100% inside your browser memory for uncompromising privacy and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/tools/online-signature-maker"
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-400 uppercase">Signatures</span>
                <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition">
                  Online Signature Maker
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Draw or type authentic digital signatures and export as transparent PNG or 300 DPI JPEG.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Create Signature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/pdf/compress"
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase">Optimization</span>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                  Compress PDF Online
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Reduce PDF document file size by up to 80% without losing readable text sharpness.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Compress PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/pdf/merge"
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-purple-400 uppercase">Organization</span>
                <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition">
                  Merge PDF Documents
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Combine multiple PDF pages, marksheets, and receipts into one uniform master file.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Merge Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/pdf/pdf-to-word"
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase">Conversion</span>
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition">
                  PDF to Word DOCX
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Convert PDF documents into fully editable Microsoft Word (.docx) files 100% offline.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Convert to DOCX</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

