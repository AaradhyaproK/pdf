'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import JSZip from 'jszip';
import {
  Upload,
  Download,
  RefreshCw,
  Link as LinkIcon,
  Unlink,
  Percent,
  Sliders,
  Sparkles,
  Archive,
  Trash2,
  Maximize2,
  Check,
} from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  origW: number;
  origH: number;
  name: string;
  sizeFormatted: string;
  targetW: number;
  targetH: number;
  resizedUrl?: string;
  resizedBlob?: Blob;
}

export const SOCIAL_PRESETS = [
  { id: 'insta_sq', name: 'Instagram Square Post', width: 1080, height: 1080, label: '1080 × 1080 px (1:1)' },
  { id: 'insta_story', name: 'Instagram Story / Reel', width: 1080, height: 1920, label: '1080 × 1920 px (9:16)' },
  { id: 'yt_thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, label: '1280 × 720 px (16:9)' },
  { id: 'fb_cover', name: 'Facebook Cover', width: 820, height: 312, label: '820 × 312 px' },
  { id: 'tw_header', name: 'Twitter Header', width: 1500, height: 500, label: '1500 × 500 px (3:1)' },
  { id: 'hd_1080p', name: 'Full HD 1080p', width: 1920, height: 1080, label: '1920 × 1080 px (16:9)' },
  { id: 'uhd_4k', name: '4K Ultra HD', width: 3840, height: 2160, label: '3840 × 2160 px' },
];

export default function ResizeImagePage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage' | 'preset'>('pixels');

  // Pixel Mode State
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1920 / 1080);

  // Percentage Mode State
  const [percentage, setPercentage] = useState<number>(50);

  // Preset Mode State
  const [selectedPreset, setSelectedPreset] = useState(SOCIAL_PRESETS[0]);

  // Output format
  const [outputFormat, setOutputFormat] = useState<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('original');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper to load image dimensions
  const loadImageDimensions = (file: File): Promise<{ width: number; height: number; url: string }> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height, url });
      };
      img.onerror = () => {
        resolve({ width: 800, height: 600, url });
      };
      img.src = url;
    });
  };

  // Handle Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setLoadingFiles(true);
    toast.info('Reading image dimensions...');

    const newItems: ImageItem[] = [];

    for (const f of selected) {
      if (!f.type.startsWith('image/')) continue;
      const dims = await loadImageDimensions(f);

      newItems.push({
        id: `img_${Math.random()}_${Date.now()}`,
        file: f,
        previewUrl: dims.url,
        origW: dims.width,
        origH: dims.height,
        name: f.name,
        sizeFormatted: formatFileSize(f.size),
        targetW: dims.width,
        targetH: dims.height,
      });
    }

    if (!newItems.length) {
      toast.error('Please upload valid image files (JPG, PNG, WebP).');
      setLoadingFiles(false);
      return;
    }

    // Set default width/height/aspect ratio from first image
    if (items.length === 0 && newItems.length > 0) {
      const first = newItems[0];
      setWidth(first.origW);
      setHeight(first.origH);
      setAspectRatio(first.origW / first.origH);
    }

    setItems((prev) => [...prev, ...newItems]);
    setLoadingFiles(false);
    toast.success(`Loaded ${newItems.length} image(s) for batch resizing.`);
  };

  // Handle Width change with auto aspect ratio linking
  const handleWidthChange = (newW: number) => {
    const validW = Math.max(1, newW);
    setWidth(validW);
    if (lockAspect && aspectRatio > 0) {
      setHeight(Math.max(1, Math.round(validW / aspectRatio)));
    }
  };

  // Handle Height change with auto aspect ratio linking
  const handleHeightChange = (newH: number) => {
    const validH = Math.max(1, newH);
    setHeight(validH);
    if (lockAspect && aspectRatio > 0) {
      setWidth(Math.max(1, Math.round(validH * aspectRatio)));
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Canvas Image Resizer core logic
  const resizeCanvasImage = (
    imgUrl: string,
    targetW: number,
    targetH: number,
    mimeType: string
  ): Promise<{ blob: Blob; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unavailable'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve({ blob, dataUrl });
            else reject(new Error('Blob generation failed'));
          },
          mimeType,
          0.92
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = imgUrl;
    });
  };

  // Batch Process Resizing
  const handleBatchResize = async () => {
    if (!items.length) return;
    setIsProcessing(true);
    toast.info(`Resizing ${items.length} image(s)...`);

    try {
      const updatedItems = [...items];

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];

        let finalW = width;
        let finalH = height;

        if (resizeMode === 'percentage') {
          const factor = percentage / 100;
          finalW = Math.max(1, Math.round(item.origW * factor));
          finalH = Math.max(1, Math.round(item.origH * factor));
        } else if (resizeMode === 'preset') {
          finalW = selectedPreset.width;
          finalH = selectedPreset.height;
        } else if (resizeMode === 'pixels') {
          if (lockAspect) {
            const itemAspect = item.origW / item.origH;
            finalW = width;
            finalH = Math.max(1, Math.round(width / itemAspect));
          }
        }

        const mime = outputFormat === 'original' ? item.file.type || 'image/jpeg' : outputFormat;
        const result = await resizeCanvasImage(item.previewUrl, finalW, finalH, mime);

        updatedItems[i] = {
          ...item,
          targetW: finalW,
          targetH: finalH,
          resizedUrl: result.dataUrl,
          resizedBlob: result.blob,
        };
      }

      setItems(updatedItems);
      toast.success('Batch image resizing complete!');
    } catch {
      toast.error('Failed to resize images.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download All as ZIP Archive
  const handleDownloadZip = async () => {
    const resizedItems = items.filter((item) => item.resizedBlob);
    if (!resizedItems.length) return;

    toast.info('Packaging images into ZIP archive...');
    const zip = new JSZip();

    resizedItems.forEach((item) => {
      const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
      const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
      const fileName = `resized_${baseName}_${item.targetW}x${item.targetH}.${ext}`;
      zip.file(fileName, item.resizedBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized-images-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('ZIP file downloaded!');
  };

  const hasResizedItems = items.some((i) => i.resizedBlob);

  return (
    <ToolLayout
      slug="/image/resize"
      title="Batch Image Resizer (Pixels & % Scaling)"
      subtitle="Resize JPG, PNG, and WebP photos in batch by exact pixel dimensions with auto-linked aspect ratio, percentage scaling, or social media presets."
      badgeText="Batch Image Resizer"
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-24 md:pb-6">
        {!items.length ? (
          <div className="p-8 sm:p-14 border border-slate-200 hover:border-slate-800 rounded-3xl bg-slate-50/70 hover:bg-slate-50 transition-all text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Maximize2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Upload Multiple Images to Resize</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-medium">
                Select one or multiple photos to scale by exact pixels, percentage (%), or social media formats.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer">
              {loadingFiles ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Select Images to Resize</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={loadingFiles}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6 text-slate-900">
              {/* Resizing Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">Choose Resize Mode:</label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setResizeMode('pixels')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      resizeMode === 'pixels' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Exact Pixels (px)</span>
                    <span className="sm:hidden">Pixels</span>
                  </button>

                  <button
                    onClick={() => setResizeMode('percentage')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      resizeMode === 'percentage' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Percentage (%)</span>
                    <span className="sm:hidden">% Scale</span>
                  </button>

                  <button
                    onClick={() => setResizeMode('preset')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      resizeMode === 'preset' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Social Presets</span>
                    <span className="sm:hidden">Presets</span>
                  </button>
                </div>
              </div>

              {/* Mode Controls */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                {/* 1. Pixels Mode */}
                {resizeMode === 'pixels' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Width (px):</label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 sm:px-4 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        />
                      </div>

                      {/* Linked Aspect Ratio Button */}
                      <button
                        type="button"
                        onClick={() => setLockAspect(!lockAspect)}
                        className={`p-3 rounded-2xl border mt-5 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                          lockAspect
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white border-slate-300 text-slate-400 hover:text-slate-700'
                        }`}
                        title={lockAspect ? 'Aspect Ratio Locked (Width auto-aligns Height)' : 'Aspect Ratio Unlocked'}
                      >
                        {lockAspect ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Height (px):</label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 sm:px-4 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-500 text-center">
                      {lockAspect
                        ? '🔗 Aspect Ratio Locked: Changing width automatically updates height proportionally.'
                        : '🔓 Aspect Ratio Unlocked: Width and height can be scaled independently.'}
                    </p>
                  </div>
                )}

                {/* 2. Percentage Mode */}
                {resizeMode === 'percentage' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-black text-slate-900">
                      <span>Scale Percentage:</span>
                      <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 font-extrabold">
                        {percentage}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />

                    {/* Quick Percentage Presets */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                      {[25, 50, 75, 100, 125, 150, 200].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setPercentage(pct)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            percentage === pct
                              ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Social Media Presets */}
                {resizeMode === 'preset' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar">
                    {SOCIAL_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedPreset.id === preset.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold">{preset.name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{preset.label}</div>
                        </div>
                        {selectedPreset.id === preset.id && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Output Format Selector */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">Export Format:</span>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
                  >
                    <option value="original">Keep Original Format</option>
                    <option value="image/jpeg">JPG / JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleBatchResize}
                disabled={isProcessing || loadingFiles}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-base shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-200" />}
                <span>Resize {items.length} Image(s) Now</span>
              </button>
            </div>

            {/* Batch Image Cards List */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 text-slate-900">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700">Image Batch Queue ({items.length} Files)</h4>
                <label className="text-xs text-indigo-600 font-extrabold hover:underline cursor-pointer">
                  + Add More Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loadingFiles}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-2xs">
                    <div className="relative">
                      <img
                        src={item.resizedUrl || item.previewUrl}
                        alt={item.name}
                        className="w-full h-32 object-contain bg-white rounded-xl border border-slate-200"
                      />
                      {item.resizedUrl && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] shadow-sm">
                          RESIZED
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>Original: {item.origW} × {item.origH} px</span>
                        {item.resizedBlob && (
                          <span className="text-emerald-700 font-black">
                            Target: {item.targetW} × {item.targetH} px
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                      {item.resizedUrl ? (
                        <a
                          href={item.resizedUrl}
                          download={`resized-${item.name}`}
                          className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">Ready to resize</span>
                      )}

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ZIP Download Button if Resized Items Exist */}
              {hasResizedItems && items.length > 1 && (
                <button
                  onClick={handleDownloadZip}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <Archive className="w-4 h-4" />
                  <span>Download All Resized Images (ZIP Archive)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Mobile Action Navbar */}
      {items.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-2.5 flex items-center justify-between gap-2 md:hidden text-slate-900">
          {/* Quick Mode Pills Scroller */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-1 max-w-[60vw]">
            <button
              onClick={() => setResizeMode('pixels')}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all cursor-pointer ${
                resizeMode === 'pixels' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Pixels
            </button>
            <button
              onClick={() => setResizeMode('percentage')}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all cursor-pointer ${
                resizeMode === 'percentage' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              % Scale
            </button>
            <button
              onClick={() => setResizeMode('preset')}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all cursor-pointer ${
                resizeMode === 'preset' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Presets
            </button>
          </div>

          {/* Action Button: Resize / Download */}
          {hasResizedItems ? (
            <button
              onClick={handleDownloadZip}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          ) : (
            <button
              onClick={handleBatchResize}
              disabled={isProcessing || loadingFiles}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer whitespace-nowrap"
            >
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-200" />}
              <span>Resize</span>
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
