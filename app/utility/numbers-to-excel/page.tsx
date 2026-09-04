'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { convertNumbersToExcel } from '@/lib/apple-engine';
import { Download, Table, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function NumbersToExcelPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('converted-spreadsheet.xlsx');
  const [stats, setStats] = useState<{ rowCount: number; sheetCount: number } | null>(null);

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
      toast.error('Please upload an Apple Numbers file first.');
      return;
    }

    const file = files[0].file;
    if (!file.name.toLowerCase().endsWith('.numbers')) {
      toast.error('Please upload an Apple Numbers spreadsheet (.numbers).');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await convertNumbersToExcel(file);
      const url = URL.createObjectURL(result.blob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}.xlsx`;

      setDownloadUrl(url);
      setDownloadName(outName);
      setStats({
        rowCount: result.rowCount,
        sheetCount: result.sheetCount,
      });

      toast.success('Apple Numbers spreadsheet successfully converted to Excel (.xlsx)!');
    } catch (err: any) {
      console.error('Numbers to Excel conversion error:', err);
      toast.error(err?.message || 'Failed to convert Numbers spreadsheet. Ensure the file is not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/numbers-to-excel"
      title="Numbers to Excel Converter Online"
      subtitle="Convert Apple Numbers (.numbers) spreadsheets to Microsoft Excel (.xlsx) format directly in your browser. 100% free with zero server uploads."
    >
      <div className="space-y-5">
        <FileUploader
          accept=".numbers,application/x-iwork-numbers-sffnumbers,application/vnd.apple.numbers"
          multiple={false}
          files={files}
          onFilesSelected={handleFilesChange}
          onRemoveFile={handleReset}
          title="Upload Apple Numbers (.numbers) file to convert to Excel"
          subtitle="Drag & drop or tap to browse Numbers file from your device."
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
                <span>Converting Numbers to Excel (.xlsx)...</span>
              </>
            ) : (
              <>
                <Table className="w-5 h-5" />
                <span>Convert Numbers to Excel (.xlsx)</span>
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
                  <span>Excel Workbook (.xlsx) Ready!</span>
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {stats
                    ? `${stats.rowCount.toLocaleString()} row(s) extracted • 100% client-side privacy.`
                    : 'Converted 100% locally with zero server file uploads.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                title="Convert another Numbers file"
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
                <span>Download Excel (.xlsx)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
