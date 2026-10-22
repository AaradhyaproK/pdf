'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  RefreshCw,
  X,
  FileCheck,
  ShieldCheck,
  Copy,
  Check,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface FileReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string | null;
  fileName: string;
  fileSizeKb?: number | null;
  previewUrl?: string | null;
  fileType?: 'pdf' | 'image' | 'file';
  title?: string;
  subtitle?: string;
  onReset?: () => void;
}

export function FileReadyModal({
  isOpen,
  onClose,
  downloadUrl,
  fileName,
  fileSizeKb,
  previewUrl,
  fileType = 'pdf',
  title = 'Your Document is Ready',
  subtitle = 'Processed entirely in your browser memory with zero cloud uploads.',
  onReset,
}: FileReadyModalProps) {
  const [copied, setCopied] = useState(false);

  // 1. Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // 2. Refined celebration confetti burst
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch (e) {
        // Fallback if canvas context fails
      }

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !downloadUrl) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Tool link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `I just generated my ${fileType.toUpperCase()} safely and free on FileZenith! No file upload to servers, 100% private: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Determine file extension cleanly
  const ext = fileName.split('.').pop()?.toUpperCase() || fileType.toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Indicator Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-emerald-500 to-indigo-600" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Processed Offline
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-6 pb-6 overflow-y-auto space-y-4">
          {/* Title & Description */}
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Elevated Document / File Preview Showcase */}
          {previewUrl ? (
            <div className="space-y-1.5">
              <div className="rounded-2xl border border-slate-200/90 bg-slate-100/70 p-3 sm:p-4 flex items-center justify-center min-h-[180px] max-h-[260px] overflow-hidden shadow-inner">
                {/* Physical Document Page Representation */}
                <div className="relative bg-white rounded-lg shadow-md border border-slate-200/80 max-h-[230px] overflow-hidden flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Document Preview"
                    className="max-h-[220px] w-auto max-w-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Document Card */
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 truncate" title={fileName}>
                  {fileName}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{ext} Document</span>
                  {fileSizeKb && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{fileSizeKb} KB</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* File Details Bar with Protected Truncation */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-700 font-black text-[11px] flex items-center justify-center shrink-0">
                {ext}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 truncate" title={fileName}>
                  {fileName}
                </p>
                <p className="text-[10px] text-slate-500">
                  {fileSizeKb ? `${fileSizeKb} KB • ` : ''}Verified &amp; Flattened
                </p>
              </div>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              0 Bytes Uploaded
            </span>
          </div>

          {/* Clean Gratitude / Trust Note */}
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-[11px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <p className="leading-tight">
              <strong>Thank you for using FileZenith.</strong> Free, unlimited document tools engineered with uncompromising privacy.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Download CTA — Clean Label That Never Wraps Awkwardly */}
            <a
              href={downloadUrl}
              download={fileName}
              onClick={() => {
                toast.success('Download started! Thank you for using FileZenith.');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {ext} File</span>
            </a>

            {/* Sharing & Utilities Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Process Another */}
            {onReset && (
              <button
                onClick={() => {
                  onClose();
                  onReset();
                }}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Process Another Document</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
