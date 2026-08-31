'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { mergePDFs } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Combine, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function MergePDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const rawFiles = files.map((f) => f.file);
      const mergedBytes = await mergePDFs(rawFiles);
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF files merged successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to merge PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/merge"
      title="Merge PDF Files Online"
      subtitle="Combine multiple PDF documents into a single organized file directly in your browser. Reorder files easily."
    >
      <div className="space-y-5">
        <FileUploader
          accept="application/pdf"
          multiple={true}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={(id) => setFiles(files.filter((f) => f.id !== id))}
          onReorderFiles={setFiles}
          title="Upload multiple PDF files to merge"
          subtitle="Drag & drop or tap to browse. Reorder sequence with # numbers."
        />

        {files.length === 1 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Select at least <strong>1 more PDF file</strong> to activate the Merge action.</span>
          </div>
        )}

        {files.length > 1 && (
          <button
            onClick={handleMerge}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Merging PDFs Locally...</span>
              </>
            ) : (
              <>
                <Combine className="w-5 h-5" />
                <span>Merge {files.length} PDF Documents</span>
              </>
            )}
          </button>
        )}

        {downloadUrl && (
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/30 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span>Merged PDF Document Ready!</span>
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Combined {files.length} PDF files with 100% data privacy.
                </p>
              </div>
            </div>

            <a
              href={downloadUrl}
              download="merged-document.pdf"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Merged PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
