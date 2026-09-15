'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import forge from 'node-forge';
import {
  Hash,
  Copy,
  Check,
  Upload,
  FileText,
  FileCheck,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react';

interface HashResults {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

export default function HashGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [inputText, setInputText] = useState<string>('Hello, World! Secure hashing with FileZenith.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [compareHash, setCompareHash] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hashes, setHashes] = useState<HashResults>({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });

  // Calculate Web Crypto ArrayBuffer to Hex
  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Compute text hashes
  useEffect(() => {
    if (activeTab !== 'text') return;

    const computeTextHashes = async () => {
      if (!inputText) {
        setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' });
        return;
      }

      try {
        // MD5 via forge
        const md5Md = forge.md.md5.create();
        md5Md.update(inputText, 'utf8');
        const md5Hash = md5Md.digest().toHex();

        // Web Crypto for SHA family
        const encoder = new TextEncoder();
        const data = encoder.encode(inputText);

        const [sha1Buf, sha256Buf, sha384Buf, sha512Buf] = await Promise.all([
          crypto.subtle.digest('SHA-1', data),
          crypto.subtle.digest('SHA-256', data),
          crypto.subtle.digest('SHA-384', data),
          crypto.subtle.digest('SHA-512', data),
        ]);

        setHashes({
          md5: md5Hash,
          sha1: bufferToHex(sha1Buf),
          sha256: bufferToHex(sha256Buf),
          sha384: bufferToHex(sha384Buf),
          sha512: bufferToHex(sha512Buf),
        });
      } catch (err) {
        console.error('Hash calculation error', err);
      }
    };

    computeTextHashes();
  }, [inputText, activeTab]);

  // Compute file hashes
  const handleFileChange = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];
    setSelectedFile(file);
    setIsProcessing(true);
    toast.info(`Calculating checksums for ${file.name}...`);

    try {
      const buffer = await file.arrayBuffer();

      // MD5 via forge binary string
      const u8 = new Uint8Array(buffer);
      const binaryStr = forge.util.binary.raw.encode(u8);
      const md5Md = forge.md.md5.create();
      md5Md.update(binaryStr);
      const md5Hash = md5Md.digest().toHex();

      // Web Crypto for SHA family
      const [sha1Buf, sha256Buf, sha384Buf, sha512Buf] = await Promise.all([
        crypto.subtle.digest('SHA-1', buffer),
        crypto.subtle.digest('SHA-256', buffer),
        crypto.subtle.digest('SHA-384', buffer),
        crypto.subtle.digest('SHA-512', buffer),
      ]);

      setHashes({
        md5: md5Hash,
        sha1: bufferToHex(sha1Buf),
        sha256: bufferToHex(sha256Buf),
        sha384: bufferToHex(sha384Buf),
        sha512: bufferToHex(sha512Buf),
      });

      toast.success('Checksums calculated successfully!');
    } catch {
      toast.error('Failed to calculate file hashes.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async (key: string, val: string) => {
    const formatted = isUppercase ? val.toUpperCase() : val.toLowerCase();
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedKey(key);
      toast.success(`Copied ${key.toUpperCase()} hash!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const formatDisplay = (hash: string) => {
    if (!hash) return '';
    return isUppercase ? hash.toUpperCase() : hash.toLowerCase();
  };

  // Compare check
  const matchedAlgorithm = (() => {
    const cleanCompare = compareHash.trim().toLowerCase();
    if (!cleanCompare) return null;
    if (hashes.md5.toLowerCase() === cleanCompare) return 'MD5';
    if (hashes.sha1.toLowerCase() === cleanCompare) return 'SHA-1';
    if (hashes.sha256.toLowerCase() === cleanCompare) return 'SHA-256';
    if (hashes.sha384.toLowerCase() === cleanCompare) return 'SHA-384';
    if (hashes.sha512.toLowerCase() === cleanCompare) return 'SHA-512';
    return 'NOMATCH';
  })();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hashList = [
    { key: 'md5', label: 'MD5', length: '128-bit / 32 hex chars', val: hashes.md5 },
    { key: 'sha1', label: 'SHA-1', length: '160-bit / 40 hex chars', val: hashes.sha1 },
    { key: 'sha256', label: 'SHA-256', length: '256-bit / 64 hex chars (Recommended)', val: hashes.sha256 },
    { key: 'sha384', label: 'SHA-384', length: '384-bit / 96 hex chars', val: hashes.sha384 },
    { key: 'sha512', label: 'SHA-512', length: '512-bit / 128 hex chars', val: hashes.sha512 },
  ];

  return (
    <ToolLayout
      slug="/utility/hash-generator"
      title="MD5 & SHA Hash Generator & Checksum Verifier"
      subtitle="Generate cryptographic MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes for text and binary files in real-time. 100% private in-browser Web Crypto engine."
      badgeText="Cryptographic Tool"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
                activeTab === 'text'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hash Text / String
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
                activeTab === 'file'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hash File / Checksum
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUppercase(!isUppercase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                isUppercase
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isUppercase ? 'UPPERCASE' : 'lowercase'}
            </button>
          </div>
        </div>

        {/* Input Area */}
        {activeTab === 'text' ? (
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Enter Text or Passphrase
              </label>
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              placeholder="Type or paste any text to hash..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files);
              }}
              className="p-8 sm:p-12 border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-3xl bg-indigo-50/20 hover:bg-indigo-50/40 transition-all text-center cursor-pointer space-y-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {selectedFile ? selectedFile.name : 'Select or drop any file to compute checksum'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} • Click to choose a different file`
                    : 'Supports all file formats (EXE, ZIP, PDF, DMG, ISO, APK). 100% computed on device.'}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Checksum Verifier & Matcher */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            Compare / Verify Checksum (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="Paste expected MD5, SHA-1, or SHA-256 hash to verify match..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-32"
            />
            {compareHash.trim() && (
              <div className="absolute right-2 top-2">
                {matchedAlgorithm && matchedAlgorithm !== 'NOMATCH' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Match ({matchedAlgorithm})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-black border border-rose-300">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    No Match
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hashes Output List */}
        <div className="space-y-3">
          {hashList.map((item) => {
            const isMatched =
              matchedAlgorithm &&
              matchedAlgorithm !== 'NOMATCH' &&
              compareHash.trim().toLowerCase() === item.val.toLowerCase();

            return (
              <div
                key={item.key}
                className={`bg-white p-4 rounded-2xl border transition-all ${
                  isMatched
                    ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{item.label}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.key, item.val)}
                    disabled={!item.val}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      copiedKey === item.key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {copiedKey === item.key ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs text-slate-800 break-all select-all">
                  {isProcessing ? (
                    <span className="text-slate-400 flex items-center gap-1 italic">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Calculating checksum...
                    </span>
                  ) : item.val ? (
                    formatDisplay(item.val)
                  ) : (
                    <span className="text-slate-300 italic">No input</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
