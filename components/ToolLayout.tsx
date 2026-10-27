'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AdSlot } from './AdSlot';
import { RelatedToolsSection } from './RelatedToolsSection';
import { SEOContent } from './SEOContent';
import { trackVisitorHeartbeat } from '@/lib/admin-store';
import {
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  FileText,
  Camera,
  Minimize2,
  Cpu,
  Smartphone,
  Download,
  Layers,
  Wrench,
  Check,
} from 'lucide-react';

export interface ToolLayoutProps {
  slug: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  noCardWrapper?: boolean;
  hideTitle?: boolean;
  hideSidebar?: boolean;
  children: ReactNode;
}

function getSidebarTools(slug: string, currentPath: string = '') {
  const normSlug = slug ? slug.trim().replace(/^\/+|\/+$/g, '').toLowerCase() : '';
  const normPath = currentPath ? currentPath.trim().replace(/^\/+|\/+$/g, '').toLowerCase() : '';
  const norm = normSlug || normPath;

  let pool: Array<{ name: string; href: string; desc: string; badge?: string }> = [];

  if (norm.startsWith('image') || norm.includes('photo') || norm.includes('resizer')) {
    pool = [
      { name: 'Pics to PDF Converter', href: '/image/pics-to-pdf', desc: 'Turn photos & scans into clean PDF', badge: 'Popular' },
      { name: 'Compress Image to 50KB', href: '/image/compress-to-50kb', desc: 'Target size for portal uploads', badge: '50KB' },
      { name: 'Compress Image to 20KB', href: '/image/compress-to-20kb', desc: 'Strict signature & photo spec', badge: '20KB' },
      { name: 'Compress Image to 100KB', href: '/image/compress-to-100kb', desc: 'Shrink photo under 100KB for identity', badge: '100KB' },
      { name: 'WebP to JPG Converter', href: '/image/webp-to-jpg', desc: 'Convert WebP images with white fill', badge: 'Bulk' },
      { name: 'JPG to WebP Converter', href: '/image/jpg-to-webp', desc: 'Convert to modern WebP (80% smaller)', badge: 'Web' },
      { name: 'PNG to JPG Converter', href: '/image/png-to-jpg', desc: 'Lossless quality PNG to JPG conversion', badge: 'Fast' },
      { name: 'Passport Photo Maker', href: '/image/passport-maker', desc: 'US, UK, Schengen & India specs', badge: 'Presets' },
      { name: 'AI Background Remover', href: '/image/remove-background', desc: '100% browser-based AI removal', badge: 'AI WASM' },
      { name: 'Apple HEIC to JPG', href: '/image/convert-heic', desc: 'Convert iPhone HEIC photos to JPG', badge: 'Apple' },
      { name: 'Image Cropper & Aspect', href: '/image/crop', desc: 'Crop 1:1, 16:9, rotate & flip', badge: 'Crop' },
    ];
  } else if (norm.startsWith('pdf') || norm.includes('pdf')) {
    pool = [
      { name: 'Compress PDF Online', href: '/pdf/compress', desc: 'Slash document size up to 80%', badge: 'Popular' },
      { name: 'Compress PDF to 200KB', href: '/pdf/compress-to-200kb', desc: 'Exam & Sarkari portal target size', badge: 'Popular' },
      { name: 'Merge Multiple PDFs', href: '/pdf/merge', desc: 'Combine multiple documents into one', badge: 'Fast' },
      { name: 'Edit PDF Online', href: '/pdf/edit', desc: 'Annotate, sign, whiteout & draw', badge: 'Interactive' },
      { name: 'Split PDF Pages', href: '/pdf/split', desc: 'Extract custom page ranges & sheets', badge: 'Extract' },
      { name: 'Compress PDF to 100KB', href: '/pdf/compress-to-100kb', desc: 'Target size for strict portals', badge: '100KB' },
      { name: 'PDF to Word (DOCX)', href: '/pdf/pdf-to-word', desc: 'Convert PDF to editable Word document', badge: 'Popular' },
      { name: 'Word to PDF Converter', href: '/pdf/word-to-pdf', desc: 'Convert Word DOCX to crisp PDF', badge: 'DOCX' },
      { name: 'Pics to PDF (JPG to PDF)', href: '/image/pics-to-pdf', desc: 'Convert camera photos to PDF', badge: 'Top Tool' },
      { name: 'PDF OCR Text Extractor', href: '/pdf/ocr', desc: 'Extract editable text via local AI', badge: 'WASM' },
      { name: 'PDF Page Numberer', href: '/pdf/page-numbers', desc: 'Add Page X of Y & custom footers', badge: 'New' },
      { name: 'Password Protect PDF', href: '/pdf/protect', desc: 'Encrypt PDF with client password', badge: 'Secure' },
      { name: 'Remove PDF Password', href: '/pdf/remove-password', desc: 'Unlock and remove PDF password', badge: 'Unlock' },
    ];
  } else {
    pool = [
      { name: 'Compress PDF Online', href: '/pdf/compress', desc: 'Slash document size up to 80%', badge: 'Popular' },
      { name: 'Pics to PDF (Photos to PDF)', href: '/image/pics-to-pdf', desc: 'Convert scans to clean document', badge: 'Top Tool' },
      { name: 'Electricity Bill Calculator', href: '/utility/electricity-bill-calculator', desc: 'Calculate tariff slab costs', badge: 'Utility' },
      { name: 'EPF Balance Calculator', href: '/utility/epf-calculator', desc: 'Estimate retirement corpus growth', badge: 'Finance' },
      { name: 'Age Calculator & Birthday', href: '/utility/age-calculator', desc: 'Exact years, months & days calculation', badge: 'Age' },
      { name: 'Percentage Calculator', href: '/utility/percentage-calculator', desc: 'Calculate percentage change & marks', badge: 'Math' },
      { name: 'WhatsApp Direct Chat', href: '/social/whatsapp-direct-chat', desc: 'Chat without saving contact number', badge: 'Social' },
      { name: 'QR Code Generator', href: '/utility/qr-generator', desc: 'Custom QR codes with colors & logo', badge: 'QR' },
      { name: 'EMI Loan Calculator', href: '/utility/emi-calculator', desc: 'Calculate monthly home/car loan EMI', badge: 'Finance' },
    ];
  }

  // Filter out the current tool page so the current tool is NEVER shown in its own sidebar
  return pool
    .filter((tool) => {
      const toolNorm = tool.href.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
      if (normSlug && (toolNorm === normSlug || toolNorm.endsWith(normSlug) || normSlug.endsWith(toolNorm))) {
        return false;
      }
      if (normPath && (toolNorm === normPath || toolNorm.endsWith(normPath) || normPath.endsWith(toolNorm))) {
        return false;
      }
      return true;
    })
    .slice(0, 5);
}

export function ToolLayout({
  slug,
  title,
  subtitle,
  badgeText = '100% Client-Side Engine',
  noCardWrapper = false,
  hideTitle = false,
  hideSidebar = false,
  children,
}: ToolLayoutProps) {
  const pathname = usePathname();

  // Live Visitor Real-Time Heartbeat Registration
  useEffect(() => {
    trackVisitorHeartbeat(slug);
    const interval = setInterval(() => {
      trackVisitorHeartbeat(slug);
    }, 12000);

    return () => clearInterval(interval);
  }, [slug]);

  const sidebarTools = getSidebarTools(slug, pathname);

  const normSlug = slug ? slug.trim().toLowerCase() : '';
  const isFileTool =
    normSlug.startsWith('/pdf') ||
    normSlug.startsWith('/image') ||
    normSlug.startsWith('/tools') ||
    [
      '/utility/excel-to-numbers',
      '/utility/numbers-to-excel',
      '/utility/word-to-pages',
      '/utility/pages-to-word',
      '/utility/markdown-editor',
      '/utility/base64',
      '/utility/json-formatter',
    ].includes(normSlug);

  const isCalculator =
    normSlug.includes('calculator') ||
    [
      '/utility/cgpa-to-percentage',
      '/utility/percentage-calculator',
      '/utility/number-to-words',
    ].includes(normSlug);

  const isNetworkTool =
    normSlug.includes('youtube') ||
    normSlug.includes('social') ||
    normSlug.includes('text-to-speech');

  const privacyCard = isFileTool
    ? {
        title: '100% Client-Side Privacy',
        subtitle: 'Zero Server File Uploads',
        desc: 'All file modifications, conversions, and compression run strictly in your web browser RAM via WebAssembly. Your sensitive documents never leave your computer or phone.',
        badges: ['Browser RAM Only', 'Zero Cloud Logs', 'No Account Needed'],
      }
    : isCalculator
    ? {
        title: '100% Private Calculations',
        subtitle: 'Local In-Browser Compute',
        desc: 'All calculations, interest schedules, and numeric formulas run entirely on your device. Zero personal or financial data is ever stored, tracked, or sent to any server.',
        badges: ['Local Compute', 'Zero Tracking', 'Instant Results'],
      }
    : isNetworkTool
    ? {
        title: 'Fast & Private Online Utility',
        subtitle: 'Direct Endpoint Connection',
        desc: 'Processes your requests directly through public endpoints. We never log, track, or save your queries, search history, or media.',
        badges: ['No Sign-up', 'Zero Query Logging', 'Free Forever'],
      }
    : {
        title: 'Fast, Private & Free',
        subtitle: 'Browser-Native Engine',
        desc: 'Runs 100% locally on your device with instant execution. No accounts, no sign-ups, and zero background tracking.',
        badges: ['Instant Speed', 'No Sign-up', 'Free Forever'],
      };

  const sidebarGuides = normSlug.startsWith('/pdf')
    ? [
        { title: 'How to Compress PDF to 200KB', href: '/blog/how-to-compress-pdf-to-200kb-online' },
        { title: 'How to Convert Scanned PDF to Word', href: '/blog/how-to-convert-scanned-pdf-to-editable-word' },
        { title: 'How to Remove Password from PDF', href: '/blog/how-to-remove-password-from-pdf' },
      ]
    : normSlug.startsWith('/image') || normSlug.startsWith('/tools')
    ? [
        { title: 'How to Compress Image to 20KB', href: '/blog/how-to-compress-image-to-20kb' },
        { title: 'How to Resize Signature Online', href: '/blog/how-to-resize-signature-online' },
        { title: 'RRB NTPC Photo & Sign Specs', href: '/blog/rrb-ntpc-photo-signature-guidelines-2026' },
      ]
    : [
        { title: 'How to Calculate Loan EMI Accurately', href: '/blog/emi-calculator-guide' },
        { title: 'Calculate Exact Age for Exams', href: '/blog/age-calculator-india' },
        { title: 'Old vs New Tax Regime Guide (FY 2026-27)', href: '/blog/old-vs-new-tax-regime-calculator-guide' },
      ];

  return (
    <main className="min-h-screen w-full bg-slate-50/70 pt-3 sm:pt-6 pb-32 sm:pb-16 px-2 sm:px-6 lg:px-8 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto space-y-3 sm:space-y-6"
      >
        {/* Header Leaderboard Ad Slot (CLS = 0) */}
        <AdSlot slotType="header-leaderboard" />

        {/* Main Grid: Workspace & Sticky Sidebar */}
        <div className={`grid grid-cols-1 ${hideSidebar ? 'w-full' : 'lg:grid-cols-12'} gap-3 sm:gap-6 items-start`}>
          {/* Main Content Workspace */}
          <div className={`${hideSidebar ? 'w-full' : 'lg:col-span-8'} space-y-3 sm:space-y-6 min-w-0`}>
            {/* Tool Header Title & Subtitle Container */}
            {title && !hideTitle && (
              <div className="p-3.5 sm:p-0 rounded-2xl sm:rounded-none bg-white sm:bg-transparent border sm:border-none border-slate-200/90 sm:shadow-none shadow-2xs space-y-1.5 sm:space-y-2">
                <h1 className="text-lg sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
                  {title}
                </h1>

                {subtitle && (
                  <p className="text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Function-Centric Interactive Workspace Area */}
            {noCardWrapper ? (
              children
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-3 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md"
              >
                {children}
              </motion.div>
            )}

            {/* Post-Download In-Feed Ad Slot (Strictly >= 25px clear margin to prevent accidental clicks) */}
            <div className="pt-4 sm:pt-6">
              <AdSlot slotType="post-download" />
            </div>

            {/* When hideSidebar is true, render the sidebar guides, privacy & PWA cards cleanly below the studio */}
            {hideSidebar && (
              <div className="pt-6 sm:pt-8 border-t border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Helpful Guides, Privacy &amp; Quick Links
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold">Related Resources</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                  {/* 1. Client-Side Privacy Guarantee Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            {privacyCard.title}
                          </h4>
                          <p className="text-[10px] text-emerald-700 font-bold">{privacyCard.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {privacyCard.desc}
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-700">
                      {privacyCard.badges.map((b, bIdx) => (
                        <span key={bIdx} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Helpful Step-by-Step Guides Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                            <BookOpen className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Helpful Guides
                          </h4>
                        </div>
                        <Link
                          href="/blog"
                          className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                        >
                          View All →
                        </Link>
                      </div>
                      <ul className="space-y-2 text-xs">
                        {sidebarGuides.map((guide, gIdx) => (
                          <li key={gIdx}>
                            <Link
                              href={guide.href}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/70 transition-colors group"
                            >
                              <span className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate mr-2">{guide.title}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3. Offline PWA Desktop & Mobile App Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-md space-y-3 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            <Smartphone className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-white">
                            Offline PWA Studio
                          </h4>
                        </div>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                          100% Offline
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        Install FileZenith on your computer or mobile to use our 80+ document &amp; photo tools anytime without internet.
                      </p>
                    </div>
                    <Link
                      href="/download-app"
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Get Offline Web App</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Explore Related FileZenith Tools */}
            <RelatedToolsSection currentSlug={slug} />

            {/* Programmatic SEO Content & FAQs */}
            <SEOContent slug={slug} />
          </div>

          {/* Sticky Sidebar (Ad Placement Unit + E-E-A-T Trust & Quick Navigation) */}
          {!hideSidebar && (
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* 1. Client-Side Privacy Guarantee Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {privacyCard.title}
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-bold">{privacyCard.subtitle}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {privacyCard.desc}
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-700">
                {privacyCard.badges.map((b, bIdx) => (
                  <span key={bIdx} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Helpful Step-by-Step Guides Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Helpful Guides
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  View All →
                </Link>
              </div>
              <ul className="space-y-2 text-xs">
                {sidebarGuides.map((guide, gIdx) => (
                  <li key={gIdx}>
                    <Link
                      href={guide.href}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/70 transition-colors group"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-indigo-600">{guide.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Popular Studio Tools Card (Context-Aware) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Popular File Tools
                  </h3>
                </div>
                <Link
                  href={slug.includes('image') ? '/image-tools' : slug.includes('utility') ? '/utility-tools' : '/pdf-tools'}
                  className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-0.5"
                >
                  Explore Hub →
                </Link>
              </div>
              <ul className="space-y-2 text-xs">
                {sidebarTools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50/70 hover:text-rose-700 flex items-center justify-between border border-slate-200/70 transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 group-hover:text-rose-700 truncate">{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{tool.desc}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. How Client-Side Processing Works Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  How This Engine Works
                </h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">In-Browser Memory Ingestion</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Your document is loaded into your browser&apos;s private memory pool without contacting any cloud servers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Local WebAssembly Processing</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Conversion, compression, and OCR routines execute locally using your device&apos;s native CPU &amp; RAM.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Direct Download</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Processed files are saved straight to your downloads. Memory is wiped when you close this tab.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 0 Cloud Data Leaks
                </span>
                <span>Unlimited Usage</span>
              </div>
            </div>

            {/* 5. Offline PWA Desktop & Mobile App Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-md space-y-3 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    Offline PWA Studio
                  </h3>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  No Internet Needed
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Install FileZenith on your computer or smartphone to use all 80+ document and image tools anytime, anywhere.
              </p>
              <Link
                href="/download-app"
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get Offline Web App</span>
              </Link>
            </div>

            {/* 6. Sticky Sidebar Ad Unit */}
            <AdSlot slotType="sticky-sidebar" />
          </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}


