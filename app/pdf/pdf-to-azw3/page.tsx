'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import {
  convertPdfToKindleAzw3,
  KindleConversionOptions,
  KindleConversionResult,
} from '@/lib/kindle-azw3-engine';
import { triggerBrowserDownload } from '@/lib/download-helper';
import { toast } from 'sonner';
import {
  BookOpen,
  Download,
  Send,
  Usb,
  Laptop,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Type,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Clock,
  FileText,
  Sparkles,
  Info,
  Check,
  Smartphone,
  Tablet,
  FolderDown,
} from 'lucide-react';

export default function PdfToAzw3Page() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<KindleConversionResult | null>(null);

  // Conversion options
  const [targetDevice, setTargetDevice] = useState<'paperwhite' | 'basic' | 'oasis' | 'scribe' | 'app'>('paperwhite');
  const [fontFamily, setFontFamily] = useState<'Bookerly' | 'Amazon Ember' | 'Caecilia' | 'OpenDyslexic'>('Bookerly');
  const [fontSize, setFontSize] = useState<'small' | 'standard' | 'large'>('standard');
  const [lineSpacing, setLineSpacing] = useState<'1.2' | '1.4' | '1.6'>('1.4');
  const [paragraphStyle, setParagraphStyle] = useState<'indented' | 'block'>('indented');
  const [customTitle, setCustomTitle] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Kindle Simulator state
  const [simulatorChapterIdx, setSimulatorChapterIdx] = useState(0);
  const [isEInkDarkMode, setIsEInkDarkMode] = useState(false);
  const [simulatorFontSize, setSimulatorFontSize] = useState<number>(16);
  const [transferTab, setTransferTab] = useState<'send-to-kindle' | 'usb' | 'calibre'>('send-to-kindle');

  const handleFilesSelected = (selected: FileItem[]) => {
    setFiles(selected);
    setResult(null);
    if (selected.length > 0) {
      const rawName = selected[0].file.name.replace(/\.[^/.]+$/, '');
      setCustomTitle(rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()));
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
    setProgress(0);
    setProgressMsg('');
    setSimulatorChapterIdx(0);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setProgressMsg('Initializing Kindle conversion engine...');

    try {
      const sourceFile = files[0].file;
      const options: KindleConversionOptions = {
        bookTitle: customTitle.trim() || undefined,
        authorName: customAuthor.trim() || 'FileZenith Author',
        targetDevice,
        fontFamily,
        fontSize,
        lineSpacing,
        paragraphStyle,
      };

      const res = await convertPdfToKindleAzw3(sourceFile, options, (p, msg) => {
        setProgress(p);
        setProgressMsg(msg);
      });

      setResult(res);
      setSimulatorChapterIdx(0);
      toast.success('PDF successfully converted to Kindle AZW3 & EPUB!');
    } catch (err: any) {
      console.error('Kindle conversion error:', err);
      toast.error(err?.message || 'Failed to convert PDF to Kindle format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentChapter = result?.chapters[simulatorChapterIdx];

  return (
    <ToolLayout
      slug="/pdf/pdf-to-azw3"
      title="PDF to AZW3 Converter — Convert PDF to Kindle eBook (Free, Fast, Private)"
      subtitle="Convert PDF documents into authentic reflowable Amazon Kindle eBooks (.azw3, .epub, .mobi). Optimized for Kindle Paperwhite, Oasis, Scribe & Basic with zero server uploads."
      badgeText="Kindle KF8 & EPUB Engine"
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        <FileUploader
          accept="application/pdf,.pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFilesSelected}
          onRemoveFile={handleReset}
          title="Upload PDF document to convert to Kindle eBook"
          subtitle="Drag & drop any book, academic thesis, textbook, or document (PDF)"
        />

        {files.length > 0 && (
          <div className="space-y-5">
            {/* Kindle Optimization Settings Card */}
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Kindle e-Reader Formatting & Device Presets
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure typography, reflowable paragraph spacing, and target Kindle specs.
                  </p>
                </div>
                <span className="text-[10px] text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-black uppercase tracking-wide self-start sm:self-auto">
                  KF8 / Reflowable Spec
                </span>
              </div>

              {/* Target Device Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tablet className="w-3.5 h-3.5 text-indigo-600" />
                  Target Kindle Hardware
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'paperwhite', name: 'Paperwhite', sub: '6.8" 300 PPI' },
                    { id: 'basic', name: 'Kindle Basic', sub: '6.0" 300 PPI' },
                    { id: 'oasis', name: 'Kindle Oasis', sub: '7.0" 300 PPI' },
                    { id: 'scribe', name: 'Kindle Scribe', sub: '10.2" Large' },
                    { id: 'app', name: 'Kindle App', sub: 'iOS / Android' },
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => setTargetDevice(dev.id as any)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        targetDevice === dev.id
                          ? 'bg-emerald-50/90 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-900 block">{dev.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{dev.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family & Paragraph Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Font Preset */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-emerald-600" />
                    Kindle Typography Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Bookerly', label: 'Bookerly (Serif)' },
                      { id: 'Amazon Ember', label: 'Ember (Modern)' },
                      { id: 'Caecilia', label: 'Caecilia (Classic)' },
                      { id: 'OpenDyslexic', label: 'OpenDyslexic' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFontFamily(f.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          fontFamily === f.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paragraph Indentation */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    Paragraph Spacing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setParagraphStyle('indented')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        paragraphStyle === 'indented'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Indented (Book Style)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParagraphStyle('block')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        paragraphStyle === 'block'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Block Paragraphs
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Author Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Book Title (As Shown in Kindle Library)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter eBook title..."
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    placeholder="Author name..."
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Action Button & Progress */}
              <div className="pt-2 space-y-3">
                {isProcessing ? (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-900">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        {progressMsg || 'Reflowing PDF into Kindle eBook...'}
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
                      onClick={handleConvert}
                      className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Convert PDF to Kindle AZW3 &amp; EPUB</span>
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

            {/* Post-Conversion Results & Download Studio */}
            {result && (
              <div className="space-y-6">
                {/* Primary Download Center */}
                <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          eBook Ready for Kindle
                        </h3>
                        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                          {result.totalChapters} Chapters Synthesized
                        </span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                          {result.totalWords.toLocaleString()} Words
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Est. Reading Time: ~{result.estimatedReadingMinutes} minutes • 100% Validated KF8 / EPUB Standard
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-500 font-semibold self-start sm:self-auto">
                      {result.bookTitle}
                    </span>
                  </div>

                  {/* Dual Download Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Primary Button: AZW3 for USB Sideload */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <Usb className="w-4 h-4 text-emerald-600" />
                            Amazon AZW3 (.azw3)
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold uppercase">
                            USB Sideload
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          Directly drag &amp; drop into your Kindle’s <code className="bg-slate-200 px-1 rounded">documents/</code> folder via USB cable.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          triggerBrowserDownload(result.azw3Blob, `${result.fileNameBase}.azw3`)
                        }
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Kindle AZW3 (.azw3)</span>
                      </button>
                    </div>

                    {/* Secondary Button: Kindle EPUB for Send to Kindle */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <Send className="w-4 h-4 text-indigo-600" />
                            Kindle-Optimized EPUB (.epub)
                          </span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-extrabold uppercase">
                            Send to Kindle
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          For Amazon’s <a href="https://www.amazon.com/sendtokindle" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-bold">Send to Kindle web app</a> and wireless @kindle.com email transfer.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          triggerBrowserDownload(result.epubBlob, `${result.fileNameBase}.epub`)
                        }
                        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Kindle EPUB (.epub)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Interactive Kindle e-Ink Simulator Preview */}
                <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Tablet className="w-4 h-4 text-emerald-600" />
                        Live Kindle Paperwhite e-Ink Simulator
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Preview how reflowable chapters, typography, and contrast appear on e-ink hardware before transfer.
                      </p>
                    </div>

                    {/* Simulator Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsEInkDarkMode(!isEInkDarkMode)}
                        className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Toggle e-ink dark mode"
                      >
                        {isEInkDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{isEInkDarkMode ? 'Light e-Ink' : 'Dark Mode'}</span>
                      </button>

                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setSimulatorFontSize(Math.max(12, simulatorFontSize - 2))}
                          className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                          title="Decrease font size"
                        >
                          A-
                        </button>
                        <span className="text-[11px] font-mono text-slate-500 px-1">{simulatorFontSize}px</span>
                        <button
                          type="button"
                          onClick={() => setSimulatorFontSize(Math.min(24, simulatorFontSize + 2))}
                          className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                          title="Increase font size"
                        >
                          A+
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Kindle Device Hardware Frame */}
                  <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 p-4 sm:p-7 shadow-2xl border-4 border-slate-800 space-y-3">
                    {/* Top Hardware Bezel Status */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pb-1 border-b border-slate-800/80">
                      <span className="truncate max-w-[200px]">{result.bookTitle}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 12:45 PM
                        </span>
                        <span>98%</span>
                      </div>
                    </div>

                    {/* e-Ink Matte Screen Surface */}
                    <div
                      className={`min-h-[380px] max-h-[520px] overflow-y-auto p-5 sm:p-8 rounded-xl shadow-inner transition-colors duration-300 ${
                        isEInkDarkMode
                          ? 'bg-[#181818] text-[#e0ded8]'
                          : 'bg-[#fbf9f4] text-[#1c1b1a]'
                      }`}
                      style={{
                        fontFamily:
                          fontFamily === 'Amazon Ember'
                            ? 'sans-serif'
                            : fontFamily === 'Caecilia'
                            ? 'serif'
                            : '"Bookerly", Georgia, serif',
                        fontSize: `${simulatorFontSize}px`,
                        lineHeight: lineSpacing,
                      }}
                    >
                      {currentChapter ? (
                        <div className="space-y-4">
                          <div className="text-center border-b border-slate-300/40 pb-3 mb-4">
                            <h2 className="text-xl font-bold tracking-tight">
                              {currentChapter.title}
                            </h2>
                            <p className="text-xs opacity-60 mt-1 italic">
                              {result.bookTitle} • By {result.authorName}
                            </p>
                          </div>
                          <div
                            className="prose prose-sm max-w-none text-justify"
                            dangerouslySetInnerHTML={{ __html: currentChapter.contentHtml }}
                          />
                        </div>
                      ) : (
                        <p className="text-center py-12 opacity-60">No chapter content to display.</p>
                      )}
                    </div>

                    {/* Bottom Hardware Bezel Status & Page Controls */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-2">
                      <button
                        type="button"
                        disabled={simulatorChapterIdx <= 0}
                        onClick={() => setSimulatorChapterIdx(Math.max(0, simulatorChapterIdx - 1))}
                        className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold cursor-pointer transition-all"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Chapter
                      </button>

                      <span className="text-[11px] font-mono opacity-80">
                        Chapter {simulatorChapterIdx + 1} of {result.totalChapters}
                      </span>

                      <button
                        type="button"
                        disabled={simulatorChapterIdx >= result.totalChapters - 1}
                        onClick={() =>
                          setSimulatorChapterIdx(
                            Math.min(result.totalChapters - 1, simulatorChapterIdx + 1)
                          )
                        }
                        className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold cursor-pointer transition-all"
                      >
                        Next Chapter <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-center pt-1">
                      <span className="text-[10px] tracking-widest uppercase font-mono text-slate-500 font-bold">
                        kindle
                      </span>
                    </div>
                  </div>
                </div>

                {/* 30-Second Transfer Guide Tabs */}
                <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <FolderDown className="w-4 h-4 text-emerald-600" />
                      How to Transfer to Your Kindle in 30 Seconds
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Select your preferred transfer method below for step-by-step instructions.
                    </p>
                  </div>

                  <div className="flex gap-2 border-b border-slate-200 pb-2">
                    {[
                      { id: 'send-to-kindle', label: 'Wireless (Send to Kindle)', icon: Send },
                      { id: 'usb', label: 'USB Cable (Direct Sideload)', icon: Usb },
                      { id: 'calibre', label: 'Calibre e-Book Manager', icon: Laptop },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setTransferTab(tab.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            transferTab === tab.id
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Transfer Guide Content */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2.5">
                    {transferTab === 'send-to-kindle' && (
                      <ol className="list-decimal list-inside space-y-1.5 font-medium">
                        <li>
                          Click <strong>Download Kindle EPUB (.epub)</strong> above. (Amazon officially uses EPUB for all Send to Kindle transfers).
                        </li>
                        <li>
                          Visit <a href="https://www.amazon.com/sendtokindle" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">amazon.com/sendtokindle</a> in any browser and sign in to your Amazon account.
                        </li>
                        <li>
                          Drag and drop your converted <code className="bg-slate-200 px-1 rounded">.epub</code> file onto the Amazon upload zone.
                        </li>
                        <li>
                          Amazon automatically pushes the book to your Kindle over Wi-Fi with page synchronization (Whispersync) enabled!
                        </li>
                      </ol>
                    )}

                    {transferTab === 'usb' && (
                      <ol className="list-decimal list-inside space-y-1.5 font-medium">
                        <li>
                          Click <strong>Download Kindle AZW3 (.azw3)</strong> above.
                        </li>
                        <li>
                          Plug your Kindle into your laptop or PC using a standard USB-C or micro-USB cable.
                        </li>
                        <li>
                          Open your computer’s file manager and locate the <strong>Kindle</strong> drive.
                        </li>
                        <li>
                          Drag the <code className="bg-slate-200 px-1 rounded">.azw3</code> file directly into the <strong>documents</strong> folder.
                        </li>
                        <li>
                          Safely eject the Kindle drive and unplug the cable. Your book will appear immediately in your Kindle Home Library!
                        </li>
                      </ol>
                    )}

                    {transferTab === 'calibre' && (
                      <ol className="list-decimal list-inside space-y-1.5 font-medium">
                        <li>
                          Download either the <strong>.azw3</strong> or <strong>.epub</strong> file above.
                        </li>
                        <li>
                          Open Calibre and click <strong>Add Books</strong>, selecting your converted file.
                        </li>
                        <li>
                          Plug your Kindle via USB and click <strong>Send to Device</strong> $\rightarrow$ <strong>Send to main memory</strong>.
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
