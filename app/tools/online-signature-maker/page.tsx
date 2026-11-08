import { Metadata } from 'next';
import Link from 'next/link';
import { SignatureMakerStudio } from '@/components/tools/SignatureMakerStudio';
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
  Check,
  X as XIcon,
  Layers,
  FileText,
  Info,
  Printer,
  UserCheck,
  Stamp,
  BookOpen,
  PenTool,
  Download,
  Copy,
  MousePointerClick,
  Smartphone,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Online Signature Maker — Draw or Type Digital Signature [Free Transparent PNG, No Watermark] | FileZenith',
  description:
    'Create, draw, or type digital signatures online for free. Download transparent PNG for Word/PDFs, vector SVG, or 10-20KB govt exam JPEG. Smooth pen flow, 8+ cursive handwriting fonts, paper shadow stripper, zero watermarks, 100% private in-browser.',
  keywords: [
    'online signature maker',
    'draw signature online',
    'create signature online free',
    'transparent signature generator',
    'digital signature creator transparent png',
    'handwritten signature generator online',
    'draw signature for pdf free',
    'electronic signature maker no watermark',
    'signature to transparent png converter',
    'draw sign with finger mobile',
    'type signature cursive generator free',
    'make signature online transparent background',
    'free e signature drawer without login',
    'signature maker for pan card 444x205',
    'signature resize 10 to 20 kb ssc upsc',
    'paper signature photo background remover',
    'clean handwritten signature from paper photo free',
    'e sign generator free download transparent png',
    'smooth calligraphy signature online',
    'draw signature online mouse',
    'signature maker copy to clipboard',
    'digital signature for word document free',
    'free electronic signature drawer for contracts',
    'fountain pen signature generator online',
    'cursive handwriting signature maker',
    'signature without background maker free',
    'draw signature on phone screen',
    'sign on white background convert to transparent png',
    'free digital sign maker online'
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/tools/online-signature-maker',
  },
  openGraph: {
    title: 'Online Signature Maker — Draw or Type Digital Signature [Free Transparent PNG, No Watermark] | FileZenith',
    description:
      'Create and draw authentic digital signatures online. Download transparent PNG for Word/PDF or 10-20KB JPEG for government portals. 100% private in-browser, zero watermark, zero signup.',
    url: 'https://www.filezenith.com/tools/online-signature-maker',
    siteName: 'FileZenith',
    type: 'website',
    images: [
      {
        url: 'https://www.filezenith.com/api/og?title=Online%20Signature%20Maker&category=Digital%20ID%20Tools&desc=Draw%20or%20type%20authentic%20handwritten%20signatures.%20Export%20transparent%20PNG%2C%20SVG%2C%20or%20govt%2010-20KB%20JPEG.&badge=100%25%20Free%20%26%20Private',
        width: 1200,
        height: 630,
        alt: 'Online Signature Maker and Digital Drawer Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Signature Maker — Draw or Type Digital Signature [Free Transparent PNG, No Watermark] | FileZenith',
    description:
      'Draw smooth signatures or type cursive signatures online. 100% free, transparent PNG, SVG & Govt JPEG formats.',
    images: ['https://www.filezenith.com/api/og?title=Online%20Signature%20Maker&category=Digital%20ID%20Tools&desc=Draw%20or%20type%20authentic%20handwritten%20signatures.%20Export%20transparent%20PNG%2C%20SVG%2C%20or%20govt%2010-20KB%20JPEG.&badge=100%25%20Free%20%26%20Private'],
  },
};

const SIGNATURE_FAQS = [
  {
    question: 'How do I draw a signature online on my smartphone or touchscreen?',
    answer:
      'Simply open FileZenith on your smartphone, tablet, or touchscreen laptop. Under the "Draw Signature" tab, use your fingertip or a stylus pen to sign naturally within the canvas. Our engine features quadratic Bezier curve interpolation and touch-action optimization, producing smooth, lifelike ink strokes that mirror authentic pen on paper.'
  },
  {
    question: 'Why is a transparent PNG signature best for Word documents and PDF contracts?',
    answer:
      'A transparent PNG has an alpha channel (zero background color). When you paste or insert a transparent signature over an agreement in Microsoft Word, Google Docs, or Adobe Acrobat PDF, the signature overlays cleanly across signature lines, watermarks, or colored document backgrounds without creating an ugly opaque white box.'
  },
  {
    question: 'Are digital signatures created on FileZenith legally valid for contracts and forms?',
    answer:
      'Yes. In the United States (under the ESIGN Act and UETA), the European Union (eIDAS Regulation), the United Kingdom, and India (under the Information Technology Act, 2000), electronic signatures are recognized as legally binding for commercial agreements, employment offers, non-disclosure agreements (NDAs), invoices, and general contracts provided both parties intend to sign.'
  },
  {
    question: 'Can I generate a signature for government job portals (SSC, UPSC, IBPS, PAN Card)?',
    answer:
      'Yes! FileZenith is the only signature maker with built-in official portal presets. After drawing or typing your signature, click "Download 10–20KB JPEG" to get an exact 140 × 60 px file sized strictly between 10 KB and 20 KB on pure white background for SSC/UPSC, or click "Download PAN Signature" for an exact 444 × 205 px, 300 DPI embedded JPEG for NSDL/UTIITSL.'
  },
  {
    question: 'How does the "Type Signature" mode work?',
    answer:
      'If you prefer a clean, stylized autograph, select the "Type Signature" tab and enter your name or initials. You can choose from 8 distinct cursive calligraphy styles (ranging from Royal Elegance and Contemporary Script to Doctor Scribble and Bold Marker), adjust ink color, font size, and letter slant, and export in 1 click.'
  },
  {
    question: 'Are my signatures or personal name uploaded or saved on any server?',
    answer:
      'Never. FileZenith operates entirely on 100% client-side zero-knowledge architecture. All canvas rendering, stroke recording, Bezier smoothing, and image file conversions occur inside your web browser memory. Your signature data is never transmitted over the internet or saved to any cloud database, guaranteeing complete privacy and identity protection.'
  },
  {
    question: 'How do I copy my signature directly into an email or Google Doc?',
    answer:
      'Click the "Copy to Clipboard" button above the download section. The browser copies the transparent PNG image directly into your operating system clipboard. You can then press Ctrl+V (or Cmd+V on Mac) directly inside your email composer, Google Doc, or invoice generator.'
  }
];

export default function OnlineSignatureMakerPage() {
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/online-signature-maker`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Online Signature Maker & Digital Drawer',
    url: url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    featureList: [
      'Draw smooth digital signature with finger, stylus, or mouse',
      'Smooth Bezier curve ink interpolation',
      'Type to signature with 8+ authentic cursive handwriting fonts',
      'Clean paper signature shadows with Magic B&W threshold',
      'Download transparent PNG for Word, PDFs, and invoices',
      'Download Sarkari / SSC / UPSC 10-20KB JPEG preset (140x60 px)',
      'Download PAN Card NSDL/UTIITSL 444x205 px 300 DPI JPEG',
      'Download Scalable Vector SVG format',
      '1-Click Copy to OS Clipboard for instant Ctrl+V pasting',
      '100% private client-side execution with zero server upload',
    ],
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
        name: 'Online Signature Maker',
        item: url,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SIGNATURE_FAQS.map((item) => ({
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
    name: 'How to Create and Draw an Online Signature',
    description: 'Quick 3-step guide to creating, styling, and downloading digital signatures online.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose Your Signature Method',
        text: 'Select Draw Signature to sign with your mouse or touchscreen, or select Type Signature to choose from 8 cursive handwriting styles.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Customize Ink and Style',
        text: 'Pick your preferred ink color (Black, Navy Blue, Ballpoint Blue, or Red) and adjust pen thickness or cursive font size.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Download in Desired Format',
        text: 'Click Download Transparent PNG for PDFs/Word, or select Sarkari 10–20KB JPEG or PAN Card 444x205 px for government portals.',
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
          <Link href="/govt-job-tools" className="hover:text-blue-600 transition-colors">
            Govt Job Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-900 font-semibold truncate">
            Online Signature Maker
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
              Transparent PNG &bull; SVG &bull; Govt JPEG
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
              <PenTool className="w-3.5 h-3.5 text-amber-700" />
              4 Pen Styles (Fountain, Ballpoint, Calligraphy, Marker)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-purple-700" />
              100% In-Browser Private
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Online Signature Maker &amp; Digital Drawer
          </h1>

          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
            Draw smooth handwritten signatures with your mouse, stylus, or touchscreen using <strong>4 authentic pen styles (Fountain, Ballpoint, Calligraphy, Marker)</strong>, or type your name to generate cursive calligraphy. Export in 1 click as a <strong>transparent PNG</strong> (for Word &amp; PDFs), <strong>high-res vector SVG</strong>, or <strong>10–20KB govt exam JPEG</strong> (for SSC, UPSC, and PAN Card). Completely private, instant, and free forever.
          </p>
        </div>

        {/* Top Leaderboard AdSlot */}
        <div className="w-full">
          <AdSlot slotType="header-leaderboard" />
        </div>

        {/* The Core Interactive Signature Studio Suite */}
        <SignatureMakerStudio />

        {/* Post-Tool Mid AdSlot */}
        <div className="w-full">
          <AdSlot slotType="post-download" />
        </div>

        {/* Competitor Comparison Matrix (Why FileZenith is #1) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Why FileZenith Is the Best Free Signature Creator Online
              </h2>
            </div>
            <p className="text-sm text-slate-700">
              Unlike other online signature generators that force you to create an account, demand your email, or add ugly watermarks, FileZenith is built specifically for users who need fast, clean, and private results:
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900">
                  <th className="py-3 px-4 font-bold">Feature</th>
                  <th className="py-3 px-4 font-bold text-blue-900 bg-blue-50/60">
                    FileZenith Signature Maker
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-500">
                    DocuSign / PandaDoc
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-500">
                    Other Free Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Sign Up / Email Required</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-blue-50/30">
                    None (Zero Signup)
                  </td>
                  <td className="py-3 px-4 text-slate-500">Mandatory Registration</td>
                  <td className="py-3 px-4 text-slate-500">Requires Email</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Watermark Free</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-blue-50/30">
                    100% Watermark Free
                  </td>
                  <td className="py-3 px-4 text-slate-500">Watermarked in trial</td>
                  <td className="py-3 px-4 text-slate-500">Branded Logo Watermark</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Transparent PNG Export</td>
                  <td className="py-3 px-4 font-bold text-blue-800 bg-blue-50/30">
                    Lossless 32-bit Alpha
                  </td>
                  <td className="py-3 px-4 text-slate-500">Locked behind paywall</td>
                  <td className="py-3 px-4 text-slate-500">Low resolution</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Indian Govt Exam Calibrated</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-blue-50/30">
                    10-20KB SSC &amp; 300 DPI PAN
                  </td>
                  <td className="py-3 px-4 text-slate-500">Not supported</td>
                  <td className="py-3 px-4 text-slate-500">Not supported</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Server Privacy &amp; Security</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-blue-50/30">
                    100% In-Browser (Zero Upload)
                  </td>
                  <td className="py-3 px-4 text-slate-500">Stored on cloud servers</td>
                  <td className="py-3 px-4 text-slate-500">Stored on remote servers</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">1-Click OS Clipboard Copy</td>
                  <td className="py-3 px-4 font-bold text-blue-800 bg-blue-50/30">
                    Yes (Native Ctrl+V support)
                  </td>
                  <td className="py-3 px-4 text-slate-500">No</td>
                  <td className="py-3 px-4 text-slate-500">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 Practical Everyday Use Cases */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">PDFs &amp; Word Documents</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign lease agreements, job offers, NDAs, and corporate memos without printing, scanning, or buying expensive software.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Stamp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Govt Recruitment Applications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly create a crisp signature sized strictly between 10 KB and 20 KB for SSC CGL, CHSL, UPSC OTR, and IBPS exams.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">PAN Card Application</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export exact 444 × 205 px with binary 300 DPI markers for Protean NSDL and UTIITSL Form 49A/49AA submissions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Invoices &amp; Email Footers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stamp authentic digital signatures on commercial billing invoices, receipts, and professional Gmail / Outlook email footers.
            </p>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                How to Create Your Electronic Signature in 3 Easy Steps
              </h2>
            </div>
            <p className="text-sm text-slate-700">
              Follow this simple guide to generate and use your digital signature right now:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Draw or Type Your Signature</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Use the <strong>Draw Signature</strong> tab to sign with your mouse or phone touchscreen, or use <strong>Type Signature</strong> to select from 8 elegant cursive fonts.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Customize Ink &amp; Thickness</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Choose classic black or royal ballpoint blue ink, tweak line thickness (1px–8px), or adjust font size and italic slant.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Download or Copy to Clipboard</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Click <strong>Download Transparent PNG</strong> to save, or click <strong>Copy to Clipboard</strong> to paste (Ctrl+V) directly into your Word document or PDF.
              </p>
            </div>
          </div>
        </section>

        {/* Related Fast Tools Hub */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Related Document &amp; Form Tools
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Complete Your Document Verification &amp; Printing Workflow
            </h2>
            <p className="text-sm text-slate-700">
              Explore companion tools calibrated for PDF signing, identity card printing, and recruitment forms:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/tools/pan-card-photo-resizer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  PAN Photo &amp; Sign Resizer
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Format photo (213×213) and signature (444×205) at 300 DPI under 50KB for NSDL/UTIITSL.
              </p>
            </Link>

            <Link
              href="/tools/online-signature-maker#resize"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Stamp className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  Signature Resizer (10–20KB)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Format uploaded signature scans for SSC, UPSC, and IBPS online portals.
              </p>
            </Link>

            <Link
              href="/pdf/edit"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                  Sign &amp; Edit PDF Online
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Insert your new transparent signature directly onto PDF document pages.
              </p>
            </Link>

            <Link
              href="/csc-cyber-cafe-tools"
              className="group p-4 rounded-xl border border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-50 transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h3 className="font-bold text-amber-950 text-sm group-hover:text-amber-800 transition-colors">
                  CSC &amp; Cyber Cafe Hub &rarr;
                </h3>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Complete fast toolkit for daily cyber cafe printing, ID cropping, and PDF compression.
              </p>
            </Link>
          </div>
        </section>

        {/* Deep Dive FAQ Accordion */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Frequently Asked Questions (Online Signature Creation)
              </h2>
            </div>
            <p className="text-sm text-slate-700">
              Everything you need to know about digital signature validity, transparent exports, and privacy:
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {SIGNATURE_FAQS.map((faq, idx) => (
              <details key={idx} className="group py-4 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors list-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed pr-6">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

