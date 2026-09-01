'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { extractTextOCR } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Copy, Download, FileCheck, RefreshCw, Sparkles, Check, FileText, Globe } from 'lucide-react';

const OCR_LANGUAGES = [
  {
    group: '⭐ Popular & Indian Languages',
    items: [
      { code: 'eng', name: 'English (United States / UK / Global)' },
      { code: 'hin', name: 'Hindi (हिंदी)' },
      { code: 'mar', name: 'Marathi (मराठी)' },
      { code: 'ben', name: 'Bengali (বাংলা)' },
      { code: 'tam', name: 'Tamil (தமிழ்)' },
      { code: 'tel', name: 'Telugu (తెలుగు)' },
      { code: 'guj', name: 'Gujarati (ગુજરાતી)' },
      { code: 'kan', name: 'Kannada (ಕನ್ನಡ)' },
      { code: 'mal', name: 'Malayalam (മലയാളം)' },
      { code: 'pan', name: 'Punjabi (ਪੰਜਾਬੀ)' },
      { code: 'urd', name: 'Urdu (اردو)' },
      { code: 'san', name: 'Sanskrit (संस्कृतम्)' },
      { code: 'ori', name: 'Odia / Oriya (ଓଡ଼ିଆ)' },
      { code: 'asm', name: 'Assamese (অসমীয়া)' },
      { code: 'nep', name: 'Nepali (नेपाली)' },
      { code: 'sin', name: 'Sinhala (සිංහල)' },
    ],
  },
  {
    group: '🌍 Americas & Western Europe',
    items: [
      { code: 'spa', name: 'Spanish (Español)' },
      { code: 'fra', name: 'French (Français)' },
      { code: 'deu', name: 'German (Deutsch)' },
      { code: 'por', name: 'Portuguese (Português)' },
      { code: 'ita', name: 'Italian (Italiano)' },
      { code: 'nld', name: 'Dutch (Nederlands)' },
      { code: 'swe', name: 'Swedish (Svenska)' },
      { code: 'dan', name: 'Danish (Dansk)' },
      { code: 'fin', name: 'Finnish (Suomi)' },
      { code: 'nor', name: 'Norwegian (Norsk)' },
      { code: 'cat', name: 'Catalan (Català)' },
    ],
  },
  {
    group: '🌏 East & Southeast Asia',
    items: [
      { code: 'chi_sim', name: 'Chinese Simplified (简体中文)' },
      { code: 'chi_tra', name: 'Chinese Traditional (繁體中文)' },
      { code: 'jpn', name: 'Japanese (日本語)' },
      { code: 'kor', name: 'Korean (한국어)' },
      { code: 'vie', name: 'Vietnamese (Tiếng Việt)' },
      { code: 'tha', name: 'Thai (ไทย)' },
      { code: 'ind', name: 'Indonesian (Bahasa Indonesia)' },
      { code: 'msa', name: 'Malay (Bahasa Melayu)' },
      { code: 'tgl', name: 'Tagalog / Filipino' },
      { code: 'khm', name: 'Khmer (ភាសាខ្មែរ)' },
      { code: 'mya', name: 'Myanmar (Burmese / မြန်မာစာ)' },
    ],
  },
  {
    group: '🏛️ Eastern Europe, Middle East & Central Asia',
    items: [
      { code: 'ara', name: 'Arabic (العربية)' },
      { code: 'rus', name: 'Russian (Русский)' },
      { code: 'tur', name: 'Turkish (Türkçe)' },
      { code: 'fas', name: 'Persian / Farsi (فارسی)' },
      { code: 'heb', name: 'Hebrew (עברית)' },
      { code: 'pol', name: 'Polish (Polski)' },
      { code: 'ukr', name: 'Ukrainian (Українська)' },
      { code: 'ron', name: 'Romanian (Română)' },
      { code: 'ell', name: 'Greek (Ελληνικά)' },
      { code: 'ces', name: 'Czech (Čeština)' },
      { code: 'hun', name: 'Hungarian (Magyar)' },
      { code: 'bul', name: 'Bulgarian (Български)' },
      { code: 'srp', name: 'Serbian (Српски)' },
      { code: 'hrv', name: 'Croatian (Hrvatski)' },
      { code: 'slk', name: 'Slovak (Slovenčina)' },
      { code: 'swa', name: 'Swahili (Kiswahili)' },
      { code: 'aze', name: 'Azerbaijani (Azərbaycan)' },
      { code: 'kat', name: 'Georgian (ქართული)' },
      { code: 'hye', name: 'Armenian (Հայերեն)' },
      { code: 'kaz', name: 'Kazakh (Қазақ тілі)' },
      { code: 'uzb', name: 'Uzbek (Oʻzbekcha)' },
    ],
  },
];

export default function PDFOCRPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [lang, setLang] = useState('eng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (selected: FileItem[]) => {
    setFiles(selected);
    setExtractedText(null);
  };

  const handleRunOCR = async () => {
    if (files.length === 0) {
      toast.error('Please upload a scanned PDF document.');
      return;
    }

    setIsProcessing(true);
    setExtractedText(null);
    setProgressPercent(10);
    setProgressStatus('Initializing AI Tesseract Engine...');

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
      setCopied(true);
      toast.success('Extracted text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadTextFile = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-ocr-${files[0]?.file.name || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText ? extractedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = extractedText ? extractedText.length : 0;

  return (
    <ToolLayout
      slug="/pdf/ocr"
      title="Client-Side PDF OCR (Text Extractor)"
      subtitle="Extract editable plain text from scanned PDFs in Hindi, Marathi, English & world languages using AI Wasm Tesseract. 100% Private."
      badgeText="Hindi, Marathi & Global OCR"
    >
      <div className="space-y-6">
        {/* Upload Container */}
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setExtractedText(null);
          }}
          isProcessing={isProcessing}
          progressPercent={progressPercent}
          progressStatus={progressStatus}
          title="Upload Scanned PDF Document"
        />

        {/* OCR Language Selection & Process Button */}
        {files.length > 0 && (
          <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-md space-y-4 text-slate-900">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Select Document Language (OCR Support)</span>
              </label>

              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                disabled={isProcessing}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
              >
                {OCR_LANGUAGES.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.items.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name} ({item.code})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 font-medium">
                Supports Hindi (हिंदी), Marathi (मराठी), English, Bengali, Tamil, Telugu, Gujarati, Spanish, French & 15+ more.
              </p>
            </div>

            <button
              onClick={handleRunOCR}
              disabled={isProcessing}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Running AI OCR Recognition ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Extract Editable Text Now</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Extracted Text Results Box in Pure Day/Light Mode */}
        {extractedText && (
          <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-md space-y-4 text-slate-900 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Extracted Plain Text
                </span>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {wordCount} Words
                </span>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {charCount} Characters
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-700" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={downloadTextFile}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Clean White Day Mode Text Area */}
            <textarea
              readOnly
              value={extractedText}
              rows={12}
              className="w-full p-4 rounded-2xl border border-slate-300 bg-white font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner leading-relaxed"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
