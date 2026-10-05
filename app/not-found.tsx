import Link from 'next/link';
import { Home, Search, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full text-center space-y-6 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-black border border-rose-200">
          <span>Error 404 • Page Not Found</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Lost in Space?
        </h1>

        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The page or tool you are looking for may have been moved, updated, or retired. Explore our 100% free, private PDF and image tools below.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/pdf-tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Browse PDF Tools</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side Private • FileZenith</span>
        </div>
      </div>
    </div>
  );
}
