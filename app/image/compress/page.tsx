'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressImageToTargetKB, compressImageByQuality } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download, Sliders, HardDrive, RefreshCw, CheckCircle2, Sparkles, ArrowDownRight } from 'lucide-react';

const TARGET_KB_OPTIONS = [20, 50, 100, 200, 500];

export default function CompressImagePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<'target' | 'quality'>('target');
  const [targetKB, setTargetKB] = useState(50);
  const [qualityPercent, setQualityPercent] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    setResultFile(null);
    setDownloadUrl(null);

    try {
      let compressed: File;
      if (mode === 'target') {
        compressed = await compressImageToTargetKB(files[0].file, targetKB);
      } else {
        compressed = await compressImageByQuality(files[0].file, qualityPercent);
      }

      setResultFile(compressed);
      setDownloadUrl(URL.createObjectURL(compressed));
      toast.success('Image compressed successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const origSizeKB = files.length > 0 ? (files[0].file.size / 1024).toFixed(1) : '0';
  const compSizeKB = resultFile ? (resultFile.size / 1024).toFixed(1) : '0';
  const savingsPercent =
    files.length > 0 && resultFile
      ? Math.max(0, Math.round(((files[0].file.size - resultFile.size) / files[0].file.size) * 100))
      : 0;

  return (
    <ToolLayout
      slug="/image/compress"
      title="Smart Image Size Compressor (Target KB & %)"
      subtitle="Compress JPG, PNG, and WebP photos to exact target file sizes (<20KB, <50KB, <100KB, <200KB, <500KB) or percentage quality. 100% Private."
      badgeText="Target KB & % Compressor"
    >
      <div className="space-y-6 pb-24 md:pb-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={(selected) => {
            setFiles(selected);
            setResultFile(null);
            setDownloadUrl(null);
          }}
          onRemoveFile={() => {
            setFiles([]);
            setResultFile(null);
            setDownloadUrl(null);
          }}
          title="Upload image to compress"
        />

        {files.length > 0 && (
          <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-md space-y-5 text-slate-900">
            {/* Mode Switcher Pill */}
            <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setMode('target')}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'target'
                    ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Target File Size Limit (KB)
              </button>
              <button
                type="button"
                onClick={() => setMode('quality')}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'quality'
                    ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quality Percentage (%)
              </button>
            </div>

            {/* Mode 1: Target KB Options */}
            {mode === 'target' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-indigo-600" />
                    <span>Select Target KB Limit</span>
                  </label>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Target: &lt; {targetKB} KB
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TARGET_KB_OPTIONS.map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => setTargetKB(kb)}
                      className={`px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                        targetKB === kb
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.02]'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                      }`}
                    >
                      &lt; {kb} KB
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Mode 2: Quality Percentage Slider */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>Quality Percentage (%)</span>
                  </label>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Quality: {qualityPercent}%
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="90"
                  value={qualityPercent}
                  onChange={(e) => setQualityPercent(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>10% (Maximum Compression)</span>
                  <span>90% (High Clarity)</span>
                </div>
              </div>
            )}

            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Compressing Image Locally...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Compress Image Now</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Compression Result Card in Pure Day Mode */}
        {resultFile && downloadUrl && (
          <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xs shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base text-emerald-950 flex items-center gap-1.5">
                  <span>Image Compressed Successfully!</span>
                  {savingsPercent > 0 && (
                    <span className="text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                      <ArrowDownRight className="w-3 h-3" />
                      -{savingsPercent}% Saved
                    </span>
                  )}
                </h4>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                  Original: {origSizeKB} KB → <strong className="font-black text-emerald-950 underline">{compSizeKB} KB</strong>
                </p>
              </div>
            </div>

            <a
              href={downloadUrl}
              download={resultFile.name}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Download Compressed Image</span>
            </a>
          </div>
        )}
      </div>

      {/* Liquid Glass Floating Mobile Action Navbar for 100% Mobile Accessibility */}
      {files.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-2.5 flex items-center justify-between gap-2 md:hidden text-slate-900 pointer-events-auto">
          {/* Quick KB Presets Pill Scroller */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-1 max-w-[65vw]">
            {TARGET_KB_OPTIONS.map((kb) => (
              <button
                key={kb}
                onClick={() => {
                  setMode('target');
                  setTargetKB(kb);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all cursor-pointer ${
                  mode === 'target' && targetKB === kb
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                &lt;{kb}K
              </button>
            ))}
          </div>

          {/* Action Button: Compress / Download */}
          {resultFile && downloadUrl ? (
            <a
              href={downloadUrl}
              download={resultFile.name}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          ) : (
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer whitespace-nowrap"
            >
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-200" />}
              <span>Compress</span>
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
