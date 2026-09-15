'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import {
  Download,
  Minimize2,
  CheckCircle2,
  Sparkles,
  Target,
  FileCheck,
} from 'lucide-react';

export default function CompressPDFTo1MBPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [targetKB, setTargetKB] = useState<number>(1024);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<{ origSize: number; compSize: number } | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file first.');
      return;
    }

    if (isNaN(targetKB) || targetKB <= 0) {
      toast.error('Please enter a valid target size.');
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);
    setResultInfo(null);

    try {
      const originalFile = files[0].file;
      const bytes = await compressPDF(originalFile, 'target', targetKB);
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });

      setDownloadUrl(URL.createObjectURL(blob));
      setResultInfo({
        origSize: originalFile.size,
        compSize: blob.size,
      });

      const actualKB = blob.size / 1024;
      if (actualKB <= targetKB * 1.05) {
        toast.success(`PDF compressed successfully to ${formatBytes(blob.size)}!`);
      } else {
        toast.success(`PDF compressed down to ${formatBytes(blob.size)}.`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Compression failed.');
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

  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <ToolLayout
      slug="/pdf/compress-to-1mb"
      title="Compress PDF to 1MB Online Free"
      subtitle="Reduce large multi-page PDF documents to under 1MB for email attachments, university submissions, job portals, and cloud uploads. 100% private in-browser tool."
      badgeText="Target 1MB Compressor"
    >
      <div className="space-y-6">
        {/* Upload Container */}
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
          title="Upload PDF to compress under 1MB"
          subtitle="Drag & drop single PDF file to compress for emails & portals"
        />

        {/* Compression Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="font-black text-slate-900 text-sm sm:text-base">
                Target Ceiling Size
              </span>
            </div>
            {/* Quick preset buttons */}
            <div className="flex items-center gap-1.5">
              {[
                { label: '500 KB', kb: 500 },
                { label: '750 KB', kb: 750 },
                { label: '1 MB', kb: 1024 },
                { label: '2 MB', kb: 2048 },
              ].map((item) => (
                <button
                  key={item.kb}
                  type="button"
                  onClick={() => setTargetKB(item.kb)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                    targetKB === item.kb
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider & Display */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Maximum Target Size:</span>
              <span className="text-indigo-600 font-extrabold text-sm">
                {targetKB >= 1024 ? `${(targetKB / 1024).toFixed(1)} MB` : `${targetKB} KB`} ({targetKB} KB)
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="5120"
              step="50"
              value={targetKB}
              onChange={(e) => setTargetKB(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>300 KB</span>
              <span>1 MB (1024 KB Standard)</span>
              <span>5 MB</span>
            </div>
          </div>

          {/* Sibling size presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Other common targets:</span>
            <Link
              href="/pdf/compress-to-100kb"
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Compress to 100KB →
            </Link>
            <Link
              href="/pdf/compress-to-200kb"
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Compress to 200KB →
            </Link>
          </div>

          {/* Process Button */}
          <button
            type="button"
            onClick={handleCompress}
            disabled={files.length === 0 || isProcessing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Minimize2 className="w-5 h-5 animate-spin" />
                Compressing PDF under {(targetKB / 1024).toFixed(1)}MB...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Compress PDF to Under {targetKB >= 1024 ? `${(targetKB / 1024).toFixed(1)} MB` : `${targetKB} KB`}
              </>
            )}
          </button>
        </div>

        {/* Download & Result Card */}
        {resultInfo && downloadUrl && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <h3 className="font-black text-base sm:text-lg">PDF Optimized Successfully!</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-emerald-100 text-center">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Original Size</p>
                <p className="text-sm sm:text-base font-black text-slate-700">
                  {formatBytes(resultInfo.origSize)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase">Reduced Size</p>
                <p className="text-sm sm:text-base font-black text-emerald-700">
                  {formatBytes(resultInfo.compSize)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] font-bold text-indigo-600 uppercase">Payload Saved</p>
                <p className="text-sm sm:text-base font-black text-indigo-700">
                  {getSavedPercent()}% Reduction
                </p>
              </div>
            </div>

            <a
              href={downloadUrl}
              download={`compressed_1mb_${files[0]?.file.name || 'document.pdf'}`}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Compressed PDF ({formatBytes(resultInfo.compSize)})
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
