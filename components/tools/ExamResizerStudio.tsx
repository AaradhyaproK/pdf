'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw,
  Zap,
  Sliders,
  User,
  Calendar,
  Layers,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';

export interface ExamResizerStudioProps {
  defaultTargetKB: number;
  minKB?: number;
  maxKB?: number;
  fixedWidth?: number;
  fixedHeight?: number;
  aspectRatio?: number;
  isSignature?: boolean;
  allowNameDate?: boolean;
  isJoinerMode?: boolean;
  portalName: string;
  slug?: string;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB Max Input
const MAX_CANVAS_DIM = 4096; // Max 4096px dimension to prevent Safari iOS crashes

export function ExamResizerStudio({
  defaultTargetKB,
  minKB,
  maxKB,
  fixedWidth,
  fixedHeight,
  aspectRatio,
  isSignature = false,
  allowNameDate = false,
  isJoinerMode = false,
  portalName,
  slug = 'exam-photo',
}: ExamResizerStudioProps) {
  // Image files state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  // Settings state
  const [targetKB, setTargetKB] = useState<number>(defaultTargetKB);
  const [magicBW, setMagicBW] = useState<boolean>(!!isSignature);
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateDate, setCandidateDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [enableNameDateStamp, setEnableNameDateStamp] = useState<boolean>(!!allowNameDate);

  // Output State
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputKB, setOutputKB] = useState<number>(0);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevOutputUrlRef = useRef<string | null>(null);

  // --- MEMORY LEAK CLEANUP ---
  useEffect(() => {
    return () => {
      if (prevOutputUrlRef.current) {
        URL.revokeObjectURL(prevOutputUrlRef.current);
      }
    };
  }, []);

  const setCleanOutputUrl = (url: string | null) => {
    if (prevOutputUrlRef.current) {
      URL.revokeObjectURL(prevOutputUrlRef.current);
    }
    prevOutputUrlRef.current = url;
    setOutputUrl(url);
  };

  // Load Image helper with error handling
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        reject(new Error('File size is very large (>25MB). Please select a smaller photo.'));
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Corrupted or unsupported image format.'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Main Processing Engine
  const processCanvas = useCallback(async () => {
    if (isJoinerMode) {
      if (!photoFile || !signatureFile) return;
    } else {
      if (!photoFile) return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Calculate total original size
      const totalOrigBytes = photoFile.size + (signatureFile ? signatureFile.size : 0);
      const origKB = parseFloat((totalOrigBytes / 1024).toFixed(1));
      setOriginalSizeKB(origKB);

      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context unavailable');
      }

      if (isJoinerMode && photoFile && signatureFile) {
        // --- JOINER MODE (Photo Top + Signature Bottom) ---
        const photoImg = await loadImage(photoFile);
        const sigImg = await loadImage(signatureFile);

        let canvasWidth = fixedWidth || 400;
        let photoHeight = Math.round(canvasWidth * 1.25); // 4:5 ratio for photo
        let sigHeight = Math.round(canvasWidth * 0.4); // 2.5:1 ratio for sig
        let canvasHeight = fixedHeight || photoHeight + sigHeight;

        // Clamp dimensions safely
        if (canvasWidth > MAX_CANVAS_DIM || canvasHeight > MAX_CANVAS_DIM) {
          const ratio = Math.min(MAX_CANVAS_DIM / canvasWidth, MAX_CANVAS_DIM / canvasHeight);
          canvasWidth = Math.round(canvasWidth * ratio);
          canvasHeight = Math.round(canvasHeight * ratio);
          photoHeight = Math.round(photoHeight * ratio);
          sigHeight = Math.round(sigHeight * ratio);
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Fill solid white background (prevents transparent PNGs turning black)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw Photo top
        ctx.drawImage(photoImg, 0, 0, canvasWidth, photoHeight);

        // Divider line
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, photoHeight);
        ctx.lineTo(canvasWidth, photoHeight);
        ctx.stroke();

        // Draw Signature bottom
        ctx.drawImage(sigImg, 0, photoHeight, canvasWidth, canvasHeight - photoHeight);
      } else if (photoFile) {
        // --- STANDARD PHOTO / SIGNATURE MODE ---
        const img = await loadImage(photoFile);

        let targetW = fixedWidth || img.naturalWidth;
        let targetH = fixedHeight || img.naturalHeight;

        if (!fixedWidth && !fixedHeight && aspectRatio) {
          targetW = img.naturalWidth;
          targetH = Math.round(img.naturalWidth / aspectRatio);
        }

        // Clamp max canvas dimension
        if (targetW > MAX_CANVAS_DIM || targetH > MAX_CANVAS_DIM) {
          const scaleRatio = Math.min(MAX_CANVAS_DIM / targetW, MAX_CANVAS_DIM / targetH);
          targetW = Math.round(targetW * scaleRatio);
          targetH = Math.round(targetH * scaleRatio);
        }

        canvas.width = targetW;
        canvas.height = targetH;

        // Fill solid white background (prevents transparent PNGs turning black)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);

        // Center Crop / Draw Image
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // --- MAGIC B&W SIGNATURE ENHANCEMENT ---
        if (magicBW) {
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            // Luminance formula L = 0.299R + 0.587G + 0.114B
            const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            if (l > 165) {
              // Force to pure white
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            } else {
              // Force to pure black
              data[i] = 0;
              data[i + 1] = 0;
              data[i + 2] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // --- NAME & DATE STAMP ---
        if (enableNameDateStamp && (candidateName || candidateDate)) {
          const barHeight = Math.round(targetH * 0.18);
          const barY = targetH - barHeight;

          // Draw solid white rectangle at bottom
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, barY, targetW, barHeight);

          // Draw border top of white bar
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = Math.max(1, Math.round(targetH * 0.005));
          ctx.beginPath();
          ctx.moveTo(0, barY);
          ctx.lineTo(targetW, barY);
          ctx.stroke();

          // Render Text centered
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const fontSize = Math.max(12, Math.round(barHeight * 0.35));
          ctx.font = `bold ${fontSize}px sans-serif, Arial`;

          if (candidateName && candidateDate) {
            ctx.fillText(candidateName.toUpperCase(), targetW / 2, barY + barHeight * 0.32);
            ctx.fillText(`DATE: ${candidateDate}`, targetW / 2, barY + barHeight * 0.72);
          } else {
            ctx.fillText(
              (candidateName || candidateDate).toUpperCase(),
              targetW / 2,
              barY + barHeight / 2
            );
          }
        }
      }

      setOutputDimensions({ width: canvas.width, height: canvas.height });

      // --- ITERATIVE BINARY SEARCH CANVAS COMPRESSION ---
      const targetSizeBytes = targetKB * 1024;
      let minQuality = 0.05;
      let maxQuality = 0.98;
      let bestBlob: Blob | null = null;
      let scale = 1.0;

      // Iterative loop (up to 8 passes binary search)
      for (let pass = 0; pass < 8; pass++) {
        const quality = (minQuality + maxQuality) / 2;

        let workingCanvas = canvas;
        if (scale < 1.0) {
          workingCanvas = document.createElement('canvas');
          workingCanvas.width = Math.round(canvas.width * scale);
          workingCanvas.height = Math.round(canvas.height * scale);
          const wCtx = workingCanvas.getContext('2d');
          if (wCtx) {
            wCtx.fillStyle = '#FFFFFF';
            wCtx.fillRect(0, 0, workingCanvas.width, workingCanvas.height);
            wCtx.drawImage(canvas, 0, 0, workingCanvas.width, workingCanvas.height);
          }
        }

        const blob: Blob = await new Promise((res) =>
          workingCanvas.toBlob((b) => res(b!), 'image/jpeg', quality)
        );

        bestBlob = blob;

        if (blob.size > targetSizeBytes) {
          maxQuality = quality;
        } else {
          minQuality = quality;
        }

        // Downscale 10% if minimal quality still exceeds target
        if (pass === 7 && blob.size > targetSizeBytes && scale > 0.4) {
          scale -= 0.1;
          minQuality = 0.05;
          maxQuality = 0.95;
          pass = 0; // restart passes with downscaled canvas
        }
      }

      if (bestBlob) {
        setOutputBlob(bestBlob);
        const url = URL.createObjectURL(bestBlob);
        setCleanOutputUrl(url);
        const resKB = parseFloat((bestBlob.size / 1024).toFixed(1));
        setOutputKB(resKB);

        trackEvent('compression_completed', {
          toolSlug: slug,
          presetName: portalName,
          originalSizeKB: origKB,
          outputSizeKB: resKB,
        });
      }
    } catch (err: any) {
      const msg = err?.message || 'Error processing image.';
      setErrorMessage(msg);
      toast.error(msg);
      trackEvent('error_occurred', { toolSlug: slug, errorMessage: msg });
    } finally {
      setIsProcessing(false);
    }
  }, [
    photoFile,
    signatureFile,
    isJoinerMode,
    fixedWidth,
    fixedHeight,
    aspectRatio,
    magicBW,
    enableNameDateStamp,
    candidateName,
    candidateDate,
    targetKB,
    slug,
    portalName,
  ]);

  // Trigger processing on state changes
  useEffect(() => {
    processCanvas();
  }, [processCanvas]);

  // Handle Photo File Select
  const handlePhotoSelect = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('File is too large (>25MB). Please select a smaller photo.');
      return;
    }
    setPhotoFile(file);
    trackEvent('image_uploaded', {
      toolSlug: slug,
      presetName: portalName,
      fileType: file.type,
      originalSizeKB: parseFloat((file.size / 1024).toFixed(1)),
    });
  };

  // Handle Signature File Select
  const handleSigSelect = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('Signature file is too large (>25MB).');
      return;
    }
    setSignatureFile(file);
  };

  // Handle Downloads
  const handleDownload = () => {
    if (!outputUrl || !outputBlob) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `filezenith-${slug}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success(`Downloaded filezenith-${slug}.jpg successfully!`);
    trackEvent('download_clicked', {
      toolSlug: slug,
      presetName: portalName,
      outputSizeKB: outputKB,
    });
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Studio Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        {/* Verification Specs Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold text-xs">
              {portalName}
            </span>
            <span className="text-xs font-bold text-slate-500">Official Upload Preset</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Target: ≤ {targetKB} KB {minKB ? `(Min ${minKB} KB)` : ''}
            </span>
          </div>
        </div>

        {/* 100% In-Browser Privacy Trust Notice */}
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs font-bold text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Your images are processed locally in your browser and are not uploaded to our servers.
          </span>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload Dropzone(s) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dropzone 1: Photo / Signature */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-slate-700">
              {isJoinerMode ? '1. Upload Photo' : isSignature ? 'Upload Signature Image' : 'Upload Candidate Photograph'}
            </label>
            <label
              tabIndex={0}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl cursor-pointer transition-all group min-h-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Upload className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-xs font-extrabold text-slate-800 text-center">
                {photoFile ? photoFile.name : 'Click or Drag & Drop File'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP accepted (Max 25MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Dropzone 2: Signature (Joiner Mode Only) */}
          {isJoinerMode && (
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-slate-700">
                2. Upload Signature
              </label>
              <label
                tabIndex={0}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl cursor-pointer transition-all group min-h-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Upload className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-extrabold text-slate-800 text-center">
                  {signatureFile ? signatureFile.name : 'Click or Drag & Drop Signature'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">JPG, PNG accepted</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSigSelect(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Interactive Controls & Modifiers */}
        {photoFile && (
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Target KB Slider */}
              <div className="space-y-1 sm:col-span-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <label htmlFor="kbSlider">File Size Limit:</label>
                  <span className="text-indigo-600 font-black">{targetKB} KB</span>
                </div>
                <input
                  id="kbSlider"
                  type="range"
                  min={minKB || 10}
                  max={maxKB || 300}
                  value={targetKB}
                  onChange={(e) => setTargetKB(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-11 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* B&W Contrast Toggle */}
              <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                <input
                  type="checkbox"
                  id="magicBW"
                  checked={magicBW}
                  onChange={(e) => setMagicBW(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded cursor-pointer focus:ring-2 focus:ring-indigo-500"
                />
                <label htmlFor="magicBW" className="font-extrabold text-slate-800 cursor-pointer select-none">
                  Magic B&W Signature Cleanup
                </label>
              </div>

              {/* Name & Date Stamp Toggle */}
              {allowNameDate && (
                <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                  <input
                    type="checkbox"
                    id="enableStamp"
                    checked={enableNameDateStamp}
                    onChange={(e) => setEnableNameDateStamp(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded cursor-pointer focus:ring-2 focus:ring-indigo-500"
                  />
                  <label htmlFor="enableStamp" className="font-extrabold text-slate-800 cursor-pointer select-none">
                    Print Name & Date Bar
                  </label>
                </div>
              )}
            </div>

            {/* Candidate Name & Date Input Fields */}
            {enableNameDateStamp && allowNameDate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div>
                  <label htmlFor="candName" className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    id="candName"
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. RAHUL KUMAR"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="candDate" className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Date of Photo (DOP)
                  </label>
                  <input
                    id="candDate"
                    type="date"
                    value={candidateDate}
                    onChange={(e) => setCandidateDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Side-by-Side Preview & Download Card (Day-mode clean styling) */}
      {photoFile && outputUrl && (
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs font-black uppercase text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Output Ready for Official Portal
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Dimensions: {outputDimensions.width} × {outputDimensions.height} px
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Original: {originalSizeKB} KB</span>
                <span className="text-sm font-black text-emerald-700 block">
                  Compressed: {outputKB} KB
                </span>
              </div>
            </div>
          </div>

          {/* Center Canvas Graphic Preview (Clean light surface) */}
          <div className="flex justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 min-h-[220px] items-center relative">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 text-indigo-600 py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-xs font-bold">Compressing Image to Specification...</span>
              </div>
            ) : (
              <img
                src={outputUrl}
                alt="Processed Exam Output"
                className="max-h-[300px] object-contain rounded-xl shadow-md border border-slate-200 bg-white"
              />
            )}
          </div>

          {/* Download Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{outputKB <= targetKB ? 'Verified Under KB Limit' : 'Optimized Best Quality'}</span>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer focus:ring-2 focus:ring-indigo-500"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download filezenith-{slug}.jpg</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden Offscreen Canvas Element */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
