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
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, PDFImage, rgb } from 'pdf-lib';
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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

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
    setPdfPreviewUrl(null);
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
      const fullPageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setPdfPreviewUrl(fullPageDataUrl);
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
      const rawUrl = e.target?.result as string;
      if (!rawUrl) return;

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            // Standard JPEG with guaranteed SOI header (0xFF, 0xD8)
            const cleanJpg = canvas.toDataURL('image/jpeg', 0.98);
            if (side === 'front') {
              setFrontImage(cleanJpg);
              setFrontRotation(0);
            } else {
              setBackImage(cleanJpg);
              setBackRotation(0);
            }
            toast.success(`${side === 'front' ? 'Front side' : 'Back side'} photo loaded successfully!`);
            return;
          }
        } catch {
          // fallback to rawUrl
        }
        if (side === 'front') {
          setFrontImage(rawUrl);
          setFrontRotation(0);
        } else {
          setBackImage(rawUrl);
          setBackRotation(0);
        }
      };
      img.onerror = () => {
        toast.error('Failed to load image file. Please try another image.');
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // 3. RENDER CANVAS PRINT SHEET
  // -------------------------------------------------------------
  const renderPrintCanvas = useCallback(async () => {
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
      if (arrangement === 'stacked') {
        canvasW = 1011;
        canvasH = 1320;
      } else {
        canvasW = 2067;
        canvasH = 638;
      }
    }

    canvas.width = canvasW;
    canvas.height = canvasH;

    // Fill white paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Filter settings (brightness & contrast)
    ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;

    // Load front & back images if available
    const loadImg = (src: string): Promise<HTMLImageElement> => {
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(img);
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
      rotation: number,
      isBack = false
    ) => {
      ctx.save();
      ctx.translate(x + cardW / 2, y + cardH / 2);
      if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);

      // Clip with rounded corners (3mm radius ~ 32px)
      const r = 32;
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, r);
      ctx.clip();

      if (img && img.naturalWidth > 0) {
        ctx.drawImage(img, -cardW / 2, -cardH / 2, cardW, cardH);
      } else {
        // Aesthetic Realistic Aadhaar Card Wireframe Placeholder
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);

        // Header tricolor band
        ctx.fillStyle = '#F97316'; // Saffron
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, 16);
        ctx.fillStyle = '#16A34A'; // Green
        ctx.fillRect(-cardW / 2, cardH / 2 - 16, cardW, 16);

        // Card Border Outline
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.strokeRect(-cardW / 2, -cardH / 2, cardW, cardH);

        if (!isBack) {
          // Front Card Placeholder
          // Candidate Photo Frame
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.roundRect(-cardW / 2 + 55, -cardH / 2 + 100, 210, 260, 16);
          ctx.fill();
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#94A3B8';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('PHOTO', -cardW / 2 + 160, -cardH / 2 + 240);

          // Card simulated text lines
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.roundRect(-cardW / 2 + 300, -cardH / 2 + 130, 480, 24, 6);
          ctx.roundRect(-cardW / 2 + 300, -cardH / 2 + 175, 360, 20, 6);
          ctx.roundRect(-cardW / 2 + 300, -cardH / 2 + 215, 420, 20, 6);
          ctx.fill();

          // Aadhaar Number Box
          ctx.fillStyle = '#BE123C';
          ctx.font = 'bold 42px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('XXXX  XXXX  XXXX', 0, 165);

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText('Front Side (Candidate Photo & Aadhaar #)', 0, 235);
        } else {
          // Back Card Placeholder
          // QR Code Frame
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.roundRect(cardW / 2 - 280, -cardH / 2 + 100, 225, 225, 16);
          ctx.fill();
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#94A3B8';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('QR CODE', cardW / 2 - 167, -cardH / 2 + 225);

          // Address simulated lines
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.roundRect(-cardW / 2 + 65, -cardH / 2 + 120, 520, 20, 6);
          ctx.roundRect(-cardW / 2 + 65, -cardH / 2 + 160, 560, 20, 6);
          ctx.roundRect(-cardW / 2 + 65, -cardH / 2 + 200, 480, 20, 6);
          ctx.roundRect(-cardW / 2 + 65, -cardH / 2 + 240, 400, 20, 6);
          ctx.fill();

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 26px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Back Side (Address & QR Code)', 0, 235);
        }
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
        renderSingleCard(frontImg, startX, startY, frontRotation, false);
        renderSingleCard(backImg, startX + cardW + gap, startY, backRotation, true);
      } else {
        renderSingleCard(frontImg, startX, startY, frontRotation, false);
        renderSingleCard(backImg, startX, startY + cardH + gap, backRotation, true);
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
      if (arrangement === 'stacked') {
        renderSingleCard(frontImg, 0, 0, frontRotation, false);
        renderSingleCard(backImg, 0, cardH + 40, backRotation, true);
      } else {
        renderSingleCard(frontImg, 0, 0, frontRotation, false);
        renderSingleCard(backImg, cardW + gap, 0, backRotation, true);
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
  // DIRECT PRINT & DOWNLOAD FOR e-AADHAAR PDF (Original PDF Direct Print)
  // -------------------------------------------------------------
  const handleDirectPrintPdf = useCallback(() => {
    if (!pdfPreviewUrl) {
      toast.error('Please upload and unlock your e-Aadhaar PDF first.');
      return;
    }

    trackEvent('download_clicked', { toolSlug: 'aadhaar-card-print', action: 'direct_print_pdf' });

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Print e-Aadhaar PDF</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 0mm;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background: #ffffff;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${pdfPreviewUrl}" />
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.error(err);
        } finally {
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
            } catch {}
          }, 4000);
        }
      }, 500);
    } catch (e) {
      console.error(e);
      window.print();
    }
  }, [pdfPreviewUrl]);

  const handleDownloadUnlockedPdf = useCallback(async () => {
    if (!pdfPreviewUrl) {
      toast.error('Please upload and unlock your e-Aadhaar PDF first.');
      return;
    }

    setIsGenerating(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      // Standard A4 dimensions in pt: 595.28 x 841.89
      const page = pdfDoc.addPage([595.28, 841.89]);
      const img = await embedImageSafely(pdfDoc, pdfPreviewUrl);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Unlocked_${pdfFile?.name ? pdfFile.name.replace(/\.pdf$/i, '') : 'eAadhaar'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Unlocked e-Aadhaar PDF downloaded!');
      trackEvent('download_clicked', { toolSlug: 'aadhaar-card-print', action: 'download_unlocked_pdf' });
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to generate unlocked PDF download.');
    } finally {
      setIsGenerating(false);
    }
  }, [pdfPreviewUrl, pdfFile]);

  // -------------------------------------------------------------
  // 4. PRINT NOW (Direct physical mm print dialog via isolated iframe)
  // -------------------------------------------------------------
  const handlePrintNow = useCallback(() => {
    if (!frontImage && !backImage) {
      toast.error('Please upload your Aadhaar card first.');
      return;
    }

    const canvas = previewCanvasRef.current;
    if (!canvas) {
      toast.error('Canvas preview is not ready yet.');
      return;
    }

    trackEvent('download_clicked', { toolSlug: 'aadhaar-card-print', action: 'print', layout: paperLayout });

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);

      // Create isolated printing iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      const pageSize =
        paperLayout === 'a4'
          ? 'A4 portrait'
          : paperLayout === '4x6'
          ? '4in 6in portrait'
          : 'auto';

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Aadhaar Card Print - FileZenith</title>
            <style>
              @page {
                size: ${pageSize};
                margin: 0mm;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background: #ffffff;
                overflow: hidden;
              }
              .sheet-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
              }
              img {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                display: block;
                margin: 0 auto;
                page-break-inside: avoid;
                break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <div class="sheet-container">
              <img id="printSheetImg" src="${dataUrl}" alt="Aadhaar Card Print Sheet" />
            </div>
          </body>
        </html>
      `);
      doc.close();

      const printImg = doc.getElementById('printSheetImg') as HTMLImageElement | null;
      const doPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 60000);
        }
      };

      if (printImg) {
        if (printImg.complete) {
          setTimeout(doPrint, 150);
        } else {
          printImg.onload = () => setTimeout(doPrint, 150);
          printImg.onerror = () => doPrint();
        }
      } else {
        setTimeout(doPrint, 150);
      }
    } catch {
      window.print();
    }
  }, [frontImage, backImage, paperLayout]);

  // Intercept Ctrl+P / Cmd+P to invoke exact 1-page studio print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (frontImage || backImage) {
          e.preventDefault();
          handlePrintNow();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrintNow, frontImage, backImage]);

  // Helper to safely embed ANY image (PNG, WebP, JPEG, EXIF) without "SOI not found in JPEG"
  const embedImageSafely = async (
    pdfDoc: PDFDocument,
    imageSrc: string,
    rotation = 0
  ): Promise<PDFImage> => {
    return new Promise<PDFImage>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const isRotated90or270 = rotation === 90 || rotation === 270;
          const origW = img.naturalWidth || img.width;
          const origH = img.naturalHeight || img.height;
          const canvasW = isRotated90or270 ? origH : origW;
          const canvasH = isRotated90or270 ? origW : origH;

          const canvas = document.createElement('canvas');
          canvas.width = canvasW;
          canvas.height = canvasH;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get 2D canvas context');

          // Pure white background to prevent dark artifacts
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvasW, canvasH);

          ctx.save();
          ctx.translate(canvasW / 2, canvasH / 2);
          if (rotation !== 0) {
            ctx.rotate((rotation * Math.PI) / 180);
          }
          ctx.drawImage(img, -origW / 2, -origH / 2, origW, origH);
          ctx.restore();

          // Standard JPEG encoding
          try {
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.98);
            const embedded = await pdfDoc.embedJpg(jpegDataUrl);
            resolve(embedded);
            return;
          } catch {
            // Fallback to PNG encoding
            const pngDataUrl = canvas.toDataURL('image/png');
            const embeddedPng = await pdfDoc.embedPng(pngDataUrl);
            resolve(embeddedPng);
          }
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load card image for PDF'));
      img.src = imageSrc;
    });
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

      // Embed Front and Back images safely without "SOI not found in JPEG"
      const frontJpg = frontImage ? await embedImageSafely(pdfDoc, frontImage, frontRotation) : null;
      const backJpg = backImage ? await embedImageSafely(pdfDoc, backImage, backRotation) : null;

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
    <div className="space-y-8 text-slate-900 print:space-y-0 print:m-0 print:p-0">
      {/* Main Studio Control Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 print:hidden">
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
            {pdfPreviewUrl ? (
              /* Full Unlocked e-Aadhaar PDF Document Preview (Direct Print Same) */
              <div className="p-4 sm:p-6 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-5 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                          e-Aadhaar PDF Unlocked & Decrypted
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Ready to Print
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 truncate max-w-[240px] sm:max-w-md">
                        {pdfFile ? pdfFile.name : 'e-Aadhaar PDF'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Upload Another PDF</span>
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
                  </div>
                </div>

                {/* Direct Action Buttons on Top for Instant Access */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDirectPrintPdf}
                    className="flex-1 min-w-[220px] py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Direct Print e-Aadhaar (Same as PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadUnlockedPdf}
                    disabled={isGenerating}
                    className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FileDown className="w-4 h-4 text-white" />
                    <span>Download Unlocked PDF (No Password)</span>
                  </button>
                </div>

                {/* Entire PDF Page Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-rose-600" /> Full e-Aadhaar Document Preview
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      Standard A4 Official Print Scale
                    </span>
                  </div>

                  <div className="relative w-full max-h-[580px] sm:max-h-[700px] overflow-y-auto bg-slate-100/90 rounded-2xl p-3 sm:p-6 border border-slate-200 flex justify-center shadow-inner">
                    <img
                      src={pdfPreviewUrl}
                      alt="Full Unlocked e-Aadhaar PDF"
                      className="w-full max-w-[620px] h-auto object-contain bg-white rounded-xl shadow-xl border border-slate-300"
                    />
                  </div>
                </div>

                {/* Bottom Direct Print Button */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDirectPrintPdf}
                    className="flex-1 min-w-[200px] py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Direct Print Now (1-Click A4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadUnlockedPdf}
                    disabled={isGenerating}
                    className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FileDown className="w-4 h-4 text-white" />
                    <span>Save Decrypted PDF</span>
                  </button>
                </div>
              </div>
            ) : isPasswordRequired ? (
              /* Password Unlock Box */
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                        e-Aadhaar PDF Password Required
                      </h4>
                      {pdfFile && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {pdfFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-amber-800 mt-1">
                      Standard format: First 4 letters of your name in <strong>CAPITAL</strong> + <strong>Year of Birth (YYYY)</strong>.
                      <br />Example: Name is <em>ANIL KUMAR</em> born in <em>1995</em> → Password is <strong className="font-mono bg-amber-200 px-1.5 py-0.5 rounded text-amber-950 font-bold">ANIL1995</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="password"
                    placeholder="Enter e.g. ANIL1995"
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value.toUpperCase())}
                    className="flex-1 p-3.5 rounded-xl border border-amber-300 bg-white font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
                    autoFocus
                  />
                  <button
                    onClick={() => pdfFile && processPdf(pdfFile, pdfPassword)}
                    disabled={!pdfPassword || isDecrypting}
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isDecrypting ? 'Decrypting...' : 'Unlock & Crop Card'}</span>
                  </button>
                  <label className="px-4 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-amber-300 flex items-center justify-center cursor-pointer transition-colors">
                    <span>Change File</span>
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
                </div>
              </div>
            ) : (
              /* Initial Upload Dropzone */
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-rose-200 hover:border-rose-500 bg-rose-50/20 hover:bg-rose-50/40 rounded-2xl cursor-pointer transition-all group">
                <Upload className="w-9 h-9 text-rose-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-sm font-extrabold text-slate-800 text-center">
                  {pdfFile ? pdfFile.name : 'Click or Drag & Drop e-Aadhaar PDF'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Downloaded from eaadhaar.uidai.gov.in (Password protected supported)
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
            )}
          </div>
        )}

        {/* Mode 2: Front and Back Photo Scans */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Front Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <span>1. Front Side (Candidate Photo & ID)</span>
                  {frontImage && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Loaded
                    </span>
                  )}
                </label>
                {frontImage && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFrontRotation((r) => (r + 90) % 360)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 transition-colors"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Rotate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFrontImage(null);
                        setFrontRotation(0);
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Remove Front Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {frontImage ? (
                <div className="rounded-2xl border-2 border-emerald-200 bg-slate-900/5 p-3 space-y-2">
                  <div className="relative w-full aspect-[1.586/1] bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 shadow-sm group">
                    <img
                      src={frontImage}
                      alt="Candidate Front Photo & Aadhaar Card"
                      className="w-full h-full object-contain transition-transform duration-200"
                      style={{ transform: `rotate(${frontRotation}deg)` }}
                    />
                    {/* Hover Overlay */}
                    <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white cursor-pointer backdrop-blur-xs">
                      <Upload className="w-6 h-6 text-white" />
                      <span className="text-xs font-bold">Click to Replace Candidate Photo</span>
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
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Candidate Photo Visible
                    </span>
                    <label className="font-extrabold text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Change Photo
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
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/20 rounded-2xl cursor-pointer min-h-[160px] transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-2 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-slate-800 text-center">
                    Upload Candidate Front Photo
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 text-center">
                    Shows Candidate portrait photo, name, and Aadhaar number
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
              )}
            </div>

            {/* Back Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <span>2. Back Side (Address & QR Code)</span>
                  {backImage && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Loaded
                    </span>
                  )}
                </label>
                {backImage && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBackRotation((r) => (r + 90) % 360)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 transition-colors"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Rotate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBackImage(null);
                        setBackRotation(0);
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Remove Back Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {backImage ? (
                <div className="rounded-2xl border-2 border-emerald-200 bg-slate-900/5 p-3 space-y-2">
                  <div className="relative w-full aspect-[1.586/1] bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 shadow-sm group">
                    <img
                      src={backImage}
                      alt="Candidate Aadhaar Back Side"
                      className="w-full h-full object-contain transition-transform duration-200"
                      style={{ transform: `rotate(${backRotation}deg)` }}
                    />
                    {/* Hover Overlay */}
                    <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white cursor-pointer backdrop-blur-xs">
                      <Upload className="w-6 h-6 text-white" />
                      <span className="text-xs font-bold">Click to Replace Back Side</span>
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
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Address & QR Code Visible
                    </span>
                    <label className="font-extrabold text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Change Photo
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
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/20 rounded-2xl cursor-pointer min-h-[160px] transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-2 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-slate-800 text-center">
                    Upload Back Side (Address & QR)
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 text-center">
                    Shows official QR code and residential address
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
              )}
            </div>
          </div>
        )}

      </div>

      {/* Containers 2 & 3: Live Print Sheet Preview and ID-1 Formatting (Shown ONLY in Upload Photos / Scans mode) */}
      {activeTab === 'images' && (
        <>
          {/* Container 2: Live Interactive Print Sheet Preview (Placed DIRECTLY ABOVE Formatting so users see changes in real-time) */}
          <div className="space-y-3 print:space-y-0 print:m-0 print:p-0 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Live Print Sheet Preview ({paperLayout.toUpperCase()} Physical Scale)
                </h3>
                {frontImage || backImage ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Candidate Card Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    Interactive Layout Guide
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-400 hidden sm:inline">
                  Card Size: {CARD_WIDTH_MM} × {CARD_HEIGHT_MM} mm
                </span>
                <span className="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {paperLayout.toUpperCase()} • {arrangement === 'sideBySide' ? 'Side-by-Side' : 'Stacked'} {paperLayout === 'a4' ? `• ${copies} ${copies === 1 ? 'Copy' : 'Copies'}` : ''}
                </span>
              </div>
            </div>

            <div
              id="printable-aadhaar-canvas"
              className="p-4 sm:p-8 bg-slate-100/90 rounded-3xl border border-slate-200 flex items-center justify-center overflow-auto shadow-inner print:p-0 print:m-0 print:bg-transparent print:border-none print:shadow-none print:rounded-none"
            >
              <div className="bg-white shadow-2xl rounded-xl p-2 max-w-full overflow-hidden border border-slate-300 print:p-0 print:m-0 print:bg-transparent print:border-none print:shadow-none print:rounded-none">
                <canvas
                  ref={previewCanvasRef}
                  className="max-w-full h-auto object-contain block mx-auto print:w-full print:max-w-full print:h-auto"
                  style={{ maxHeight: '560px' }}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium text-center print:hidden">
              💡 Live sheet preview above — adjust paper layout, alignment, copies, and brightness sliders below to see changes instantly.
            </p>
          </div>

          {/* Container 3: Print Configuration Controls & Action Buttons (Directly below preview) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 print:hidden animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span>Print Sheet Settings & Formatting</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                  Changes reflect live on sheet preview above
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPaperLayout('a4');
                    setArrangement('sideBySide');
                    setCopies(1);
                    setShowCutBorder(true);
                    setBrightness(0);
                    setContrast(0);
                    toast.info('Formatting reset to default');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  title="Reset formatting to default"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Formatting</span>
                </button>
              </div>
            </div>

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
        </>
      )}
    </div>
  );
}
