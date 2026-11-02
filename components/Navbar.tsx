'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { matchTool, rankToolsForSearch, isPicsToPdfQuery } from '@/lib/tool-search';
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
  PenTool,
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
  Table,
  Printer,
  Menu,
  BookOpen,
  Eraser,
  EyeOff,
  Receipt,
  Presentation,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { ALL_TOOLS } from './LandingToolGrid';

export const ALL_SEARCHABLE_TOOLS = ALL_TOOLS.map((tool) => ({
  name: tool.name,
  slug: tool.slug,
  desc: tool.desc,
  icon: tool.icon,
  badge: tool.badge,
  category: tool.category,
  catLabel:
    tool.category === 'pdf'
      ? 'PDF Studio'
      : tool.category === 'image'
      ? 'Image Studio'
      : tool.category === 'social'
      ? 'Social Studio'
      : 'Daily Utility',
  keywords: tool.keywords || [],
}));

const PDF_TOOLS = ALL_SEARCHABLE_TOOLS.filter((t) => t.category === 'pdf');
const IMAGE_TOOLS = ALL_SEARCHABLE_TOOLS.filter((t) => t.category === 'image');
const UTILITY_TOOLS = ALL_SEARCHABLE_TOOLS.filter((t) => t.category === 'utility');
const SOCIAL_TOOLS = ALL_SEARCHABLE_TOOLS.filter((t) => t.category === 'social');

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pdf' | 'image' | 'utility' | 'social'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [compressReadyInfo, setCompressReadyInfo] = useState<{ url: string; name: string } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'pdf' | 'image' | 'utility' | 'social' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeDropdown = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(null);
  };

  const closeAllNavbars = () => {
    closeDropdown();
    setIsMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const handleMouseEnter = (dropdown: 'pdf' | 'image' | 'utility' | 'social') => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

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

  const isActive = (path: string) => {
    if (path === '/pdf') return pathname?.startsWith('/pdf') || pathname === '/pdf-tools';
    if (path === '/image') return pathname?.startsWith('/image') || pathname === '/image-tools';
    if (path === '/utility') return pathname?.startsWith('/utility') || pathname === '/utility-tools';
    if (path === '/social') return pathname?.startsWith('/social') || pathname === '/social-tools';
    return pathname?.startsWith(path);
  };

  // Filter tools based on search query and category with smart ranking & deduplication
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const isImageToPdf = isPicsToPdfQuery(q);

    // When 'all' category is chosen, deduplicate tools by slug
    const baseTools =
      selectedCategory === 'all'
        ? ALL_SEARCHABLE_TOOLS.filter(
            (tool, index, self) => index === self.findIndex((t) => t.slug === tool.slug)
          )
        : ALL_SEARCHABLE_TOOLS.filter(
            (t) => t.category === selectedCategory || (isImageToPdf && t.slug === '/image/pics-to-pdf')
          );

    const matches = baseTools.filter((t) => matchTool(t, q));
    return rankToolsForSearch(matches, q);
  }, [searchQuery, selectedCategory]);

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

  // Reset search, dropdowns & state on route navigation
  useEffect(() => {
    closeAllNavbars();
    setSearchQuery('');
    setSelectedIndex(0);
    setCompressReadyInfo(null);
  }, [pathname]);

  // Click outside listener to auto-close any open desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Global Keyboard Shortcut (⌘K / Ctrl+K to toggle search, ESC to close all)
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
        closeAllNavbars();
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

    closeAllNavbars();
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }

    router.push(slug);

    setTimeout(() => {
      selectingRef.current = false;
    }, 400);
  };

  // Drag tracking to prevent accidental clicks while scrolling on touch devices
  const isDraggingRef = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = false;
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    if (dx > 6 || dy > 6) {
      isDraggingRef.current = true;
    }
  };

  useEffect(() => {
    if ((searchOpen || isMobileMenuOpen) && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, isMobileMenuOpen]);

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
      ref={navContainerRef}
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
                placeholder="Search 100+ PDF, Image & Utility tools..."
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
              { id: 'all', label: 'All Tools', count: ALL_SEARCHABLE_TOOLS.filter((tool, idx, self) => idx === self.findIndex((t) => t.slug === tool.slug)).length },
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

          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="flex-1 overflow-y-auto p-3 space-y-2 pb-24 overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
          >
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
                    onClick={(e) => {
                      if (isDraggingRef.current) {
                        e.preventDefault();
                        return;
                      }
                      handleSelectTool(tool.slug);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200/80 border border-slate-200/80 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-2xs group select-none"
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
                    {(() => {
                      const isRecommended = isPicsToPdfQuery(searchQuery) && tool.slug === '/image/pics-to-pdf';
                      const badgeText = isRecommended ? 'Recommended' : tool.badge;
                      return badgeText ? (
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ml-2 shadow-2xs border ${
                            isRecommended
                              ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {badgeText}
                        </span>
                      ) : null;
                    })()}
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
                <img src="/filezenith-logo.png" alt="FileZenith Logo" className="w-6 h-6 object-contain shrink-0" />
                <span className="font-black text-xs sm:text-sm text-slate-900 truncate tracking-tight">
                  FileZenith
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2 group shrink-0 active:scale-95 transition-transform duration-200">
              <img
                src="/filezenith-logo.png"
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
              onClick={() => {
                setSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-1.5 text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 rounded-full active:scale-95 transition-all cursor-pointer shrink-0 shadow-xs"
              aria-label="Search tools"
              title="Search Tools"
            >
              <Search className="w-4 h-4 text-slate-800 stroke-[2.2]" />
              <span className="text-xs font-extrabold tracking-tight text-slate-800">Search</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                isMobileMenuOpen
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200/90'
              }`}
              aria-label="Toggle menu"
              title="Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 stroke-[2.5]" /> : <Menu className="w-4 h-4 stroke-[2.2]" />}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu (Accessible from Navbar on Mobile) */}
      {isMobileMenuOpen && !searchOpen && (
        <div className="md:hidden fixed inset-0 h-[100dvh] w-full z-[100] bg-white flex flex-col pt-[env(safe-area-inset-top,0px)] animate-in fade-in duration-150">
          <div className="p-3 border-b border-slate-200/80 flex items-center justify-between bg-white shadow-xs shrink-0 min-h-[52px]">
            <div className="flex items-center gap-2">
              <img src="/filezenith-logo.png" alt="FileZenith Logo" className="w-6 h-6 object-contain" />
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider leading-none">Navigation Menu</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Browse 100+ tools across 4 studios</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-36 space-y-4 bg-white">

          {/* PDF Studio Mobile Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/pdf-tools"
                onClick={closeAllNavbars}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    PDF Studio
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Merge, compress, edit & OCR</p>
                </div>
              </Link>
              <Link
                href="/pdf-tools"
                onClick={closeAllNavbars}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-rose-600 border border-rose-200 shadow-2xs hover:bg-rose-50"
              >
                Open Hub →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/50">
              {PDF_TOOLS.slice(0, 6).map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={closeAllNavbars}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/70 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Image Studio Mobile Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/image-tools"
                onClick={closeAllNavbars}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                    Image Studio
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Compress, convert & passport photos</p>
                </div>
              </Link>
              <Link
                href="/image-tools"
                onClick={closeAllNavbars}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-sky-600 border border-sky-200 shadow-2xs hover:bg-sky-50"
              >
                Open Hub →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/50">
              {IMAGE_TOOLS.slice(0, 6).map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={closeAllNavbars}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/70 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Daily Utilities Mobile Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/utility-tools"
                onClick={closeAllNavbars}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Daily Utilities
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Bills, EMI, Age, QR & Converters</p>
                </div>
              </Link>
              <Link
                href="/utility-tools"
                onClick={closeAllNavbars}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-600 border border-emerald-200 shadow-2xs hover:bg-emerald-50"
              >
                Open Hub →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/50">
              {UTILITY_TOOLS.slice(0, 6).map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={closeAllNavbars}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/70 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Tools Mobile Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/social-tools"
                onClick={closeAllNavbars}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-pink-600 transition-colors">
                    Social Tools
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">WhatsApp direct, YouTube covers</p>
                </div>
              </Link>
              <Link
                href="/social-tools"
                onClick={closeAllNavbars}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-pink-600 border border-pink-200 shadow-2xs hover:bg-pink-50"
              >
                Open Hub →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/50">
              {SOCIAL_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={closeAllNavbars}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/70 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CSC & Cyber Cafe Toolkit Mobile Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/csc-cyber-cafe-tools"
                onClick={closeAllNavbars}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                    CSC &amp; Cyber Cafe Hub
                  </h4>
                  <p className="text-[10px] text-slate-600 font-medium">Aadhaar PVC, PAN 213x213 &amp; Marksheets</p>
                </div>
              </Link>
              <Link
                href="/csc-cyber-cafe-tools"
                onClick={closeAllNavbars}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-amber-800 border border-amber-200 shadow-2xs hover:bg-amber-50"
              >
                Open Hub →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-amber-200/60">
              <Link
                href="/tools/aadhaar-card-print"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-amber-50/60 border border-amber-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                Aadhaar A4 &amp; PVC Print
              </Link>
              <Link
                href="/tools/pan-card-photo-resizer"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-amber-50/60 border border-amber-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                PAN Photo 213x213
              </Link>
              <Link
                href="/pdf/combine-marksheets"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-amber-50/60 border border-amber-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                Marksheets &lt;500KB
              </Link>
              <Link
                href="/tools/signature-resizer-10-to-20kb"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-amber-50/60 border border-amber-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                Signature 10-20KB
              </Link>
            </div>
          </div>

          {/* Guides & Blog Mobile Card */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                onClick={closeAllNavbars}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Guides &amp; Tutorials
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">43+ step-by-step exam &amp; file guides</p>
                </div>
              </Link>
              <Link
                href="/blog"
                onClick={closeAllNavbars}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-indigo-600 border border-indigo-200 shadow-2xs hover:bg-indigo-50"
              >
                Read All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-indigo-100">
              <Link
                href="/blog/how-to-compress-image-to-20kb"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                Compress Image to 20KB
              </Link>
              <Link
                href="/blog/how-to-compress-pdf-to-200kb-online"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                Compress PDF to 200KB
              </Link>
              <Link
                href="/blog/passport-size-photo-maker-guide"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                Passport Photo Specs
              </Link>
              <Link
                href="/blog/rrb-ntpc-photo-signature-guidelines-2026"
                onClick={closeAllNavbars}
                className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-slate-800 truncate block active:scale-98 transition-all"
              >
                RRB NTPC Photo Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="hidden md:flex max-w-7xl mx-auto px-4 lg:px-8 h-16 items-center justify-between gap-2 lg:gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 active:scale-95 transition-transform duration-200">
          <img
            src="/filezenith-logo.png"
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

        <nav className="flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-bold text-slate-700">
          {/* PDF Studio */}
          <div
            className="relative py-4"
            onMouseEnter={() => handleMouseEnter('pdf')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/pdf-tools"
              onClick={closeAllNavbars}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive('/pdf')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-700 shrink-0" />
              <span>PDF Studio</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  activeDropdown === 'pdf' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </Link>

            <div
              className={`absolute top-full left-0 w-[880px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-3.5 transition-all duration-200 max-h-[calc(100vh-80px)] flex flex-col z-50 ${
                activeDropdown === 'pdf'
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible translate-y-2 pointer-events-none'
              }`}
            >
              <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 shrink-0 mb-1.5">
                <Link
                  href="/pdf-tools"
                  onClick={closeAllNavbars}
                  className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>PDF Studio Hub →</span>
                </Link>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold border border-slate-200/80">
                  {PDF_TOOLS.length} Tools • 100% Private
                </span>
              </div>
              <div className="overflow-y-auto overscroll-contain pr-1 pb-2 grid grid-cols-3 gap-1.5">
                {PDF_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      onClick={closeAllNavbars}
                      className="p-2 rounded-xl hover:bg-slate-100/90 transition-all flex items-center gap-2.5 group/item border border-transparent hover:border-slate-200/80 cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
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
                        <p className="text-[10.5px] text-slate-500 truncate leading-tight mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Image Studio */}
          <div
            className="relative py-4"
            onMouseEnter={() => handleMouseEnter('image')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/image-tools"
              onClick={closeAllNavbars}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive('/image')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Image Studio</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  activeDropdown === 'image' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </Link>

            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-[780px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-3.5 transition-all duration-200 max-h-[calc(100vh-80px)] flex flex-col z-50 ${
                activeDropdown === 'image'
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible translate-y-2 pointer-events-none'
              }`}
            >
              {/* Center Pointer Notch directly below Image Studio hover */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 pointer-events-none" />
              <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 shrink-0 mb-1.5">
                <Link
                  href="/image-tools"
                  onClick={closeAllNavbars}
                  className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-rose-600" />
                  <span>Image Studio Hub →</span>
                </Link>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold border border-slate-200/80">
                  {IMAGE_TOOLS.length} Tools • Fast Canvas AI
                </span>
              </div>
              <div className="overflow-y-auto overscroll-contain pr-1 pb-2 grid grid-cols-3 gap-1.5">
                {IMAGE_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      onClick={closeAllNavbars}
                      className="p-2 rounded-xl hover:bg-slate-100/90 transition-all flex items-center gap-2.5 group/item border border-transparent hover:border-slate-200/80 cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
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
                        <p className="text-[10.5px] text-slate-500 truncate leading-tight mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Utilities */}
          <div
            className="relative py-4"
            onMouseEnter={() => handleMouseEnter('utility')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/utility-tools"
              onClick={closeAllNavbars}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive('/utility')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Daily Utilities</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  activeDropdown === 'utility' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </Link>

            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-[880px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-3.5 transition-all duration-200 max-h-[calc(100vh-80px)] flex flex-col z-50 ${
                activeDropdown === 'utility'
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible translate-y-2 pointer-events-none'
              }`}
            >
              {/* Center Pointer Notch directly below Daily Utilities hover */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 pointer-events-none" />
              <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 shrink-0 mb-1.5">
                <Link
                  href="/utility-tools"
                  onClick={closeAllNavbars}
                  className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-rose-600" />
                  <span>Daily Utility Studio Hub →</span>
                </Link>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold border border-slate-200/80">
                  {UTILITY_TOOLS.length} Calculators & Tools
                </span>
              </div>
              <div className="overflow-y-auto overscroll-contain pr-1 pb-2 grid grid-cols-3 gap-1.5">
                {UTILITY_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      onClick={closeAllNavbars}
                      className="p-2 rounded-xl hover:bg-slate-100/90 transition-all flex items-center gap-2.5 group/item border border-transparent hover:border-slate-200/80 cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
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
                        <p className="text-[10.5px] text-slate-500 truncate leading-tight mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Social Tools */}
          <div
            className="relative py-4"
            onMouseEnter={() => handleMouseEnter('social')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/social-tools"
              onClick={closeAllNavbars}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive('/social')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Social Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  activeDropdown === 'social' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </Link>

            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-[760px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-3.5 transition-all duration-200 max-h-[calc(100vh-80px)] flex flex-col z-50 ${
                activeDropdown === 'social'
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible translate-y-2 pointer-events-none'
              }`}
            >
              {/* Center Pointer Notch directly below Social Tools hover */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 pointer-events-none" />
              <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 shrink-0 mb-1.5">
                <Link
                  href="/social-tools"
                  onClick={closeAllNavbars}
                  className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-rose-600" />
                  <span>Social Media Tools Studio →</span>
                </Link>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold border border-pink-200">Reels & Chat Helpers</span>
              </div>
              <div className="overflow-y-auto overscroll-contain pr-1 pb-2 grid grid-cols-3 gap-1.5">
                {SOCIAL_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      onClick={closeAllNavbars}
                      className="p-2 rounded-xl hover:bg-slate-100/90 transition-all flex items-center gap-2.5 group/item border border-transparent hover:border-slate-200/80 cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
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
                        <p className="text-[10.5px] text-slate-500 truncate leading-tight mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Guides & Blog Direct Link */}
          <div className="relative py-4">
            <Link
              href="/blog"
              onClick={closeAllNavbars}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive('/blog')
                  ? 'bg-slate-900/10 text-slate-900 font-extrabold border border-slate-900/15 backdrop-blur-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Guides &amp; Blog</span>
            </Link>
          </div>
        </nav>

        <div ref={searchContainerRef} className="relative flex items-center w-40 lg:w-56 xl:w-64 shrink-0">
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
              placeholder="Search 100+ tools..."
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
                  { id: 'all', label: 'All Tools', count: ALL_SEARCHABLE_TOOLS.filter((tool, idx, self) => idx === self.findIndex((t) => t.slug === tool.slug)).length },
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

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                className="p-2 space-y-1 max-h-[60vh] overflow-y-auto overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
              >
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
                        onClick={(e) => {
                          if (isDraggingRef.current) {
                            e.preventDefault();
                            return;
                          }
                          handleSelectTool(tool.slug);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 border cursor-pointer select-none ${
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
                              {(() => {
                                const isRecommended = isPicsToPdfQuery(searchQuery) && tool.slug === '/image/pics-to-pdf';
                                const badgeText = isRecommended ? 'Recommended' : tool.badge;
                                return badgeText ? (
                                  <span
                                    className={`text-[9px] font-black px-1.5 py-0.2 rounded shrink-0 border ${
                                      isRecommended
                                        ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse'
                                        : isSelected
                                        ? 'bg-white/20 text-white border-white/30'
                                        : 'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {badgeText}
                                  </span>
                                ) : null;
                              })()}
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
