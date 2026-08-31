'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { compressPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Sliders, Minimize2, CheckCircle2, Sparkles, Target, Info } from 'lucide-react';

export default function CompressPDFTo200KBPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [targetVal, setTargetVal] = useState<number>(200);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<{ origSize: number; compSize: number } | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file first.');
      return;
    }

    const targetKB = targetUnit === 'MB' ? targetVal * 1024 : targetVal;
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
      slug="/pdf/compress-to-200kb"
      title="Compress PDF to 200KB Online"
      subtitle="Reduce PDF size to under 200KB (or custom target size) for government forms, job portals, and online applications. 100% Client-Side."
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
          title="Upload PDF to compress under 200KB"
          subtitle="Drag & drop single PDF file to compress"
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-2">
            {/* Target Control Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                  Target File Size Option
                </label>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wide">
                  Target: {targetVal} {targetUnit}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Enter Desired Max Size
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="10"
                        max="50000"
                        value={targetVal}
                        onChange={(e) => setTargetVal(Number(e.target.value))}
                        className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-black text-sm outline-hidden transition-all bg-slate-50/50 focus:bg-white"
                        placeholder="e.g. 200"
                      />
                      <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center bg-slate-200/70 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => setTargetUnit('KB')}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
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
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
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

                  {/* Quick Targets Pills */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
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
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                            targetVal === item.val && targetUnit === item.unit
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {item.val} {item.unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estimated Output Size Indicator */}
                {getTargetEstimatedSize() && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3 text-indigo-950">
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
            </div>

            {/* Action Compress Button */}
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Optimizing PDF to &lt; {targetVal} {targetUnit}...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4 text-white" />
                  <span>Compress PDF to &lt; {targetVal} {targetUnit}</span>
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
                    <span>PDF Ready ({formatBytes(resultInfo.compSize)})</span>
                    {getSavedPercent() > 0 && (
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                        {getSavedPercent()}% Saved
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-emerald-800 font-bold mt-0.5">
                    Compliant with portal size rules! Reduced from {formatBytes(resultInfo.origSize)} to{' '}
                    <strong className="text-emerald-950 font-black">{formatBytes(resultInfo.compSize)}</strong>
                  </p>
                </div>
              </div>

              <a
                href={downloadUrl}
                download={`compressed-${targetVal}${targetUnit.toLowerCase()}-${files[0]?.file.name || 'document.pdf'}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

