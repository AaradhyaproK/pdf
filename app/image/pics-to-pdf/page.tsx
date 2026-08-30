'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { toast } from 'sonner';
import { Upload, Download, RefreshCw, Camera, MoveUp, MoveDown, Trash2, Sparkles } from 'lucide-react';

interface PictureItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function PicsToPDFPage() {
  const [pictures, setPictures] = useState<PictureItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const validPics = selected.filter((f) => f.type.startsWith('image/'));
    if (!validPics.length) {
      toast.error('Please select image files (JPG, PNG, WebP, HEIC).');
      return;
    }

    const newItems: PictureItem[] = validPics.map((f) => ({
      id: `pic_${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));

    setPictures((prev) => [...prev, ...newItems]);
    toast.success(`Added ${validPics.length} picture(s).`);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newPics = [...pictures];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newPics.length) return;
    const temp = newPics[index];
    newPics[index] = newPics[targetIdx];
    newPics[targetIdx] = temp;
    setPictures(newPics);
  };

  const handleRemove = (id: string) => {
    setPictures(pictures.filter((item) => item.id !== id));
  };

  const handleGeneratePDF = async () => {
    if (!pictures.length) return;
    setIsGenerating(true);
    toast.info('Converting pictures into PDF document...');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of pictures) {
        const file = item.file;
        const arrayBuffer = await file.arrayBuffer();

        // Convert canvas image to PNG bytes for universal pdf-lib embedding
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

        const embeddedImage = await pdfDoc.embedPng(pngBytes);
        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = 595.28; // A4
        let pageHeight = 841.89;

        if (pageSize === 'letter') {
          pageWidth = PageSizes.Letter[0];
          pageHeight = PageSizes.Letter[1];
        } else if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

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
      a.download = `pics-document-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);

      toast.success('Pics to PDF created successfully!');
    } catch {
      toast.error('Failed to convert pictures to PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/pics-to-pdf"
      title="Pics to PDF Converter (Turn Photos to PDF)"
      subtitle="Turn phone pictures, receipts, scans, and photos into a clean PDF document. Drag and drop reordering, custom page sizes (A4, Letter), 100% private."
      badgeText="Turn Pictures to PDF"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {!pictures.length ? (
          <div className="p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Upload Pictures & Photos to Convert</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select pictures from your phone, camera roll, or computer to convert to PDF.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Select Pictures & Photos</span>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Page Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Page Format:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    <option value="a4">Standard A4 Document</option>
                    <option value="letter">US Letter Document</option>
                    <option value="fit">Fit Exact Picture Dimensions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Page Margin:</span>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    <option value={0}>No Margin (Full Bleed)</option>
                    <option value={20}>Standard Margin (20px)</option>
                    <option value={40}>Wide Margin (40px)</option>
                  </select>
                </div>
              </div>

              {/* Picture Cards & Reorder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500">Pictures ({pictures.length})</h4>
                  <label className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                    + Add More Pictures
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {pictures.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                    >
                      <img src={item.previewUrl} alt="Picture" className="w-full h-32 object-contain bg-white rounded-xl border border-slate-200" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-700">Pic {index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'up')}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={index === pictures.length - 1}
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
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Convert & Download Pics to PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
