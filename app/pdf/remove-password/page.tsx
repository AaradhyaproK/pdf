'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { unprotectPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Unlock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RemovePasswordPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelect = (selected: FileItem[]) => {
    setFiles(selected);
    setDownloadUrl(null);
  };

  const handleRemovePassword = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first.');
      return;
    }
    if (!password) {
      toast.error('Please enter the current password to unlock the PDF.');
      return;
    }

    setIsProcessing(true);
    try {
      const decryptedBytes = await unprotectPDF(files[0].file, password);
      const blob = new Blob([new Uint8Array(decryptedBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF document unlocked and password removed successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to unlock PDF. Is the password correct?');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/remove-password"
      title="Remove PDF Password Online"
      subtitle="Unlock your protected PDF documents and remove passwords locally in your browser."
      badgeText="Secure & Private"
    >
      <div className="space-y-6">
        <FileUploader
          accept="application/pdf"
          multiple={false}
          files={files}
          onFilesSelected={handleFileSelect}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
          }}
          title="Upload protected PDF document to unlock"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                    <Unlock className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Remove PDF Password
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[280px] sm:max-w-[400px]">
                      {files[0].file.name}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200 shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Requires Current Password
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                    <span>Current PDF Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the password to unlock"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRemovePassword}
                disabled={isProcessing || !password}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-black text-base shadow-lg shadow-indigo-500/20 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                <span>{isProcessing ? 'Unlocking PDF Document...' : 'Unlock & Remove Password Now'}</span>
              </button>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xs shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-emerald-950">Unlocked PDF Ready!</h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Document has been unlocked and the password has been removed.
                </p>
              </div>
            </div>
            <a
              href={downloadUrl}
              download={`unlocked-${files[0]?.file.name || 'document.pdf'}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Unlocked PDF</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
