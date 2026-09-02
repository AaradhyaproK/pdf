'use client';

import { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  Crop,
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Check,
  Move,
  Grid,
  Sliders,
  RefreshCw,
  Copy,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { toast } from 'sonner';

type AspectRatioPreset =
  | 'free'
  | '1:1'
  | '16:9'
  | '9:16'
  | '4:3'
  | '3:2'
  | '5:4'
  | '2:3'
  | '21:9'
  | 'custom';

interface CustomRatio {
  w: number;
  h: number;
}

export default function ImageCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('image');
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('free');
  const [customRatio, setCustomRatio] = useState<CustomRatio>({ w: 16, h: 9 });

  // Rotations
  const [stepRotation, setStepRotation] = useState<number>(0); // 0, 90, 180, 270
  const [straightenAngle, setStraightenAngle] = useState<number>(0); // -45 to +45 deg (0.1 step)
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Alignment grid overlay state
  const [showGrid, setShowGrid] = useState<boolean>(false);

  // Export settings
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [exportQuality, setExportQuality] = useState<number>(0.92);
  const [croppedOutputUrl, setCroppedOutputUrl] = useState<string | null>(null);
  const [croppedDimensions, setCroppedDimensions] = useState<{ width: number; height: number } | null>(null);

  // Crop area percentage (0 to 100) relative to rotated bounding container
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 });

  // Interactive Dragging state
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startBoxRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const totalAngle = (stepRotation + straightenAngle) % 360;

  // Compute rotated composition dimensions
  const getRotatedDimensions = useCallback(() => {
    const w = naturalDimensions.width || 1000;
    const h = naturalDimensions.height || 1000;
    const rad = (totalAngle * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    const rotW = Math.round(w * absCos + h * absSin);
    const rotH = Math.round(w * absSin + h * absCos);
    return { rotW, rotH, containerRatio: rotW / rotH };
  }, [naturalDimensions, totalAngle]);

  // Target aspect ratio (numeric ratio width / height)
  const getTargetRatio = useCallback((): number | null => {
    if (aspectRatio === 'free') return null;
    if (aspectRatio === 'custom') {
      return customRatio.w > 0 && customRatio.h > 0 ? customRatio.w / customRatio.h : 1;
    }
    const ratioMap: Record<string, number> = {
      '1:1': 1,
      '16:9': 16 / 9,
      '9:16': 9 / 16,
      '4:3': 4 / 3,
      '3:2': 3 / 2,
      '5:4': 5 / 4,
      '2:3': 2 / 3,
      '21:9': 21 / 9,
    };
    return ratioMap[aspectRatio] || null;
  }, [aspectRatio, customRatio]);

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setCroppedOutputUrl(null);
      setCroppedDimensions(null);
      setStepRotation(0);
      setStraightenAngle(0);
      setFlipH(false);
      setFlipV(false);
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      toast.success('Image loaded successfully');
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const w = imageRef.current.naturalWidth;
      const h = imageRef.current.naturalHeight;
      setNaturalDimensions({ width: w, height: h });
    }
  };

  // Recalculate cropBox whenever target ratio, image size, or total rotation changes
  const applyRatioConstraint = useCallback(() => {
    const targetR = getTargetRatio();
    if (!targetR) return;

    const { containerRatio } = getRotatedDimensions();

    setCropBox((prev) => {
      // Formula: height_percent = width_percent * (containerRatio / targetR)
      let newW = prev.width;
      let newH = newW * (containerRatio / targetR);

      if (newH > 90) {
        newH = 90;
        newW = newH * (targetR / containerRatio);
      }
      if (newW > 90) {
        newW = 90;
        newH = newW * (containerRatio / targetR);
      }

      newW = Math.max(10, Math.min(95, newW));
      newH = Math.max(10, Math.min(95, newH));

      return {
        x: Math.max(0, Math.min(100 - newW, (100 - newW) / 2)),
        y: Math.max(0, Math.min(100 - newH, (100 - newH) / 2)),
        width: newW,
        height: newH,
      };
    });
  }, [getTargetRatio, getRotatedDimensions]);

  useEffect(() => {
    applyRatioConstraint();
  }, [aspectRatio, customRatio, totalAngle, applyRatioConstraint]);

  // Pointer drag / resize logic
  const handlePointerDown = (handle: string, clientX: number, clientY: number) => {
    setActiveHandle(handle);
    startPosRef.current = { x: clientX, y: clientY };
    startBoxRef.current = { ...cropBox };
  };

  useEffect(() => {
    if (!activeHandle || !containerRef.current) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaXPercent = ((clientX - startPosRef.current.x) / rect.width) * 100;
      const deltaYPercent = ((clientY - startPosRef.current.y) / rect.height) * 100;

      const start = startBoxRef.current;
      const minSize = 5; // min 5% size

      const targetR = getTargetRatio();
      const { containerRatio } = getRotatedDimensions();

      setCropBox((prev) => {
        let { x, y, width, height } = start;

        if (activeHandle === 'move') {
          x = Math.max(0, Math.min(100 - width, start.x + deltaXPercent));
          y = Math.max(0, Math.min(100 - height, start.y + deltaYPercent));
        } else {
          // Resizing handles
          if (activeHandle.includes('e')) {
            width = Math.max(minSize, Math.min(100 - start.x, start.width + deltaXPercent));
          }
          if (activeHandle.includes('s')) {
            height = Math.max(minSize, Math.min(100 - start.y, start.height + deltaYPercent));
          }
          if (activeHandle.includes('w')) {
            const maxDelta = start.width - minSize;
            const actualDelta = Math.min(maxDelta, Math.max(-start.x, deltaXPercent));
            x = start.x + actualDelta;
            width = start.width - actualDelta;
          }
          if (activeHandle.includes('n')) {
            const maxDelta = start.height - minSize;
            const actualDelta = Math.min(maxDelta, Math.max(-start.y, deltaYPercent));
            y = start.y + actualDelta;
            height = start.height - actualDelta;
          }

          // Enforce Aspect Ratio during resize
          if (targetR) {
            if (activeHandle === 'e' || activeHandle === 'w' || activeHandle === 'ne' || activeHandle === 'nw') {
              height = width * (containerRatio / targetR);
              if (y + height > 100) {
                height = 100 - y;
                width = height * (targetR / containerRatio);
              }
            } else if (activeHandle === 'n' || activeHandle === 's' || activeHandle === 'se' || activeHandle === 'sw') {
              width = height * (targetR / containerRatio);
              if (x + width > 100) {
                width = 100 - x;
                height = width * (containerRatio / targetR);
              }
            }
          }
        }

        return {
          x: Math.max(0, Math.min(100 - width, x)),
          y: Math.max(0, Math.min(100 - height, y)),
          width: Math.max(minSize, Math.min(100 - x, width)),
          height: Math.max(minSize, Math.min(100 - y, height)),
        };
      });
    };

    const handlePointerUp = () => {
      setActiveHandle(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [activeHandle, getTargetRatio, getRotatedDimensions]);

  // Crop Render & Canvas Export
  const generateCrop = useCallback(() => {
    if (!imageSrc || !imageRef.current) return;
    const img = imageRef.current;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;

    const rad = (totalAngle * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));

    const rotW = Math.round(naturalW * absCos + naturalH * absSin);
    const rotH = Math.round(naturalW * absSin + naturalH * absCos);

    const cropX = (cropBox.x / 100) * rotW;
    const cropY = (cropBox.y / 100) * rotH;
    const cropW = Math.max(1, Math.round((cropBox.width / 100) * rotW));
    const cropH = Math.max(1, Math.round((cropBox.height / 100) * rotH));

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    ctx.translate(rotW / 2 - cropX, rotH / 2 - cropY);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    ctx.drawImage(img, -naturalW / 2, -naturalH / 2, naturalW, naturalH);
    ctx.restore();

    const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
    const output = canvas.toDataURL(mimeType, exportQuality);
    setCroppedOutputUrl(output);
    setCroppedDimensions({ width: cropW, height: cropH });
    toast.success(`Crop rendered (${cropW} × ${cropH} px)`);
  }, [imageSrc, totalAngle, cropBox, flipH, flipV, exportFormat, exportQuality]);

  // Copy image to clipboard
  const copyToClipboard = async () => {
    if (!croppedOutputUrl) return;
    try {
      const response = await fetch(croppedOutputUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      toast.success('Cropped image copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Calculate live output resolution for UI preview
  const liveOutputResolution = () => {
    const { rotW, rotH } = getRotatedDimensions();
    const w = Math.round((cropBox.width / 100) * rotW);
    const h = Math.round((cropBox.height / 100) * rotH);
    const r = (w / (h || 1)).toFixed(2);
    return { w, h, ratio: r };
  };

  const currentRes = liveOutputResolution();
  const { rotW, rotH } = getRotatedDimensions();

  return (
    <ToolLayout
      slug="/image/crop"
      title="Image Cropper & Precision Straightener"
      subtitle="Crop photos to pixel-accurate aspect ratios, straighten horizon angles with precision alignment, rotate, and flip 100% client-side."
    >
      <div className="space-y-6">
        {!imageSrc ? (
          /* Upload Card */
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center bg-slate-50/60 hover:bg-slate-100/60 transition-all cursor-pointer shadow-xs">
            <label className="cursor-pointer space-y-4 flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-sm">
                <Crop className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Select or Drop an Image to Crop & Straighten
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium max-w-md">
                  Supports JPG, PNG, WEBP, HEIC & GIF. 100% Private local browser processing with zero upload.
                </p>
              </div>
              <div className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-md transition-all">
                Browse Image from Device
              </div>
            </label>
          </div>
        ) : (
          /* Main Workspace Area */
          <div className="space-y-6">
            {/* Top Toolbar 1: Aspect Ratio Pills & Custom Ratio */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-xs font-black uppercase text-slate-500 mr-1 shrink-0 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ratio:</span>
                  </span>
                  {[
                    { id: 'free', label: 'Freeform' },
                    { id: '1:1', label: '1:1 Square' },
                    { id: '16:9', label: '16:9 HD' },
                    { id: '9:16', label: '9:16 Story' },
                    { id: '4:3', label: '4:3 Standard' },
                    { id: '3:2', label: '3:2 Photo' },
                    { id: '5:4', label: '5:4 Print' },
                    { id: '2:3', label: '2:3 Banner' },
                    { id: '21:9', label: '21:9 Cinema' },
                    { id: 'custom', label: 'Custom' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio.id as AspectRatioPreset)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                        aspectRatio === ratio.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>

                <label className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Image</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Custom Ratio Input Bar */}
              {aspectRatio === 'custom' && (
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/80 animate-in fade-in-50 duration-150">
                  <span className="text-xs font-bold text-slate-600">Enter Ratio Proportions:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={customRatio.w}
                      onChange={(e) => setCustomRatio((prev) => ({ ...prev, w: Math.max(1, parseFloat(e.target.value) || 1) }))}
                      className="w-16 px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg text-center"
                      placeholder="W"
                    />
                    <span className="text-slate-400 font-bold">:</span>
                    <input
                      type="number"
                      min="1"
                      value={customRatio.h}
                      onChange={(e) => setCustomRatio((prev) => ({ ...prev, h: Math.max(1, parseFloat(e.target.value) || 1) }))}
                      className="w-16 px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg text-center"
                      placeholder="H"
                    />
                  </div>
                  <span className="text-xs text-slate-400 italic">
                    (Target Aspect: {(customRatio.w / (customRatio.h || 1)).toFixed(2)}:1)
                  </span>
                </div>
              )}
            </div>

            {/* Top Toolbar 2: Straighten Angle & Transform Controls */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Straighten Angle Slider */}
                <div className="flex-1 min-w-[280px] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-sky-600" />
                      <span>Straighten Angle:</span>
                      <span className="text-slate-900 font-black font-mono bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {straightenAngle > 0 ? `+${straightenAngle.toFixed(1)}°` : `${straightenAngle.toFixed(1)}°`}
                      </span>
                    </span>

                    {/* Quick Nudge Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setStraightenAngle((prev) => Math.max(-45, +(prev - 1).toFixed(1)));
                          setShowGrid(true);
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-extrabold text-slate-700"
                        title="-1° Angle Adjust"
                      >
                        -1°
                      </button>
                      <button
                        onClick={() => {
                          setStraightenAngle(0);
                          setShowGrid(false);
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-extrabold text-slate-700"
                        title="Reset Angle to 0°"
                      >
                        0° Reset
                      </button>
                      <button
                        onClick={() => {
                          setStraightenAngle((prev) => Math.min(45, +(prev + 1).toFixed(1)));
                          setShowGrid(true);
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-extrabold text-slate-700"
                        title="+1° Angle Adjust"
                      >
                        +1°
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400">-45°</span>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="0.1"
                      value={straightenAngle}
                      onChange={(e) => {
                        setStraightenAngle(parseFloat(e.target.value));
                        setShowGrid(true);
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                    <span className="text-[10px] font-bold text-slate-400">+45°</span>
                  </div>
                </div>

                {/* 90-Deg Rotations & Flips & Grid Toggle */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => setStepRotation((prev) => (prev + 270) % 360)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    title="Rotate 90° Counter-Clockwise"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">-90°</span>
                  </button>

                  <button
                    onClick={() => setStepRotation((prev) => (prev + 90) % 360)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="hidden sm:inline">+90°</span>
                  </button>

                  <button
                    onClick={() => setFlipH((prev) => !prev)}
                    className={`p-2 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                      flipH ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Flip Horizontally"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setFlipV((prev) => !prev)}
                    className={`p-2 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                      flipV ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Flip Vertically"
                  >
                    <FlipVertical className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowGrid((prev) => !prev)}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                      showGrid ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Toggle Alignment Grid lines for straightening horizon"
                  >
                    <Grid className="w-4 h-4" />
                    <span className="hidden md:inline">Grid</span>
                  </button>

                  {(stepRotation !== 0 || straightenAngle !== 0 || flipH || flipV) && (
                    <button
                      onClick={() => {
                        setStepRotation(0);
                        setStraightenAngle(0);
                        setFlipH(false);
                        setFlipV(false);
                        toast.info('Transformations reset');
                      }}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Reset transformations"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Canvas Preview Container */}
            <div className="relative bg-slate-950 rounded-3xl p-4 sm:p-6 flex items-center justify-center overflow-hidden min-h-[380px] touch-none select-none border border-slate-800 shadow-2xl">
              <div
                ref={containerRef}
                className="relative max-w-full max-h-[55vh] flex items-center justify-center select-none overflow-hidden rounded-xl"
                style={{
                  aspectRatio: `${rotW} / ${rotH}`,
                  maxHeight: '55vh',
                }}
              >
                {/* Rotated Source Image */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Original Preview"
                  onLoad={handleImageLoad}
                  className="pointer-events-none transition-transform duration-75 max-w-full max-h-full object-contain"
                  style={{
                    transform: `rotate(${totalAngle}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  }}
                />

                {/* Alignment Grid Overlay for Straightening */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-12 grid-rows-12 border border-sky-400/20 z-10">
                    {Array.from({ length: 144 }).map((_, i) => (
                      <div key={i} className="border-r border-b border-sky-400/15" />
                    ))}
                  </div>
                )}

                {/* Dark Mask Outside Crop Area */}
                <div
                  className="absolute inset-0 bg-black/60 pointer-events-none transition-all duration-75"
                  style={{
                    clipPath: `polygon(
                      0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                      ${cropBox.x}% ${cropBox.y}%,
                      ${cropBox.x}% ${cropBox.y + cropBox.height}%,
                      ${cropBox.x + cropBox.width}% ${cropBox.y + cropBox.height}%,
                      ${cropBox.x + cropBox.width}% ${cropBox.y}%,
                      ${cropBox.x}% ${cropBox.y}%
                    )`,
                  }}
                />

                {/* Draggable Crop Box Container */}
                <div
                  className="absolute border-2 border-sky-400 bg-sky-400/10 shadow-2xl rounded-xs cursor-move touch-none z-20"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handlePointerDown('move', e.clientX, e.clientY);
                  }}
                  onTouchStart={(e) => {
                    handlePointerDown('move', e.touches[0].clientX, e.touches[0].clientY);
                  }}
                >
                  {/* Grid Lines inside crop box (Rule of thirds) */}
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div />
                  </div>

                  {/* Move Cue Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <Move className="w-6 h-6 text-white drop-shadow-md" />
                  </div>

                  {/* Live Dimensions Overlay Badge */}
                  <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold pointer-events-none border border-white/20 shadow-md">
                    {currentRes.w} × {currentRes.h} px ({currentRes.ratio}:1)
                  </div>

                  {/* NW Handle */}
                  <div
                    className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nwse-resize flex items-center justify-center touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('nw', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('nw', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* NE Handle */}
                  <div
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nesw-resize flex items-center justify-center touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('ne', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('ne', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* SW Handle */}
                  <div
                    className="absolute -bottom-2.5 -left-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nesw-resize flex items-center justify-center touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('sw', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('sw', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* SE Handle */}
                  <div
                    className="absolute -bottom-2.5 -right-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nwse-resize flex items-center justify-center touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('se', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('se', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* Edge N Handle */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-sky-500 border border-white rounded-full shadow-md cursor-ns-resize touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('n', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('n', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* Edge S Handle */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-sky-500 border border-white rounded-full shadow-md cursor-ns-resize touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('s', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('s', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* Edge W Handle */}
                  <div
                    className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-8 bg-sky-500 border border-white rounded-full shadow-md cursor-ew-resize touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('w', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('w', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />

                  {/* Edge E Handle */}
                  <div
                    className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-8 bg-sky-500 border border-white rounded-full shadow-md cursor-ew-resize touch-none z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePointerDown('e', e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handlePointerDown('e', e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Export Options & Render Bar */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
                {/* Format Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Export Format:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                          exportFormat === fmt ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {fmt === 'jpeg' ? 'JPG' : fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (for JPG & WEBP) */}
                {exportFormat !== 'png' && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      Quality: <span className="font-mono text-sky-600">{Math.round(exportQuality * 100)}%</span>
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                      className="w-28 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>
                )}

                {/* Resolution Summary */}
                <div className="text-xs font-bold text-slate-500 font-mono">
                  Output Target: <span className="text-slate-900 font-black">{currentRes.w} × {currentRes.h} px</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={generateCrop}
                  className="w-full sm:w-auto px-7 py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Crop className="w-4 h-4" />
                  <span>Apply & Render Crop</span>
                </button>

                {croppedOutputUrl && (
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 sm:flex-none px-5 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>

                    <a
                      href={croppedOutputUrl}
                      download={`${imageName}-cropped.${exportFormat === 'jpeg' ? 'jpg' : exportFormat}`}
                      className="flex-1 sm:flex-none px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer animate-in zoom-in-95 duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download {exportFormat.toUpperCase()}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Cropped Output Result Preview Card */}
            {croppedOutputUrl && croppedDimensions && (
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 shadow-sm animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Cropped Output Result ({croppedDimensions.width} × {croppedDimensions.height} px)</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Ratio: {(croppedDimensions.width / croppedDimensions.height).toFixed(2)}:1
                  </span>
                </div>
                <div className="flex justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-inner overflow-hidden">
                  <img
                    src={croppedOutputUrl}
                    alt="Cropped Result"
                    className="max-h-72 object-contain rounded-xl shadow-md border border-slate-100"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

