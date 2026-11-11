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
  XCircle,
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
  Clock,
  ExternalLink,
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
  },
  {
    question: 'What are the rules for Minor PAN Card (under 18 years) photo and signature?',
    answer:
      'For applicants under 18 years of age (minor PAN card), the minor photograph is uploaded as usual (213×213 px, 300 DPI). However, the minor DOES NOT sign the application. Instead, the father, mother, or legal guardian (Representative Assessee) must sign in the signature box (444×205 px). When the physical PAN card is delivered, it displays the minor photograph with "NO SIGNATURE" or the guardian signature printed.'
  },
  {
    question: 'Which documents are officially valid as Proof of Identity (POI), Address (POA), and DOB?',
    answer:
      'Under Rule 114 of Income Tax Rules 1962: Aadhaar Card is universally accepted for all three (POI, POA, and DOB). Other valid POI documents include Voter ID, Passport, Driving License, and Ration Card with applicant photo. Valid POA documents include Electricity Bill (<3 months old), Water Bill, Bank Passbook/Statement (<3 months old), and Domicile Certificate. Valid DOB documents include Matriculation (10th) mark sheet, Birth Certificate, and Passport.'
  },
  {
    question: 'Can I use a blue ink pen for the PAN card signature or is black ink mandatory?',
    answer:
      'Both black and dark blue ink ballpoint pens are legally valid. However, Income Tax guidelines and CSC center operators strongly recommend a BLACK ballpoint pen because high-speed automated document scanners at NSDL and UTIITSL produce higher contrast scans with black ink, significantly reducing the chances of rejection or illegible printing on the PVC plastic card.'
  },
  {
    question: 'How do I change an old or childhood photograph on my existing PAN card?',
    answer:
      'To update an old photo or signature, submit a "Request for New PAN Card with Changes or Correction in PAN Data" (Form CSF) on NSDL Protean or UTIITSL. Check the tick box next to "Photo Mismatch" and "Signature Mismatch", upload your newly formatted 213×213 px photo and 444×205 px signature via FileZenith, and provide your existing 10-digit PAN number along with Aadhaar verification.'
  },
  {
    question: 'What is the difference between applying through NSDL (Protean) vs UTIITSL?',
    answer:
      'Both NSDL e-Gov (Protean) and UTIITSL are official authorized partners of the Income Tax Department of India for issuing Permanent Account Numbers (PAN). The document specifications (213×213 px photo, 444×205 px signature, 300 DPI, <50KB) and government fees (₹107 for physical delivery in India, ₹72 for e-PAN) are completely identical on both portals. You can apply on whichever portal you find more convenient.'
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
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

        {/* Post-Tool Mid AdSlot — kept clear of the studio's download button */}
        <div className="w-full pt-12 sm:pt-14 border-t border-slate-200/60">
          <AdSlot slotType="post-download" />
        </div>

        {/* Official Portal Specifications Comparison Table */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Table className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Official NSDL (Protean) &amp; UTIITSL PAN Upload Guidelines
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Government PAN application servers reject files that deviate even by 1 pixel or lack binary 300 DPI headers. Here is the official specification matrix verified for Form 49A, Form 49AA, and PAN Card correction requests:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900">
                  <th className="py-3.5 px-4 font-bold">Requirement</th>
                  <th className="py-3.5 px-4 font-bold text-blue-900 bg-blue-50/70">
                    Applicant Photograph
                  </th>
                  <th className="py-3.5 px-4 font-bold text-amber-900 bg-amber-50/70">
                    Applicant Signature
                  </th>
                  <th className="py-3.5 px-4 font-bold text-emerald-900 bg-emerald-50/70">
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
                  <td className="py-3 px-4 font-medium text-slate-800">2.5 cm × 2.5 cm (0.98 × 0.98 in)</td>
                  <td className="py-3 px-4 font-medium text-slate-800">4.5 cm × 2.0 cm (1.77 × 0.8 in)</td>
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
                  <td className="py-3 px-4 text-slate-800 font-medium">JPEG / JPG</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">JPEG / JPG</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">Single Combined PDF</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Color Appearance</td>
                  <td className="py-3 px-4 text-slate-800">Color with light / pure white background</td>
                  <td className="py-3 px-4 text-slate-800">Black / Blue ink on pure white paper</td>
                  <td className="py-3 px-4 text-slate-800">Greyscale / Black &amp; White (Legible)</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">Applicable Forms</td>
                  <td className="py-3 px-4 text-slate-700">Form 49A, Form 49AA, CSF (Correction)</td>
                  <td className="py-3 px-4 text-slate-700">Form 49A, Form 49AA, CSF (Correction)</td>
                  <td className="py-3 px-4 text-slate-700">Proof of Identity, Address &amp; DOB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Portal-by-Portal Upload Procedure (NSDL vs UTIITSL) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Official Portal Walkthrough
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              How to Upload Photo &amp; Signature on NSDL (Protean) and UTIITSL
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Whether you are applying directly as an individual citizen or filing bulk applications through a CSC cyber cafe center, here is the exact portal navigation path:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NSDL Protean Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/40 to-white border border-blue-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                  Portal 1: NSDL (Protean) e-Gov
                </span>
                <span className="text-[11px] font-bold text-blue-700">tin-nsdl.com</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">
                Steps for NSDL Form 49A / Correction:
              </h3>

              <ol className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-decimal list-inside font-medium">
                <li>
                  Go to the official Protean portal and choose <strong>&quot;Submit scanned images through e-Sign on document upload&quot;</strong>.
                </li>
                <li>
                  Fill in your Personal, Contact, and AO Code details across Tabs 1 to 4.
                </li>
                <li>
                  Navigate to <strong>&quot;Upload Photo / Signature and Documents&quot;</strong>.
                </li>
                <li>
                  Click <strong>Choose File</strong> under Photograph and select the <strong>213 × 213 px</strong> file downloaded from FileZenith. Click <strong>Upload</strong>.
                </li>
                <li>
                  Click <strong>Choose File</strong> under Signature and select the <strong>444 × 205 px</strong> file. Click <strong>Upload</strong>.
                </li>
                <li>
                  Upload your Aadhaar/POI/POA/DOB supporting PDF (under 300 KB) compressed in our &quot;Supporting Docs&quot; tab.
                </li>
                <li>
                  Complete payment (₹107) and authenticate with Aadhaar OTP e-Sign.
                </li>
              </ol>
            </div>

            {/* UTIITSL Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50/40 to-white border border-amber-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-black text-xs">
                  Portal 2: UTIITSL PAN Services
                </span>
                <span className="text-[11px] font-bold text-amber-700">utiitsl.com</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">
                Steps for UTIITSL (PSA &amp; Citizen Mode):
              </h3>

              <ol className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-decimal list-inside font-medium">
                <li>
                  Log in to UTIITSL citizen or PSA agent portal and select <strong>Apply PAN Card (Form 49A)</strong>.
                </li>
                <li>
                  Select <strong>&quot;Digital Mode&quot;</strong> or <strong>&quot;Physical Mode&quot;</strong> and complete applicant information.
                </li>
                <li>
                  On the <strong>&quot;Upload Documents&quot;</strong> screen, locate the applicant coupon number.
                </li>
                <li>
                  Click the <strong>Upload</strong> button next to the application coupon.
                </li>
                <li>
                  Select the Photo field $\rightarrow$ Browse and choose the <strong>213 × 213 px (300 DPI)</strong> file from FileZenith.
                </li>
                <li>
                  Select Signature field $\rightarrow$ Browse and choose the <strong>444 × 205 px</strong> file.
                </li>
                <li>
                  Attach the consolidated supporting documents PDF (&lt;300 KB) and click <strong>&quot;Upload Files&quot;</strong> for instant validation.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Technical Deep Dive: Why Portals Reject & How FileZenith Solves It */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-9 shadow-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Technical Deep-Dive
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Why 90% of Online Tools Fail the NSDL / UTIITSL DPI Check
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              Most generic photo compressors and phone editors export images using default screen resolutions (<strong>72 or 96 DPI</strong>) without JFIF density markers. Here is how FileZenith ensures 100% compliance:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold">
                01
              </div>
              <h3 className="font-bold text-white text-base">Binary 300 DPI Injection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you click Download, our engine parses the raw JPEG byte stream and injects the JFIF APP0 marker with <code className="text-blue-300">units = 1</code> (dots per inch) and <code className="text-blue-300">XDensity = 300, YDensity = 300</code>. Portal validation scripts read the header and immediately pass the file.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold">
                02
              </div>
              <h3 className="font-bold text-white text-base">Magic B&amp;W Shadow Stripper</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mobile phone snapshots of paper signatures inevitably have room lighting shadows and yellow paper tint. Our luminance formula calculates pixel thresholding, replacing ambient grey gradients with pure <code className="text-emerald-300">#FFFFFF</code> white and ink with crisp black.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold">
                03
              </div>
              <h3 className="font-bold text-white text-base">Dual Package Bundling</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                CSC and cyber cafe operators manage dozens of PAN submissions daily. Instead of formatting photos and signatures separately across different tabs, our &quot;Dual Package&quot; tab lets you format both simultaneously and download them in 1 click.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Do's and Don'ts Checklist */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              Government Quality Standards
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              PAN Photo &amp; Signature Quality Standards (Do&apos;s &amp; Don&apos;ts)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Follow these official Income Tax Department photo rules to avoid application rejection or delays in physical PVC card dispatch:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photograph Rules */}
            <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <UserCheck className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">Candidate Photograph Standards</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Clean white or light background:</strong> The background must be completely plain with no patterns, outdoor scenery, or harsh wall shadows.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>70%–80% face coverage:</strong> Head should be centered from the top of the hair to the bottom of the chin within the 213×213 px canvas.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Both ears visible:</strong> Keep head straight facing the lens with eyes open and neutral facial expression.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>No sunglasses, caps, or side angles:</strong> Prescribed medical spectacles are allowed only with clear non-tinted lenses and zero flash glare.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>No selfies with filters or tilted heads:</strong> Use a straight portrait shot taken in good daylight.</span>
                </div>
              </div>
            </div>

            {/* Signature Rules */}
            <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Stamp className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">Candidate Signature Standards</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Black or dark blue ballpoint pen:</strong> Sign on an unruled, clean sheet of pure white paper with steady pen strokes.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Stay within 444 × 205 px boundaries:</strong> Ensure the signature fits inside the box without touching edges or getting truncated.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Minor PAN (Under 18 Years):</strong> Parent or legal guardian must sign as Representative Assessee. Minor does not sign.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>No pencils, light sketch pens, or gel pens:</strong> Ink that bleeds or smudges on paper results in rejected scans.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>No ruled lines or stamps underneath:</strong> Never sign over ruled notebook lines, rubber stamps, or official seals.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Documents Checklist (Rule 114) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Income Tax Rule 114 Checklist
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Valid Supporting Documents for PAN Card Application
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When applying via NSDL or UTIITSL, you must combine all 3 mandatory proofs into <strong>1 single PDF strictly under 300 KB</strong>. Here are the officially recognized documents:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">1. Proof of Identity (POI)</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li>Aadhaar Card (UIDAI)</li>
                <li>Electoral Voter Photo ID Card</li>
                <li>Valid Indian Passport</li>
                <li>Driving License (State RTO)</li>
                <li>Ration Card with photo</li>
                <li>Arm&apos;s License</li>
                <li>Central/State Govt Photo ID Card</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">2. Proof of Address (POA)</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li>Aadhaar Card (UIDAI)</li>
                <li>Electricity Bill (&lt;3 months old)</li>
                <li>Water / Piped Gas Bill (&lt;3 mo)</li>
                <li>Bank Account Statement (&lt;3 mo)</li>
                <li>Landline / Broadband Bill</li>
                <li>Post Office Savings Passbook</li>
                <li>Domicile Certificate issued by Govt</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">3. Proof of Date of Birth (DOB)</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li>Aadhaar Card with full DOB</li>
                <li>10th / Matriculation Mark Sheet</li>
                <li>Birth Certificate (Municipal Corp)</li>
                <li>Valid Indian Passport</li>
                <li>Driving License</li>
                <li>Pension Payment Order (PPO)</li>
                <li>Domicile Certificate showing DOB</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Pro Tip for CSC &amp; Cyber Cafe VLEs:</strong> Aadhaar Card is officially accepted as all three proofs (POI, POA, and DOB) simultaneously. If the candidate has an updated Aadhaar card with full Date of Birth (DD/MM/YYYY), scanning the front and back of the Aadhaar card into 1 page and compressing it under 300 KB in our &quot;Supporting Docs&quot; tab is all you need for instant approval.
            </div>
          </div>
        </section>

        {/* Common Portal Error Troubleshooting */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600">
              Troubleshooting Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Fix Common NSDL &amp; UTIITSL Portal Upload Errors
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If the government portal rejects your file, here is the exact reason and instant 1-click fix:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Error: &quot;Photo dimensions should be 213 × 213 pixels&quot;</span>
              </div>
              <p className="text-slate-600">
                <strong>Why it happens:</strong> Your image was cropped to a generic square (e.g. 200×200 or 300×300).<br />
                <strong>Fix:</strong> FileZenith automatically hard-locks pixel dimensions to exact 213×213 px. Simply upload and click Download.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Error: &quot;Image DPI is not equal to 300&quot;</span>
              </div>
              <p className="text-slate-600">
                <strong>Why it happens:</strong> Standard canvas editors save files at 72 DPI screen resolution.<br />
                <strong>Fix:</strong> Our tool injects binary APP0 JFIF density headers into the JPEG structure, making the portal verify 300 DPI immediately.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Error: &quot;File size should be less than 50 KB&quot;</span>
              </div>
              <p className="text-slate-600">
                <strong>Why it happens:</strong> High-resolution phone camera photos export at 80–200 KB.<br />
                <strong>Fix:</strong> FileZenith executes progressive binary search compression, locking photo size to ~38–45 KB and signature to ~20–25 KB.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Error: &quot;Document PDF size should not exceed 300 KB&quot;</span>
              </div>
              <p className="text-slate-600">
                <strong>Why it happens:</strong> Scanner software scans multi-page documents at 300 DPI into 2MB to 5MB PDFs.<br />
                <strong>Fix:</strong> Switch to our &quot;Supporting Docs&quot; tab and compress your Aadhaar PDF down under 280 KB while keeping all text razor-sharp.
              </p>
            </div>
          </div>
        </section>

        {/* Related CSC & Cyber Cafe Tools Hub */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              CSC Center &amp; Cyber Cafe Suite
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              More Fast Tools for Document Verification &amp; Printing
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Essential in-browser utilities tailored for Indian cyber cafes, CSC VLEs, and sarkari applicants:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/tools/aadhaar-card-print"
              className="group p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  Aadhaar Card Print Tool
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Print e-Aadhaar on PVC card (85.6×54 mm) or multi-copy A4 sheet with zero upload.
              </p>
            </Link>

            <Link
              href="/tools/online-signature-maker#resize"
              className="group p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Stamp className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  Signature Resizer (10–20KB)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean and format signatures for SSC, UPSC OTR, and IBPS recruitment portals.
              </p>
            </Link>

            <Link
              href="/pdf/combine-marksheets"
              className="group p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                  Combine Marksheets (&lt;500KB)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Merge 10th and 12th marksheets into 1 clean A4 PDF strictly under 500 KB.
              </p>
            </Link>

            <Link
              href="/csc-cyber-cafe-tools"
              className="group p-4 rounded-2xl border border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-50 transition-all shadow-2xs hover:shadow-sm"
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
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Frequently Asked Questions (PAN Card Photo &amp; Signature Resizing)
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Clear answers to the most common issues faced during PAN card online applications on NSDL and UTIITSL:
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {OFFICIAL_FAQS.map((faq, idx) => (
              <details key={idx} className="group py-4 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors list-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
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
