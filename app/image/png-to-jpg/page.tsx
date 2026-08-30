'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import { Upload, Download, RefreshCw, FileImage, Layers, Settings, Sparkles } from 'lucide-react';

interface ConvertedFile {
  originalName: string;
  dataUrl: string;
  size: number;
}

export default function PNGToJPGPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(0.92);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [converted, setConverted] = useState<ConvertedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const pngs = selected.filter((f) => f.type === 'image/png' || f.name.toLowerCase().endsWith('.png'));
    if (!pngs.length) {
      toast.error('Please select PNG image files.');
      return;
    }
    setFiles(pngs);
    setConverted([]);
    toast.success(`Loaded ${pngs.length} PNG images.`);
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    toast.info('Converting PNG images to JPG...');

    try {
      const results: ConvertedFile[] = [];

      for (const file of files) {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        await new Promise((res) => {
          image.onload = res;
          image.src = objectUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0);

          const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64Length = jpgDataUrl.split(',')[1]?.length || 0;
          const estSize = Math.round((base64Length * 3) / 4);

          results.push({
            originalName: file.name.replace(/\.png$/i, '.jpg'),
            dataUrl: jpgDataUrl,
            size: estSize,
          });
        }
        URL.revokeObjectURL(objectUrl);
      }

      setConverted(results);
      toast.success(`Successfully converted ${results.length} images to JPG!`);
    } catch {
      toast.error('Failed to convert images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: ConvertedFile) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.originalName;
    a.click();
  };

  return (
    <ToolLayout
      slug="/image/png-to-jpg"
      title="PNG to JPG Converter Online"
      subtitle="Convert PNG images to JPG format in seconds with custom compression quality and solid background selection. 100% private client-side processing."
      badgeText="Bulk PNG to JPG Converter"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {!files.length ? (
          <div className="p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Upload PNG Images to Convert</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select single or multiple PNG images. Convert instantly to high-quality JPG files.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
              <FileImage className="w-4 h-4" />
              <span>Select PNG Files</span>
              <input type="file" accept="image/png" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Selected {files.length} PNG File(s)</span>
                </div>
                <label className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer">
                  + Add More PNGs
                  <input type="file" accept="image/png" multiple onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Settings Control Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>JPG Quality: {Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Background Color (for transparency):</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Convert PNG to JPG Now</span>
              </button>
            </div>

            {/* Converted Downloads List */}
            {converted.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">Converted JPG Files ({converted.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {converted.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={item.dataUrl} alt="Thumbnail" className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-white" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.originalName}</p>
                          <p className="text-[11px] text-slate-500">{(item.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadSingle(item)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
