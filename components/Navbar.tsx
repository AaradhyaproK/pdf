'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PrivacyBadge } from './PrivacyBadge';
import { FileText, Image as ImageIcon, Wrench, Menu, X, Layers, Share2, ChevronRight } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
              OmniTool<span className="text-indigo-600">Suite</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              100% Client-Side Engine
            </span>
          </div>
        </Link>

        {/* Desktop Category Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
          <Link
            href="/pdf/compress"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              isActive('/pdf')
                ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200/60'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-rose-500" />
            <span>PDF Studio</span>
          </Link>

          <Link
            href="/image/compress"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              isActive('/image')
                ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/60'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-sky-500" />
            <span>Image Studio</span>
          </Link>

          <Link
            href="/social/youtube-downloader"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              isActive('/social')
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200/60'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>Social Downloader</span>
          </Link>

          <Link
            href="/utility/qr-generator"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              isActive('/utility')
                ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-500" />
            <span>Daily Utilities</span>
          </Link>
        </nav>

        {/* Privacy Badge & Touch-Friendly Mobile Trigger */}
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

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg p-4 space-y-2.5 animate-in slide-in-from-top duration-200 shadow-xl">
          <Link
            href="/pdf/compress"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between min-h-[48px] p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-slate-800 font-bold active:bg-rose-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">PDF Studio</div>
                <div className="text-[11px] text-slate-500 font-normal">Compress, Merge, Split, OCR</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/image/compress"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between min-h-[48px] p-3 rounded-2xl bg-sky-50/50 border border-sky-100 text-slate-800 font-bold active:bg-sky-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500 text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Image Studio</div>
                <div className="text-[11px] text-slate-500 font-normal">Target KB, Passport, BG Remove</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/social/youtube-downloader"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between min-h-[48px] p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-slate-800 font-bold active:bg-purple-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-600 text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Social Downloader</div>
                <div className="text-[11px] text-slate-500 font-normal">YouTube, Insta, X/Twitter, LinkedIn</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/utility/qr-generator"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between min-h-[48px] p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-slate-800 font-bold active:bg-emerald-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Daily Utilities</div>
                <div className="text-[11px] text-slate-500 font-normal">QR Generator, Word Counter, JSON</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>
      )}
    </header>
  );
}
