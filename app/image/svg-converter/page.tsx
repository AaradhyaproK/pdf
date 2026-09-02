'use client';

import { useState, ChangeEvent } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  FileCode,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

type ScaleFactor = 1 | 2 | 4 | 8;
type OutputFormat = 'png' | 'jpeg';

export default function SVGConverterPage() {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [svgFileName, setSvgFileName] = useState<string>('vector-image');
  const [scale, setScale] = useState<ScaleFactor>(2);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSvgFileName(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = () => {
        setSvgContent(reader.result as string);
        setOutputUrl(null);
        toast.success('SVG loaded successfully');
      };
      reader.readAsText(file);
    }
  };

  const handleConvert = () => {
    if (!svgContent) return;
    setIsProcessing(true);

    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = (img.width || 800) * scale;
        const height = (img.height || 800) * scale;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // If JPG or colored background PNG, fill background
        if (format === 'jpeg' || bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const resultUrl = canvas.toDataURL(`image/${format}`, 0.95);
        setOutputUrl(resultUrl);
        setIsProcessing(false);
        toast.success(`Converted SVG to ${format.toUpperCase()} (${scale}x scale)!`);
      };

      img.onerror = () => {
        setIsProcessing(false);
        toast.error('Failed to parse SVG graphics.');
      };

      img.src = url;
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      toast.error('SVG conversion failed.');
    }
  };

  return (
    <ToolLayout
      slug="/image/svg-converter"
      title="SVG to PNG / JPG Vector Converter"
      subtitle="Render high-res PNG cutouts or JPG images from SVG vectors at 1x, 2x, 4x, or 8x scale 100% locally."
    >
      <div className="space-y-6">
        {!svgContent ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center bg-slate-50/60 hover:bg-slate-100/60 transition-all cursor-pointer">
            <label className="cursor-pointer space-y-4 flex flex-col items-center">
              <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-xs">
                <FileCode className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Upload SVG Vector File</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Instant local rasterization at 100% vector fidelity
                </p>
              </div>
              <div className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-md transition-all">
                Browse SVG from Device
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Options Card */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-sky-600" />
                  <span className="text-sm font-black text-slate-900">{svgFileName}.svg</span>
                </div>
                <label className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all">
                  <span>Change File</span>
                  <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                {/* Scale Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Resolution Scale</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 4, 8].map((s) => (
                      <button
                        key={s}
                        onClick={() => setScale(s as ScaleFactor)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          scale === s
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Target Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="png">PNG (Supports Transparency)</option>
                    <option value="jpeg">JPG (Solid Background)</option>
                  </select>
                </div>

                {/* Background Fill Color */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Background Fill</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                    />
                    <button
                      onClick={() => setBgColor(bgColor === 'transparent' ? '#ffffff' : 'transparent')}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        bgColor === 'transparent'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {bgColor === 'transparent' ? 'Transparent' : 'Solid Color'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Convert & Render SVG</span>
              </button>
            </div>

            {/* Output Preview */}
            {outputUrl && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Raster Image Rendered!</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">Exported at {scale}x resolution ({format.toUpperCase()})</p>
                </div>

                <div className="flex justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-inner">
                  <img src={outputUrl} alt="Converted PNG/JPG" className="max-h-64 object-contain rounded-xl shadow-md" />
                </div>

                <a
                  href={outputUrl}
                  download={`${svgFileName}-${scale}x.${format}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted Image</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
