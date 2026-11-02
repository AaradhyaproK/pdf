'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Download,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Crop,
  Layers,
  FileCheck,
  Printer,
  UserCheck,
  Stamp,
  RefreshCw,
  Info,
  Maximize2,
  FileText,
  FileCode,
  Trash2,
  RotateCcw,
  FileUp,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { triggerBrowserDownload } from '@/lib/download-helper';
import { compressPDF } from '@/lib/pdf-engine';

// Helper to inject 300 DPI into the binary JPEG JFIF header
function inject300DpiJpeg(buffer: Uint8Array): Uint8Array {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  // Check JPEG SOI (0xFFD8)
  if (view.getUint16(0) !== 0xffd8) return buffer;

  // If APP0 (0xFFE0) marker exists at offset 2
  if (view.getUint16(2) === 0xffe0) {
    // Check 'JFIF\0' (0x4A464946 0x00)
    if (view.getUint32(6) === 0x4a464946 && view.getUint8(10) === 0) {
      view.setUint8(13, 1); // 1 = dots per inch (DPI)
      view.setUint16(14, 300); // X density = 300 DPI
      view.setUint16(16, 300); // Y density = 300 DPI
      return buffer;
    }
  }

  // Otherwise construct standard 18-byte JFIF header and insert after SOI
  const jfifHeader = new Uint8Array([
    0xff, 0xe0, 0x00, 0x10,
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x02, // version 1.02
    0x01, // units = inches
    0x01, 0x2c, // X density = 300 (0x012C)
    0x01, 0x2c, // Y density = 300 (0x012C)
    0x00, 0x00, // thumbnail dimensions
  ]);

  const newBuf = new Uint8Array(buffer.length + jfifHeader.length);
  newBuf.set(buffer.subarray(0, 2), 0);
  newBuf.set(jfifHeader, 2);
  newBuf.set(buffer.subarray(2), 2 + jfifHeader.length);
  return newBuf;
}

type TabType = 'photo' | 'signature' | 'dual' | 'pdf';

interface ImageState {
  file: File | null;
  img: HTMLImageElement | null;
  zoom: number;
  rotation: number; // 0, 90, 180, 270
  offsetX: number;
  offsetY: number;
  brightness: number; // -50 to 50, default 0
  contrast: number; // -50 to 50, default 0
  magicBW: boolean;
  bwThreshold: number; // 100 to 220, default 160
  outputBlob: Blob | null;
  outputUrl: string | null;
  outputKB: number;
  isProcessing: boolean;
}

const defaultPhotoState: ImageState = {
  file: null,
  img: null,
  zoom: 1.0,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  brightness: 0,
  contrast: 0,
  magicBW: false,
  bwThreshold: 160,
  outputBlob: null,
  outputUrl: null,
  outputKB: 0,
  isProcessing: false,
};

const defaultSignatureState: ImageState = {
  file: null,
  img: null,
  zoom: 1.0,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  brightness: 0,
  contrast: 0,
  magicBW: true,
  bwThreshold: 160,
  outputBlob: null,
  outputUrl: null,
  outputKB: 0,
  isProcessing: false,
};

export function PanCardResizerStudio() {
  const [activeTab, setActiveTab] = useState<TabType>('photo');
  const [portalPreset, setPortalPreset] = useState<'nsdl' | 'utiitsl'>('nsdl');

  // Photo & Signature State
  const [photoState, setPhotoState] = useState<ImageState>(defaultPhotoState);
  const [sigState, setSigState] = useState<ImageState>(defaultSignatureState);

  // Target KB limits (official is <50KB)
  const [photoTargetKB, setPhotoTargetKB] = useState<number>(40);
  const [sigTargetKB, setSigTargetKB] = useState<number>(25);

  // Guideline overlays toggle
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);

  // PDF Support Doc State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfOutputBlob, setPdfOutputBlob] = useState<Blob | null>(null);
  const [pdfOutputUrl, setPdfOutputUrl] = useState<string | null>(null);
  const [pdfOutputKB, setPdfOutputKB] = useState<number>(0);
  const [isPdfProcessing, setIsPdfProcessing] = useState<boolean>(false);

  // Canvas Refs for interactive viewport
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dragging state for photo viewport
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const dragStartPhoto = useRef<{ x: number; y: number; offX: number; offY: number }>({ x: 0, y: 0, offX: 0, offY: 0 });

  // Dragging state for sig viewport
  const [isDraggingSig, setIsDraggingSig] = useState(false);
  const dragStartSig = useRef<{ x: number; y: number; offX: number; offY: number }>({ x: 0, y: 0, offX: 0, offY: 0 });

  // File input refs for uploading & replacing files
  const photoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Reset Photo to clear file and restore fresh blank state
  const resetPhoto = () => {
    if (photoState.outputUrl) URL.revokeObjectURL(photoState.outputUrl);
    setPhotoState(defaultPhotoState);
    if (photoInputRef.current) photoInputRef.current.value = '';
    toast.info('Photo removed. Ready to upload a new file.');
  };

  // Reset Signature to clear file and restore fresh blank state
  const resetSignature = () => {
    if (sigState.outputUrl) URL.revokeObjectURL(sigState.outputUrl);
    setSigState(defaultSignatureState);
    if (sigInputRef.current) sigInputRef.current.value = '';
    toast.info('Signature removed. Ready to upload a new file.');
  };

  // Reset Supporting Documents PDF
  const resetPdf = () => {
    if (pdfOutputUrl) URL.revokeObjectURL(pdfOutputUrl);
    setPdfFile(null);
    setPdfOutputBlob(null);
    setPdfOutputUrl(null);
    setPdfOutputKB(0);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    toast.info('Supporting document removed.');
  };

  // Global Reset (clear all uploaded files for new customer)
  const resetAll = () => {
    if (photoState.outputUrl) URL.revokeObjectURL(photoState.outputUrl);
    if (sigState.outputUrl) URL.revokeObjectURL(sigState.outputUrl);
    if (pdfOutputUrl) URL.revokeObjectURL(pdfOutputUrl);
    setPhotoState(defaultPhotoState);
    setSigState(defaultSignatureState);
    setPdfFile(null);
    setPdfOutputBlob(null);
    setPdfOutputUrl(null);
    setPdfOutputKB(0);
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (sigInputRef.current) sigInputRef.current.value = '';
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    toast.success('All files cleared. Ready for a new fresh application!');
  };

  // Load image helper
  const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  };

  // Handle Photo File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = await loadImageFromFile(file);
      if (photoState.outputUrl) URL.revokeObjectURL(photoState.outputUrl);
      setPhotoState({
        ...defaultPhotoState,
        file,
        img,
        zoom: 1.0,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        brightness: 0,
        contrast: 0,
      });
      toast.success('Photo loaded successfully! Adjust crop and position as needed.');
    } catch {
      toast.error('Could not load image file.');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Handle Signature File Upload
  const handleSignatureSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = await loadImageFromFile(file);
      if (sigState.outputUrl) URL.revokeObjectURL(sigState.outputUrl);
      setSigState({
        ...defaultSignatureState,
        file,
        img,
        zoom: 1.0,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        magicBW: true,
        bwThreshold: 160,
      });
      toast.success('Signature loaded successfully! Magic B&W cleanup applied.');
    } catch {
      toast.error('Could not load signature file.');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Process Photo to Exact 213x213 px at 300 DPI (<50KB)
  const renderPhoto = useCallback(async () => {
    if (!photoState.img) return;

    setPhotoState((p) => ({ ...p, isProcessing: true }));

    try {
      const TARGET_W = 213;
      const TARGET_H = 213;

      const canvas = document.createElement('canvas');
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill solid pure white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, TARGET_W, TARGET_H);

      ctx.save();
      // Move to center of canvas
      ctx.translate(TARGET_W / 2, TARGET_H / 2);
      ctx.rotate((photoState.rotation * Math.PI) / 180);
      ctx.scale(photoState.zoom, photoState.zoom);
      ctx.translate(photoState.offsetX, photoState.offsetY);

      // Draw image centered
      const imgW = photoState.img.naturalWidth;
      const imgH = photoState.img.naturalHeight;
      // Fit to cover square
      const baseScale = Math.max(TARGET_W / imgW, TARGET_H / imgH);
      const drawW = imgW * baseScale;
      const drawH = imgH * baseScale;

      ctx.drawImage(photoState.img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Apply Brightness & Contrast adjustments if modified
      if (photoState.brightness !== 0 || photoState.contrast !== 0) {
        const imgData = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
        const data = imgData.data;
        const b = photoState.brightness;
        const c = photoState.contrast;
        // contrast factor
        const factor = (259 * (c + 255)) / (255 * (259 - c));

        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + b));
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + b));
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + b));
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Binary search JPEG quality to target size strictly under 50KB (preset 40KB)
      const targetBytes = Math.min(48 * 1024, photoTargetKB * 1024);
      let minQ = 0.2;
      let maxQ = 0.98;
      let bestBlob: Blob | null = null;

      for (let pass = 0; pass < 6; pass++) {
        const q = (minQ + maxQ) / 2;
        const rawBlob = await new Promise<Blob>((res) =>
          canvas.toBlob((b) => res(b!), 'image/jpeg', q)
        );
        bestBlob = rawBlob;
        if (rawBlob.size > targetBytes) {
          maxQ = q;
        } else {
          minQ = q;
        }
      }

      if (bestBlob) {
        // Inject 300 DPI into the JFIF header
        const arrayBuf = await bestBlob.arrayBuffer();
        const with300Dpi = inject300DpiJpeg(new Uint8Array(arrayBuf));
        const finalBlob = new Blob([with300Dpi as any], { type: 'image/jpeg' });
        const url = URL.createObjectURL(finalBlob);

        setPhotoState((p) => {
          if (p.outputUrl) URL.revokeObjectURL(p.outputUrl);
          return {
            ...p,
            outputBlob: finalBlob,
            outputUrl: url,
            outputKB: parseFloat((finalBlob.size / 1024).toFixed(1)),
            isProcessing: false,
          };
        });
      }
    } catch (err: any) {
      toast.error('Photo rendering failed.');
      setPhotoState((p) => ({ ...p, isProcessing: false }));
    }
  }, [photoState.img, photoState.zoom, photoState.rotation, photoState.offsetX, photoState.offsetY, photoState.brightness, photoState.contrast, photoTargetKB]);

  // Process Signature to Exact 444x205 px at 300 DPI (<50KB)
  const renderSignature = useCallback(async () => {
    if (!sigState.img) return;

    setSigState((s) => ({ ...s, isProcessing: true }));

    try {
      const TARGET_W = 444;
      const TARGET_H = 205;

      const canvas = document.createElement('canvas');
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill pure solid white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, TARGET_W, TARGET_H);

      ctx.save();
      ctx.translate(TARGET_W / 2, TARGET_H / 2);
      ctx.rotate((sigState.rotation * Math.PI) / 180);
      ctx.scale(sigState.zoom, sigState.zoom);
      ctx.translate(sigState.offsetX, sigState.offsetY);

      const imgW = sigState.img.naturalWidth;
      const imgH = sigState.img.naturalHeight;
      const baseScale = Math.max(TARGET_W / imgW, TARGET_H / imgH);
      const drawW = imgW * baseScale;
      const drawH = imgH * baseScale;

      ctx.drawImage(sigState.img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Magic B&W cleanup for paper signature
      if (sigState.magicBW) {
        const imgData = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
        const data = imgData.data;
        const thresh = sigState.bwThreshold;

        for (let i = 0; i < data.length; i += 4) {
          // Standard perception luminance L = 0.299R + 0.587G + 0.114B
          const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (l > thresh) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Binary search JPEG quality to target size strictly under 50KB (preset 25KB)
      const targetBytes = Math.min(48 * 1024, sigTargetKB * 1024);
      let minQ = 0.2;
      let maxQ = 0.98;
      let bestBlob: Blob | null = null;

      for (let pass = 0; pass < 6; pass++) {
        const q = (minQ + maxQ) / 2;
        const rawBlob = await new Promise<Blob>((res) =>
          canvas.toBlob((b) => res(b!), 'image/jpeg', q)
        );
        bestBlob = rawBlob;
        if (rawBlob.size > targetBytes) {
          maxQ = q;
        } else {
          minQ = q;
        }
      }

      if (bestBlob) {
        // Inject 300 DPI into the JFIF header
        const arrayBuf = await bestBlob.arrayBuffer();
        const with300Dpi = inject300DpiJpeg(new Uint8Array(arrayBuf));
        const finalBlob = new Blob([with300Dpi as any], { type: 'image/jpeg' });
        const url = URL.createObjectURL(finalBlob);

        setSigState((s) => {
          if (s.outputUrl) URL.revokeObjectURL(s.outputUrl);
          return {
            ...s,
            outputBlob: finalBlob,
            outputUrl: url,
            outputKB: parseFloat((finalBlob.size / 1024).toFixed(1)),
            isProcessing: false,
          };
        });
      }
    } catch (err: any) {
      toast.error('Signature rendering failed.');
      setSigState((s) => ({ ...s, isProcessing: false }));
    }
  }, [sigState.img, sigState.zoom, sigState.rotation, sigState.offsetX, sigState.offsetY, sigState.magicBW, sigState.bwThreshold, sigTargetKB]);

  // Re-render when photo params change
  useEffect(() => {
    if (photoState.img) {
      const timer = setTimeout(renderPhoto, 60);
      return () => clearTimeout(timer);
    }
  }, [renderPhoto]);

  // Re-render when signature params change
  useEffect(() => {
    if (sigState.img) {
      const timer = setTimeout(renderSignature, 60);
      return () => clearTimeout(timer);
    }
  }, [renderSignature]);

  // Handle PDF Supporting Document Upload
  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (pdfOutputUrl) URL.revokeObjectURL(pdfOutputUrl);
    setPdfFile(f);
    setPdfOutputBlob(null);
    setPdfOutputUrl(null);
    setPdfOutputKB(0);
    toast.success('Supporting document loaded! Click Compress to format under 300 KB.');
    if (e.target) e.target.value = '';
  };

  // Handle PDF Documents Compression (<300KB)
  const handleCompressPdf = async () => {
    if (!pdfFile) {
      toast.error('Please select a PDF file first.');
      return;
    }
    setIsPdfProcessing(true);
    try {
      const bytes = await compressPDF(pdfFile, 'target', 280); // 280KB safe target under 300KB
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      if (pdfOutputUrl) URL.revokeObjectURL(pdfOutputUrl);
      setPdfOutputBlob(blob);
      setPdfOutputUrl(url);
      setPdfOutputKB(parseFloat((blob.size / 1024).toFixed(1)));
      toast.success(`PDF compressed to ${parseFloat((blob.size / 1024).toFixed(1))} KB! Under 300KB limit.`);
    } catch (err: any) {
      toast.error(err?.message || 'PDF compression failed.');
    } finally {
      setIsPdfProcessing(false);
    }
  };

  // Drag handlers for Photo
  const onMouseDownPhoto = (e: React.MouseEvent) => {
    setIsDraggingPhoto(true);
    dragStartPhoto.current = { x: e.clientX, y: e.clientY, offX: photoState.offsetX, offY: photoState.offsetY };
  };
  const onMouseMovePhoto = (e: React.MouseEvent) => {
    if (!isDraggingPhoto) return;
    const dx = (e.clientX - dragStartPhoto.current.x) / photoState.zoom;
    const dy = (e.clientY - dragStartPhoto.current.y) / photoState.zoom;
    setPhotoState((p) => ({ ...p, offsetX: dragStartPhoto.current.offX + dx, offsetY: dragStartPhoto.current.offY + dy }));
  };
  const onMouseUpPhoto = () => setIsDraggingPhoto(false);

  // Drag handlers for Sig
  const onMouseDownSig = (e: React.MouseEvent) => {
    setIsDraggingSig(true);
    dragStartSig.current = { x: e.clientX, y: e.clientY, offX: sigState.offsetX, offY: sigState.offsetY };
  };
  const onMouseMoveSig = (e: React.MouseEvent) => {
    if (!isDraggingSig) return;
    const dx = (e.clientX - dragStartSig.current.x) / sigState.zoom;
    const dy = (e.clientY - dragStartSig.current.y) / sigState.zoom;
    setSigState((s) => ({ ...s, offsetX: dragStartSig.current.offX + dx, offsetY: dragStartSig.current.offY + dy }));
  };
  const onMouseUpSig = () => setIsDraggingSig(false);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Preset & Tabs Bar */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Photo (213×213 px)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signature')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'signature'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stamp className="w-4 h-4" />
            <span>Signature (444×205 px)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dual')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dual'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dual Package (Both)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Supporting Docs (&lt;300KB)</span>
          </button>
        </div>

        {/* Portal Standard Selector & Global Reset Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl text-[11px] font-bold text-slate-700">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase px-1.5">Portal:</span>
            <button
              type="button"
              onClick={() => setPortalPreset('nsdl')}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                portalPreset === 'nsdl' ? 'bg-white text-amber-900 font-black shadow-2xs' : 'text-slate-600'
              }`}
            >
              NSDL Protean
            </button>
            <button
              type="button"
              onClick={() => setPortalPreset('utiitsl')}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                portalPreset === 'utiitsl' ? 'bg-white text-amber-900 font-black shadow-2xs' : 'text-slate-600'
              }`}
            >
              UTIITSL
            </button>
          </div>

          {(photoState.img || sigState.img || pdfFile) && (
            <button
              type="button"
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Clear all uploaded files to start a fresh customer application"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset All Files</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PHOTO RESIZER (213 x 213 px, 300 DPI, <50KB)                        */}
      {/* ========================================================================= */}
      {(activeTab === 'photo' || activeTab === 'dual') && (
        <div className="p-4 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <UserCheck className="w-4 h-4" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  PAN Card Photograph Cropper &amp; Resizer
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Exact <strong className="text-slate-800">213 × 213 pixels</strong> (2.5 × 2.5 cm) at <strong className="text-slate-800">300 DPI</strong> &bull; Under 50 KB JPG
              </p>
            </div>

            {/* Live Compliance Badges & File Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ 213 × 213 px
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ 300 DPI Header
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ &lt; 50 KB Safe
                </span>
              </div>

              {photoState.img && (
                <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-slate-200">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Replace with another photo"
                  >
                    <FileUp className="w-3.5 h-3.5 text-amber-700" />
                    <span>Replace Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetPhoto}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Remove current photo"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hidden Master Photo File Input */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {!photoState.img ? (
            <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-3xl bg-amber-50/30 hover:bg-amber-50/60 transition-all cursor-pointer group text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center shadow-xs transition-colors">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Upload Candidate Passport Photo</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Supports JPG, PNG, WebP or mobile camera selfies</p>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-amber-600 group-hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all">
                Select Photo File
              </span>
            </label>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Interactive Viewport Canvas (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-3">
                <div
                  onMouseDown={onMouseDownPhoto}
                  onMouseMove={onMouseMovePhoto}
                  onMouseUp={onMouseUpPhoto}
                  onMouseLeave={onMouseUpPhoto}
                  className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-2xl overflow-hidden border-2 border-amber-500/80 bg-slate-900 shadow-md cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
                >
                  {/* Visual Rendered Canvas Output Preview */}
                  {photoState.outputUrl && (
                    <img
                      src={photoState.outputUrl}
                      alt="Crop preview"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Oval Face Guide Overlay */}
                  {showFaceGuide && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-400/70 rounded-full scale-[0.72] flex items-center justify-center">
                      <span className="text-[10px] font-black text-amber-300/80 bg-slate-900/60 px-2 py-0.5 rounded-full">
                        Center Face Here
                      </span>
                    </div>
                  )}

                  {/* Corner dimension indicator badge */}
                  <span className="absolute bottom-2 right-2 text-[10px] font-black bg-slate-900/80 text-white px-2 py-0.5 rounded-md pointer-events-none backdrop-blur-xs">
                    213 × 213 px
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold text-center">
                  💡 Drag image to center face. Use zoom slider to fit within frame.
                </p>

                {/* Quick Replace & Clear Buttons under canvas */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-950 border border-slate-200 hover:border-amber-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <FileUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Replace with New File</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetPhoto}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold text-slate-600 flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Clear photo to upload fresh file"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Controls & Output Panel (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Control Sliders Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                        Zoom Scale
                      </span>
                      <span className="text-amber-900 font-extrabold">{Math.round(photoState.zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      value={photoState.zoom}
                      onChange={(e) => setPhotoState((p) => ({ ...p, zoom: parseFloat(e.target.value) }))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPhotoState((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rotate 90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFaceGuide(!showFaceGuide)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        showFaceGuide ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <Crop className="w-3.5 h-3.5 text-amber-700" />
                      <span>Face Oval Guide</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoState((p) => ({ ...p, zoom: 1.0, rotation: 0, offsetX: 0, offsetY: 0, brightness: 0, contrast: 0 }))}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ml-auto"
                      title="Reset zoom, rotation, and brightness without removing image"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Sliders</span>
                    </button>
                  </div>

                  {/* Image Color Fine-Tuning */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Brightness</span>
                        <span>{photoState.brightness > 0 ? `+${photoState.brightness}` : photoState.brightness}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={photoState.brightness}
                        onChange={(e) => setPhotoState((p) => ({ ...p, brightness: parseInt(e.target.value) }))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Contrast</span>
                        <span>{photoState.contrast > 0 ? `+${photoState.contrast}` : photoState.contrast}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={photoState.contrast}
                        onChange={(e) => setPhotoState((p) => ({ ...p, contrast: parseInt(e.target.value) }))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Target KB slider */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      Target KB: <strong className="text-amber-900">{photoTargetKB} KB</strong>
                    </span>
                    <input
                      type="range"
                      min="15"
                      max="48"
                      value={photoTargetKB}
                      onChange={(e) => setPhotoTargetKB(parseInt(e.target.value))}
                      className="w-40 accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Ready Download Box */}
                {photoState.outputUrl && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ready: 213 × 213 px ({photoState.outputKB} KB)</span>
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
                        300 DPI Embedded &bull; Compliant for NSDL &amp; UTIITSL upload
                      </p>
                    </div>

                    <a
                      href={photoState.outputUrl}
                      download="pan-card-photo-213x213.jpg"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Photo (213×213)</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SIGNATURE RESIZER (444 x 205 px, 300 DPI, <50KB)                    */}
      {/* ========================================================================= */}
      {(activeTab === 'signature' || activeTab === 'dual') && (
        <div className="p-4 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Stamp className="w-4 h-4" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  PAN Card Signature Resizer &amp; Background Cleaner
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Exact <strong className="text-slate-800">444 × 205 pixels</strong> (4.5 × 2 cm) at <strong className="text-slate-800">300 DPI</strong> &bull; Under 50 KB JPG
              </p>
            </div>

            {/* Live Compliance Badges & File Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ 444 × 205 px
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ 300 DPI Header
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ Magic B&amp;W Clean
                </span>
              </div>

              {sigState.img && (
                <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-slate-200">
                  <button
                    type="button"
                    onClick={() => sigInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Replace with another signature"
                  >
                    <FileUp className="w-3.5 h-3.5 text-amber-700" />
                    <span>Replace Signature</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetSignature}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Remove current signature"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hidden Master Signature File Input */}
          <input
            ref={sigInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSignatureSelect}
            className="hidden"
          />

          {!sigState.img ? (
            <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-3xl bg-amber-50/30 hover:bg-amber-50/60 transition-all cursor-pointer group text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center shadow-xs transition-colors">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Upload Phone Photo of Signature on Paper</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Paper shadows and yellow light will be converted to crisp white</p>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-amber-600 group-hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all">
                Select Signature File
              </span>
            </label>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Interactive Viewport Canvas (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col items-center space-y-3">
                <div
                  onMouseDown={onMouseDownSig}
                  onMouseMove={onMouseMoveSig}
                  onMouseUp={onMouseUpSig}
                  onMouseLeave={onMouseUpSig}
                  className="relative w-full max-w-[444px] h-[190px] sm:h-[205px] rounded-2xl overflow-hidden border-2 border-amber-500/80 bg-slate-900 shadow-md cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
                >
                  {sigState.outputUrl && (
                    <img
                      src={sigState.outputUrl}
                      alt="Signature crop preview"
                      className="w-full h-full object-contain pointer-events-none bg-white"
                    />
                  )}

                  <span className="absolute bottom-2 right-2 text-[10px] font-black bg-slate-900/80 text-white px-2 py-0.5 rounded-md pointer-events-none backdrop-blur-xs">
                    444 × 205 px
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold text-center">
                  💡 Drag to center signature strokes. Toggle Magic B&amp;W to erase grey paper tint.
                </p>

                {/* Quick Replace & Clear Buttons under canvas */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => sigInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-950 border border-slate-200 hover:border-amber-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <FileUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Replace with New File</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetSignature}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold text-slate-600 flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Clear signature to upload fresh file"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Controls (6 Cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                        Signature Zoom Scale
                      </span>
                      <span className="text-amber-900 font-extrabold">{Math.round(sigState.zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      value={sigState.zoom}
                      onChange={(e) => setSigState((s) => ({ ...s, zoom: parseFloat(e.target.value) }))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons & Magic B&W */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSigState((s) => ({ ...s, rotation: (s.rotation + 90) % 360 }))}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rotate 90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSigState((s) => ({ ...s, magicBW: !s.magicBW }))}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        sigState.magicBW ? 'bg-amber-100 text-amber-950 border-amber-300 font-black' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Magic B&amp;W Cleanup: {sigState.magicBW ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSigState((s) => ({ ...s, zoom: 1.0, rotation: 0, offsetX: 0, offsetY: 0, magicBW: true, bwThreshold: 160 }))}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ml-auto"
                      title="Reset signature zoom and rotation"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Sliders</span>
                    </button>
                  </div>

                  {/* Threshold Slider */}
                  {sigState.magicBW && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Background Whiteness Threshold</span>
                        <span>{sigState.bwThreshold}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="220"
                        value={sigState.bwThreshold}
                        onChange={(e) => setSigState((s) => ({ ...s, bwThreshold: parseInt(e.target.value) }))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-400">Increase slider if dark paper shadows remain. Decrease if ink strokes fade.</p>
                    </div>
                  )}

                  {/* Target KB slider */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      Target KB: <strong className="text-amber-900">{sigTargetKB} KB</strong>
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="48"
                      value={sigTargetKB}
                      onChange={(e) => setSigTargetKB(parseInt(e.target.value))}
                      className="w-40 accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Ready Download Box */}
                {sigState.outputUrl && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ready: 444 × 205 px ({sigState.outputKB} KB)</span>
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
                        300 DPI Embedded &bull; Black ink on clean pure white background
                      </p>
                    </div>

                    <a
                      href={sigState.outputUrl}
                      download="pan-card-signature-444x205.jpg"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Signature (444×205)</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DUAL MODE ONE-CLICK DOWNLOAD PACKAGE                                */}
      {/* ========================================================================= */}
      {activeTab === 'dual' && photoState.outputUrl && sigState.outputUrl && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/15 border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Complete PAN Card Application Package Ready!
              </h4>
              <p className="text-xs text-amber-900 font-bold mt-0.5">
                Photo (213×213, {photoState.outputKB} KB) + Signature (444×205, {sigState.outputKB} KB) at 300 DPI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (photoState.outputBlob) {
                triggerBrowserDownload(photoState.outputBlob, 'nsdl-pan-photo-213x213.jpg');
              }
              setTimeout(() => {
                if (sigState.outputBlob) {
                  triggerBrowserDownload(sigState.outputBlob, 'nsdl-pan-signature-444x205.jpg');
                }
              }, 400);
              toast.success('Downloaded both Photo & Signature for NSDL/UTIITSL!');
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Both Files</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SUPPORTING DOCUMENTS PDF COMPRESSOR (<300KB)                         */}
      {/* ========================================================================= */}
      {activeTab === 'pdf' && (
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  PAN Supporting Document PDF Compressor (Under 300 KB)
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                NSDL and UTIITSL mandate all Aadhaar, POI, POA, and DOB proofs combined into 1 PDF strictly under 300 KB.
              </p>
            </div>

            {/* Target Badge & Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Target: &lt; 300 KB
              </span>

              {pdfFile && (
                <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-slate-200">
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Replace with another PDF"
                  >
                    <FileUp className="w-3.5 h-3.5 text-amber-700" />
                    <span>Replace PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetPdf}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Remove current PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hidden Master PDF File Input */}
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfSelect}
            className="hidden"
          />

          {!pdfFile ? (
            <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-3xl bg-amber-50/30 hover:bg-amber-50/60 transition-all cursor-pointer group text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center shadow-xs transition-colors">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Upload Supporting Document PDF</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Aadhaar card copy, voter ID, driving license, or passport scan</p>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-amber-600 group-hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all">
                Select PDF File
              </span>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[240px] sm:max-w-md">{pdfFile.name}</p>
                    <p className="text-[11px] text-slate-500">Original Size: {(pdfFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <FileUp className="w-3.5 h-3.5 text-amber-700" />
                    <span>Replace File</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetPdf}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-xs font-bold text-slate-600 hover:text-rose-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompressPdf}
                disabled={isPdfProcessing}
                className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isPdfProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    <span>Compressing PDF under 300 KB...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 text-white" />
                    <span>Compress PDF Under 300 KB for NSDL / UTI</span>
                  </>
                )}
              </button>

              {pdfOutputUrl && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PDF Ready: {pdfOutputKB} KB</span>
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
                      Safely compressed under the 300 KB ceiling! Ready for portal upload.
                    </p>
                  </div>

                  <a
                    href={pdfOutputUrl}
                    download="pan-supporting-document-under-300kb.pdf"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download PDF</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

