'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressImageToTargetKB } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

export default function CompressImageTo100KBPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await compressImageToTargetKB(files[0].file, 100);
      setResultFile(res);
      setDownloadUrl(URL.createObjectURL(res));
      toast.success('Image compressed under 100KB!');
    } catch (err: any) {
      toast.error('Compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/compress-to-100kb"
      title="Compress Image to 100KB Online Free"
      subtitle="Reduce photo file size under 100KB for job applications, portals, and online web pages. Zero file uploads."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
          }}
          title="Upload image to compress under 100KB"
        />

        {files.length > 0 && (
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
          >
            {isProcessing ? 'Optimizing under 100KB...' : 'Compress to < 100KB'}
          </button>
        )}

        {resultFile && downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">Compliant Image Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">File size: {(resultFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <a
              href={downloadUrl}
              download="compressed-100kb.jpg"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
