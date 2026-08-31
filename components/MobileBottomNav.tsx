'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Image as ImageIcon,
  Wrench,
  Search,
  X,
  ShieldCheck,
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
  FilePlus,
} from 'lucide-react';

const PDF_TOOLS = [
  { name: 'Edit PDF Online', slug: '/pdf/edit', desc: 'Add text, whiteout & sign', icon: Edit3, badge: 'Popular' },
  { name: 'Compress PDF', slug: '/pdf/compress', desc: 'Shrink PDF up to 80%', icon: Minimize2, badge: 'Popular' },
  { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Target portal size', icon: Minimize2 },
  { name: 'Merge PDF', slug: '/pdf/merge', desc: 'Combine multiple PDFs', icon: Combine },
  { name: 'Split PDF', slug: '/pdf/split', desc: 'Extract pages & ranges', icon: Split },
  { name: 'Organize PDF', slug: '/pdf/organize', desc: 'Rotate, reorder & delete', icon: Grid },
  { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', desc: 'Extract text via AI Wasm', icon: FileCheck, badge: 'AI Wasm' },
  { name: 'Watermark PDF', slug: '/pdf/watermark', desc: 'Add watermark overlay', icon: Stamp },
  { name: 'Password Protect PDF', slug: '/pdf/protect', desc: 'Encrypt PDF with password', icon: Lock },
  { name: 'PDF to JPG / PNG', slug: '/pdf/to-image', desc: 'Convert PDF to images', icon: ImageIcon },
];

const IMAGE_TOOLS = [
  { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', desc: 'Turn photos to PDF', icon: Camera, badge: 'Popular' },
  { name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', desc: 'Convert PNG to JPG', icon: FileImage, badge: 'Bulk' },
  { name: 'PNG to PDF Converter', slug: '/image/png-to-pdf', desc: 'Combine PNG into PDF', icon: FileText },
  { name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', desc: 'Lossless quality converter', icon: FileImage },
  { name: 'Compress Image (Target KB)', slug: '/image/compress', desc: 'Compress to <50KB, <100KB', icon: Minimize2, badge: 'Target KB' },
  { name: 'Passport Photo Maker', slug: '/image/passport-maker', desc: 'US, UK, Schengen & India', icon: UserCheck, badge: 'Presets' },
  { name: 'AI Background Remover', slug: '/image/remove-background', desc: 'Isolate subjects 100% locally', icon: Scissors, badge: 'AI Wasm' },
  { name: 'Apple HEIC to JPG', slug: '/image/convert-heic', desc: 'Convert iPhone HEIC photos', icon: Smartphone },
  { name: 'Resize Image', slug: '/image/resize', desc: 'Resize pixels & percent', icon: ImageIcon },
  { name: 'Image to PDF', slug: '/image/to-pdf', desc: 'Combine photos into PDF', icon: FileText },
];

const UTILITY_TOOLS = [
  { name: 'QR Code Generator', slug: '/utility/qr-generator', desc: 'Create custom vector QR codes', icon: QrCode, badge: 'Custom' },
  { name: 'Word & Character Counter', slug: '/utility/word-counter', desc: 'Real-time text stats & SEO density', icon: Type },
  { name: 'JSON Formatter & CSV', slug: '/utility/json-formatter', desc: 'Beautify, validate & convert JSON', icon: Code2 },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [activeDrawer, setActiveDrawer] = useState<'pdf' | 'image' | 'utility' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inFooter, setInFooter] = useState(false);

  // Close drawer on page route change
  useEffect(() => {
    setActiveDrawer(null);
    setSearchQuery('');
  }, [pathname]);

  // Hide bottom nav when scrolling into footer (#main-footer)
  useEffect(() => {
    const footerEl = document.getElementById('main-footer');
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInFooter(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [pathname]);

  const toggleDrawer = (tab: 'pdf' | 'image' | 'utility') => {
    if (activeDrawer === tab) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(tab);
      setSearchQuery('');
    }
  };

  const isTabActive = (category: string) => {
    if (category === 'home') return pathname === '/';
    if (category === 'create-pdf') return pathname === '/image/pics-to-pdf' || pathname === '/image/to-pdf';
    if (category === 'pdf') return pathname?.startsWith('/pdf') || activeDrawer === 'pdf';
    if (category === 'image') return pathname?.startsWith('/image') || activeDrawer === 'image';
    if (category === 'utility') return pathname?.startsWith('/utility') || activeDrawer === 'utility';
    return false;
  };

  const getToolsForCategory = () => {
    if (activeDrawer === 'pdf') return PDF_TOOLS;
    if (activeDrawer === 'image') return IMAGE_TOOLS;
    if (activeDrawer === 'utility') return UTILITY_TOOLS;
    return [];
  };

  const filteredTools = getToolsForCategory().filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Glassmorphic Bottom Drawer Sheet (Visible when activeDrawer !== null) */}
      {activeDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
          {/* Touch Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setActiveDrawer(null)}
          />

          <div
            className="relative bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 z-10"
            style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Handlebar Pill */}
            <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={() => setActiveDrawer(null)}>
              <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl text-white font-bold ${
                    activeDrawer === 'pdf'
                      ? 'bg-rose-600'
                      : activeDrawer === 'image'
                      ? 'bg-sky-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {activeDrawer === 'pdf' && <FileText className="w-4 h-4" />}
                  {activeDrawer === 'image' && <ImageIcon className="w-4 h-4" />}
                  {activeDrawer === 'utility' && <Wrench className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 capitalize">
                    {activeDrawer === 'pdf' ? 'PDF Studio Tools' : activeDrawer === 'image' ? 'Image Studio Tools' : 'Daily Quick Utilities'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Client-Side Wasm
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDrawer(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Instant Search Bar inside Mobile Drawer */}
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeDrawer.toUpperCase()} tools...`}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Tool List */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]">
              {filteredTools.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No tools found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const iconStyle =
                    activeDrawer === 'pdf'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : activeDrawer === 'image'
                      ? 'bg-sky-50 text-sky-600 border-sky-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100';

                  const badgeStyle =
                    activeDrawer === 'pdf'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : activeDrawer === 'image'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${iconStyle}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-slate-900 block truncate">
                            {tool.name}
                          </span>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                            {tool.desc}
                          </p>
                        </div>
                      </div>
                      {tool.badge && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                          {tool.badge}
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Native App-Style Mobile Bottom Bar (Fixed at bottom on screens < md, smoothly hides when in footer) */}
      <nav
        aria-label="Mobile Navigation"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-2 transition-all duration-300 ease-in-out ${
          inFooter ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        style={{ paddingBottom: 'calc(0.85rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {/* 1. Home Tab */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
              isTabActive('home') ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          {/* 2. PDF Studio Sheet Trigger */}
          <button
            onClick={() => toggleDrawer('pdf')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
              isTabActive('pdf') ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">PDF</span>
          </button>

          {/* 3. Create PDF (Center Highlighted Action Tab - Pics to PDF) */}
          <Link
            href="/image/pics-to-pdf"
            className="flex flex-col items-center justify-center -mt-3.5 active:scale-95 transition-all"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 border-2 border-white">
              <FilePlus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-rose-700 mt-0.5">Create PDF</span>
          </Link>

          {/* 4. Image Studio Sheet Trigger */}
          <button
            onClick={() => toggleDrawer('image')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
              isTabActive('image') ? 'text-sky-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Image</span>
          </button>

          {/* 5. Quick Utility Sheet Trigger */}
          <button
            onClick={() => toggleDrawer('utility')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
              isTabActive('utility') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Utility</span>
          </button>
        </div>
      </nav>
    </>
  );
}
