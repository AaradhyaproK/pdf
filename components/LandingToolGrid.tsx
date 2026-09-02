'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Edit3,
  Minimize2,
  Combine,
  Split,
  Grid,
  FileCheck,
  Image as ImageIcon,
  UserCheck,
  Scissors,
  Smartphone,
  QrCode,
  Type,
  Code2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Camera,
  FileImage,
  Lock,
  Search,
  X,
  Sparkles,
  Stamp,
  Sliders,
  Layers,
} from 'lucide-react';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  desc: string;
  category: 'pdf' | 'image' | 'utility';
  tags: ('organize' | 'compress' | 'convert-to' | 'convert-from' | 'edit-security' | 'image' | 'utility')[];
  icon: any;
  badge?: string;
  badgeStyle?: string;
  colorClass: string;
  iconBgClass: string;
  hoverTitleClass: string;
}

export const ALL_TOOLS: ToolItem[] = [
  // --- PDF TOOLS (iLovePDF Style Red Theme) ---
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: '/pdf/merge',
    desc: 'Combine multiple PDF files into one single document.',
    category: 'pdf',
    tags: ['organize', 'convert-to'],
    icon: Combine,
    badge: 'Popular',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: '/pdf/split',
    desc: 'Separate one page or ranges into independent PDF files.',
    category: 'pdf',
    tags: ['organize'],
    icon: Split,
    badge: 'Essential',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: '/pdf/compress',
    desc: 'Reduce PDF file size while keeping high quality.',
    category: 'pdf',
    tags: ['compress'],
    icon: Minimize2,
    badge: 'Most Used',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'compress-to-200kb',
    name: 'Compress to 200KB',
    slug: '/pdf/compress-to-200kb',
    desc: 'Shrink PDFs under 200KB for official form uploads.',
    category: 'pdf',
    tags: ['compress'],
    icon: Minimize2,
    badge: 'Form Preset',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF Online',
    slug: '/pdf/edit',
    desc: 'Draw, add text, whiteout content, & sign documents.',
    category: 'pdf',
    tags: ['edit-security'],
    icon: Edit3,
    badge: 'Interactive',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    slug: '/pdf/organize',
    desc: 'Rotate, reorder, & delete pages visually.',
    category: 'pdf',
    tags: ['organize'],
    icon: Grid,
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
  },
  {
    id: 'pdf-ocr',
    name: 'PDF OCR Extractor',
    slug: '/pdf/ocr',
    desc: 'Extract editable text from scanned PDFs via AI OCR.',
    category: 'pdf',
    tags: ['convert-from'],
    icon: FileCheck,
    badge: 'AI Wasm',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    slug: '/pdf/watermark',
    desc: 'Add custom text overlays to protect PDF pages.',
    category: 'pdf',
    tags: ['edit-security'],
    icon: Stamp,
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
  },
  {
    id: 'protect-pdf',
    name: 'Password Protect PDF',
    slug: '/pdf/protect',
    desc: 'Encrypt PDF files with strong password protection.',
    category: 'pdf',
    tags: ['edit-security'],
    icon: Lock,
    badge: 'Secure',
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to JPG / PNG',
    slug: '/pdf/to-image',
    desc: 'Export PDF pages as crisp images.',
    category: 'pdf',
    tags: ['convert-from'],
    icon: FileImage,
    colorClass: 'text-rose-600',
    iconBgClass: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-rose-600',
  },

  // --- IMAGE TOOLS (Sky Blue Theme) ---
  {
    id: 'pics-to-pdf',
    name: 'Pics to PDF',
    slug: '/image/pics-to-pdf',
    desc: 'Convert photos & scans into a single clean PDF.',
    category: 'image',
    tags: ['convert-to', 'image'],
    icon: Camera,
    badge: 'Popular',
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    slug: '/image/png-to-jpg',
    desc: 'Bulk convert PNG images to JPG with custom background.',
    category: 'image',
    tags: ['image'],
    icon: FileImage,
    badge: 'Bulk',
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    slug: '/image/jpg-to-png',
    desc: 'Lossless quality conversion from JPG to PNG.',
    category: 'image',
    tags: ['image'],
    icon: FileImage,
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
  },
  {
    id: 'compress-image',
    name: 'Compress Image (Target KB)',
    slug: '/image/compress',
    desc: 'Target size compression (<20KB, <50KB, <100KB).',
    category: 'image',
    tags: ['compress', 'image'],
    icon: Minimize2,
    badge: 'Target KB',
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'compress-image-50kb',
    name: 'Compress Image to 50KB',
    slug: '/image/compress-to-50kb',
    desc: 'Shrink photo size under 50KB for online forms.',
    category: 'image',
    tags: ['compress', 'image'],
    icon: Minimize2,
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
  },
  {
    id: 'compress-image-100kb',
    name: 'Compress Image to 100KB',
    slug: '/image/compress-to-100kb',
    desc: 'Shrink photos under 100KB for identity verification.',
    category: 'image',
    tags: ['compress', 'image'],
    icon: Minimize2,
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
  },
  {
    id: 'passport-maker',
    name: 'Passport Photo Maker',
    slug: '/image/passport-maker',
    desc: 'Crop to exact US, UK, Schengen & India specs.',
    category: 'image',
    tags: ['image'],
    icon: UserCheck,
    badge: 'Presets',
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'remove-background',
    name: 'AI Background Remover',
    slug: '/image/remove-background',
    desc: 'Remove photo backgrounds 100% locally with AI.',
    category: 'image',
    tags: ['image'],
    icon: Scissors,
    badge: 'AI Wasm',
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'heic-converter',
    name: 'Apple HEIC to JPG',
    slug: '/image/convert-heic',
    desc: 'Convert iPhone HEIC photos to compatible JPGs.',
    category: 'image',
    tags: ['image'],
    icon: Smartphone,
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
  },
  {
    id: 'resize-image',
    name: 'Resize Image (Pixels / %)',
    slug: '/image/resize',
    desc: 'Resize image dimensions cleanly with aspect lock.',
    category: 'image',
    tags: ['image'],
    icon: Sliders,
    colorClass: 'text-sky-600',
    iconBgClass: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-sky-600',
  },

  // --- DAILY UTILITIES (Emerald Theme) ---
  {
    id: 'qr-generator',
    name: 'QR Code Maker',
    slug: '/utility/qr-generator',
    desc: 'Generate custom vector QR codes with logo overlay.',
    category: 'utility',
    tags: ['utility'],
    icon: QrCode,
    badge: 'Custom',
    colorClass: 'text-emerald-600',
    iconBgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-emerald-600',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: '/utility/word-counter',
    desc: 'Live word, character count, and keyword density.',
    category: 'utility',
    tags: ['utility'],
    icon: Type,
    colorClass: 'text-emerald-600',
    iconBgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-emerald-600',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    slug: '/utility/json-formatter',
    desc: 'Beautify, minify, validate, and convert JSON to CSV.',
    category: 'utility',
    tags: ['utility'],
    icon: Code2,
    colorClass: 'text-emerald-600',
    iconBgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-emerald-600',
  },

  // --- FLAGSHIP STUDIO (Indigo Theme) ---
  {
    id: 'studio-workspace',
    name: 'All-in-One Studio',
    slug: '/studio',
    desc: 'Universal web workstation for PDF, Image & document tools.',
    category: 'pdf',
    tags: ['organize', 'compress', 'convert-to', 'edit-security'],
    icon: Sparkles,
    badge: 'Full Suite',
    colorClass: 'text-indigo-600',
    iconBgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white',
    hoverTitleClass: 'group-hover:text-indigo-600',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
];

type CategoryFilter = 'all' | 'organize' | 'compress' | 'convert-to' | 'convert-from' | 'edit-security' | 'image' | 'utility';

export function LandingToolGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesFilter =
        activeFilter === 'all' ? true : tool.tags.includes(activeFilter as any);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        (tool.badge && tool.badge.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const categoryCounts = useMemo(() => {
    return {
      all: ALL_TOOLS.length,
      organize: ALL_TOOLS.filter((t) => t.tags.includes('organize')).length,
      compress: ALL_TOOLS.filter((t) => t.tags.includes('compress')).length,
      'convert-to': ALL_TOOLS.filter((t) => t.tags.includes('convert-to')).length,
      'convert-from': ALL_TOOLS.filter((t) => t.tags.includes('convert-from')).length,
      'edit-security': ALL_TOOLS.filter((t) => t.tags.includes('edit-security')).length,
      image: ALL_TOOLS.filter((t) => t.tags.includes('image')).length,
      utility: ALL_TOOLS.filter((t) => t.tags.includes('utility')).length,
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Search Input & Horizontal Swipeable Category Pills Bar */}
      <div className="space-y-4 sm:space-y-6">
        {/* Compact App Search Input */}
        <div className="relative max-w-2xl mx-auto shadow-md rounded-full">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tool (e.g. Merge, Compress 200KB, PNG to JPG)..."
            className="w-full pl-10 sm:pl-13 pr-10 sm:pr-12 py-3 sm:py-4 bg-white border border-slate-300 sm:border-2 sm:border-slate-200 rounded-full text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* 1-Thumb Touch Swipeable Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none flex-nowrap sm:flex-wrap sm:justify-center sm:overflow-visible px-1">
          {[
            { id: 'all', label: 'All Tools', count: categoryCounts.all },
            { id: 'organize', label: 'Merge & Organize', count: categoryCounts.organize },
            { id: 'compress', label: 'Compress & Optimize', count: categoryCounts.compress },
            { id: 'convert-to', label: 'Convert to PDF', count: categoryCounts['convert-to'] },
            { id: 'convert-from', label: 'Convert from PDF', count: categoryCounts['convert-from'] },
            { id: 'edit-security', label: 'Edit & Security', count: categoryCounts['edit-security'] },
            { id: 'image', label: 'Image Studio', count: categoryCounts.image },
            { id: 'utility', label: 'Daily Utilities', count: categoryCounts.utility },
          ].map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id as CategoryFilter)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Results Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 pt-1 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          <h2 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
            {activeFilter === 'all'
              ? 'Every Tool At Your Fingertips'
              : activeFilter === 'organize'
              ? 'Merge & Organize PDF'
              : activeFilter === 'compress'
              ? 'Compress & Optimize'
              : activeFilter === 'convert-to'
              ? 'Convert to PDF'
              : activeFilter === 'convert-from'
              ? 'Convert PDF to Images'
              : activeFilter === 'edit-security'
              ? 'Edit & Security'
              : activeFilter === 'image'
              ? 'Image Studio'
              : 'Daily Utilities'}
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
          {filteredTools.length} Tools
        </span>
      </div>

      {/* Touch-Friendly 2-Column App Grid on Mobile with Framer Motion Entrance */}
      <AnimatePresence mode="wait">
        {filteredTools.length > 0 ? (
          <motion.div
            key={activeFilter + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
          >
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={tool.slug}
                    className="group relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-rose-300 transition-all duration-200 flex flex-col justify-between space-y-3 sm:space-y-4 h-full"
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {/* Top Row: Icon Container & Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border ${tool.iconBgClass} flex items-center justify-center transition-all duration-200 shadow-2xs shrink-0`}
                        >
                          <IconComp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                        </div>

                        {tool.badge && (
                          <span
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold tracking-tight border shrink-0 ${
                              tool.badgeStyle || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3
                          className={`text-xs sm:text-base font-black text-slate-900 ${tool.hoverTitleClass} transition-colors flex items-center justify-between gap-1 leading-snug`}
                        >
                          <span className="truncate">{tool.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0" />
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">No tools found matching &quot;{searchQuery}&quot;</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Try searching for &quot;merge&quot;, &quot;compress&quot;, &quot;png&quot;, or click reset.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
              Reset All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
