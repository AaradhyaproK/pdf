'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Upload,
  RefreshCw,
  Camera,
  MoveUp,
  MoveDown,
  Trash2,
  Sparkles,
  FileText,
  Plus,
  SlidersHorizontal,
  Download,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Contrast,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Check,
  Sun,
  Layout,
  Maximize2,
  FileCheck,
  Settings2,
  Crop,
} from 'lucide-react';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import { DocCropperModal, Point } from '@/components/DocCropperModal';

export type FilterType = 'original' | 'bw_scan' | 'grayscale' | 'magic_color';
export type QualityPreset = 'balanced' | 'high' | 'compact' | 'ultra';
export type PageSizeType = 'a4' | 'letter' | 'legal' | 'executive' | 'fit';
export type OrientationType = 'auto' | 'portrait' | 'landscape';

interface QualityConfig {
  maxDimension: number;
  jpegQuality: number;
  label: string;
  badge: string;
}

const QUALITY_PRESETS: Record<QualityPreset, QualityConfig> = {
  balanced: {
    maxDimension: 1920,
    jpegQuality: 0.8,
    label: 'Balanced',
    badge: '~1-3 MB',
  },
  compact: {
    maxDimension: 1280,
    jpegQuality: 0.65,
    label: 'Compact',
    badge: '<1 MB',
  },
  high: {
    maxDimension: 2800,
    jpegQuality: 0.92,
    label: 'HD Print',
    badge: '~4-7 MB',
  },
  ultra: {
    maxDimension: 1024,
    jpegQuality: 0.5,
    label: 'Ultra Small',
    badge: '<500 KB',
  },
};

const SCAN_FILTERS: { id: FilterType; label: string; icon: any }[] = [
  { id: 'original', label: 'Original', icon: ImageIcon },
  { id: 'bw_scan', label: 'B&W Scan', icon: FileText },
  { id: 'grayscale', label: 'Grayscale', icon: Contrast },
  { id: 'magic_color', label: 'Color Boost', icon: Sparkles },
];

const PAGE_SIZE_OPTIONS: {
  id: PageSizeType;
  name: string;
  dimensions: string;
  desc: string;
  ratio: string;
}[] = [
  {
    id: 'a4',
    name: 'A4 Standard',
    dimensions: '210 × 297 mm',
    desc: 'Universal document & office print standard',
    ratio: '210/297',
  },
  {
    id: 'letter',
    name: 'US Letter',
    dimensions: '8.5 × 11 in',
    desc: 'Standard North American document format',
    ratio: '612/792',
  },
  {
    id: 'legal',
    name: 'US Legal',
    dimensions: '8.5 × 14 in',
    desc: 'Legal contracts & extended paperwork',
    ratio: '612/1008',
  },
  {
    id: 'executive',
    name: 'Executive',
    dimensions: '7.25 × 10.5 in',
    desc: 'Compact corporate stationery size',
    ratio: '522/756',
  },
  {
    id: 'fit',
    name: 'Fit to Photo',
    dimensions: 'Original Aspect',
    desc: 'Auto-adjust page geometry to match photo pixels',
    ratio: '1/1',
  },
];

interface MediaItem {
  id: string;
  file: File;
  type: 'image' | 'pdf_page';
  previewUrl: string;
  originalUrl: string;
  cropPoints?: Point[];
  pageIndex?: number;
  pageNumber?: number;
  totalPages?: number;
  name: string;
  sizeFormatted: string;
  rotation: number;
  filter: FilterType;
}

function createPdfPlaceholder(pageNum: number, totalPages: number, fileName: string): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 848;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 848);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 576, 824);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(30, 30, 540, 90);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`PDF Page ${pageNum} of ${totalPages}`, 50, 82);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    const cleanName = fileName.length > 40 ? fileName.substring(0, 37) + '...' : fileName;
    ctx.fillText(cleanName, 50, 160);

    ctx.fillStyle = '#e2e8f0';
    for (let y = 200; y < 800; y += 26) {
      const lineW = 200 + ((y * 17) % 300);
      ctx.fillRect(50, y, Math.min(500, lineW), 10);
    }
  }
  return canvas.toDataURL('image/png');
}

export default function PicsToPDFPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeType>('a4');
  const [orientation, setOrientation] = useState<OrientationType>('auto');
  const [margin, setMargin] = useState<number>(20);
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>('balanced');
  const [globalFilter, setGlobalFilter] = useState<FilterType>('original');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);

  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [isPageSizeModalOpen, setIsPageSizeModalOpen] = useState<boolean>(false);
  const [cropItem, setCropItem] = useState<MediaItem | null>(null);

  const handleSaveCrop = (croppedUrl: string, savedPoints: Point[]) => {
    if (!cropItem) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === cropItem.id
          ? { ...it, previewUrl: croppedUrl, cropPoints: savedPoints }
          : it
      )
    );
    toast.success('Document edges cropped & adjusted!');
    setCropItem(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = async (filesToProcess: File[]) => {
    if (!filesToProcess.length) return;

    setLoadingFiles(true);
    toast.info('Processing images & pages...');

    const newItems: MediaItem[] = [];

    for (const f of filesToProcess) {
      const isImage = f.type.startsWith('image/');
      const isPdf = f.type === 'application/pdf';

      if (!isImage && !isPdf) continue;

      if (isImage) {
        const objUrl = URL.createObjectURL(f);
        newItems.push({
          id: `img_${Math.random()}_${Date.now()}`,
          file: f,
          type: 'image',
          previewUrl: objUrl,
          originalUrl: objUrl,
          name: f.name,
          sizeFormatted: formatFileSize(f.size),
          rotation: 0,
          filter: globalFilter,
        });
      } else if (isPdf) {
        try {
          const pageImages = await renderPDFPagesToImages(f, 1.2);
          for (let pIdx = 0; pIdx < pageImages.length; pIdx++) {
            const pageUrl = pageImages[pIdx].dataUrl;
            newItems.push({
              id: `pdf_page_${Math.random()}_${pIdx}`,
              file: f,
              type: 'pdf_page',
              previewUrl: pageUrl,
              originalUrl: pageUrl,
              pageIndex: pIdx,
              pageNumber: pIdx + 1,
              totalPages: pageImages.length,
              name: f.name,
              sizeFormatted: formatFileSize(f.size),
              rotation: 0,
              filter: globalFilter,
            });
          }
        } catch {
          try {
            const pdfDoc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
            const totalP = pdfDoc.getPageCount();
            for (let pIdx = 0; pIdx < totalP; pIdx++) {
              const placeholderUrl = createPdfPlaceholder(pIdx + 1, totalP, f.name);
              newItems.push({
                id: `pdf_page_${Math.random()}_${pIdx}`,
                file: f,
                type: 'pdf_page',
                previewUrl: placeholderUrl,
                originalUrl: placeholderUrl,
                pageIndex: pIdx,
                pageNumber: pIdx + 1,
                totalPages: totalP,
                name: f.name,
                sizeFormatted: formatFileSize(f.size),
                rotation: 0,
                filter: globalFilter,
              });
            }
          } catch {
            // Ignore
          }
        }
      }
    }

    if (!newItems.length) {
      toast.error('Please select valid image files or PDFs.');
      setLoadingFiles(false);
      return;
    }

    setItems((prev) => [...prev, ...newItems]);
    setLoadingFiles(false);
    toast.success(`Added ${newItems.length} page(s).`);
  };

  const handleGlobalFilterChange = (filter: FilterType) => {
    setGlobalFilter(filter);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        filter: filter,
      }))
    );
  };

  const handleItemFilterChange = (id: string, filter: FilterType) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, filter } : item))
    );
  };

  const handleRotate = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setItems(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const processImageToJpegBytes = (
    srcUrl: string,
    filter: FilterType,
    rotation: number,
    qualityKey: QualityPreset
  ): Promise<{ bytes: Uint8Array; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const config = QUALITY_PRESETS[qualityKey];
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let srcW = img.naturalWidth || img.width;
        let srcH = img.naturalHeight || img.height;

        const isRotated90 = Math.abs(rotation % 180) === 90;
        let targetW = isRotated90 ? srcH : srcW;
        let targetH = isRotated90 ? srcW : srcH;

        if (Math.max(targetW, targetH) > config.maxDimension) {
          const scale = config.maxDimension / Math.max(targetW, targetH);
          targetW = Math.round(targetW * scale);
          targetH = Math.round(targetH * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Fill background with pure white (#ffffff)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        // Apply native hardware-accelerated canvas filter matching CSS preview filter exactly
        if (filter !== 'original') {
          ctx.filter = getCssFilter(filter);
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const drawW = isRotated90 ? canvas.height : canvas.width;
        const drawH = isRotated90 ? canvas.width : canvas.height;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // Fallback for environments where ctx.filter is not supported
        if (filter !== 'original' && typeof ctx.filter === 'undefined') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            if (filter === 'grayscale') {
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              data[i] = gray; data[i + 1] = gray; data[i + 2] = gray;
            } else if (filter === 'bw_scan') {
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              const bw = gray > 140 ? 255 : Math.max(0, Math.min(255, gray * 0.85 - 15));
              data[i] = bw; data[i + 1] = bw; data[i + 2] = bw;
            } else if (filter === 'magic_color') {
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              const factor = 1.2;
              data[i] = Math.min(255, Math.max(0, (r - 128) * factor + 128));
              data[i + 1] = Math.min(255, Math.max(0, (g - 128) * factor + 128));
              data[i + 2] = Math.min(255, Math.max(0, (b - 128) * factor + 128));
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        const highResJpegQuality = Math.max(0.92, config.jpegQuality);
        const jpegDataUrl = canvas.toDataURL('image/jpeg', highResJpegQuality);
        const jpegBase64 = jpegDataUrl.split(',')[1];
        const jpegBytes = Uint8Array.from(atob(jpegBase64), (c) => c.charCodeAt(0));

        resolve({
          bytes: jpegBytes,
          width: canvas.width,
          height: canvas.height,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = srcUrl;
    });
  };

  const handleGeneratePDF = async () => {
    if (!items.length) return;
    setIsGenerating(true);
    toast.info('Generating PDF document...');

    try {
      const outPdfDoc = await PDFDocument.create();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type === 'image' || (item.type === 'pdf_page' && item.previewUrl)) {
          const srcUrl = item.previewUrl;
          const { bytes, width: imgWidth, height: imgHeight } = await processImageToJpegBytes(
            srcUrl,
            item.filter,
            item.rotation,
            qualityPreset
          );

          const embeddedImage = await outPdfDoc.embedJpg(bytes);

          let baseW = 595.28; // A4
          let baseH = 841.89;

          if (pageSize === 'letter') {
            baseW = PageSizes.Letter[0];
            baseH = PageSizes.Letter[1];
          } else if (pageSize === 'legal') {
            baseW = PageSizes.Legal[0];
            baseH = PageSizes.Legal[1];
          } else if (pageSize === 'executive') {
            baseW = 522;
            baseH = 756;
          } else if (pageSize === 'fit') {
            baseW = imgWidth + margin * 2;
            baseH = imgHeight + margin * 2;
          }

          let finalPageW = baseW;
          let finalPageH = baseH;

          if (pageSize !== 'fit') {
            if (orientation === 'landscape') {
              finalPageW = Math.max(baseW, baseH);
              finalPageH = Math.min(baseW, baseH);
            } else if (orientation === 'portrait') {
              finalPageW = Math.min(baseW, baseH);
              finalPageH = Math.max(baseW, baseH);
            } else if (orientation === 'auto') {
              if (imgWidth > imgHeight) {
                finalPageW = Math.max(baseW, baseH);
                finalPageH = Math.min(baseW, baseH);
              } else {
                finalPageW = Math.min(baseW, baseH);
                finalPageH = Math.max(baseW, baseH);
              }
            }
          }

          const page = outPdfDoc.addPage([finalPageW, finalPageH]);

          const maxDrawW = finalPageW - margin * 2;
          const maxDrawH = finalPageH - margin * 2;
          const scale = Math.min(maxDrawW / imgWidth, maxDrawH / imgHeight, 1);

          const drawW = imgWidth * scale;
          const drawH = imgHeight * scale;
          const drawX = (finalPageW - drawW) / 2;
          const drawY = (finalPageH - drawH) / 2;

          page.drawImage(embeddedImage, {
            x: drawX,
            y: drawY,
            width: drawW,
            height: drawH,
          });
        } else if (item.type === 'pdf_page' && item.pageIndex !== undefined) {
          const arrayBuffer = await item.file.arrayBuffer();
          const srcPdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const [copiedPage] = await outPdfDoc.copyPages(srcPdfDoc, [item.pageIndex]);
          outPdfDoc.addPage(copiedPage);
        }
      }

      const pdfBytes = await outPdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const downloadName = `document-${Date.now()}.pdf`;
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(blobUrl);

      const sizeMB = (pdfBytes.byteLength / (1024 * 1024)).toFixed(2);
      toast.success(`PDF downloaded (${sizeMB} MB)!`);
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCssFilter = (filter: FilterType) => {
    if (filter === 'bw_scan') return 'grayscale(100%) contrast(200%) brightness(108%)';
    if (filter === 'grayscale') return 'grayscale(100%) contrast(120%)';
    if (filter === 'magic_color') return 'contrast(135%) saturate(145%) brightness(105%)';
    return 'none';
  };

  useEffect(() => {
    if (isPreviewOpen) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`full-view-page-${previewIndex}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isPreviewOpen, previewIndex]);

  const openPreview = (startIndex: number = 0) => {
    setPreviewIndex(startIndex);
    setIsPreviewOpen(true);
  };

  const activePageSizeLabel =
    PAGE_SIZE_OPTIONS.find((p) => p.id === pageSize)?.name || 'A4 Standard';

  return (
    <ToolLayout
      slug="/image/pics-to-pdf"
      title="Doc Scanner"
      subtitle="Scan camera snaps, photos & PDFs into clean PDF documents. Includes document scan filters, custom margins, and paper sizes."
      badgeText="Doc Scanner"
    >
      {/* Hidden File & Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        className="hidden"
        disabled={loadingFiles}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        className="hidden"
        disabled={loadingFiles}
      />

      <div className="max-w-4xl mx-auto space-y-4 pb-20 sm:pb-6">
        {!items.length ? (
          /* Upload Hero Box */
          <div className="p-6 sm:p-12 border border-slate-200 hover:border-slate-800 rounded-3xl bg-slate-50/70 hover:bg-slate-50 transition-all text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Camera className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>

            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Upload Photos or Snap Document
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto font-medium">
                Combine camera photos, receipts & document pages into a clean PDF document.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingFiles}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingFiles ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Select Photos & PDFs</span>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={loadingFiles}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border border-slate-300 hover:border-slate-800 text-slate-900 font-extrabold text-xs sm:text-sm shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-800" />
                <span>Snap Camera Document</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Frameless App-Style Controls Bar */}
            <div className="space-y-3 bg-white p-3.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              {/* Direct Access Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-3">
                {/* 1. Paper Size Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    1. Paper Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as PageSizeType)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs"
                  >
                    <option value="a4">A4 Standard (210 × 297 mm)</option>
                    <option value="letter">US Letter (8.5 × 11 in)</option>
                    <option value="legal">US Legal (8.5 × 14 in)</option>
                    <option value="executive">Executive (7.25 × 10.5 in)</option>
                    <option value="fit">Fit to Photo (Original Aspect)</option>
                  </select>
                </div>

                {/* 2. Orientation Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    2. Orientation
                  </label>
                  <select
                    value={orientation}
                    disabled={pageSize === 'fit'}
                    onChange={(e) => setOrientation(e.target.value as OrientationType)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 cursor-pointer shadow-2xs"
                  >
                    <option value="auto">Auto Ratio (Match Photo)</option>
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="landscape">Landscape (Horizontal)</option>
                  </select>
                </div>

                {/* 3. Margin Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    3. Page Margin
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs"
                  >
                    <option value={0}>0px (No Margin)</option>
                    <option value={10}>10px (Small)</option>
                    <option value={20}>20px (Standard)</option>
                    <option value={40}>40px (Wide)</option>
                  </select>
                </div>
              </div>

              {/* 2. Quality Segmented Tabs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <span>Quality / Size Preset:</span>
                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {QUALITY_PRESETS[qualityPreset].badge}
                  </span>
                </div>

                <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {(Object.keys(QUALITY_PRESETS) as QualityPreset[]).map((key) => {
                    const preset = QUALITY_PRESETS[key];
                    const isSelected = qualityPreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setQualityPreset(key)}
                        className={`py-1.5 px-2 sm:px-3 rounded-xl text-center transition-all cursor-pointer shrink-0 flex-1 min-w-[75px] ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs font-black'
                            : 'text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-200/50'
                        }`}
                      >
                        <div className="text-[10px] sm:text-xs truncate">{preset.label}</div>
                        <div className={`text-[8px] sm:text-[9px] font-semibold leading-none ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                          {preset.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Document Scan Filter Segmented Tabs */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                  Document Scan Filter:
                </span>

                <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {SCAN_FILTERS.map((sf) => {
                    const isSelected = globalFilter === sf.id;
                    const IconComponent = sf.icon;
                    return (
                      <button
                        key={sf.id}
                        onClick={() => handleGlobalFilterChange(sf.id)}
                        className={`py-1.5 px-2.5 sm:px-3 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 flex-1 min-w-[85px] ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs font-black'
                            : 'text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-200/50'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                        <span className="text-[10px] sm:text-xs truncate">{sf.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toolbar Header Row */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900">
                  {items.length} Page(s) Selected
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openPreview(0)}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    title="Open Document Scroll Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Full Preview</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loadingFiles}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Pages</span>
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={loadingFiles}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Camera</span>
                  </button>
                </div>
              </div>

              {/* Frameless Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
                {items.map((item, index) => {
                  const isDragging = draggedIndex === index;
                  const isDragOver = dragOverIndex === index;

                  return (
                    <div
                      key={item.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`p-2 rounded-2xl transition-all cursor-grab active:cursor-grabbing relative group bg-white ${
                        isDragging
                          ? 'opacity-40 border-dashed border-slate-400 bg-slate-50'
                          : isDragOver
                          ? 'ring-2 ring-slate-900 bg-slate-100 scale-[1.02] shadow-md'
                          : 'border border-slate-200/80 hover:shadow-md'
                      }`}
                    >
                      {/* Image Preview Container */}
                      <div
                        onClick={() => openPreview(index)}
                        className="relative w-full h-32 sm:h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer group/prev"
                      >
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="w-full h-full object-contain transition-all duration-200"
                            style={{
                              filter: getCssFilter(item.filter),
                              transform: `rotate(${item.rotation}deg)`,
                            }}
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-slate-400" />
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white font-bold text-xs backdrop-blur-[1px]">
                          <Sun className="w-4 h-4 text-amber-300" />
                          <span>Preview</span>
                        </div>

                        {/* Page Index Badge */}
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-white font-black text-[9px] shadow-2xs pointer-events-none">
                          Page {index + 1}
                        </span>

                        {/* Rotate Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotate(item.id);
                          }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-white/90 text-slate-800 hover:bg-white shadow-2xs active:scale-90 transition-all cursor-pointer z-10"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Controls */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[10px] font-bold text-slate-900 truncate flex-1" title={item.name}>
                            {item.name}
                          </p>
                          <span className="text-[8px] font-extrabold text-slate-400">
                            {item.rotation !== 0 ? `${item.rotation}°` : ''}
                          </span>
                        </div>

                        {/* Per-Card Filter Selection */}
                        <select
                          value={item.filter}
                          onChange={(e) => handleItemFilterChange(item.id, e.target.value as FilterType)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5 text-[9px] font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="original">Original</option>
                          <option value="bw_scan">B&W Scan</option>
                          <option value="grayscale">Grayscale</option>
                          <option value="magic_color">Color Boost</option>
                        </select>

                        <div className="flex items-center justify-between pt-0.5">
                          <div className="flex items-center gap-0.5">
                            <button
                              disabled={index === 0}
                              onClick={() => handleMove(index, 'up')}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-700 disabled:opacity-20 transition-colors cursor-pointer"
                              title="Move Up"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={index === items.length - 1}
                              onClick={() => handleMove(index, 'down')}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-700 disabled:opacity-20 transition-colors cursor-pointer"
                              title="Move Down"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setCropItem(item)}
                              className="p-1 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer"
                              title="Crop & Adjust Edges"
                            >
                              <Crop className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 rounded-md hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                            title="Remove Page"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Desktop Action Bar */}
              <div className="hidden sm:flex flex-row items-center gap-2.5 pt-3">
                <button
                  onClick={() => setIsPageSizeModalOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-white border border-slate-300 hover:border-slate-800 text-slate-900 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                  <span>Page Size Options</span>
                </button>

                <button
                  onClick={() => openPreview(0)}
                  className="px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Maximize2 className="w-4 h-4 text-indigo-600" />
                  <span>Document Preview</span>
                </button>

                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating || loadingFiles}
                  className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Create PDF ({items.length} Pages)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE ELEGANT FLOATING ACTION CAPSULE (Positioned at bottom-[4.75rem] above MobileBottomNav z-40) */}
      {items.length > 0 && (
        <div className="sm:hidden fixed bottom-[4.75rem] left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center justify-between gap-2 text-white animate-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => openPreview(0)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-black text-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer border border-slate-700/60"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingFiles}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white shrink-0 active:scale-95 transition-all cursor-pointer border border-slate-700/60"
            title="Add Pages"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating || loadingFiles}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            <span>Create PDF ({items.length})</span>
          </button>
        </div>
      )}

      {/* DEDICATED PAGE SIZE POPUP MODAL */}
      {isPageSizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Grab Handle */}
            <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0" />

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Page Size & Settings</h3>
                  <p className="text-xs text-slate-500 font-medium">Configure document output geometry</p>
                </div>
              </div>

              <button
                onClick={() => setIsPageSizeModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
              {/* 1. Page Size Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  1. Paper Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PAGE_SIZE_OPTIONS.map((opt) => {
                    const isSelected = pageSize === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPageSize(opt.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black">{opt.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                          </div>
                          <span className={`text-[10px] font-bold block ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                            {opt.dimensions}
                          </span>
                          <span className={`text-[10px] line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Orientation Options */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  2. Orientation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Auto Ratio', desc: 'Match Photo' },
                    { id: 'portrait', label: 'Portrait', desc: 'Vertical' },
                    { id: 'landscape', label: 'Landscape', desc: 'Horizontal' },
                  ].map((o) => {
                    const isSelected = orientation === o.id;
                    const disabled = pageSize === 'fit';
                    return (
                      <button
                        key={o.id}
                        disabled={disabled}
                        onClick={() => setOrientation(o.id as OrientationType)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          disabled
                            ? 'opacity-40 border-slate-200 bg-slate-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-slate-900 text-white border-slate-900 font-black shadow-xs'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 font-bold'
                        }`}
                      >
                        <div className="text-xs truncate">{o.label}</div>
                        <div className={`text-[9px] ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                          {o.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {pageSize === 'fit' && (
                  <p className="text-[10px] font-semibold text-slate-500 italic">
                    * Orientation auto-matches photo dimensions when "Fit to Photo" is selected.
                  </p>
                )}
              </div>

              {/* 3. Margins */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  3. Page Padding / Margin
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  {[
                    { value: 0, label: '0px', badge: 'No Margin' },
                    { value: 10, label: '10px', badge: 'Small' },
                    { value: 20, label: '20px', badge: 'Standard' },
                    { value: 40, label: '40px', badge: 'Wide' },
                  ].map((m) => {
                    const isSelected = margin === m.value;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMargin(m.value)}
                        className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white font-black shadow-xs'
                            : 'text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-200/60'
                        }`}
                      >
                        <div className="text-xs">{m.label}</div>
                        <div className={`text-[8px] ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                          {m.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsPageSizeModalOpen(false);
                  toast.success(`Page size set to ${activePageSizeLabel}!`);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-amber-300" />
                <span>Apply Page Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

          {/* SEAMLESS DOC SCANNER PREVIEW POPUP */}
      {isPreviewOpen && items.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[700px] h-full sm:h-[92vh] rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minimal Header */}
            <div className="px-4 sm:px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 z-20">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-xs shrink-0 flex items-center gap-1.5 shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Doc Preview</span>
                </span>
                <span className="text-xs font-bold text-slate-500 truncate">
                  ({items.length} Pages)
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" /> : <Download className="w-3.5 h-3.5 text-white" />}
                  <span>Create PDF</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Compact Jump Bar */}
            <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Jump to:
              </span>
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    setPreviewIndex(idx);
                    const el = document.getElementById(`full-view-page-${idx}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all shrink-0 cursor-pointer ${
                    previewIndex === idx
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>

            {/* Seamless Single-Surface Vertical Document Reader (No Nested Boxes) */}
            <div className="flex-1 overflow-y-auto bg-white p-3 sm:p-6 space-y-8 custom-scrollbar">
              {items.map((item, index) => {
                const isRotated = Math.abs((item.rotation || 0) % 180) === 90;

                return (
                  <div
                    key={item.id}
                    id={`full-view-page-${index}`}
                    className="w-full space-y-2 group"
                  >
                    {/* Floating Page Toolbar (No Box) */}
                    <div className="flex items-center justify-between px-1 text-slate-700">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-black text-[11px] shrink-0">
                          Page {index + 1} of {items.length}
                        </span>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[200px] sm:max-w-md">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.rotation !== 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
                            {item.rotation}°
                          </span>
                        )}

                        <button
                          onClick={() => setCropItem(item)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer"
                          title="Crop & Adjust Edges"
                        >
                          <Crop className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRotate(item.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                        </button>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pure Document Canvas / Image (No Inner Box Wrapper) */}
                    <div className="w-full flex items-center justify-center py-1 overflow-hidden">
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-full h-auto max-h-[740px] object-contain block rounded-md shadow-sm transition-transform duration-300"
                          style={{
                            filter: getCssFilter(item.filter),
                            transform: `rotate(${item.rotation}deg)`,
                            maxHeight: isRotated ? '480px' : '740px',
                            maxWidth: isRotated ? '80%' : '100%',
                          }}
                        />
                      ) : (
                        <div className="py-20 text-slate-400 flex flex-col items-center gap-2">
                          <FileText className="w-10 h-10 text-indigo-500 animate-pulse" />
                          <span className="text-xs font-bold">Rendering Page...</span>
                        </div>
                      )}
                    </div>

                    {/* Subtle Separator Divider between pages */}
                    {index < items.length - 1 && (
                      <div className="pt-4 border-b border-slate-100" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4-CORNER DOTS INTERACTIVE DOCUMENT SCANNER CROPER MODAL */}
      <DocCropperModal
        isOpen={!!cropItem}
        imageUrl={cropItem?.originalUrl || cropItem?.previewUrl || ''}
        initialPoints={cropItem?.cropPoints}
        onClose={() => setCropItem(null)}
        onSaveCrop={handleSaveCrop}
      />
    </ToolLayout>
  );
}
