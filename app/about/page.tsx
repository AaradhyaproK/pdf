import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Zap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - FileZenith',
  description: 'Learn about FileZenith, where your PDF is processed directly in your browser, keeping your document processing 100% private.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-6 sm:space-y-10 text-slate-700">
      {/* Header Banner */}
      <div className="space-y-3 p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200/80">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>About FileZenith App</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Next-Generation Private Online Document Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
          FileZenith was built to revolutionize online file processing by putting absolute data privacy and instantaneous speed back into the hands of users.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">100% Data Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Unlike traditional PDF tools that upload sensitive files to cloud servers, your PDF is processed directly in your browser, helping keep your document processing private.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">Instant Local Speed</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Eliminating network upload and download bottlenecks allows FileZenith tools to compress, edit, and convert documents instantly on your device.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">100% Secure Serverless</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Your files are processed directly inside your web browser, giving you instant results without any file uploads or cloud risks.
          </p>
        </div>
      </div>

      {/* Mission Statement Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-indigo-300 uppercase tracking-wider bg-indigo-500/20 px-3 py-1 rounded-full w-fit border border-indigo-500/30">
          <span>Parent Developer Company: Snab</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Our Mission</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          FileZenith is developed and operated by <strong>Snab</strong>, a software engineering studio based in Nashik, Maharashtra, India (422005).
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          In an era where personal data leaks and cloud security breaches are increasingly common, file utility tools should not demand access to your confidential contracts, bank statements, ID photos, or tax filings.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          FileZenith proves that web browsers are powerful enough to execute complex document manipulations locally. We are committed to keeping our 20+ file tools free, accessible, and completely private for everyone.
        </p>
      </section>

      {/* CTA Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-center space-y-3.5 shadow-2xs">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Ready to try FileZenith tools?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
          Explore our suite of 20+ private PDF and image tools directly in your browser.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

