'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { convertPdfToDocx } from '@/lib/pdf-word-engine';
import { Download, FileText, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function PdfToWordPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('converted-document.docx');
  const [stats, setStats] = useState<{ wordCount: number; pageCount: number; fileSizeKB: number } | null>(null);

  const handleFilesChange = (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    setStats(null);
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl(null);
    setStats(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    try {
      const sourceFile = files[0].file;
      const result = await convertPdfToDocx(sourceFile, {
        mode: 'formatted',
        fontFamily: 'Calibri',
        includePageBreaks: true,
      });

      const url = URL.createObjectURL(result.blob);
      const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}.docx`;

      setDownloadUrl(url);
      setDownloadName(outName);
      setStats({
        wordCount: result.wordCount,
        pageCount: result.pageCount,
        fileSizeKB: Math.round(result.blob.size / 1024),
      });

      toast.success('PDF successfully converted to editable Word (.docx)!');
    } catch (err: any) {
      console.error('PDF to Word conversion error:', err);
      toast.error(err?.message || 'Failed to convert PDF file to Word.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/pdf-to-word"
      title="PDF to Word Converter Online"
      subtitle="Convert PDF documents to editable Microsoft Word (.docx) format directly in your browser. 100% free with zero server uploads."
    >
      <div className="space-y-5">
        <FileUploader
          accept="application/pdf,.pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFilesChange}
          onRemoveFile={handleReset}
          title="Upload PDF document to convert to Word"
          subtitle="Drag & drop or tap to browse PDF from your device."
        />

        {files.length > 0 && !downloadUrl && (
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Converting PDF to Word (.docx)...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Convert PDF to Word (.docx)</span>
              </>
            )}
          </button>
        )}

        {downloadUrl && (
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/30 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span>Word Document (.docx) Ready!</span>
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {stats
                    ? `${stats.pageCount} page(s) • ${stats.wordCount.toLocaleString()} words • ${stats.fileSizeKB} KB`
                    : 'Converted 100% locally with zero server file uploads.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                title="Convert another PDF"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New File</span>
              </button>

              <a
                href={downloadUrl}
                download={downloadName}
                className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Word (.docx)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
