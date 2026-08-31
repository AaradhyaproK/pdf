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
} from 'lucide-react';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';

export type FilterType = 'original' | 'bw_scan' | 'grayscale' | 'magic_color';
export type QualityPreset = 'balanced' | 'high' | 'compact' | 'ultra';

interface QualityConfig {
  maxDimension: number;
  jpegQuality: number;
  label: string;
  badge: string;
}

const QUALITY_PRESETS: Record<QualityPreset, QualityConfig> = {
  balanced: {
    maxDimension: 1920,
    jpegQuality: 0.80,
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
    jpegQuality: 0.50,
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

interface MediaItem {
  id: string;
  file: File;
  type: 'image' | 'pdf_page';
  previewUrl: string;
  pageIndex?: number;
  pageNumber?: number;
  totalPages?: number;
  name: string;
  sizeFormatted: string;
  rotation: number;
  filter: FilterType;
}

export default function PicsToPDFPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal' | 'executive' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [margin, setMargin] = useState<number>(20);
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>('balanced');
  const [globalFilter, setGlobalFilter] = useState<FilterType>('original');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);

  // Full Screen Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

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
        newItems.push({
          id: `img_${Math.random()}_${Date.now()}`,
          file: f,
          type: 'image',
          previewUrl: URL.createObjectURL(f),
          name: f.name,
          sizeFormatted: formatFileSize(f.size),
          rotation: 0,
          filter: globalFilter,
        });
      } else if (isPdf) {
        try {
          const pageImages = await renderPDFPagesToImages(f, 1.2);
          for (let pIdx = 0; pIdx < pageImages.length; pIdx++) {
            newItems.push({
              id: `pdf_page_${Math.random()}_${pIdx}`,
              file: f,
              type: 'pdf_page',
              previewUrl: pageImages[pIdx].dataUrl,
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
          const pdfDoc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
          const totalP = pdfDoc.getPageCount();
          for (let pIdx = 0; pIdx < totalP; pIdx++) {
            newItems.push({
              id: `pdf_page_${Math.random()}_${pIdx}`,
              file: f,
              type: 'pdf_page',
              previewUrl: '',
              pageIndex: pIdx,
              pageNumber: pIdx + 1,
              totalPages: totalP,
              name: f.name,
              sizeFormatted: formatFileSize(f.size),
              rotation: 0,
              filter: globalFilter,
            });
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

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const drawW = isRotated90 ? canvas.height : canvas.width;
        const drawH = isRotated90 ? canvas.width : canvas.height;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        if (filter !== 'original') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (filter === 'grayscale') {
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            } else if (filter === 'bw_scan') {
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              const bw = gray > 155 ? Math.min(255, gray * 1.15) : Math.max(0, gray * 0.75 - 20);
              data[i] = bw;
              data[i + 1] = bw;
              data[i + 2] = bw;
            } else if (filter === 'magic_color') {
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              if (gray > 175) {
                data[i] = Math.min(255, r * 1.12);
                data[i + 1] = Math.min(255, g * 1.12);
                data[i + 2] = Math.min(255, b * 1.12);
              } else {
                data[i] = Math.max(0, r * 0.88);
                data[i + 1] = Math.max(0, g * 0.88);
                data[i + 2] = Math.max(0, b * 0.88);
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
        }

        const jpegDataUrl = canvas.toDataURL('image/jpeg', config.jpegQuality);
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

  return (
    <ToolLayout
      slug="/image/pics-to-pdf"
      title="Pics & Document Scan to PDF"
      subtitle="Convert photos, camera document snaps & PDFs into a combined document. Supports instant document scan filters and PDF compression."
      badgeText="Photo & Document Scanner"
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

      <div className="max-w-4xl mx-auto space-y-4">
        {!items.length ? (
          /* Upload Hero Box */
          <div className="p-5 sm:p-10 border border-slate-200 hover:border-slate-800 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div>
              <h3 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
                Upload Photos or Snap Document
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto font-medium">
                Combine camera photos, receipts & document pages into a clean PDF.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingFiles}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingFiles ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Select Photos & PDFs</span>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={loadingFiles}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white border border-slate-300 hover:border-slate-800 text-slate-900 font-extrabold text-xs sm:text-sm shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-slate-800" />
                <span>Snap Camera Document</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Frameless App-Style Controls Bar */}
            <div className="space-y-3">
              {/* 1. Quality Segmented Tabs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <span>Quality / Size:</span>
                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {QUALITY_PRESETS[qualityPreset].badge}
                  </span>
                </div>

                <div className="bg-slate-100/80 p-0.5 sm:p-1 rounded-2xl grid grid-cols-4 gap-0.5 sm:gap-1">
                  {(Object.keys(QUALITY_PRESETS) as QualityPreset[]).map((key) => {
                    const preset = QUALITY_PRESETS[key];
                    const isSelected = qualityPreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setQualityPreset(key)}
                        className={`py-1.5 px-1 sm:px-2 rounded-xl text-center transition-all cursor-pointer ${
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

              {/* 2. Document Scan Filter Segmented Tabs */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                  Scan Filter:
                </span>

                <div className="bg-slate-100/80 p-0.5 sm:p-1 rounded-2xl grid grid-cols-4 gap-0.5 sm:gap-1">
                  {SCAN_FILTERS.map((sf) => {
                    const isSelected = globalFilter === sf.id;
                    const IconComponent = sf.icon;
                    return (
                      <button
                        key={sf.id}
                        onClick={() => handleGlobalFilterChange(sf.id)}
                        className={`py-1.5 px-1 sm:px-2 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs font-black'
                            : 'text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-200/50'
                        }`}
                      >
                        <IconComponent className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                        <span className="text-[10px] sm:text-xs truncate">{sf.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Collapsible Page Settings Toggle */}
              <div>
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-extrabold text-slate-600 hover:text-slate-900 py-0.5 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                  <span>Page Size, Orientation & Margins</span>
                  {showAdvancedSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedSettings && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2.5 mt-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Page Size:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none"
                      >
                        <option value="a4">A4 Standard</option>
                        <option value="letter">US Letter</option>
                        <option value="legal">US Legal</option>
                        <option value="executive">Executive</option>
                        <option value="fit">Fit Photo Pixels</option>
                      </select>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Orientation:</span>
                      <select
                        value={orientation}
                        disabled={pageSize === 'fit'}
                        onChange={(e) => setOrientation(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none disabled:opacity-50"
                      >
                        <option value="auto">Auto (Match Aspect)</option>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Margin:</span>
                      <select
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none"
                      >
                        <option value={0}>No Margin</option>
                        <option value={10}>Small (10px)</option>
                        <option value={20}>Standard (20px)</option>
                        <option value={40}>Wide (40px)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Toolbar Header Row */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900">
                  {items.length} Page(s)
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openPreview(0)}
                    className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                    title="Full View PDF Reader"
                  >
                    <Eye className="w-3 h-3 text-slate-700" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loadingFiles}
                    className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={loadingFiles}
                    className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>

              {/* Frameless Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
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
                      className={`p-1.5 sm:p-2 rounded-2xl transition-all cursor-grab active:cursor-grabbing relative group bg-white shadow-2xs ${
                        isDragging
                          ? 'opacity-40 border-dashed border-slate-400 bg-slate-50'
                          : isDragOver
                          ? 'ring-2 ring-slate-900 bg-slate-100 scale-[1.02] shadow-md'
                          : 'border border-slate-100 hover:shadow-md'
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
                          <Eye className="w-3.5 h-3.5 text-white" />
                          <span>Full View</span>
                        </div>

                        {/* Page Index Badge */}
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-white font-black text-[9px] shadow-2xs pointer-events-none">
                          #{index + 1}
                        </span>

                        {/* Rotate Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotate(item.id);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-lg bg-white/90 text-slate-800 hover:bg-white shadow-2xs active:scale-90 transition-all cursor-pointer z-10"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Card Controls */}
                      <div className="space-y-1 pt-1">
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1 py-0.5 text-[9px] font-bold text-slate-800 focus:outline-none"
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
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={() => openPreview(0)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-slate-800" />
                  <span>Full View Preview</span>
                </button>

                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating || loadingFiles}
                  className="w-full sm:flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                  <span>Create PDF ({items.length} Pages)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Mobile Bar */}
      {items.length > 0 && (
        <div className="md:hidden fixed bottom-[4.75rem] left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-2 border border-slate-800 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => openPreview(0)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 text-[11px] font-bold shrink-0 border border-slate-700 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <div className="min-w-0 flex-1 px-1">
            <span className="text-xs font-black block truncate text-white">
              {items.length} Page(s)
            </span>
            <p className="text-[9px] font-bold text-amber-300 truncate">
              {QUALITY_PRESETS[qualityPreset].label}
            </p>
          </div>

          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating || loadingFiles}
            className="px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-black shadow-md flex items-center gap-1 disabled:opacity-50 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-amber-600" />}
            <span>Create PDF</span>
          </button>
        </div>
      )}

      {/* Day Mode Page-Sized Full View Preview Modal */}
      {isPreviewOpen && items.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-4xl w-full max-h-[90vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Day Mode Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center gap-1.5 shrink-0">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Full View Preview ({items.length} Pages)</span>
                </span>
                <span className="text-xs font-bold text-slate-500 truncate hidden sm:inline">
                  Vertical Scroll Mode
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Create PDF</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                  aria-label="Close preview"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Mode Modal Body: Vertical Scroll of All Pages */}
            <div className="flex-1 overflow-y-auto bg-slate-100/90 p-4 sm:p-6 space-y-6 scrollbar-thin">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  id={`full-view-page-${index}`}
                  className="bg-white p-3 sm:p-5 rounded-2xl shadow-md border border-slate-200/90 max-w-3xl mx-auto flex flex-col items-center gap-3 relative group"
                >
                  {/* Day Mode Page Badge Header */}
                  <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-black text-[11px] shadow-2xs">
                      Page {index + 1} of {items.length}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                      {item.name}
                    </span>
                    {item.rotation !== 0 && (
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">
                        {item.rotation}° Rotated
                      </span>
                    )}
                  </div>

                  {/* Page Image Display */}
                  <div className="w-full flex items-center justify-center p-1 min-h-[240px] bg-slate-50 rounded-xl overflow-hidden">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-lg shadow-sm transition-all duration-200"
                        style={{
                          filter: getCssFilter(item.filter),
                          transform: `rotate(${item.rotation}deg)`,
                        }}
                      />
                    ) : (
                      <div className="py-16 text-slate-400 flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12" />
                        <span className="text-xs font-bold">PDF Page Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day Mode Quick Jump Page Navigation Bar */}
            {items.length > 1 && (
              <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 justify-center">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">
                  Jump to:
                </span>
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => {
                      const el = document.getElementById(`full-view-page-${i}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-slate-700 font-extrabold text-xs transition-all shrink-0 cursor-pointer"
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
