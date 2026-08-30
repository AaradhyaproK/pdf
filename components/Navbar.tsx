'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PrivacyBadge } from './PrivacyBadge';
import {
  FileText,
  Image as ImageIcon,
  Wrench,
  Menu,
  X,
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

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'pdf' | 'image' | 'utility'>('pdf');
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/1.png"
            alt="FileZenith Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
              FileZenith
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              100% Client-Side Engine
            </span>
          </div>
        </Link>

        {/* Desktop Megamenu Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700">
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

        {/* Privacy Badge & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <PrivacyBadge />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Touch-Friendly Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Mobile Category Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl text-xs font-black text-center border border-slate-200/60">
            <button
              onClick={() => setMobileTab('pdf')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'pdf' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => setMobileTab('image')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'image' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>
            <button
              onClick={() => setMobileTab('utility')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'utility' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Utility</span>
            </button>
          </div>

          {/* Active Tab Tool List */}
          <div className="grid grid-cols-1 gap-2">
            {(mobileTab === 'pdf' ? PDF_TOOLS : mobileTab === 'image' ? IMAGE_TOOLS : UTILITY_TOOLS).map((tool) => {
              const Icon = tool.icon;
              const iconStyle =
                mobileTab === 'pdf'
                  ? 'bg-rose-100 text-rose-700'
                  : mobileTab === 'image'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-emerald-100 text-emerald-700';

              const badgeStyle =
                mobileTab === 'pdf'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : mobileTab === 'image'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onClick={() => setMobileOpen(false)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between border border-slate-200/80 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shadow-xs shrink-0 ${iconStyle}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-900 truncate block">{tool.name}</span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                    </div>
                  </div>
                  {tool.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                      {tool.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
