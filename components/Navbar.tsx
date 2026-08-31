'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PrivacyBadge } from './PrivacyBadge';
import {
  FileText,
  Image as ImageIcon,
  Wrench,
  ChevronDown,
  Edit3,
  Minimize2,
  Combine,
  Split,
  Grid,
  FileCheck,
  Stamp,
  Lock,
  Camera,
  FileImage,
  UserCheck,
  Scissors,
  Smartphone,
  QrCode,
  Type,
  Code2,
  Sparkles,
  Search,
  X,
  ArrowLeft,
} from 'lucide-react';

const PDF_TOOLS = [
  { name: 'Edit PDF Online', slug: '/pdf/edit', desc: 'Add text, whiteout content, draw & sign', icon: Edit3, badge: 'Interactive' },
  { name: 'Compress PDF', slug: '/pdf/compress', desc: 'Shrink PDF size up to 80%', icon: Minimize2, badge: 'Popular' },
  { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Target size for form uploads', icon: Minimize2 },
  { name: 'Merge PDF', slug: '/pdf/merge', desc: 'Combine multiple PDFs into one', icon: Combine },
  { name: 'Split PDF', slug: '/pdf/split', desc: 'Extract pages & custom page ranges', icon: Split },
  { name: 'Organize PDF', slug: '/pdf/organize', desc: 'Rotate, reorder & delete pages', icon: Grid },
  { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', desc: 'Extract editable text via AI Tesseract', icon: FileCheck, badge: 'AI Wasm' },
  { name: 'Watermark PDF', slug: '/pdf/watermark', desc: 'Add text watermark overlays', icon: Stamp },
  { name: 'Password Protect PDF', slug: '/pdf/protect', desc: 'Encrypt PDF with password', icon: Lock },
  { name: 'PDF to JPG / PNG', slug: '/pdf/to-image', desc: 'Convert PDF pages into high-res images', icon: ImageIcon },
];

const IMAGE_TOOLS = [
  { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', desc: 'Turn photos & scans into PDF', icon: Camera, badge: 'Popular' },
  { name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', desc: 'Convert PNG to JPG with background color', icon: FileImage, badge: 'Bulk' },
  { name: 'PNG to PDF Converter', slug: '/image/png-to-pdf', desc: 'Combine PNG images into a PDF document', icon: FileText },
  { name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', desc: 'Lossless quality JPG to PNG conversion', icon: FileImage },
  { name: 'Compress Image (Target KB)', slug: '/image/compress', desc: 'Compress to <20KB, <50KB, <100KB', icon: Minimize2, badge: 'Target KB' },
  { name: 'Passport Photo Maker', slug: '/image/passport-maker', desc: 'Crop to US, UK, Schengen & India specs', icon: UserCheck, badge: 'Presets' },
  { name: 'AI Background Remover', slug: '/image/remove-background', desc: 'Remove photo backgrounds 100% locally', icon: Scissors, badge: 'AI' },
  { name: 'Apple HEIC to JPG', slug: '/image/convert-heic', desc: 'Convert iPhone HEIC photos to JPG', icon: Smartphone },
  { name: 'Resize Image (Pixels / %)', slug: '/image/resize', desc: 'Resize image dimensions cleanly', icon: ImageIcon },
  { name: 'Image to PDF Converter', slug: '/image/to-pdf', desc: 'Combine JPG, PNG, WebP into PDF', icon: FileText },
];

const UTILITY_TOOLS = [
  { name: 'QR Code Generator', slug: '/utility/qr-generator', desc: 'Create custom QR codes with logo & colors', icon: QrCode, badge: 'Custom' },
  { name: 'Word & Character Counter', slug: '/utility/word-counter', desc: 'Real-time text stats, reading time & SEO', icon: Type },
  { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', desc: 'Beautify, minify, and validate JSON data', icon: Code2 },
];

const ALL_SEARCHABLE_TOOLS = [...PDF_TOOLS, ...IMAGE_TOOLS, ...UTILITY_TOOLS];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname?.startsWith(path);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  const searchResults = searchQuery.trim()
    ? ALL_SEARCHABLE_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* YouTube-Style Expanded Search Bar Header on Mobile */}
      {searchOpen ? (
        <div className="max-w-7xl mx-auto px-2 h-14 flex items-center gap-2 bg-white z-50">
          <button
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-full active:scale-95 transition-all"
            aria-label="Close search"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF, Image & Utility tools..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Standard Header Navigation */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand Logo - Minimal on Mobile */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
            <img
              src="/1.png"
              alt="FileZenith Logo"
              className="w-7 h-7 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-[13px] sm:text-xl tracking-tight text-slate-900 leading-none">
                FileZenith
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide">
                100% Client-Side Engine
              </span>
            </div>
          </Link>

          {/* Desktop Megamenu Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700">
            {/* Flagship All-in-One Studio Link */}
            <Link
              href="/studio"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border shadow-2xs ${
                isActive('/studio')
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>All-in-One Studio</span>
            </Link>

            {/* PDF Studio Dropdown */}
            <div className="relative group py-4">
              <Link
                href="/pdf/compress"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/pdf')
                    ? 'bg-rose-50 text-rose-700 font-extrabold border border-rose-200/60'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>PDF Studio</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Megamenu Panel */}
              <div className="absolute top-full left-0 w-[580px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-2 gap-2">
                <div className="col-span-2 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-600">PDF Studio Tools</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">100% Private</span>
                </div>
                {PDF_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      className="p-2.5 rounded-2xl hover:bg-rose-50/60 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-rose-100"
                    >
                      <div className="p-2 rounded-xl bg-rose-100/80 text-rose-700 group-hover/item:bg-rose-600 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover/item:text-rose-700 transition-colors truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Image Studio Dropdown */}
            <div className="relative group py-4">
              <Link
                href="/image/compress"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/image')
                    ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-200/60'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-sky-500" />
                <span>Image Studio</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Megamenu Panel */}
              <div className="absolute top-full left-0 w-[580px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-2 gap-2">
                <div className="col-span-2 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-sky-600">Image Studio Tools</span>
                  <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold">Fast Canvas AI</span>
                </div>
                {IMAGE_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      className="p-2.5 rounded-2xl hover:bg-sky-50/60 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-sky-100"
                    >
                      <div className="p-2 rounded-xl bg-sky-100/80 text-sky-700 group-hover/item:bg-sky-600 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover/item:text-sky-700 transition-colors truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Daily Utilities Dropdown */}
            <div className="relative group py-4">
              <Link
                href="/utility/qr-generator"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/utility')
                    ? 'bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200/60'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-4 h-4 text-emerald-500" />
                <span>Daily Utilities</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Dropdown Panel */}
              <div className="absolute top-full left-0 w-[340px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 space-y-2">
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Daily Quick Utilities</span>
                </div>
                {UTILITY_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      className="p-2.5 rounded-2xl hover:bg-emerald-50/60 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-emerald-100"
                    >
                      <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover/item:text-emerald-700 transition-colors truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Privacy Badge & Mobile YouTube-Style Search Button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <PrivacyBadge />
            </div>

            {/* YouTube Style Search Button on Mobile (Replaces Hamburger) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              aria-label="Search tools"
            >
              <Search className="w-4.5 h-4.5 text-rose-600" />
              <span className="text-[11px] text-slate-600 pr-1">Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Instant Dropdown Search Results Overlay on Mobile */}
      {searchOpen && searchQuery && (
        <div className="md:hidden bg-white border-b border-slate-200 max-h-[70vh] overflow-y-auto p-3 space-y-2 shadow-2xl z-50">
          {searchResults.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No tools found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            searchResults.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={() => setSearchOpen(false)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200/80 flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-900 block truncate">{tool.name}</span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                    </div>
                  </div>
                  {tool.badge && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      {tool.badge}
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      )}
    </header>
  );
}
