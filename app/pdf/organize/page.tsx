'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { renderPDFPagesToImages, organizePDFPages } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, RotateCw, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

interface VisualPageCard {
  originalIndex: number;
  dataUrl: string;
  rotation: number;
}

export default function OrganizePDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pageCards, setPageCards] = useState<VisualPageCard[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    if (selected.length === 0) {
      setPageCards([]);
      return;
    }

    setIsLoadingPages(true);
    try {
      const rendered = await renderPDFPagesToImages(selected[0].file, 1.0);
      setPageCards(
        rendered.map((r, idx) => ({
          originalIndex: idx,
          dataUrl: r.dataUrl,
          rotation: 0,
        }))
      );
    } catch (err: any) {
      toast.error('Failed to render PDF page thumbnails.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const rotatePageCard = (index: number) => {
    const updated = [...pageCards];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPageCards(updated);
  };

  const deletePageCard = (index: number) => {
    setPageCards(pageCards.filter((_, idx) => idx !== index));
  };

  const movePageCard = (index: number, direction: 'left' | 'right') => {
    const updated = [...pageCards];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPageCards(updated);
  };

  const handleSaveOrganized = async () => {
    if (pageCards.length === 0) {
      toast.error('No pages remaining to save.');
      return;
    }

    setIsProcessing(true);
    try {
      const pageOps = pageCards.map((card) => ({
        originalIndex: card.originalIndex,
        rotation: card.rotation,
      }));
      const organizedBytes = await organizePDFPages(files[0].file, pageOps);
      const blob = new Blob([new Uint8Array(organizedBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Organized PDF created successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to organize PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/organize"
      title="Visual PDF Organizer (Rotate, Delete & Reorder)"
      subtitle="Interactive visual page grid. Rotate sideways pages, delete unwanted blank pages, and reorder document structure."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setPageCards([]);
            setDownloadUrl(null);
          }}
          title="Upload PDF to organize pages"
        />

        {isLoadingPages && (
          <div className="py-8 text-center text-slate-500 animate-pulse text-sm font-medium">
            Rendering PDF page thumbnails locally...
          </div>
        )}

        {pageCards.length > 0 && !isLoadingPages && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Visual Page Grid ({pageCards.length} Pages)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 max-h-[520px] overflow-y-auto p-1">
              {pageCards.map((card, idx) => (
                <div
                  key={idx}
                  className="relative group bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-between space-y-2 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-full flex justify-between items-center px-1 text-[11px] font-bold text-slate-500">
                    <span>Page {idx + 1}</span>
                    <span className="text-indigo-600">{card.rotation}°</span>
                  </div>

                  <div className="relative w-full h-36 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 border border-slate-200/80 shadow-2xs">
                    <img
                      src={card.dataUrl}
                      alt={`Page ${idx + 1}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-300"
                      style={{ transform: `rotate(${card.rotation}deg)` }}
                    />
                  </div>

                  <div className="flex items-center justify-between w-full pt-1.5 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => movePageCard(idx, 'left')}
                      disabled={idx === 0}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 disabled:opacity-20"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotatePageCard(idx)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-indigo-600 hover:bg-indigo-50 font-bold"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePageCard(idx)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePageCard(idx, 'right')}
                      disabled={idx === pageCards.length - 1}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 disabled:opacity-20"
                      title="Move Right"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveOrganized}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-base shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {isProcessing ? 'Generating Organized PDF...' : 'Save Organized PDF'}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <h4 className="font-bold text-base text-emerald-900">Organized PDF Ready!</h4>
              <p className="text-xs text-emerald-700">Exported new page layout structure cleanly.</p>
            </div>
            <a
              href={downloadUrl}
              download="organized-document.pdf"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Organized PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
