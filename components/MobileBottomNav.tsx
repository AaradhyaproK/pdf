'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Crop as CropIcon,
  Hash,
  FileCode,
} from 'lucide-react';

const PDF_TOOLS = [
  { name: 'Edit PDF Online', slug: '/pdf/edit', desc: 'Add text, whiteout & sign', icon: Edit3, badge: 'Popular' },
  { name: 'Compress PDF', slug: '/pdf/compress', desc: 'Shrink PDF up to 80%', icon: Minimize2, badge: 'Popular' },
  { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Target portal size', icon: Minimize2 },
  { name: 'Merge PDF', slug: '/pdf/merge', desc: 'Combine multiple PDFs', icon: Combine },
  { name: 'Split PDF', slug: '/pdf/split', desc: 'Extract pages & ranges', icon: Split },
  { name: 'PDF Page Numberer', slug: '/pdf/page-numbers', desc: 'Add Page X of Y & footers', icon: Hash, badge: 'New' },
  { name: 'Organize PDF', slug: '/pdf/organize', desc: 'Rotate, reorder & delete', icon: Grid },
  { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', desc: 'Extract text via AI Wasm', icon: FileCheck, badge: 'AI Wasm' },
  { name: 'Watermark PDF', slug: '/pdf/watermark', desc: 'Add watermark overlay', icon: Stamp },
  { name: 'Password Protect PDF', slug: '/pdf/protect', desc: 'Encrypt PDF with password', icon: Lock },
  { name: 'PDF to JPG / PNG', slug: '/pdf/to-image', desc: 'Convert PDF to images', icon: ImageIcon },
];

const IMAGE_TOOLS = [
  { name: 'Image Cropper & Aspect', slug: '/image/crop', desc: 'Crop 1:1, 16:9, rotate & flip', icon: CropIcon, badge: 'New' },
  { name: 'SVG Vector Converter', slug: '/image/svg-converter', desc: 'Convert SVG to 2x/4x PNG/JPG', icon: FileCode, badge: 'New' },
  { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', desc: 'Turn photos to PDF', icon: Camera, badge: 'Popular' },
  { name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', desc: 'Convert PNG to JPG', icon: FileImage, badge: 'Bulk' },
  { name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', desc: 'Lossless quality converter', icon: FileImage },
  { name: 'Compress Image (Target KB)', slug: '/image/compress', desc: 'Compress to <50KB, <100KB', icon: Minimize2, badge: 'Target KB' },
  { name: 'Passport Photo Maker', slug: '/image/passport-maker', desc: 'US, UK, Schengen & India', icon: UserCheck, badge: 'Presets' },
  { name: 'AI Background Remover', slug: '/image/remove-background', desc: 'Isolate subjects 100% locally', icon: Scissors, badge: 'AI Wasm' },
  { name: 'Apple HEIC to JPG', slug: '/image/convert-heic', desc: 'Convert iPhone HEIC photos', icon: Smartphone },
  { name: 'Resize Image', slug: '/image/resize', desc: 'Resize pixels & percent', icon: ImageIcon },
];

const UTILITY_TOOLS = [
  { name: 'Base64 Encoder & Decoder', slug: '/utility/base64', desc: 'Convert files/images to Data URLs', icon: Code2, badge: 'New' },
  { name: 'Markdown Editor & PDF', slug: '/utility/markdown-editor', desc: 'Live Markdown & PDF export', icon: FileText, badge: 'New' },
  { name: 'QR Code Generator', slug: '/utility/qr-generator', desc: 'Create custom vector QR codes', icon: QrCode, badge: 'Custom' },
  { name: 'Word & Character Counter', slug: '/utility/word-counter', desc: 'Real-time text stats & SEO density', icon: Type },
  { name: 'JSON Formatter & CSV', slug: '/utility/json-formatter', desc: 'Beautify, validate & convert JSON', icon: Code2 },
];

import { motion } from 'framer-motion';

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeDrawer, setActiveDrawer] = useState<'pdf' | 'image' | 'utility' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inFooter, setInFooter] = useState(false);

  const handleSelectTool = (slug: string) => {
    setActiveDrawer(null);
    setSearchQuery('');
    router.push(slug);
  };

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

  const getActiveTab = () => {
    if (activeDrawer === 'pdf' || (pathname?.startsWith('/pdf') && !activeDrawer)) return 'pdf';
    if (activeDrawer === 'image' || (pathname?.startsWith('/image') && !activeDrawer && pathname !== '/image/pics-to-pdf')) return 'image';
    if (activeDrawer === 'utility' || (pathname?.startsWith('/utility') && !activeDrawer)) return 'utility';
    if (pathname === '/image/pics-to-pdf' || pathname === '/image/to-pdf') return 'create-pdf';
    if (pathname === '/') return 'home';
    return null;
  };

  const activeTab = getActiveTab();

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

  const isHomePage = pathname === '/' || pathname === '' || pathname === '/about';
  if (!isHomePage) return null;

  return (
    <>
      {/* Mobile Glassmorphic Bottom Drawer Sheet (Visible when activeDrawer !== null) */}
      {activeDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
          {/* Touch Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-md transition-opacity"
            onClick={() => setActiveDrawer(null)}
          />

          <div
            className="relative liquid-glass-drawer rounded-t-3xl shadow-2xl border-t border-white/60 max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 z-10"
            style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Handlebar Pill */}
            <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={() => setActiveDrawer(null)}>
              <div className="w-12 h-1.5 rounded-full bg-slate-300/80 shadow-xs" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900 text-white font-bold shadow-xs">
                  {activeDrawer === 'pdf' && <FileText className="w-4 h-4" />}
                  {activeDrawer === 'image' && <ImageIcon className="w-4 h-4" />}
                  {activeDrawer === 'utility' && <Wrench className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 capitalize tracking-tight">
                    {activeDrawer === 'pdf' ? 'PDF Studio Tools' : activeDrawer === 'image' ? 'Image Studio Tools' : 'Daily Quick Utilities'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Client-Side Wasm
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDrawer(null)}
                className="p-2 rounded-full bg-slate-100/80 text-slate-600 hover:bg-slate-200 active:scale-90 transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Instant Search Bar inside Mobile Drawer */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200/50 backdrop-blur-md">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeDrawer.toUpperCase()} tools...`}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/90 border border-slate-200/90 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Tool List */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]">
              {filteredTools.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  No tools found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const iconStyle = 'bg-slate-100/90 text-slate-800 border-slate-200/80';
                  const badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200/80';

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
                      className="w-full text-left p-3 rounded-2xl bg-white/80 hover:bg-white active:bg-slate-100 border border-slate-200/70 flex items-center justify-between active:scale-[0.98] transition-all duration-150 shadow-2xs cursor-pointer"
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

      {/* Apple Dynamic Island Floating Mobile Bottom Nav */}
      <nav
        aria-label="Mobile Navigation"
        className={`md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.75rem)] max-w-sm sm:max-w-md apple-dynamic-island luma-glass-texture rounded-full p-1.5 transition-all duration-300 ease-in-out ${
          inFooter ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-5 gap-1 items-center relative">
          {/* 1. Home Tab */}
          <Link
            href="/"
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'home' ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'home' && (
              <motion.div
                layoutId="dynamic-island-active-pill"
                className="absolute inset-0 rounded-full bg-slate-900/10 border border-slate-900/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <Home className="w-4.5 h-4.5 z-10" />
            <span className="text-[9px] mt-0.5 z-10 tracking-tight font-medium">Home</span>
          </Link>

          {/* 2. PDF Studio Sheet Trigger */}
          <button
            onClick={() => toggleDrawer('pdf')}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'pdf' ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'pdf' && (
              <motion.div
                layoutId="dynamic-island-active-pill"
                className="absolute inset-0 rounded-full bg-slate-900/10 border border-slate-900/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <FileText className="w-4.5 h-4.5 z-10" />
            <span className="text-[9px] mt-0.5 z-10 tracking-tight font-medium">PDF</span>
          </button>

          {/* 3. Create PDF (Center Highlighted Transparent Liquid Glass Orb) */}
          <Link
            href="/image/pics-to-pdf"
            className="relative flex flex-col items-center justify-center -mt-5 active:scale-90 transition-transform duration-150 group"
          >
            <div className="w-12 h-12 rounded-full liquid-orb-glow flex items-center justify-center relative group-hover:scale-105 transition-transform">
              {/* Specular glare reflection dot */}
              <div className="absolute top-1 left-2.5 w-3.5 h-1.5 rounded-full bg-white/80 blur-[0.5px]" />
              <FilePlus className="w-5 h-5 text-slate-800 drop-shadow-xs" />
            </div>
            <span className="text-[9px] font-extrabold text-slate-800 mt-1 tracking-tight">Create PDF</span>
          </Link>

          {/* 4. Image Studio Sheet Trigger */}
          <button
            onClick={() => toggleDrawer('image')}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'image' ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'image' && (
              <motion.div
                layoutId="dynamic-island-active-pill"
                className="absolute inset-0 rounded-full bg-slate-900/10 border border-slate-900/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <ImageIcon className="w-4.5 h-4.5 z-10" />
            <span className="text-[9px] mt-0.5 z-10 tracking-tight font-medium">Image</span>
          </button>

          {/* 5. Quick Utility Sheet Trigger */}
          <button
            onClick={() => toggleDrawer('utility')}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'utility' ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'utility' && (
              <motion.div
                layoutId="dynamic-island-active-pill"
                className="absolute inset-0 rounded-full bg-slate-900/10 border border-slate-900/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <Wrench className="w-4.5 h-4.5 z-10" />
            <span className="text-[9px] mt-0.5 z-10 tracking-tight font-medium">Utility</span>
          </button>
        </div>
      </nav>
    </>
  );
}
