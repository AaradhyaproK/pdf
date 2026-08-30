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
}

interface WhiteoutAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DrawStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  isHighlighter?: boolean;
}

interface ImageAnnotation {
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
  drawings: DrawStroke[];
  images: ImageAnnotation[];
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
  const [zoom] = useState<number>(1.2);
  const [activeTool, setActiveTool] = useState<
    'autoDetect' | 'select' | 'text' | 'replaceText' | 'whiteout' | 'draw' | 'highlight' | 'image'
  >('autoDetect');

  // Tool Style Settings
  const [textColor, setTextColor] = useState<string>('#1e293b');
  const [textSize, setTextSize] = useState<number>(18);
  const [drawColor, setDrawColor] = useState<string>('#2563eb');
  const [drawWidth] = useState<number>(3);
  const [highlightColor] = useState<string>('#fde047');

  // Auto Detected Text Items on current page
  const [detectedTexts, setDetectedTexts] = useState<DetectedTextItem[]>([]);
  const [hoveredTextId, setHoveredTextId] = useState<string | null>(null);

  // Inline Active Editing State
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

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
  const isDraggingTextRef = useRef<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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

    // Cancel any previous render task on canvas
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // Ignore cancellation error
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

      // Render Base Canvas with safe task reference
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

      // Extract PDF Text Content & Group Items into Full Complete Lines
      try {
        const textContent = await page.getTextContent();
        const lineGroups: Record<number, any[]> = {};

        textContent.items.forEach((item: any) => {
          if (item.str && item.str.trim().length > 0) {
            const pdfY = Math.round(item.transform[5] / 6) * 6; // Group by 6pt baseline threshold
            if (!lineGroups[pdfY]) lineGroups[pdfY] = [];
            lineGroups[pdfY].push(item);
          }
        });

        const detectedItems: DetectedTextItem[] = [];
        let idx = 0;

        Object.values(lineGroups).forEach((itemsOnLine) => {
          // Sort line items horizontally left to right
          itemsOnLine.sort((a, b) => a.transform[4] - b.transform[4]);

          const fullLineText = itemsOnLine.map((it) => it.str).join(' ');
          const firstItem = itemsOnLine[0];
          const lastItem = itemsOnLine[itemsOnLine.length - 1];

          const pdfX = firstItem.transform[4];
          const pdfY = firstItem.transform[5];
          const totalPdfWidth = lastItem.transform[4] + (lastItem.width || 40) - pdfX;
          const itemHeight = Math.abs(firstItem.transform[3]) || firstItem.height || 14;

          const v1 = viewport.convertToViewportPoint(pdfX, pdfY);
          const v2 = viewport.convertToViewportPoint(pdfX + totalPdfWidth, pdfY + itemHeight);

          const rx = Math.min(v1[0], v2[0]);
          const ry = Math.min(v1[1], v2[1]);
          const rw = Math.max(20, Math.abs(v2[0] - v1[0]));
          const rh = Math.max(12, Math.abs(v2[1] - v1[1]));

          detectedItems.push({
            id: `dt_line_${idx++}_${Date.now()}`,
            str: fullLineText,
            x: rx,
            y: ry,
            width: rw,
            height: rh,
            fontSize: Math.max(12, Math.round(rh * 0.82)),
          });
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

  // Render Overlays (Clean, Realistic - NO Blue Dashed Line Over Erased / Edited Text)
  const renderOverlay = useCallback(
    (detectedList = detectedTexts) => {
      if (!overlayCanvasRef.current) return;
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const edits = getPageEdits(currentPage);

      // 1. Draw Auto-Detected PDF Text Line Highlights
      if (activeTool === 'autoDetect') {
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
            ctx.fillStyle = isHovered ? 'rgba(59, 130, 246, 0.18)' : 'rgba(99, 102, 241, 0.05)';
            ctx.fillRect(dt.x, dt.y, dt.width, dt.height);
          }
        });
      }

      // 2. Draw Whiteouts (Solid Pure White, ZERO Borders)
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
          const fontStyle = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${t.fontSize}px sans-serif`;
          ctx.font = fontStyle;
          ctx.fillStyle = t.color;
          ctx.textBaseline = 'top';
          ctx.fillText(t.text, t.x, t.y);
        }
      });
    },
    [currentPage, getPageEdits, activeTool, hoveredTextId, detectedTexts, editingTextId]
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

    // 0. Check if user clicked on ANY existing typed text element -> Select & enable drag moving!
    const clickedExistingText = edits.texts.find((t) => {
      const ctx = overlayCanvasRef.current?.getContext('2d');
      if (!ctx) return false;
      ctx.font = `${t.fontSize}px sans-serif`;
      const metrics = ctx.measureText(t.text);
      return x >= t.x - 4 && x <= t.x + metrics.width + 4 && y >= t.y - 2 && y <= t.y + t.fontSize + 4;
    });

    if (clickedExistingText) {
      setEditingTextId(clickedExistingText.id);
      isDraggingTextRef.current = true;
      dragStartRef.current = { x, y };
      return;
    }

    // Auto-commit/drop active text when clicking outside on empty canvas area
    if (editingTextId) {
      setEditingTextId(null);
    }

    // 1. AUTO DETECT MODE: Click any full text line to auto-erase & replace full sentence!
    if (activeTool === 'autoDetect') {
      const clickedDetected = detectedTexts.find(
        (dt) => x >= dt.x && x <= dt.x + dt.width && y >= dt.y && y <= dt.y + dt.height
      );

      if (clickedDetected) {
        const newWhiteout: WhiteoutAnnotation = {
          id: `w_${Date.now()}`,
          x: clickedDetected.x - 2,
          y: clickedDetected.y - 2,
          width: clickedDetected.width + 6,
          height: clickedDetected.height + 4,
        };

        const replacementId = `t_${Date.now()}`;
        const newText: TextAnnotation = {
          id: replacementId,
          x: clickedDetected.x,
          y: clickedDetected.y,
          text: clickedDetected.str,
          fontSize: clickedDetected.fontSize,
          color: textColor,
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
        toast.success(`Auto-erased line! Edit full sentence below.`);
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

    // Hover detection for Auto Detect Mode
    if (activeTool === 'autoDetect') {
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
      const newStroke: DrawStroke = {
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
      const newImage: ImageAnnotation = {
        id: `img_${Date.now()}`,
        x: 50,
        y: 50,
        width: 120,
        height: 120,
        dataUrl,
      };
      setPageEdits({
        ...pageEdits,
        [currentPage]: { ...edits, images: [...edits.images, newImage] },
      });
      toast.success('Image stamp added to page!');
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
            const chosenFont = t.isBold ? helveticaBoldFont : helveticaFont;
            const pdfFontSize = t.fontSize / zoom;
            page.drawText(t.text, {
              x: t.x / zoom,
              y: height - t.y / zoom - pdfFontSize * 0.82,
              size: pdfFontSize,
              font: chosenFont,
              color: rgb(0.1, 0.1, 0.2),
            });
          });
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

  const currentEdits = getPageEdits(currentPage);
  const activeEditingTextObj = currentEdits.texts.find((t) => t.id === editingTextId);

  return (
    <ToolLayout
      slug="/pdf/edit"
      title="Interactive PDF Editor"
      subtitle="Auto-detect existing text to erase and edit in matching font size, or drag manually to erase & type replacement text live on page."
      badgeText="Seamless Whiteout & Authentic Text Engine"
    >
      {!file ? (
        <div className="p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Upload PDF to Edit</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Select any PDF file to open in the visual interactive editor. Zero server uploads guaranteed.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
            <FileText className="w-4 h-4" />
            <span>Select PDF File</span>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Interactive Main Toolbar */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Primary Editing Tools */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTool('autoDetect')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors ${
                    activeTool === 'autoDetect' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Click any text line on the PDF page to auto-erase & edit full sentence"
                >
                  <Target className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Auto Detect & Erase Text</span>
                </button>

                <button
                  onClick={() => setActiveTool('replaceText')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'replaceText' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Click & Drag over existing PDF text to erase & type replacement directly"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Manual Drag Erase</span>
                </button>

                <button
                  onClick={() => setActiveTool('text')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Click anywhere on PDF to type text directly"
                >
                  <Type className="w-4 h-4" />
                  <span>Type Text</span>
                </button>

                <button
                  onClick={() => setActiveTool('select')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'select' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Click & Drag existing text annotations to move or edit"
                >
                  <MousePointer className="w-4 h-4" />
                  <span>Select / Move Text</span>
                </button>

                <button
                  onClick={() => setActiveTool('whiteout')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'whiteout' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Drag to erase content with whiteout"
                >
                  <Eraser className="w-4 h-4" />
                  <span>Whiteout</span>
                </button>

                <button
                  onClick={() => setActiveTool('draw')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'draw' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Draw Pen</span>
                </button>

                <button
                  onClick={() => setActiveTool('highlight')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'highlight' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Highlighter className="w-4 h-4 text-amber-300" />
                  <span>Highlight</span>
                </button>

                <label className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  <span>Add Image</span>
                  <input type="file" accept="image/*" onChange={handleImageStampUpload} className="hidden" />
                </label>
              </div>

              {/* Download Action */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 min-h-[38px]"
              >
                {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download Edited PDF</span>
              </button>
            </div>

            {/* Contextual Navigation & Page Manipulation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold"
                  >
                    Prev Page
                  </button>
                  <span className="font-extrabold text-indigo-300">
                    Page {currentPage} of {numPages}
                  </span>
                  <button
                    disabled={currentPage >= numPages}
                    onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold"
                  >
                    Next Page
                  </button>
                </div>

                {activeTool === 'replaceText' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Click and drag over any PDF text to erase it and type replacement text directly!</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRotateCurrentPage}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Rotate Page 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearCurrentPageEdits}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Clear Page Edits"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteCurrentPage}
                  className="p-2 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-300"
                  title="Delete Page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive PDF Page Canvas Workspace with INLINE TYPING OVERLAY */}
          <div className="bg-slate-200 p-6 sm:p-8 rounded-3xl flex items-center justify-center overflow-auto min-h-[500px]">
            {deletedPages.has(currentPage) ? (
              <div className="p-12 bg-white rounded-2xl text-center space-y-3">
                <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
                <h4 className="text-lg font-black text-slate-900">Page {currentPage} Marked for Deletion</h4>
                <button
                  onClick={() => {
                    const nextDel = new Set(deletedPages);
                    nextDel.delete(currentPage);
                    setDeletedPages(nextDel);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Restore Page
                </button>
              </div>
            ) : (
              <div className="relative shadow-2xl rounded-xl bg-white border border-slate-300 inline-block overflow-hidden">
                <canvas ref={canvasRef} className="block" />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute top-0 left-0 cursor-crosshair touch-none"
                  onMouseDown={handleOverlayMouseDown}
                  onMouseMove={handleOverlayMouseMove}
                  onMouseUp={handleOverlayMouseUp}
                />

                {activeEditingTextObj && (
                  <div
                    className="absolute z-30 group"
                    style={{
                      left: `${activeEditingTextObj.x}px`,
                      top: `${activeEditingTextObj.y}px`,
                    }}
                  >
                    {/* Floating Mini Control Bar */}
                    <div className="absolute -top-10 left-0 bg-slate-900 text-white rounded-xl shadow-xl px-2.5 py-1 flex items-center gap-2 border border-slate-700 text-xs whitespace-nowrap">
                      {/* MOVE / REPOSITION DRAG HANDLE */}
                      <div
                        className="cursor-move p-1 rounded hover:bg-slate-800 text-indigo-300 flex items-center gap-1 font-bold"
                        title="Click & Drag handle to reposition text anywhere on page"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          isDraggingTextRef.current = true;
                          dragStartRef.current = { x: e.clientX, y: e.clientY };
                        }}
                      >
                        <Move className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px]">Move</span>
                      </div>

                      <div className="h-3 w-px bg-slate-700" />

                      {/* EASY DONE DROP BUTTON */}
                      <button
                        onClick={() => setEditingTextId(null)}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                        title="Lock and drop text onto page"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done / Drop</span>
                      </button>

                      <div className="h-3 w-px bg-slate-700" />

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
                        className="bg-slate-800 text-white rounded px-1.5 py-0.5 border border-slate-700 font-bold text-[11px]"
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
                        className="w-5 h-5 rounded cursor-pointer border-0"
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
                        className={`p-1 rounded hover:bg-slate-800 ${
                          activeEditingTextObj.isBold ? 'bg-indigo-600 text-white' : 'text-slate-300'
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
                        className={`p-1 rounded hover:bg-slate-800 ${
                          activeEditingTextObj.isItalic ? 'bg-indigo-600 text-white' : 'text-slate-300'
                        }`}
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-3 w-px bg-slate-700" />

                      <button
                        onClick={() => handleDeleteText(editingTextId!)}
                        className="text-rose-400 hover:text-rose-300 p-0.5"
                        title="Delete text"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Live Inline Typing Input Box (Auto Expands to Show Full Line / Complete Sentence) */}
                    <input
                      type="text"
                      autoFocus
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
                      className="bg-transparent border-b border-indigo-400/60 text-slate-900 font-medium focus:outline-none p-0 max-w-[90vw]"
                      style={{
                        fontSize: `${activeEditingTextObj.fontSize}px`,
                        color: activeEditingTextObj.color,
                        fontWeight: activeEditingTextObj.isBold ? 'bold' : 'normal',
                        fontStyle: activeEditingTextObj.isItalic ? 'italic' : 'normal',
                        lineHeight: 1.0,
                        width: `${Math.max(
                          350,
                          activeEditingTextObj.text.length * (activeEditingTextObj.fontSize * 0.62) + 50
                        )}px`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
