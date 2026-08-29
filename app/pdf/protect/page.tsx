'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { protectPDF } from '@/lib/pdf-engine';
import { toast } from 'sonner';
import { Download, Lock } from 'lucide-react';

export default function ProtectPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleProtect = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file.');
      return;
    }
    if (!password) {
      toast.error('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsProcessing(true);
    try {
      const encryptedBytes = await protectPDF(files[0].file, password, password);
      const blob = new Blob([new Uint8Array(encryptedBytes)], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF encrypted and password protected successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to encrypt PDF.');
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
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
          }}
          title="Upload PDF to protect"
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-500" />
                  Set Document Open Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleProtect}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Encrypting PDF Document...' : 'Encrypt & Protect PDF'}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">Encrypted PDF Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Password protection applied safely.</p>
            </div>
            <a
              href={downloadUrl}
              download="protected-document.pdf"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
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
