'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Cpu, Server, X } from 'lucide-react';

export function PrivacyBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs"
        title="Verified Zero-Server Privacy Guarantee"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span>100% Client-Side Private</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Zero-Server Privacy Guarantee
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Your files and documents never leave your browser
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3 items-start p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <Cpu className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Browser WebAssembly & Web Workers
                  </span>
                  All image compression, PDF manipulation, and OCR text recognition run directly inside your computer&apos;s RAM and CPU.
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <Server className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Zero Backend File Uploads
                  </span>
                  We do not host or receive your PDFs, photos, or text payload on remote servers. Internet disconnect? OmniTool still works offline!
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
