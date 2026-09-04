import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  ServerOff,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
  FileText,
  ArrowRight,
  EyeOff,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '100% Secure Serverless Document Processing - FileZenith',
  description:
    'Learn how FileZenith processes your PDFs and images 100% serverless directly in your browser. Zero cloud uploads, absolute data privacy, and instant speed.',
  alternates: {
    canonical: 'https://www.filezenith.com/security',
  },
};

const SECURITY_PILLARS = [
  {
    icon: ServerOff,
    title: 'Zero Cloud Server Uploads',
    badge: '0 Bytes Transferred',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    accentBorder: 'border-emerald-200/80',
    description:
      'Your PDF is processed directly in your browser, helping keep your document processing private. Files stay inside your device memory and are never uploaded over the internet.',
  },
  {
    icon: EyeOff,
    title: 'No Data Logging or Storage',
    badge: '100% Confidential',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    accentBorder: 'border-indigo-200/80',
    description:
      'We do not inspect, index, or log your document content. Contracts, bank statements, tax forms, and passport scans remain 100% strictly yours.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic Local Memory Cleanup',
    badge: 'Instant RAM Clearance',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
    accentBorder: 'border-rose-200/80',
    description:
      'All temporary memory allocations are instantly cleared when your file conversion finishes or when you close your web browser tab.',
  },
  {
    icon: Zap,
    title: 'Offline Browser Capability',
    badge: 'No Wi-Fi Required',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    accentBorder: 'border-amber-200/80',
    description:
      'Once loaded, FileZenith operates even without an active internet connection. Work on sensitive files in airplane mode with full security.',
  },
];

const COMPARISON_ITEMS = [
  {
    feature: 'File Transfer Location',
    filezenith: 'Stays 100% on your local device RAM',
    traditional: 'Uploaded over HTTP/HTTPS to remote cloud servers',
  },
  {
    feature: 'Server Storage Risk',
    filezenith: 'Zero server storage (No servers exist to hack)',
    traditional: 'Files stored temporarily on third-party cloud disks',
  },
  {
    feature: 'Third-Party Data Access',
    filezenith: 'No third party or employee can ever see your file',
    traditional: 'Remote server admins & cloud providers could access files',
  },
  {
    feature: 'Processing Speed',
    filezenith: 'Instantaneous local execution with zero network latency',
    traditional: 'Slowed down by file upload & download network queues',
  },
  {
    feature: 'Offline Capability',
    filezenith: 'Works 100% offline without cellular data or Wi-Fi',
    traditional: 'Fails completely without active internet connection',
  },
];

const SECURITY_FAQS = [
  {
    q: 'What does "100% Secure Serverless" mean for my PDF files?',
    a: 'It means your PDF is processed directly in your browser, helping keep your document processing private. Unlike traditional cloud converters that receive your file on a remote server, FileZenith runs all file processing algorithms inside your web browser locally. No copy of your document is ever sent across the web or saved on external servers.',
  },
  {
    q: 'Can FileZenith employees or third parties view my uploaded documents?',
    a: 'No. Because your documents are never uploaded to any server, it is physically impossible for us or anyone else to view, copy, or read your files.',
  },
  {
    q: 'Is FileZenith safe for sensitive legal contracts, medical reports, and tax documents?',
    a: 'Yes! FileZenith is designed specifically for security-conscious professionals, healthcare workers, accountants, and students. Since your confidential files never leave your computer or phone, you retain 100% data custody and compliance.',
  },
  {
    q: 'Do I need an account or subscription to access serverless file tools?',
    a: 'No sign-up or registration is required. All 50+ PDF, image, and utility tools on FileZenith are 100% free with unlimited usage.',
  },
];

export default function SecurityPage() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-8 sm:space-y-12 text-slate-700">
      {/* Hero Banner */}
      <section className="space-y-4 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Secure Serverless Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          How FileZenith Keeps Your Documents <span className="text-emerald-600">100% Private</span>
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl mx-auto">
          Your PDF is processed directly in your browser, helping keep your document processing private. Zero server uploads, zero privacy risk.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            0 Bytes Cloud Upload
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            No Registration Needed
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Client-Side Browser Execution
          </span>
        </div>
      </section>

      {/* Security Pillars Grid */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            4 Core Security Guarantees
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Engineered from the ground up to protect your confidential files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {SECURITY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-white border ${pillar.accentBorder} shadow-2xs hover:shadow-md transition-all space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${pillar.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Visual Flow */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-3 py-1 rounded-full w-fit border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Serverless Workflow</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Traditional Cloud Upload vs. FileZenith Serverless
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            See how your document is handled differently on FileZenith compared to typical cloud-based converters.
          </p>
        </div>

        {/* Comparison Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Cloud Upload Flow */}
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/50 space-y-3">
            <h3 className="text-sm font-black text-rose-300 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Traditional Cloud Converters
            </h3>
            <ol className="text-xs text-rose-200/90 space-y-2 font-medium list-decimal list-inside">
              <li>You drag & drop your document onto the website.</li>
              <li>Your file is uploaded over the internet to a cloud server.</li>
              <li>The remote server processes your document on disk.</li>
              <li>You wait to download the converted file back to your PC.</li>
              <li>Potential security risk: files may persist in server backups.</li>
            </ol>
          </div>

          {/* FileZenith Serverless Flow */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 space-y-3">
            <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
              FileZenith 100% Serverless
            </h3>
            <ol className="text-xs text-emerald-200/90 space-y-2 font-medium list-decimal list-inside">
              <li>You select your file in your web browser.</li>
              <li>Your PDF is processed directly in your browser locally.</li>
              <li>Zero bytes are transmitted to any external server.</li>
              <li>Instant file output without waiting for upload/download.</li>
              <li>Local RAM is automatically cleared immediately upon completion.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Security Comparison Table */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            Detailed Security Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Comparing serverless browser-direct processing against legacy cloud PDF converters.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-black text-slate-900">Security Requirement</th>
                <th className="p-4 font-black text-emerald-700 bg-emerald-50/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  FileZenith Serverless
                </th>
                <th className="p-4 font-bold text-slate-500">Standard Cloud Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-4 font-extrabold text-slate-900">{item.feature}</td>
                  <td className="p-4 font-bold text-emerald-800 bg-emerald-50/20">{item.filezenith}</td>
                  <td className="p-4 text-slate-500 font-medium">{item.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security FAQs */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            Security & Privacy FAQs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Common questions about our 100% serverless browser processing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {SECURITY_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
            >
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-center space-y-4 shadow-2xs">
        <h3 className="text-lg sm:text-2xl font-black text-slate-900">
          Ready to experience 100% private document processing?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
          Your PDF is processed directly in your browser, helping keep your document processing private. Try all 50+ free tools now.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <span>Explore All Studio Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
