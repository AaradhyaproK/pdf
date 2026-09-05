'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Printer,
  FileDown,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  RotateCw,
  Sparkles,
  Sliders,
  Copy,
  Layers,
  Scissors,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb } from 'pdf-lib';
import { trackEvent } from '@/lib/analytics';

// ISO/IEC 7810 ID-1 standard card dimensions in mm
// 85.60 mm x 53.98 mm (~85.6 mm x 54 mm)
const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54.0;
const CARD_ASPECT = CARD_WIDTH_MM / CARD_HEIGHT_MM; // ~1.5852

// 1 mm = 2.83465 points in PDF standard
const MM_TO_PT = 2.83465;

export function AadhaarPrintStudio() {
  const [activeTab, setActiveTab] = useState<'pdf' | 'images'>('pdf');

  // PDF Mode states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPassword, setPdfPassword] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [pdfRenderedPage, setPdfRenderedPage] = useState<HTMLCanvasElement | null>(null);

  // Images Mode states
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontRotation, setFrontRotation] = useState(0);
  const [backRotation, setBackRotation] = useState(0);

  // Print settings
  const [paperLayout, setPaperLayout] = useState<'a4' | '4x6' | 'pvc'>('a4');
  const [arrangement, setArrangement] = useState<'sideBySide' | 'stacked'>('sideBySide');
  const [copies, setCopies] = useState<1 | 2 | 5>(1);
  const [showCutBorder, setShowCutBorder] = useState(true);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  // Processing & status
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Preview canvas ref
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // -------------------------------------------------------------
  // 1. PDF PROCESSING (e-Aadhaar unlock & render)
  // -------------------------------------------------------------
  const handlePdfUpload = async (file: File) => {
    setPdfFile(file);
    setIsPasswordRequired(false);
    setPdfPassword('');
    setPdfRenderedPage(null);
    setStatusMessage(null);
    await processPdf(file, '');
  };

  const processPdf = async (file: File, passwordAttempt: string) => {
    setIsDecrypting(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: buffer,
        password: passwordAttempt || undefined,
      });

      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      // Render at high DPI (scale 3.0)
      const viewport = page.getViewport({ scale: 3.0 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // @ts-ignore
      await page.render({ canvasContext: ctx, viewport }).promise;

      setPdfRenderedPage(canvas);
      setIsPasswordRequired(false);
      toast.success('e-Aadhaar PDF unlocked successfully!');
      trackEvent('image_uploaded', { toolSlug: 'aadhaar-card-print', action: 'pdf_unlocked' });

      // Automatically crop Front & Back from bottom of Page 1
      autoCropAadhaarCards(canvas);
    } catch (err: any) {
      if (err?.name === 'PasswordException' || err?.message?.toLowerCase().includes('password')) {
        setIsPasswordRequired(true);
        setStatusMessage('This e-Aadhaar PDF is password protected. Enter password below to unlock.');
        toast.info('Please enter your e-Aadhaar PDF password.');
      } else {
        toast.error(err?.message || 'Failed to process PDF.');
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  // e-Aadhaar bottom card auto-cropper
  const autoCropAadhaarCards = (pageCanvas: HTMLCanvasElement) => {
    try {
      const W = pageCanvas.width;
      const H = pageCanvas.height;

      // In official UIDAI e-Aadhaar, the card portion is located at the bottom ~28% to 35% of page 1.
      // Front is on the left half, Back is on the right half.
      const cardStartY = Math.round(H * 0.655);
      const cardTotalHeight = Math.round(H * 0.325);

      const sideWidth = Math.round(W * 0.445);
      const frontStartX = Math.round(W * 0.052);
      const backStartX = Math.round(W * 0.505);

      // Front Canvas
      const frontC = document.createElement('canvas');
      frontC.width = sideWidth;
      frontC.height = cardTotalHeight;
      const fCtx = frontC.getContext('2d');
      if (fCtx) {
        fCtx.drawImage(pageCanvas, frontStartX, cardStartY, sideWidth, cardTotalHeight, 0, 0, sideWidth, cardTotalHeight);
        setFrontImage(frontC.toDataURL('image/jpeg', 0.98));
      }

      // Back Canvas
      const backC = document.createElement('canvas');
      backC.width = sideWidth;
      backC.height = cardTotalHeight;
      const bCtx = backC.getContext('2d');
      if (bCtx) {
        bCtx.drawImage(pageCanvas, backStartX, cardStartY, sideWidth, cardTotalHeight, 0, 0, sideWidth, cardTotalHeight);
        setBackImage(backC.toDataURL('image/jpeg', 0.98));
      }
    } catch (e) {
      console.error('Auto crop error:', e);
    }
  };

  // -------------------------------------------------------------
  // 2. IMAGE UPLOADS
  // -------------------------------------------------------------
  const handleImageFile = (file: File, side: 'front' | 'back') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (side === 'front') setFrontImage(e.target?.result as string);
      else setBackImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // 3. RENDER CANVAS PRINT SHEET
  // -------------------------------------------------------------
  const renderPrintCanvas = useCallback(async () => {
    if (!frontImage && !backImage) return;

    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard 300 DPI Canvas Dimensions
    // A4: 210 x 297 mm -> ~2480 x 3508 pixels at 300 DPI
    // 4x6: 101.6 x 152.4 mm -> ~1200 x 1800 pixels at 300 DPI
    // PVC: 85.6 x 54.0 mm -> ~1011 x 638 pixels at 300 DPI
    let canvasW = 2480;
    let canvasH = 3508;

    if (paperLayout === '4x6') {
      canvasW = 1200;
      canvasH = 1800;
    } else if (paperLayout === 'pvc') {
      canvasW = 1011;
      canvasH = arrangement === 'stacked' ? 1320 : 638;
    }

    canvas.width = canvasW;
    canvas.height = canvasH;

    // Fill white paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Filter settings (brightness & contrast)
    ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;

    // Load front & back images
    const loadImg = (src: string): Promise<HTMLImageElement> => {
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = src;
      });
    };

    const frontImg = frontImage ? await loadImg(frontImage) : null;
    const backImg = backImage ? await loadImg(backImage) : null;

    // Card pixel dimensions at 300 DPI:
    // 85.6 mm * (300 / 25.4) = ~1011 px
    // 54.0 mm * (300 / 25.4) = ~638 px
    const cardW = 1011;
    const cardH = 638;
    const gap = 45; // ~3.8 mm gap

    const renderSingleCard = (
      img: HTMLImageElement | null,
      x: number,
      y: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x + cardW / 2, y + cardH / 2);
      if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);

      // Clip with rounded corners (3mm radius ~ 35px)
      const r = 32;
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, r);
      ctx.clip();

      if (img) {
        ctx.drawImage(img, -cardW / 2, -cardH / 2, cardW, cardH);
      } else {
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Side Not Uploaded', 0, 0);
      }
      ctx.restore();

      // Draw Cut Outline / Border
      if (showCutBorder) {
        ctx.save();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 32);
        ctx.stroke();

        // Scissors guide dashed line between cards
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.restore();
      }
    };

    // Calculate layout positions
    const renderSet = (startX: number, startY: number) => {
      if (arrangement === 'sideBySide') {
        renderSingleCard(frontImg, startX, startY, frontRotation);
        renderSingleCard(backImg, startX + cardW + gap, startY, backRotation);
      } else {
        renderSingleCard(frontImg, startX, startY, frontRotation);
        renderSingleCard(backImg, startX, startY + cardH + gap, backRotation);
      }
    };

    if (paperLayout === 'a4') {
      const topMargin = 160;
      const pairWidth = cardW * 2 + gap;
      const leftMargin = Math.round((canvasW - pairWidth) / 2);

      for (let i = 0; i < copies; i++) {
        const rowY = topMargin + i * (arrangement === 'sideBySide' ? cardH + 120 : (cardH * 2 + gap + 100));
        if (rowY + cardH < canvasH) {
          renderSet(leftMargin, rowY);
        }
      }
    } else if (paperLayout === '4x6') {
      const pairWidth = arrangement === 'sideBySide' ? cardW * 2 + gap : cardW;
      const leftMargin = Math.max(30, Math.round((canvasW - pairWidth) / 2));
      renderSet(leftMargin, 120);
    } else {
      // PVC Card size
      renderSingleCard(frontImg, 0, 0, frontRotation);
      if (arrangement === 'stacked') {
        renderSingleCard(backImg, 0, cardH + 40, backRotation);
      }
    }

    ctx.filter = 'none';
  }, [
    frontImage,
    backImage,
    frontRotation,
    backRotation,
    paperLayout,
    arrangement,
    copies,
    showCutBorder,
    brightness,
    contrast,
  ]);

  useEffect(() => {
    renderPrintCanvas();
  }, [renderPrintCanvas]);

  // -------------------------------------------------------------
  // 4. PRINT NOW (Direct physical mm print dialog)
  // -------------------------------------------------------------
  const handlePrintNow = () => {
    if (!frontImage && !backImage) {
      toast.error('Please upload your Aadhaar card first.');
      return;
    }
    trackEvent('download_clicked', { toolSlug: 'aadhaar-card-print', action: 'print', layout: paperLayout });
    window.print();
  };

  // -------------------------------------------------------------
  // 5. DOWNLOAD HIGH-RES A4 PDF (via pdf-lib)
  // -------------------------------------------------------------
  const handleDownloadPdf = async () => {
    if (!frontImage && !backImage) {
      toast.error('Please upload your Aadhaar card first.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating print-ready PDF...');

    try {
      const pdfDoc = await PDFDocument.create();

      // A4 in PDF points: 595.28 x 841.89 points
      const page = pdfDoc.addPage([595.28, 841.89]);
      const { width: pageW, height: pageH } = page.getSize();

      // Standard card dimensions in PDF points
      const cardW_pt = CARD_WIDTH_MM * MM_TO_PT; // ~242.6 pt
      const cardH_pt = CARD_HEIGHT_MM * MM_TO_PT; // ~153.1 pt
      const gap_pt = 4 * MM_TO_PT; // ~11.3 pt gap

      // Embed Front image
      const frontJpg = frontImage ? await pdfDoc.embedJpg(frontImage) : null;
      const backJpg = backImage ? await pdfDoc.embedJpg(backImage) : null;

      const topY = pageH - 50 - cardH_pt; // 50 pt from top margin

      if (arrangement === 'sideBySide') {
        const totalPairW = cardW_pt * 2 + gap_pt;
        const startX = (pageW - totalPairW) / 2;

        if (frontJpg) {
          page.drawImage(frontJpg, {
            x: startX,
            y: topY,
            width: cardW_pt,
            height: cardH_pt,
          });
        }
        if (backJpg) {
          page.drawImage(backJpg, {
            x: startX + cardW_pt + gap_pt,
            y: topY,
            width: cardW_pt,
            height: cardH_pt,
          });
        }

        // Draw Cutting Border Outlines
        if (showCutBorder) {
          page.drawRectangle({
            x: startX,
            y: topY,
            width: cardW_pt,
            height: cardH_pt,
            borderColor: rgb(0.1, 0.1, 0.1),
            borderWidth: 0.75,
          });
          page.drawRectangle({
            x: startX + cardW_pt + gap_pt,
            y: topY,
            width: cardW_pt,
            height: cardH_pt,
            borderColor: rgb(0.1, 0.1, 0.1),
            borderWidth: 0.75,
          });
        }
      } else {
        const startX = (pageW - cardW_pt) / 2;
        if (frontJpg) {
          page.drawImage(frontJpg, {
            x: startX,
            y: topY,
            width: cardW_pt,
            height: cardH_pt,
          });
        }
        if (backJpg) {
          page.drawImage(backJpg, {
            x: startX,
            y: topY - cardH_pt - gap_pt,
            width: cardW_pt,
            height: cardH_pt,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aadhaar-card-print-ready.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Print-ready PDF downloaded successfully!', { id: toastId });
      trackEvent('download_clicked', { toolSlug: 'aadhaar-card-print', action: 'pdf_download', copies, layout: paperLayout });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create PDF.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  // -------------------------------------------------------------
  // 6. DOWNLOAD HIGH-RES IMAGE
  // -------------------------------------------------------------
  const handleDownloadImage = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    a.download = `aadhaar-print-${paperLayout}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloaded print image successfully!');
  };

  return (
    <div className="space-y-8 text-slate-900">
      {/* Printable Area Wrapper for window.print() */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-aadhaar-canvas, #printable-aadhaar-canvas * {
            visibility: visible !important;
          }
          #printable-aadhaar-canvas {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #printable-aadhaar-canvas canvas {
            max-width: 100% !important;
            height: auto !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Main Studio Control Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 font-extrabold text-xs">
              e-Aadhaar & PVC ID Ready
            </span>
            <span className="text-xs font-bold text-slate-500">Exact 85.6 × 54.0 mm ISO ID-1 Standard</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Private (No Server Uploads)</span>
          </div>
        </div>

        {/* Client-Side Privacy Notice */}
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs font-bold text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero Server Upload:</strong> Your Aadhaar PDF, password, and biometric details never leave your browser. Decryption, card extraction, and A4 alignment happen 100% locally.
          </span>
        </div>

        {/* Upload Mode Selector */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pdf' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Upload e-Aadhaar PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'images' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Photos / Scans</span>
          </button>
        </div>

        {/* Mode 1: PDF Dropzone & Password Prompt */}
        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-rose-200 hover:border-rose-500 bg-rose-50/20 hover:bg-rose-50/40 rounded-2xl cursor-pointer transition-all group">
              <Upload className="w-9 h-9 text-rose-500 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-sm font-extrabold text-slate-800 text-center">
                {pdfFile ? pdfFile.name : 'Click or Drag & Drop e-Aadhaar PDF'}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Downloaded from eaadhaar.uidai.gov.in
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePdfUpload(f);
                }}
              />
            </label>

            {/* Password Unlock Box */}
            {isPasswordRequired && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                      e-Aadhaar PDF Password Required
                    </h4>
                    <p className="text-xs font-medium text-amber-800 mt-0.5">
                      Standard format: First 4 letters of your name in <strong>CAPITAL</strong> + <strong>Year of Birth (YYYY)</strong>.
                      <br />Example: Name is <em>ANIL KUMAR</em> born in <em>1995</em> → Password is <strong className="font-mono bg-amber-100 px-1 py-0.5 rounded">ANIL1995</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    placeholder="Enter e.g. ANIL1995"
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value.toUpperCase())}
                    className="flex-1 p-3.5 rounded-xl border border-amber-300 bg-white font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    onClick={() => pdfFile && processPdf(pdfFile, pdfPassword)}
                    disabled={!pdfPassword || isDecrypting}
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isDecrypting ? 'Decrypting...' : 'Unlock & Crop Card'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Front and Back Photo Scans */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Front Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-700">1. Front Side (Photo & Aadhaar No.)</label>
                {frontImage && (
                  <button
                    onClick={() => setFrontRotation((r) => (r + 90) % 360)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Rotate
                  </button>
                )}
              </div>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/20 rounded-2xl cursor-pointer min-h-[140px] transition-all group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-rose-600 mb-1" />
                <span className="text-xs font-bold text-slate-700 text-center">
                  {frontImage ? 'Change Front Photo' : 'Upload Front Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f, 'front');
                  }}
                />
              </label>
            </div>

            {/* Back Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-700">2. Back Side (Address & QR Code)</label>
                {backImage && (
                  <button
                    onClick={() => setBackRotation((r) => (r + 90) % 360)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Rotate
                  </button>
                )}
              </div>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/20 rounded-2xl cursor-pointer min-h-[140px] transition-all group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-rose-600 mb-1" />
                <span className="text-xs font-bold text-slate-700 text-center">
                  {backImage ? 'Change Back Photo' : 'Upload Back Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f, 'back');
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Print Configuration Controls */}
        {(frontImage || backImage) && (
          <div className="pt-6 border-t border-slate-200 space-y-5 animate-in fade-in">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Print Sheet Settings & Formatting
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Paper Layout */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Paper Size Layout</label>
                <select
                  value={paperLayout}
                  onChange={(e) => setPaperLayout(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="a4">Standard A4 Sheet (Lamination Ready)</option>
                  <option value="4x6">4×6 inch Photo Glossy Paper</option>
                  <option value="pvc">Direct PVC Card Tray (85.6 × 54 mm)</option>
                </select>
              </div>

              {/* Card Alignment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Card Alignment</label>
                <select
                  value={arrangement}
                  onChange={(e) => setArrangement(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="sideBySide">Side by Side (Front & Back)</option>
                  <option value="stacked">Stacked Vertically</option>
                </select>
              </div>

              {/* Number of Copies */}
              {paperLayout === 'a4' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">Copies on A4 Page</label>
                  <select
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value) as any)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value={1}>1 Copy (Top Aligned)</option>
                    <option value={2}>2 Copies (Family Duplicate)</option>
                    <option value={5}>5 Copies (Cyber Cafe Batch Sheet)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Enhancements Slider and Border Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="cutBorderToggle"
                  checked={showCutBorder}
                  onChange={(e) => setShowCutBorder(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="cutBorderToggle" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-slate-600" />
                  Show Scissors Cut Boundary
                </label>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Brightness</span>
                  <span>{brightness > 0 ? `+${brightness}` : brightness}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Contrast</span>
                  <span>{contrast > 0 ? `+${contrast}` : contrast}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handlePrintNow}
                className="flex-1 min-w-[200px] py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                <span>Print Now (1-Click A4 / PVC)</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Download Print-Ready PDF</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-slate-600" />
                <span>Save 300 DPI Image</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Interactive Print Sheet Preview */}
      {(frontImage || backImage) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-600" />
              Live Print Sheet Preview ({paperLayout.toUpperCase()} Physical Scale)
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              Exact Size: {CARD_WIDTH_MM} mm × {CARD_HEIGHT_MM} mm
            </span>
          </div>

          <div
            id="printable-aadhaar-canvas"
            className="p-6 sm:p-10 bg-slate-100/80 rounded-3xl border border-slate-200 flex items-center justify-center overflow-auto shadow-inner"
          >
            <div className="bg-white shadow-2xl rounded-lg p-2 max-w-full overflow-hidden border border-slate-300">
              <canvas
                ref={previewCanvasRef}
                className="max-w-full h-auto object-contain block mx-auto"
                style={{ maxHeight: '720px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
