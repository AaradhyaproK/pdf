'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import { Upload, Download, RefreshCw, FileImage, Layers, Sparkles } from 'lucide-react';

interface ConvertedPNGFile {
  originalName: string;
  dataUrl: string;
  size: number;
}

export default function JPGToPNGPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [converted, setConverted] = useState<ConvertedPNGFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const jpgs = selected.filter(
      (f) =>
        f.type === 'image/jpeg' ||
        f.name.toLowerCase().endsWith('.jpg') ||
        f.name.toLowerCase().endsWith('.jpeg')
    );
    if (!jpgs.length) {
      toast.error('Please select JPG/JPEG image files.');
      return;
    }
    setFiles(jpgs);
    setConverted([]);
    toast.success(`Loaded ${jpgs.length} JPG images.`);
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    toast.info('Converting JPG images to PNG...');

    try {
      const results: ConvertedPNGFile[] = [];

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
          ctx.drawImage(image, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          const base64Length = pngDataUrl.split(',')[1]?.length || 0;
          const estSize = Math.round((base64Length * 3) / 4);

          results.push({
            originalName: file.name.replace(/\.(jpg|jpeg)$/i, '.png'),
            dataUrl: pngDataUrl,
            size: estSize,
          });
        }
        URL.revokeObjectURL(objectUrl);
      }

      setConverted(results);
      toast.success(`Successfully converted ${results.length} images to PNG!`);
    } catch {
      toast.error('Failed to convert images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: ConvertedPNGFile) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.originalName;
    a.click();
  };

  return (
    <ToolLayout
      slug="/image/jpg-to-png"
      title="JPG to PNG Converter Online (Lossless)"
      subtitle="Convert JPG/JPEG images to high-resolution PNG format online. 100% free, bulk image conversion, zero compression artifacts, client-side processing."
      badgeText="Lossless JPG to PNG"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {!files.length ? (
          <div className="p-8 sm:p-12 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Upload JPG Images to Convert to PNG</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select single or multiple JPG files. Convert instantly to lossless PNG format.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
              <FileImage className="w-4 h-4" />
              <span>Select JPG Files</span>
              <input type="file" accept="image/jpeg" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Selected {files.length} JPG File(s)</span>
                </div>
                <label className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer">
                  + Add More JPGs
                  <input type="file" accept="image/jpeg" multiple onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Convert JPG to PNG Now</span>
              </button>
            </div>

            {/* Converted Downloads List */}
            {converted.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">Converted PNG Files ({converted.length})</h4>
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
