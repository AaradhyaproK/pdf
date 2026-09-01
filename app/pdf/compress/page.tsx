'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressPDF, renderPDFPagesToImages } from '@/lib/pdf-engine';
import { PDFPageGridList } from '@/components/PDFPageGridList';
import { toast } from 'sonner';
import { Download, Sliders, Minimize2, CheckCircle2, Sparkles, Target, Zap, Info, X } from 'lucide-react';

export default function CompressPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<'preset' | 'target'>('preset');
  const [preset, setPreset] = useState<'extreme' | 'recommended' | 'low'>('recommended');
  const [targetVal, setTargetVal] = useState<number>(200);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<{ origSize: number; compSize: number } | null>(null);
  const [thumbnails, setThumbnails] = useState<{ pageNumber: number; dataUrl: string }[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenCustom = () => {
      setMode('target');
      setIsSettingsModalOpen(true);
    };
    window.addEventListener('open-compress-custom-size', handleOpenCustom);
    return () => window.removeEventListener('open-compress-custom-size', handleOpenCustom);
  }, []);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    setResultInfo(null);
    window.dispatchEvent(new CustomEvent('compress-pdf-reset'));

    if (selected.length === 0) {
      setThumbnails([]);
      return;
    }

    setIsLoadingPages(true);
    try {
      const rendered = await renderPDFPagesToImages(selected[0].file, 1.0);
      setThumbnails(rendered);
    } catch {
      // Ignore thumbnail render error for compress
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);
    setResultInfo(null);
    window.dispatchEvent(new CustomEvent('compress-pdf-reset'));

    try {
      const originalFile = files[0].file;
      let compressedBytes: Uint8Array;

      if (mode === 'preset') {
        compressedBytes = await compressPDF(originalFile, preset);
      } else {
        const targetKB = targetUnit === 'MB' ? targetVal * 1024 : targetVal;
        if (isNaN(targetKB) || targetKB <= 0) {
          toast.error('Please enter a valid target size.');
          setIsProcessing(false);
          return;
        }
        compressedBytes = await compressPDF(originalFile, 'target', targetKB);
      }

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setResultInfo({
        origSize: originalFile.size,
        compSize: blob.size,
      });

      // Notify Navbar of ready download URL
      window.dispatchEvent(
        new CustomEvent('compress-pdf-ready', {
          detail: { downloadUrl: url, filename: originalFile.name },
        })
      );

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

  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Dynamic estimate calculation based on file size and selected options
  const getEstimatedSize = (level: 'extreme' | 'recommended' | 'low') => {
    if (files.length === 0) return null;
    const origBytes = files[0].file.size;
    let factor = 0.48; // default recommended
    if (level === 'extreme') factor = 0.22;
    if (level === 'low') factor = 0.78;

    const estBytes = Math.round(origBytes * factor);
    return formatBytes(estBytes);
  };

  const getTargetEstimatedSize = () => {
    if (files.length === 0) return null;
    const origBytes = files[0].file.size;
    const targetKB = targetUnit === 'MB' ? targetVal * 1024 : targetVal;
    const targetBytes = targetKB * 1024;

    if (targetBytes >= origBytes) {
      return {
        estText: formatBytes(Math.round(origBytes * 0.85)),
        reductionPct: '~15%',
      };
    }

    const estBytes = Math.min(origBytes, targetBytes);
    const savedPct = Math.round(((origBytes - estBytes) / origBytes) * 100);
    return {
      estText: `~${formatBytes(estBytes)}`,
      reductionPct: `~${savedPct}%`,
    };
  };

  return (
    <ToolLayout
      slug="/pdf/compress"
      title="Compress PDF Online"
      subtitle="Reduce PDF file size to target KB/MB or compression levels without losing quality. 100% Client-Side Wasm."
    >
      <div className="space-y-5">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
            setResultInfo(null);
            setThumbnails([]);
          }}
          title="Upload your PDF document"
          subtitle="Drag & drop single PDF file to compress"
        />

        {thumbnails.length > 0 && !isLoadingPages && (
          <PDFPageGridList
            title="PDF Document Pages Preview"
            pages={thumbnails}
            selectable={false}
            showPreviewModal={false}
          />
        )}

        {files.length > 0 && (
          <div className="space-y-4 pt-2">
            {/* DESKTOP LIQUID GLASS CONTROL PANEL */}
            <div className="p-4 sm:p-6 rounded-3xl apple-dynamic-island luma-glass-texture border border-white/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
                  Select Compression Level
                </label>
                <span className="text-[10px] text-indigo-900 bg-white/80 border border-indigo-200/80 px-2.5 py-1 rounded-full font-black uppercase tracking-wide shadow-2xs">
                  {mode === 'preset'
                    ? `Preset: ${preset.toUpperCase()} (${preset === 'extreme' ? getEstimatedSize('extreme') : preset === 'recommended' ? getEstimatedSize('recommended') : getEstimatedSize('low')})`
                    : `Target: ${targetVal} ${targetUnit}`}
                </span>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 rounded-2xl border border-white/60">
                <button
                  type="button"
                  onClick={() => setMode('preset')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'preset'
                      ? 'bg-white text-slate-900 shadow-xs border border-white'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Compression Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('target')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'target'
                      ? 'bg-white text-slate-900 shadow-xs border border-white'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Target File Size</span>
                </button>
              </div>

              {/* Preset Cards View */}
              {mode === 'preset' && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                  {/* Extreme */}
                  <button
                    type="button"
                    onClick={() => setPreset('extreme')}
                    className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 cursor-pointer active:scale-95 ${
                      preset === 'extreme'
                        ? 'border-2 border-indigo-600 bg-white/90 text-slate-900 font-black shadow-md ring-2 ring-indigo-500/20'
                        : 'border-white/60 bg-white/60 hover:bg-white/90 text-slate-700 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                      Max Shrink
                    </span>
                    <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">Extreme</div>
                    <div className="text-[9px] sm:text-xs text-slate-500 font-medium">Up to -80%</div>
                    {files.length > 0 && (
                      <span className="mt-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shadow-2xs">
                        ~{getEstimatedSize('extreme')}
                      </span>
                    )}
                  </button>

                  {/* Recommended */}
                  <button
                    type="button"
                    onClick={() => setPreset('recommended')}
                    className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 cursor-pointer active:scale-95 ${
                      preset === 'recommended'
                        ? 'border-2 border-indigo-600 bg-white/90 text-slate-900 font-black shadow-md ring-2 ring-indigo-500/20'
                        : 'border-white/60 bg-white/60 hover:bg-white/90 text-slate-700 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      Optimal
                    </span>
                    <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">Recommended</div>
                    <div className="text-[9px] sm:text-xs text-slate-500 font-medium">Best Quality</div>
                    {files.length > 0 && (
                      <span className="mt-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shadow-2xs">
                        ~{getEstimatedSize('recommended')}
                      </span>
                    )}
                  </button>

                  {/* Light */}
                  <button
                    type="button"
                    onClick={() => setPreset('low')}
                    className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 cursor-pointer active:scale-95 ${
                      preset === 'low'
                        ? 'border-2 border-indigo-600 bg-white/90 text-slate-900 font-black shadow-md ring-2 ring-indigo-500/20'
                        : 'border-white/60 bg-white/60 hover:bg-white/90 text-slate-700 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-200">
                      High Res
                    </span>
                    <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">Light</div>
                    <div className="text-[9px] sm:text-xs text-slate-500 font-medium">HD Output</div>
                    {files.length > 0 && (
                      <span className="mt-1 text-[10px] font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60 shadow-2xs">
                        ~{getEstimatedSize('low')}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Target File Size Controls View */}
              {mode === 'target' && (
                <div className="space-y-4 pt-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Enter Desired Max Size
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="10"
                          max="50000"
                          value={targetVal}
                          onChange={(e) => setTargetVal(Number(e.target.value))}
                          className="w-full pl-3.5 pr-20 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-black text-sm outline-hidden transition-all bg-white"
                          placeholder="e.g. 200"
                        />
                        <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center bg-slate-100 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => setTargetUnit('KB')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              targetUnit === 'KB'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            KB
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetUnit('MB')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              targetUnit === 'MB'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            MB
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Size Pills */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Quick Targets
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { val: 100, unit: 'KB' },
                          { val: 200, unit: 'KB' },
                          { val: 500, unit: 'KB' },
                          { val: 1, unit: 'MB' },
                          { val: 2, unit: 'MB' },
                        ].map((item) => (
                          <button
                            key={`${item.val}-${item.unit}`}
                            type="button"
                            onClick={() => {
                              setTargetVal(item.val);
                              setTargetUnit(item.unit as 'KB' | 'MB');
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              targetVal === item.val && targetUnit === item.unit
                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            {item.val} {item.unit}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Approximate PDF Size Indicator Box */}
                  {files.length > 0 && getTargetEstimatedSize() && (
                    <div className="p-3.5 rounded-2xl bg-white/80 border border-indigo-100 flex items-center justify-between gap-3 text-indigo-950">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Estimated PDF Size: <span className="font-black text-indigo-700">{getTargetEstimatedSize()?.estText}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Original file size is {formatBytes(files[0].file.size)}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                        {getTargetEstimatedSize()?.reductionPct} Reduction
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Main Desktop Action Compress Button */}
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Compressing PDF Locally...</span>
                  </>
                ) : (
                  <span>
                    {mode === 'target'
                      ? `Compress PDF to < ${targetVal} ${targetUnit}`
                      : 'Compress PDF File Now'}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* MOBILE LIQUID GLASS DYNAMIC ISLAND ACTION CAPSULE */}
        {files.length > 0 && (
          <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-sm apple-dynamic-island luma-glass-texture rounded-full p-1.5 shadow-2xl flex items-center justify-between gap-2 border border-white/80 animate-in slide-in-from-bottom-3 duration-200">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-3.5 py-2 rounded-full luma-glass-pill text-slate-900 font-black text-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>{mode === 'preset' ? preset.toUpperCase() : `${targetVal}${targetUnit}`}</span>
            </button>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`compressed-${files[0]?.file.name || 'document.pdf'}`}
                className="flex-1 py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Download PDF</span>
              </a>
            ) : (
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-full bg-slate-900 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
              >
                {isProcessing && <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />}
                <span>Compress PDF</span>
              </button>
            )}
          </div>
        )}

        {/* MOBILE COMPRESSION OPTIONS MODAL */}
        {isSettingsModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-end justify-center p-0 animate-in fade-in duration-200"
            onClick={() => setIsSettingsModalOpen(false)}
          >
            <div
              className="bg-white w-full rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-6 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Compression Level</span>
                </h3>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setMode('preset');
                    setPreset('extreme');
                    setIsSettingsModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                    mode === 'preset' && preset === 'extreme'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black">Extreme (Max Shrink)</div>
                    <div className="text-[10px] text-slate-500 font-medium">Up to -80% size reduction</div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    ~{getEstimatedSize('extreme')}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMode('preset');
                    setPreset('recommended');
                    setIsSettingsModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                    mode === 'preset' && preset === 'recommended'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black">Optimal (Recommended)</div>
                    <div className="text-[10px] text-slate-500 font-medium">Best balance of quality & size</div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    ~{getEstimatedSize('recommended')}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMode('preset');
                    setPreset('low');
                    setIsSettingsModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                    mode === 'preset' && preset === 'low'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black">Light (High Res)</div>
                    <div className="text-[10px] text-slate-500 font-medium">HD Output quality preservation</div>
                  </div>
                  <span className="text-xs font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                    ~{getEstimatedSize('low')}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs shadow-md"
              >
                Apply Selection
              </button>
            </div>
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
                    Reduced from {formatBytes(resultInfo.origSize)} to{' '}
                    <strong className="text-emerald-800 font-bold">{formatBytes(resultInfo.compSize)}</strong>
                  </p>
                </div>
              </div>

              <a
                href={downloadUrl}
                download={`compressed-${files[0]?.file.name || 'document.pdf'}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

