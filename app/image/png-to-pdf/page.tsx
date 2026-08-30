'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { toast } from 'sonner';
import { Upload, Download, RefreshCw, FileText, MoveUp, MoveDown, Trash2 } from 'lucide-react';

interface PNGFileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function PNGToPDFPage() {
  const [items, setItems] = useState<PNGFileItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const pngs = selected.filter((f) => f.type === 'image/png' || f.name.toLowerCase().endsWith('.png'));
    if (!pngs.length) {
      toast.error('Please select valid PNG image files.');
      return;
    }

    const newItems: PNGFileItem[] = pngs.map((f) => ({
      id: `png_${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));

    setItems((prev) => [...prev, ...newItems]);
    toast.success(`Added ${pngs.length} PNG image(s).`);
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
    toast.info('Generating PDF document from PNG images...');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of items) {
        const imageBytes = await item.file.arrayBuffer();
        const embeddedImage = await pdfDoc.embedPng(imageBytes);

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = 595.28; // A4 default
        let pageHeight = 841.89;

        if (pageSize === 'letter') {
          pageWidth = PageSizes.Letter[0];
          pageHeight = PageSizes.Letter[1];
        } else if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        }

        if (pageSize !== 'fit' && orientation === 'landscape') {
          const tmp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = tmp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Draw image scaled within margins
        const maxDrawW = pageWidth - margin * 2;
        const maxDrawH = pageHeight - margin * 2;
        const scale = Math.min(maxDrawW / imgWidth, maxDrawH / imgHeight, 1);

        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;
        const drawX = (pageWidth - drawW) / 2;
        const drawY = (pageHeight - drawH) / 2;

        page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `pngs-converted-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);

      toast.success('PNG to PDF document downloaded successfully!');
    } catch {
      toast.error('Failed to generate PDF from PNG images.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/png-to-pdf"
      title="PNG to PDF Converter Online"
      subtitle="Convert single or multiple PNG images into a clean, formatted PDF document with customizable page sizes, orientation, and margins."
      badgeText="Combine PNGs to PDF"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {!items.length ? (
          <div className="p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Upload PNG Files to Convert to PDF</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select PNG images. Drag and drop reorder pages and export as PDF.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
              <FileText className="w-4 h-4" />
              <span>Select PNG Files</span>
              <input type="file" accept="image/png" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Page Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Page Size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    <option value="a4">Standard A4</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Fit to Image Size</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Orientation:</span>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    disabled={pageSize === 'fit'}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-50"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Page Margin:</span>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    <option value={0}>No Margin (0px)</option>
                    <option value={20}>Small Margin (20px)</option>
                    <option value={40}>Big Margin (40px)</option>
                  </select>
                </div>
              </div>

              {/* PNG List / Reorder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500">PNG Pages ({items.length})</h4>
                  <label className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                    + Add More PNGs
                    <input type="file" accept="image/png" multiple onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                    >
                      <img src={item.previewUrl} alt="Preview" className="w-full h-32 object-contain bg-white rounded-xl border border-slate-200" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-700">Page {index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'up')}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={index === items.length - 1}
                            onClick={() => handleMove(index, 'down')}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 rounded hover:bg-rose-100 text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Convert & Download PNG to PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
