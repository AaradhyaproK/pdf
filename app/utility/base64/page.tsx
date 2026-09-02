'use client';

import { useState, ChangeEvent } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  Code2,
  Copy,
  Check,
  Upload,
  Download,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Base64ToolPage() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

  // Encoder state
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [base64Output, setBase64Output] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Decoder state
  const [base64Input, setBase64Input] = useState<string>('');
  const [decodedPreviewUrl, setDecodedPreviewUrl] = useState<string | null>(null);
  const [decodedMimeType, setDecodedMimeType] = useState<string>('application/octet-stream');

  // Handle File to Base64
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileType(file.type || 'application/octet-stream');
      setFileSize((file.size / 1024).toFixed(1) + ' KB');

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBase64Output(result);
        toast.success('File encoded to Base64!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Copy Base64
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Base64 copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Decode Base64 to file
  const handleDecode = () => {
    try {
      let rawData = base64Input.trim();
      let mime = 'application/octet-stream';

      if (rawData.startsWith('data:')) {
        const parts = rawData.split(',');
        mime = parts[0].match(/:(.*?);/)?.[1] || mime;
        rawData = parts[1] || parts[0];
      }

      const byteCharacters = atob(rawData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime });
      const url = URL.createObjectURL(blob);

      setDecodedPreviewUrl(url);
      setDecodedMimeType(mime);
      toast.success('Base64 string decoded!');
    } catch (err) {
      toast.error('Invalid Base64 string. Please check input data.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/base64"
      title="Base64 File Encoder & Decoder"
      subtitle="Convert files/images to Data URLs, HTML img tags, CSS background strings, or decode Base64 back to files."
    >
      <div className="space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('encode')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'encode'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            File to Base64 (Encode)
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'decode'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Base64 to File (Decode)
          </button>
        </div>

        {/* TAB 1: ENCODE */}
        {activeTab === 'encode' && (
          <div className="space-y-6">
            {!base64Output ? (
              <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center bg-slate-50/60 hover:bg-slate-100/60 transition-all cursor-pointer">
                <label className="cursor-pointer space-y-4 flex flex-col items-center">
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Upload Any File or Image</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Images, PDFs, documents, audio, or binaries (100% Client-Side)
                    </p>
                  </div>
                  <div className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-md transition-all">
                    Choose File to Encode
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info Header */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{fileName}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">{fileType} • {fileSize}</p>
                    </div>
                  </div>

                  <label className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all">
                    <span>Change File</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Base64 Data URL Output Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Base64 Data URI Output
                    </label>
                    <button
                      onClick={() => copyToClipboard(base64Output)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Base64'}</span>
                    </button>
                  </div>
                  <textarea
                    value={base64Output}
                    readOnly
                    rows={6}
                    className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl border border-slate-800 focus:outline-none shadow-inner"
                  />
                </div>

                {/* Snippets (HTML img & CSS background) */}
                {fileType.startsWith('image/') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-500">HTML &lt;img&gt; Tag</span>
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-800">
                        <span className="truncate">&lt;img src=&quot;{base64Output.slice(0, 30)}...&quot; /&gt;</span>
                        <button
                          onClick={() => copyToClipboard(`<img src="${base64Output}" alt="${fileName}" />`)}
                          className="ml-2 text-emerald-600 hover:underline font-bold shrink-0 cursor-pointer"
                        >
                          Copy HTML
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-500">CSS Background Snippet</span>
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-800">
                        <span className="truncate">background-image: url(&apos;{base64Output.slice(0, 25)}...&apos;);</span>
                        <button
                          onClick={() => copyToClipboard(`background-image: url('${base64Output}');`)}
                          className="ml-2 text-emerald-600 hover:underline font-bold shrink-0 cursor-pointer"
                        >
                          Copy CSS
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DECODE */}
        {activeTab === 'decode' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Paste Base64 String or Data URI
              </label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Paste base64 string here (e.g. data:image/png;base64,iVBORw0KGgo...)"
                rows={6}
                className="w-full p-3 bg-white text-slate-900 font-mono text-xs rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-inner"
              />
            </div>

            <button
              onClick={handleDecode}
              disabled={!base64Input.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Decode Base64 Data</span>
            </button>

            {decodedPreviewUrl && (
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Decoded Result Preview</span>
                </h4>

                {decodedMimeType.startsWith('image/') ? (
                  <div className="flex justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <img src={decodedPreviewUrl} alt="Decoded" className="max-h-64 object-contain rounded-xl shadow-md" />
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
                    Binary / File decoded successfully ({decodedMimeType})
                  </div>
                )}

                <a
                  href={decodedPreviewUrl}
                  download={`decoded-file.${decodedMimeType.split('/')[1] || 'bin'}`}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Decoded File</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
