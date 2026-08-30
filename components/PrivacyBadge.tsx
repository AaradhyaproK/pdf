'use client';

import { ShieldCheck } from 'lucide-react';

export function PrivacyBadge() {
  return (
    <div
      className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] sm:text-xs font-black shadow-2xs shrink-0 select-none"
      title="100% Free • No Login Required • Zero Server Upload Privacy"
    >
      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse shrink-0" />
      <span className="hidden sm:inline">100% Free • No Login • Secure</span>
      <span className="sm:hidden">100% Free • Secure</span>
    </div>
  );
}

