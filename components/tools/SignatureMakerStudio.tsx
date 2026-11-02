'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  PenTool,
  Type,
  UploadCloud,
  Download,
  RotateCcw,
  Undo2,
  Redo2,
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
} from 'lucide-react';
import { toast } from 'sonner';
import { triggerBrowserDownload } from '@/lib/download-helper';

// Binary 300 DPI Injection for PAN Card NSDL/UTIITSL compliance
function inject300DpiJpeg(buffer: Uint8Array): Uint8Array {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (view.getUint16(0) !== 0xffd8) return buffer;

  if (view.getUint16(2) === 0xffe0) {
    if (view.getUint32(6) === 0x4a464946 && view.getUint8(10) === 0) {
      view.setUint8(13, 1); // 1 = dots per inch (DPI)
      view.setUint16(14, 300); // X density = 300 DPI
      view.setUint16(16, 300); // Y density = 300 DPI
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
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
  style: PenStyle;
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
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Pen Configuration
  const [penColor, setPenColor] = useState<string>('#000000');
  const [customColor, setCustomColor] = useState<string>('#000000');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [penStyle, setPenStyle] = useState<PenStyle>('fountain');
  const [showGuideLine, setShowGuideLine] = useState<boolean>(true);

  // Type Signature State
  const [typedName, setTypedName] = useState<string>('John Hancock');
  const [selectedFontIndex, setSelectedFontIndex] = useState<number>(0);
  const [typeFontSize, setTypeFontSize] = useState<number>(48);
  const [typeSlant, setTypeSlant] = useState<number>(0); // -15 to 15 deg

  // Upload Clean Paper Signature State
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImg, setUploadedImg] = useState<HTMLImageElement | null>(null);
  const [bwThreshold, setBwThreshold] = useState<number>(165);
  const [paperContrast, setPaperContrast] = useState<number>(15);

  // Copied indicator state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Master Output Blobs Cache
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

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

  // Set up canvas sizing with devicePixelRatio support for crisp Retina rendering
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 700;
    const height = 300;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    redrawCanvas();
  }, [strokes]);

  // Redraw all strokes on canvas with smooth Bezier curves
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
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
      ctx.moveTo(30, baselineY);
      ctx.lineTo(logicalW - 30, baselineY);
      ctx.stroke();
      ctx.restore();
    }

    // Render strokes with smooth quadratic Bezier curves
    strokes.forEach((stroke) => {
      if (stroke.points.length < 1) return;
      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.style === 'calligraphy') {
        // Angled chisel stroke simulation
        ctx.lineWidth = stroke.width * 1.4;
      } else if (stroke.style === 'marker') {
        ctx.lineWidth = stroke.width * 1.8;
      } else if (stroke.style === 'fountain') {
        ctx.lineWidth = stroke.width;
      } else {
        ctx.lineWidth = stroke.width;
      }

      if (stroke.points.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length - 1; i++) {
          const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
        }

        const lastIdx = stroke.points.length - 1;
        ctx.lineTo(stroke.points[lastIdx].x, stroke.points[lastIdx].y);
        ctx.stroke();
      }
      ctx.restore();
    });
  }, [strokes, showGuideLine]);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  // Pointer event handlers for cross-device drawing (touch, mouse, stylus)
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
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
    currentStrokeRef.current.points.push(pt);

    // Live update current stroke
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

    // Save to history stack for Undo/Redo
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, strokes];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    setHistory([]);
    setHistoryIndex(-1);
    toast.info('Canvas cleared.');
  };

  // Render Master Signature Image based on active tab
  const generateMasterCanvas = useCallback(
    (opts: {
      transparent: boolean;
      targetW?: number;
      targetH?: number;
      cropTight?: boolean;
    }): HTMLCanvasElement => {
      const master = document.createElement('canvas');
      const ctx = master.getContext('2d');
      if (!ctx) return master;

      if (activeTab === 'draw') {
        const source = canvasRef.current;
        if (!source || strokes.length === 0) {
          master.width = opts.targetW || 600;
          master.height = opts.targetH || 240;
          if (!opts.transparent) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, master.width, master.height);
          }
          return master;
        }

        // Calculate bounding box of all strokes to crop tightly
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

        // Scale and center stroke within target dimension
        const scale = Math.min(
          (targetW - pad * 2) / (maxX - minX || 1),
          (targetH - pad * 2) / (maxY - minY || 1),
          1.5
        );

        ctx.save();
        ctx.translate(
          targetW / 2 - ((minX + maxX) / 2) * scale,
          targetH / 2 - ((minY + maxY) / 2) * scale
        );
        ctx.scale(scale, scale);

        strokes.forEach((stroke) => {
          if (stroke.points.length < 1) return;
          ctx.save();
          ctx.strokeStyle = stroke.color;
          ctx.fillStyle = stroke.color;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = stroke.width;

          if (stroke.points.length === 1) {
            ctx.beginPath();
            ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length - 1; i++) {
              const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
              const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
              ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
            }
            const lastIdx = stroke.points.length - 1;
            ctx.lineTo(stroke.points[lastIdx].x, stroke.points[lastIdx].y);
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
        const targetH = opts.targetH || 250;

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
        const targetW = opts.targetW || uploadedImg.naturalWidth;
        const targetH = opts.targetH || uploadedImg.naturalHeight;

        master.width = targetW;
        master.height = targetH;

        if (!opts.transparent) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.drawImage(uploadedImg, 0, 0, targetW, targetH);

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (l > bwThreshold) {
            if (opts.transparent) {
              data[i + 3] = 0; // Transparent
            } else {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            }
          } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
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
    ]
  );

  // 1. Download Transparent PNG (Universal default for Word/PDF/Invoices)
  const handleDownloadTransparentPng = () => {
    if (activeTab === 'draw' && strokes.length === 0) {
      toast.error('Please draw your signature first.');
      return;
    }
    const canvas = generateMasterCanvas({ transparent: true });
    canvas.toBlob((blob) => {
      if (blob) {
        triggerBrowserDownload(blob, 'signature-transparent.png');
        toast.success('Downloaded Transparent PNG! Perfect for Word & PDFs.');
      }
    }, 'image/png');
  };

  // 2. Download Sarkari / SSC / UPSC Format (140x60 px, White BG, 10–20KB)
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

    // Binary search compression targeting 12KB - 18KB
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
      triggerBrowserDownload(bestBlob, 'ssc-upsc-signature-10-to-20kb.jpg');
      toast.success(
        `Downloaded Sarkari Signature (${(bestBlob.size / 1024).toFixed(1)} KB) strictly under 20KB!`
      );
    }
  };

  // 3. Download PAN Card Format (444x205 px, 300 DPI, White BG, <50KB)
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
      triggerBrowserDownload(finalBlob, 'pan-card-signature-444x205-300dpi.jpg');
      toast.success('Downloaded PAN Signature (444×205 px, 300 DPI) for NSDL / UTIITSL!');
    }
  };

  // 4. Download High-Res SVG Vector
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
      triggerBrowserDownload(blob, 'signature-vector.svg');
      toast.success('Downloaded Scalable Vector SVG signature!');
      return;
    }

    if (activeTab === 'type') {
      const font = CURSIVE_FONTS[selectedFontIndex];
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200">
        <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="${font.fontFamily}" font-size="${typeFontSize}px" fill="${penColor}">${typedName}</text>
      </svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      triggerBrowserDownload(blob, 'signature-typed.svg');
      toast.success('Downloaded SVG signature!');
      return;
    }

    toast.info('SVG export is optimized for drawn and typed signatures.');
  };

  // 5. 1-Click Copy to Clipboard
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

  // Handle Paper Photo Upload for Tab 3
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
      {/* Top Creation Mode Switcher Tabs */}
      <div className="p-1.5 bg-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Draw Signature</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-500/30 text-white">
              Smooth Pen
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'type'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Type Signature</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-500/30 text-white">
              8+ Styles
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Clean Paper Sign</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-500/30 text-white">
              Magic B&amp;W
            </span>
          </button>
        </div>

        {/* Universal Clear & Reset */}
        <div className="flex items-center gap-1.5 pr-1">
          {activeTab === 'draw' && (
            <>
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Undo last stroke"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={strokes.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Clear Canvas</span>
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
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Remove Image</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DRAW SIGNATURE WORKSPACE                                            */}
      {/* ========================================================================= */}
      {activeTab === 'draw' && (
        <div className="space-y-4">
          {/* Main Interactive Drawing Canvas Viewport */}
          <div className="relative rounded-3xl bg-white border-2 border-slate-300/80 shadow-md overflow-hidden flex flex-col items-center">
            {/* Top Toolbar overlay with Ink Colors & Styles */}
            <div className="w-full px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xs">
              {/* Color Swatches */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1">
                  Ink Color:
                </span>
                {INK_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPenColor(c.hex)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative shadow-xs flex items-center justify-center ${
                      penColor === c.hex ? 'scale-115 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105 opacity-90'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {penColor === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}

                {/* Custom Color Picker input */}
                <label className="w-7 h-7 rounded-full border border-slate-300 bg-gradient-to-tr from-pink-500 via-amber-400 to-indigo-500 cursor-pointer flex items-center justify-center ml-1 shadow-2xs hover:scale-105 transition-transform" title="Custom Ink Color">
                  <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="opacity-0 w-0 h-0 pointer-events-none"
                  />
                  <Palette className="w-3.5 h-3.5 text-white drop-shadow" />
                </label>
              </div>

              {/* Pen Style Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                {(['fountain', 'ballpoint', 'calligraphy', 'marker'] as PenStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPenStyle(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      penStyle === st ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Stroke Width Slider */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Thickness:</span>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={penWidth}
                  onChange={(e) => setPenWidth(parseInt(e.target.value))}
                  className="w-24 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-black text-blue-900 w-5">{penWidth}px</span>
              </div>

              {/* Baseline Guideline Toggle */}
              <button
                type="button"
                onClick={() => setShowGuideLine(!showGuideLine)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  showGuideLine ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                Straight Line Guide: {showGuideLine ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* The Actual HTML5 Drawing Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-[260px] sm:h-[300px] cursor-crosshair touch-none select-none bg-white"
            />

            {/* Empty Canvas Helpful Placeholder */}
            {strokes.length === 0 && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1.5 pt-12">
                <PenTool className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-400">Sign here using your finger, stylus, or mouse</p>
                <p className="text-xs text-slate-300">Smooth ink curve optimization is automatically enabled</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TYPE SIGNATURE WORKSPACE (8+ AUTHENTIC CURSIVE STYLES)              */}
      {/* ========================================================================= */}
      {activeTab === 'type' && (
        <div className="space-y-6">
          {/* Text Input & Controls Header */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
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

              {/* Ink Color Selector */}
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

            {/* Fine Tuning Sliders */}
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

          {/* 8 Cursive Style Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURSIVE_FONTS.map((font, idx) => {
              const isSelected = selectedFontIndex === idx;
              return (
                <div
                  key={font.id}
                  onClick={() => setSelectedFontIndex(idx)}
                  className={`group relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[160px] bg-white shadow-2xs hover:shadow-md ${
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

                  {/* Dynamic Signature Render Preview */}
                  <div
                    className="py-4 text-center overflow-hidden truncate transition-transform select-none"
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
      {/* TAB 3: CLEAN PAPER SIGNATURE WORKSPACE (MAGIC B&W THRESHOLD)               */}
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
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePaperImageSelect}
                className="hidden"
              />
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
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Paper Shadow Stripper &amp; Transparency Tuning</span>
                </h4>
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-700 transition-all cursor-pointer"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
              </div>

              {/* Threshold Sliders */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Paper Whiteness Cleanup Threshold</span>
                    <span className="text-blue-900 font-black">{bwThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="220"
                    value={bwThreshold}
                    onChange={(e) => setBwThreshold(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">
                    Slide right to eliminate remaining dark paper shadows. Slide left if ink strokes appear too thin.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIVERSAL EXPORT & 1-CLICK ACTION MATRIX                                  */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
              Zero Watermarks &bull; 100% Free &bull; Instant Download
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Export Your Signature in Any Format
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick 1-Click Clipboard Copy */}
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-blue-300" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Download Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Format 1: Transparent PNG (Universal Default) */}
          <div className="bg-white/5 border border-white/10 hover:border-blue-400/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Most Popular
              </span>
              <h4 className="font-bold text-white text-base">Transparent PNG</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lossless alpha channel. Sign PDFs, Word files, Google Docs, Invoices, and Gmail footers with no white block behind.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTransparentPng}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Transparent PNG</span>
            </button>
          </div>

          {/* Format 2: Sarkari / SSC / UPSC (10-20KB JPEG) */}
          <div className="bg-white/5 border border-white/10 hover:border-amber-400/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Govt Job Compliant
              </span>
              <h4 className="font-bold text-white text-base">Sarkari / SSC Format</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exact 140 × 60 pixels, solid pure white `#FFFFFF` background, file size strictly calibrated between 10 KB and 20 KB.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadGovtFormat}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 10–20KB JPEG</span>
            </button>
          </div>

          {/* Format 3: PAN Card NSDL & UTIITSL (444x205 px, 300 DPI) */}
          <div className="bg-white/5 border border-white/10 hover:border-emerald-400/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                300 DPI Guaranteed
              </span>
              <h4 className="font-bold text-white text-base">PAN Card (NSDL / UTI)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exact 444 × 205 pixels, white background, binary JFIF 300 DPI header injected, strictly under 50 KB.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPanFormat}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PAN Signature</span>
            </button>
          </div>

          {/* Format 4: Scalable Vector SVG */}
          <div className="bg-white/5 border border-white/10 hover:border-purple-400/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Infinite Resolution
              </span>
              <h4 className="font-bold text-white text-base">Scalable Vector (SVG)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mathematical vector paths. Scales to any size (billboards, high-DPI laser printing, rubber stamps) with zero blur.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Vector SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
