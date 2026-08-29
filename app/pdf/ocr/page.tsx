'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { extractTextOCR } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Copy, Download, FileCheck } from 'lucide-react';

export default function PDFOCRPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [lang, setLang] = useState('eng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const handleRunOCR = async () => {
    if (files.length === 0) {
      toast.error('Please upload a scanned PDF document.');
      return;
    }

    setIsProcessing(true);
    setExtractedText(null);
    setProgressPercent(10);
    setProgressStatus('Initializing Tesseract Web Worker...');

    try {
      const text = await extractTextOCR(files[0].file, lang, (prog, stat) => {
        setProgressPercent(prog);
        setProgressStatus(stat);
      });
      setExtractedText(text);
      toast.success('Text extracted successfully via client-side OCR!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to extract text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast.success('Extracted text copied to clipboard!');
    }
  };

  const downloadTextFile = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-ocr-text.txt';
    a.click();
  };

  return (
    <ToolLayout
      slug="/pdf/ocr"
      title="Client-Side PDF OCR (Text Extractor)"
      subtitle="Extract editable plain text from scanned PDFs and document images using WebAssembly Tesseract. 100% Private."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setExtractedText(null);
          }}
          isProcessing={isProcessing}
          progressPercent={progressPercent}
          progressStatus={progressStatus}
          title="Upload Scanned PDF Document"
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                Select OCR Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none"
              >
                <option value="eng">English (eng)</option>
                <option value="spa">Spanish (spa)</option>
                <option value="fra">French (fra)</option>
                <option value="deu">German (deu)</option>
                <option value="por">Portuguese (por)</option>
                <option value="ita">Italian (ita)</option>
              </select>
            </div>

            <button
              onClick={handleRunOCR}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Running AI OCR Recognition...' : 'Extract Editable Text'}
            </button>
          </div>
        )}

        {extractedText && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Extracted Plain Text
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={downloadTextFile}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={extractedText}
              rows={10}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
