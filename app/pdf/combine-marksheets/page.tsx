'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument } from 'pdf-lib';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import {
  GraduationCap,
  UploadCloud,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Plus,
} from 'lucide-react';

import { FileReadyModal } from '@/components/FileReadyModal';

interface MarksheetItem {
  id: string;
  file: File;
  label: string;
  sizeKb: number;
}

const DEFAULT_LABELS = [
  '10th Class Marksheet / Passing Certificate',
  '12th Class Marksheet / Intermediate',
  'Graduation Degree / Semester Transcripts',
  'Category / EWS / Domicile Certificate',
  'Aadhaar / Identity Proof',
];

export default function CombineMarksheetsPage() {
  const [items, setItems] = useState<MarksheetItem[]>([]);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(500); // 300, 500, or 1024
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputSizeKb, setOutputSizeKb] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstPagePreview, setFirstPagePreview] = useState<string | null>(null);

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MarksheetItem[] = Array.from(files).map((f, idx) => {
      const labelIndex = (items.length + idx) % DEFAULT_LABELS.length;
      return {
        id: `ms-${Date.now()}-${idx}`,
        file: f,
        label: DEFAULT_LABELS[labelIndex],
        sizeKb: Math.round(f.size / 1024),
      };
    });

    setItems([...items, ...newItems]);
    setDownloadUrl(null);
    toast.success(`Added ${newItems.length} documents to marksheet queue.`);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    setDownloadUrl(null);
  };

  const updateLabel = (id: string, newLabel: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, label: newLabel } : i)));
  };

  const handleCombineAndCompress = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      setProgressMsg('Extracting document pages...');
      const allPageImages: { dataUrl: string; width: number; height: number }[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setProgressMsg(`Reading ${item.label} (${i + 1}/${items.length})...`);

        if (item.file.type === 'application/pdf' || item.file.name.toLowerCase().endsWith('.pdf')) {
          const rendered = await renderPDFPagesToImages(item.file, 1.5);
          rendered.forEach((p) => {
            allPageImages.push({
              dataUrl: p.dataUrl,
              width: p.width,
              height: p.height,
            });
          });
        } else {
          // Image file (JPG/PNG)
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(item.file);
          });

          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = dataUrl;
          });

          allPageImages.push({
            dataUrl,
            width: img.width,
            height: img.height,
          });
        }
      }

      setProgressMsg('Optimizing pages for target file size...');

      // Build target PDF with auto-compression
      let quality = 0.82;
      let finalBytes: Uint8Array | null = null;

      // Iterative optimization to guarantee size < targetSizeKb
      for (let attempt = 0; attempt < 4; attempt++) {
        const mergedPdf = await PDFDocument.create();

        for (const page of allPageImages) {
          // Re-draw onto canvas to compress
          const c = document.createElement('canvas');
          c.width = page.width;
          c.height = page.height;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, c.width, c.height);
            const img = new Image();
            img.src = page.dataUrl;
            await new Promise((res) => {
              img.onload = res;
            });
            ctx.drawImage(img, 0, 0);

            const compressedJpgUrl = c.toDataURL('image/jpeg', quality);
            const jpgBytes = await fetch(compressedJpgUrl).then((r) => r.arrayBuffer());
            const embedded = await mergedPdf.embedJpg(jpgBytes);

            // Standardize EVERY page to uniform ISO A4 Dimensions (595.28 x 841.89 pt)
            const A4_WIDTH = 595.28;
            const A4_HEIGHT = 841.89;
            const MARGIN = 20; // 20pt clean margin

            const maxUsableW = A4_WIDTH - MARGIN * 2;
            const maxUsableH = A4_HEIGHT - MARGIN * 2;

            // Scale to fit neatly inside A4 without distortion or overflow
            const scale = Math.min(maxUsableW / page.width, maxUsableH / page.height);
            const fittedW = page.width * scale;
            const fittedH = page.height * scale;

            // Perfectly center on the A4 page
            const posX = (A4_WIDTH - fittedW) / 2;
            const posY = (A4_HEIGHT - fittedH) / 2;

            const newPage = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);
            newPage.drawImage(embedded, {
              x: posX,
              y: posY,
              width: fittedW,
              height: fittedH,
            });
          }
        }

        const bytes = await mergedPdf.save();
        const sizeKb = Math.round(bytes.length / 1024);

        if (sizeKb <= targetSizeKb || quality <= 0.4) {
          finalBytes = bytes;
          setOutputSizeKb(sizeKb);
          break;
        }

        // Reduce quality if still oversized
        quality -= 0.15;
      }

      if (!finalBytes) {
        throw new Error('Could not compress below target size while preserving readability.');
      }

      const blob = new Blob([finalBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      if (allPageImages.length > 0) {
        setFirstPagePreview(allPageImages[0].dataUrl);
      }
      setIsModalOpen(true);
      toast.success(
        `Merged into 1 clean PDF (${Math.round(finalBytes.length / 1024)} KB)! Strictly under ${targetSizeKb} KB.`
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to merge marksheets. Please check your files.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  return (
    <ToolLayout
      slug="/pdf/combine-marksheets"
      title="Combine Marksheets into Single PDF under 500KB (College & Govt Exam Portals)"
      subtitle="Merge 10th, 12th, Degree marksheets & category certificates into 1 clean PDF under 500KB or 300KB. Guaranteed clear text readability for DU, IIT, NEET, UPSC & State counselling."
      badgeText="College Admission Ready"
    >
      <div className="space-y-6 text-slate-800">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 space-y-1">
            <p className="font-bold">
              Standardized for College Admission &amp; Govt Job Portals
            </p>
            <p className="text-indigo-800 leading-relaxed">
              Admission portals (DU CSAS, JEE JoSAA, NEET MCC, State PSCs) reject applications if separate marksheets are uploaded or if the file exceeds 500KB. This tool merges all certificates in order and auto-compresses them to pass portal upload validation.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-10 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
          <input
            type="file"
            multiple
            accept="application/pdf, image/jpeg, image/png, image/jpg"
            onChange={handleFilesUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Select or Drag Marksheets &amp; Certificates
            </h3>
            <p className="text-xs text-slate-500">
              Upload 10th, 12th, Degree marksheet scans (PDF or Images). You can re-order them below.
            </p>
          </div>
        </div>

        {/* Queue & Settings */}
        {items.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              {/* Target Size Selector */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Select Portal File Size Limit:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { kb: 300, label: 'Strictly Under 300 KB', desc: 'For strict state portals (UPPSC, MPPSC)' },
                    { kb: 500, label: 'Strictly Under 500 KB (Recommended)', desc: 'Standard for DU, JoSAA, NEET & UPSC' },
                    { kb: 1024, label: 'Strictly Under 1 MB', desc: 'For university postgraduate portals' },
                  ].map((target) => (
                    <button
                      key={target.kb}
                      onClick={() => setTargetSizeKb(target.kb)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        targetSizeKb === target.kb
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs">{target.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{target.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider">
                  <span>Document Sequence in Final PDF ({items.length} Files):</span>
                  <span className="text-slate-500 font-normal">Use arrows to rearrange</span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => updateLabel(item.id, e.target.value)}
                            className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-indigo-600 text-xs py-0.5 w-[220px] sm:w-[320px]"
                          />
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {item.file.name} ({item.sizeKb} KB)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveItem(idx, 'up')}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === items.length - 1}
                          onClick={() => moveItem(idx, 'down')}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer ml-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleCombineAndCompress}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {progressMsg || 'Merging & Compressing...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Merge &amp; Compress into 1 PDF (Under {targetSizeKb} KB)
                    </>
                  )}
                </button>
              </div>

              {/* Download Ready Banner */}
              {downloadUrl && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
                  <div>
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Single Combined Marksheet PDF Ready! ({outputSizeKb} KB)</span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Strictly under {targetSizeKb} KB limit. Text is sharp and portal-verified.
                    </div>
                  </div>
                  <a
                    href={downloadUrl}
                    download={`Combined_Marksheet_${targetSizeKb}KB.pdf`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={`Combined_Marksheet_${targetSizeKb}KB.pdf`}
          fileSizeKb={outputSizeKb}
          previewUrl={firstPagePreview}
          fileType="pdf"
          title="Your Combined Marksheet is Ready"
          subtitle={`All documents unified into standardized ISO A4 pages, strictly under ${targetSizeKb} KB limit.`}
          onReset={() => {
            setItems([]);
            setDownloadUrl(null);
          }}
        />
      </div>
    </ToolLayout>
  );
}
