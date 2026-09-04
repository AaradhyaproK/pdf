'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Edit3,
  Minimize2,
  Combine,
  Split,
  Grid,
  FileCheck,
  Stamp,
  Lock,
  ImageIcon,
  Camera,
  FileImage,
  FileText,
  UserCheck,
  Scissors,
  Smartphone,
  Sparkles,
  Upload,
  RefreshCw,
  Download,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { compressPDF, renderPDFPagesToImages } from '@/lib/pdf-engine';
import { imagesToPDF } from '@/lib/image-engine';

export const MASTER_TOOLS = [
  { id: 'edit-pdf', name: 'Edit PDF Online', slug: '/pdf/edit', desc: 'Add text, whiteout content, draw & sign', icon: Edit3, category: 'pdf', badge: 'Interactive' },
  { id: 'compress-pdf', name: 'Compress PDF', slug: '/pdf/compress', desc: 'Shrink PDF size up to 80%', icon: Minimize2, category: 'pdf', badge: 'Popular' },
  { id: 'compress-200kb', name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Target size for form uploads', icon: Minimize2, category: 'pdf' },
  { id: 'merge-pdf', name: 'Merge PDF', slug: '/pdf/merge', desc: 'Combine multiple PDFs into one', icon: Combine, category: 'pdf' },
  { id: 'split-pdf', name: 'Split PDF', slug: '/pdf/split', desc: 'Extract pages & custom page ranges', icon: Split, category: 'pdf' },
  { id: 'organize-pdf', name: 'Organize PDF', slug: '/pdf/organize', desc: 'Rotate, reorder & delete pages', icon: Grid, category: 'pdf' },
  { id: 'ocr-pdf', name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', desc: 'Extract editable text via AI Tesseract', icon: FileCheck, category: 'pdf', badge: 'AI Wasm' },
  { id: 'watermark-pdf', name: 'Watermark PDF', slug: '/pdf/watermark', desc: 'Add text watermark overlays', icon: Stamp, category: 'pdf' },
  { id: 'protect-pdf', name: 'Password Protect PDF', slug: '/pdf/protect', desc: 'Encrypt PDF with password', icon: Lock, category: 'pdf' },
  { id: 'pdf-to-word', name: 'PDF to Word (DOCX)', slug: '/pdf/pdf-to-word', desc: 'Convert PDF to editable Word document', icon: FileText, category: 'pdf', badge: 'Popular' },
  { id: 'word-to-pdf', name: 'Word to PDF Converter', slug: '/pdf/word-to-pdf', desc: 'Convert Word DOCX to crisp PDF', icon: FileText, category: 'pdf', badge: 'New' },
  { id: 'pdf-to-image', name: 'PDF to JPG / PNG', slug: '/pdf/to-image', desc: 'Convert PDF pages into high-res images', icon: ImageIcon, category: 'pdf' },
  { id: 'pics-to-pdf', name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', desc: 'Turn photos & scans into PDF', icon: Camera, category: 'image', badge: 'Popular' },
  { id: 'png-to-jpg', name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', desc: 'Bulk convert PNG to JPG with background color', icon: FileImage, category: 'image', badge: 'Bulk' },
  { id: 'png-to-pdf', name: 'PNG to PDF Converter', slug: '/image/png-to-pdf', desc: 'Combine PNG images into a PDF document', icon: FileText, category: 'image' },
  { id: 'jpg-to-png', name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', desc: 'Lossless quality JPG to PNG conversion', icon: FileImage, category: 'image' },
  { id: 'compress-img', name: 'Compress Image (Target KB)', slug: '/image/compress', desc: 'Compress to <20KB, <50KB, <100KB', icon: Minimize2, category: 'image', badge: 'Target KB' },
  { id: 'passport-maker', name: 'Passport Photo Maker', slug: '/image/passport-maker', desc: 'Crop to US, UK, Schengen & India specs', icon: UserCheck, category: 'image', badge: 'Presets' },
  { id: 'remove-bg', name: 'AI Background Remover', slug: '/image/remove-background', desc: 'Remove photo backgrounds 100% locally', icon: Scissors, category: 'image', badge: 'AI' },
  { id: 'heic-to-jpg', name: 'Apple HEIC to JPG', slug: '/image/convert-heic', desc: 'Convert iPhone HEIC photos to JPG', icon: Smartphone, category: 'image' },
  { id: 'resize-img', name: 'Resize Image (Pixels / %)', slug: '/image/resize', desc: 'Resize image dimensions cleanly', icon: ImageIcon, category: 'image' },
  { id: 'to-pdf', name: 'Image to PDF Converter', slug: '/image/to-pdf', desc: 'Combine JPG, PNG, WebP into PDF', icon: FileText, category: 'image' },
];

export default function FlagshipStudioPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pdf' | 'image'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<string>('compress-pdf');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const filteredTools = MASTER_TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setUploadedFiles((prev) => [...prev, ...selected]);
    toast.success(`Loaded ${selected.length} file(s) into Master Studio Canvas.`);
  };

  const handleQuickExecute = async () => {
    if (!uploadedFiles.length) {
      toast.error('Please upload at least one file to execute tools.');
      return;
    }

    setIsProcessing(true);
    toast.info('Processing file in Flagship All-in-One Studio...');

    try {
      const file = uploadedFiles[0];

      if (selectedToolId === 'compress-pdf' && file.type === 'application/pdf') {
        const compressedBytes = await compressPDF(file, 'recommended');
        const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
        setOutputUrl(URL.createObjectURL(blob));
        toast.success('PDF compressed successfully!');
      } else if ((selectedToolId === 'pics-to-pdf' || selectedToolId === 'to-pdf') && file.type.startsWith('image/')) {
        const pdfBytes = await imagesToPDF(uploadedFiles, 'portrait', 'a4', 20);
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        setOutputUrl(URL.createObjectURL(blob));
        toast.success('Images converted to PDF successfully!');
      } else if (selectedToolId === 'pdf-to-image' && file.type === 'application/pdf') {
        const pageImages = await renderPDFPagesToImages(file, 1.5);
        if (pageImages.length > 0) {
          setOutputUrl(pageImages[0].dataUrl);
          toast.success('PDF Page 1 rendered to Image!');
        }
      } else {
        const tool = MASTER_TOOLS.find((t) => t.id === selectedToolId);
        toast.info(`Redirecting to dedicated ${tool?.name} workspace...`);
        window.location.href = tool?.slug || '/pdf/compress';
      }
    } catch {
      toast.error('Failed to execute tool. Opening dedicated workspace...');
      const tool = MASTER_TOOLS.find((t) => t.id === selectedToolId);
      window.location.href = tool?.slug || '/pdf/compress';
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/studio"
      title="Flagship All-in-One PDF & Image Studio"
      subtitle="Access all 50+ PDF editing, compression, OCR, watermark, protection, conversion, passport maker, background removal, and resize tools at a glance on one single interactive page."
      badgeText="Flagship All-in-One Suite"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Master Banner & Quick Workspace */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Flagship All-in-One Master Workspace
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              One Single Page. All 50+ Tools At A Glance.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Upload any document or image once and execute PDF compression, editing, OCR, format conversions, passport photos, and background removal seamlessly.
            </p>
          </div>

          {/* Master Drag & Drop File Upload */}
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 text-center space-y-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/80 text-white flex items-center justify-center mx-auto shadow-md">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload PDFs or Images into Master Studio</h3>
              <p className="text-xs text-slate-300 mt-1">
                Supports PDF, JPG, PNG, WebP, HEIC files. 100% private client-side processing.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm shadow-lg transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload Files to Master Studio</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFiles.length > 0 && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-indigo-200">
                <span>Loaded ({uploadedFiles.length} files):</span>
                {uploadedFiles.map((f, i) => (
                  <span key={i} className="bg-white/20 text-white px-2.5 py-1 rounded-lg text-[11px] truncate max-w-[150px]">
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tools Catalog Bar & Search (All 20 Tools at a Glance) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeCategory === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tools ({MASTER_TOOLS.length})
              </button>
              <button
                onClick={() => setActiveCategory('pdf')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeCategory === 'pdf' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PDF Tools (10)
              </button>
              <button
                onClick={() => setActiveCategory('image')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeCategory === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Image Tools (10)
              </button>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search all 20 tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 20 Master Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = selectedToolId === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                    isSelected
                      ? 'border-2 border-indigo-600 bg-indigo-50/40 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                          tool.category === 'pdf'
                            ? 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
                            : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {tool.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tool.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-indigo-600">
                    <span>{isSelected ? 'Selected in Master Studio' : 'Open Tool'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tool Direct Action Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-black text-slate-900">
                Active Master Tool: {MASTER_TOOLS.find((t) => t.id === selectedToolId)?.name}
              </h3>
            </div>

            <Link
              href={MASTER_TOOLS.find((t) => t.id === selectedToolId)?.slug || '/pdf/compress'}
              className="text-xs font-extrabold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Go to Full Page Tool</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            onClick={handleQuickExecute}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Execute {MASTER_TOOLS.find((t) => t.id === selectedToolId)?.name} Now</span>
          </button>

          {outputUrl && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold text-emerald-900">🎉 Result Processed in Master Studio!</p>
                <p className="text-[11px] text-emerald-700 font-medium">Your processed file is ready for download.</p>
              </div>
              <a
                href={outputUrl}
                download="filezenith-studio-result"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Result
              </a>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
