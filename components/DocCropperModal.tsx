'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, RefreshCw, RotateCw, Crop, Sparkles, Maximize, Wand2, Eye, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Target, Sliders } from 'lucide-react';

export interface Point {
  x: number; // Percentage 0 - 100
  y: number; // Percentage 0 - 100
}

interface DocCropperModalProps {
  isOpen: boolean;
  imageUrl: string;
  initialPoints?: Point[];
  showBiometricFaceGuide?: boolean;
  onClose: () => void;
  onSaveCrop: (croppedDataUrl: string, savedPoints: Point[]) => void;
}

/**
 * 4-Point Perspective Warp using Inverse Homography.
 * Transforms an arbitrary quadrilateral [pTL, pTR, pBR, pBL] into a clean rectangular document image.
 * Guarantees pure white background fill (#ffffff) and zero black patches.
 */
function warpPerspective(
  img: HTMLImageElement,
  points: Point[],
  rotation: number = 0
): string {
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  if (naturalW === 0 || naturalH === 0) return img.src;

  // Convert percentage points to natural image pixel coordinates
  const pTL = { x: (points[0].x / 100) * naturalW, y: (points[0].y / 100) * naturalH };
  const pTR = { x: (points[1].x / 100) * naturalW, y: (points[1].y / 100) * naturalH };
  const pBR = { x: (points[2].x / 100) * naturalW, y: (points[2].y / 100) * naturalH };
  const pBL = { x: (points[3].x / 100) * naturalW, y: (points[3].y / 100) * naturalH };

  // Calculate destination rectangle dimensions from edge lengths
  const topW = Math.hypot(pTR.x - pTL.x, pTR.y - pTL.y);
  const botW = Math.hypot(pBR.x - pBL.x, pBR.y - pBL.y);
  const leftH = Math.hypot(pBL.x - pTL.x, pBL.y - pTL.y);
  const rightH = Math.hypot(pBR.x - pTR.x, pBR.y - pTR.y);

  const outW = Math.max(100, Math.round(Math.max(topW, botW)));
  const outH = Math.max(100, Math.round(Math.max(leftH, rightH)));

  // Source offscreen canvas to extract raw pixel data
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = naturalW;
  srcCanvas.height = naturalH;
  const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
  if (!srcCtx) return img.src;

  // Pre-fill source canvas with white before drawing image
  srcCtx.fillStyle = '#ffffff';
  srcCtx.fillRect(0, 0, naturalW, naturalH);
  srcCtx.drawImage(img, 0, 0, naturalW, naturalH);
  const srcData = srcCtx.getImageData(0, 0, naturalW, naturalH);

  // Destination offscreen canvas
  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = outW;
  dstCanvas.height = outH;
  const dstCtx = dstCanvas.getContext('2d');
  if (!dstCtx) return img.src;

  // Pre-fill destination canvas with pure WHITE
  dstCtx.fillStyle = '#ffffff';
  dstCtx.fillRect(0, 0, outW, outH);

  const dstData = dstCtx.createImageData(outW, outH);
  const dPixels = dstData.data;
  const sPixels = srcData.data;

  // Homography matrix setup mapping destination (u, v) -> source (x, y)
  const U = outW;
  const V = outH;

  const x0 = pTL.x, y0 = pTL.y;
  const x1 = pTR.x, y1 = pTR.y;
  const x2 = pBR.x, y2 = pBR.y;
  const x3 = pBL.x, y3 = pBL.y;

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;

  const deltaX = x0 - x1 + x2 - x3;
  const deltaY = y0 - y1 + y2 - y3;

  let h00: number, h01: number, h02: number;
  let h10: number, h11: number, h12: number;
  let h20: number, h21: number;

  const det = dx1 * dy2 - dx2 * dy1;

  if (Math.abs(deltaX) < 1e-4 && Math.abs(deltaY) < 1e-4) {
    h20 = 0;
    h21 = 0;
    h00 = (x1 - x0) / U;
    h01 = (x3 - x0) / V;
    h10 = (y1 - y0) / U;
    h11 = (y3 - y0) / V;
    h02 = x0;
    h12 = y0;
  } else if (Math.abs(det) > 1e-6) {
    h20 = (deltaX * dy2 - deltaY * dx2) / (det * U);
    h21 = (dx1 * deltaY - dy1 * deltaX) / (det * V);
    h00 = (x1 - x0) / U + h20 * x1;
    h01 = (x3 - x0) / V + h21 * x3;
    h10 = (y1 - y0) / U + h20 * y1;
    h11 = (y3 - y0) / V + h21 * y3;
    h02 = x0;
    h12 = y0;
  } else {
    // Fallback simple bounding box crop with white background
    dstCtx.fillStyle = '#ffffff';
    dstCtx.fillRect(0, 0, outW, outH);
    const minX = Math.min(x0, x1, x2, x3);
    const minY = Math.min(y0, y1, y2, y3);
    dstCtx.drawImage(img, minX, minY, outW, outH, 0, 0, outW, outH);
    return dstCanvas.toDataURL('image/jpeg', 0.95);
  }

  // Inverse mapping pixel loop with bilinear interpolation
  for (let v = 0; v < outH; v++) {
    for (let u = 0; u < outW; u++) {
      const denom = h20 * u + h21 * v + 1;
      const srcX = (h00 * u + h01 * v + h02) / denom;
      const srcY = (h10 * u + h11 * v + h12) / denom;

      const dstIdx = (v * outW + u) * 4;

      if (srcX >= 0 && srcX < naturalW - 1 && srcY >= 0 && srcY < naturalH - 1) {
        const xFloor = Math.floor(srcX);
        const yFloor = Math.floor(srcY);
        const xFrac = srcX - xFloor;
        const yFrac = srcY - yFloor;

        const wTL = (1 - xFrac) * (1 - yFrac);
        const wTR = xFrac * (1 - yFrac);
        const wBL = (1 - xFrac) * yFrac;
        const wBR = xFrac * yFrac;

        const idxTL = (yFloor * naturalW + xFloor) * 4;
        const idxTR = (yFloor * naturalW + xFloor + 1) * 4;
        const idxBL = ((yFloor + 1) * naturalW + xFloor) * 4;
        const idxBR = ((yFloor + 1) * naturalW + xFloor + 1) * 4;

        dPixels[dstIdx] = Math.round(
          sPixels[idxTL] * wTL + sPixels[idxTR] * wTR + sPixels[idxBL] * wBL + sPixels[idxBR] * wBR
        );
        dPixels[dstIdx + 1] = Math.round(
          sPixels[idxTL + 1] * wTL + sPixels[idxTR + 1] * wTR + sPixels[idxBL + 1] * wBL + sPixels[idxBR + 1] * wBR
        );
        dPixels[dstIdx + 2] = Math.round(
          sPixels[idxTL + 2] * wTL + sPixels[idxTR + 2] * wTR + sPixels[idxBL + 2] * wBL + sPixels[idxBR + 2] * wBR
        );
        dPixels[dstIdx + 3] = 255;
      } else {
        // Outside src bounds -> pure white background
        dPixels[dstIdx] = 255;
        dPixels[dstIdx + 1] = 255;
        dPixels[dstIdx + 2] = 255;
        dPixels[dstIdx + 3] = 255;
      }
    }
  }

  dstCtx.putImageData(dstData, 0, 0);

  // Apply rotation if required
  if (rotation % 360 !== 0) {
    const rotCanvas = document.createElement('canvas');
    const is90 = Math.abs(rotation % 180) === 90;
    rotCanvas.width = is90 ? outH : outW;
    rotCanvas.height = is90 ? outW : outH;
    const rotCtx = rotCanvas.getContext('2d');
    if (rotCtx) {
      rotCtx.fillStyle = '#ffffff';
      rotCtx.fillRect(0, 0, rotCanvas.width, rotCanvas.height);
      rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
      rotCtx.rotate((rotation * Math.PI) / 180);
      rotCtx.drawImage(dstCanvas, -outW / 2, -outH / 2);
      return rotCanvas.toDataURL('image/jpeg', 0.95);
    }
  }

  return dstCanvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Auto-detects paper document boundaries in an image and calculates optimal 4 corner points.
 */
function detectDocumentEdges(img: HTMLImageElement): Point[] {
  const defaultPoints: Point[] = [
    { x: 4, y: 4 },
    { x: 96, y: 4 },
    { x: 96, y: 96 },
    { x: 4, y: 96 },
  ];

  try {
    const sampleCanvas = document.createElement('canvas');
    const maxDim = 350;
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;

    if (w === 0 || h === 0) return defaultPoints;

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    sampleCanvas.width = w;
    sampleCanvas.height = h;
    const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return defaultPoints;

    ctx.drawImage(img, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let minX = w, maxX = 0, minY = h, maxY = 0;
    let count = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // Document paper pixels are generally lighter than surrounding desk background
        if (gray > 105) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          count++;
        }
      }
    }

    // If valid paper region was detected
    if (count > (w * h * 0.08) && maxX > minX + 25 && maxY > minY + 25) {
      const left = Math.max(1, Math.min(98, (minX / w) * 100));
      const right = Math.max(2, Math.min(99, (maxX / w) * 100));
      const top = Math.max(1, Math.min(98, (minY / h) * 100));
      const bottom = Math.max(2, Math.min(99, (maxY / h) * 100));

      return [
        { x: Number(left.toFixed(1)), y: Number(top.toFixed(1)) },
        { x: Number(right.toFixed(1)), y: Number(top.toFixed(1)) },
        { x: Number(right.toFixed(1)), y: Number(bottom.toFixed(1)) },
        { x: Number(left.toFixed(1)), y: Number(bottom.toFixed(1)) },
      ];
    }
  } catch {
    // Ignore and return defaults
  }

  return defaultPoints;
}

export function DocCropperModal({
  isOpen,
  imageUrl,
  initialPoints,
  showBiometricFaceGuide = false,
  onClose,
  onSaveCrop,
}: DocCropperModalProps) {
  const [points, setPoints] = useState<Point[]>([
    { x: 5, y: 5 }, // Top-Left
    { x: 95, y: 5 }, // Top-Right
    { x: 95, y: 95 }, // Bottom-Right
    { x: 5, y: 95 }, // Bottom-Left
  ]);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(showBiometricFaceGuide);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Auto-detect document boundaries when modal opens or imageUrl changes
  const runAutoDetect = useCallback(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const detected = detectDocumentEdges(img);
      setPoints(detected);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      if (initialPoints && initialPoints.length === 4) {
        setPoints(initialPoints);
      } else {
        runAutoDetect();
      }
    }
  }, [isOpen, imageUrl, initialPoints, runAutoDetect]);

  if (!isOpen) return null;

  const handleResetFull = () => {
    setPoints([
      { x: 2, y: 2 },
      { x: 98, y: 2 },
      { x: 98, y: 98 },
      { x: 2, y: 98 },
    ]);
  };

  const handleNudge = (dx: number, dy: number) => {
    setPoints((prev) =>
      prev.map((pt) => ({
        x: Math.max(0, Math.min(100, pt.x + dx)),
        y: Math.max(0, Math.min(100, pt.y + dy)),
      }))
    );
  };

  const handleZoomBox = (factor: number) => {
    setPoints((prev) => {
      const centerX = (prev[0].x + prev[1].x + prev[2].x + prev[3].x) / 4;
      const centerY = (prev[0].y + prev[1].y + prev[2].y + prev[3].y) / 4;
      return prev.map((pt) => ({
        x: Math.max(0, Math.min(100, centerX + (pt.x - centerX) * factor)),
        y: Math.max(0, Math.min(100, centerY + (pt.y - centerY) * factor)),
      }));
    });
  };

  const handleCenterBox = () => {
    setPoints([
      { x: 15, y: 15 },
      { x: 85, y: 15 },
      { x: 85, y: 85 },
      { x: 15, y: 85 },
    ]);
  };

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePointIndex(index);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointIndex === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    const newX = Math.max(0, Math.min(100, (xPx / rect.width) * 100));
    const newY = Math.max(0, Math.min(100, (yPx / rect.height) * 100));

    setPoints((prev) => {
      const next = [...prev];
      next[activePointIndex] = { x: newX, y: newY };
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activePointIndex !== null) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      setActivePointIndex(null);
    }
  };

  const handleApplyCrop = () => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const croppedUrl = warpPerspective(img, points, rotation);
      onSaveCrop(croppedUrl, points);
      setIsProcessing(false);
      onClose();
    };

    img.onerror = () => {
      setIsProcessing(false);
      onClose();
    };

    img.src = imageUrl;
  };

  // Convert points array into valid SVG 0-100 coordinate string
  const polyPointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  const cornerLabels = ['TL', 'TR', 'BR', 'BL'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-xs flex items-center gap-1.5 shadow-2xs">
              <Crop className="w-3.5 h-3.5 text-amber-300" />
              <span>Adjust Document Edges</span>
            </span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Drag 4 dots to align document corners
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowFaceGuide((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
                showFaceGuide
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Toggle Biometric Eye & Chin Guide"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Face Guide</span>
            </button>

            <button
              onClick={runAutoDetect}
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Auto Detect Edges"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Auto Crop</span>
            </button>

            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
            </button>

            <button
              onClick={handleResetFull}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset Full Edges"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Image</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Face Alignment & Zoom Pad Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-black uppercase text-[11px] text-indigo-900">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Crop, Zoom & Face Alignment Pad</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Directional Nudge Buttons */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => handleNudge(0, -3)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-indigo-100 text-slate-800 cursor-pointer"
                title="Nudge Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, 3)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-indigo-100 text-slate-800 cursor-pointer"
                title="Nudge Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(-3, 0)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-indigo-100 text-slate-800 cursor-pointer"
                title="Nudge Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(3, 0)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-indigo-100 text-slate-800 cursor-pointer"
                title="Nudge Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center Head */}
            <button
              type="button"
              onClick={handleCenterBox}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Center Head</span>
            </button>

            {/* Zoom Box In/Out */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs font-extrabold text-xs">
              <span className="text-[10px] text-slate-500 px-1">Zoom:</span>
              <button
                type="button"
                onClick={() => handleZoomBox(0.9)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => handleZoomBox(1.1)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* Interactive 4-Dot Image Canvas Area */}
        <div className="flex-1 bg-slate-950 p-4 overflow-hidden flex items-center justify-center relative select-none">
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative max-h-[62vh] max-w-full inline-block overflow-hidden rounded-lg shadow-2xl touch-none border border-slate-800"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Base Image */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Scan crop preview"
              className="max-h-[60vh] max-w-full w-auto h-auto object-contain block pointer-events-none"
            />

            {/* Biometric Face Guide Reference Overlay */}
            {showFaceGuide && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4 z-20">
                <div className="w-[55%] h-[65%] border-2 border-dashed border-emerald-400/90 rounded-full relative shadow-xs">
                  <div className="absolute top-[42%] left-0 right-0 border-t border-emerald-400/90" />
                  <span className="absolute top-[43%] right-1 text-[9px] font-black text-emerald-950 bg-emerald-100/90 px-1 rounded border border-emerald-300">
                    EYE LINE
                  </span>
                  <div className="absolute bottom-[8%] left-0 right-0 border-b border-emerald-400/90" />
                  <span className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-950 bg-emerald-100/90 px-1 rounded border border-emerald-300">
                    CHIN LINE
                  </span>
                </div>
              </div>
            )}

            {/* Polygon Overlay & Connected Lines (SVG 0-100 coordinate space) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Outer Dim Mask */}
              <mask id="crop-mask">
                <rect width="100" height="100" fill="white" />
                <polygon points={polyPointsStr} fill="black" />
              </mask>
              <rect
                width="100"
                height="100"
                fill="rgba(15, 23, 42, 0.7)"
                mask="url(#crop-mask)"
              />

              {/* Quadrilateral Crop Inner Fill */}
              <polygon
                points={polyPointsStr}
                fill="rgba(99, 102, 241, 0.18)"
              />

              {/* Connected Quad Edge Lines (TL->TR, TR->BR, BR->BL, BL->TL) */}
              {points.map((pt, i) => {
                const nextPt = points[(i + 1) % points.length];
                return (
                  <line
                    key={i}
                    x1={pt.x}
                    y1={pt.y}
                    x2={nextPt.x}
                    y2={nextPt.y}
                    stroke="#6366f1"
                    strokeWidth="1.2"
                    strokeDasharray="2 1"
                  />
                );
              })}

              {/* Glowing Inner Border Line */}
              <polygon
                points={polyPointsStr}
                fill="none"
                stroke="#a5b4fc"
                strokeWidth="0.6"
              />
            </svg>

            {/* 4 Interactive Corner Dots with Labels */}
            {points.map((pt, idx) => {
              const isActive = activePointIndex === idx;
              return (
                <div
                  key={idx}
                  onPointerDown={handlePointerDown(idx)}
                  className={`absolute w-8 h-8 sm:w-9 sm:h-9 -ml-4 -mt-4 sm:-ml-4.5 sm:-mt-4.5 rounded-full bg-indigo-600 border-2 border-white shadow-xl cursor-grab active:cursor-grabbing flex items-center justify-center z-30 transition-transform ${
                    isActive ? 'scale-125 ring-4 ring-indigo-400/50 bg-indigo-500' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span className="absolute -top-5 px-1.5 py-0.2 rounded bg-slate-900/90 text-white font-black text-[9px] shadow-2xs pointer-events-none uppercase">
                    {cornerLabels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500 font-semibold hidden sm:block">
            Drag 4 dots to select document corners. Unwarps auto-straightened onto white page.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 text-amber-300" />
              )}
              <span>Crop & Clean Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

