'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { convertWordToPages } from '@/lib/apple-engine';
import {
  Download,
  FileText,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ArrowLeftRight,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Laptop,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WordToPagesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('converted-document.pages');
  const [stats, setStats] = useState<{ pageCount: number; fileSizeKB: number } | null>(null);

  const handleFilesChange = (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    setStats(null);
    setProgressPercent(0);
    setProgressMessage('');
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl(null);
    setStats(null);
    setProgressPercent(0);
    setProgressMessage('');
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload a Word document first.');
      return;
    }

    const file = files[0].file;
    if (!file.name.toLowerCase().endsWith('.docx')) {
      toast.error('Please upload a Microsoft Word document (.docx).');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);
    setProgressMessage('Analyzing Word document layout & typography...');

    try {
      const result = await convertWordToPages(file, (percent, message) => {
        setProgressPercent(percent);
        setProgressMessage(message);
      });

      const url = URL.createObjectURL(result.blob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}.pages`;

      setDownloadUrl(url);
      setDownloadName(outName);
      setStats({
        pageCount: result.pageCount,
        fileSizeKB: result.fileSizeKB,
      });

      toast.success('Word document successfully converted to Apple Pages (.pages)!');
    } catch (err: any) {
      console.error('Word to Pages conversion error:', err);
      toast.error(err?.message || 'Failed to convert Word document to Pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/word-to-pages"
      title="Word to Pages Converter Online"
      subtitle="Convert Microsoft Word (.docx) documents to Apple Pages (.pages) format directly in your browser. 100% free with zero server uploads."
    >
      <div className="space-y-8">
        {/* 1-Click Interactive Direction Switcher */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center justify-center max-w-xl mx-auto border border-slate-200/80 shadow-2xs">
          <div className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl bg-white text-blue-700 font-extrabold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Word (.docx) → Pages (.pages)</span>
          </div>

          <Link
            href="/utility/pages-to-word"
            className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 group"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 transition-transform group-hover:rotate-180" />
            <span className="hidden xs:inline">Pages → Word</span>
            <span className="xs:hidden">Reverse</span>
          </Link>
        </div>

        {/* Visual Format Flow Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Source: Word */}
            <div className="flex items-center gap-3 w-full sm:w-auto p-4 rounded-2xl bg-white border border-blue-100 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">Source Format</span>
                <h3 className="text-base font-black text-slate-900">Microsoft Word</h3>
                <span className="text-xs text-slate-500 font-medium">.docx Document</span>
              </div>
            </div>

            {/* Middle Pipeline Arrow */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Client Bridge</span>
            </div>

            {/* Target: Apple Pages */}
            <div className="flex items-center gap-3 w-full sm:w-auto p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 block">Target Format</span>
                <h3 className="text-base font-black text-slate-900">Apple Pages</h3>
                <span className="text-xs text-slate-500 font-medium">.pages package</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">100% Private</h4>
              <p className="text-[10px] text-slate-500 font-medium">Zero cloud uploads</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">No Mac Needed</h4>
              <p className="text-[10px] text-slate-500 font-medium">Runs on Windows PC</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Instant Speed</h4>
              <p className="text-[10px] text-slate-500 font-medium">Local browser engine</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">No Account</h4>
              <p className="text-[10px] text-slate-500 font-medium">100% free & unlimited</p>
            </div>
          </div>
        </div>

        {/* Uploader Section */}
        <div className="space-y-4">
          <FileUploader
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple={false}
            files={files}
            onFilesSelected={handleFilesChange}
            onRemoveFile={handleReset}
            title="Upload Microsoft Word (.docx) document to convert to Pages"
            subtitle="Drag & drop or tap to select document from your computer or mobile device."
          />

          {files.length > 0 && !downloadUrl && (
            <div className="space-y-3">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Packaging Apple Pages Document...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    <span>Convert Word to Apple Pages (.pages)</span>
                  </>
                )}
              </button>

              {/* Live Progress Feedback */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-blue-400">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      {progressMessage || 'Compiling Apple Pages (.pages) archive...'}
                    </span>
                    <span className="font-mono text-blue-300">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400 transition-all duration-300 rounded-full"
                      style={{ width: `${Math.max(progressPercent, 5)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Result Card */}
          {downloadUrl && (
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/30 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                    <span>Apple Pages Package (.pages) Ready!</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {stats
                      ? `${stats.pageCount} page(s) compiled • ${stats.fileSizeKB} KB`
                      : 'Converted 100% locally with zero server file uploads.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                  title="Convert another Word document"
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
                  <span>Download Pages (.pages)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Technical Deep Dive: Why Convert Word to Apple Pages? */}
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Why Convert Word Documents to Apple Pages?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Understand document package compatibility between Windows Word and macOS iWork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs">
                DOCX
              </div>
              <h3 className="text-sm font-black text-slate-900">Microsoft OOXML Standard</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                DOCX documents store content in <code>word/document.xml</code> according to Microsoft Office Open XML specifications. While powerful, it often produces layout shifts and font discrepancies when viewed on Apple devices without conversion.
              </p>
            </div>

            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-black text-xs">
                PAGES
              </div>
              <h3 className="text-sm font-black text-slate-900">Apple Typography & Canvas</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Apple Pages features superior typographic rendering, seamless iCloud collaboration, and optimized touch interactions on iPad and iPhone. Converting ensures Mac teams receive a document tailored to their ecosystem.
              </p>
            </div>

            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                ZERO
              </div>
              <h3 className="text-sm font-black text-slate-900">Safe Client-Side Creation</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                FileZenith packages the document directly in browser memory, assembling vector graphics, formatting streams, and embedded metadata so the generated file opens smoothly on macOS Pages and iOS devices.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specs & Compatibility Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base sm:text-xl font-black text-slate-900">
              Technical Specifications & Compatibility
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 sm:p-4 font-black text-slate-900">Specification</th>
                  <th className="p-3 sm:p-4 font-black text-blue-700">FileZenith Engine</th>
                  <th className="p-3 sm:p-4 font-bold text-slate-500">Compatibility Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Supported Input Formats</td>
                  <td className="p-3 sm:p-4 text-blue-700 font-bold">.docx</td>
                  <td className="p-3 sm:p-4 text-slate-600">Microsoft Word 2007-2024, Office 365, Google Docs exports</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Generated Output Format</td>
                  <td className="p-3 sm:p-4 text-blue-700 font-bold">.pages (Apple iWork)</td>
                  <td className="p-3 sm:p-4 text-slate-600">Native Apple Pages package opens on macOS, iPadOS, iOS, and iCloud Pages</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Device Requirement</td>
                  <td className="p-3 sm:p-4 text-blue-700 font-bold">Universal (Windows PC, Mac, Mobile)</td>
                  <td className="p-3 sm:p-4 text-slate-600">Generate Apple Pages files directly from a Windows computer without macOS</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Confidentiality Guarantee</td>
                  <td className="p-3 sm:p-4 text-blue-700 font-bold">100% In-Browser Isolation</td>
                  <td className="p-3 sm:p-4 text-slate-600">Zero files sent over the network; legal, financial, and personal text is completely private</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Pricing & Restrictions</td>
                  <td className="p-3 sm:p-4 text-blue-700 font-bold">100% Free Forever</td>
                  <td className="p-3 sm:p-4 text-slate-600">No page limits, no watermarks, and no sign-up requirement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
