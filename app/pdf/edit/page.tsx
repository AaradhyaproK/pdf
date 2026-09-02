'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Upload,
  Type,
  Eraser,
  PenTool,
  Highlighter,
  Image as ImageIcon,
  RotateCw,
  Trash2,
  Download,
  MousePointer,
  RefreshCw,
  FileText,
  Edit3,
  XCircle,
  Bold,
  Italic,
  Target,
  Sparkles,
  Move,
  Check,
  Grid,
  Calendar,
  CheckSquare,
  Minus,
  Plus,
  Hand,
} from 'lucide-react';

interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  isBold?: boolean;
  isItalic?: boolean;
  fontFamily?: 'helvetica' | 'times' | 'courier';
}

interface WhiteoutAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  isHighlighter?: boolean;
}

interface ImageStamp {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

interface PageEdits {
  texts: TextAnnotation[];
  whiteouts: WhiteoutAnnotation[];
  drawings: DrawingStroke[];
  images: ImageStamp[];
  rotation: number;
}

interface DetectedTextItem {
  id: string;
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
}

export default function PDFEditPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.2);

  // Auto-fit initial zoom on mobile screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setZoom(0.85);
    }
  }, []);
  const [activeTool, setActiveTool] = useState<
    'editText' | 'select' | 'pan' | 'text' | 'replaceText' | 'whiteout' | 'draw' | 'highlight' | 'image' | 'autoDetect'
  >('editText');

  // Tool Style Settings
  const [textColor, setTextColor] = useState<string>('#0f172a');
  const [textSize, setTextSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'helvetica' | 'times' | 'courier'>('helvetica');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#2563eb');
  const [drawWidth] = useState<number>(3);
  const [highlightColor] = useState<string>('#fde047');

  // Auto Detected Text Items on current page
  const [detectedTexts, setDetectedTexts] = useState<DetectedTextItem[]>([]);
  const [hoveredTextId, setHoveredTextId] = useState<string | null>(null);

  // Inline Active Editing & Photo Stamp State
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [activeStampPreset, setActiveStampPreset] = useState<'date' | 'signature' | 'check' | 'cross' | null>(null);

  // Edits data per page
  const [pageEdits, setPageEdits] = useState<Record<number, PageEdits>>({});
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());

  // Canvas & Interaction state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingTextRef = useRef<boolean>(false);
  const isDraggingImageRef = useRef<boolean>(false);
  const activeImageIdRef = useRef<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const touchPanStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  // Keep activeImageIdRef in sync with activeImageId state
  useEffect(() => {
    activeImageIdRef.current = activeImageId;
  }, [activeImageId]);

  // Spacebar key listener for holding Space to drag-pan anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (e.code === 'Space' && targetTag !== 'INPUT' && targetTag !== 'TEXTAREA') {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Auto-fit zoom level on mobile screen load (0.85 on mobile, 1.2 on desktop)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setZoom(0.85);
    }
  }, []);

  // Global Window Mouse & Touch Listener for Rock-Solid Photo Dragging, Text Dragging, Panning
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      // 1. Pan Canvas View (Drag to scroll zoomed-in page in any direction)
      if (isPanningRef.current && panStartRef.current && workspaceRef.current) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        workspaceRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
        workspaceRef.current.scrollTop = panStartRef.current.scrollTop - dy;
        return;
      }

      // 2. Photo Stamp Dragging
      if (isDraggingImageRef.current && activeImageIdRef.current && dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        dragStartRef.current = { x: e.clientX, y: e.clientY };

        setPageEdits((prev) => {
          const edits = prev[currentPage] || { texts: [], whiteouts: [], drawings: [], images: [], rotation: 0 };
          return {
            ...prev,
            [currentPage]: {
              ...edits,
              images: edits.images.map((img) =>
                img.id === activeImageIdRef.current ? { ...img, x: img.x + dx, y: img.y + dy } : img
              ),
            },
          };
        });
        return;
      }

      // 3. Text Annotation Dragging
      if (!isDraggingTextRef.current || !editingTextId || !dragStartRef.current || !overlayCanvasRef.current) return;
      const rect = overlayCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - dragStartRef.current.x;
      const dy = y - dragStartRef.current.y;
      dragStartRef.current = { x, y };

      setPageEdits((prev) => {
        const edits = prev[currentPage] || { texts: [], whiteouts: [], drawings: [], images: [], rotation: 0 };
        return {
          ...prev,
          [currentPage]: {
            ...edits,
            texts: edits.texts.map((t) => (t.id === editingTextId ? { ...t, x: t.x + dx, y: t.y + dy } : t)),
          },
        };
      });
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (isDraggingImageRef.current && activeImageIdRef.current && dragStartRef.current && e.touches.length === 1) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;
        dragStartRef.current = { x: clientX, y: clientY };

        setPageEdits((prev) => {
          const edits = prev[currentPage] || { texts: [], whiteouts: [], drawings: [], images: [], rotation: 0 };
          return {
            ...prev,
            [currentPage]: {
              ...edits,
              images: edits.images.map((img) =>
                img.id === activeImageIdRef.current ? { ...img, x: img.x + dx, y: img.y + dy } : img
              ),
            },
          };
        });
      }
    };

    const handleWindowMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        panStartRef.current = null;
      }
      if (isDraggingImageRef.current) {
        isDraggingImageRef.current = false;
        dragStartRef.current = null;
      }
      if (isDraggingTextRef.current) {
        isDraggingTextRef.current = false;
        dragStartRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
    window.addEventListener('touchend', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowMouseUp);
    };
  }, [editingTextId, currentPage]);

  // Keyboard Shortcuts (Enter / Escape to Lock & Drop, Arrow Keys to Nudge 1px)
  useEffect(() => {
    if (!editingTextId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setEditingTextId(null);
        toast.success('Text placed!');
        return;
      }
      if (e.key === 'Escape') {
        setEditingTextId(null);
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const dx = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
        const dy = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;

        setPageEdits((prev) => {
          const edits = prev[currentPage] || { texts: [], whiteouts: [], drawings: [], images: [], rotation: 0 };
          return {
            ...prev,
            [currentPage]: {
              ...edits,
              texts: edits.texts.map((t) => (t.id === editingTextId ? { ...t, x: t.x + dx, y: t.y + dy } : t)),
            },
          };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTextId, currentPage]);

  // Initialize PDF.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pdfjsLib = require('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
  }, []);

  // Handle PDF Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    if (uploaded.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF document.');
      return;
    }

    setFile(uploaded);
    setDeletedPages(new Set());
    setPageEdits({});
    setCurrentPage(1);
    setEditingTextId(null);

    try {
      const pdfjsLib = require('pdfjs-dist');
      const arrayBuffer = await uploaded.arrayBuffer();
      const loadedPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(loadedPdf);
      setNumPages(loadedPdf.numPages);
      toast.success(`Loaded ${uploaded.name} (${loadedPdf.numPages} pages)`);
    } catch {
      toast.error('Failed to parse PDF document.');
    }
  };

  // Get current page edits initialized
  const getPageEdits = useCallback(
    (pageNum: number): PageEdits => {
      return pageEdits[pageNum] || { texts: [], whiteouts: [], drawings: [], images: [], rotation: 0 };
    },
    [pageEdits]
  );

  const currentRotation = getPageEdits(currentPage).rotation;

  // Render Base PDF Page & Extract Full Text Lines
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isMounted = true;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // Ignore
      }
      renderTaskRef.current = null;
    }

    pdfDoc.getPage(currentPage).then(async (page: any) => {
      if (!isMounted || !canvasRef.current) return;

      const rotation = (page.rotate + currentRotation) % 360;
      const viewport = page.getViewport({ scale: zoom, rotation });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = viewport.width;
        overlayCanvasRef.current.height = viewport.height;
      }

      const renderTask = page.render({ canvasContext: context, viewport });
      renderTaskRef.current = renderTask;

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name === 'RenderingCancelledException') return;
      } finally {
        if (renderTaskRef.current === renderTask) {
          renderTaskRef.current = null;
        }
      }

      try {
        const textContent = await page.getTextContent();
        const detectedItems: DetectedTextItem[] = [];
        let idx = 0;

        textContent.items.forEach((item: any) => {
          if (item.str && item.str.trim().length > 0) {
            const pdfX = item.transform[4];
            const pdfY = item.transform[5];
            const itemWidth = item.width || 30;
            const itemHeight = Math.abs(item.transform[3]) || item.height || 14;

            const v1 = viewport.convertToViewportPoint(pdfX, pdfY);
            const v2 = viewport.convertToViewportPoint(pdfX + itemWidth, pdfY + itemHeight);

            const rx = Math.min(v1[0], v2[0]);
            const ry = Math.min(v1[1], v2[1]);
            const rw = Math.max(16, Math.abs(v2[0] - v1[0]));
            const rh = Math.max(12, Math.abs(v2[1] - v1[1]));

            detectedItems.push({
              id: `dt_word_${idx++}_${Date.now()}`,
              str: item.str,
              x: rx,
              y: ry,
              width: rw,
              height: rh,
              fontSize: Math.max(11, Math.round(rh * 0.84)),
            });
          }
        });

        if (isMounted) {
          setDetectedTexts(detectedItems);
        }
      } catch {
        if (isMounted) setDetectedTexts([]);
      }
    });

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore
        }
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, currentPage, zoom, currentRotation]);

  // Render Overlays with Alignment Grid
  const renderOverlay = useCallback(
    (detectedList = detectedTexts) => {
      if (!overlayCanvasRef.current) return;
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const edits = getPageEdits(currentPage);

      // 0. Alignment Grid Overlay
      if (showGrid) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 0.5;
        const gridSize = 20;
        for (let gx = 0; gx < canvas.width; gx += gridSize) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, canvas.height);
          ctx.stroke();
        }
        for (let gy = 0; gy < canvas.height; gy += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(canvas.width, gy);
          ctx.stroke();
        }
      }

      // 1. Draw Auto-Detected PDF Text Word Highlights
      if (activeTool === 'editText' || activeTool === 'autoDetect') {
        detectedList.forEach((dt) => {
          const isErased = edits.whiteouts.some(
            (w) =>
              dt.x + dt.width >= w.x &&
              dt.x <= w.x + w.width &&
              dt.y + dt.height >= w.y &&
              dt.y <= w.y + w.height
          );

          if (!isErased) {
            const isHovered = dt.id === hoveredTextId;
            ctx.fillStyle = isHovered ? 'rgba(59, 130, 246, 0.22)' : 'rgba(99, 102, 241, 0.06)';
            ctx.fillRect(dt.x, dt.y, dt.width, dt.height);
          }
        });
      }

      // 2. Draw Whiteouts
      edits.whiteouts.forEach((w) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(w.x, w.y, w.width, w.height);
      });

      // 3. Draw Freehand Strokes & Highlights
      edits.drawings.forEach((stroke) => {
        if (stroke.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }

        if (stroke.isHighlighter) {
          ctx.globalAlpha = 0.4;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = 16;
          ctx.lineCap = 'square';
        } else {
          ctx.globalAlpha = 1.0;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          ctx.lineCap = 'round';
        }
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });

      // 4. Draw Image Stamps
      edits.images.forEach((img) => {
        const imageEl = new window.Image();
        imageEl.src = img.dataUrl;
        imageEl.onload = () => {
          ctx.drawImage(imageEl, img.x, img.y, img.width, img.height);
        };
      });

      // 5. Draw Non-Active Texts
      edits.texts.forEach((t) => {
        if (t.id !== editingTextId) {
          const fontFamStr = t.fontFamily === 'times' ? 'serif' : t.fontFamily === 'courier' ? 'monospace' : 'sans-serif';
          const fontStyle = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${t.fontSize}px ${fontFamStr}`;
          ctx.font = fontStyle;
          ctx.fillStyle = t.color;
          ctx.textBaseline = 'top';
          ctx.fillText(t.text, t.x, t.y);
        }
      });

      // 6. Draw Move Mode Highlights for ALL text elements (original PDF text + edited text) when in Move/Reposition Mode
      if (activeTool === 'select') {
        // Original PDF text items not yet erased
        detectedList.forEach((dt) => {
          const isErased = edits.whiteouts.some(
            (w) =>
              dt.x + dt.width >= w.x &&
              dt.x <= w.x + w.width &&
              dt.y + dt.height >= w.y &&
              dt.y <= w.y + w.height
          );

          if (!isErased) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(dt.x - 2, dt.y - 2, dt.width + 4, dt.height + 4);
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
            ctx.fillRect(dt.x - 2, dt.y - 2, dt.width + 4, dt.height + 4);
          }
        });

        // Edited text items
        edits.texts.forEach((t) => {
          const fontFamStr = t.fontFamily === 'times' ? 'serif' : t.fontFamily === 'courier' ? 'monospace' : 'sans-serif';
          ctx.font = `${t.fontSize}px ${fontFamStr}`;
          const metrics = ctx.measureText(t.text);
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(t.x - 3, t.y - 2, metrics.width + 6, t.fontSize + 4);
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
          ctx.fillRect(t.x - 3, t.y - 2, metrics.width + 6, t.fontSize + 4);
        });
      }

      // 7. Live Blueprint Ghost Preview for Quick Stamp Placement Cursor
      if (activeStampPreset && mousePosRef.current) {
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;

        let stampText = '';
        let color = textColor;
        if (activeStampPreset === 'date') stampText = new Date().toISOString().split('T')[0];
        else if (activeStampPreset === 'signature') stampText = '____________________ (Signature)';
        else if (activeStampPreset === 'check') { stampText = '✓ Approved'; color = '#16a34a'; }
        else if (activeStampPreset === 'cross') { stampText = '✗ Rejected'; color = '#dc2626'; }

        const fontFamStr = fontFamily === 'times' ? 'serif' : fontFamily === 'courier' ? 'monospace' : 'sans-serif';
        ctx.font = `${textSize}px ${fontFamStr}`;
        const metrics = ctx.measureText(stampText);
        const stampWidth = metrics.width;

        // Blueprint Background & Dashed Box Outline
        ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
        ctx.fillRect(mx - 4, my - 2, stampWidth + 8, textSize + 6);

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(mx - 4, my - 2, stampWidth + 8, textSize + 6);
        ctx.setLineDash([]);

        // Target Crosshair Guide
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx - 10, my);
        ctx.lineTo(mx + 10, my);
        ctx.moveTo(mx, my - 10);
        ctx.lineTo(mx, my + 10);
        ctx.stroke();

        // Ghost Text Preview
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.textBaseline = 'top';
        ctx.fillText(stampText, mx, my);
        ctx.globalAlpha = 1.0;
      }
    },
    [currentPage, getPageEdits, activeTool, hoveredTextId, detectedTexts, editingTextId, showGrid, activeStampPreset, textColor, textSize, fontFamily]
  );

  // Trigger Overlay Re-render on editing/state updates
  useEffect(() => {
    renderOverlay();
  }, [renderOverlay]);

  // Handle Mouse Interactions
  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!overlayCanvasRef.current) return;
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edits = getPageEdits(currentPage);

    // 0. Pan / Drag Canvas View Mode (Drag mouse/finger to scroll zoomed document)
    if (activeTool === 'pan' || e.button === 1) {
      isPanningRef.current = true;
      if (workspaceRef.current) {
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          scrollLeft: workspaceRef.current.scrollLeft,
          scrollTop: workspaceRef.current.scrollTop,
        };
      }
      return;
    }

    // 0. Quick Stamp Preset Placement Mode on Manual Canvas Click
    if (activeStampPreset) {
      const newId = `t_${Date.now()}`;
      let stampText = '';
      let size = textSize;
      let color = textColor;

      if (activeStampPreset === 'date') {
        stampText = new Date().toISOString().split('T')[0];
      } else if (activeStampPreset === 'signature') {
        stampText = '____________________ (Signature)';
      } else if (activeStampPreset === 'check') {
        stampText = '✓ Approved';
        color = '#16a34a';
      } else if (activeStampPreset === 'cross') {
        stampText = '✗ Rejected';
        color = '#dc2626';
      }

      const newText: TextAnnotation = {
        id: newId,
        x,
        y,
        text: stampText,
        fontSize: size,
        color,
        fontFamily,
      };

      setPageEdits({
        ...pageEdits,
        [currentPage]: { ...edits, texts: [...edits.texts, newText] },
      });
      setEditingTextId(newId);
      setActiveStampPreset(null);
      toast.success(`Placed ${activeStampPreset} stamp!`);
      return;
    }

    // 0. Check if user clicked on ANY existing typed text element
    const clickedExistingText = edits.texts.find((t) => {
      const ctx = overlayCanvasRef.current?.getContext('2d');
      if (!ctx) return false;
      ctx.font = `${t.fontSize}px sans-serif`;
      const metrics = ctx.measureText(t.text);
      return x >= t.x - 4 && x <= t.x + metrics.width + 4 && y >= t.y - 2 && y <= t.y + t.fontSize + 4;
    });

    if (clickedExistingText) {
      setEditingTextId(clickedExistingText.id);
      // Allow moving text ONLY when activeTool === 'select'
      if (activeTool === 'select') {
        isDraggingTextRef.current = true;
        dragStartRef.current = { x, y };
      }
      return;
    }

    // Auto-commit/drop active text when clicking outside on empty canvas area
    if (editingTextId) {
      setEditingTextId(null);
    }

    // 1. EDIT EXISTING PDF TEXT / MOVE MODE FOR DETECTED PDF TEXT: Click any word to edit or move!
    if (activeTool === 'editText' || activeTool === 'autoDetect' || activeTool === 'select') {
      const clickedDetected = detectedTexts.find(
        (dt) => x >= dt.x && x <= dt.x + dt.width && y >= dt.y && y <= dt.y + dt.height
      );

      if (clickedDetected) {
        // Sample exact text color from base PDF canvas before whiteout
        let wordColor = textColor;
        const baseCanvas = canvasRef.current;
        if (baseCanvas) {
          const baseCtx = baseCanvas.getContext('2d');
          if (baseCtx) {
            const sampleX = Math.round(clickedDetected.x + clickedDetected.width / 2);
            const sampleY = Math.round(clickedDetected.y + clickedDetected.height / 2);
            const pixel = baseCtx.getImageData(sampleX, sampleY, 1, 1).data;
            if (pixel[0] < 245 || pixel[1] < 245 || pixel[2] < 245) {
              wordColor = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
                .toString(16)
                .slice(1)}`;
              setTextColor(wordColor);
            }
          }
        }

        const newWhiteout: WhiteoutAnnotation = {
          id: `w_${Date.now()}`,
          x: clickedDetected.x - 2,
          y: clickedDetected.y - 2,
          width: clickedDetected.width + 4,
          height: clickedDetected.height + 4,
        };

        const replacementId = `t_${Date.now()}`;
        const newText: TextAnnotation = {
          id: replacementId,
          x: clickedDetected.x,
          y: clickedDetected.y,
          text: clickedDetected.str,
          fontSize: clickedDetected.fontSize,
          color: wordColor,
          fontFamily,
        };

        setPageEdits({
          ...pageEdits,
          [currentPage]: {
            ...edits,
            whiteouts: [...edits.whiteouts, newWhiteout],
            texts: [...edits.texts, newText],
          },
        });

        setEditingTextId(replacementId);

        if (activeTool === 'select') {
          isDraggingTextRef.current = true;
          dragStartRef.current = { x, y };
          toast.success(`Moving text "${clickedDetected.str}"`);
        } else {
          toast.success(`Editing text "${clickedDetected.str}"`);
        }
        return;
      }
    }

    // 2. Select Mode
    if (activeTool === 'select') {
      setEditingTextId(null);
      return;
    }

    // 3. Add New Text Mode
    if (activeTool === 'text') {
      const newTextId = `t_${Date.now()}`;
      const newText: TextAnnotation = {
        id: newTextId,
        x,
        y,
        text: 'Type text here',
        fontSize: textSize,
        color: textColor,
      };

      setPageEdits({
        ...pageEdits,
        [currentPage]: { ...edits, texts: [...edits.texts, newText] },
      });
      setEditingTextId(newTextId);
      return;
    }

    // 4. Manual Drag Erase / Whiteout Drag Start
    if (activeTool === 'whiteout' || activeTool === 'replaceText') {
      dragStartRef.current = { x, y };
      return;
    }

    // 5. Freehand Pen or Highlighter Mode
    if (activeTool === 'draw' || activeTool === 'highlight') {
      isDrawingRef.current = true;
      currentStrokeRef.current = [{ x, y }];
    }
  };

  // Handle Mouse Move (Live Solid White Section Preview & Smooth Text Reposition Dragging)
  const handleOverlayMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!overlayCanvasRef.current) return;
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edits = getPageEdits(currentPage);

    // Track Mouse Coordinates for Live Blueprint Preview & Dragging
    mousePosRef.current = { x, y };

    // Live Blueprint Ghost Preview for Quick Stamps
    if (activeStampPreset) {
      renderOverlay();
    }

    // Hover detection for Edit Existing Text / Auto Detect Mode
    if (activeTool === 'editText' || activeTool === 'autoDetect') {
      const hovered = detectedTexts.find(
        (dt) => x >= dt.x && x <= dt.x + dt.width && y >= dt.y && y <= dt.y + dt.height
      );
      setHoveredTextId(hovered ? hovered.id : null);
    }

    // Live Solid White Section Drag Feedback (NO BORDER)
    if (dragStartRef.current && (activeTool === 'whiteout' || activeTool === 'replaceText') && !isDraggingTextRef.current) {
      const startX = Math.min(dragStartRef.current.x, x);
      const startY = Math.min(dragStartRef.current.y, y);
      const width = Math.abs(x - dragStartRef.current.x);
      const height = Math.abs(y - dragStartRef.current.y);

      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderOverlay();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX, startY, width, height);
      }
      return;
    }

    // Text Dragging (Reposition text anywhere on PDF page)
    if (isDraggingTextRef.current && editingTextId && dragStartRef.current) {
      const dx = x - dragStartRef.current.x;
      const dy = y - dragStartRef.current.y;
      dragStartRef.current = { x, y };

      const updatedTexts = edits.texts.map((t) => {
        if (t.id === editingTextId) {
          return { ...t, x: t.x + dx, y: t.y + dy };
        }
        return t;
      });

      setPageEdits({
        ...pageEdits,
        [currentPage]: { ...edits, texts: updatedTexts },
      });
      return;
    }

    // Freehand Drawing
    if (isDrawingRef.current && (activeTool === 'draw' || activeTool === 'highlight')) {
      currentStrokeRef.current.push({ x, y });

      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderOverlay();
      ctx.beginPath();
      ctx.moveTo(currentStrokeRef.current[0].x, currentStrokeRef.current[0].y);
      for (let i = 1; i < currentStrokeRef.current.length; i++) {
        ctx.lineTo(currentStrokeRef.current[i].x, currentStrokeRef.current[i].y);
      }
      ctx.strokeStyle = activeTool === 'highlight' ? highlightColor : drawColor;
      ctx.lineWidth = activeTool === 'highlight' ? 16 : drawWidth;
      ctx.globalAlpha = activeTool === 'highlight' ? 0.4 : 1.0;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  };

  // Handle Mouse Up
  const handleOverlayMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!overlayCanvasRef.current) return;
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDraggingTextRef.current = false;

    // Erase Existing Text (Solid White Box + Inline Typing Overlay)
    if (dragStartRef.current && (activeTool === 'whiteout' || activeTool === 'replaceText')) {
      const startX = Math.min(dragStartRef.current.x, x);
      const startY = Math.min(dragStartRef.current.y, y);
      const width = Math.abs(x - dragStartRef.current.x);
      const height = Math.abs(y - dragStartRef.current.y);

      if (width > 4 && height > 4) {
        const edits = getPageEdits(currentPage);
        const newWhiteout: WhiteoutAnnotation = {
          id: `w_${Date.now()}`,
          x: startX,
          y: startY,
          width,
          height,
        };

        let newTexts = edits.texts;
        let replacementId: string | null = null;

        if (activeTool === 'replaceText') {
          replacementId = `t_${Date.now()}`;
          newTexts = [
            ...newTexts,
            {
              id: replacementId,
              x: startX + 2,
              y: startY + 2,
              text: 'Type replacement text',
              fontSize: Math.max(14, Math.round(height * 0.7)),
              color: textColor,
            },
          ];
        }

        setPageEdits({
          ...pageEdits,
          [currentPage]: {
            ...edits,
            whiteouts: [...edits.whiteouts, newWhiteout],
            texts: newTexts,
          },
        });

        if (replacementId) setEditingTextId(replacementId);
        toast.success(
          activeTool === 'replaceText' ? 'Erased text! Type your replacement below.' : 'Erased text region.'
        );
      }
      dragStartRef.current = null;
    }

    if (isDrawingRef.current && (activeTool === 'draw' || activeTool === 'highlight')) {
      isDrawingRef.current = false;
      const edits = getPageEdits(currentPage);
      const newStroke: DrawingStroke = {
        id: `s_${Date.now()}`,
        points: [...currentStrokeRef.current],
        color: activeTool === 'highlight' ? highlightColor : drawColor,
        width: drawWidth,
        isHighlighter: activeTool === 'highlight',
      };
      setPageEdits({
        ...pageEdits,
        [currentPage]: { ...edits, drawings: [...edits.drawings, newStroke] },
      });
      currentStrokeRef.current = [];
    }
  };

  // Image Upload Stamp
  const handleImageStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stampFile = e.target.files?.[0];
    if (!stampFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const edits = getPageEdits(currentPage);
      const newId = `img_${Date.now()}`;
      const newImage: ImageStamp = {
        id: newId,
        x: 60,
        y: 60,
        width: 140,
        height: 140,
        dataUrl,
      };
      setPageEdits({
        ...pageEdits,
        [currentPage]: { ...edits, images: [...edits.images, newImage] },
      });
      setActiveImageId(newId);
      toast.success('Photo added! Use the move handle to place it anywhere on page.');
    };
    reader.readAsDataURL(stampFile);
  };

  // Delete Active Text Element
  const handleDeleteText = (id: string) => {
    const edits = getPageEdits(currentPage);
    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...edits,
        texts: edits.texts.filter((t) => t.id !== id),
      },
    });
    setEditingTextId(null);
    toast.info('Text deleted.');
  };

  // Page Operations
  const handleRotateCurrentPage = () => {
    const edits = getPageEdits(currentPage);
    setPageEdits({
      ...pageEdits,
      [currentPage]: { ...edits, rotation: (edits.rotation + 90) % 360 },
    });
    toast.info('Page rotated 90°');
  };

  const handleDeleteCurrentPage = () => {
    if (numPages - deletedPages.size <= 1) {
      toast.error('Cannot delete all pages from PDF.');
      return;
    }
    const updatedDeleted = new Set(deletedPages);
    updatedDeleted.add(currentPage);
    setDeletedPages(updatedDeleted);
    toast.info(`Page ${currentPage} deleted.`);
  };

  const handleClearCurrentPageEdits = () => {
    setPageEdits({
      ...pageEdits,
      [currentPage]: { texts: [], whiteouts: [], drawings: [], images: [], rotation: 0 },
    });
    setEditingTextId(null);
    toast.info('Cleared all edits on active page.');
  };

  // Export Edited PDF via pdf-lib
  const handleExportPDF = async () => {
    if (!file) return;
    setIsExporting(true);
    toast.info('Rendering and compiling edited PDF...');

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDocLib = await PDFDocument.load(fileBytes);

      // Handle Page Deletions
      const sortedDeleted = Array.from(deletedPages).sort((a, b) => b - a);
      sortedDeleted.forEach((pNum) => {
        if (pNum >= 1 && pNum <= pdfDocLib.getPageCount()) {
          pdfDocLib.removePage(pNum - 1);
        }
      });

      // Handle Page Edits
      const remainingPages = pdfDocLib.getPages();
      const helveticaFont = await pdfDocLib.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDocLib.embedFont(StandardFonts.HelveticaBold);
      const timesFont = await pdfDocLib.embedFont(StandardFonts.TimesRoman);
      const timesBoldFont = await pdfDocLib.embedFont(StandardFonts.TimesRomanBold);
      const courierFont = await pdfDocLib.embedFont(StandardFonts.Courier);
      const courierBoldFont = await pdfDocLib.embedFont(StandardFonts.CourierBold);

      for (let i = 1; i <= numPages; i++) {
        if (deletedPages.has(i)) continue;
        const edits = getPageEdits(i);
        let pageIdx = i - 1;
        sortedDeleted.forEach((del) => {
          if (del < i) pageIdx--;
        });

        if (pageIdx >= 0 && pageIdx < remainingPages.length) {
          const page = remainingPages[pageIdx];
          const { height } = page.getSize();

          // Apply Whiteouts (Solid White, No Border)
          edits.whiteouts.forEach((w) => {
            page.drawRectangle({
              x: w.x / zoom,
              y: height - w.y / zoom - w.height / zoom,
              width: w.width / zoom,
              height: w.height / zoom,
              color: rgb(1, 1, 1),
            });
          });

          // Apply Texts
          edits.texts.forEach((t) => {
            let chosenFont = t.isBold ? helveticaBoldFont : helveticaFont;
            if (t.fontFamily === 'times') {
              chosenFont = t.isBold ? timesBoldFont : timesFont;
            } else if (t.fontFamily === 'courier') {
              chosenFont = t.isBold ? courierBoldFont : courierFont;
            }
            const pdfFontSize = t.fontSize / zoom;

            const hex = (t.color || '#0f172a').replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
            const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
            const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

            page.drawText(t.text, {
              x: t.x / zoom,
              y: height - t.y / zoom - pdfFontSize * 0.82,
              size: pdfFontSize,
              font: chosenFont,
              color: rgb(r, g, b),
            });
          });

          // Apply Photo Stamps
          for (const img of edits.images) {
            try {
              let embeddedImg;
              if (img.dataUrl.startsWith('data:image/png')) {
                embeddedImg = await pdfDocLib.embedPng(img.dataUrl);
              } else {
                embeddedImg = await pdfDocLib.embedJpg(img.dataUrl);
              }
              page.drawImage(embeddedImg, {
                x: img.x / zoom,
                y: height - img.y / zoom - img.height / zoom,
                width: img.width / zoom,
                height: img.height / zoom,
              });
            } catch (imgErr) {
              console.error('Failed to embed image in PDF export', imgErr);
            }
          }
        }
      }

      const pdfBytes = await pdfDocLib.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `edited-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      toast.success('Edited PDF exported successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to export PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // Stamp Presets (Click button -> Click anywhere on page to place!)
  const handleAddStampPreset = (presetType: 'date' | 'signature' | 'check' | 'cross') => {
    if (activeStampPreset === presetType) {
      setActiveStampPreset(null);
      toast.info('Stamp placement cancelled');
    } else {
      setActiveStampPreset(presetType);
      toast.info(`Click anywhere on the PDF page to place ${presetType} stamp`);
    }
  };

  const currentEdits = getPageEdits(currentPage);
  const activeEditingTextObj = currentEdits.texts.find((t) => t.id === editingTextId);

  return (
    <ToolLayout
      slug="/pdf/edit"
      title="Interactive PDF Editor"
      subtitle="Auto-detect existing text to erase and edit in matching font size, or drag manually to erase & type replacement text live on page."
      badgeText="Seamless Whiteout & Authentic Text Engine"
      noCardWrapper={true}
    >
      {!file ? (
        <div className="max-w-2xl mx-auto p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-white shadow-sm transition-all text-center space-y-4 my-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Upload PDF to Edit</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              Select any PDF file to open in the visual interactive editor. 100% private client-side processing.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
            <FileText className="w-4 h-4" />
            <span>Select PDF File</span>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="space-y-2.5 pb-24 sm:pb-6 text-slate-900">
          {/* Top Studio Header Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 sm:p-3 space-y-2">
            {/* Top Row: File Name & Page Navigation (Left) + Download Action (Right) */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-slate-900 max-w-[140px] sm:max-w-[220px] truncate" title={file.name}>
                    {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 text-slate-900 disabled:opacity-40 font-black text-[11px]"
                  >
                    Prev
                  </button>
                  <span className="font-black text-xs text-indigo-950 px-1.5">
                    {currentPage}/{numPages}
                  </span>
                  <button
                    disabled={currentPage >= numPages}
                    onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                    className="px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 text-slate-900 disabled:opacity-40 font-black text-[11px]"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleRotateCurrentPage}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Rotate Page 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDeleteCurrentPage}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download PDF</span>
              </button>
            </div>

            {/* Second Row: Primary Tool Action Pills (Full-Width so ALL options are 100% visible on Desktop) */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTool('editText')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'editText' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
                title="Click existing PDF text to edit directly in matching font & color"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Text</span>
              </button>
              <button
                onClick={() => setActiveTool('select')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'select' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
                title="Click & Drag to reposition text anywhere on page"
              >
                <MousePointer className="w-3.5 h-3.5 text-blue-400" />
                <span>Move</span>
              </button>
              <button
                onClick={() => setActiveTool('pan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'pan' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
                title="Drag anywhere to scroll/pan zoomed page view"
              >
                <Hand className="w-3.5 h-3.5 text-amber-400" />
                <span>Pan</span>
              </button>
              <button
                onClick={() => setActiveTool('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'text' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-indigo-500" />
                <span>Type</span>
              </button>
              <button
                onClick={() => setActiveTool('replaceText')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'replaceText' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Eraser className="w-3.5 h-3.5 text-amber-500" />
                <span>Erase</span>
              </button>
              <button
                onClick={() => setActiveTool('draw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'draw' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-sky-500" />
                <span>Pen</span>
              </button>
              <button
                onClick={() => setActiveTool('highlight')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
                  activeTool === 'highlight' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-400" />
                <span>Highlight</span>
              </button>
              <label className="px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-white flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Image</span>
                <input type="file" accept="image/*" onChange={handleImageStampUpload} className="hidden" />
              </label>
            </div>

            {/* Secondary Options Row (Typography, Swatches, Grid & Stamps) */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 text-slate-900 rounded-lg px-2 py-1 font-bold text-xs focus:outline-none"
                >
                  <option value="helvetica">Helvetica</option>
                  <option value="times">Times</option>
                  <option value="courier">Courier</option>
                </select>

                <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-0.5">
                  <button
                    onClick={() => setTextSize((s) => Math.max(8, s - 2))}
                    className="p-1 text-slate-700 font-black hover:bg-white rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-1 font-black text-xs min-w-[28px] text-center">{textSize}px</span>
                  <button
                    onClick={() => setTextSize((s) => Math.min(72, s + 2))}
                    className="p-1 text-slate-700 font-black hover:bg-white rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-1">
                  {['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#d97706'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => setTextColor(hex)}
                      className={`w-4 h-4 rounded-full border border-white transition-all ${
                        textColor === hex ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-4 h-4 rounded-full cursor-pointer border-0 p-0"
                  />
                </div>

                <button
                  onClick={() => setShowGrid((g) => !g)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border transition-all ${
                    showGrid ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  <span>Grid</span>
                </button>
              </div>

              {/* Stamps & Zoom Controls */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                    className="px-1.5 font-black text-xs text-slate-700 hover:bg-white rounded"
                  >
                    -
                  </button>
                  <span className="font-black text-[11px] text-slate-900 px-1">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
                    className="px-1.5 font-black text-xs text-slate-700 hover:bg-white rounded"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAddStampPreset('date')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      activeStampPreset === 'date' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Date
                  </button>
                  <button
                    onClick={() => handleAddStampPreset('signature')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      activeStampPreset === 'signature' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Signature
                  </button>
                  <button
                    onClick={() => handleAddStampPreset('check')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      activeStampPreset === 'check' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    ✓ Check
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive PDF Page Canvas Viewport (Studio Backdrop) */}
          <div
            ref={workspaceRef}
            className={`bg-slate-200/70 rounded-2xl border border-slate-300/70 overflow-x-auto overflow-y-auto max-h-[78vh] sm:max-h-[82vh] shadow-inner w-full relative transition-all touch-pan-x touch-pan-y ${
              activeTool === 'pan' || isSpacePressed ? 'cursor-grab active:cursor-grabbing select-none' : ''
            }`}
            onPointerDown={(e) => {
              if (activeTool === 'pan' || isSpacePressed || e.button === 1) {
                isPanningRef.current = true;
                panStartRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  scrollLeft: workspaceRef.current?.scrollLeft || 0,
                  scrollTop: workspaceRef.current?.scrollTop || 0,
                };
                if (e.currentTarget.setPointerCapture) {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {}
                }
              }
            }}
            onPointerMove={(e) => {
              if (isPanningRef.current && panStartRef.current && workspaceRef.current) {
                const dx = e.clientX - panStartRef.current.x;
                const dy = e.clientY - panStartRef.current.y;
                workspaceRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
                workspaceRef.current.scrollTop = panStartRef.current.scrollTop - dy;
              }
            }}
            onPointerUp={(e) => {
              if (isPanningRef.current) {
                isPanningRef.current = false;
                panStartRef.current = null;
                if (e.currentTarget.releasePointerCapture) {
                  try {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  } catch {}
                }
              }
            }}
          >
            <div className="min-w-max min-h-full inline-flex items-center justify-center p-2 sm:p-8">
              {deletedPages.has(currentPage) ? (
                <div className="p-12 bg-white rounded-3xl text-center space-y-3 border border-slate-200 shadow-md">
                  <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
                  <h4 className="text-lg font-black text-slate-900">Page {currentPage} Marked for Deletion</h4>
                  <button
                    onClick={() => {
                      const nextDel = new Set(deletedPages);
                      nextDel.delete(currentPage);
                      setDeletedPages(nextDel);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Restore Page
                  </button>
                </div>
              ) : (
                <div className="relative shadow-2xl rounded-2xl bg-white border border-slate-200 inline-block shrink-0">
                <canvas ref={canvasRef} className="block" />
                <canvas
                  ref={overlayCanvasRef}
                  className={`absolute top-0 left-0 ${
                    ['draw', 'highlight', 'whiteout', 'replaceText'].includes(activeTool)
                      ? 'touch-none'
                      : 'touch-pan-x touch-pan-y'
                  } ${
                    activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
                  }`}
                  onMouseDown={handleOverlayMouseDown}
                  onMouseMove={handleOverlayMouseMove}
                  onMouseUp={handleOverlayMouseUp}
                  onTouchStart={(e) => {
                    if (e.touches.length === 2 && workspaceRef.current) {
                      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                      touchPanStartRef.current = {
                        x: midX,
                        y: midY,
                        scrollLeft: workspaceRef.current.scrollLeft,
                        scrollTop: workspaceRef.current.scrollTop,
                      };
                    } else if (e.touches.length === 1 && workspaceRef.current && activeTool === 'pan') {
                      isPanningRef.current = true;
                      panStartRef.current = {
                        x: e.touches[0].clientX,
                        y: e.touches[0].clientY,
                        scrollLeft: workspaceRef.current.scrollLeft,
                        scrollTop: workspaceRef.current.scrollTop,
                      };
                    }
                  }}
                  onTouchMove={(e) => {
                    if (e.touches.length === 2 && touchPanStartRef.current && workspaceRef.current) {
                      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                      const dx = midX - touchPanStartRef.current.x;
                      const dy = midY - touchPanStartRef.current.y;
                      workspaceRef.current.scrollLeft = touchPanStartRef.current.scrollLeft - dx;
                      workspaceRef.current.scrollTop = touchPanStartRef.current.scrollTop - dy;
                      return;
                    }
                    if (isPanningRef.current && panStartRef.current && workspaceRef.current && e.touches.length === 1) {
                      const dx = e.touches[0].clientX - panStartRef.current.x;
                      const dy = e.touches[0].clientY - panStartRef.current.y;
                      workspaceRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
                      workspaceRef.current.scrollTop = panStartRef.current.scrollTop - dy;
                    }
                  }}
                  onTouchEnd={() => {
                    isPanningRef.current = false;
                    panStartRef.current = null;
                    touchPanStartRef.current = null;
                  }}
                />

                {activeEditingTextObj && (
                  <div
                    className="absolute z-30 group p-0 m-0 border-b border-indigo-500/80"
                    style={{
                      left: `${activeEditingTextObj.x}px`,
                      top: `${activeEditingTextObj.y}px`,
                      lineHeight: 1.0,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTextId(null);
                      toast.success('Text placed!');
                    }}
                  >
                    {/* Floating Light Mode Mini Control Bar */}
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute bg-white text-slate-900 rounded-2xl shadow-2xl px-2.5 py-1.5 flex items-center gap-1.5 border border-slate-200 text-xs z-50 pointer-events-auto max-w-[85vw] overflow-x-auto no-scrollbar ${
                        activeEditingTextObj.y < 45 ? 'top-full mt-2' : '-top-12'
                      } ${activeEditingTextObj.x > 180 ? 'right-0' : 'left-0'}`}
                    >
                      {activeTool === 'select' ? (
                        /* MOVE ONLY CONTROL BAR */
                        <>
                          <div
                            className="cursor-move px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 flex items-center gap-1.5 font-black text-[11px]"
                            title="Click & Drag to reposition text anywhere, or use Arrow keys (1px nudge)"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              isDraggingTextRef.current = true;
                              dragStartRef.current = { x: e.clientX, y: e.clientY };
                            }}
                          >
                            <Move className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Drag / Nudge Position</span>
                          </div>

                          <div className="h-3 w-px bg-slate-200" />

                          <button
                            onClick={() => {
                              setEditingTextId(null);
                              toast.success('Position locked!');
                            }}
                            className="px-2.5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            title="Lock and drop position"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Lock Position</span>
                          </button>

                          <div className="h-3 w-px bg-slate-200" />

                          <button
                            onClick={() => handleDeleteText(editingTextId!)}
                            className="text-rose-600 hover:text-rose-700 p-0.5"
                            title="Delete text"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        /* ALL EDIT OPTIONS CONTROL BAR (NO MOVE OPTION - EDIT ONLY) */
                        <>
                          {/* DONE / LOCK BUTTON */}
                          <button
                            onClick={() => {
                              setEditingTextId(null);
                              toast.success('Text placed!');
                            }}
                            className="px-2.5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            title="Lock and drop text onto page (or press Enter key)"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Done / Drop</span>
                          </button>

                          <div className="h-3 w-px bg-slate-200" />

                          {/* Font Family Selector */}
                          <select
                            value={activeEditingTextObj.fontFamily || 'helvetica'}
                            onChange={(e) => {
                              const newFam = e.target.value as any;
                              setPageEdits({
                                ...pageEdits,
                                [currentPage]: {
                                  ...currentEdits,
                                  texts: currentEdits.texts.map((t) =>
                                    t.id === editingTextId ? { ...t, fontFamily: newFam } : t
                                  ),
                                },
                              });
                            }}
                            className="bg-slate-100 text-slate-900 rounded-lg px-1.5 py-0.5 border border-slate-200 font-bold text-[11px]"
                          >
                            <option value="helvetica">Helvetica</option>
                            <option value="times">Times</option>
                            <option value="courier">Courier</option>
                          </select>

                          <select
                            value={activeEditingTextObj.fontSize}
                            onChange={(e) => {
                              const newSize = Number(e.target.value);
                              setPageEdits({
                                ...pageEdits,
                                [currentPage]: {
                                  ...currentEdits,
                                  texts: currentEdits.texts.map((t) =>
                                    t.id === editingTextId ? { ...t, fontSize: newSize } : t
                                  ),
                                },
                              });
                            }}
                            className="bg-slate-100 text-slate-900 rounded-lg px-1.5 py-0.5 border border-slate-200 font-bold text-[11px]"
                          >
                            <option value={12}>12px</option>
                            <option value={14}>14px</option>
                            <option value={16}>16px</option>
                            <option value={18}>18px</option>
                            <option value={20}>20px</option>
                            <option value={24}>24px</option>
                            <option value={32}>32px</option>
                          </select>

                          <input
                            type="color"
                            value={activeEditingTextObj.color}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              setPageEdits({
                                ...pageEdits,
                                [currentPage]: {
                                  ...currentEdits,
                                  texts: currentEdits.texts.map((t) =>
                                    t.id === editingTextId ? { ...t, color: newColor } : t
                                  ),
                                },
                              });
                            }}
                            className="w-5 h-5 rounded-full cursor-pointer border-0"
                          />

                          <button
                            onClick={() => {
                              setPageEdits({
                                ...pageEdits,
                                [currentPage]: {
                                  ...currentEdits,
                                  texts: currentEdits.texts.map((t) =>
                                    t.id === editingTextId ? { ...t, isBold: !t.isBold } : t
                                  ),
                                },
                              });
                            }}
                            className={`p-1 rounded-lg hover:bg-slate-100 ${
                              activeEditingTextObj.isBold ? 'bg-indigo-600 text-white' : 'text-slate-700'
                            }`}
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setPageEdits({
                                ...pageEdits,
                                [currentPage]: {
                                  ...currentEdits,
                                  texts: currentEdits.texts.map((t) =>
                                    t.id === editingTextId ? { ...t, isItalic: !t.isItalic } : t
                                  ),
                                },
                              });
                            }}
                            className={`p-1 rounded-lg hover:bg-slate-100 ${
                              activeEditingTextObj.isItalic ? 'bg-indigo-600 text-white' : 'text-slate-700'
                            }`}
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-3 w-px bg-slate-200" />

                          <button
                            onClick={() => handleDeleteText(editingTextId!)}
                            className="text-rose-600 hover:text-rose-700 p-0.5"
                            title="Delete text"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Live Inline Typing Input Box */}
                    <input
                      type="text"
                      readOnly={activeTool === 'select'}
                      autoFocus={activeTool !== 'select'}
                      value={activeEditingTextObj.text}
                      onChange={(e) => {
                        const newText = e.target.value;
                        setPageEdits({
                          ...pageEdits,
                          [currentPage]: {
                            ...currentEdits,
                            texts: currentEdits.texts.map((t) =>
                              t.id === editingTextId ? { ...t, text: newText } : t
                            ),
                          },
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') {
                          setEditingTextId(null);
                        }
                      }}
                      className={`bg-transparent border-none text-slate-900 font-medium focus:outline-none p-0 m-0 max-w-[90vw] leading-none ${
                        activeTool === 'select' ? 'cursor-move select-none' : ''
                      }`}
                      style={{
                        fontSize: `${activeEditingTextObj.fontSize}px`,
                        color: activeEditingTextObj.color,
                        fontWeight: activeEditingTextObj.isBold ? 'bold' : 'normal',
                        fontStyle: activeEditingTextObj.isItalic ? 'italic' : 'normal',
                        fontFamily:
                          activeEditingTextObj.fontFamily === 'times'
                            ? 'serif'
                            : activeEditingTextObj.fontFamily === 'courier'
                            ? 'monospace'
                            : 'sans-serif',
                        lineHeight: 1.0,
                        width: `${Math.max(
                          60,
                          activeEditingTextObj.text.length * (activeEditingTextObj.fontSize * 0.58) + 16
                        )}px`,
                      }}
                    />
                  </div>
                )}

                {/* Interactive Photo Stamp Control Boxes with Precision Drag Move Handles & Resizing */}
                {currentEdits.images.map((img) => {
                  const isActive = activeImageId === img.id;
                  return (
                    <div
                      key={img.id}
                      className={`absolute z-30 group rounded-lg ${
                        isActive
                          ? 'ring-2 ring-blue-500 ring-offset-1 shadow-2xl cursor-move'
                          : 'hover:ring-1 hover:ring-blue-400/80 cursor-pointer'
                      }`}
                      style={{
                        left: `${img.x}px`,
                        top: `${img.y}px`,
                        width: `${img.width}px`,
                        height: `${img.height}px`,
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveImageId(img.id);
                        activeImageIdRef.current = img.id;
                        isDraggingImageRef.current = true;
                        dragStartRef.current = { x: e.clientX, y: e.clientY };
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setActiveImageId(img.id);
                        activeImageIdRef.current = img.id;
                        isDraggingImageRef.current = true;
                        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                      }}
                    >
                      {/* Photo Image Frame */}
                      <img
                        src={img.dataUrl}
                        alt="Uploaded Photo Stamp"
                        className="w-full h-full object-contain pointer-events-none rounded-lg"
                      />

                      {/* Floating Control Toolbar for Active Photo Stamp */}
                      {isActive && (
                        <div
                          className={`absolute z-40 bg-slate-900/95 backdrop-blur-md text-white px-2 py-1 rounded-xl shadow-2xl flex items-center gap-1.5 text-xs pointer-events-auto max-w-[85vw] overflow-x-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150 ${
                            img.y < 45 ? 'top-full mt-2' : '-top-11'
                          } ${img.x > 150 || img.x + img.width > 240 ? 'right-0' : 'left-0'}`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Drag Move Handle */}
                          <div
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg text-white font-black text-xs cursor-move select-none active:scale-95 transition-all shadow-xs"
                            title="Click & Drag to position photo anywhere on PDF page"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              isDraggingImageRef.current = true;
                              dragStartRef.current = { x: e.clientX, y: e.clientY };
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              isDraggingImageRef.current = true;
                              dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                            }}
                          >
                            <Move className="w-3.5 h-3.5" />
                            <span>Move</span>
                          </div>

                          {/* Shrink (-) Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageEdits((prev) => ({
                                ...prev,
                                [currentPage]: {
                                  ...currentEdits,
                                  images: currentEdits.images.map((i) =>
                                    i.id === img.id
                                      ? {
                                          ...i,
                                          width: Math.max(30, i.width - 20),
                                          height: Math.max(30, i.height - 20),
                                        }
                                      : i
                                  ),
                                },
                              }));
                            }}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 cursor-pointer"
                            title="Shrink photo"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] font-mono text-slate-300 font-bold px-0.5 select-none">
                            {Math.round(img.width)}px
                          </span>

                          {/* Enlarge (+) Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageEdits((prev) => ({
                                ...prev,
                                [currentPage]: {
                                  ...currentEdits,
                                  images: currentEdits.images.map((i) =>
                                    i.id === img.id
                                      ? { ...i, width: i.width + 20, height: i.height + 20 }
                                      : i
                                  ),
                                },
                              }));
                            }}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 cursor-pointer"
                            title="Enlarge photo"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-3 w-px bg-slate-700 mx-0.5" />

                          {/* Delete Photo Stamp Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageEdits((prev) => ({
                                ...prev,
                                [currentPage]: {
                                  ...currentEdits,
                                  images: currentEdits.images.filter((i) => i.id !== img.id),
                                },
                              }));
                              setActiveImageId(null);
                              toast.info('Photo stamp deleted');
                            }}
                            className="p-1 rounded-lg hover:bg-rose-600/80 text-rose-400 hover:text-white cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Lock Position Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageId(null);
                              toast.success('Photo position locked!');
                            }}
                            className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                            title="Lock photo position"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Download Action Bar (Positioned directly above "Sponsored Offer" ad box in both mobile & desktop views) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-900 mt-3 sm:mt-4">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Finished editing your PDF?</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Download your updated document with all text edits & annotations preserved.</p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    )}

      {/* Liquid Glass Floating Mobile Action Navbar for 100% Mobile Accessibility & Ultra Responsiveness */}
      {file && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white/85 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-3xl p-2 flex items-center justify-between gap-1 sm:hidden text-slate-900 pointer-events-auto">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-1 max-w-full">
            {/* 1. Edit Existing PDF Text (Default) */}
            <button
              onClick={() => setActiveTool('editText')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'editText'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Text</span>
            </button>

            {/* 2. Move / Reposition Text */}
            <button
              onClick={() => setActiveTool('select')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'select'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5 text-blue-400" />
              <span>Move Text</span>
            </button>

            {/* 3. Pan / Scroll View */}
            <button
              onClick={() => setActiveTool('pan')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'pan'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Hand className="w-3.5 h-3.5 text-amber-400" />
              <span>Pan View</span>
            </button>

            {/* 3. Type New Text */}
            <button
              onClick={() => setActiveTool('text')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'text'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Type</span>
            </button>

            {/* 4. Manual Drag Erase */}
            <button
              onClick={() => setActiveTool('replaceText')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'replaceText'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5 text-amber-500" />
              <span>Erase</span>
            </button>

            {/* 5. Pen Draw */}
            <button
              onClick={() => setActiveTool('draw')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'draw'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-sky-500" />
              <span>Pen</span>
            </button>

            {/* 6. Highlight */}
            <button
              onClick={() => setActiveTool('highlight')}
              className={`px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeTool === 'highlight'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-400" />
              <span>Highlight</span>
            </button>
          </div>

          {/* Mobile Export Action Pill Button */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
