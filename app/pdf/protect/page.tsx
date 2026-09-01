'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { protectPDF, renderPDFPagesToImages } from '@/lib/pdf-engine';
import { PDFPageGridList } from '@/components/PDFPageGridList';
import { toast } from 'sonner';
import { Download, Lock, Eye, EyeOff, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PageThumbnail {
  pageNumber: number;
  dataUrl: string;
}

export default function ProtectPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelect = async (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
    if (selected.length === 0) {
      setThumbnails([]);
      return;
    }

    setIsLoadingPages(true);
    try {
      const rendered = await renderPDFPagesToImages(selected[0].file, 1.0);
      const thumbs = rendered.map((r) => ({
        pageNumber: r.pageNumber,
        dataUrl: r.dataUrl,
      }));
      setThumbnails(thumbs);
    } catch (err: any) {
      toast.error('Failed to render PDF page preview.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleProtect = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }
    if (!password) {
      toast.error('Please enter a secure password.');
      return;
    }
    if (password.length < 3) {
      toast.error('Password should be at least 3 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify your password.');
      return;
    }

    setIsProcessing(true);
    try {
      const encryptedBytes = await protectPDF(files[0].file, password, password);
      const blob = new Blob([new Uint8Array(encryptedBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF document encrypted and password protected successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to encrypt PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/protect"
      title="Password Protect PDF Online"
      subtitle="Encrypt your PDF documents with custom open passwords and permission rules locally in your browser."
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setThumbnails([]);
            setDownloadUrl(null);
          }}
          title="Upload PDF document to encrypt & protect"
        />

        {isLoadingPages && (
          <div className="py-8 text-center text-slate-600 animate-pulse text-sm font-medium flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            <span>Rendering document page preview...</span>
          </div>
        )}

        {files.length > 0 && !isLoadingPages && (
          <div className="space-y-6 pt-2">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                    <Lock className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Set PDF Password Protection
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[280px] sm:max-w-[400px]">
                      {files[0].file.name}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Standard 128-bit Encryption
                </span>
              </div>

              {thumbnails.length > 0 && (
                <PDFPageGridList
                  title="Document Page Preview"
                  pages={thumbnails}
                  selectable={false}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                    <span>Set Document Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                    <span>Confirm Password</span>
                    {password && confirmPassword && (
                      <span className={`text-[11px] font-bold ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProtect}
                disabled={isProcessing || !password || password !== confirmPassword}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-black text-base shadow-lg shadow-indigo-500/20 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                <span>{isProcessing ? 'Encrypting PDF Document...' : 'Encrypt & Protect PDF Now'}</span>
              </button>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-emerald-950">Encrypted PDF Ready!</h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Document has been encrypted. Recipients must enter your password to open the file.
                </p>
              </div>
            </div>
            <a
              href={downloadUrl}
              download="protected-document.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Protected PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
