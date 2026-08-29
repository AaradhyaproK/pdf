'use client';

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { removeImageBackground } from '@/lib/image-engine';
import { toast } from 'sonner';
import {
  Download,
  Scissors,
  Sparkles,
  Sliders,
  Palette,
  Eraser,
  Paintbrush,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Undo2,
  Redo2,
  CheckCircle2,
} from 'lucide-react';

export default function RemoveBackgroundPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [tolerance, setTolerance] = useState(35);
  const [bgFormat, setBgFormat] = useState<'transparent' | 'white' | 'color'>('transparent');
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  // Interactive Brush & Zoom Editor States
  const [activeTool, setActiveTool] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState(25);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas Refs
  const editorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Undo / Redo History
  const [historyStack, setHistoryStack] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize interactive canvas once background removal result is computed
  useEffect(() => {
    if (!resultBlob || files.length === 0) return;

    let isMounted = true;

    async function initCanvas() {
      const origImg = new Image();
      const resultImg = new Image();

      const origUrl = URL.createObjectURL(files[0].file);
      const resultUrl = URL.createObjectURL(resultBlob!);

      await Promise.all([
        new Promise((res) => { origImg.onload = res; origImg.src = origUrl; }),
        new Promise((res) => { resultImg.onload = res; resultImg.src = resultUrl; })
      ]);

      if (!isMounted) return;

      const w = resultImg.width;
      const h = resultImg.height;

      // Offscreen Original Canvas
      const origCanvas = document.createElement('canvas');
      origCanvas.width = w;
      origCanvas.height = h;
      const origCtx = origCanvas.getContext('2d');
      origCtx?.drawImage(origImg, 0, 0, w, h);
      origCanvasRef.current = origCanvas;

      // Visible Interactive Editor Canvas
      const editorCanvas = editorCanvasRef.current;
      if (editorCanvas) {
        editorCanvas.width = w;
        editorCanvas.height = h;
        const ctx = editorCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(resultImg, 0, 0, w, h);
          const initialData = ctx.getImageData(0, 0, w, h);
          setHistoryStack([initialData]);
          setHistoryIndex(0);
        }
      }

      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(resultUrl);
    }

    initCanvas();

    return () => { isMounted = false; };
  }, [resultBlob, files]);

  const handleRemoveBG = async () => {
    if (files.length === 0) {
      toast.error('Please upload a photo first.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);
    setResultBlob(null);

    try {
      const blob = await removeImageBackground(
        files[0].file,
        { tolerance, bgFormat, customBgColor },
        (p) => setProgressPercent(p)
      );
      setResultBlob(blob);
      setZoomLevel(1.0);
      toast.success('Background removed! Use Brush & Zoom to refine cutouts.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove background.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drawing Handlers
  const getCanvasCoords = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawStroke(e);
  };

  const drawStroke = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = editorCanvasRef.current;
    const origCanvas = origCanvasRef.current;
    if (!canvas || !origCanvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    const radius = brushSize / 2;

    if (activeTool === 'erase') {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (activeTool === 'restore') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(origCanvas, 0, 0);
      ctx.restore();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistoryState();
  };

  const saveHistoryState = () => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(snapshot);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const canvas = editorCanvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && historyStack[prevIdx]) {
        ctx.putImageData(historyStack[prevIdx], 0, 0);
        setHistoryIndex(prevIdx);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      const canvas = editorCanvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && historyStack[nextIdx]) {
        ctx.putImageData(historyStack[nextIdx], 0, 0);
        setHistoryIndex(nextIdx);
      }
    }
  };

  const handleDownloadEdited = () => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return;

    if (bgFormat === 'white' || bgFormat === 'color') {
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = canvas.width;
      bgCanvas.height = canvas.height;
      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.fillStyle = customBgColor || (bgFormat === 'white' ? '#ffffff' : '#f8fafc');
        bgCtx.fillRect(0, 0, canvas.width, canvas.height);
        bgCtx.drawImage(canvas, 0, 0);
        bgCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited-photo.jpg';
            a.click();
            toast.success('Edited photo downloaded!');
          }
        }, 'image/jpeg', 0.95);
        return;
      }
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited-cutout.png';
        a.click();
        toast.success('Hand-edited cutout PNG downloaded!');
      }
    }, 'image/png');
  };

  return (
    <ToolLayout
      slug="/image/remove-background"
      title="AI Background Remover (100% Client-Side Wasm)"
      subtitle="Instantly isolate subjects and erase backgrounds. Use manual Erase/Restore brushes and pixel zoom for absolute perfection."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setResultBlob(null);
          }}
          isProcessing={isProcessing}
          progressPercent={progressPercent}
          progressStatus="Processing background removal locally..."
          title="Upload portrait, product, or object photo"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            {/* Sensitivity & Backdrop Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    Detection Sensitivity (Tolerance: {tolerance})
                  </span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="70"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  Background Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBgFormat('transparent')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      bgFormat === 'transparent'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Transparent
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgFormat('white')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      bgFormat === 'white'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    White
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgFormat('color')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      bgFormat === 'color'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>

            {bgFormat === 'color' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Custom Backdrop Color</label>
                <input
                  type="color"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                  className="w-full h-10 rounded-xl cursor-pointer border border-slate-200 bg-white p-1"
                />
              </div>
            )}

            <button
              onClick={handleRemoveBG}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-base shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>{isProcessing ? 'Removing Background...' : 'Remove Background Now'}</span>
            </button>
          </div>
        )}

        {/* Interactive Brush, Restore & Zoom Pixel Perfection Canvas Workspace */}
        {resultBlob && (
          <div className="space-y-4 pt-6 border-t border-slate-200 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100">
              <div>
                <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                  <Scissors className="w-5 h-5 text-indigo-600" />
                  Interactive Touch & Brush Precision Editor
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Rub out extra background or paint back original details manually.
                </p>
              </div>

              <button
                onClick={handleDownloadEdited}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Cutout</span>
              </button>
            </div>

            {/* Brush & Zoom Control Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Erase / Restore Mode Selectors */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTool('erase')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeTool === 'erase'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>Erase Brush</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTool('restore')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeTool === 'restore'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                    <span>Restore Brush</span>
                  </button>
                </div>

                {/* Undo / Redo */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700"
                    title="Undo Stroke"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= historyStack.length - 1}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700"
                    title="Redo Stroke"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                    className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold px-1.5 text-slate-700 min-w-[45px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(3.0, z + 0.25))}
                    className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1.0)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 text-[10px] font-bold"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Brush Size Slider */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600 shrink-0">
                  Brush Size: <span className="text-indigo-600">{brushSize}px</span>
                </span>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Canvas Drawing Surface */}
            <div
              ref={containerRef}
              className="w-full max-h-[550px] overflow-auto rounded-3xl border border-slate-200 bg-slate-100 p-4 flex items-center justify-center bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"
            >
              <div
                className="transition-transform duration-100 origin-center inline-block cursor-crosshair shadow-lg rounded-xl overflow-hidden bg-white"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <canvas
                  ref={editorCanvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={drawStroke}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={drawStroke}
                  onTouchEnd={stopDrawing}
                  className="touch-none max-w-full h-auto block"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
