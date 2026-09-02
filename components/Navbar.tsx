'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Search,
  X,
  ArrowLeft,
  Download,
  Sliders,
  CornerDownLeft,
  Sparkles,
} from 'lucide-react';

const PDF_TOOLS = [
  { name: 'Edit PDF Online', slug: '/pdf/edit', desc: 'Add text, whiteout content, draw & sign', icon: Edit3, badge: 'Interactive', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Compress PDF', slug: '/pdf/compress', desc: 'Shrink PDF size up to 80%', icon: Minimize2, badge: 'Popular', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Target size for form uploads', icon: Minimize2, badge: 'Form Preset', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Merge PDF', slug: '/pdf/merge', desc: 'Combine multiple PDFs into one', icon: Combine, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Split PDF', slug: '/pdf/split', desc: 'Extract pages & custom page ranges', icon: Split, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Organize PDF', slug: '/pdf/organize', desc: 'Rotate, reorder & delete pages', icon: Grid, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', desc: 'Extract editable text via AI Tesseract', icon: FileCheck, badge: 'AI Wasm', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Watermark PDF', slug: '/pdf/watermark', desc: 'Add text watermark overlays', icon: Stamp, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Password Protect PDF', slug: '/pdf/protect', desc: 'Encrypt PDF with password', icon: Lock, badge: 'Secure', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'PDF to JPG / PNG', slug: '/pdf/to-image', desc: 'Convert PDF pages into high-res images', icon: FileImage, category: 'pdf', catLabel: 'PDF Studio' },
];

const IMAGE_TOOLS = [
  { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', desc: 'Turn photos & scans into PDF', icon: Camera, badge: 'Popular', category: 'image', catLabel: 'Image Studio' },
  { name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', desc: 'Convert PNG to JPG with background color', icon: FileImage, badge: 'Bulk', category: 'image', catLabel: 'Image Studio' },
  { name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', desc: 'Lossless quality JPG to PNG conversion', icon: FileImage, category: 'image', catLabel: 'Image Studio' },
  { name: 'Compress Image (Target KB)', slug: '/image/compress', desc: 'Compress to <20KB, <50KB, <100KB', icon: Minimize2, badge: 'Target KB', category: 'image', catLabel: 'Image Studio' },
  { name: 'Compress Image to 50KB', slug: '/image/compress-to-50kb', desc: 'Shrink photo under 50KB for forms', icon: Minimize2, category: 'image', catLabel: 'Image Studio' },
  { name: 'Compress Image to 100KB', slug: '/image/compress-to-100kb', desc: 'Shrink photo under 100KB for identity', icon: Minimize2, category: 'image', catLabel: 'Image Studio' },
  { name: 'Passport Photo Maker', slug: '/image/passport-maker', desc: 'Crop to US, UK, Schengen & India specs', icon: UserCheck, badge: 'Presets', category: 'image', catLabel: 'Image Studio' },
  { name: 'AI Background Remover', slug: '/image/remove-background', desc: 'Remove photo backgrounds 100% locally', icon: Scissors, badge: 'AI Wasm', category: 'image', catLabel: 'Image Studio' },
  { name: 'Apple HEIC to JPG', slug: '/image/convert-heic', desc: 'Convert iPhone HEIC photos to JPG', icon: Smartphone, category: 'image', catLabel: 'Image Studio' },
  { name: 'Resize Image (Pixels / %)', slug: '/image/resize', desc: 'Resize image dimensions cleanly', icon: Sliders, category: 'image', catLabel: 'Image Studio' },
];

const UTILITY_TOOLS = [
  { name: 'QR Code Generator', slug: '/utility/qr-generator', desc: 'Create custom QR codes with logo & colors', icon: QrCode, badge: 'Custom', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Word & Character Counter', slug: '/utility/word-counter', desc: 'Real-time text stats, reading time & SEO', icon: Type, category: 'utility', catLabel: 'Daily Utility' },
  { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', desc: 'Beautify, minify, and validate JSON data', icon: Code2, category: 'utility', catLabel: 'Daily Utility' },
];

const ALL_SEARCHABLE_TOOLS = [...PDF_TOOLS, ...IMAGE_TOOLS, ...UTILITY_TOOLS];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pdf' | 'image' | 'utility'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [compressReadyInfo, setCompressReadyInfo] = useState<{ url: string; name: string } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname?.startsWith(path);

  // Filter tools based on search query and category
  const filteredTools = ALL_SEARCHABLE_TOOLS.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      (t.badge && t.badge.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for PDF Compression ready download event
  useEffect(() => {
    const handleReady = (e: any) => {
      if (e.detail?.downloadUrl) {
        setCompressReadyInfo({ url: e.detail.downloadUrl, name: e.detail.filename || 'document.pdf' });
      }
    };
    const handleReset = () => setCompressReadyInfo(null);

    window.addEventListener('compress-pdf-ready', handleReady);
    window.addEventListener('compress-pdf-reset', handleReset);
    return () => {
      window.removeEventListener('compress-pdf-ready', handleReady);
      window.removeEventListener('compress-pdf-reset', handleReset);
    };
  }, []);

  // Reset search & state on route navigation
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
    setCompressReadyInfo(null);
  }, [pathname]);

  // Global Keyboard Shortcut (⌘K / Ctrl+K to toggle search, ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => {
          const next = !prev;
          if (next) {
            setTimeout(() => {
              if (window.innerWidth >= 768) {
                desktopSearchInputRef.current?.focus();
              } else {
                searchInputRef.current?.focus();
              }
            }, 50);
          }
          return next;
        });
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard navigation through search result items
  useEffect(() => {
    if (!searchOpen) return;
    const handleNavigationKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredTools.length > 0 ? (prev - 1 + filteredTools.length) % filteredTools.length : 0));
      } else if (e.key === 'Enter' && filteredTools.length > 0 && filteredTools[selectedIndex]) {
        e.preventDefault();
        router.push(filteredTools[selectedIndex].slug);
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleNavigationKeys);
    return () => window.removeEventListener('keydown', handleNavigationKeys);
  }, [searchOpen, filteredTools, selectedIndex, router]);

  // Reset selected index when query or filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, selectedCategory]);

  // Focus mobile input when mobile search is toggled
  useEffect(() => {
    if (searchOpen && searchInputRef.current && window.innerWidth < 768) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Dismiss desktop search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs'
      }`}
    >
      {/* ========================================================= */}
      {/* MOBILE SEARCH HEADER (Visible on mobile screens when active) */}
      {/* ========================================================= */}
      {searchOpen && (
        <div className="md:hidden max-w-md mx-auto px-2 py-1.5 flex items-center gap-2 bg-white/95 backdrop-blur-2xl rounded-full border border-slate-200 shadow-xl z-50 my-1">
          <button
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full active:scale-90 transition-all duration-150"
            aria-label="Close search"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>

          <div className="flex-1 relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 20+ tools..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-100/90 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE DEFAULT NAVBAR (Visible on mobile when search is closed) */}
      {/* ========================================================= */}
      {!searchOpen && (
        <div className="md:hidden w-full px-3.5 py-2 flex items-center justify-between gap-2">
          {/* Mobile Brand / Back Button */}
          {pathname !== '/' ? (
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => router.back()}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 active:scale-90 transition-all cursor-pointer shrink-0 border border-slate-200/80"
                aria-label="Go Back"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-slate-900 stroke-[2.5]" />
              </button>
              <Link href="/" className="flex items-center gap-1.5 min-w-0 shrink">
                <img src="/1.png" alt="FileZenith Logo" className="w-5 h-5 object-contain" />
                <span className="font-black text-xs text-slate-900 truncate tracking-tight">
                  FileZenith
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2 group shrink-0 active:scale-95 transition-transform duration-200">
              <img
                src="/1.png"
                alt="FileZenith Logo"
                className={`object-contain transition-all duration-300 ${scrolled ? 'w-6 h-6' : 'w-7 h-7'}`}
              />
              <span className={`font-black tracking-tight text-slate-900 leading-none transition-all duration-300 ${scrolled ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
                FileZenith
              </span>
            </Link>
          )}

          {/* Mobile Action Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {pathname === '/pdf/compress' && compressReadyInfo && (
              <a
                href={compressReadyInfo.url}
                download={`compressed-${compressReadyInfo.name}`}
                className="px-3 py-1 flex items-center gap-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-full font-black active:scale-95 transition-all cursor-pointer shrink-0 shadow-md animate-in zoom-in-95 duration-200"
                title="Download Compressed PDF"
              >
                <Download className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span className="text-[11px] font-black tracking-tight">Download PDF</span>
              </a>
            )}

            {/* Mobile Search Button Pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className="px-3 py-1 flex items-center gap-1.5 text-slate-800 hover:text-slate-900 bg-slate-100/90 border border-slate-200/90 rounded-full active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Search tools"
              title="Search Tools"
            >
              <Search className="w-3.5 h-3.5 text-slate-800 stroke-[2.2]" />
              <span className="text-[11px] font-extrabold tracking-tight text-slate-800">Search</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DESKTOP HEADER NAVIGATION & INTEGRATED SEARCH BAR */}
      {/* ========================================================= */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 lg:px-8 h-16 items-center justify-between gap-4">
        {/* Brand Logo - Desktop */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 active:scale-95 transition-transform duration-200">
          <img
            src="/1.png"
            alt="FileZenith Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
              FileZenith
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              100% Client-Side Engine
            </span>
          </div>
        </Link>

        {/* Desktop Megamenu Navigation */}
        <nav className="flex items-center gap-1 text-sm font-semibold text-slate-700">
          {/* PDF Studio Dropdown */}
          <div className="relative group py-4">
            <Link
              href="/pdf/compress"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive('/pdf')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-700" />
              <span>PDF Studio</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </Link>

            {/* PDF Megamenu Panel */}
            <div className="absolute top-full left-0 w-[580px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-2 gap-2">
              <div className="col-span-2 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">PDF Studio Tools</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold border border-slate-200/80">100% Private</span>
              </div>
              {PDF_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={tool.slug}
                    className="p-2.5 rounded-2xl hover:bg-slate-100/80 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-slate-200/80"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 transition-colors truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
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
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-slate-700" />
              <span>Image Studio</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </Link>

            {/* Image Megamenu Panel */}
            <div className="absolute top-full left-0 w-[580px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-2 gap-2">
              <div className="col-span-2 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">Image Studio Tools</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold border border-slate-200/80">Fast Canvas AI</span>
              </div>
              {IMAGE_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={tool.slug}
                    className="p-2.5 rounded-2xl hover:bg-slate-100/80 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-slate-200/80"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 transition-colors truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
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
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 text-slate-700" />
              <span>Daily Utilities</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </Link>

            {/* Utility Dropdown Panel */}
            <div className="absolute top-full left-0 w-[340px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 space-y-2">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">Daily Quick Utilities</span>
              </div>
              {UTILITY_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={tool.slug}
                    className="p-2.5 rounded-2xl hover:bg-slate-100/80 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-slate-200/80"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 transition-colors truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
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

        {/* Desktop Top Navbar Search Bar Input */}
        <div ref={searchContainerRef} className="relative flex items-center w-64 lg:w-80">
          <div
            className={`w-full relative flex items-center rounded-full transition-all duration-200 ${
              searchOpen
                ? 'ring-2 ring-slate-900/20 bg-white border border-slate-800 shadow-md'
                : 'bg-slate-100/90 hover:bg-slate-200/60 border border-slate-200/90'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none stroke-[2.2]" />
            <input
              ref={desktopSearchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!searchOpen) setSearchOpen(true);
              }}
              placeholder="Search 20+ tools..."
              className="w-full pl-9 pr-14 py-1.5 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-3 pointer-events-none px-1.5 py-0.5 text-[10px] font-extrabold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            )}
          </div>

          {/* ========================================================= */}
          {/* DESKTOP SEARCH TOOLS FLOATING DROPDOWN PALETTE */}
          {/* ========================================================= */}
          {searchOpen && (
            <div className="absolute top-full right-0 mt-2 w-[480px] lg:w-[540px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Top Category Filter Tabs Bar */}
              <div className="p-3 bg-slate-50/80 border-b border-slate-200/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Tools', count: ALL_SEARCHABLE_TOOLS.length },
                  { id: 'pdf', label: 'PDF Studio', count: PDF_TOOLS.length },
                  { id: 'image', label: 'Image Studio', count: IMAGE_TOOLS.length },
                  { id: 'utility', label: 'Utilities', count: UTILITY_TOOLS.length },
                ].map((tab) => {
                  const isTabActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id as any)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                        isTabActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                          isTabActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tool Results List */}
              <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
                {filteredTools.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">
                      No tools found matching &quot;{searchQuery}&quot;
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      Reset search query
                    </button>
                  </div>
                ) : (
                  filteredTools.map((tool, idx) => {
                    const Icon = tool.icon;
                    const isSelected = idx === selectedIndex;

                    return (
                      <Link
                        key={tool.slug}
                        href={tool.slug}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md translate-x-1'
                            : 'hover:bg-slate-100/80 border-transparent text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-xl shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-white/15 text-white'
                                : tool.category === 'pdf'
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : tool.category === 'image'
                                ? 'bg-sky-50 text-sky-600 border border-sky-100'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-black truncate ${
                                  isSelected ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.2 rounded shrink-0 border ${
                                    isSelected
                                      ? 'bg-white/20 text-white border-white/30'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] truncate mt-0.5 font-medium ${
                                isSelected ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {tool.catLabel}
                          </span>
                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-white/80 animate-pulse" />
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Keyboard Hint Bar */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-black text-slate-700 shadow-2xs">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-black text-slate-700 shadow-2xs">
                      ↓
                    </kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-black text-slate-700 shadow-2xs">
                      ↵
                    </kbd>
                    <span>Select</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-black text-slate-700 shadow-2xs">
                      ESC
                    </kbd>
                    <span>Close</span>
                  </span>
                </div>
                <span className="font-extrabold text-slate-700">{filteredTools.length} tools available</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* INSTANT DROPDOWN SEARCH RESULTS OVERLAY ON MOBILE */}
      {/* ========================================================= */}
      {searchOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 max-h-[75vh] overflow-y-auto p-3 space-y-2 shadow-2xl z-50 animate-in slide-in-from-top duration-200">
          {/* Mobile Category Filters */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'pdf', label: 'PDF' },
              { id: 'image', label: 'Image' },
              { id: 'utility', label: 'Utility' },
            ].map((tab) => {
              const isTabActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 border ${
                    isTabActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No tools found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        tool.category === 'pdf'
                          ? 'bg-rose-100 text-rose-600'
                          : tool.category === 'image'
                          ? 'bg-sky-100 text-sky-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-900 block truncate">{tool.name}</span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                    </div>
                  </div>
                  {tool.badge && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0 ml-2">
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
