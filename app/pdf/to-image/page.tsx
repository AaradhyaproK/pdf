'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import { PDFPageGridList } from '@/components/PDFPageGridList';
import JSZip from 'jszip';
import { toast } from 'sonner';
import { Download, FileImage } from 'lucide-react';

export default function PDFToImagePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [renderedImages, setRenderedImages] = useState<{ pageNumber: number; dataUrl: string }[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setRenderedImages([]);
    setZipUrl(null);

    if (selected.length > 0) {
      setIsProcessing(true);
      try {
        const images = await renderPDFPagesToImages(selected[0].file, 1.5);
        setRenderedImages(images);
      } catch (err: any) {
        toast.error('Failed to render PDF page thumbnails.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setZipUrl(null);

    try {
      const images = renderedImages.length > 0
        ? renderedImages
        : await renderPDFPagesToImages(files[0].file, 2.0);

      setRenderedImages(images);

      // Create ZIP archive
      const zip = new JSZip();
      const folder = zip.folder('pdf-pages');

      images.forEach((img) => {
        const base64Data = img.dataUrl.replace(/^data:image\/(png|jpeg);base64,/, '');
        folder?.file(`page-${img.pageNumber}.${format === 'png' ? 'png' : 'jpg'}`, base64Data, { base64: true });
      });

      const zipContent = await zip.generateAsync({ type: 'blob' });
      setZipUrl(URL.createObjectURL(zipContent));

      toast.success(`Converted ${images.length} PDF pages to images!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to convert PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/to-image"
      title="Convert PDF to High-Res JPG/PNG"
      subtitle="Export PDF pages into crisp, high-resolution PNG or JPG images. Download single images or batch ZIP."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setRenderedImages([]);
            setZipUrl(null);
          }}
          title="Upload PDF document to convert to images"
        />

        {renderedImages.length > 0 && (
          <div className="space-y-6">
            <PDFPageGridList
              title="PDF Pages Preview"
              pages={renderedImages}
              selectable={false}
            />

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-indigo-500" />
                  Select Output Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={`p-3 rounded-2xl border font-bold text-sm transition-all ${
                      format === 'png'
                        ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    PNG (High Quality)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('jpeg')}
                    className={`p-3 rounded-2xl border font-bold text-sm transition-all ${
                      format === 'jpeg'
                        ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    JPG (Compact Size)
                  </button>
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all cursor-pointer"
              >
                {isProcessing ? 'Processing PDF Pages...' : `Convert ${renderedImages.length} Pages to ${format.toUpperCase()}`}
              </button>
            </div>
          </div>
        )}

        {zipUrl && renderedImages.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold">Rendered {renderedImages.length} Pages!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">Download single page images or complete ZIP archive.</p>
              </div>
              <a
                href={zipUrl}
                download="pdf-page-images.zip"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download ZIP Archive</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
