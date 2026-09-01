'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  List,
  CheckCircle2,
  Square,
  RotateCw,
  Maximize2,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Eye,
  Scissors,
} from 'lucide-react';
import { FullPageViewerModal, PageItem } from './FullPageViewerModal';

export interface PDFPageGridListProps {
  pages: PageItem[];
  selectedPages?: number[];
  onToggleSelectPage?: (pageNumber: number) => void;
  onSelectAll?: () => void;
  onSelectOdd?: () => void;
  onSelectEven?: () => void;
  onClearSelection?: () => void;
  onRotatePage?: (index: number) => void;
  onMovePage?: (index: number, direction: 'left' | 'right') => void;
  onDeletePage?: (index: number) => void;
  rangeStr?: string;
  onRangeStrChange?: (val: string) => void;
  selectable?: boolean;
  reorderable?: boolean;
  deletable?: boolean;
  showPreviewModal?: boolean;
  title?: string;
}

export function PDFPageGridList({
  pages,
  selectedPages = [],
  onToggleSelectPage,
  onSelectAll,
  onSelectOdd,
  onSelectEven,
  onClearSelection,
  onRotatePage,
  onMovePage,
  onDeletePage,
  rangeStr,
  onRangeStrChange,
  selectable = true,
  reorderable = false,
  deletable = false,
  showPreviewModal = true,
  title = 'Document Pages',
}: PDFPageGridListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewerModalIndex, setViewerModalIndex] = useState<number | null>(null);

  if (pages.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Quick Filters & View Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>{title} ({pages.length} Pages)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Click thumbnail zoom button for full page preview. Adjust rotation and page order seamlessly.
            </p>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Range String Input (if enabled) */}
            {onRangeStrChange && rangeStr !== undefined && (
              <div className="flex items-center gap-1.5 flex-1 md:flex-initial">
                <input
                  type="text"
                  value={rangeStr}
                  onChange={(e) => onRangeStrChange(e.target.value)}
                  placeholder="e.g. 1, 3-5"
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none w-28 sm:w-36 transition-all"
                />
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selection Quick Pills */}
        {selectable && (onSelectAll || onSelectOdd || onSelectEven || onClearSelection) && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {onSelectAll && (
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-black border border-indigo-100 transition-all active:scale-95 cursor-pointer"
                >
                  Select All ({pages.length})
                </button>
              )}
              {onSelectOdd && (
                <button
                  type="button"
                  onClick={onSelectOdd}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold border border-slate-200/70 transition-all active:scale-95 cursor-pointer"
                >
                  Odd Pages
                </button>
              )}
              {onSelectEven && (
                <button
                  type="button"
                  onClick={onSelectEven}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold border border-slate-200/70 transition-all active:scale-95 cursor-pointer"
                >
                  Even Pages
                </button>
              )}
              {onClearSelection && (
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-extrabold border border-slate-200/70 transition-all active:scale-95 cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 shrink-0">
              {selectedPages.length} of {pages.length} Selected
            </span>
          </div>
        )}
      </div>

      {/* Main Pages Rendering Container */}
      {viewMode === 'grid' ? (
        /* GRID VIEW (2 cols mobile, 3-4 cols desktop) */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-h-[640px] overflow-y-auto p-1 scrollbar-thin">
          {pages.map((p, idx) => {
            const isSelected = selectedPages.includes(p.pageNumber);
            const rot = p.rotation || 0;
            const isRotated90or270 = rot === 90 || rot === 270;

            return (
              <div
                key={idx}
                className={`relative group rounded-2xl p-2.5 flex flex-col items-center justify-between border transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-2 border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Header Row: Page Number Badge & Selection Checkbox */}
                <div className="w-full flex items-center justify-between px-1 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-900 text-white border-slate-800'
                    }`}
                  >
                    #{p.pageNumber}
                  </span>

                  {selectable && onToggleSelectPage && (
                    <button
                      type="button"
                      onClick={() => onToggleSelectPage(p.pageNumber)}
                      className="cursor-pointer"
                      title={isSelected ? 'Deselect Page' : 'Select Page'}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                      )}
                    </button>
                  )}
                </div>

                {/* Page Thumbnail Image Viewport Container */}
                <div
                  onClick={() => setViewerModalIndex(idx)}
                  className="relative w-full h-44 sm:h-56 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1.5 border border-slate-200/80 cursor-pointer group-hover:border-indigo-200 transition-colors my-1"
                >
                  <img
                    src={p.dataUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 shadow-2xs group-hover:scale-[1.02]"
                    style={{
                      transform: `rotate(${rot}deg)`,
                      maxHeight: isRotated90or270 ? '80%' : '100%',
                      maxWidth: isRotated90or270 ? '80%' : '100%',
                    }}
                  />

                  {/* Zoom Preview Button overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-lg flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Full View</span>
                    </span>
                  </div>
                </div>

                {/* Footer Action Buttons Bar */}
                <div className="flex items-center justify-between w-full pt-2 border-t border-slate-100 gap-1 text-[10px]">
                  {reorderable && onMovePage && (
                    <button
                      type="button"
                      onClick={() => onMovePage(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-20 transition-all cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onRotatePage && (
                    <button
                      type="button"
                      onClick={() => onRotatePage(idx)}
                      className="px-2 py-1 rounded-lg text-indigo-600 hover:bg-indigo-50 font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{rot}°</span>
                    </button>
                  )}
                  {showPreviewModal && (
                    <button
                      type="button"
                      onClick={() => setViewerModalIndex(idx)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                      title="Zoom Full Page"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                  )}

                  {deletable && onDeletePage && (
                    <button
                      type="button"
                      onClick={() => onDeletePage(idx)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {reorderable && onMovePage && (
                    <button
                      type="button"
                      onClick={() => onMovePage(idx, 'right')}
                      disabled={idx === pages.length - 1}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-20 transition-all cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW (Detailed Row list) */
        <div className="space-y-2 max-h-[640px] overflow-y-auto pr-0.5 scrollbar-thin">
          {pages.map((p, idx) => {
            const isSelected = selectedPages.includes(p.pageNumber);
            const rot = p.rotation || 0;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl bg-white border flex items-center justify-between gap-4 transition-all ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/30 shadow-2xs' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {selectable && onToggleSelectPage && (
                    <button
                      type="button"
                      onClick={() => onToggleSelectPage(p.pageNumber)}
                      className="cursor-pointer shrink-0"
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                      )}
                    </button>
                  )}

                  {/* Row Thumbnail */}
                  <div
                    onClick={() => setViewerModalIndex(idx)}
                    className="w-12 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5 cursor-pointer shrink-0 hover:border-indigo-400"
                  >
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain"
                      style={{ transform: `rotate(${rot}deg)` }}
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <span>Page {p.pageNumber}</span>
                      {rot > 0 && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                          {rot}° Rotated
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">
                      Document Page #{p.pageNumber}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {showPreviewModal && (
                    <button
                      type="button"
                      onClick={() => setViewerModalIndex(idx)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Zoom</span>
                    </button>
                  )}

                  {onRotatePage && (
                    <button
                      type="button"
                      onClick={() => onRotatePage(idx)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-4 h-4 text-indigo-600" />
                    </button>
                  )}

                  {deletable && onDeletePage && (
                    <button
                      type="button"
                      onClick={() => onDeletePage(idx)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Page Viewer Modal */}
      {viewerModalIndex !== null && (
        <FullPageViewerModal
          isOpen={viewerModalIndex !== null}
          onClose={() => setViewerModalIndex(null)}
          pages={pages}
          initialPageIndex={viewerModalIndex}
          selectedPages={selectedPages}
          onToggleSelectPage={onToggleSelectPage}
          onRotatePage={onRotatePage}
          title={title}
        />
      )}
    </div>
  );
}
