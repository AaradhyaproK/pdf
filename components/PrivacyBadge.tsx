'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Cpu, Server, X, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';

export function PrivacyBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] sm:text-xs font-black hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs shrink-0"
        title="100% Free • No Login Required • Zero Server Upload Privacy"
      >
        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse shrink-0" />
        <span className="hidden sm:inline">100% Free • No Login • Secure</span>
        <span className="sm:hidden">100% Free • Secure</span>
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
                  100% Free & Secure Privacy Guarantee
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Zero login, zero subscriptions, zero server file uploads
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-3 items-start p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">100% Free All Tools Forever</span>
                  No subscriptions, no hidden charges, no trial limits, and no credit card required.
                </div>
              </div>

              <div className="flex gap-3 items-start p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">No Account or Login Needed</span>
                  Start using any tool instantly without signing up or creating an account.
                </div>
              </div>

              <div className="flex gap-3 items-start p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                <Cpu className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">100% Client-Side Privacy</span>
                  All calculations, PDF edits, image conversions, and background removals process inside your browser memory.
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Got it, Continue Editing</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
