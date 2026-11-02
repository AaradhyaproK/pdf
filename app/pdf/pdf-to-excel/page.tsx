'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { convertPdfToExcel, PdfToExcelResult, PdfToExcelOptions } from '@/lib/pdf-excel-engine';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import { PDFPageGridList } from '@/components/PDFPageGridList';
import { FileReadyModal } from '@/components/FileReadyModal';
import { triggerBrowserDownload } from '@/lib/download-helper';
import {
  FileSpreadsheet,
  Download,
  Sliders,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Table,
  Layers,
  Hash,
  DollarSign,
  Eye,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCode,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PdfToExcelPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<PdfToExcelResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [activePreviewSheet, setActivePreviewSheet] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ pageNumber: number; dataUrl: string }[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Conversion options
  const [strategy, setStrategy] = useState<'smart-table' | 'preserve-positions' | 'raw-rows'>('smart-table');
  const [sheetLayout, setSheetLayout] = useState<'single' | 'per-page'>('single');
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'xls' | 'csv' | 'tsv' | 'html' | 'json'>('xlsx');
  const [parseNumbers, setParseNumbers] = useState(true);
  const [detectCurrency, setDetectCurrency] = useState(true);
  const [mergeMultiline, setMergeMultiline] = useState(true);
  const [formatHeaderRow, setFormatHeaderRow] = useState(true);
  const [deduplicateHeaders, setDeduplicateHeaders] = useState(true);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setResult(null);
    setDownloadUrl(null);

    if (selected.length === 0) {
      setThumbnails([]);
      return;
    }

    setIsLoadingPages(true);
    try {
      const rendered = await renderPDFPagesToImages(selected[0].file, 1.0);
      setThumbnails(rendered);
    } catch {
      // Ignore preview errors
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setDownloadUrl(null);
    setThumbnails([]);
    setProgress(0);
    setProgressMsg('');
  };

  const handleConvert = async (overrideFormat?: typeof exportFormat) => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    const fmt = overrideFormat || exportFormat;
    setIsProcessing(true);
    setProgress(5);
    setProgressMsg('Initializing PDF parsing engine...');

    try {
      const sourceFile = files[0].file;
      const options: PdfToExcelOptions = {
        strategy,
        sheetLayout,
        exportFormat: fmt,
        parseNumbers,
        detectCurrency,
        mergeMultiline,
        formatHeaderRow,
        deduplicateHeaders,
        trimWhitespace: true,
      };

      const res = await convertPdfToExcel(sourceFile, options, (p, msg) => {
        setProgress(p);
        setProgressMsg(msg);
      });

      const url = URL.createObjectURL(res.blob);
      setDownloadUrl(url);
      setResult(res);
      setActivePreviewSheet(0);
      setIsModalOpen(true);
      toast.success(`PDF successfully converted to ${fmt.toUpperCase()} spreadsheet!`);
    } catch (err: any) {
      console.error('PDF to Excel error:', err);
      toast.error(err?.message || 'Failed to extract tables from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyTable = () => {
    if (!result || !result.sheets[activePreviewSheet]) return;
    const currentSheet = result.sheets[activePreviewSheet];
    const tsvData = currentSheet.rows
      .map((row) => row.map((cell) => (cell === null || cell === undefined ? '' : String(cell))).join('\t'))
      .join('\n');

    navigator.clipboard.writeText(tsvData);
    setCopied(true);
    toast.success('Table copied to clipboard! You can paste directly into Excel or Google Sheets.');
    setTimeout(() => setCopied(false), 2500);
  };

  const currentPreviewSheetData = result?.sheets[activePreviewSheet];

  return (
    <ToolLayout
      slug="/pdf/pdf-to-excel"
      title="PDF to Excel Converter Online — High Accuracy (XLSX, CSV)"
      subtitle="Extract tables from PDF to editable Microsoft Excel (.xlsx), CSV, and TSV spreadsheets with highest accuracy. 100% private in-browser WebAssembly."
      badgeText="High-Precision Table Extractor"
    >
      <div className="space-y-6">
        {/* File Uploader */}
        <FileUploader
          accept="application/pdf,.pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={handleReset}
          title="Upload PDF document to convert to Excel"
          subtitle="Drag & drop any bank statement, invoice, report, or data table (PDF)"
        />

        {/* Thumbnail Preview if available */}
        {thumbnails.length > 0 && !isLoadingPages && (
          <PDFPageGridList
            title="PDF Document Pages Preview"
            pages={thumbnails}
            selectable={false}
            showPreviewModal={false}
          />
        )}

        {files.length > 0 && (
          <div className="space-y-5">
            {/* Control Center */}
            <div className="p-5 sm:p-7 rounded-3xl apple-dynamic-island luma-glass-texture border border-white/80 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-600" />
                    Table Extraction & Formatting Settings
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Configure column alignment, number detection, and multi-sheet layouts.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1 rounded-full font-black uppercase tracking-wide">
                  High-Precision Mode
                </span>
              </div>

              {/* Extraction Strategy Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  Table Detection Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStrategy('smart-table')}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      strategy === 'smart-table'
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Smart Grid (Auto)</span>
                      {strategy === 'smart-table' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                      Clusters column coordinates, aligns headers, and stitches multi-line wrapped cells.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrategy('preserve-positions')}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      strategy === 'preserve-positions'
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Spatial Columns</span>
                      {strategy === 'preserve-positions' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                      Preserves exact geometric horizontal bins without automatic row stitching.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrategy('raw-rows')}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      strategy === 'raw-rows'
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Whitespace Gutters</span>
                      {strategy === 'raw-rows' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                      Splits columns on double spaces. Ideal for terminal logs and fixed-width ASCII tables.
                    </p>
                  </button>
                </div>
              </div>

              {/* Sheet Organization & Output Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Sheet Layout */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Multi-Page Sheet Layout
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 rounded-2xl border border-white/60">
                    <button
                      type="button"
                      onClick={() => setSheetLayout('single')}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        sheetLayout === 'single'
                          ? 'bg-white text-slate-900 shadow-xs border border-white'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Single Unified Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => setSheetLayout('per-page')}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        sheetLayout === 'per-page'
                          ? 'bg-white text-slate-900 shadow-xs border border-white'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      One Sheet Per Page
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {sheetLayout === 'single'
                      ? 'Combines all pages into one continuous table (recommended for bank statements).'
                      : 'Creates separate Page 1, Page 2 worksheets in your Excel file.'}
                  </p>
                </div>

                {/* Target Format */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Output File Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'xlsx', label: '.XLSX', desc: 'Modern Excel' },
                      { id: 'csv', label: '.CSV', desc: 'Comma Separated' },
                      { id: 'tsv', label: '.TSV', desc: 'Tab Delimited' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id as any)}
                        className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                          exportFormat === fmt.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-black'
                            : 'bg-white/80 text-slate-800 border-slate-200 hover:border-slate-300 font-bold'
                        }`}
                      >
                        <span className="text-xs block">{fmt.label}</span>
                        <span className={`text-[10px] block ${exportFormat === fmt.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {fmt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-black text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{showAdvanced ? 'Hide Advanced Data Rules' : 'Show Advanced Data Rules (Currencies, Formats, Headers)'}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={parseNumbers}
                        onChange={(e) => setParseNumbers(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-indigo-600" /> Auto-Parse Real Numbers
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Converts numeric text to real Excel numbers for instant =SUM() calculations.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={detectCurrency}
                        onChange={(e) => setDetectCurrency(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Detect Currency Symbols
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Detects $, ₹, €, £ and preserves numeric integrity without breaking math.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mergeMultiline}
                        onChange={(e) => setMergeMultiline(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Stitch Multi-Line Row Wraps</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Merges wrapped item descriptions back into their primary parent row.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deduplicateHeaders}
                        onChange={(e) => setDeduplicateHeaders(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Deduplicate Recurring Headers</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Removes repeated table header rows from Pages 2, 3, etc.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formatHeaderRow}
                        onChange={(e) => setFormatHeaderRow(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Freeze Top Header Row</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Locks the first row in Excel so headers remain visible when scrolling.
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Button & Progress */}
              <div className="pt-2 space-y-3">
                {isProcessing ? (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-900">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        {progressMsg || 'Processing document...'}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-emerald-200/60 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleConvert()}
                      className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      <span>Convert PDF to {exportFormat.toUpperCase()}</span>
                    </button>
                    {result && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Start Over</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Live Spreadsheet Preview */}
            {result && currentPreviewSheetData && (
              <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                        <Eye className="w-4 h-4" />
                      </span>
                      <h3 className="text-base font-black text-slate-900">
                        Extracted Spreadsheet Preview
                      </h3>
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                        {result.totalRows} Rows Detected
                      </span>
                      <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                        {result.totalCols} Columns
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Review extracted rows below or click Copy Table to paste directly into your existing spreadsheet.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCopyTable}
                      className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                      <span>{copied ? 'Copied Table!' : 'Copy to Clipboard'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerBrowserDownload(result.blob, result.fileName)}
                      className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {exportFormat.toUpperCase()}</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Sheet Tabs if more than 1 */}
                {result.sheets.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                    {result.sheets.map((sheet, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setActivePreviewSheet(sIdx)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                          activePreviewSheet === sIdx
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {sheet.sheetName} ({sheet.rowCount} rows)
                      </button>
                    ))}
                  </div>
                )}

                {/* Table Matrix View */}
                <div className="overflow-x-auto max-h-96 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-black sticky top-0 z-10">
                        <th className="p-2.5 border-b border-slate-800 w-12 text-center text-[10px] text-slate-400">#</th>
                        {currentPreviewSheetData.rows[0]?.map((_, colIdx) => (
                          <th key={colIdx} className="p-2.5 border-b border-slate-800 font-extrabold whitespace-nowrap">
                            Col {String.fromCharCode(65 + (colIdx % 26))}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 bg-white font-medium text-slate-800">
                      {currentPreviewSheetData.rows.slice(0, 30).map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx === 0 ? 'bg-emerald-50/60 font-bold' : 'hover:bg-slate-50'}>
                          <td className="p-2.5 text-center text-[10px] text-slate-400 font-mono select-none bg-slate-50/70 border-r border-slate-200">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 border-r border-slate-100 max-w-xs truncate whitespace-pre-line">
                              {cell === null || cell === undefined || cell === '' ? (
                                <span className="text-slate-300 italic">—</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {currentPreviewSheetData.rowCount > 30 && (
                  <p className="text-[11px] text-slate-500 font-medium text-center pt-1">
                    Showing first 30 of {currentPreviewSheetData.rowCount} rows. Full table will be present in your downloaded spreadsheet.
                  </p>
                )}

                {/* Alternative Quick Export Chips */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-600">Export in other formats:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleConvert('csv')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Download CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvert('tsv')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Download TSV
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvert('html')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Download HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvert('json')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Download JSON
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Competitor Comparison Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Engine Benchmark
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Why FileZenith Beats Other PDF to Excel Converters
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              See how our client-side WebAssembly table extractor compares against standard cloud upload tools.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-black">
                  <th className="p-3 sm:p-4">Feature & Capability</th>
                  <th className="p-3 sm:p-4 text-emerald-400">FileZenith Wasm</th>
                  <th className="p-3 sm:p-4 text-slate-300">Smallpdf / iLovePDF</th>
                  <th className="p-3 sm:p-4 text-slate-300">Adobe Acrobat Online</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Data Privacy</td>
                  <td className="p-3 sm:p-4 text-emerald-700 font-bold bg-emerald-50/50">100% In-Browser (0 Uploads)</td>
                  <td className="p-3 sm:p-4 text-rose-600">Uploaded to Cloud Servers</td>
                  <td className="p-3 sm:p-4 text-rose-600">Uploaded to Cloud Servers</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">File Size & Page Limits</td>
                  <td className="p-3 sm:p-4 text-emerald-700 font-bold bg-emerald-50/50">Unlimited (Device RAM)</td>
                  <td className="p-3 sm:p-4 text-rose-600">15MB or 2 docs/day</td>
                  <td className="p-3 sm:p-4 text-rose-600">Limited without sign-in</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Stitch Multi-Line Row Wraps</td>
                  <td className="p-3 sm:p-4 text-emerald-700 font-bold bg-emerald-50/50">Included (No orphan rows)</td>
                  <td className="p-3 sm:p-4 text-slate-500">Splits across random rows</td>
                  <td className="p-3 sm:p-4 text-slate-500">Inconsistent</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Auto-Detect Numbers for Math</td>
                  <td className="p-3 sm:p-4 text-emerald-700 font-bold bg-emerald-50/50">Real Numbers (=SUM works)</td>
                  <td className="p-3 sm:p-4 text-slate-500">Often text strings</td>
                  <td className="p-3 sm:p-4 text-slate-500">Partial</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Recurring Header Deduplication</td>
                  <td className="p-3 sm:p-4 text-emerald-700 font-bold bg-emerald-50/50">Automatic (Continuous sheet)</td>
                  <td className="p-3 sm:p-4 text-rose-600">Repeats header every page</td>
                  <td className="p-3 sm:p-4 text-rose-600">Repeats header every page</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Live Preview & Copy to Clipboard</td>
                  <td className="p-3 sm:p-4 text-emerald-700 font-bold bg-emerald-50/50">1-Click Instant Paste</td>
                  <td className="p-3 sm:p-4 text-rose-600">Must download entire file</td>
                  <td className="p-3 sm:p-4 text-rose-600">Must sign in to view</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FileReadyModal */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={result?.fileName || 'converted-spreadsheet.xlsx'}
          fileType="file"
          title="Spreadsheet Conversion Complete!"
          subtitle={`Extracted ${result?.totalRows || 0} rows across ${result?.sheets.length || 1} sheet(s) with zero server uploads.`}
          onReset={handleReset}
        />
      </div>
    </ToolLayout>
  );
}
