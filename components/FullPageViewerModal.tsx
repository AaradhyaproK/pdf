'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Square,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PageItem {
  pageNumber: number;
  dataUrl: string;
  rotation?: number;
  width?: number;
  height?: number;
}

interface FullPageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PageItem[];
  initialPageIndex?: number;
  selectedPages?: number[];
  onToggleSelectPage?: (pageNumber: number) => void;
  onRotatePage?: (pageIndex: number) => void;
  title?: string;
}

export function FullPageViewerModal({
  isOpen,
  onClose,
  pages,
  initialPageIndex = 0,
  selectedPages = [],
  onToggleSelectPage,
  onRotatePage,
  title = 'Document Page Viewer',
}: FullPageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPageIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // percentage: 50 - 250
  const [localRotation, setLocalRotation] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'custom' | 'page' | 'width'>('page');

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialPageIndex, pages.length - 1)));
      setZoomLevel(100);
      setFitMode('page');
      setLocalRotation(0);
    }
  }, [isOpen, initialPageIndex, pages.length]);

  const currentPage = pages[currentIndex];
  const isSelected = currentPage ? selectedPages.includes(currentPage.pageNumber) : false;
  const currentRotation = ((currentPage?.rotation || 0) + localRotation) % 360;

  const handleNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setLocalRotation(0);
    }
  }, [currentIndex, pages.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setLocalRotation(0);
    }
  }, [currentIndex]);

  const handleRotate = () => {
    if (onRotatePage) {
      onRotatePage(currentIndex);
    } else {
      setLocalRotation((prev) => (prev + 90) % 360);
    }
  };

  const handleZoomIn = () => {
    setFitMode('custom');
    setZoomLevel((prev) => Math.min(250, prev + 25));
  };

  const handleZoomOut = () => {
    setFitMode('custom');
    setZoomLevel((prev) => Math.max(40, prev - 25));
  };

  const handleDownloadSinglePage = () => {
    if (!currentPage) return;
    const a = document.createElement('a');
    a.href = currentPage.dataUrl;
    a.download = `page-${currentPage.pageNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloaded Page ${currentPage.pageNumber}`);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentPage) return null;

  // Compute container dimensions when rotated 90 or 270 degrees
  const isLandscapeOrientation = currentRotation === 90 || currentRotation === 270;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-in fade-in duration-200 select-none">
      {/* Top Header Bar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black shrink-0">
            Page {currentPage.pageNumber} / {pages.length}
          </span>
          <h3 className="text-sm font-bold text-slate-200 truncate hidden sm:block">
            {title}
          </h3>
        </div>

        {/* Center Control Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80 shadow-md">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom Preset Selector */}
          <select
            value={fitMode === 'custom' ? zoomLevel : fitMode}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'page' || val === 'width') {
                setFitMode(val as any);
                setZoomLevel(100);
              } else {
                setFitMode('custom');
                setZoomLevel(Number(val));
              }
            }}
            className="bg-slate-900 text-slate-200 text-xs font-black px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="page">Fit to Page</option>
            <option value="width">Fit Width</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
          </select>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 my-auto mx-0.5" />

          {/* Rotate Button */}
          <button
            type="button"
            onClick={handleRotate}
            className="p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-slate-700 transition-all cursor-pointer"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Download Single Page */}
          <button
            type="button"
            onClick={handleDownloadSinglePage}
            className="p-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-all cursor-pointer"
            title="Save Page Image"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Select Toggle (if applicable) */}
          {onToggleSelectPage && (
            <button
              type="button"
              onClick={() => onToggleSelectPage(currentPage.pageNumber)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Selected</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Select Page</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Viewer (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Main High-Definition Display Viewport */}
      <main className="flex-1 relative overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950/80">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-white hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-xl cursor-pointer"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === pages.length - 1}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-white hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-xl cursor-pointer"
          title="Next Page (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Page Container */}
        <div
          className="relative transition-transform duration-200 ease-out flex items-center justify-center my-auto shadow-2xl rounded-lg bg-white p-2 border border-slate-800"
          style={{
            transform: `rotate(${currentRotation}deg) scale(${
              fitMode === 'page' ? 1 : fitMode === 'width' ? 1.3 : zoomLevel / 100
            })`,
            maxWidth: fitMode === 'page' ? (isLandscapeOrientation ? '75vh' : '82vw') : 'none',
            maxHeight: fitMode === 'page' ? (isLandscapeOrientation ? '82vw' : '75vh') : 'none',
          }}
        >
          <img
            src={currentPage.dataUrl}
            alt={`Document Page ${currentPage.pageNumber}`}
            className="block rounded object-contain max-h-[75vh] sm:max-h-[80vh] w-auto shadow-sm"
          />
        </div>
      </main>

      {/* Bottom Thumbnail Strip */}
      <footer className="h-20 bg-slate-900/95 border-t border-slate-800 px-4 flex items-center justify-center shrink-0 z-20">
        <div className="flex items-center gap-2 overflow-x-auto py-2 max-w-4xl scrollbar-thin">
          {pages.map((p, idx) => {
            const isActive = idx === currentIndex;
            const isThumbSelected = selectedPages.includes(p.pageNumber);
            return (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setLocalRotation(0);
                }}
                className={`relative flex-shrink-0 h-14 w-11 rounded-lg overflow-hidden border p-0.5 transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105 shadow-md'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <img
                  src={p.dataUrl}
                  alt={`Thumb ${p.pageNumber}`}
                  className="w-full h-full object-cover rounded-xs"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-slate-950/80 text-[8px] font-black text-white">
                  #{p.pageNumber}
                </span>
                {isThumbSelected && (
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-indigo-600 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
