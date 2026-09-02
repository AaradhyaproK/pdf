'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  Crop,
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Check,
  Maximize2,
  Move,
} from 'lucide-react';
import { toast } from 'sonner';

type AspectRatio = 'free' | '1:1' | '16:9' | '4:3' | '9:16' | '3:2';

export default function ImageCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('image');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [croppedOutputUrl, setCroppedOutputUrl] = useState<string | null>(null);

  // Crop area percentages (0 to 100)
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

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setCroppedOutputUrl(null);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      toast.success('Image loaded successfully');
    }
  };

  // Enforce aspect ratio on cropBox when ratio changes
  useEffect(() => {
    if (aspectRatio === 'free') return;
    const ratioMap: Record<string, number> = {
      '1:1': 1,
      '16:9': 16 / 9,
      '4:3': 4 / 3,
      '9:16': 9 / 16,
      '3:2': 3 / 2,
    };
    const targetRatio = ratioMap[aspectRatio];
    if (!targetRatio) return;

    setCropBox((prev) => {
      let newW = prev.width;
      let newH = newW / targetRatio;
      if (newH > 90) {
        newH = 90;
        newW = newH * targetRatio;
      }
      return {
        x: Math.max(0, Math.min(prev.x, 100 - newW)),
        y: Math.max(0, Math.min(prev.y, 100 - newH)),
        width: Math.min(newW, 90),
        height: Math.min(newH, 90),
      };
    });
  }, [aspectRatio]);

  // Handle drag / resize start
  const handlePointerDown = (handle: string, clientX: number, clientY: number) => {
    setActiveHandle(handle);
    startPosRef.current = { x: clientX, y: clientY };
    startBoxRef.current = { ...cropBox };
  };

  // Global Pointer Move & Up Listeners
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
      const minSize = 10; // min 10% size

      setCropBox((prev) => {
        let { x, y, width, height } = start;

        if (activeHandle === 'move') {
          x = Math.max(0, Math.min(100 - width, start.x + deltaXPercent));
          y = Math.max(0, Math.min(100 - height, start.y + deltaYPercent));
        } else {
          // Resizing logic
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

          // Enforce Aspect Ratio during resize if constrained
          if (aspectRatio !== 'free') {
            const ratioMap: Record<string, number> = {
              '1:1': 1,
              '16:9': 16 / 9,
              '4:3': 4 / 3,
              '9:16': 9 / 16,
              '3:2': 3 / 2,
            };
            const targetRatio = ratioMap[aspectRatio];
            if (targetRatio) {
              height = width / targetRatio;
              if (y + height > 100) {
                height = 100 - y;
                width = height * targetRatio;
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
  }, [activeHandle, aspectRatio]);

  // Crop Generation Function
  const generateCrop = () => {
    if (!imageSrc || !imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = img.naturalWidth / 100;
    const scaleY = img.naturalHeight / 100;

    const cropX = cropBox.x * scaleX;
    const cropY = cropBox.y * scaleY;
    const cropW = cropBox.width * scaleX;
    const cropH = cropBox.height * scaleY;

    canvas.width = Math.max(1, cropW);
    canvas.height = Math.max(1, cropH);

    ctx.save();
    // Move to center of canvas for transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropW,
      cropH,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    ctx.restore();

    const output = canvas.toDataURL('image/png', 0.95);
    setCroppedOutputUrl(output);
    toast.success('Crop generated successfully!');
  };

  return (
    <ToolLayout
      slug="/image/crop"
      title="Image Cropper & Aspect Ratio Tool"
      subtitle="Crop photos to exact ratios (1:1, 16:9, 4:3, 9:16), rotate, and flip 100% locally."
    >
      <div className="space-y-6">
        {!imageSrc ? (
          /* Upload Card */
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center bg-slate-50/60 hover:bg-slate-100/60 transition-all cursor-pointer">
            <label className="cursor-pointer space-y-4 flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-xs">
                <Crop className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Select an Image to Crop
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Supports JPG, PNG, WEBP & HEIC (100% Private Local Canvas)
                </p>
              </div>
              <div className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-md transition-all">
                Browse Image from Device
              </div>
            </label>
          </div>
        ) : (
          /* Workspace Area */
          <div className="space-y-6">
            {/* Top Toolbar Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {/* Aspect Ratio Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-xs font-black uppercase text-slate-500 mr-1">Ratio:</span>
                {[
                  { id: 'free', label: 'Freeform' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9 HD' },
                  { id: '4:3', label: '4:3 Standard' },
                  { id: '9:16', label: '9:16 Story' },
                  { id: '3:2', label: '3:2 Photo' },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                      aspectRatio === ratio.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              {/* Transform Tools (Rotate & Flip) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  title="Rotate 90 Clockwise"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">{rotation}°</span>
                </button>
                <button
                  onClick={() => setFlipH((prev) => !prev)}
                  className={`p-2 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                    flipH ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                  title="Flip Horizontally"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFlipV((prev) => !prev)}
                  className={`p-2 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                    flipV ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                  title="Flip Vertically"
                >
                  <FlipVertical className="w-4 h-4" />
                </button>
                <label className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Change</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Interactive Image Container */}
            <div className="relative bg-slate-950 rounded-3xl p-4 sm:p-8 flex items-center justify-center overflow-hidden min-h-[350px] touch-none select-none">
              <div
                ref={containerRef}
                className="relative max-w-full max-h-[60vh] select-none"
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  transition: 'transform 0.2s ease',
                }}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Original Preview"
                  className="max-h-[50vh] w-auto object-contain rounded-xl shadow-2xl pointer-events-none"
                  onLoad={() => generateCrop()}
                />

                {/* Dark Overlay Outside Crop Area */}
                <div
                  className="absolute inset-0 bg-black/50 pointer-events-none rounded-xl"
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

                {/* Interactive Crop Grid Box */}
                <div
                  className="absolute border-2 border-sky-400 bg-sky-400/10 shadow-2xl rounded-sm cursor-move touch-none"
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
                  {/* Grid Lines */}
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

                  {/* Move Cue Icon in Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <Move className="w-6 h-6 text-white drop-shadow-md" />
                  </div>

                  {/* Corner Resize Handles */}
                  {/* North-West */}
                  <div
                    className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nwse-resize flex items-center justify-center touch-none z-10"
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

                  {/* North-East */}
                  <div
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nesw-resize flex items-center justify-center touch-none z-10"
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

                  {/* South-West */}
                  <div
                    className="absolute -bottom-2.5 -left-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nesw-resize flex items-center justify-center touch-none z-10"
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

                  {/* South-East */}
                  <div
                    className="absolute -bottom-2.5 -right-2.5 w-6 h-6 bg-white border-2 border-sky-500 rounded-full shadow-lg cursor-nwse-resize flex items-center justify-center touch-none z-10"
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

                  {/* Edge Resize Handles */}
                  {/* Top Edge */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-sky-500 border border-white rounded-full shadow-md cursor-ns-resize touch-none z-10"
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

                  {/* Bottom Edge */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-sky-500 border border-white rounded-full shadow-md cursor-ns-resize touch-none z-10"
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

                  {/* Left Edge */}
                  <div
                    className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-8 bg-sky-500 border border-white rounded-full shadow-md cursor-ew-resize touch-none z-10"
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

                  {/* Right Edge */}
                  <div
                    className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-8 bg-sky-500 border border-white rounded-full shadow-md cursor-ew-resize touch-none z-10"
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

            {/* Crop Action & Result Export */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-slate-200 shadow-md">
              <button
                onClick={generateCrop}
                className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Crop className="w-4 h-4" />
                <span>Apply & Render Crop</span>
              </button>

              {croppedOutputUrl && (
                <a
                  href={croppedOutputUrl}
                  download={`${imageName}-cropped.png`}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer animate-in zoom-in-95 duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cropped PNG</span>
                </a>
              )}
            </div>

            {/* Cropped Output Preview Card */}
            {croppedOutputUrl && (
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Cropped Result Preview</span>
                </span>
                <div className="flex justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-inner">
                  <img
                    src={croppedOutputUrl}
                    alt="Cropped Result"
                    className="max-h-64 object-contain rounded-xl shadow-md"
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
