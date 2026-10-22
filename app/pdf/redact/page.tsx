'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument } from 'pdf-lib';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import {
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Eye,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eraser,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

interface RedactionBox {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function RedactPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ pageNumber: number; dataUrl: string; width: number; height: number }[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [redactions, setRedactions] = useState<RedactionBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redactedPreviewUrl, setRedactedPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setIsLoading(true);
    setRedactions([]);
    setDownloadUrl(null);
    setActivePageIndex(0);

    try {
      const rendered = await renderPDFPagesToImages(uploaded, 1.5);
      setPages(rendered);
      toast.success(`Loaded ${rendered.length} pages. Click and drag anywhere to redact sensitive information.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load PDF pages. Ensure it is a valid, unencrypted PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const drawPage = () => {
    const canvas = canvasRef.current;
    if (!canvas || pages.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const page = pages[activePageIndex];
    if (!page) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = page.width;
      canvas.height = page.height;
      ctx.drawImage(img, 0, 0);

      // Draw all existing redactions for this page
      const pageRedactions = redactions.filter((r) => r.pageIndex === activePageIndex);
      pageRedactions.forEach((box) => {
        ctx.fillStyle = '#09090b'; // Solid pitch black
        ctx.fillRect(box.x, box.y, box.width, box.height);

        // Security border
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      });

      // Draw current in-progress drag box
      if (currentBox) {
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      }
    };
    img.src = page.dataUrl;
  };

  useEffect(() => {
    drawPage();
  }, [pages, activePageIndex, redactions, currentBox]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentBox({ x: coords.x, y: coords.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoords(e);
    const x = Math.min(startPos.x, coords.x);
    const y = Math.min(startPos.y, coords.y);
    const width = Math.abs(coords.x - startPos.x);
    const height = Math.abs(coords.y - startPos.y);
    setCurrentBox({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return;
    setIsDrawing(false);

    // Only add if box is meaningful in size (> 8px)
    if (currentBox.width > 8 && currentBox.height > 8) {
      const newRedaction: RedactionBox = {
        id: `redact-${Date.now()}`,
        pageIndex: activePageIndex,
        x: currentBox.x,
        y: currentBox.y,
        width: currentBox.width,
        height: currentBox.height,
      };
      setRedactions([...redactions, newRedaction]);
      toast.success('Blackout redaction placed!');
    }
    setCurrentBox(null);
    setStartPos(null);
  };

  const removeRedaction = (id: string) => {
    setRedactions(redactions.filter((r) => r.id !== id));
  };

  const clearCurrentPageRedactions = () => {
    setRedactions(redactions.filter((r) => r.pageIndex !== activePageIndex));
    toast.info('Cleared redactions on this page.');
  };

  const handleExportSecurePDF = async () => {
    if (pages.length === 0) return;
    setIsExporting(true);

    try {
      const pdfDoc = await PDFDocument.create();

      // For every page, render canvas with redactions burned in
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = page.width;
        pageCanvas.height = page.height;
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) continue;

        // Load base image
        const img = new Image();
        img.src = page.dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        ctx.drawImage(img, 0, 0);

        // Burn solid black rectangles
        const pageRedactions = redactions.filter((r) => r.pageIndex === i);
        pageRedactions.forEach((box) => {
          ctx.fillStyle = '#000000'; // 100% true pitch black
          ctx.fillRect(box.x, box.y, box.width, box.height);
        });

        // Convert to high-res JPEG
        const imgDataUrl = pageCanvas.toDataURL('image/jpeg', 0.92);
        const imageBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(imageBytes);

        // Add page to PDF
        const newPage = pdfDoc.addPage([page.width, page.height]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: page.width,
          height: page.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      if (canvasRef.current) {
        setRedactedPreviewUrl(canvasRef.current.toDataURL('image/jpeg', 0.85));
      }
      setIsModalOpen(true);
      toast.success('Zero-Leak Flattened PDF Ready! Sensitive text is permanently eradicated.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to burn redactions. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentPageRedactions = redactions.filter((r) => r.pageIndex === activePageIndex);

  return (
    <ToolLayout
      slug="/pdf/redact"
      title="Permanently Redact PDF Online (True Zero-Leak Blackout)"
      subtitle="Black out sensitive text, SSN, bank accounts & PAN numbers. Flattens vector layers to permanently destroy text underneath—100% client-side."
      badgeText="Permanent Pixel Redaction"
    >
      <div className="space-y-6 text-slate-800">
        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-1">
            <p className="font-bold">
              Why Standard PDF Editors Leak Data (And Why FileZenith Is Different)
            </p>
            <p className="text-amber-800 leading-relaxed">
              Standard PDF viewers merely place a visual black rectangle over text—leaving the text selectable, copyable, and searchable underneath! FileZenith <strong>flattens the page into permanent pixels</strong>, making it mathematically impossible to recover what was redacted.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        {!file ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-14 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Eraser className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload PDF Document to Redact
              </h3>
              <p className="text-xs text-slate-500">
                Select legal contracts, tax returns, bank statements, or Aadhaar scans. Processed 100% on your device with 0 cloud uploads.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                <button
                  disabled={activePageIndex === 0}
                  onClick={() => setActivePageIndex(activePageIndex - 1)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 px-2">
                  Page {activePageIndex + 1} of {pages.length}
                </span>
                <button
                  disabled={activePageIndex === pages.length - 1}
                  onClick={() => setActivePageIndex(activePageIndex + 1)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Redaction actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCurrentPageRedactions}
                  disabled={currentPageRedactions.length === 0}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Page Redactions ({currentPageRedactions.length})
                </button>

                <button
                  onClick={() => {
                    setFile(null);
                    setPages([]);
                    setRedactions([]);
                    setDownloadUrl(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Upload Another File
                </button>
              </div>

              {/* Burn & Export Button */}
              <button
                onClick={handleExportSecurePDF}
                disabled={isExporting}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Flattening &amp; Burning Pixels...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Burn Redactions &amp; Export Secure PDF ({redactions.length} Total)
                  </>
                )}
              </button>
            </div>

            {/* Ready for Download Banner */}
            {downloadUrl && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
                <div>
                  <div className="text-xs font-black text-emerald-950">
                    True Redacted PDF Ready for Download!
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    All vector layers flattened. Sensitive text is completely destroyed and unselectable.
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download={`Redacted_${file.name}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Secure PDF
                </a>
              </div>
            )}

            {/* Interactive Canvas Redaction Workspace */}
            <div className="bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                <span>🖱️ Click &amp; Drag a rectangle over any sensitive area on the document</span>
                <span className="text-rose-400 font-bold">
                  {currentPageRedactions.length} Blackouts on Page {activePageIndex + 1}
                </span>
              </div>

              <div
                ref={containerRef}
                className="overflow-auto max-h-[700px] flex items-center justify-center bg-slate-950/70 p-4 rounded-2xl border border-slate-800 select-none cursor-crosshair"
              >
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="rounded-lg shadow-2xl max-w-full h-auto border border-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={file ? `Redacted_${file.name}` : 'Redacted_Document.pdf'}
          previewUrl={redactedPreviewUrl}
          fileType="pdf"
          title="Your Redacted Document is Ready"
          subtitle="Sensitive text permanently erased and flattened into pixels with zero cloud uploads."
          onReset={() => {
            setFile(null);
            setPages([]);
            setRedactions([]);
            setDownloadUrl(null);
          }}
        />
      </div>
    </ToolLayout>
  );
}
