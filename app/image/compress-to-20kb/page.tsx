'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressImageToTargetKB } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function CompressImageTo20KBPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await compressImageToTargetKB(files[0].file, 20);
      setResultFile(res);
      setDownloadUrl(URL.createObjectURL(res));
      toast.success('Image successfully compressed under 20KB!');
    } catch {
      toast.error('Compression failed. Please try a different image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const originalSizeKB = files.length > 0 ? (files[0].file.size / 1024).toFixed(1) : null;
  const compressedSizeKB = resultFile ? (resultFile.size / 1024).toFixed(1) : null;

  return (
    <ToolLayout
      slug="/image/compress-to-20kb"
      title="Compress Image to 20KB Online Free"
      subtitle="Reduce signature, passport photo, or certificate image size under 20KB for government job portals, exam forms, and visa applications. 100% Client-Side."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={(newFiles) => {
            setFiles(newFiles);
            setResultFile(null);
            setDownloadUrl(null);
          }}
          onRemoveFile={() => {
            setFiles([]);
            setResultFile(null);
            setDownloadUrl(null);
          }}
          title="Upload signature or photo to compress under 20KB"
        />

        {files.length > 0 && !resultFile && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
              <span>Original File Size:</span>
              <span className="text-slate-900 font-extrabold">{originalSizeKB} KB</span>
            </div>
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>{isProcessing ? 'Compressing under 20KB...' : 'Compress Image to < 20KB'}</span>
            </button>
          </div>
        )}

        {resultFile && downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Portal-Compliant Image Ready!</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                Compressed from <span className="line-through">{originalSizeKB} KB</span> to{' '}
                <span className="font-extrabold text-emerald-900 text-sm">{compressedSizeKB} KB</span> (Under 20KB limit)
              </p>
            </div>
            <a
              href={downloadUrl}
              download="compressed-20kb.jpg"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 20KB Image</span>
            </a>
          </div>
        )}

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">100% In-Browser Privacy</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Govt Exam & SSC / UPSC Ready</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Sharp Text & Signature Clarity</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
