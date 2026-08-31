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

  const getGridClasses = () => 'grid-cols-1 sm:grid-cols-2 gap-6';
  const getImgContainerHeight = () => 'h-[480px] sm:h-[560px]';

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
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    Select Pages to Extract
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Type a page string (e.g. <strong className="text-slate-700 font-bold">1, 3-5, 8</strong>) or click page cards below to toggle selection.
                  </p>
                </div>

                {/* Range Input Field */}
                <div className="flex items-center gap-2 min-w-[280px]">
                  <input
                    type="text"
                    value={rangeStr}
                    onChange={(e) => handleRangeInputChange(e.target.value)}
                    placeholder="e.g. 1, 3-5, 8"
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                  <button
                    onClick={() => handleRangeInputChange(rangeStr)}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Fast Quick Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold transition-colors"
                  >
                    Select All ({thumbnails.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectOdd}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    Select Odd Pages
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectEven}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    Select Even Pages
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>

                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                  {selectedPages.length} of {thumbnails.length} Selected
                </span>
              </div>
            </div>

            {/* Visual PDF Page Selection Grid Section */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs">
                    {thumbnails.length} Pages
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    High-Resolution Large Page Previews
                  </span>
                </div>
              </div>

              {/* Responsive Page Card Grid */}
              <div className={`grid ${getGridClasses()} max-h-[720px] overflow-y-auto p-1.5 scrollbar-thin`}>
                {thumbnails.map((thumb) => {
                  const isChecked = selectedPages.includes(thumb.pageNumber);
                  return (
                    <div
                      key={thumb.pageNumber}
                      onClick={() => togglePageSelection(thumb.pageNumber)}
                      className={`relative group cursor-pointer rounded-3xl p-3 flex flex-col items-center justify-center border transition-all duration-200 select-none ${
                        isChecked
                          ? 'border-2 border-indigo-600 bg-white ring-4 ring-indigo-500/20 shadow-xl scale-[1.01]'
                          : 'border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Right Tick Mark Overlay */}
                      <div className="absolute top-4 right-4 z-10">
                        {isChecked ? (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                            <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/90 border-2 border-slate-300 flex items-center justify-center shadow-xs group-hover:border-indigo-400">
                            <Square className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* Top Left Zoom Preview Icon Button */}
                      <div className="absolute top-4 left-4 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalPage(thumb);
                          }}
                          className="p-2 rounded-xl bg-white/90 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-xs"
                          title="Zoom Full Page"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* PDF Thumbnail Container (Big & Readable) */}
                      <div className={`relative w-full ${getImgContainerHeight()} flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-1.5 border border-slate-200/80`}>
                        <img
                          src={thumb.dataUrl}
                          alt={`PDF Page ${thumb.pageNumber}`}
                          className="max-h-full max-w-full object-contain shadow-xs transition-transform duration-200 group-hover:scale-[1.01]"
                        />

                        {/* Hover Overlay Hint */}
                        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="px-3.5 py-1.5 rounded-full bg-white text-indigo-700 font-black text-xs shadow-md flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            {isChecked ? 'Click to Deselect' : 'Click to Select'}
                          </span>
                        </div>
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
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-black text-base shadow-lg shadow-indigo-500/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              {isProcessing
                ? 'Extracting Selected Pages...'
                : `Extract ${selectedPages.length} Selected ${selectedPages.length === 1 ? 'Page' : 'Pages'} Now`}
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

      {/* Zoom Modal Full Page Preview Overlay */}
      {previewModalPage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col justify-between space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                  Page {previewModalPage.pageNumber}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  High-Resolution Page Preview
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalPage(null)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Large Image */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <img
                src={previewModalPage.dataUrl}
                alt={`Page ${previewModalPage.pageNumber}`}
                className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  togglePageSelection(previewModalPage.pageNumber);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  selectedPages.includes(previewModalPage.pageNumber)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700'
                }`}
              >
                {selectedPages.includes(previewModalPage.pageNumber) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected for Extraction</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Select Page for Extraction</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPreviewModalPage(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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


