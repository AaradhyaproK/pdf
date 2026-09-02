'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  Hash,
  Eye,
  Loader2,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sliders,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';

type Position = 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right' | 'top-center' | 'top-left';
type Format = 'page-x-of-y' | 'x' | 'page-x' | 'dash-x';

interface PDFPageThumbnail {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export default function PDFPageNumbersPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pages, setPages] = useState<PDFPageThumbnail[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [format, setFormat] = useState<Format>('page-x-of-y');
  const [fontSize, setFontSize] = useState<number>(11);
  const [textColor, setTextColor] = useState<string>('#1e293b');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('numbered-document.pdf');

  // Preview Modal state
  const [previewPageIndex, setPreviewPageIndex] = useState<number | null>(null);

  // Lock body scroll when preview modal is open on mobile
  useEffect(() => {
    if (previewPageIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [previewPageIndex]);

  // Handle file select and render page thumbnails
  const handleFilesSelected = async (selectedFiles: FileItem[]) => {
    setFiles(selectedFiles);
    setDownloadUrl(null);
    setPreviewPageIndex(null);

    if (selectedFiles.length === 0) {
      setPages([]);
      return;
    }

    setIsLoadingPages(true);
    try {
      const file = selectedFiles[0].file;
      const renderedPages = await renderPDFPagesToImages(file, 1.2);
      setPages(renderedPages);
      toast.success(`Loaded ${renderedPages.length} PDF pages`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to render PDF page previews.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getPageText = (pageIdx: number, total: number) => {
    const currentPageNum = pageIdx + 1;
    if (format === 'page-x-of-y') {
      return `Page ${currentPageNum} of ${total}`;
    } else if (format === 'x') {
      return `${currentPageNum}`;
    } else if (format === 'page-x') {
      return `Page ${currentPageNum}`;
    } else {
      return `- ${currentPageNum} -`;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-[5%] right-[5%] text-right';
      case 'bottom-center':
        return 'bottom-[5%] left-1/2 -translate-x-1/2 text-center';
      case 'bottom-left':
        return 'bottom-[5%] left-[5%] text-left';
      case 'top-right':
        return 'top-[5%] right-[5%] text-right';
      case 'top-center':
        return 'top-[5%] left-1/2 -translate-x-1/2 text-center';
      case 'top-left':
        return 'top-[5%] left-[5%] text-left';
      default:
        return 'bottom-[5%] left-1/2 -translate-x-1/2 text-center';
    }
  };

  const getRGBColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);

    try {
      const file = files[0].file;
      const arrayBuffer = await file.arrayBuffer();
      setProgressPercent(30);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const text = getPageText(i, totalPages);

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        let x = 0;
        let y = 0;
        const margin = 20;

        if (position === 'bottom-right') {
          x = width - textWidth - margin;
          y = margin;
        } else if (position === 'bottom-center') {
          x = (width - textWidth) / 2;
          y = margin;
        } else if (position === 'bottom-left') {
          x = margin;
          y = margin;
        } else if (position === 'top-right') {
          x = width - textWidth - margin;
          y = height - textHeight - margin;
        } else if (position === 'top-center') {
          x = (width - textWidth) / 2;
          y = height - textHeight - margin;
        } else if (position === 'top-left') {
          x = margin;
          y = height - textHeight - margin;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: getRGBColor(textColor),
        });

        setProgressPercent(30 + Math.round(((i + 1) / totalPages) * 60));
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(files[0].file.name.replace(/\.[^/.]+$/, '') + '-numbered.pdf');
      setProgressPercent(100);
      toast.success('Page numbers added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add page numbers to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/page-numbers"
      title="PDF Page Numberer & Footer Inserter"
      subtitle="Add clean page numbers (Page X of Y, Position, Font size) to all PDF pages 100% locally."
    >
      <div className="space-y-6 pb-28 sm:pb-12">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFilesSelected}
          onRemoveFile={() => {
            setFiles([]);
            setPages([]);
            setDownloadUrl(null);
            setPreviewPageIndex(null);
          }}
          isProcessing={isProcessing}
          progressPercent={progressPercent}
          progressStatus="Embedding page numbers via pdf-lib Wasm..."
          title="Upload PDF File to Add Page Numbers"
          subtitle="Supports single or multi-page documents"
        />

        {isLoadingPages && (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-3xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700">Rendering High-Res PDF Page Previews...</p>
          </div>
        )}

        {files.length > 0 && !downloadUrl && pages.length > 0 && (
          <div className="space-y-6">
            {/* Options Control Box */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-4 h-4 text-rose-600" />
                  <span>Numbering Options</span>
                </h3>
                <span className="text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  {pages.length} Pages Loaded
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                {/* Format Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Number Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as Format)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-[0.99] transition-transform"
                  >
                    <option value="page-x-of-y">Page X of Y (e.g. Page 1 of {pages.length})</option>
                    <option value="page-x">Page X (e.g. Page 1)</option>
                    <option value="x">Simple Number (e.g. 1)</option>
                    <option value="dash-x">Dash Enclosed (e.g. - 1 -)</option>
                  </select>
                </div>

                {/* Position Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Position on Page</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as Position)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-[0.99] transition-transform"
                  >
                    <option value="bottom-center">Bottom Center (Default)</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>

                {/* Text Color Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Text Color</label>
                  <div className="flex items-center gap-2">
                    {[
                      { hex: '#1e293b', label: 'Dark Slate' },
                      { hex: '#000000', label: 'Black' },
                      { hex: '#1e40af', label: 'Navy Blue' },
                      { hex: '#dc2626', label: 'Crimson Red' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setTextColor(c.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          textColor === c.hex
                            ? 'border-rose-600 scale-110 shadow-md'
                            : 'border-white shadow-xs hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-7 h-7 rounded-full border border-slate-200 cursor-pointer p-0"
                    />
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Font Size ({fontSize}pt)</label>
                  <input
                    type="range"
                    min={8}
                    max={24}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Desktop Desktop Process Button */}
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="hidden sm:flex w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-full items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Page Numbers to {pages.length} Pages</span>
              </button>
            </div>

            {/* Floating Mobile Sticky Action Dock (App shell floating above bottom navbar) */}
            <div className="sm:hidden fixed bottom-[72px] inset-x-3 z-30 p-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
              <div className="min-w-0">
                <span className="text-[11px] font-black text-slate-900 block truncate">
                  Ready to Number
                </span>
                <span className="text-[10px] text-slate-500 font-semibold block truncate">
                  {pages.length} Pages • {format}
                </span>
              </div>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="px-4 py-2.5 bg-rose-600 active:scale-95 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Numbers</span>
              </button>
            </div>

            {/* Live PDF Page Grid Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-rose-600" />
                  <span>Exact PDF Page Previews (Showing All {pages.length} Pages)</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                  Tap Any Page to Zoom
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {pages.map((p, idx) => (
                  <div
                    key={p.pageNumber}
                    className="relative bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-xs hover:shadow-md transition-all group flex flex-col items-center"
                  >
                    {/* Header Page Index Badge & Preview Button */}
                    <div className="w-full flex items-center justify-between text-[10px] font-black text-slate-500 pb-1.5 px-0.5 border-b border-slate-100">
                      <span>PAGE {p.pageNumber}</span>
                      <button
                        onClick={() => setPreviewPageIndex(idx)}
                        className="px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-extrabold cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    </div>

                    {/* Page Thumbnail Image (Clickable) */}
                    <div
                      onClick={() => setPreviewPageIndex(idx)}
                      className="relative w-full aspect-[1/1.3] bg-white rounded-xl overflow-hidden mt-2 flex items-center justify-center border border-slate-200/80 cursor-pointer group-hover:border-rose-400 transition-colors shadow-2xs"
                    >
                      <img
                        src={p.dataUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="w-full h-full object-contain"
                      />

                      {/* Hover Fullscreen Cue */}
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1.5 bg-white text-slate-900 rounded-full font-black text-[11px] flex items-center gap-1 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Zoom Preview</span>
                        </span>
                      </div>

                      {/* EXACT PDF PAGE NUMBER PRINT DESIGN OVERLAY */}
                      <div
                        className={`absolute ${getPositionClasses()} pointer-events-none whitespace-nowrap tracking-normal font-sans font-medium transition-all duration-150`}
                        style={{
                          color: textColor,
                          fontSize: `${Math.max(9, Math.round(fontSize * 0.9))}px`,
                          textShadow: '0 0 3px rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        {getPageText(idx, pages.length)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FULLSCREEN EXACT DESIGN PAGE PREVIEW MODAL */}
        {previewPageIndex !== null && pages[previewPageIndex] && (
          <div className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-[calc(env(safe-area-inset-bottom,0px)+76px)] sm:pb-6 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="w-full max-w-4xl flex items-center justify-between p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider truncate">
                  Page {pages[previewPageIndex].pageNumber} Output Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-mono font-bold shrink-0">
                  {getPageText(previewPageIndex, pages.length)}
                </span>
              </div>

              <button
                onClick={() => setPreviewPageIndex(null)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High-Res Paper Card with Exact PDF Print Styling */}
            <div className="relative flex-1 my-3 max-w-4xl w-full flex items-center justify-center overflow-hidden">
              <div className="relative max-h-full max-w-full bg-white rounded-xl shadow-2xl p-2 sm:p-3 border border-slate-200 flex items-center justify-center overflow-hidden">
                <img
                  src={pages[previewPageIndex].dataUrl}
                  alt={`Page ${pages[previewPageIndex].pageNumber}`}
                  className="max-h-[65vh] w-auto object-contain rounded-sm"
                />

                {/* EXACT HIGH-RES PDF PAGE NUMBER PRINT OVERLAY */}
                <div
                  className={`absolute ${getPositionClasses()} pointer-events-none whitespace-nowrap font-sans font-medium transition-all duration-150`}
                  style={{
                    color: textColor,
                    fontSize: `${fontSize * 1.3}px`,
                    textShadow: '0 0 4px rgba(255, 255, 255, 0.95)',
                  }}
                >
                  {getPageText(previewPageIndex, pages.length)}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="w-full max-w-md flex items-center justify-between p-2 sm:p-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white shrink-0">
              <button
                disabled={previewPageIndex === 0}
                onClick={() => setPreviewPageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-black tracking-wider">
                {previewPageIndex + 1} / {pages.length}
              </span>

              <button
                disabled={previewPageIndex === pages.length - 1}
                onClick={() =>
                  setPreviewPageIndex((prev) =>
                    prev !== null && prev < pages.length - 1 ? prev + 1 : prev
                  )
                }
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Your Numbered PDF is Ready!</h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">100% Private local rendering completed for all pages.</p>
            </div>
            <a
              href={downloadUrl}
              download={downloadName}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-full shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Numbered PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
