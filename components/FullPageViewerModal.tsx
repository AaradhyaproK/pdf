'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  RotateCw,
  Download,
  CheckCircle2,
  Square,
  FileText,
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
  title = 'Document Page Preview',
}: FullPageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPageIndex);
  const [localRotation, setLocalRotation] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      const idx = Math.max(0, Math.min(initialPageIndex, pages.length - 1));
      setCurrentIndex(idx);
      setLocalRotation(0);

      const timer = setTimeout(() => {
        const el = document.getElementById(`modal-page-${idx}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialPageIndex, pages.length]);

  const currentPage = pages[currentIndex];
  const isSelected = currentPage ? selectedPages.includes(currentPage.pageNumber) : false;

  const handleNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setLocalRotation(0);
      document.getElementById(`modal-page-${nextIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentIndex, pages.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setLocalRotation(0);
      document.getElementById(`modal-page-${prevIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentIndex]);

  const handleRotate = () => {
    if (onRotatePage) {
      onRotatePage(currentIndex);
    } else {
      setLocalRotation((prev) => (prev + 90) % 360);
    }
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

  // Lock background body scroll when modal is open on mobile
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentPage) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-none"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[740px] h-full sm:h-[92vh] rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-xs shrink-0 flex items-center gap-1.5 shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Doc Preview</span>
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-700 truncate hidden sm:block">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onToggleSelectPage && (
              <button
                type="button"
                onClick={() => onToggleSelectPage(currentPage.pageNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Selected</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                    <span>Select Page</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleRotate}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Rotate Page"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
            </button>

            <button
              type="button"
              onClick={handleDownloadSinglePage}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Save Image"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-900 flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
              aria-label="Close preview"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Page Jump Selector Bar */}
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Jump to:
          </span>
          {pages.map((p, idx) => (
            <button
              key={p.pageNumber}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setLocalRotation(0);
                const el = document.getElementById(`modal-page-${idx}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-black transition-all shrink-0 cursor-pointer ${
                currentIndex === idx
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              #{p.pageNumber}
            </button>
          ))}
        </div>

        {/* Document Reader Surface */}
        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y bg-slate-50/50 p-3 sm:p-6 space-y-8 custom-scrollbar">
          {pages.map((p, idx) => {
            const pageRotation = ((p.rotation || 0) + (idx === currentIndex ? localRotation : 0)) % 360;
            const isRotated = Math.abs(pageRotation % 180) === 90;

            return (
              <div
                key={p.pageNumber}
                id={`modal-page-${idx}`}
                className="w-full space-y-2 group"
              >
                {/* Floating Page Toolbar */}
                <div className="flex items-center justify-between px-1 text-slate-700">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-black text-[11px] shrink-0">
                    Page {p.pageNumber} of {pages.length}
                  </span>

                  {pageRotation !== 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
                      {pageRotation}°
                    </span>
                  )}
                </div>

                {/* Document Canvas Image */}
                <div className="w-full flex items-center justify-center py-2 overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-md">
                  <img
                    src={p.dataUrl}
                    alt={`Document Page ${p.pageNumber}`}
                    className="w-full h-auto max-h-[760px] object-contain block rounded-md transition-transform duration-200"
                    style={{
                      transform: `rotate(${pageRotation}deg)`,
                      maxHeight: isRotated ? '480px' : '760px',
                      maxWidth: isRotated ? '80%' : '100%',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
