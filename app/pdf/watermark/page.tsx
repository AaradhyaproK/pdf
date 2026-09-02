'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { watermarkPDF, renderPDFPagesToImages, WatermarkOptions } from '@/lib/pdf-engine';
import { FullPageViewerModal } from '@/components/FullPageViewerModal';
import { toast } from 'sonner';
import {
  Download,
  Stamp,
  Type,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Sliders,
  RotateCw,
  Upload,
  Maximize2,
} from 'lucide-react';

interface PageThumbnail {
  pageNumber: number;
  dataUrl: string;
}

export default function WatermarkPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Watermark Settings
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [opacity, setOpacity] = useState(40);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<WatermarkOptions['position']>('center');
  const [colorHex, setColorHex] = useState('#ef4444');
  const [fontSize, setFontSize] = useState(36); // doubles as image scale % for image watermark

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isFullViewerOpen, setIsFullViewerOpen] = useState(false);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    if (selected.length === 0) {
      setThumbnails([]);
      setActivePageIndex(0);
      return;
    }

    setIsLoadingPages(true);
    try {
      const rendered = await renderPDFPagesToImages(selected[0].file, 1.2);
      const thumbs = rendered.map((r) => ({
        pageNumber: r.pageNumber,
        dataUrl: r.dataUrl,
      }));
      setThumbnails(thumbs);
      setActivePageIndex(0);
    } catch (err: any) {
      console.error('PDF watermark preview error:', err);
      toast.error(err?.message ? `Failed to render PDF previews: ${err.message}` : 'Failed to render PDF page previews. Ensure the file is not password-protected.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }
      setWatermarkImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setWatermarkType('image');
      toast.success('Watermark logo image uploaded!');
    }
  };

  const handleApplyWatermark = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      toast.error('Please enter watermark text.');
      return;
    }

    if (watermarkType === 'image' && !watermarkImageFile) {
      toast.error('Please upload an image logo for the watermark.');
      return;
    }

    setIsProcessing(true);
    try {
      const bytes = await watermarkPDF(files[0].file, {
        text: watermarkType === 'text' ? watermarkText : undefined,
        image: watermarkType === 'image' && watermarkImageFile ? watermarkImageFile : undefined,
        opacity,
        rotation,
        position,
        colorHex,
        fontSize,
      });
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Watermark applied successfully to PDF!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to watermark PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for CSS overlay positioning
  const getOverlayPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6 items-start justify-start';
      case 'top-right':
        return 'top-6 right-6 items-start justify-end';
      case 'bottom-left':
        return 'bottom-6 left-6 items-end justify-start';
      case 'bottom-right':
        return 'bottom-6 right-6 items-end justify-end';
      case 'center':
      default:
        return 'inset-0 items-center justify-center';
    }
  };

  return (
    <ToolLayout
      slug="/pdf/watermark"
      title="Watermark PDF Documents Online"
      subtitle="Stamp custom text or logo image watermarks onto your PDF pages. Customize position, transparency, scale, and rotation with live preview."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setThumbnails([]);
            setActivePageIndex(0);
            setDownloadUrl(null);
          }}
          title="Upload PDF document to watermark"
        />

        {isLoadingPages && (
          <div className="py-12 text-center text-slate-600 animate-pulse text-sm font-medium flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
            <span>Rendering PDF document pages for live watermark preview...</span>
          </div>
        )}

        {thumbnails.length > 0 && !isLoadingPages && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Left Column: Live PDF Page Watermark Preview Canvas */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    Live Watermark Preview
                  </span>

                  {/* Page Navigation Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFullViewerOpen(true)}
                      className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1 text-xs font-extrabold cursor-pointer"
                      title="Zoom Full Page View"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activePageIndex === 0}
                      className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800">
                      Page {activePageIndex + 1} of {thumbnails.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePageIndex((prev) => Math.min(thumbnails.length - 1, prev + 1))}
                      disabled={activePageIndex === thumbnails.length - 1}
                      className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PDF Page Canvas Preview Container */}
                <div className="relative w-full h-[420px] flex items-center justify-center bg-slate-50 rounded-xl p-3 border border-slate-200 overflow-hidden shadow-2xs">
                  <img
                    src={thumbnails[activePageIndex]?.dataUrl}
                    alt={`Page ${activePageIndex + 1}`}
                    className="max-h-full max-w-full object-contain shadow-md rounded-sm"
                  />

                  {/* REAL-TIME CSS WATERMARK OVERLAY */}
                  <div className={`absolute p-4 flex pointer-events-none ${getOverlayPositionClasses()}`}>
                    {watermarkType === 'text' ? (
                      <div
                        className="font-black tracking-widest uppercase transition-all duration-150 select-none text-center drop-shadow-xs"
                        style={{
                          color: colorHex,
                          opacity: opacity / 100,
                          transform: `rotate(${rotation}deg)`,
                          fontSize: `${Math.max(14, Math.round(fontSize * 0.7))}px`,
                        }}
                      >
                        {watermarkText || 'CONFIDENTIAL'}
                      </div>
                    ) : imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Watermark Logo"
                        className="object-contain transition-all duration-150 select-none drop-shadow-xs"
                        style={{
                          width: `${Math.max(40, fontSize * 2.5)}px`,
                          maxHeight: `${Math.max(40, fontSize * 2.5)}px`,
                          opacity: opacity / 100,
                          transform: `rotate(${rotation}deg)`,
                        }}
                      />
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-white font-bold text-xs">
                        Upload Logo Image below
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Live preview reflects real-time position, opacity, scale, and rotation settings.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Watermark Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                {/* Watermark Type Selector Tabs */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Stamp className="w-4 h-4 text-indigo-600" />
                    Select Watermark Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setWatermarkType('text')}
                      className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        watermarkType === 'text'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      <span>Text Watermark</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWatermarkType('image')}
                      className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        watermarkType === 'image'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Image / Logo</span>
                    </button>
                  </div>
                </div>

                {/* Text Watermark Controls */}
                {watermarkType === 'text' ? (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      />
                    </div>

                    {/* Quick Text Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['CONFIDENTIAL', 'SAMPLE', 'DRAFT', 'DO NOT COPY', 'OFFICIAL'].map((presetStr) => (
                        <button
                          key={presetStr}
                          type="button"
                          onClick={() => setWatermarkText(presetStr)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 border border-slate-200 text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
                        >
                          {presetStr}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">Font Size ({fontSize}px)</label>
                        <input
                          type="range"
                          min="16"
                          max="72"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorHex}
                            onChange={(e) => setColorHex(e.target.value)}
                            className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                          />
                          <span className="font-mono text-xs font-bold text-slate-800 uppercase">{colorHex}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Image / Logo Watermark Controls */
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Upload Image / Logo (PNG, JPG)</label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>{watermarkImageFile ? 'Change Logo Image' : 'Select Logo File'}</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        {watermarkImageFile && (
                          <span className="text-xs font-semibold text-emerald-700 truncate max-w-[180px]">
                            ✓ {watermarkImageFile.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Logo Size / Scale ({fontSize}%)</label>
                      <input
                        type="range"
                        min="15"
                        max="80"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                )}

                {/* Common Watermark Controls: Position, Opacity & Rotation */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Stamp Position</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    >
                      <option value="center">Center of Page</option>
                      <option value="top-left">Top Left Corner</option>
                      <option value="top-right">Top Right Corner</option>
                      <option value="bottom-left">Bottom Left Corner</option>
                      <option value="bottom-right">Bottom Right Corner</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Opacity ({opacity}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Rotation ({rotation}°)</label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleApplyWatermark}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-black text-base shadow-lg shadow-indigo-500/20 disabled:opacity-40 transition-all cursor-pointer"
                >
                  {isProcessing ? 'Stamping Watermark onto PDF...' : 'Apply Watermark & Save PDF'}
                </button>
              </div>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <h4 className="font-black text-emerald-950">Watermarked PDF Ready!</h4>
              <p className="text-xs text-emerald-800 font-medium">
                {watermarkType === 'text' ? `Stamped text "${watermarkText}"` : 'Stamped logo image'} cleanly on all document pages.
              </p>
            </div>
            <a
              href={downloadUrl}
              download="watermarked-document.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Watermarked PDF</span>
            </a>
          </div>
        )}

        {isFullViewerOpen && (
          <FullPageViewerModal
            isOpen={isFullViewerOpen}
            onClose={() => setIsFullViewerOpen(false)}
            pages={thumbnails}
            initialPageIndex={activePageIndex}
            title="PDF Watermark Full Page View"
          />
        )}
      </div>
    </ToolLayout>
  );
}

