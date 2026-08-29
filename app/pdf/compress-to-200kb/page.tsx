'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

export default function CompressPDFTo200KBPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compSize, setCompSize] = useState<number | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file.');
      return;
    }

    setIsProcessing(true);
    try {
      const bytes = await compressPDF(files[0].file, 'extreme');
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setCompSize(blob.size);
      toast.success('PDF compressed under 200KB threshold target!');
    } catch (err: any) {
      toast.error(err?.message || 'Compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/compress-to-200kb"
      title="Compress PDF to 200KB Online"
      subtitle="Reduce PDF size to under 200KB for government forms, job portals, and online applications. 100% Client-Side."
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
          title="Upload PDF to compress under 200KB"
        />

        {files.length > 0 && (
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
          >
            {isProcessing ? 'Optimizing PDF to <200KB...' : 'Compress PDF to <200KB'}
          </button>
        )}

        {downloadUrl && compSize && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">PDF Ready ({(compSize / 1024).toFixed(1)} KB)</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Compliant with portal size rules!</p>
            </div>
            <a
              href={downloadUrl}
              download="compressed-200kb.pdf"
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
