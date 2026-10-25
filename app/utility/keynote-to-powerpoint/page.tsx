'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Presentation,
  UploadCloud,
  Download,
  FileCheck,
  Eye,
  RefreshCw,
  Layers,
  Sparkles,
  ShieldCheck,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

interface ExtractedSlide {
  name: string;
  dataUrl: string;
}

export default function KeynoteToPowerPointPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slides, setSlides] = useState<ExtractedSlide[]>([]);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setIsProcessing(true);
    setSlides([]);
    setPdfDownloadUrl(null);
    setActiveSlideIndex(0);

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(uploaded);

      // Search for QuickLook/Preview.pdf first (Native Apple Keynote High-Res PDF deck)
      let foundPdf = false;
      const previewPdfFile =
        zipContent.file('QuickLook/Preview.pdf') ||
        zipContent.file('QuickLook/preview.pdf') ||
        zipContent.file('preview.pdf');

      if (previewPdfFile) {
        foundPdf = true;
        const pdfArrayBuffer = await previewPdfFile.async('arraybuffer');
        const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfDownloadUrl(url);
      }

      // Extract slide images (QuickLook/Thumbnail.jpg, Data/*.jpg, preview*.jpg)
      const extractedImages: ExtractedSlide[] = [];
      const imageEntries: { name: string; file: JSZip.JSZipObject }[] = [];

      zipContent.forEach((relativePath, entry) => {
        const lower = relativePath.toLowerCase();
        if (
          !entry.dir &&
          (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) &&
          !lower.includes('icon')
        ) {
          imageEntries.push({ name: relativePath, file: entry });
        }
      });

      // Sort naturally
      imageEntries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      for (const item of imageEntries) {
        const base64 = await item.file.async('base64');
        const mime = item.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        extractedImages.push({
          name: item.name,
          dataUrl: `data:${mime};base64,${base64}`,
        });
      }

      setSlides(extractedImages);

      // If no native Preview.pdf was bundled, assemble one from extracted slide images
      if (!foundPdf && extractedImages.length > 0) {
        const pdfDoc = await PDFDocument.create();
        for (const slide of extractedImages) {
          const imgBytes = await fetch(slide.dataUrl).then((res) => res.arrayBuffer());
          let embeddedImg;
          if (slide.dataUrl.startsWith('data:image/png')) {
            embeddedImg = await pdfDoc.embedPng(imgBytes);
          } else {
            embeddedImg = await pdfDoc.embedJpg(imgBytes);
          }

          const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
          page.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: embeddedImg.width,
            height: embeddedImg.height,
          });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfDownloadUrl(url);
      }

      setIsModalOpen(true);
      toast.success(
        `Extracted Keynote presentation successfully! ${extractedImages.length} slide images found.`
      );
    } catch (err) {
      console.error(err);
      toast.error('Unable to parse Keynote file. Ensure it is a valid Apple .key presentation package.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/keynote-to-powerpoint"
      title="Convert Apple Keynote to PDF & Slides (.key to .pdf)"
      subtitle="Open and convert Apple Keynote (.key) presentations on Windows, Android & Linux. Extract high-res slides and printable PDF decks 100% in-browser."
      badgeText="Apple iWork Converter"
    >
      <div className="space-y-6 text-slate-800">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
          <Laptop className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 space-y-1">
            <p className="font-bold">
              Open Apple Keynote Files Without a Mac or iCloud Account
            </p>
            <p className="text-indigo-800 leading-relaxed">
              Apple Keynote uses a proprietary package format that cannot natively open on Windows or PowerPoint. FileZenith extracts the bundled presentation structures and compiles them into a universal high-definition PDF deck and slide deck playable anywhere.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        {!file ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-14 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
            <input
              type="file"
              accept=".key, application/zip, application/x-iwork-keynote-sffkey"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Presentation className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload Apple Keynote Presentation (.key)
              </h3>
              <p className="text-xs text-slate-500">
                Drag and drop your Mac presentation file. We extract vector slides, images, and generate a printable PDF presentation deck.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                  {slides.length} Slides Extracted
                </span>
              </div>

              <div className="flex items-center gap-2">
                {pdfDownloadUrl && (
                  <a
                    href={pdfDownloadUrl}
                    download={`${file.name.replace(/\.key$/i, '')}_Presentation.pdf`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF Presentation Deck
                  </a>
                )}

                <button
                  onClick={() => {
                    setFile(null);
                    setSlides([]);
                    setPdfDownloadUrl(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Convert Another File
                </button>
              </div>
            </div>

            {/* Slide Preview Grid */}
            {slides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Active Slide Display */}
                <div className="md:col-span-8 bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                    <span>
                      Slide {activeSlideIndex + 1} of {slides.length}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {slides[activeSlideIndex]?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-slate-950/70 rounded-2xl border border-slate-800 min-h-[350px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slides[activeSlideIndex]?.dataUrl}
                      alt={`Slide ${activeSlideIndex + 1}`}
                      className="max-h-[500px] w-auto rounded-lg shadow-2xl object-contain border border-slate-800"
                    />
                  </div>
                </div>

                {/* Thumbnails Sidebar */}
                <div className="md:col-span-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3 max-h-[580px] overflow-y-auto">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Slide Deck Thumbnails:
                  </div>
                  <div className="space-y-2">
                    {slides.map((s, idx) => {
                      const isActive = activeSlideIndex === idx;
                      return (
                        <button
                          key={s.name}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`w-full p-2 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            isActive
                              ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-400 w-5 text-right">
                            #{idx + 1}
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.dataUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-10 object-cover rounded border border-slate-200"
                          />
                          <span className="text-[11px] font-bold text-slate-700 truncate">
                            Slide {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">
                  {isProcessing ? 'Unpacking Keynote presentation slides...' : 'No preview slides found in package.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={pdfDownloadUrl}
          fileName={file ? `${file.name.replace(/\.key$/i, '')}_Presentation.pdf` : 'Keynote_Presentation.pdf'}
          previewUrl={slides[0]?.dataUrl || null}
          fileType="pdf"
          title="Your Keynote Presentation is Ready"
          subtitle={`${slides.length} slides extracted & converted into universal presentation PDF.`}
          onReset={() => {
            setFile(null);
            setSlides([]);
            setPdfDownloadUrl(null);
          }}
        />

        {/* Trademark Disclaimer & Usage Policy */}
        <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed space-y-1">
          <p className="font-bold text-slate-700">Trademark &amp; Compatibility Disclaimer</p>
          <p>
            Apple Keynote is a trademark of Apple Inc. Microsoft PowerPoint is a registered trademark of Microsoft Corporation. FileZenith is an independent browser utility and is not affiliated with, endorsed by, or sponsored by Apple Inc. or Microsoft Corporation.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
