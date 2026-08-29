'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { watermarkPDF, WatermarkOptions } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Stamp } from 'lucide-react';

export default function WatermarkPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(40);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<WatermarkOptions['position']>('center');
  const [colorHex, setColorHex] = useState('#ff0000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleApplyWatermark = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    try {
      const bytes = await watermarkPDF(files[0].file, {
        text: watermarkText,
        opacity,
        rotation,
        position,
        colorHex,
      });
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Watermark applied successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to watermark PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/watermark"
      title="Watermark PDF Online"
      subtitle="Stamp custom text or image watermarks onto your PDF pages. Customize position, transparency, and rotation."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
          }}
          title="Upload PDF to watermark"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Stamp className="w-4 h-4 text-indigo-500" />
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Opacity ({opacity}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Rotation ({rotation}°)</label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Text Color</label>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full h-11 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800 border"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyWatermark}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Stamping Watermark...' : 'Apply Watermark Now'}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">Watermarked PDF Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Stamped text overlay on document pages.</p>
            </div>
            <a
              href={downloadUrl}
              download="watermarked-document.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
