'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  PenTool,
  Type,
  UploadCloud,
  Download,
  RotateCcw,
  RotateCw,
  Undo2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  FileCheck,
  Printer,
  Stamp,
  Maximize2,
  FileText,
  Info,
  RefreshCw,
  Palette,
  FileUp,
  X,
  ExternalLink,
  Smartphone,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { triggerBrowserDownload } from '@/lib/download-helper';

// Binary 300 DPI Injection for PAN Card NSDL/UTIITSL compliance
function inject300DpiJpeg(buffer: Uint8Array): Uint8Array {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (view.getUint16(0) !== 0xffd8) return buffer;

  if (view.getUint16(2) === 0xffe0) {
    if (view.getUint32(6) === 0x4a464946 && view.getUint8(10) === 0) {
      view.setUint8(13, 1);
      view.setUint16(14, 300);
      view.setUint16(16, 300);
      return buffer;
    }
  }

  const jfifHeader = new Uint8Array([
    0xff, 0xe0, 0x00, 0x10,
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x02,
    0x01,
    0x01, 0x2c,
    0x01, 0x2c,
    0x00, 0x00,
  ]);

  const newBuf = new Uint8Array(buffer.length + jfifHeader.length);
  newBuf.set(buffer.subarray(0, 2), 0);
  newBuf.set(jfifHeader, 2);
  newBuf.set(buffer.subarray(2), 2 + jfifHeader.length);
  return newBuf;
}

type TabType = 'draw' | 'type' | 'upload';
type PenStyle = 'fountain' | 'ballpoint' | 'calligraphy' | 'marker';

interface Point {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
  style: PenStyle;
}

interface DownloadSuccessState {
  isOpen: boolean;
  fileName: string;
  formatTitle: string;
  formatBadge: string;
  fileSizeKb: number | null;
  downloadUrl: string | null;
  fileBlob: Blob | null;
}

const INK_COLORS = [
  { name: 'Pure Black', hex: '#000000', label: 'Black' },
  { name: 'Royal Navy', hex: '#002060', label: 'Navy' },
  { name: 'Ballpoint Blue', hex: '#0052cc', label: 'Blue' },
  { name: 'Crimson Red', hex: '#dc2626', label: 'Red' },
  { name: 'Forest Green', hex: '#16a34a', label: 'Green' },
];

const CURSIVE_FONTS = [
  {
    id: 'great-vibes',
    name: 'Royal Elegance',
    fontFamily: '"Great Vibes", cursive, "Brush Script MT", "Segoe Script"',
    author: 'Calligraphy Master',
  },
  {
    id: 'dancing-script',
    name: 'Modern Flow',
    fontFamily: '"Dancing Script", cursive, "Segoe Script"',
    author: 'Contemporary Pen',
  },
  {
    id: 'caveat',
    name: 'Authentic Pen',
    fontFamily: '"Caveat", cursive, "Comic Sans MS"',
    author: 'Casual Hand',
  },
  {
    id: 'sacramento',
    name: 'Executive Script',
    fontFamily: '"Sacramento", cursive, "Brush Script MT"',
    author: 'Formal Contract',
  },
  {
    id: 'satisfy',
    name: 'Brush Autograph',
    fontFamily: '"Satisfy", cursive, "Apple Chancery"',
    author: 'Bold Artist',
  },
  {
    id: 'pacific',
    name: 'Smooth Marker',
    fontFamily: '"Pacifico", cursive, "Segoe Print"',
    author: 'Rounded Signature',
  },
  {
    id: 'alex-brush',
    name: 'Classic Legal',
    fontFamily: '"Alex Brush", cursive, "Lucida Handwriting"',
    author: 'Diplomatic Cursive',
  },
  {
    id: 'homemade-apple',
    name: 'Physician Scribble',
    fontFamily: '"Homemade Apple", cursive, "Apple Chancery"',
    author: 'Expressive Stroke',
  },
];

export function SignatureMakerStudio() {
  const [activeTab, setActiveTab] = useState<TabType>('draw');

  // Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastDprRef = useRef<number>(2);

  // Pen Configuration
  const [penColor, setPenColor] = useState<string>('#000000');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [penStyle, setPenStyle] = useState<PenStyle>('fountain');
  const [showGuideLine, setShowGuideLine] = useState<boolean>(true);

  // Type Signature State
  const [typedName, setTypedName] = useState<string>('Aaradhya Pathak');
  const [selectedFontIndex, setSelectedFontIndex] = useState<number>(0);
  const [typeFontSize, setTypeFontSize] = useState<number>(44);
  const [typeSlant, setTypeSlant] = useState<number>(0);

  // Upload Clean Paper Signature State
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const paperCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [uploadedImg, setUploadedImg] = useState<HTMLImageElement | null>(null);
  const [bwThreshold, setBwThreshold] = useState<number>(165);
  const [paperPreviewBg, setPaperPreviewBg] = useState<'transparent' | 'white' | 'original'>('transparent');
  const [paperRotation, setPaperRotation] = useState<number>(0);

  // Clipboard Copied Indicator
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Success Download Modal State
  const [successModal, setSuccessModal] = useState<DownloadSuccessState>({
    isOpen: false,
    fileName: '',
    formatTitle: '',
    formatBadge: '',
    fileSizeKb: null,
    downloadUrl: null,
    fileBlob: null,
  });

  // Load Google Fonts into document head dynamically for 100% cursive fidelity
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const linkId = 'signature-maker-google-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@600&family=Dancing+Script:wght@600&family=Great+Vibes&family=Homemade+Apple&family=Pacifico&family=Sacramento&family=Satisfy&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  // Trigger celebration confetti
  const fireConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch {}
  }, []);

  // Setup Canvas with High DPI Scaling (Retina / OLED crispness)
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.max(2, window.devicePixelRatio || 1) : 2;
    lastDprRef.current = dpr;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 700;
    const height = rect.height || 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    redrawCanvas();
  }, [strokes]);

  // Redraw all strokes on canvas with smooth Bezier interpolation
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = lastDprRef.current;
    const logicalW = canvas.width / dpr;
    const logicalH = canvas.height / dpr;

    ctx.clearRect(0, 0, logicalW, logicalH);

    // Render ruled baseline guide if enabled
    if (showGuideLine) {
      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      const baselineY = logicalH * 0.72;
      ctx.beginPath();
      ctx.moveTo(24, baselineY);
      ctx.lineTo(logicalW - 24, baselineY);
      ctx.stroke();
      ctx.restore();
    }

    // Render strokes with smooth quadratic Bezier curve math
    strokes.forEach((stroke) => {
      const pts = stroke.points;
      if (pts.length === 0) return;

      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, stroke.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // Smooth midpoint curve rendering
      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];

        // Velocity & pressure-sensitive line width variation for organic hand signature feel
        let dynamicWidth = stroke.width;
        if (p1.pressure !== undefined && p1.pressure > 0.05) {
          dynamicWidth = stroke.width * (0.6 + p1.pressure * 0.8);
        } else if (p1.time && p2.time) {
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const dt = Math.max(1, p2.time - p1.time);
          const velocity = dist / dt;
          // Faster strokes are slightly thinner, mimicking fountain ink flow
          const taper = Math.max(0.7, Math.min(1.3, 1.2 - velocity * 0.15));
          dynamicWidth = stroke.width * taper;
        }

        ctx.lineWidth = dynamicWidth;

        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;

        ctx.beginPath();
        if (i === 0) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(xc, yc);
        } else {
          const prev = pts[i - 1];
          const prevXc = (prev.x + p1.x) / 2;
          const prevYc = (prev.y + p1.y) / 2;
          ctx.moveTo(prevXc, prevYc);
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        }
        ctx.stroke();
      }

      // Final tail segment
      if (pts.length > 2) {
        const last = pts[pts.length - 1];
        const secondLast = pts[pts.length - 2];
        const midX = (secondLast.x + last.x) / 2;
        const midY = (secondLast.y + last.y) / 2;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }

      ctx.restore();
    });
  }, [strokes, showGuideLine]);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  // Real-time render for Paper Signature Live Preview with Shadow Stripping
  const renderPaperPreview = useCallback(() => {
    const canvas = paperCanvasRef.current;
    if (!canvas || !uploadedImg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isRotated = paperRotation % 180 !== 0;
    const srcW = isRotated ? uploadedImg.naturalHeight : uploadedImg.naturalWidth;
    const srcH = isRotated ? uploadedImg.naturalWidth : uploadedImg.naturalHeight;

    const maxPreviewW = 900;
    const maxPreviewH = 400;
    const scale = Math.min(1, maxPreviewW / srcW, maxPreviewH / srcH);
    const targetW = Math.max(10, Math.round(srcW * scale));
    const targetH = Math.max(10, Math.round(srcH * scale));

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.clearRect(0, 0, targetW, targetH);

    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((paperRotation * Math.PI) / 180);
    const drawW = isRotated ? targetH : targetW;
    const drawH = isRotated ? targetW : targetH;
    ctx.drawImage(uploadedImg, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    if (paperPreviewBg === 'original') {
      return;
    }

    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (l > bwThreshold) {
        if (paperPreviewBg === 'transparent') {
          data[i + 3] = 0;
        } else {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        }
      } else {
        data[i] = 15;
        data[i + 1] = 23;
        data[i + 2] = 42;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [uploadedImg, bwThreshold, paperPreviewBg, paperRotation]);

  useEffect(() => {
    if (activeTab === 'upload' && uploadedImg) {
      renderPaperPreview();
    }
  }, [activeTab, uploadedImg, bwThreshold, paperPreviewBg, paperRotation, renderPaperPreview]);

  // Coordinate normalizer for pointer events (mouse, touch, stylus)
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure > 0 ? e.pressure : 0.5,
      time: Date.now(),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
    isDrawingRef.current = true;

    const pt = getCoordinates(e);
    const newStroke: Stroke = {
      points: [pt],
      color: penColor,
      width: penWidth,
      style: penStyle,
    };
    currentStrokeRef.current = newStroke;
    setStrokes((prev) => [...prev, newStroke]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const pt = getCoordinates(e);

    // Filter tiny micro-jitters (< 1px) to keep curves clean
    const pts = currentStrokeRef.current.points;
    const lastPt = pts[pts.length - 1];
    if (lastPt) {
      const dist = Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y);
      if (dist < 1.0) return;
    }

    pts.push(pt);

    setStrokes((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...currentStrokeRef.current! };
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    toast.info('Canvas cleared.');
  };

  // Generate Master Output Canvas with sub-pixel tight cropping
  const generateMasterCanvas = useCallback(
    (opts: {
      transparent: boolean;
      targetW?: number;
      targetH?: number;
    }): HTMLCanvasElement => {
      const master = document.createElement('canvas');
      const ctx = master.getContext('2d');
      if (!ctx) return master;

      if (activeTab === 'draw') {
        if (strokes.length === 0) {
          master.width = opts.targetW || 600;
          master.height = opts.targetH || 240;
          if (!opts.transparent) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, master.width, master.height);
          }
          return master;
        }

        // Compute sub-pixel bounding box
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        strokes.forEach((s) => {
          s.points.forEach((p) => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
          });
        });

        const pad = 24;
        const strokeW = Math.max(10, maxX - minX + pad * 2);
        const strokeH = Math.max(10, maxY - minY + pad * 2);

        const targetW = opts.targetW || strokeW;
        const targetH = opts.targetH || strokeH;

        master.width = targetW;
        master.height = targetH;

        if (!opts.transparent) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        const scale = Math.min(
          (targetW - pad * 2) / (maxX - minX || 1),
          (targetH - pad * 2) / (maxY - minY || 1),
          1.6
        );

        ctx.save();
        ctx.translate(
          targetW / 2 - ((minX + maxX) / 2) * scale,
          targetH / 2 - ((minY + maxY) / 2) * scale
        );
        ctx.scale(scale, scale);

        strokes.forEach((stroke) => {
          const pts = stroke.points;
          if (pts.length === 0) return;

          ctx.save();
          ctx.strokeStyle = stroke.color;
          ctx.fillStyle = stroke.color;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = stroke.width;

          if (pts.length === 1) {
            ctx.beginPath();
            ctx.arc(pts[0].x, pts[0].y, stroke.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
          }

          for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const xc = (p1.x + p2.x) / 2;
            const yc = (p1.y + p2.y) / 2;

            ctx.beginPath();
            if (i === 0) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(xc, yc);
            } else {
              const prev = pts[i - 1];
              const prevXc = (prev.x + p1.x) / 2;
              const prevYc = (prev.y + p1.y) / 2;
              ctx.moveTo(prevXc, prevYc);
              ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
            }
            ctx.stroke();
          }

          if (pts.length > 2) {
            const last = pts[pts.length - 1];
            const secondLast = pts[pts.length - 2];
            ctx.beginPath();
            ctx.moveTo((secondLast.x + last.x) / 2, (secondLast.y + last.y) / 2);
            ctx.lineTo(last.x, last.y);
            ctx.stroke();
          }

          ctx.restore();
        });
        ctx.restore();

        return master;
      }

      if (activeTab === 'type') {
        const font = CURSIVE_FONTS[selectedFontIndex];
        const targetW = opts.targetW || 700;
        const targetH = opts.targetH || 240;

        master.width = targetW;
        master.height = targetH;

        if (!opts.transparent) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.save();
        ctx.fillStyle = penColor;
        ctx.font = `${typeFontSize}px ${font.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.translate(targetW / 2, targetH / 2);
        if (typeSlant !== 0) {
          ctx.transform(1, 0, Math.tan((typeSlant * Math.PI) / 180), 1, 0, 0);
        }

        ctx.fillText(typedName || 'Your Signature', 0, 0);
        ctx.restore();

        return master;
      }

      if (activeTab === 'upload' && uploadedImg) {
        const isRotated = paperRotation % 180 !== 0;
        const naturalW = isRotated ? uploadedImg.naturalHeight : uploadedImg.naturalWidth;
        const naturalH = isRotated ? uploadedImg.naturalWidth : uploadedImg.naturalHeight;
        const targetW = opts.targetW || naturalW;
        const targetH = opts.targetH || naturalH;

        master.width = targetW;
        master.height = targetH;

        if (!opts.transparent) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.save();
        ctx.translate(targetW / 2, targetH / 2);
        ctx.rotate((paperRotation * Math.PI) / 180);
        const drawW = isRotated ? targetH : targetW;
        const drawH = isRotated ? targetW : targetH;
        ctx.drawImage(uploadedImg, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (l > bwThreshold) {
            if (opts.transparent) {
              data[i + 3] = 0;
            } else {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            }
          } else {
            data[i] = 15;
            data[i + 1] = 23;
            data[i + 2] = 42;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        return master;
      }

      return master;
    },
    [
      activeTab,
      strokes,
      penColor,
      typedName,
      selectedFontIndex,
      typeFontSize,
      typeSlant,
      uploadedImg,
      bwThreshold,
      paperRotation,
    ]
  );

  // 1. Download Transparent PNG (With Success Popup)
  const handleDownloadTransparentPng = () => {
    if (activeTab === 'draw' && strokes.length === 0) {
      toast.error('Please draw your signature first.');
      return;
    }
    const canvas = generateMasterCanvas({ transparent: true });
    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = 'signature-transparent.png';
        const url = URL.createObjectURL(blob);
        triggerBrowserDownload(blob, fileName);
        fireConfetti();
        setSuccessModal({
          isOpen: true,
          fileName,
          formatTitle: 'Transparent PNG Signature',
          formatBadge: '32-bit Alpha Lossless',
          fileSizeKb: parseFloat((blob.size / 1024).toFixed(1)),
          downloadUrl: url,
          fileBlob: blob,
        });
      }
    }, 'image/png');
  };

  // 2. Download Sarkari / SSC / UPSC 10-20KB JPEG (With Success Popup)
  const handleDownloadGovtFormat = async () => {
    if (activeTab === 'draw' && strokes.length === 0) {
      toast.error('Please draw your signature first.');
      return;
    }

    const TARGET_W = 140;
    const TARGET_H = 60;
    const canvas = generateMasterCanvas({
      transparent: false,
      targetW: TARGET_W,
      targetH: TARGET_H,
    });

    let minQ = 0.4;
    let maxQ = 0.98;
    let bestBlob: Blob | null = null;

    for (let pass = 0; pass < 6; pass++) {
      const q = (minQ + maxQ) / 2;
      const b = await new Promise<Blob>((res) =>
        canvas.toBlob((blob) => res(blob!), 'image/jpeg', q)
      );
      bestBlob = b;
      if (b.size > 18 * 1024) {
        maxQ = q;
      } else {
        minQ = q;
      }
    }

    if (bestBlob) {
      const fileName = 'ssc-upsc-signature-10-to-20kb.jpg';
      const url = URL.createObjectURL(bestBlob);
      triggerBrowserDownload(bestBlob, fileName);
      fireConfetti();
      setSuccessModal({
        isOpen: true,
        fileName,
        formatTitle: 'Sarkari / SSC Exam Format',
        formatBadge: '140×60 px • 10–20KB Safe',
        fileSizeKb: parseFloat((bestBlob.size / 1024).toFixed(1)),
        downloadUrl: url,
        fileBlob: bestBlob,
      });
    }
  };

  // 3. Download PAN Card 444x205 px 300 DPI JPEG (With Success Popup)
  const handleDownloadPanFormat = async () => {
    if (activeTab === 'draw' && strokes.length === 0) {
      toast.error('Please draw your signature first.');
      return;
    }

    const TARGET_W = 444;
    const TARGET_H = 205;
    const canvas = generateMasterCanvas({
      transparent: false,
      targetW: TARGET_W,
      targetH: TARGET_H,
    });

    let minQ = 0.4;
    let maxQ = 0.98;
    let bestBlob: Blob | null = null;

    for (let pass = 0; pass < 6; pass++) {
      const q = (minQ + maxQ) / 2;
      const b = await new Promise<Blob>((res) =>
        canvas.toBlob((blob) => res(blob!), 'image/jpeg', q)
      );
      bestBlob = b;
      if (b.size > 42 * 1024) {
        maxQ = q;
      } else {
        minQ = q;
      }
    }

    if (bestBlob) {
      const arrayBuf = await bestBlob.arrayBuffer();
      const with300Dpi = inject300DpiJpeg(new Uint8Array(arrayBuf));
      const finalBlob = new Blob([with300Dpi as any], { type: 'image/jpeg' });
      const fileName = 'pan-card-signature-444x205-300dpi.jpg';
      const url = URL.createObjectURL(finalBlob);
      triggerBrowserDownload(finalBlob, fileName);
      fireConfetti();
      setSuccessModal({
        isOpen: true,
        fileName,
        formatTitle: 'PAN Card (NSDL / UTIITSL)',
        formatBadge: '444×205 px • 300 DPI Header',
        fileSizeKb: parseFloat((finalBlob.size / 1024).toFixed(1)),
        downloadUrl: url,
        fileBlob: finalBlob,
      });
    }
  };

  // 4. Download Scalable Vector SVG (With Success Popup)
  const handleDownloadSvg = () => {
    if (activeTab === 'draw' && strokes.length === 0) {
      toast.error('Please draw your signature first.');
      return;
    }

    if (activeTab === 'draw') {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      strokes.forEach((s) => {
        s.points.forEach((p) => {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        });
      });

      const pad = 20;
      const width = Math.max(10, maxX - minX + pad * 2);
      const height = Math.max(10, maxY - minY + pad * 2);

      let paths = '';
      strokes.forEach((s) => {
        if (s.points.length === 0) return;
        let d = `M ${s.points[0].x - minX + pad} ${s.points[0].y - minY + pad}`;
        for (let i = 1; i < s.points.length; i++) {
          d += ` L ${s.points[i].x - minX + pad} ${s.points[i].y - minY + pad}`;
        }
        paths += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round" />`;
      });

      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${paths}</svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const fileName = 'signature-vector.svg';
      const url = URL.createObjectURL(blob);
      triggerBrowserDownload(blob, fileName);
      fireConfetti();
      setSuccessModal({
        isOpen: true,
        fileName,
        formatTitle: 'Scalable Vector Graphic (SVG)',
        formatBadge: 'Infinite Scalability • Vector',
        fileSizeKb: parseFloat((blob.size / 1024).toFixed(1)),
        downloadUrl: url,
        fileBlob: blob,
      });
      return;
    }

    if (activeTab === 'type') {
      const font = CURSIVE_FONTS[selectedFontIndex];
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200">
        <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="${font.fontFamily}" font-size="${typeFontSize}px" fill="${penColor}">${typedName}</text>
      </svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const fileName = 'signature-typed.svg';
      const url = URL.createObjectURL(blob);
      triggerBrowserDownload(blob, fileName);
      fireConfetti();
      setSuccessModal({
        isOpen: true,
        fileName,
        formatTitle: 'Typed Vector Signature (SVG)',
        formatBadge: 'Cursive Vector Path',
        fileSizeKb: parseFloat((blob.size / 1024).toFixed(1)),
        downloadUrl: url,
        fileBlob: blob,
      });
      return;
    }

    toast.info('SVG export is optimized for drawn and typed signatures.');
  };

  // 1-Click Clipboard Copy
  const handleCopyToClipboard = async () => {
    if (activeTab === 'draw' && strokes.length === 0) {
      toast.error('Please draw your signature first.');
      return;
    }

    try {
      const canvas = generateMasterCanvas({ transparent: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setIsCopied(true);
          toast.success('Signature copied to clipboard! Paste directly into Word or Google Docs.');
          setTimeout(() => setIsCopied(false), 2500);
        } else {
          toast.error('Clipboard image copy not supported in this browser. Please use Download.');
        }
      }, 'image/png');
    } catch {
      toast.error('Could not copy signature to clipboard.');
    }
  };

  // Upload Paper Image
  const handlePaperImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImg(img);
        toast.success('Paper signature uploaded! Magic background cleaner applied.');
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP CREATION MODE TABS (Clean Mobile-First Touch Bar)                      */}
      {/* ========================================================================= */}
      <div className="p-1 sm:p-1.5 bg-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Draw Sign</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'type'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Type Cursive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Clean Paper</span>
          </button>
        </div>

        {/* Undo & Clear Action Buttons */}
        <div className="flex items-center justify-end gap-1.5 pr-1">
          {activeTab === 'draw' && (
            <>
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                title="Undo last stroke"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Undo</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={strokes.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Clear</span>
              </button>
            </>
          )}

          {activeTab === 'upload' && uploadedImg && (
            <button
              type="button"
              onClick={() => {
                setUploadedImg(null);
                toast.info('Uploaded paper signature removed.');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DRAW SIGNATURE WORKSPACE (Smooth Bezier Touch Canvas)               */}
      {/* ========================================================================= */}
      {activeTab === 'draw' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="relative rounded-3xl bg-white border-2 border-slate-300 shadow-md overflow-hidden flex flex-col">
            {/* Mobile-Optimized Responsive Drawing Controls Header */}
            <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
              {/* Row 1: Swatches + Straight Line Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    Ink:
                  </span>
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setPenColor(c.hex)}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-transform cursor-pointer relative shadow-xs flex items-center justify-center ${
                        penColor === c.hex ? 'scale-115 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105 opacity-90'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {penColor === c.hex && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </button>
                  ))}

                  <label className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-slate-300 bg-gradient-to-tr from-pink-500 via-amber-400 to-indigo-500 cursor-pointer flex items-center justify-center ml-0.5 shadow-2xs hover:scale-105 transition-transform" title="Custom color picker">
                    <input
                      type="color"
                      value={penColor}
                      onChange={(e) => setPenColor(e.target.value)}
                      className="opacity-0 w-0 h-0 pointer-events-none"
                    />
                    <Palette className="w-3 h-3 text-white drop-shadow" />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuideLine(!showGuideLine)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition-all cursor-pointer ${
                    showGuideLine ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  Baseline Guide: {showGuideLine ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Row 2: Pen Style + Thickness Slider */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto max-w-full">
                  {(['fountain', 'ballpoint', 'calligraphy', 'marker'] as PenStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPenStyle(st)}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                        penStyle === st ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-600">Stroke:</span>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={penWidth}
                    onChange={(e) => setPenWidth(parseInt(e.target.value))}
                    className="w-20 sm:w-28 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs font-black text-blue-900 w-4">{penWidth}px</span>
                </div>
              </div>
            </div>

            {/* The Active Drawing Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-[260px] sm:h-[300px] cursor-crosshair touch-none select-none bg-white"
            />

            {/* Empty Canvas Guidance */}
            {strokes.length === 0 && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1.5 pt-16 sm:pt-20 px-4 text-center">
                <PenTool className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300 stroke-[1.5]" />
                <p className="text-xs sm:text-sm font-semibold text-slate-400">
                  Sign here using your finger, stylus, or mouse
                </p>
                <p className="text-[10px] sm:text-xs text-slate-300">
                  High-DPI Retina curves &bull; Pressure sensitivity automatically active
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TYPE SIGNATURE WORKSPACE                                            */}
      {/* ========================================================================= */}
      {activeTab === 'type' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs font-black uppercase text-slate-600 tracking-wider">
                  Type Your Name or Initials
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Aaradhya Pathak"
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 font-bold text-base outline-none shadow-xs transition-all"
                />
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs font-black uppercase text-slate-600 tracking-wider">
                  Signature Ink Color
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setPenColor(c.hex)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer relative shadow-xs flex items-center justify-center ${
                        penColor === c.hex ? 'scale-115 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105 opacity-90'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {penColor === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="w-8 h-8 rounded-full border border-slate-300 cursor-pointer"
                    title="Custom color"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Font Size</span>
                  <span className="text-blue-900 font-black">{typeFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="72"
                  value={typeFontSize}
                  onChange={(e) => setTypeFontSize(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Signature Slant (Italic Angle)</span>
                  <span className="text-blue-900 font-black">{typeSlant}°</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={typeSlant}
                  onChange={(e) => setTypeSlant(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURSIVE_FONTS.map((font, idx) => {
              const isSelected = selectedFontIndex === idx;
              return (
                <div
                  key={font.id}
                  onClick={() => setSelectedFontIndex(idx)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[150px] bg-white shadow-2xs hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20'
                      : 'border-slate-200/90 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                      {font.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div
                    className="py-3 text-center overflow-hidden truncate transition-transform select-none"
                    style={{
                      fontFamily: font.fontFamily,
                      fontSize: `${Math.min(36, typeFontSize)}px`,
                      color: penColor,
                      transform: `skewX(${typeSlant * -1}deg)`,
                    }}
                  >
                    {typedName || 'Your Signature'}
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 truncate">
                    {font.author}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLEAN PAPER SIGNATURE WORKSPACE                                     */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePaperImageSelect}
            className="hidden"
          />

          {!uploadedImg ? (
            <label className="flex flex-col items-center justify-center p-8 sm:p-14 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-3xl bg-blue-50/30 hover:bg-blue-50/60 transition-all cursor-pointer group text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 group-hover:bg-blue-200 text-blue-700 flex items-center justify-center shadow-xs transition-colors">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">
                  Upload Photo of Hand-Signed Signature on Paper
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Takes any phone camera snapshot and wipes away room shadows, desk yellowing, and grey paper tint.
                </p>
              </div>
              <span className="px-5 py-2 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-black text-xs shadow-xs transition-all">
                Select Photo File
              </span>
            </label>
          ) : (
            <div className="space-y-5">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Paper Shadow Stripper &amp; Transparency Tuning
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Real-time live preview • Moving the slider strips paper yellowing instantly
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPaperRotation((r) => (r + 90) % 360)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer active:scale-95"
                    title="Rotate 90 degrees clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => uploadInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 transition-all cursor-pointer active:scale-95"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Replace Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImg(null);
                      setPaperRotation(0);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 transition-all cursor-pointer active:scale-95"
                    title="Remove uploaded image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>

              {/* LIVE PREVIEW CANVAS CONTAINER */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-600 px-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Cleaned Preview
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({paperRotation % 180 !== 0 ? uploadedImg.naturalHeight : uploadedImg.naturalWidth} × {paperRotation % 180 !== 0 ? uploadedImg.naturalWidth : uploadedImg.naturalHeight} px)
                    </span>
                  </div>

                  {/* Background Mode Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPaperPreviewBg('transparent')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        paperPreviewBg === 'transparent'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Transparent PNG
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperPreviewBg('white')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        paperPreviewBg === 'white'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      White Paper
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperPreviewBg('original')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        paperPreviewBg === 'original'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Original Photo
                    </button>
                  </div>
                </div>

                {/* THE CANVAS CARD */}
                <div
                  className={`min-h-[220px] sm:min-h-[260px] max-h-[360px] rounded-2xl border-2 border-slate-200/90 flex items-center justify-center p-4 relative overflow-hidden transition-all shadow-inner ${
                    paperPreviewBg === 'transparent'
                      ? 'bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0px] bg-white'
                      : paperPreviewBg === 'white'
                      ? 'bg-white'
                      : 'bg-amber-50/40'
                  }`}
                >
                  <canvas
                    ref={paperCanvasRef}
                    className="max-h-[220px] sm:max-h-[280px] w-auto max-w-full object-contain mx-auto drop-shadow-sm select-none"
                  />
                </div>
              </div>

              {/* THRESHOLD SLIDER & PRESETS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800">
                        Paper Whiteness Cleanup Threshold
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                        {bwThreshold} / 255
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Slide right to eliminate remaining grey shadows. Slide left if ink lines appear too thin.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="100"
                    max="225"
                    step="1"
                    value={bwThreshold}
                    onChange={(e) => setBwThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  {/* Preset Threshold Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Presets:</span>
                    {[
                      { label: 'Light Paper (145)', val: 145 },
                      { label: 'Standard Clean (165)', val: 165 },
                      { label: 'Phone Shadows (185)', val: 185 },
                      { label: 'Heavy Shadows (205)', val: 205 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setBwThreshold(preset.val)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer border ${
                          bwThreshold === preset.val
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPORT SECTION (Redesigned Clean App UI matching FileZenith design system)  */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-700" />
                Zero Watermarks &bull; 100% Free
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Export Your Signature in Any Format
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click any format below to download immediately with automatic format calibration.
            </p>
          </div>

          {/* Quick Copy to Clipboard Button */}
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs border border-slate-200/90 transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-black">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-blue-600" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Clean Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Transparent PNG */}
          <div className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                Transparent PNG
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Word &amp; PDF Signatures</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lossless alpha channel. Sign PDFs, Word files, Google Docs &amp; Invoices with zero white box behind.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTransparentPng}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>

          {/* Card 2: Sarkari / SSC / UPSC Format */}
          <div className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                Govt 10–20KB Safe
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Sarkari / SSC Format</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exact 140 × 60 px, solid white `#FFFFFF` background, file size locked strictly between 10 KB and 20 KB.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadGovtFormat}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 10–20KB</span>
            </button>
          </div>

          {/* Card 3: PAN Card Format */}
          <div className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                300 DPI Embedded
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">PAN Card (NSDL / UTI)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exact 444 × 205 px, white background, binary JFIF 300 DPI header, under 50 KB for Form 49A/49AA.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPanFormat}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PAN Sign</span>
            </button>
          </div>

          {/* Card 4: Scalable Vector SVG */}
          <div className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                Infinite Resolution
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Vector SVG Format</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mathematical vector paths. Scales to any size for high-DPI laser printing and rubber stamps with zero blur.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Vector</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DOWNLOAD SUCCESS POPUP MODAL (Confetti + Preview + PDF Signing CTA)       */}
      {/* ========================================================================= */}
      {successModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="relative w-full max-w-[460px] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Content */}
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Signature Downloaded Successfully!
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  100% private in-browser generation &bull; Zero server upload
                </p>
              </div>

              {/* Visual Signature Output Preview Box (With Checkerboard Background) */}
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50 flex items-center justify-center p-4">
                {successModal.downloadUrl && (
                  <img
                    src={successModal.downloadUrl}
                    alt="Signature preview"
                    className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-sm"
                  />
                )}
                <span className="absolute bottom-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                  {successModal.formatBadge}
                </span>
              </div>

              {/* File Specs Pill */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 truncate max-w-[240px]">
                  {successModal.fileName}
                </span>
                {successModal.fileSizeKb !== null && (
                  <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    {successModal.fileSizeKb} KB
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Primary CTA: Sign a PDF Now */}
                <Link
                  href="/pdf/edit"
                  onClick={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Insert Signature onto PDF Document &rarr;</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy to Clipboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (successModal.fileBlob && successModal.fileName) {
                        triggerBrowserDownload(successModal.fileBlob, successModal.fileName);
                        toast.success('Downloaded again!');
                      }
                    }}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Again</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
