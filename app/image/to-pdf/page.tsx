'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { imagesToPDF } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download, FileText } from 'lucide-react';

export default function ImageToPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [margin, setMargin] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleCreatePDF = async () => {
    if (files.length === 0) {
      toast.error('Please upload images.');
      return;
    }

    setIsProcessing(true);
    try {
      const rawFiles = files.map((f) => f.file);
      const pdfBytes = await imagesToPDF(rawFiles, orientation, pageSize, margin);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF document created from images!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/to-pdf"
      title="Image to PDF Converter (JPG, PNG to PDF)"
      subtitle="Combine multiple JPG, PNG, or WebP photos into a single multi-page PDF document with custom margins and page sizes."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={true}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={(id) => setFiles(files.filter((f) => f.id !== id))}
          onReorderFiles={setFiles}
          title="Upload multiple images to combine into PDF"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Page Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Page Format</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="a4">Standard A4</option>
                  <option value="letter">US Letter</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Page Margin ({margin} pt)</label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value={0}>No Margin</option>
                  <option value={20}>Small Margin (20pt)</option>
                  <option value={40}>Big Margin (40pt)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreatePDF}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>{isProcessing ? 'Generating PDF Document...' : `Create PDF from ${files.length} Images`}</span>
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">PDF Document Created!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Combined {files.length} photos into a single PDF.</p>
            </div>
            <a
              href={downloadUrl}
              download="images-document.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
