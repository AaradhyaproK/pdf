'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { renderPDFPagesToImages, organizePDFPages } from '@/lib/pdf-engine';
import { PDFPageGridList } from '@/components/PDFPageGridList';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

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
            <PDFPageGridList
              title="Organize PDF Page Layout"
              pages={pageCards.map((card, idx) => ({
                pageNumber: idx + 1,
                dataUrl: card.dataUrl,
                rotation: card.rotation,
              }))}
              onRotatePage={rotatePageCard}
              onMovePage={movePageCard}
              onDeletePage={deletePageCard}
              reorderable={true}
              deletable={true}
              selectable={false}
            />

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
