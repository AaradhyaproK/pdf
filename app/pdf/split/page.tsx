'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { splitPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Scissors } from 'lucide-react';

export default function SplitPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [rangeStr, setRangeStr] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSplit = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }
    if (!rangeStr.trim()) {
      toast.error('Please enter page range (e.g. 1, 3-5).');
      return;
    }

    setIsProcessing(true);
    try {
      const splitBytes = await splitPDF(files[0].file, rangeStr);
      const blob = new Blob([new Uint8Array(splitBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Pages extracted successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/split"
      title="Split PDF Documents Online"
      subtitle="Extract custom page ranges or individual pages from your PDF file cleanly in browser memory."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
          }}
          title="Upload PDF to split"
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-indigo-500" />
                Specify Pages or Ranges to Extract
              </label>
              <input
                type="text"
                value={rangeStr}
                onChange={(e) => setRangeStr(e.target.value)}
                placeholder="e.g. 1, 3, 5-8"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              />
              <p className="text-xs text-slate-400">
                Use commas for single pages and hyphens for ranges (e.g. &quot;1, 3-5, 8&quot;).
              </p>
            </div>

            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Extracting Selected Pages...' : 'Extract Pages Now'}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">Extracted PDF Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Selected page range extracted cleanly.</p>
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
