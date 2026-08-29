'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { mergePDFs } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

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
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={true}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={(id) => setFiles(files.filter((f) => f.id !== id))}
          onReorderFiles={setFiles}
          title="Upload multiple PDF files to merge"
          subtitle="Drag & drop or browse. Use arrows to reorder file sequence."
        />

        {files.length > 1 && (
          <button
            onClick={handleMerge}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
          >
            {isProcessing ? 'Merging PDFs Locally...' : `Merge ${files.length} PDF Files`}
          </button>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">Merged PDF Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Combined {files.length} documents into one clean file.</p>
            </div>
            <a
              href={downloadUrl}
              download="merged-document.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
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
