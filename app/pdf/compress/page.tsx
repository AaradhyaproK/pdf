'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Sliders, Minimize2, CheckCircle2, Sparkles, Zap } from 'lucide-react';

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

  const getSavedPercent = () => {
    if (!resultInfo || resultInfo.origSize === 0) return 0;
    const diff = resultInfo.origSize - resultInfo.compSize;
    if (diff <= 0) return 0;
    return Math.round((diff / resultInfo.origSize) * 100);
  };

  return (
    <ToolLayout
      slug="/pdf/compress"
      title="Compress PDF Online"
      subtitle="Reduce PDF file size without losing quality using client-side WebAssembly. Zero file uploads."
    >
      <div className="space-y-5">
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
          <div className="space-y-4 pt-2">
            {/* Compression Presets Bar (3 Columns on Mobile & Desktop) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
                  Select Compression Level
                </span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                  Preset: {preset.toUpperCase()}
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPreset('extreme')}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 active:scale-95 ${
                    preset === 'extreme'
                      ? 'border-2 border-indigo-600 bg-indigo-50/40 text-indigo-950 font-black shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-semibold'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Max Shrink
                  </span>
                  <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">Extreme</div>
                  <div className="text-[9px] sm:text-xs text-slate-400 font-medium">Up to -80%</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('recommended')}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 active:scale-95 ${
                    preset === 'recommended'
                      ? 'border-2 border-indigo-600 bg-indigo-50/40 text-indigo-950 font-black shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-semibold'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Optimal
                  </span>
                  <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">Recommended</div>
                  <div className="text-[9px] sm:text-xs text-slate-400 font-medium">Best Quality</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('low')}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 active:scale-95 ${
                    preset === 'low'
                      ? 'border-2 border-indigo-600 bg-indigo-50/40 text-indigo-950 font-black shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-semibold'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    High Res
                  </span>
                  <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">Light</div>
                  <div className="text-[9px] sm:text-xs text-slate-400 font-medium">HD Output</div>
                </button>
              </div>
            </div>

            {/* Action Compress Button */}
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Compressing PDF Locally...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4 text-white" />
                  <span>Compress PDF File Now</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Compression Result Banner */}
        {resultInfo && downloadUrl && (
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/30 text-emerald-950 space-y-4 shadow-md animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>PDF Successfully Compressed!</span>
                    {getSavedPercent() > 0 && (
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                        {getSavedPercent()}% Saved
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Reduced from {(resultInfo.origSize / (1024 * 1024)).toFixed(2)} MB to{' '}
                    <strong className="text-emerald-800 font-bold">{(resultInfo.compSize / (1024 * 1024)).toFixed(2)} MB</strong>
                  </p>
                </div>
              </div>

              <a
                href={downloadUrl}
                download={`compressed-${files[0]?.file.name || 'document.pdf'}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Compressed PDF</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
