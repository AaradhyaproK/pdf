'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressPDF } from '@/lib/pdf-engine';
import { generateToolMetadata } from '@/lib/seo-config';
import { toast } from 'sonner';
import { Download, Sliders } from 'lucide-react';

export default function CompressPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [preset, setPreset] = useState<'extreme' | 'recommended' | 'low'>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<{ origSize: number; compSize: number } | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);
    setResultInfo(null);

    try {
      const originalFile = files[0].file;
      const compressedBytes = await compressPDF(originalFile, preset);
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setResultInfo({
        origSize: originalFile.size,
        compSize: blob.size,
      });

      toast.success('PDF compressed successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/compress"
      title="Compress PDF Online"
      subtitle="Reduce PDF file size without losing quality using client-side WebAssembly. Zero file uploads."
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
            setResultInfo(null);
          }}
          title="Upload your PDF document"
          subtitle="Drag & drop single PDF file to compress"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Select Compression Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPreset('extreme')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    preset === 'extreme'
                      ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold">Extreme</div>
                  <div className="text-xs text-slate-400 mt-1">Maximum compression, lower resolution</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('recommended')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    preset === 'recommended'
                      ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold">Recommended</div>
                  <div className="text-xs text-slate-400 mt-1">Balanced quality & file reduction</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('low')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    preset === 'low'
                      ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold">Low</div>
                  <div className="text-xs text-slate-400 mt-1">High quality, subtle compression</div>
                </button>
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? 'Compressing PDF Locally...' : 'Compress PDF Now'}
            </button>
          </div>
        )}

        {/* Compression Result Banner */}
        {resultInfo && downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold">PDF Successfully Compressed!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Reduced from {(resultInfo.origSize / 1024).toFixed(1)} KB to{' '}
                  <strong className="underline">{(resultInfo.compSize / 1024).toFixed(1)} KB</strong> (
                  {Math.round((1 - resultInfo.compSize / resultInfo.origSize) * 100)}% smaller)
                </p>
              </div>

              <a
                href={downloadUrl}
                download={`compressed-${files[0]?.file.name || 'document.pdf'}`}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
