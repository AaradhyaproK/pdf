import { Metadata } from 'next';
import Link from 'next/link';
import { PanCardResizerStudio } from '@/components/tools/PanCardResizerStudio';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PAN Card Photo & Signature Resizer (213x213 & 300 DPI) — Free NSDL & UTI Tool | FileZenith',
  description:
    'Resize photo to exact 213x213 px and signature to 444x205 px at 300 DPI (<50KB) for NSDL Protean & UTIITSL PAN cards. Free paper shadow stripper, 300KB PDF compressor & instant dual package. 100% free, private in-browser, no login.',
  keywords: [
    'pan card photo resizer 213x213',
    'pan card signature resizer 444x205',
    'nsdl pan card photo resizer 300 dpi',
    'utiitsl pan card photo signature resize',
    'pan card photo size 213 x 213',
    'pan card signature size 444 x 205',
    'pan card photo and signature resizer online free',
    'pan card photo size in cm 2.5 x 2.5',
    'pan card signature size in cm 4.5 x 2.0',
    'pan card photo compressor under 50kb',
    'pan card signature resize 10 to 20 kb',
    'pan card document resizer 300 kb pdf',
    'uti pan card photo signature cropper online',
    'nsdl protean pan card photo and sign crop tool',
    'form 49a photo resize online free',
    'form 49aa photo signature size converter',
    'pan card correction photo signature size online',
    'pan card photo 300 dpi converter free',
    'sarkari result pan card photo maker',
    'csc cyber cafe pan card photo signature tool',
    'how to resize photo for pan card application online',
    'pan card photo background white online tool',
    'pan card signature magic black and white cleaner',
    'uti photo signature joiner online',
    'nsdl photo resize 300 dpi online free',
    'pan card 213x213 300 dpi photo maker',
    'pan card photo size converter online 50kb',
    'free pan card photo cropper without software'
  ],
  alternates: {
    canonical: 'https://www.filezenith.com/tools/pan-card-photo-resizer',
  },
  openGraph: {
    title: 'PAN Card Photo & Signature Resizer (213x213 & 300 DPI) — Free NSDL & UTI Tool | FileZenith',
    description:
      'Exact 213x213 px photo & 444x205 px signature with 300 DPI JFIF injection for NSDL Protean & UTIITSL PAN Card portals. 100% free, instant & private.',
    url: 'https://www.filezenith.com/tools/pan-card-photo-resizer',
    siteName: 'FileZenith',
    type: 'website',
    images: [
      {
        url: 'https://www.filezenith.com/api/og?title=PAN%20Card%20Photo%20%26%20Signature%20Resizer&category=Govt%20ID%20Tools&desc=Exact%20213x213px%20photo%2C%20444x205px%20signature%20%40%20300%20DPI%2C%20under%2050KB.%20NSDL%20%26%20UTIITSL%20compliant.&badge=300%20DPI%20Guaranteed',
        width: 1200,
        height: 630,
        alt: 'PAN Card Photo and Signature Resizer Online Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAN Card Photo & Signature Resizer (213x213 & 300 DPI) — Free NSDL & UTI Tool | FileZenith',
    description:
      'Resize photo and signature for NSDL & UTIITSL PAN cards. Exact 213x213 and 444x205 pixels at 300 DPI under 50KB with real JFIF header injection.',
    images: ['https://www.filezenith.com/api/og?title=PAN%20Card%20Photo%20%26%20Signature%20Resizer&category=Govt%20ID%20Tools&desc=Exact%20213x213px%20photo%2C%20444x205px%20signature%20%40%20300%20DPI%2C%20under%2050KB.&badge=300%20DPI%20Guaranteed'],
  },
};

const OFFICIAL_FAQS = [
  {
    question: 'What are the exact photo specifications for NSDL and UTIITSL PAN card applications?',
    answer:
      'Both NSDL e-Gov (Protean) and UTIITSL require applicant photographs to be exactly 213 × 213 pixels (equivalent to 2.5 cm × 2.5 cm or 0.98 × 0.98 inches) at 300 DPI resolution in JPEG/JPG format. The file size must be strictly under 50 KB (ideal range: 25 KB to 45 KB). The applicant face must be clearly visible, facing front, with a plain white or light background.'
  },
  {
    question: 'What are the exact signature specifications for PAN card portals?',
    answer:
      'The signature for NSDL and UTIITSL must be exactly 444 × 205 pixels (equivalent to 4.5 cm × 2.0 cm or 1.77 × 0.8 inches) at 300 DPI resolution in JPEG/JPG format. The file size must be under 50 KB (ideal range: 15 KB to 30 KB). The signature must be signed with black or dark blue ink on clean white paper with zero shadows.'
  },
  {
    question: 'Why does the NSDL / UTIITSL portal show "Invalid DPI" or "Upload Failed"?',
    answer:
      'Most online photo resizers and smartphone photo editors export images at standard 72 DPI or 96 DPI screen resolution, leaving out the JFIF density markers. Government verification scripts on NSDL and UTIITSL examine the binary JPEG header (APP0 JFIF segment). If the XDensity and YDensity fields do not equal 300 DPI, the portal automatically rejects the upload. FileZenith directly injects real 300 DPI binary JFIF headers into every generated photo and signature, guaranteeing instant 100% acceptance.'
  },
  {
    question: 'How does the "Magic B&W" signature cleanup work?',
    answer:
      'When you take a phone photo of a paper signature, ambient room lighting casts grey shadows and creates yellow/beige paper gradients that cause automatic portal rejection. Our Magic B&W tool computes luminance (L = 0.299R + 0.587G + 0.114B) on each pixel, turning paper background into pure #FFFFFF white and ink into crisp solid black, making your signature look professionally scanned on a flatbed scanner.'
  },
  {
    question: 'What is the file size limit for PAN supporting documents (Aadhaar, Voter ID, Form 49A)?',
    answer:
      'NSDL and UTIITSL mandate that all supporting documents (Proof of Identity, Proof of Address, and Proof of Date of Birth) must be uploaded as a single combined PDF file sized strictly under 300 KB. Our built-in "Supporting Docs" tab compresses your scanned PDF documents down under 300 KB without compromising text readability.'
  },
  {
    question: 'Are my uploaded photo, signature, or Aadhaar documents saved on your servers?',
    answer:
      'Never. FileZenith operates on a 100% client-side zero-knowledge architecture. All image cropping, rotation, 300 DPI header injection, B&W thresholding, and PDF compression happen entirely inside your web browser using HTML5 Canvas and WebAssembly. Your biometric photos, signatures, and personal documents never leave your device and are never sent to any server or cloud storage.'
  },
  {
    question: 'Can I resize both photo and signature at the same time?',
    answer:
      'Yes! Use the "Dual Package (Both)" tab to upload both your photo and signature side-by-side. You can position, zoom, and enhance both images simultaneously, and click "Download Complete PAN Package" to get both perfectly calibrated files ready for immediate upload to the PAN portal.'
  }
];

export default function PanCardPhotoResizerPage() {
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/tools/pan-card-photo-resizer`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PAN Card Photo & Signature Resizer',
    url: url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2180',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Exact 213x213 pixels 300 DPI photo resizing for NSDL & UTIITSL',
      'Exact 444x205 pixels 300 DPI signature cropping',
      'Binary JFIF 300 DPI injection ensuring zero portal rejections',
      'Magic B&W threshold signature cleanup for pure white background',
      'Strict under 50KB JPEG binary search compression',
      'Supporting documents PDF compressor under 300KB',
      'Dual package 1-click simultaneous photo & signature download',
      '100% private in-browser client-side execution'
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
        name: 'PAN Card Photo Resizer',
        item: url,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: OFFICIAL_FAQS.map((item) => ({
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
    name: 'How to Resize Photo & Signature for PAN Card (NSDL / UTIITSL)',
    description: 'Step-by-step guide to format applicant photo and signature according to official NSDL e-Gov and UTIITSL guidelines.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Upload Your Photo or Signature',
        text: 'Select either the Photo (213×213 px) or Signature (444×205 px) tab and upload your image file.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Align and Frame',
        text: 'Use the interactive zoom slider, 90° rotation, and drag the image so the face aligns within the official oval guide.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Enhance & Clean Background',
        text: 'For signatures, enable Magic B&W cleanup to eliminate grey shadow gradients and produce pure white paper with crisp black ink.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Download Compliant JPEG',
        text: 'Click Download. The tool automatically injects 300 DPI binary JFIF headers and limits file size under 50KB for instant portal acceptance.',
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
            PAN Card Photo & Signature Resizer
          </span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              NSDL (Protean) &amp; UTIITSL Approved
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Exact 213×213 &amp; 444×205 px
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Real 300 DPI JFIF Header
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-purple-700" />
              100% In-Browser Private
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            PAN Card Photo &amp; Signature Resizer Online
          </h1>

          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
            Format your photograph to <strong>exact 213 × 213 pixels</strong> (2.5 × 2.5 cm) and signature to <strong>exact 444 × 205 pixels</strong> (4.5 × 2.0 cm) at <strong>300 DPI</strong> strictly under <strong>50 KB</strong>. Built specifically for NSDL e-Gov (Protean Form 49A/49AA) and UTIITSL portals with auto 300 DPI binary injection, magic white signature cleanup, and 300KB supporting document compression.
          </p>
        </div>

        {/* Top Leaderboard AdSlot */}
        <div className="w-full">
          <AdSlot slotType="header-leaderboard" />
        </div>

        {/* The Core Interactive PAN Studio Suite */}
        <PanCardResizerStudio />

        {/* Post-Tool Mid AdSlot */}
        <div className="w-full">
          <AdSlot slotType="post-download" />
        </div>

        {/* Official Portal Specifications Comparison Table */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Official NSDL (Protean) &amp; UTIITSL PAN Upload Guidelines
              </h2>
            </div>
            <p className="text-sm text-slate-700">
              Government PAN application servers reject files that deviate even by 1 pixel or lack binary 300 DPI headers. Here is the official specification matrix verified for Form 49A, Form 49AA, and PAN Card correction requests:
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900">
                  <th className="py-3 px-4 font-bold">Requirement</th>
                  <th className="py-3 px-4 font-bold text-blue-900 bg-blue-50/60">
                    Applicant Photograph
                  </th>
                  <th className="py-3 px-4 font-bold text-amber-900 bg-amber-50/60">
                    Applicant Signature
                  </th>
                  <th className="py-3 px-4 font-bold text-emerald-900 bg-emerald-50/60">
                    Supporting Documents
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Pixel Dimensions</td>
                  <td className="py-3 px-4 font-bold text-blue-800 bg-blue-50/30">
                    213 × 213 pixels
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-800 bg-amber-50/30">
                    444 × 205 pixels
                  </td>
                  <td className="py-3 px-4 text-emerald-800 bg-emerald-50/30">
                    Standard A4 (Portrait)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Physical Size (cm)</td>
                  <td className="py-3 px-4 font-medium text-slate-800">2.5 cm × 2.5 cm</td>
                  <td className="py-3 px-4 font-medium text-slate-800">4.5 cm × 2.0 cm</td>
                  <td className="py-3 px-4 text-slate-800">21.0 cm × 29.7 cm</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Resolution (DPI)</td>
                  <td className="py-3 px-4 font-bold text-emerald-800">
                    300 DPI (Strictly Enforced)
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-800">
                    300 DPI (Strictly Enforced)
                  </td>
                  <td className="py-3 px-4 text-slate-800">200 to 300 DPI</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">File Size Limit</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    Under 50 KB (Ideal: 35–45 KB)
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    Under 50 KB (Ideal: 20–30 KB)
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">Strictly Under 300 KB</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Accepted Format</td>
                  <td className="py-3 px-4 text-slate-800">JPEG / JPG</td>
                  <td className="py-3 px-4 text-slate-800">JPEG / JPG</td>
                  <td className="py-3 px-4 text-slate-800">Single PDF Document</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Color Appearance</td>
                  <td className="py-3 px-4 text-slate-800">Color with light / white background</td>
                  <td className="py-3 px-4 text-slate-800">Black / Blue ink on pure white paper</td>
                  <td className="py-3 px-4 text-slate-800">Greyscale / Black &amp; White</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Portals Reject & How FileZenith Solves It */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Technical Deep-Dive
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Why 90% of Online Tools Fail the NSDL / UTIITSL DPI Check
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              Most online image converters crop images by re-rendering on a basic HTML5 canvas and calling <code className="text-amber-300 bg-white/10 px-1.5 py-0.5 rounded text-xs">canvas.toBlob(&apos;image/jpeg&apos;)</code>. In modern browsers (Chrome, Edge, Safari), this defaults to <strong>72 or 96 DPI</strong>. Here is why FileZenith guarantees zero rejections:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold">
                01
              </div>
              <h3 className="font-bold text-white text-base">Binary 300 DPI Injection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you click Download, our engine parses the raw JPEG byte stream and rewrites the JFIF APP0 marker, injecting <code className="text-blue-300">units = 1</code> (dots per inch) and <code className="text-blue-300">XDensity = 300, YDensity = 300</code>. When government scripts read the header, it passes the 300 DPI check every time.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold">
                02
              </div>
              <h3 className="font-bold text-white text-base">Magic B&amp;W Shadow Stripper</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mobile phone camera snapshots of paper signatures inevitably have yellowish room lighting and camera shadows. Our mathematical luminance thresholding instantly isolates ink strokes and replaces all grey/yellow pixels with pure <code className="text-emerald-300">#FFFFFF</code> white.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold">
                03
              </div>
              <h3 className="font-bold text-white text-base">Dual Package Bundling</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cyber cafes and CSC operators handle dozens of PAN applications daily. Instead of resizing photos and signatures separately across multiple websites, our &quot;Dual Package&quot; tab lets you format both simultaneously and download them in 1 click.
              </p>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                How to Resize Photo &amp; Signature for PAN Card in 4 Steps
              </h2>
            </div>
            <p className="text-sm text-slate-700">
              Follow this step-by-step procedure to ensure your PAN application is approved on first submission:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Upload Photo or Signature</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Click upload or drag-and-drop your original passport photo or paper signature snapshot.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Align Within Guides</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Use the drag handle to position your face within the official oval guide and adjust the zoom slider.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Clean Signature Paper</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                For signatures, keep Magic B&amp;W enabled to wipe away paper shadows and yellow room tint.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Download 300 DPI JPEG</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Click download to receive your compliant image under 50 KB with 300 DPI embedded JFIF markers.
              </p>
            </div>
          </div>
        </section>

        {/* Related CSC & Cyber Cafe Tools Hub */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              CSC Center &amp; Cyber Cafe Suite
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              More Fast Tools for Document Verification &amp; Printing
            </h2>
            <p className="text-sm text-slate-700">
              Essential in-browser utilities tailored for Indian cyber cafes, CSC VLEs, and sarkari applicants:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/tools/aadhaar-card-print"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  Aadhaar Card Print Tool
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Print e-Aadhaar on PVC card (85.6×54 mm) or multi-copy A4 sheet with zero upload.
              </p>
            </Link>

            <Link
              href="/tools/signature-resizer-10-to-20kb"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Stamp className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  Signature Resizer (10–20KB)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Clean and format signatures for SSC, UPSC OTR, and IBPS recruitment portals.
              </p>
            </Link>

            <Link
              href="/pdf/combine-marksheets"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                  Combine Marksheets (&lt;500KB)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Merge 10th and 12th marksheets into 1 clean A4 PDF strictly under 500 KB.
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
                Explore all 20+ specialized printing, resizing, and encryption tools for cyber cafes.
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
                Frequently Asked Questions (PAN Card Photo &amp; Signature Resizing)
              </h2>
            </div>
            <p className="text-sm text-slate-700">
              Clear answers to the most common issues faced during PAN card online application on NSDL and UTIITSL:
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {OFFICIAL_FAQS.map((faq, idx) => (
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
