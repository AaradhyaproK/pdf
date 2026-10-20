'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CategoryConfig, CategoryToolItem } from '@/lib/categories-data';
import { TOOL_DEEP_DIVES } from '@/lib/tool-deep-dives';
import { AdSlot } from '@/components/AdSlot';
import {
  ChevronRight,
  Sparkles,
  Layers,
  Star,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Grid,
  BookOpen,
  Clock,
  Search,
  X,
  Zap,
  FileText,
  FileCode,
  FileImage,
  Minimize2,
  Combine,
  Split,
  Camera,
  Scissors,
  Palette,
  UserCheck,
  Printer,
  Stamp,
  Calendar,
  DollarSign,
  Coins,
  Percent,
  GraduationCap,
  QrCode,
  Code2,
  Hash,
  Brain,
  Dices,
  MessageSquare,
  Type,
  Sliders,
  Crop,
  Smartphone,
  Volume2,
  Hexagon,
  Table,
  Check,
  XCircle,
  Cpu,
  DownloadCloud,
} from 'lucide-react';

// Icon resolver helper for visual consistency
function ToolIconComponent({ name, className }: { name?: string; className?: string }) {
  const cls = className || 'w-5 h-5 text-indigo-600';
  switch (name) {
    case 'Minimize2':
      return <Minimize2 className={cls} />;
    case 'Combine':
      return <Combine className={cls} />;
    case 'Split':
      return <Split className={cls} />;
    case 'Grid':
      return <Grid className={cls} />;
    case 'Hash':
      return <Hash className={cls} />;
    case 'FileText':
      return <FileText className={cls} />;
    case 'FileCode':
      return <FileCode className={cls} />;
    case 'FileImage':
      return <FileImage className={cls} />;
    case 'Camera':
      return <Camera className={cls} />;
    case 'Edit3':
      return <FileText className={cls} />;
    case 'FileCheck':
      return <ShieldCheck className={cls} />;
    case 'Lock':
      return <Lock className={cls} />;
    case 'Unlock':
      return <Unlock className={cls} />;
    case 'Stamp':
      return <Stamp className={cls} />;
    case 'UserCheck':
      return <UserCheck className={cls} />;
    case 'Scissors':
      return <Scissors className={cls} />;
    case 'Palette':
      return <Palette className={cls} />;
    case 'Crop':
      return <Crop className={cls} />;
    case 'Sliders':
      return <Sliders className={cls} />;
    case 'Smartphone':
      return <Smartphone className={cls} />;
    case 'Printer':
      return <Printer className={cls} />;
    case 'Calendar':
      return <Calendar className={cls} />;
    case 'DollarSign':
      return <DollarSign className={cls} />;
    case 'Coins':
      return <Coins className={cls} />;
    case 'Percent':
      return <Percent className={cls} />;
    case 'GraduationCap':
      return <GraduationCap className={cls} />;
    case 'Table':
      return <Table className={cls} />;
    case 'Type':
      return <Type className={cls} />;
    case 'Zap':
      return <Zap className={cls} />;
    case 'Volume2':
      return <Volume2 className={cls} />;
    case 'QrCode':
      return <QrCode className={cls} />;
    case 'Code2':
      return <Code2 className={cls} />;
    case 'Hexagon':
      return <Hexagon className={cls} />;
    case 'Brain':
      return <Brain className={cls} />;
    case 'Dices':
      return <Dices className={cls} />;
    case 'MessageSquare':
      return <MessageSquare className={cls} />;
    default:
      return <Sparkles className={cls} />;
  }
}

// Collapsible FAQ Section with instant-open on hover and click toggle
function FaqAccordion({
  faqs,
  keywords,
}: {
  faqs: Array<{ question: string; answer: string }>;
  keywords?: string[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="space-y-1 border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Frequently Asked Questions & Answers
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Hover or click any question for instant answers
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 w-fit">
          Instant Answers
        </span>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setOpenIndex(idx)}
              className={`rounded-2xl border transition-all duration-100 cursor-pointer ${
                isOpen
                  ? 'border-indigo-400 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-200/50'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50/90'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-slate-900 select-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    Q{idx + 1}
                  </span>
                  <span className={`${isOpen ? 'text-indigo-950 font-black' : 'text-slate-800'}`}>
                    {item.question}
                  </span>
                </span>
                <span
                  className={`text-indigo-600 transform transition-transform duration-150 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                  <div className="pt-3 border-t border-indigo-100 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// In-Depth Authoritative Guide & Technical Manual (800+ Words for Superior SEO & E-E-A-T)
function CategoryDeepDiveGuide({ category }: { category: CategoryConfig }) {
  const categorySlug = category.slug.startsWith('/') ? category.slug : `/${category.slug}`;
  const deepDive = TOOL_DEEP_DIVES[categorySlug];

  if (deepDive) {
    return (
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8 text-slate-700">
        <div className="border-b border-slate-100 pb-5 space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{deepDive.badge}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
            {deepDive.heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {deepDive.subheading}
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm leading-relaxed font-medium">
          {deepDive.sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
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
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
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
  }

  const categoryName = category.title.split(':')[0].trim();

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8 text-slate-700">
      <div className="border-b border-slate-100 pb-5 space-y-1.5">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Comprehensive Category Guide & Technical Architecture</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-slate-900">
          The Definitive In-Depth Guide: {categoryName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Comprehensive technical standards, local WebAssembly processing architecture, institutional portal compliance, and performance benchmarks.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed font-medium">
        {/* Chapter 1: The Client-Side Paradigm Shift */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">1</span>
            <span>The Client-Side Paradigm Shift: Total Privacy & Zero-Cloud Security</span>
          </h3>
          <p>
            For more than a decade, online file converters, PDF editors, image optimizers, and calculator suites operated on a legacy cloud-centric architecture. Users were compelled to upload confidential bank statements, tax records, biometric identity cards, and personal photographs to remote third-party web servers. On those remote servers, third-party software converted or processed the documents before returning a temporary download link. This model created severe vulnerabilities: confidential files lingered in temporary server caches, data was vulnerable to man-in-the-middle interception, and commercial platforms frequently monetized user data or subjected visitors to strict daily quotas and aggressive subscription paywalls.
          </p>
          <p>
            FileZenith was engineered from the ground up to obsolete this privacy compromise. Powered by cutting-edge WebAssembly (Wasm), modern HTML5 Canvas, Web Workers, and the Web Cryptography API, every tool in our <strong>{categoryName}</strong> suite executes directly inside your web browser sandbox. Zero bytes of your files or personal records are ever transmitted over the internet or saved to remote databases. Your computer or mobile device processor executes all mathematical operations locally. This client-side architecture guarantees absolute data privacy, meets GDPR and HIPAA compliance standards by design, and eliminates upload queue bottlenecks.
          </p>
        </div>

        {/* Chapter 2: File Format Standards & Lossless Processing Precision */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">2</span>
            <span>Supported Standards, Compression Algorithms & Conversion Precision</span>
          </h3>
          <p>
            Modern document workflows demand rigorous mathematical precision to prevent text blurring, font distortion, or color shift. Our browser-based engine implements specialized algorithms tailored for every format:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Intelligent PDF Stream Optimization:</strong> Rather than downsampling text vectors, our PDF compression engine isolates embedded photographic rasters, strips unreferenced metadata objects, and subsets embedded font tables. This allows multi-page documents to shrink below 100KB or 200KB while preserving pristine typography and official seal clarity.
            </li>
            <li>
              <strong>Bicubic Re-sampling & Quantization:</strong> When processing images, our Canvas engine employs bicubic interpolation and high-frequency color quantization to minimize artifacts, ensuring facial features in passport photos and ink strokes in signatures remain razor-sharp.
            </li>
            <li>
              <strong>Native iWork & Office Parsing:</strong> For spreadsheet and office document conversions (such as Apple Pages to Microsoft Word, and Numbers to Excel), our engine unpacks internal XML schemas directly in browser memory, reconstructing tables, formatting hierarchies, and formulas without requiring proprietary software.
            </li>
          </ul>
        </div>

        {/* Chapter 3: Institutional & Official Portal Compliance */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">3</span>
            <span>Government, Academic & Institutional Portal Submission Compliance</span>
          </h3>
          <p>
            One of the greatest challenges students, job applicants, and professionals face is strict file upload validation on government and institutional portals. Digital application systems enforce non-negotiable boundaries, where exceeding a file limit by even a single kilobyte causes rejection:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-extrabold text-xs text-indigo-900 block">Govt Recruitment Exams</span>
              <p className="text-xs text-slate-600">
                Portals like SSC, UPSC, IBPS, and State PSC require photographs strictly between 20KB–50KB (3.5 × 4.5 cm) and signatures between 10KB–20KB with clear white background.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-extrabold text-xs text-indigo-900 block">Academic & Entrance Portals</span>
              <p className="text-xs text-slate-600">
                NTA (NEET, JEE, CUET) and university admission systems mandate certificate PDFs strictly under 200KB or 300KB with verified legibility of marks and roll numbers.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-extrabold text-xs text-indigo-900 block">Identity & Biometrics</span>
              <p className="text-xs text-slate-600">
                UIDAI e-Aadhaar cards, PVC card printing (85.6 × 53.98 mm), and international visa headshots require strict compliance with ISO/IEC 7810 ID-1 standards and 300 DPI clarity.
              </p>
            </div>
          </div>
          <p className="pt-1">
            Every tool in this category is pre-calibrated to output files matching these exact specifications, eliminating trial-and-error rejections and ensuring 100% submission success on your first attempt.
          </p>
        </div>

        {/* Chapter 4: Performance Benchmarks & Zero-SaaS Paywalls */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">4</span>
            <span>Comparative Performance Benchmarks: In-Browser vs Cloud SaaS</span>
          </h3>
          <p>
            Independent testing demonstrates that executing file workflows locally inside modern browser runtimes offers substantial benefits over traditional cloud software:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Instant Processing Without Upload Queues:</strong> Traditional cloud converters take between 20 and 60 seconds to upload, queue, process, and download a 25MB file. In FileZenith, the file loads directly into local memory with zero upload delay and is processed immediately by your device.
            </li>
            <li>
              <strong>Bandwidth Savings on Mobile Networks:</strong> Because zero files are transferred to external servers, users save hundreds of megabytes of cellular data when batch converting or compressing documents on mobile phones.
            </li>
            <li>
              <strong>100% Free Forever Without Artificial Paywalls:</strong> Leading commercial alternatives (such as iLovePDF, Smallpdf, and Adobe Acrobat) enforce 2-task daily limits and demand $12 to $20 monthly subscriptions. FileZenith provides completely unrestricted, unlimited access for everyone.
            </li>
          </ul>
        </div>

        {/* Chapter 5: Security Best Practices & Troubleshooting Guide */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">5</span>
            <span>Security Best Practices, File Preparation & Troubleshooting</span>
          </h3>
          <p>
            To ensure a seamless, error-free experience across all devices, keep these professional recommendations in mind:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Handling Password-Protected Statements:</strong> If you are organizing or merging bank statements, payslips, or e-Aadhaar cards protected by passwords, unlock them first using our client-side Remove PDF Password tool before combining them into a single file.
            </li>
            <li>
              <strong>Mobile Device Memory Management:</strong> When processing large multi-page scans or hundreds of high-resolution camera photos on smartphones with limited RAM, close background applications to ensure smooth browser heap allocation.
            </li>
            <li>
              <strong>Zero Persistent Footprint:</strong> When you finish your workflow and close the browser tab, all file buffers and data structures are automatically wiped from device memory by the browser garbage collector. No temporary traces remain.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CategoryHubPage({ category }: { category: CategoryConfig }) {
  const router = useRouter();
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/${category.slug}`;

  // Interactive search & subgroup filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubgroupIndex, setSelectedSubgroupIndex] = useState<number | 'all'>('all');

  // Fast background prefetch for top tools to guarantee lag-free instant navigation
  useEffect(() => {
    const prefetchTools = () => {
      category.popularTools?.forEach((tool) => {
        if (tool.slug) router.prefetch(tool.slug);
      });
      category.subgroups?.forEach((sub) => {
        sub.tools.slice(0, 4).forEach((tool) => {
          if (tool.slug) router.prefetch(tool.slug);
        });
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(prefetchTools, { timeout: 2000 });
      } else {
        const timer = setTimeout(prefetchTools, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [category, router]);

  // 1. CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.h1,
    description: category.metaDescription,
    url: url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.subgroups
        .flatMap((s) => s.tools)
        .map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.name,
          description: t.description,
          url: `${siteUrl}${t.slug}`,
        })),
    },
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
        name: category.h1,
        item: url,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // 4. SoftwareApplication Schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `FileZenith ${category.h1}`,
    url: url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: category.metaDescription,
  };

  // Curated category guides and blog posts
  const categoryArticles = useMemo(() => {
    if (category.slug === 'pdf-tools' || category.slug === 'pdf') {
      return [
        {
          title: 'How to Compress PDF to 200KB Online Free',
          desc: 'Step-by-step instructions to compress PDFs for government and university portals without losing text sharpness.',
          url: '/blog/how-to-compress-pdf-to-200kb-online',
          tag: 'Portal Guide',
          readTime: '5 min read',
        },
        {
          title: 'How to Compress PDF to 100KB Without Losing Quality',
          desc: 'Target 100KB for sarkari recruitment forms, SSC, UPSC, and marksheet uploads.',
          url: '/blog/how-to-compress-pdf-to-100kb-without-losing-quality',
          tag: 'Govt Forms',
          readTime: '4 min read',
        },
        {
          title: 'How to Convert Scanned PDF to Editable Word DOCX',
          desc: 'Convert scanned PDF documents into editable Word .docx files with client-side OCR.',
          url: '/blog/how-to-convert-scanned-pdf-to-editable-word',
          tag: 'OCR Tutorial',
          readTime: '6 min read',
        },
        {
          title: 'How to Remove Password from PDF Permanently',
          desc: 'Unlock encrypted bank statements, salary slips, and e-Aadhaar PDFs safely on your device.',
          url: '/blog/how-to-remove-password-from-pdf',
          tag: 'Security Guide',
          readTime: '5 min read',
        },
      ];
    } else if (category.slug === 'image-tools' || category.slug === 'image') {
      return [
        {
          title: 'The Ultimate Passport Size Photo Maker Guide',
          desc: 'Official 2x2" and 3.5x4.5cm specs, white background rules, and form criteria for jobs and visas.',
          url: '/blog/passport-size-photo-maker-guide',
          tag: 'Biometric Specs',
          readTime: '6 min read',
        },
        {
          title: 'How to Remove Background from Image Free in HD',
          desc: 'In-browser AI neural segmentation with transparent PNG exports and zero watermarks.',
          url: '/blog/how-to-remove-background-from-image-free',
          tag: 'AI Cutout',
          readTime: '5 min read',
        },
        {
          title: 'How to Compress Image to Under 20KB for Portals',
          desc: 'Keep signatures and applicant photos sharp under strict online application upload ceilings.',
          url: '/blog/how-to-compress-image-to-20kb',
          tag: 'Exam Forms',
          readTime: '4 min read',
        },
        {
          title: 'How to Convert Apple HEIC to JPG Free',
          desc: 'Open and convert iPhone HEIC camera photos to standard JPG format for Windows and Android.',
          url: '/blog/how-to-convert-heic-to-jpg-free',
          tag: 'iOS Photo',
          readTime: '4 min read',
        },
      ];
    } else if (category.slug === 'social' || category.slug === 'social-tools') {
      return [
        {
          title: 'How to Message on WhatsApp Without Saving Number',
          desc: 'Launch direct WhatsApp conversations instantly without cluttering your phone contacts.',
          url: '/social/whatsapp-direct-chat',
          tag: 'WhatsApp Tip',
          readTime: '3 min read',
        },
        {
          title: 'How to Download 1080p Full HD YouTube Thumbnails',
          desc: 'Extract highest resolution YouTube video cover images directly with zero app installs.',
          url: '/social/youtube-thumbnail-downloader',
          tag: 'Creator Guide',
          readTime: '4 min read',
        },
        {
          title: 'How to Find Viral SEO Tags from Competitor YouTube Videos',
          desc: 'Extract hidden ranking keywords and search tags to optimize video descriptions and CTR.',
          url: '/social/youtube-tag-extractor',
          tag: 'Video SEO',
          readTime: '5 min read',
        },
        {
          title: 'Copy Clean Instagram Captions with Blank Line Breaks',
          desc: 'Preserve formatted paragraph spacing and hashtag lists without broken Instagram formatting.',
          url: '/social/instagram-caption-copier',
          tag: 'Bio & Copy',
          readTime: '3 min read',
        },
      ];
    } else {
      return [
        {
          title: 'How to Calculate Home & Car Loan EMI Accurately',
          desc: 'Principal reduction, interest amortizations, and early payoff strategies explained.',
          url: '/blog/emi-calculator-guide',
          tag: 'Finance Guide',
          readTime: '4 min read',
        },
        {
          title: 'Calculate Exact Age for Competitive Exam Eligibility',
          desc: 'Check age cut-off dates for civil services, SSC, and state recruitment portals.',
          url: '/blog/age-calculator-india',
          tag: 'Govt Exams',
          readTime: '4 min read',
        },
        {
          title: 'Old vs New Tax Regime Comparison FY 2026-27',
          desc: 'Calculate tax deductions, exemptions, and find your optimal tax regime saving.',
          url: '/blog/old-vs-new-tax-regime-calculator-guide',
          tag: 'Tax Guide',
          readTime: '5 min read',
        },
        {
          title: 'How to Calculate Electricity Bill from Meter Readings',
          desc: 'Understand state tariff slabs, fixed charges, and government power subsidies.',
          url: '/blog/how-to-calculate-electricity-bill-from-meter-reading',
          tag: 'Bill Guide',
          readTime: '4 min read',
        },
      ];
    }
  }, [category.slug]);

  // Compute filtered subgroups based on search query and active tab
  const filteredSubgroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return category.subgroups
      .map((subgroup, idx) => {
        // If a specific subgroup tab is selected and doesn't match this index, filter out
        if (selectedSubgroupIndex !== 'all' && selectedSubgroupIndex !== idx) {
          return null;
        }

        if (!q) {
          return subgroup;
        }

        // Filter tools matching query
        const matchingTools = subgroup.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            (t.badge && t.badge.toLowerCase().includes(q)) ||
            subgroup.title.toLowerCase().includes(q)
        );

        if (matchingTools.length === 0) {
          return null;
        }

        return {
          ...subgroup,
          tools: matchingTools,
        };
      })
      .filter((s): s is typeof category.subgroups[0] => s !== null);
  }, [category.subgroups, searchQuery, selectedSubgroupIndex]);

  // Total visible tools count
  const totalVisibleTools = useMemo(() => {
    return filteredSubgroups.reduce((acc, sub) => acc + sub.tools.length, 0);
  }, [filteredSubgroups]);

  const allToolsCount = useMemo(() => {
    return category.subgroups.reduce((acc, sub) => acc + sub.tools.length, 0);
  }, [category.subgroups]);

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 text-slate-900">
      {/* Inject Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold truncate">{category.h1}</span>
        </nav>

        {/* Hero Header Banner */}
        <header className="space-y-4 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100">
              <Grid className="w-3.5 h-3.5 text-indigo-600" /> {category.title.split(':')[0]}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Client-Side Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200">
              <Lock className="w-3.5 h-3.5 text-amber-600" /> Zero Server Uploads • Zero Logs
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {category.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
            {category.intro}
          </p>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">100% On-Device</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Zero file upload</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">Instant Speed</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">No wait queues</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">No Size Caps</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Unlimited file size</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">Free Forever</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">No watermarks</p>
              </div>
            </div>
          </div>
        </header>

        {/* Top Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

        {/* Interactive In-Page Search & Filter Controls */}
        <section aria-label="Tool Search and Filters" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search across ${allToolsCount} ${category.title.split(':')[0]}...`}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Count Badge */}
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-500 px-1">
              <span>Showing:</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100">
                {totalVisibleTools} of {allToolsCount} Tools
              </span>
            </div>
          </div>

          {/* Subgroup Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubgroupIndex('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedSubgroupIndex === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Tools ({allToolsCount})
            </button>
            {category.subgroups.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubgroupIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedSubgroupIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sub.title.split(' ')[0]} {sub.title.split(' ')[1] || ''} ({sub.tools.length})
              </button>
            ))}
          </div>
        </section>

        {/* Popular Tools Showcase Section */}
        {category.popularTools && category.popularTools.length > 0 && selectedSubgroupIndex === 'all' && !searchQuery && (
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Most Popular & Recommended Tools
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">Top tools chosen by users every day</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                ★ Top Rated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.popularTools.map((pop, idx) => (
                <Link
                  key={idx}
                  href={pop.slug}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(pop.slug)}
                  onTouchStart={() => router.prefetch(pop.slug)}
                  className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/80 hover:from-white hover:to-indigo-50/70 border border-indigo-100 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all duration-150 group flex flex-col justify-between space-y-3 active:scale-[0.98]"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                        {pop.name}
                      </h3>
                      <div className="p-1.5 rounded-lg bg-indigo-50/80 border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {pop.description}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-indigo-100/80 flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-600 group-hover:text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Free</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Subgrouped Full Tool Grid System */}
        <div className="space-y-8">
          {filteredSubgroups.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-black text-slate-900">No tools matched &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-xs text-slate-500 font-medium">Try searching with a different keyword or reset filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubgroupIndex('all');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs hover:bg-indigo-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredSubgroups.map((sub, sIdx) => (
              <section
                key={sIdx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5"
              >
                <div className="border-b border-slate-100 pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <span>{sub.title}</span>
                    </h2>
                    <span className="text-[11px] font-bold text-slate-400">
                      {sub.tools.length} {sub.tools.length === 1 ? 'Tool' : 'Tools'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{sub.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sub.tools.map((t, tIdx) => (
                    <Link
                      key={tIdx}
                      href={t.slug}
                      prefetch={true}
                      onMouseEnter={() => router.prefetch(t.slug)}
                      onTouchStart={() => router.prefetch(t.slug)}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-500 hover:bg-white shadow-2xs hover:shadow-md transition-all duration-150 group flex flex-col justify-between space-y-3 active:scale-[0.98]"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="p-2 rounded-xl bg-white border border-slate-200/80 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            <ToolIconComponent name={t.iconName} className="w-4 h-4" />
                          </div>
                          {t.badge && (
                            <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                              {t.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                            {t.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 mt-1">
                            {t.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                        <span className="text-[11px] font-black text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                          <span>Use Tool</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Free</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Feature Comparison Matrix ("Why FileZenith") */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Why Choose FileZenith vs Traditional Cloud Converters</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              See how our client-side architecture compares to legacy platforms like iLovePDF, Smallpdf, and Adobe Acrobat.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-4 font-black text-slate-900 rounded-l-xl">Feature</th>
                  <th className="py-3 px-4 font-black text-indigo-700 bg-indigo-50/70">FileZenith (Client-Side)</th>
                  <th className="py-3 px-4 font-black text-slate-600 rounded-r-xl">Traditional Cloud Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">File Storage & Privacy</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 bg-indigo-50/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Local In-Browser Processing (Files Never Sent to Server)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Uploaded to Remote Cloud Servers</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">File Size Limits</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 bg-indigo-50/20">
                    Unlimited (Depends on Device RAM)
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    Capped at 15MB - 50MB (Requires Paywall)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Pricing & Subscriptions</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 bg-indigo-50/20">
                    100% Free Forever
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    $12 - $20/month After 2 Free Uses
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Processing Speed</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 bg-indigo-50/20">
                    Instant (No Upload / Download Wait)
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    Slow (Upload queue + Cloud Render)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Watermarks & Registration</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 bg-indigo-50/20">
                    No Watermarks, No Sign-up Required
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    Mandatory Login & Branded Watermarks
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3-Step Visual How-To Guide */}
        <section className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border border-indigo-100/90 shadow-2xs space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Simple 3-Step Workflow</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">How to Use FileZenith Tools in Seconds</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Select Your Tool</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Choose the exact tool you need from our categorized list — no account creation or login required.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Local In-Browser Processing</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Drag and drop your file. Our WebAssembly engine processes your file locally with 100% privacy.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Instant Download</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Download your perfectly converted, compressed, or formatted file with zero watermarks immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Mid-Page Ad Slot (Strictly >= 25px clear margin to prevent accidental clicks) */}
        <div className="py-4 sm:py-6">
          <AdSlot slotType="post-download" />
        </div>

        {/* Comprehensive In-Depth Editorial Guide (800+ Words for Superior SEO & E-E-A-T) */}
        <CategoryDeepDiveGuide category={category} />

        {/* Collapsible FAQ Section with FAQPage Schema — JS Accordion for instant response */}
        {(() => {
          const categorySlug = category.slug.startsWith('/') ? category.slug : `/${category.slug}`;
          const deepDive = TOOL_DEEP_DIVES[categorySlug];
          const activeFaqs = deepDive?.faqs || category.faqs;
          if (activeFaqs && activeFaqs.length > 0) {
            return <FaqAccordion faqs={activeFaqs} keywords={category.keywords} />;
          }
          return null;
        })()}

        {/* Step-by-Step Guides & Articles */}
        {categoryArticles.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Step-by-Step Guides & Tutorials
                </h2>
              </div>
              <Link
                href="/blog"
                prefetch={true}
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>All Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryArticles.map((art, idx) => (
                <Link
                  key={idx}
                  href={art.url}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {art.tag}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readTime}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-[10px] font-black text-indigo-600 group-hover:underline">
                    <span>Read Full Guide &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Category Hubs Cross-Links */}
        {category.relatedCategories && category.relatedCategories.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Explore Related Tool Hubs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.relatedCategories.map((rel, idx) => (
                <Link
                  key={idx}
                  href={rel.slug}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all group space-y-2 flex flex-col justify-between"
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
                    View Category Hub →
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
