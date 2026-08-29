'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressImageToTargetKB, compressImageByQuality } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download, Sliders, HardDrive } from 'lucide-react';

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

  return (
    <ToolLayout
      slug="/image/compress"
      title="Smart Image Compressor (Target KB & %)"
      subtitle="Compress JPG, PNG, and WebP photos to exact target file sizes (<20KB, <50KB, <100KB) or percentage quality."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setResultFile(null);
            setDownloadUrl(null);
          }}
          title="Upload image to compress"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Mode Selector */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setMode('target')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  mode === 'target'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Target File Size Limit (KB)
              </button>
              <button
                type="button"
                onClick={() => setMode('quality')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  mode === 'quality'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Quality Percentage (%)
              </button>
            </div>

            {mode === 'target' ? (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-indigo-500" />
                  Select Target KB Limit: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{targetKB} KB</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[20, 50, 100, 200, 500].map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => setTargetKB(kb)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        targetKB === kb
                          ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      &lt; {kb} KB
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Quality Percentage
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{qualityPercent}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={qualityPercent}
                  onChange={(e) => setQualityPercent(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Compressing Image Locally...' : 'Compress Image Now'}
            </button>
          </div>
        )}

        {resultFile && downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <h4 className="font-bold">Image Compressed!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Original: {(files[0].file.size / 1024).toFixed(1)} KB →{' '}
                <strong className="underline">{(resultFile.size / 1024).toFixed(1)} KB</strong>
              </p>
            </div>
            <a
              href={downloadUrl}
              download={resultFile.name}
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
