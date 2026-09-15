'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  RefreshCw,
  FileImage,
  Layers,
  Settings,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Trash2,
  Zap,
} from 'lucide-react';

interface ConvertedItem {
  originalName: string;
  originalSize: number;
  dataUrl: string;
  newSize: number;
  width: number;
  height: number;
  savedPercent: number;
}

export default function JPGToWebPPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(0.85);
  const [converted, setConverted] = useState<ConvertedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || !selectedFiles.length) return;
    const validImages = Array.from(selectedFiles).filter(
      (f) =>
        f.type === 'image/jpeg' ||
        f.type === 'image/png' ||
        f.name.toLowerCase().endsWith('.jpg') ||
        f.name.toLowerCase().endsWith('.jpeg') ||
        f.name.toLowerCase().endsWith('.png')
    );

    if (!validImages.length) {
      toast.error('Please select JPG, JPEG, or PNG images.');
      return;
    }

    setFiles((prev) => [...prev, ...validImages]);
    setConverted([]);
    toast.success(`Loaded ${validImages.length} image${validImages.length > 1 ? 's' : ''}!`);
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    toast.info('Converting images to next-gen WebP...');

    try {
      const results: ConvertedItem[] = [];

      for (const file of files) {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        await new Promise((res, rej) => {
          image.onload = () => res(true);
          image.onerror = () => rej(new Error('Failed to load image'));
          image.src = objectUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(image, 0, 0);

          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          const base64Length = webpDataUrl.split(',')[1]?.length || 0;
          const estSize = Math.round((base64Length * 3) / 4);
          const savedPct = Math.max(0, Math.round(((file.size - estSize) / file.size) * 100));

          results.push({
            originalName: file.name.replace(/\.(jpe?g|png)$/i, '.webp'),
            originalSize: file.size,
            dataUrl: webpDataUrl,
            newSize: estSize,
            width: image.width,
            height: image.height,
            savedPercent: savedPct,
          });
        }
        URL.revokeObjectURL(objectUrl);
      }

      setConverted(results);
      toast.success(`Converted ${results.length} images to WebP!`);
    } catch {
      toast.error('Failed to convert images. Please check file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: ConvertedItem) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.originalName;
    a.click();
  };

  const handleDownloadAll = () => {
    if (!converted.length) return;
    converted.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, index * 200);
    });
    toast.success('Downloading all converted WebP images...');
  };

  const handleClearAll = () => {
    setFiles([]);
    setConverted([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Cleared all files.');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalOriginalBytes = converted.reduce((sum, f) => sum + f.originalSize, 0);
  const totalNewBytes = converted.reduce((sum, f) => sum + f.newSize, 0);
  const overallSavingsPct =
    totalOriginalBytes > 0
      ? Math.max(0, Math.round(((totalOriginalBytes - totalNewBytes) / totalOriginalBytes) * 100))
      : 0;

  return (
    <ToolLayout
      slug="/image/jpg-to-webp"
      title="JPG to WebP Converter Online Free"
      subtitle="Convert JPG, JPEG, and PNG images to high-efficiency Google WebP format. Shrink image weight up to 80% with flawless quality and zero server uploads."
      badgeText="Client-Side WebP Optimizer"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Bi-directional Mode Switcher Tab */}
        <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-xl bg-white font-black text-xs sm:text-sm text-slate-900 shadow-sm border border-slate-200">
              JPG to WebP (Active)
            </span>
            <Link
              href="/image/webp-to-jpg"
              className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:text-indigo-600 hover:bg-white/60 transition-all flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Switch to WebP to JPG
            </Link>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Google Core Web Vitals Ready
          </span>
        </div>

        {/* Upload Zone */}
        {!files.length ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files);
            }}
            className="p-8 sm:p-14 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl bg-emerald-50/20 hover:bg-emerald-50/40 transition-all text-center cursor-pointer space-y-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Drag & Drop JPG, JPEG or PNG files here, or click to browse
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Batch convert photos to modern WebP for website speed, mobile apps, and storage savings.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
            >
              Select JPG / PNG Images
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Settings & Controls Card */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <span className="font-black text-sm text-slate-900">WebP Compression Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add More
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {/* Quality Slider */}
              <div className="space-y-2 max-w-xl">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>WebP Output Quality</span>
                  <span className="text-emerald-600 font-extrabold">{Math.round(quality * 100)}% (Recommended)</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.02"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Extreme Compression (50% quality)</span>
                  <span>Lossless-like Fidelity (100% quality)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Optimizing {files.length} images to WebP...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Convert {files.length} Image{files.length > 1 ? 's' : ''} to WebP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Grid */}
            {converted.length > 0 && (
              <div className="space-y-4">
                {/* Savings Banner */}
                {overallSavingsPct > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold">
                        Reduced total payload from {formatBytes(totalOriginalBytes)} to {formatBytes(totalNewBytes)} ({overallSavingsPct}% smaller!)
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-black text-slate-900 text-base sm:text-lg">
                      Ready WebP Files ({converted.length})
                    </h3>
                  </div>
                  {converted.length > 1 && (
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {converted.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.dataUrl}
                            alt={item.originalName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate" title={item.originalName}>
                            {item.originalName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.width} × {item.height} px
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            <span className="text-slate-400 line-through">
                              {formatBytes(item.originalSize)}
                            </span>
                            <span className="font-bold text-emerald-600">
                              {formatBytes(item.newSize)}
                            </span>
                            {item.savedPercent > 0 && (
                              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                                -{item.savedPercent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(item)}
                        className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download WebP
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
