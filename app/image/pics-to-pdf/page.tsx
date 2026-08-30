'use client';

import { useState } from 'react';
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
  FileType,
  Compass,
  Maximize2,
  GripVertical,
} from 'lucide-react';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';

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
}

export default function PicsToPDFPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal' | 'executive' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setLoadingFiles(true);
    toast.info('Rendering photos and extracting individual PDF pages...');

    const newItems: MediaItem[] = [];

    for (const f of selected) {
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
            });
          }
        }
      }
    }

    if (!newItems.length) {
      toast.error('Please select valid image files (JPG, PNG, WebP) or PDF files.');
      setLoadingFiles(false);
      return;
    }

    setItems((prev) => [...prev, ...newItems]);
    setLoadingFiles(false);
    toast.success(`Added ${newItems.length} page(s) to document queue.`);
  };

  // Drag and drop event handlers
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
    toast.success('Page order updated!');
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

  const handleGeneratePDF = async () => {
    if (!items.length) return;
    setIsGenerating(true);
    toast.info('Converting and compiling pages into final PDF document...');

    try {
      const outPdfDoc = await PDFDocument.create();

      for (const item of items) {
        if (item.type === 'image') {
          const file = item.file;
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          await new Promise((res) => {
            img.onload = res;
            img.src = objectUrl;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }

          const pngDataUrl = canvas.toDataURL('image/png');
          const pngBase64 = pngDataUrl.split(',')[1];
          const pngBytes = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));
          URL.revokeObjectURL(objectUrl);

          const embeddedImage = await outPdfDoc.embedPng(pngBytes);
          const imgWidth = embeddedImage.width;
          const imgHeight = embeddedImage.height;

          // Base Page Size (in points)
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

          // Apply Orientation
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

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `compiled-document-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);

      toast.success('Combined PDF created and downloaded successfully!');
    } catch {
      toast.error('Failed to compile files to PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/pics-to-pdf"
      title="Pics & PDF to PDF Converter (Combine Photos & PDFs)"
      subtitle="Turn photos, camera scans, images, AND existing PDF documents into a clean combined PDF. Drag-and-drop page reordering, custom page size (A4, Letter, Legal), orientation, and margins."
      badgeText="Photos + PDFs to PDF"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {!items.length ? (
          <div className="p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Upload Photos, Images or PDF Files</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Select photos (JPG, PNG, WebP) and PDF documents. All PDF pages will be extracted so you can drag and reorder every page!
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
              {loadingFiles ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Select Photos & PDFs</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={loadingFiles}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Page Layout Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <FileType className="w-4 h-4 text-indigo-600" />
                    <span>Page Size / Format:</span>
                  </div>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="a4">Standard A4 Document (595 x 842 pt)</option>
                    <option value="letter">US Letter (612 x 792 pt)</option>
                    <option value="legal">US Legal (612 x 1008 pt)</option>
                    <option value="executive">Executive Document (522 x 756 pt)</option>
                    <option value="fit">Fit Exact Picture Dimensions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <span>Page Orientation:</span>
                  </div>
                  <select
                    value={orientation}
                    disabled={pageSize === 'fit'}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="auto">Auto (Match Photo Aspect Ratio)</option>
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="landscape">Landscape (Horizontal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Maximize2 className="w-4 h-4 text-indigo-600" />
                    <span>Page Margin:</span>
                  </div>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={0}>No Margin (Full Bleed)</option>
                    <option value={10}>Small Margin (10px)</option>
                    <option value={20}>Standard Margin (20px)</option>
                    <option value={40}>Wide Margin (40px)</option>
                  </select>
                </div>
              </div>

              {/* Items List & Reordering */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold uppercase text-slate-500">Document Pages ({items.length} Pages)</h4>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                      <GripVertical className="w-3 h-3" /> Drag & drop cards to reorder
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Photos or PDFs</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loadingFiles}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        className={`p-3 rounded-2xl border transition-all cursor-grab active:cursor-grabbing relative group ${
                          isDragging
                            ? 'opacity-40 border-dashed border-indigo-400 bg-indigo-50/50'
                            : isDragOver
                            ? 'border-2 border-indigo-600 bg-indigo-50/30 scale-[1.02] shadow-md'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        {item.type === 'image' ? (
                          <div className="relative">
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="w-full h-36 object-contain bg-white rounded-xl border border-slate-200"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-[10px] shadow-sm">
                              PHOTO
                            </span>
                          </div>
                        ) : (
                          <div className="relative w-full h-36 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center p-1 text-center overflow-hidden">
                            {item.previewUrl ? (
                              <img src={item.previewUrl} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <FileText className="w-10 h-10 text-indigo-600" />
                            )}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] shadow-sm">
                              PDF PAGE {item.pageNumber} of {item.totalPages}
                            </span>
                          </div>
                        )}

                        <div className="space-y-0.5 pt-2">
                          <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500">
                            {item.type === 'pdf_page' ? `Page ${item.pageNumber} • ${item.sizeFormatted}` : item.sizeFormatted}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/80">
                          <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                            <GripVertical className="w-3.5 h-3.5" />
                            <span className="font-extrabold text-slate-700 text-[11px]">Page #{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => handleMove(index, 'up')}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
                              title="Move Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={index === items.length - 1}
                              onClick={() => handleMove(index, 'down')}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
                              title="Move Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Remove Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating || loadingFiles}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Convert & Download Combined PDF ({items.length} Pages)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

