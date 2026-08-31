'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { splitPDF, renderPDFPagesToImages } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import {
  Download,
  Scissors,
  Square,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PageThumbnail {
  pageNumber: number; // 1-based
  dataUrl: string;
}

// Converts array of 1-based page numbers [1,2,3,5,7,8] to string "1-3, 5, 7-8"
function formatPageNumbersToRange(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = current;
      prev = current;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(', ');
}

// Parses string "1, 3-5, 8" to array of 1-based page numbers
function parseRangeToPageNumbers(rangeStr: string, maxPages: number): number[] {
  const selected = new Set<number>();
  const parts = rangeStr.split(',').map((s) => s.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => parseInt(s, 10));
      if (!isNaN(startStr) && !isNaN(endStr)) {
        const start = Math.max(1, startStr);
        const end = Math.min(maxPages, endStr);
        for (let i = start; i <= end; i++) {
          selected.add(i);
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        selected.add(num);
      }
    }
  }
  return Array.from(selected).sort((a, b) => a - b);
}

export default function SplitPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeStr, setRangeStr] = useState<string>('');
  const [previewModalPage, setPreviewModalPage] = useState<PageThumbnail | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    if (selected.length === 0) {
      setThumbnails([]);
      setSelectedPages([]);
      setRangeStr('');
      return;
    }

    setIsLoadingPages(true);
    try {
      const rendered = await renderPDFPagesToImages(selected[0].file, 2.0);
      const thumbs = rendered.map((r) => ({
        pageNumber: r.pageNumber,
        dataUrl: r.dataUrl,
      }));
      setThumbnails(thumbs);

      // Default: select all pages initially
      const allPageNums = thumbs.map((t) => t.pageNumber);
      setSelectedPages(allPageNums);
      setRangeStr(formatPageNumbersToRange(allPageNums));
    } catch (err: any) {
      toast.error('Failed to load PDF page thumbnails.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    let updated: number[];
    if (selectedPages.includes(pageNum)) {
      updated = selectedPages.filter((p) => p !== pageNum);
    } else {
      updated = [...selectedPages, pageNum];
    }
    setSelectedPages(updated);
    setRangeStr(formatPageNumbersToRange(updated));
  };

  const handleSelectAll = () => {
    const all = thumbnails.map((t) => t.pageNumber);
    setSelectedPages(all);
    setRangeStr(formatPageNumbersToRange(all));
  };

  const handleDeselectAll = () => {
    setSelectedPages([]);
    setRangeStr('');
  };

  const handleSelectOdd = () => {
    const odd = thumbnails.map((t) => t.pageNumber).filter((p) => p % 2 !== 0);
    setSelectedPages(odd);
    setRangeStr(formatPageNumbersToRange(odd));
  };

  const handleSelectEven = () => {
    const even = thumbnails.map((t) => t.pageNumber).filter((p) => p % 2 === 0);
    setSelectedPages(even);
    setRangeStr(formatPageNumbersToRange(even));
  };

  const handleRangeInputChange = (inputVal: string) => {
    setRangeStr(inputVal);
    if (thumbnails.length > 0) {
      const parsed = parseRangeToPageNumbers(inputVal, thumbnails.length);
      setSelectedPages(parsed);
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }
    if (selectedPages.length === 0) {
      toast.error('Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    try {
      const currentRangeStr = formatPageNumbersToRange(selectedPages);
      const splitBytes = await splitPDF(files[0].file, currentRangeStr);
      const blob = new Blob([new Uint8Array(splitBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success(`${selectedPages.length} pages extracted successfully!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/split"
      title="Separate & Extract PDF Pages Online"
      subtitle="Visual PDF splitter. Preview all PDF pages with checkmarks, adjust page zoom size, and select pages to extract."
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
            setSelectedPages([]);
            setRangeStr('');
            setDownloadUrl(null);
          }}
          title="Upload PDF file to preview & split"
        />

        {isLoadingPages && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Rendering High-Resolution PDF Pages...</p>
          </div>
        )}

        {thumbnails.length > 0 && !isLoadingPages && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Range Input & Fast Quick Selection Toolbar */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Select Pages to Extract</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Tap page cards or enter page ranges (e.g. <strong className="text-slate-700 font-bold">1, 3-5</strong>).
                  </p>
                </div>

                {/* Range Input Field */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    value={rangeStr}
                    onChange={(e) => handleRangeInputChange(e.target.value)}
                    placeholder="e.g. 1, 3-5, 8"
                    className="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                  <button
                    onClick={() => handleRangeInputChange(rangeStr)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-colors shrink-0 active:scale-95"
                  >
                    Apply Range
                  </button>
                </div>
              </div>

              {/* Fast Quick Selection Pills */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-black border border-indigo-100 transition-all active:scale-95 shrink-0"
                  >
                    All ({thumbnails.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectOdd}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold border border-slate-200/70 transition-all active:scale-95 shrink-0"
                  >
                    Odd Pages
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectEven}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold border border-slate-200/70 transition-all active:scale-95 shrink-0"
                  >
                    Even Pages
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-extrabold border border-slate-200/70 transition-all active:scale-95 shrink-0"
                  >
                    Clear
                  </button>
                </div>

                <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 shrink-0">
                  {selectedPages.length} of {thumbnails.length} Selected
                </span>
              </div>
            </div>

            {/* Visual PDF Page Selection Grid Section */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[10px] sm:text-xs">
                    {thumbnails.length} Pages
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    Tap Cards to Select Pages
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {selectedPages.length} active
                </span>
              </div>

              {/* Smart Mobile-Friendly Grid (2 columns on mobile, 3-4 on tablet/desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 max-h-[640px] overflow-y-auto p-1 scrollbar-thin">
                {thumbnails.map((thumb) => {
                  const isChecked = selectedPages.includes(thumb.pageNumber);
                  return (
                    <div
                      key={thumb.pageNumber}
                      onClick={() => togglePageSelection(thumb.pageNumber)}
                      className={`relative group cursor-pointer rounded-2xl p-2 flex flex-col items-center justify-between border transition-all duration-200 select-none ${
                        isChecked
                          ? 'border-2 border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]'
                          : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      {/* Top Left Page Number Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                          isChecked ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900/80 text-white border-slate-800'
                        }`}>
                          #{thumb.pageNumber}
                        </span>
                      </div>

                      {/* Top Right Tick Mark Overlay */}
                      <div className="absolute top-3 right-3 z-10">
                        {isChecked ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/90 border border-slate-300 flex items-center justify-center shadow-2xs group-hover:border-indigo-400">
                            <Square className="w-3 h-3 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* PDF Thumbnail Container (Compact & Smart Height) */}
                      <div className="relative w-full h-44 sm:h-60 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 border border-slate-200/80 my-1">
                        <img
                          src={thumb.dataUrl}
                          alt={`PDF Page ${thumb.pageNumber}`}
                          className="max-h-full max-w-full object-contain shadow-2xs transition-transform duration-200 group-hover:scale-[1.02]"
                        />

                        {/* Zoom Button in Bottom Right of Image */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalPage(thumb);
                          }}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-2xs active:scale-95"
                          title="Zoom Full Page"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Page Label Footer */}
                      <div className="w-full text-center pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Page {thumb.pageNumber}</span>
                        <span className={isChecked ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>
                          {isChecked ? 'Selected' : 'Tap to select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              onClick={handleSplit}
              disabled={isProcessing || selectedPages.length === 0}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/20 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Extracting Selected Pages...'
                  : `Extract ${selectedPages.length} Selected ${selectedPages.length === 1 ? 'Page' : 'Pages'} Now`}
              </span>
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <h4 className="font-bold">Extracted PDF Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {selectedPages.length} pages extracted cleanly into a new PDF document.
              </p>
            </div>
            <a
              href={downloadUrl}
              download="split-extracted.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Extracted PDF</span>
            </a>
          </div>
        )}
      </div>

      {/* Enhanced Mobile-App Zoom Modal Full Page Preview Overlay */}
      {previewModalPage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-4xl w-full max-h-[92vh] flex flex-col justify-between space-y-3 sm:space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs shrink-0">
                  Page {previewModalPage.pageNumber} / {thumbnails.length}
                </span>

                {/* Jump to Any Page Dropdown Selector */}
                <select
                  value={previewModalPage.pageNumber}
                  onChange={(e) => {
                    const targetNum = parseInt(e.target.value, 10);
                    const targetThumb = thumbnails.find((t) => t.pageNumber === targetNum);
                    if (targetThumb) setPreviewModalPage(targetThumb);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shrink-0"
                >
                  {thumbnails.map((t) => (
                    <option key={t.pageNumber} value={t.pageNumber}>
                      Jump to Page {t.pageNumber} {selectedPages.includes(t.pageNumber) ? '✓' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalPage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Image Container with Prev / Next Navigation Overlay */}
            <div className="relative flex-1 min-h-[320px] overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {/* Previous Page Button Overlay */}
              <button
                disabled={previewModalPage.pageNumber <= 1}
                onClick={() => {
                  const prevThumb = thumbnails.find((t) => t.pageNumber === previewModalPage.pageNumber - 1);
                  if (prevThumb) setPreviewModalPage(prevThumb);
                }}
                className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 disabled:opacity-20 shadow-lg border border-slate-700 active:scale-95 transition-all cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* High-Res PDF Page Image */}
              <img
                src={previewModalPage.dataUrl}
                alt={`PDF Page ${previewModalPage.pageNumber}`}
                className="max-h-[62vh] max-w-full object-contain rounded-lg shadow-md"
              />

              {/* Next Page Button Overlay */}
              <button
                disabled={previewModalPage.pageNumber >= thumbnails.length}
                onClick={() => {
                  const nextThumb = thumbnails.find((t) => t.pageNumber === previewModalPage.pageNumber + 1);
                  if (nextThumb) setPreviewModalPage(nextThumb);
                }}
                className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 disabled:opacity-20 shadow-lg border border-slate-700 active:scale-95 transition-all cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Prev Quick Button */}
                <button
                  type="button"
                  disabled={previewModalPage.pageNumber <= 1}
                  onClick={() => {
                    const prevThumb = thumbnails.find((t) => t.pageNumber === previewModalPage.pageNumber - 1);
                    if (prevThumb) setPreviewModalPage(prevThumb);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Direct Selection Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    togglePageSelection(previewModalPage.pageNumber);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    selectedPages.includes(previewModalPage.pageNumber)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {selectedPages.includes(previewModalPage.pageNumber) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Selected for Extraction</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-slate-500" />
                      <span>Select Page for Extraction</span>
                    </>
                  )}
                </button>

                {/* Next Quick Button */}
                <button
                  type="button"
                  disabled={previewModalPage.pageNumber >= thumbnails.length}
                  onClick={() => {
                    const nextThumb = thumbnails.find((t) => t.pageNumber === previewModalPage.pageNumber + 1);
                    if (nextThumb) setPreviewModalPage(nextThumb);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalPage(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}


