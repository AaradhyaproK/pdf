import Link from 'next/link';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { AdSlot } from '@/components/AdSlot';
import {
  FileText,
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
  Share2,
  Video,
  Camera,
  Globe,
  Film,
} from 'lucide-react';

const TOOLS = [
  // PDF Studio
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

  // Image Studio
  {
    category: 'image',
    name: 'Compress Image (Target KB)',
    slug: '/image/compress',
    desc: 'Target exact file sizes (<20KB, <50KB, <100KB) or percentage scaling.',
    icon: ImageIcon,
    badge: 'Target KB',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    category: 'image',
    name: 'Passport Photo Maker',
    slug: '/image/passport-maker',
    desc: 'Crop photos to US, Schengen, UK, and India specs + 4x6 print grid.',
    icon: UserCheck,
    badge: 'Presets',
    color: 'bg-sky-500 text-white',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    category: 'image',
    name: 'AI Background Remover',
    slug: '/image/remove-background',
    desc: 'Isolate subjects and erase background with Erase/Restore brushes & 300% Zoom.',
    icon: Scissors,
    badge: 'Brush & Zoom',
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

  // Social Media Downloader Studio
  {
    category: 'social',
    name: 'YouTube Video & Shorts Downloader',
    slug: '/social/youtube-downloader',
    desc: 'Download YouTube videos, Shorts, and MP3 audio in 1080p Full HD.',
    icon: Video,
    badge: '1080p HD',
    color: 'bg-rose-600 text-white',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    category: 'social',
    name: 'YouTube Shorts Downloader',
    slug: '/social/youtube-shorts-downloader',
    desc: 'Download YouTube Shorts vertical videos in 1080p MP4 format.',
    icon: Film,
    color: 'bg-rose-600 text-white',
  },
  {
    category: 'social',
    name: 'Instagram Reels & Post Downloader',
    slug: '/social/instagram-downloader',
    desc: 'Save Instagram Reels videos, carousel photos, and stories in HD.',
    icon: Camera,
    badge: 'Reels HD',
    color: 'bg-pink-600 text-white',
    badgeStyle: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    category: 'social',
    name: 'Instagram Reels Downloader',
    slug: '/social/instagram-reels-downloader',
    desc: 'Instant 1080p MP4 Instagram Reels video downloader.',
    icon: Camera,
    color: 'bg-pink-600 text-white',
  },
  {
    category: 'social',
    name: 'X / Twitter Video Downloader',
    slug: '/social/twitter-downloader',
    desc: 'Download X (Twitter) videos, GIFs, and post photos in 1080p HD.',
    icon: Share2,
    color: 'bg-sky-500 text-white',
  },
  {
    category: 'social',
    name: 'LinkedIn Video & Slide Downloader',
    slug: '/social/linkedin-downloader',
    desc: 'Download LinkedIn professional videos and document PDF slides.',
    icon: Globe,
    color: 'bg-blue-700 text-white',
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/70">
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
            All-in-One <span className="bg-gradient-to-r from-indigo-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">Private PDF, Image & Social</span> Suite
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Compress PDFs, remove photo backgrounds with AI, download YouTube, Instagram, X & LinkedIn media, and generate QR codes directly in your browser. <strong className="text-slate-900">Zero server file uploads. 100% Client-Side Privacy.</strong>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No File Size Limits
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No Account Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Works Offline
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
                  Client-side PDF compression, merging, splitting, OCR, and security tools
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
                  Target KB image compression, passport cropper, AI background removal, and HEIC transcoding
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

        {/* Social Media Downloader Studio Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Social Media Downloader Studio
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Download YouTube Videos & Shorts, Instagram Reels, X/Twitter Media, and LinkedIn Posts
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.filter((t) => t.category === 'social').map((tool) => {
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

        {/* Daily Quick Utilities Section */}
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
      </section>
    </main>
  );
}
