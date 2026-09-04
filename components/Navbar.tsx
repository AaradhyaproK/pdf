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
  Crop,
  Hash,
  FileCode,
  Calendar,
  Percent,
  GraduationCap,
  DollarSign,
  Zap,
  Car,
  Coins,
  MessageSquare,
  Video,
  Share2,
  Dices,
  Brain,
  Volume2,
  Palette,
  Hexagon,
  Unlock,
} from 'lucide-react';

const PDF_TOOLS = [
  { name: 'Edit PDF Online', slug: '/pdf/edit', desc: 'Add text, whiteout content, draw & sign', icon: Edit3, badge: 'Interactive', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Compress PDF', slug: '/pdf/compress', desc: 'Shrink PDF size up to 80%', icon: Minimize2, badge: 'Popular', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Target size for form uploads', icon: Minimize2, badge: 'Form Preset', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Merge PDF', slug: '/pdf/merge', desc: 'Combine multiple PDFs into one', icon: Combine, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Split PDF', slug: '/pdf/split', desc: 'Extract pages & custom page ranges', icon: Split, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'PDF Page Numberer', slug: '/pdf/page-numbers', desc: 'Add Page X of Y & custom footers', icon: Hash, badge: 'New', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Organize PDF', slug: '/pdf/organize', desc: 'Rotate, reorder & delete pages', icon: Grid, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', desc: 'Extract editable text via AI Tesseract', icon: FileCheck, badge: 'AI Wasm', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Watermark PDF', slug: '/pdf/watermark', desc: 'Add text watermark overlays', icon: Stamp, category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Password Protect PDF', slug: '/pdf/protect', desc: 'Encrypt PDF with password', icon: Lock, badge: 'Secure', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'Remove PDF Password', slug: '/pdf/remove-password', desc: 'Unlock and remove password from PDF', icon: Unlock, badge: 'Unlock', category: 'pdf', catLabel: 'PDF Studio' },
  { name: 'PDF to JPG / PNG', slug: '/pdf/to-image', desc: 'Convert PDF pages into high-res images', icon: FileImage, category: 'pdf', catLabel: 'PDF Studio' },
];

const IMAGE_TOOLS = [
  { name: 'Image Color Picker & Palette', slug: '/image/color-palette-extractor', desc: 'Extract hex colors from photos', icon: Palette, badge: 'Design', category: 'image', catLabel: 'Image Studio' },
  { name: 'Image Cropper & Aspect', slug: '/image/crop', desc: 'Crop 1:1, 16:9, 4:3, rotate & flip', icon: Crop, badge: 'New', category: 'image', catLabel: 'Image Studio' },
  { name: 'SVG Vector Converter', slug: '/image/svg-converter', desc: 'Convert SVG to 2x/4x PNG & JPG', icon: FileCode, badge: 'New', category: 'image', catLabel: 'Image Studio' },
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
  { name: 'Glassmorphism CSS Generator', slug: '/utility/glassmorphism-generator', desc: 'Frosted glass UI CSS maker', icon: Hexagon, badge: 'UI Tool', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Free Text to Speech (TTS)', slug: '/utility/text-to-speech', desc: 'No-limit text to voice AI audio', icon: Volume2, badge: 'No Limit', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Pomodoro Timer & Study Clock', slug: '/utility/pomodoro-timer', desc: 'Aesthetic 25m focus timer', icon: Brain, badge: 'Focus', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Spin the Wheel & Name Picker', slug: '/utility/spin-the-wheel', desc: 'Random winner picker with confetti', icon: Dices, badge: 'Viral Tool', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'EPF Balance Growth Calculator', slug: '/utility/epf-calculator', desc: 'EPFO 8.25% retirement interest math', icon: Coins, badge: 'EPFO 8.25%', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Age Calculator & Birthday', slug: '/utility/age-calculator', desc: 'Years, months, days, seconds & zodiac', icon: Calendar, badge: '#1 Tool', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Percentage Calculator', slug: '/utility/percentage-calculator', desc: '% increase, discount, marks & ratio', icon: Percent, badge: 'Popular', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'CGPA to Percentage', slug: '/utility/cgpa-to-percentage', desc: 'CBSE, Mumbai Univ, VTU, DU & SGPA', icon: GraduationCap, badge: 'College', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Word & Character Counter', slug: '/utility/word-counter', desc: 'Real-time text stats, reading time & SEO', icon: Type, category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Typing Speed Test (WPM Cert)', slug: '/utility/typing-speed-test', desc: 'Test WPM speed & export PNG certificate', icon: Zap, badge: 'Viral Cert', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Fancy Text Generator', slug: '/utility/fancy-text-generator', desc: '30+ Unicode font styles & gaming tags', icon: Sparkles, badge: 'Fonts', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Password Generator', slug: '/utility/password-generator', desc: 'Generate strong passwords 100% offline', icon: Lock, badge: 'Secure', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Number to Words Converter', slug: '/utility/number-to-words', desc: 'Cheque & invoice amount words (Rupees/$)', icon: DollarSign, badge: 'Cheque', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'EMI Loan Calculator', slug: '/utility/emi-calculator', desc: 'Home, car & personal loan monthly EMI math', icon: DollarSign, badge: 'Loan', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Income Tax Calculator', slug: '/utility/income-tax-calculator', desc: 'Old vs New Regime tax savings FY 2024-25', icon: DollarSign, badge: 'Tax', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'SIP Mutual Fund Calculator', slug: '/utility/sip-calculator', desc: 'Compounding growth for monthly mutual funds', icon: DollarSign, badge: 'Wealth', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'CTC to In-Hand Salary Calculator', slug: '/utility/salary-calculator', desc: 'Monthly take-home salary after EPF & TDS', icon: DollarSign, badge: 'Salary', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'GST Tax Calculator', slug: '/utility/gst-calculator', desc: 'Add or Remove GST 5%, 12%, 18%, 28%', icon: Percent, badge: 'B2B', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'BMI & Health Calculator', slug: '/utility/bmi-calculator', desc: 'Body Mass Index & ideal weight range', icon: Zap, badge: 'Health', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Text Case Converter', slug: '/utility/case-converter', desc: 'UPPER, lower, Title, camel & snake case', icon: Type, badge: 'Writing', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Text Repeater (10k Times)', slug: '/utility/text-repeater', desc: 'Repeat text & emojis up to 10,000 times', icon: Sparkles, badge: 'Viral', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Love Match Calculator', slug: '/utility/love-calculator', desc: 'Calculate love score & share on WhatsApp', icon: Sparkles, badge: 'Fun', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Base64 Encoder & Decoder', slug: '/utility/base64', desc: 'Convert files/images to Data URLs', icon: Code2, badge: 'New', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'Markdown Editor & PDF', slug: '/utility/markdown-editor', desc: 'Live Markdown preview & PDF export', icon: FileText, badge: 'New', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'QR Code Generator', slug: '/utility/qr-generator', desc: 'Create custom QR codes with logo & colors', icon: QrCode, badge: 'Custom', category: 'utility', catLabel: 'Daily Utility' },
  { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', desc: 'Beautify, minify, and validate JSON data', icon: Code2, category: 'utility', catLabel: 'Daily Utility' },
];

const SOCIAL_TOOLS = [
  { name: 'WhatsApp Direct Chat Launcher', slug: '/social/whatsapp-direct-chat', desc: 'Chat without saving phone numbers', icon: MessageSquare, badge: 'wa.me', category: 'social', catLabel: 'Social Studio' },
  { name: 'YouTube 1080p Thumbnail DL', slug: '/social/youtube-thumbnail-downloader', desc: 'Download 1080p HD video cover images', icon: Camera, badge: 'Thumbnails', category: 'social', catLabel: 'Social Studio' },
  { name: 'YouTube Tag Extractor', slug: '/social/youtube-tag-extractor', desc: 'Extract SEO tags & keywords from video URL', icon: Hash, badge: 'SEO', category: 'social', catLabel: 'Social Studio' },
  { name: 'YouTube Video Downloader', slug: '/social/youtube-downloader', desc: 'Download YouTube videos & MP3', icon: Video, category: 'social', catLabel: 'Social Studio' },
  { name: 'YouTube Shorts Downloader', slug: '/social/youtube-shorts-downloader', desc: 'Download vertical Shorts videos', icon: Video, category: 'social', catLabel: 'Social Studio' },
  { name: 'Twitter Video Downloader', slug: '/social/twitter-downloader', desc: 'Save Twitter / X video clips', icon: Download, category: 'social', catLabel: 'Social Studio' },
  { name: 'LinkedIn Video Downloader', slug: '/social/linkedin-downloader', desc: 'Save LinkedIn posts & videos', icon: Download, category: 'social', catLabel: 'Social Studio' },
];

const ALL_SEARCHABLE_TOOLS = [...PDF_TOOLS, ...IMAGE_TOOLS, ...UTILITY_TOOLS, ...SOCIAL_TOOLS];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pdf' | 'image' | 'utility' | 'social'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [compressReadyInfo, setCompressReadyInfo] = useState<{ url: string; name: string } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) {
        setSearchQuery(q);
        setSearchOpen(true);
        // Clean up the URL after opening search so it doesn't persist forever
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

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

  useEffect(() => {
    if (searchOpen && searchInputRef.current && window.innerWidth < 768) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Handle smart back navigation with fallback
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Select tool from mobile/desktop search results cleanly
  const selectingRef = useRef(false);
  const handleSelectTool = (slug: string) => {
    if (selectingRef.current) return;
    selectingRef.current = true;

    // Blur active input to prevent keyboard layout shift cancellation on touch devices
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setSearchOpen(false);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }

    router.push(slug);

    setTimeout(() => {
      selectingRef.current = false;
    }, 400);
  };

  useEffect(() => {
    if (searchOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

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
      className={`sticky top-0 inset-x-0 z-50 w-full transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs'
      }`}
    >
      {searchOpen && (
        <div className="md:hidden fixed inset-0 h-[100dvh] w-full z-[100] bg-white flex flex-col pt-[env(safe-area-inset-top,0px)] animate-in fade-in duration-150">
          <div className="p-3 border-b border-slate-200/80 flex items-center gap-2.5 bg-white shadow-xs shrink-0">
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
                if (typeof window !== 'undefined') document.body.style.overflow = '';
              }}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center active:scale-90 transition-transform shrink-0 cursor-pointer"
              aria-label="Close search"
            >
              <ArrowLeft className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            </button>

            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2.2]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 50+ PDF, Image & Utility tools..."
                className="w-full pl-9 pr-9 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all shadow-inner"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'all', label: 'All Tools', count: ALL_SEARCHABLE_TOOLS.length },
              { id: 'pdf', label: 'PDF Studio', count: PDF_TOOLS.length },
              { id: 'image', label: 'Image Studio', count: IMAGE_TOOLS.length },
              { id: 'utility', label: 'Utilities', count: UTILITY_TOOLS.length },
              { id: 'social', label: 'Social Tools', count: SOCIAL_TOOLS.length },
            ].map((tab) => {
              const isTabActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
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

          <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24 overscroll-contain">
            {filteredTools.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  No tools found matching &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset search filter
                </button>
              </div>
            ) : (
              filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={tool.slug}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleSelectTool(tool.slug);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectTool(tool.slug);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200/80 border border-slate-200/80 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          tool.category === 'pdf'
                            ? 'bg-rose-50 text-rose-600 border border-rose-100 group-hover:bg-rose-600 group-hover:text-white'
                            : tool.category === 'image'
                            ? 'bg-sky-50 text-sky-600 border border-sky-100 group-hover:bg-sky-600 group-hover:text-white'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white'
                        } transition-colors`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-slate-900 block truncate group-hover:text-slate-950">
                          {tool.name}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{tool.desc}</p>
                      </div>
                    </div>
                    {tool.badge && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shrink-0 ml-2 shadow-2xs">
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}

      {!searchOpen && (
        <div className="md:hidden w-full px-3 py-2 flex items-center justify-between gap-2 min-h-[52px]">
          {pathname !== '/' ? (
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={handleBack}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/90 shadow-xs hover:shadow transition-all cursor-pointer shrink-0 flex items-center justify-center text-slate-900 active:scale-90"
                aria-label="Go Back"
                title="Go Back to Previous Page"
              >
                <ArrowLeft className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              </button>
              <Link href="/" className="flex items-center gap-1.5 min-w-0 shrink active:scale-95 transition-transform">
                <img src="/1.png" alt="FileZenith Logo" className="w-6 h-6 object-contain shrink-0" />
                <span className="font-black text-xs sm:text-sm text-slate-900 truncate tracking-tight">
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

          <div className="flex items-center gap-1.5 shrink-0">
            {pathname === '/pdf/compress' && compressReadyInfo && (
              <a
                href={compressReadyInfo.url}
                download={`compressed-${compressReadyInfo.name}`}
                className="px-2.5 py-1.5 flex items-center gap-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded-full font-black active:scale-95 transition-all cursor-pointer shrink-0 shadow-md animate-in zoom-in-95 duration-200"
                title="Download Compressed PDF"
              >
                <Download className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span className="text-[11px] font-black tracking-tight">PDF</span>
              </a>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="px-3 py-1.5 flex items-center gap-1.5 text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 rounded-full active:scale-95 transition-all cursor-pointer shrink-0 shadow-xs"
              aria-label="Search tools"
              title="Search Tools"
            >
              <Search className="w-4 h-4 text-slate-800 stroke-[2.2]" />
              <span className="text-xs font-extrabold tracking-tight text-slate-800">Search</span>
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:flex max-w-7xl mx-auto px-6 lg:px-8 h-16 items-center justify-between gap-4">
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

        <nav className="flex items-center gap-1 text-sm font-semibold text-slate-700">
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

            <div className="absolute top-full left-0 w-[860px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-3 gap-2">
              <div className="col-span-3 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <Link href="/pdf-tools" className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  <span>PDF Studio Hub →</span>
                </Link>
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

            <div className="absolute top-full left-0 w-[860px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-3 gap-2">
              <div className="col-span-3 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <Link href="/image-tools" className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  <span>Image Studio Hub →</span>
                </Link>
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

            <div className="absolute top-full left-1/2 -ml-[430px] w-[860px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-3 gap-2">
              <div className="col-span-3 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <Link href="/calculators" className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  <span>Daily Utility Hubs →</span>
                </Link>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold border border-slate-200/80">Calculators & Tools</span>
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

          <div className="relative group py-4">
            <Link
              href="/social/whatsapp-direct-chat"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive('/social')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4 text-slate-700" />
              <span>Social Tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </Link>

            <div className="absolute top-full right-0 w-[860px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 grid grid-cols-3 gap-2">
              <div className="col-span-3 px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <Link href="/social/whatsapp-direct-chat" className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  <span>Social Media Tools Studio →</span>
                </Link>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold border border-pink-200">Reels & Chat Helpers</span>
              </div>
              {SOCIAL_TOOLS.map((tool) => {
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
              placeholder="Search 50+ tools..."
              className="w-full pl-9 pr-14 py-1.5 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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

          {searchOpen && (
            <div className="absolute top-full right-0 mt-2 w-[480px] lg:w-[540px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-slate-50/80 border-b border-slate-200/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Tools', count: ALL_SEARCHABLE_TOOLS.length },
                  { id: 'pdf', label: 'PDF Studio', count: PDF_TOOLS.length },
                  { id: 'image', label: 'Image Studio', count: IMAGE_TOOLS.length },
                  { id: 'utility', label: 'Utilities', count: UTILITY_TOOLS.length },
                  { id: 'social', label: 'Social Tools', count: SOCIAL_TOOLS.length },
                ].map((tab) => {
                  const isTabActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id as any)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
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
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
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
                        onPointerDown={(e) => {
                          e.preventDefault();
                          handleSelectTool(tool.slug);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectTool(tool.slug);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 border cursor-pointer ${
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
    </header>
  );
}
