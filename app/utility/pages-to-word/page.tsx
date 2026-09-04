'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { convertPagesToDocx } from '@/lib/apple-engine';
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

export default function PagesToWordPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('converted-document.docx');
  const [stats, setStats] = useState<{ wordCount: number; pageCount: number; fileSizeKB: number } | null>(null);

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
      toast.error('Please upload an Apple Pages file first.');
      return;
    }

    const file = files[0].file;
    if (!file.name.toLowerCase().endsWith('.pages')) {
      toast.error('Please upload an Apple Pages document (.pages).');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);
    setProgressMessage('Unpacking Apple Pages container package...');

    try {
      const result = await convertPagesToDocx(file, (percent, message) => {
        setProgressPercent(percent);
        setProgressMessage(message);
      });

      const url = URL.createObjectURL(result.blob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}.docx`;

      setDownloadUrl(url);
      setDownloadName(outName);
      setStats({
        wordCount: result.wordCount,
        pageCount: result.pageCount,
        fileSizeKB: Math.round(result.blob.size / 1024),
      });

      toast.success('Apple Pages document successfully converted to Word (.docx)!');
    } catch (err: any) {
      console.error('Pages to Word conversion error:', err);
      toast.error(err?.message || 'Failed to convert Apple Pages file. Ensure the file is not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/pages-to-word"
      title="Pages to Word Converter Online"
      subtitle="Convert Apple Pages (.pages) documents to editable Microsoft Word (.docx) format directly in your browser. 100% free with zero server uploads."
    >
      <div className="space-y-8">
        {/* 1-Click Interactive Direction Switcher */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center justify-center max-w-xl mx-auto border border-slate-200/80 shadow-2xs">
          <Link
            href="/utility/word-to-pages"
            className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 group"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
            <span className="hidden xs:inline">Word → Pages</span>
            <span className="xs:hidden">Reverse</span>
          </Link>

          <div className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl bg-white text-indigo-700 font-extrabold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Pages (.pages) → Word (.docx)</span>
          </div>
        </div>

        {/* Visual Format Flow Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Source: Apple Pages */}
            <div className="flex items-center gap-3 w-full sm:w-auto p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 block">Source Format</span>
                <h3 className="text-base font-black text-slate-900">Apple Pages</h3>
                <span className="text-xs text-slate-500 font-medium">.pages document package</span>
              </div>
            </div>

            {/* Middle Pipeline Arrow */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Client Bridge</span>
            </div>

            {/* Target: Word */}
            <div className="flex items-center gap-3 w-full sm:w-auto p-4 rounded-2xl bg-white border border-blue-100 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">Target Format</span>
                <h3 className="text-base font-black text-slate-900">Microsoft Word</h3>
                <span className="text-xs text-slate-500 font-medium">.docx Editable Document</span>
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
              <p className="text-[10px] text-slate-500 font-medium">Zero server uploads</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Opens on Windows</h4>
              <p className="text-[10px] text-slate-500 font-medium">No Mac or iCloud needed</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Fully Editable</h4>
              <p className="text-[10px] text-slate-500 font-medium">Standard Word DOCX</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Free Forever</h4>
              <p className="text-[10px] text-slate-500 font-medium">Zero watermarks or signup</p>
            </div>
          </div>
        </div>

        {/* Uploader Section */}
        <div className="space-y-4">
          <FileUploader
            accept=".pages,application/vnd.apple.pages,application/x-iwork-pages-sffpages,application/zip"
            multiple={false}
            files={files}
            onFilesSelected={handleFilesChange}
            onRemoveFile={handleReset}
            title="Upload Apple Pages (.pages) file to convert to Word"
            subtitle="Drag & drop or tap to select .pages document from your Mac, Windows PC, or mobile."
          />

          {files.length > 0 && !downloadUrl && (
            <div className="space-y-3">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Converting Pages to Word...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Convert to Microsoft Word (.docx)</span>
                  </>
                )}
              </button>

              {/* Live Progress Feedback */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      {progressMessage || 'Compiling Microsoft Word (.docx) document...'}
                    </span>
                    <span className="font-mono text-indigo-300">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 via-indigo-500 to-blue-500 transition-all duration-300 rounded-full"
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
                    <span>Microsoft Word (.docx) Ready!</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {stats
                      ? `${stats.wordCount.toLocaleString()} words • ${stats.pageCount} page(s) • ${stats.fileSizeKB} KB`
                      : 'Converted 100% locally with zero server file uploads.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                  title="Convert another Pages document"
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

        {/* Technical Deep Dive: Why Can't Windows Open Apple Pages Files? */}
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Why Won&apos;t Apple Pages Documents Open on Windows PC?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Understand why Microsoft Word errors when opening .pages documents and how FileZenith fixes it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-black text-xs">
                ERR
              </div>
              <h3 className="text-sm font-black text-slate-900">Unknown File Type on Windows</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                On Windows 11 and 10, double-clicking a <code>.pages</code> file triggers &ldquo;Windows cannot open this file&rdquo; or prompts you to search the Microsoft Store. Microsoft Word does not have a native filter for Apple Pages container files.
              </p>
            </div>

            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xs">
                ARCH
              </div>
              <h3 className="text-sm font-black text-slate-900">Apple iWork Package Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Apple Pages documents are compressed directory bundles containing proprietary Apple Protobuf archives (<code>Index/Document.iwa</code>) and QuickLook preview assets. Windows Word cannot parse Apple&apos;s proprietary document hierarchy.
              </p>
            </div>

            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs">
                DOCX
              </div>
              <h3 className="text-sm font-black text-slate-900">Standard Word Reconstruction</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                FileZenith scans the Apple package for high-fidelity QuickLook preview streams or internal XML text tokens, compiling them into a genuine, editable Microsoft Word <code>.docx</code> file complete with paragraphs, headings, and formatting.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specs & Compatibility Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <Layers className="w-4 h-4 text-indigo-600" />
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
                  <th className="p-3 sm:p-4 font-black text-indigo-700">FileZenith Engine</th>
                  <th className="p-3 sm:p-4 font-bold text-slate-500">Compatibility Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Supported Input Formats</td>
                  <td className="p-3 sm:p-4 text-indigo-700 font-bold">.pages</td>
                  <td className="p-3 sm:p-4 text-slate-600">Apple Pages documents created on macOS, iOS (iPad/iPhone), or iCloud Pages</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Generated Output Format</td>
                  <td className="p-3 sm:p-4 text-indigo-700 font-bold">.docx (Microsoft Word)</td>
                  <td className="p-3 sm:p-4 text-slate-600">Standard OpenXML format opens seamlessly in Microsoft Word, Google Docs, LibreOffice</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Target Operating Systems</td>
                  <td className="p-3 sm:p-4 text-indigo-700 font-bold">Windows, Android, Mac, Linux</td>
                  <td className="p-3 sm:p-4 text-slate-600">Enables Windows PC and Android users to open and edit Apple Pages documents without needing a Mac</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Security & Privacy Standard</td>
                  <td className="p-3 sm:p-4 text-indigo-700 font-bold">100% Client-Side Isolated</td>
                  <td className="p-3 sm:p-4 text-slate-600">Confidential agreements, legal contracts, and manuscripts never leave your device</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Account / Apple ID Needed</td>
                  <td className="p-3 sm:p-4 text-indigo-700 font-bold">Zero Signup / No iCloud</td>
                  <td className="p-3 sm:p-4 text-slate-600">Direct instant browser download with no email requirements or subscription gates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
