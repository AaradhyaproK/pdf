import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Zap, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - FileZenith',
  description: 'Learn about FileZenith, the private client-side online file studio engineered with WebAssembly technology.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-700">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200/80">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>About FileZenith</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Next-Generation Private Online Document Studio
        </h1>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          FileZenith was built to revolutionize online file processing by putting absolute data privacy and instantaneous speed back into the hands of users.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">100% Data Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike traditional PDF tools that upload your sensitive files to cloud servers, FileZenith processes documents entirely inside your browser using WebAssembly.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero-Latency Speed</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating network upload and download bottlenecks allows FileZenith tools to compress, edit, and convert documents up to 10x faster.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Client-Side Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Powered by modern WebAssembly binaries, canvas technology, and offline progressive web app storage.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
          <span>Parent Developer Company: Snab</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Our Mission</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          FileZenith is developed and operated by <strong>Snab</strong>, a software engineering studio based in Nashik, Maharashtra, India (422005).
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          In an era where personal data leaks and cloud security breaches are increasingly common, file utility tools should not demand access to your confidential contracts, bank statements, ID photos, or tax filings.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          FileZenith proves that web browsers are powerful enough to execute complex document manipulations locally. We are committed to keeping our 20+ file tools free, accessible, and completely private for everyone.
        </p>
      </section>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-center space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Ready to try FileZenith tools?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Explore our suite of 20+ private PDF and image tools directly in your browser.
        </p>
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
