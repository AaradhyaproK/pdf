'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { splitPDF, renderPDFPagesToImages } from '@/lib/pdf-engine';
import { PDFPageGridList } from '@/components/PDFPageGridList';
import { toast } from 'sonner';
import {
  Download,
  Scissors,
  CheckCircle2,
  RefreshCw,
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

  useEffect(() => {
    if (previewModalPage) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`split-preview-page-${previewModalPage.pageNumber}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [previewModalPage]);

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
            {/* High Performance Visual Page Grid List Component */}
            <PDFPageGridList
              title="Select & Extract PDF Pages"
              pages={thumbnails}
              selectedPages={selectedPages}
              onToggleSelectPage={togglePageSelection}
              onSelectAll={handleSelectAll}
              onSelectOdd={handleSelectOdd}
              onSelectEven={handleSelectEven}
              onClearSelection={handleDeselectAll}
              rangeStr={rangeStr}
              onRangeStrChange={handleRangeInputChange}
              selectable={true}
            />

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
    </ToolLayout>
  );
}


