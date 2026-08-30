import Link from 'next/link';
import Script from 'next/script';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { AdSlot } from '@/components/AdSlot';
import {
  FileText,
  Edit3,
  Minimize2,
  Combine,
  Split,
  Grid,
  FileCheck,
  ImageIcon,
  UserCheck,
  Scissors,
  Smartphone,
  QrCode,
  Type,
  Code2,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Camera,
  FileImage,
  HelpCircle,
  Lock,
} from 'lucide-react';

const TOOLS = [
  // PDF Studio
  {
    category: 'pdf',
    name: 'Edit PDF Online',
    slug: '/pdf/edit',
    desc: 'Add text, whiteout content, draw annotations, insert image stamps, and rotate pages.',
    icon: Edit3,
    badge: 'Interactive',
    color: 'bg-rose-500 text-white',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    category: 'pdf',
    name: 'Compress PDF',
    slug: '/pdf/compress',
    desc: 'Reduce PDF file size up to 80% with extreme, recommended, and low presets.',
    icon: Minimize2,
    badge: 'Popular',
    color: 'bg-rose-500 text-white',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    category: 'pdf',
    name: 'Compress PDF to 200KB',
    slug: '/pdf/compress-to-200kb',
    desc: 'Shrink PDFs under 200KB for government forms & application uploads.',
    icon: Minimize2,
    color: 'bg-rose-500 text-white',
  },
  {
    category: 'pdf',
    name: 'Merge PDF',
    slug: '/pdf/merge',
    desc: 'Combine multiple PDF documents into a single organized file.',
    icon: Combine,
    badge: 'Essential',
    color: 'bg-rose-500 text-white',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    category: 'pdf',
    name: 'Split PDF',
    slug: '/pdf/split',
    desc: 'Extract specific custom page ranges or separate single pages.',
    icon: Split,
    color: 'bg-rose-500 text-white',
  },
  {
    category: 'pdf',
    name: 'Organize PDF',
    slug: '/pdf/organize',
    desc: 'Visual grid to rotate, reorder, and delete individual PDF pages.',
    icon: Grid,
    color: 'bg-rose-500 text-white',
  },
  {
    category: 'pdf',
    name: 'PDF OCR Text Extractor',
    slug: '/pdf/ocr',
    desc: 'Extract editable text from scanned documents via client-side Tesseract.js.',
    icon: FileCheck,
    badge: 'AI Wasm',
    color: 'bg-rose-500 text-white',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    category: 'pdf',
    name: 'Watermark PDF',
    slug: '/pdf/watermark',
    desc: 'Add custom text or image watermarks to PDF pages.',
    icon: FileText,
    color: 'bg-rose-500 text-white',
  },
  {
    category: 'pdf',
    name: 'Password Protect PDF',
    slug: '/pdf/protect',
    desc: 'Encrypt PDF files with passwords and user permissions.',
    icon: Lock,
    color: 'bg-rose-500 text-white',
  },
  {
    category: 'pdf',
    name: 'PDF to High-Res JPG/PNG',
    slug: '/pdf/to-image',
    desc: 'Convert PDF document pages into high-resolution images.',
    icon: FileImage,
    color: 'bg-rose-500 text-white',
  },

  // Image Studio
  {
    category: 'image',
    name: 'Pics to PDF Converter',
    slug: '/image/pics-to-pdf',
    desc: 'Turn photos, camera pictures, receipts, and scans into a structured PDF document.',
    icon: Camera,
    badge: 'High SEO',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    category: 'image',
    name: 'Convert PNG to JPG',
    slug: '/image/png-to-jpg',
    desc: 'Bulk convert PNG images to JPG format with custom quality & solid background.',
    icon: ImageIcon,
    badge: 'High SEO',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    category: 'image',
    name: 'PNG to PDF Converter',
    slug: '/image/png-to-pdf',
    desc: 'Convert PNG images directly into a PDF document with custom margins.',
    icon: FileText,
    badge: 'Popular',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    category: 'image',
    name: 'Convert JPG to PNG',
    slug: '/image/jpg-to-png',
    desc: 'Convert JPG/JPEG images to high-quality lossless PNG format online.',
    icon: ImageIcon,
    color: 'bg-sky-500 text-white',
  },
  {
    category: 'image',
    name: 'Compress Image (Target KB)',
    slug: '/image/compress',
    desc: 'Set custom target sizes (e.g. <20KB, <50KB) or percentage quality sliders.',
    icon: Minimize2,
    color: 'bg-sky-500 text-white',
  },
  {
    category: 'image',
    name: 'Compress Image to 50KB',
    slug: '/image/compress-to-50kb',
    desc: 'Reduce photo size under 50KB for online forms and photo portals.',
    icon: Minimize2,
    color: 'bg-sky-500 text-white',
  },
  {
    category: 'image',
    name: 'Compress Image to 100KB',
    slug: '/image/compress-to-100kb',
    desc: 'Quickly resize photos under 100KB for identity cards and job uploads.',
    icon: Minimize2,
    color: 'bg-sky-500 text-white',
  },
  {
    category: 'image',
    name: 'Resize Image (Pixels & %)',
    slug: '/image/resize',
    desc: 'Resize JPG, PNG, and WebP images by exact pixels or percentage scaling.',
    icon: ImageIcon,
    color: 'bg-sky-500 text-white',
  },
  {
    category: 'image',
    name: 'Passport Photo Maker',
    slug: '/image/passport-maker',
    desc: 'Crop photos to US 2x2 in, Schengen 35x45 mm, UK, India standards.',
    icon: UserCheck,
    badge: 'Presets',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    category: 'image',
    name: 'AI Background Remover',
    slug: '/image/remove-background',
    desc: 'Isolate subjects and remove photo background 100% locally via WebAssembly.',
    icon: Scissors,
    badge: 'AI Wasm',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    category: 'image',
    name: 'Apple HEIC to JPG',
    slug: '/image/convert-heic',
    desc: 'Batch convert iPhone HEIC/HEIF photos to JPG or PNG.',
    icon: Smartphone,
    color: 'bg-sky-500 text-white',
  },

  // Daily Quick Utilities
  {
    category: 'utility',
    name: 'QR Code Generator',
    slug: '/utility/qr-generator',
    desc: 'Create vector SVG/PNG QR codes with logo overlay & custom colors.',
    icon: QrCode,
    badge: 'Vector SVG',
    color: 'bg-emerald-500 text-white',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    category: 'utility',
    name: 'Word Counter & Density',
    slug: '/utility/word-counter',
    desc: 'Live word, character, reading speed, and SEO keyword density stats.',
    icon: Type,
    color: 'bg-emerald-500 text-white',
  },
  {
    category: 'utility',
    name: 'JSON Formatter & CSV',
    slug: '/utility/json-formatter',
    desc: 'Prettify, minify, validate, and convert JSON arrays to CSV or YAML.',
    icon: Code2,
    color: 'bg-emerald-500 text-white',
  },
];

const HOMEPAGE_FAQS = [
  {
    q: 'How is FileZenith different from online tools like iLovePDF or Smallpdf?',
    a: 'Unlike traditional cloud converters like iLovePDF or Smallpdf that upload your private documents to remote servers over the internet, FileZenith processes 100% of your PDFs and images locally on your computer or phone using WebAssembly. Your confidential files never leave your device, eliminating data leak risks while offering unlimited free conversions without subscriptions.',
  },
  {
    q: 'Is FileZenith really 100% free with no login or subscription fees?',
    a: "Yes! FileZenith is 100% free forever. You don't need to sign up, log in, enter a credit card, or pay any subscription fees to access all 41 PDF, image, and utility tools.",
  },
  {
    q: 'Can I compress PDF files under 200KB for official government job applications?',
    a: 'Yes! Our specialized PDF compression engine allows students and applicants in India and worldwide to shrink PDF files under 200KB or 50KB to meet strict portal requirements for government applications, passport forms, and college admissions.',
  },
  {
    q: 'Are my uploaded documents stored on any server?',
    a: "Never. FileZenith operates on a 100% Zero-Server architecture. Your files are converted inside your browser's RAM and CPU memory, making it the safest tool suite for legal documents, tax forms, and personal photos.",
  },
  {
    q: 'Does FileZenith work on mobile phones and tablets?',
    a: 'Yes! FileZenith works seamlessly across Android smartphones, iPhones, iPads, MacBooks, Windows PCs, and Linux devices using any modern browser.',
  },
];

const JSON_LD_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FileZenith',
    url: 'https://filezenith.com',
    description: '100% Free Online PDF, Image & Utility Studio. Zero Server File Uploads.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://filezenith.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FileZenith',
    url: 'https://filezenith.com',
    logo: 'https://filezenith.com/1.png',
    sameAs: ['https://filezenith.com'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/70">
      {/* Inject Homepage Structured Data JSON-LD Schemas */}
      {JSON_LD_SCHEMAS.map((schema, idx) => (
        <Script
          key={idx}
          id={`homepage-json-ld-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Human-Designed Light Hero Banner */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <PrivacyBadge />
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Ultra-Fast Local GPU/CPU Processing
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
            100% Free Online <span className="bg-gradient-to-r from-indigo-600 via-rose-600 to-emerald-600 bg-clip-text text-transparent">PDF, Image & Utility</span> Studio
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            FileZenith processes your PDFs, images, and documents 100% locally inside your web browser using client-side WebAssembly technology. Enjoy unlimited file conversions with zero server file uploads, no account registration, and total data privacy.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-black text-slate-700">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Free • No Subscriptions
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              No Login / No Account
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              100% Secure Data Privacy
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <Zap className="w-4 h-4 text-amber-600" />
              Unlimited Usage
            </span>
          </div>
        </div>
      </section>

      {/* Header Leaderboard Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdSlot slotType="header-leaderboard" />
      </div>

      {/* Tool Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* PDF Studio Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  PDF Studio
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Interactive editing, 200KB compression, merging, splitting & OCR
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.filter((t) => t.category === 'pdf').map((tool) => {
              const IconComp = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="group relative bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl ${tool.color} flex items-center justify-center shadow-xs`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      {tool.badge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tool.badgeStyle || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                        {tool.name}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>100% Client-Side</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero Upload
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Image Studio Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Image Studio
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Pics to PDF, PNG to JPG, background removal, passport photos & compression
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.filter((t) => t.category === 'image').map((tool) => {
              const IconComp = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="group relative bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl ${tool.color} flex items-center justify-center shadow-xs`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      {tool.badge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tool.badgeStyle || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                        {tool.name}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>100% Client-Side</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero Upload
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Daily Quick Utilities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Daily Quick Utilities
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Dynamic QR codes with logo embed, word density counter, and JSON formatting
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.filter((t) => t.category === 'utility').map((tool) => {
              const IconComp = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="group relative bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl ${tool.color} flex items-center justify-center shadow-xs`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      {tool.badge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tool.badgeStyle || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                        {tool.name}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>100% Client-Side</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero Upload
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Homepage Google "People Also Ask" FAQ Section */}
        <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Everything you need to know about FileZenith privacy, zero-server architecture, and limits.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {HOMEPAGE_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="text-indigo-600">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
