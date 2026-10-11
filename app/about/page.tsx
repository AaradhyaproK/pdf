import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Code2,
  Award,
  ExternalLink,
  BookOpen,
  Lock,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About FileZenith - Founder, Team, Mission & Security Standards',
  description:
    'Meet the team behind FileZenith. Built by Aaradhya Pathak at Snab in Nashik, India. Learn how our zero-server WebAssembly architecture protects your document privacy.',
  alternates: {
    canonical: 'https://www.filezenith.com/about',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About FileZenith',
    description:
      'FileZenith is a free, 100% private in-browser document and image processing studio engineered by Snab.',
    url: 'https://www.filezenith.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'FileZenith',
      url: 'https://www.filezenith.com',
      logo: 'https://www.filezenith.com/filezenith-logo.png',
      founder: {
        '@type': 'Person',
        name: 'Aaradhya Pathak',
        jobTitle: 'Founder & Principal Software Engineer',
        url: 'https://aaradhyadev.vercel.app',
        email: 'aaradhya1774@gmail.com',
        sameAs: [
          'https://aaradhyadev.vercel.app',
          'https://www.linkedin.com/in/aaradhyapathak17',
          'https://x.com/aaradhya1774',
          'https://github.com/AaradhyaproK',
        ],
      },
      parentOrganization: {
        '@type': 'Organization',
        name: 'Snab',
        url: 'https://www.snab.co.in',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Nashik',
          addressRegion: 'Maharashtra',
          postalCode: '422005',
          addressCountry: 'IN',
        },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-14 space-y-8 sm:space-y-14 text-slate-700">
      {/* Schema.org Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <section className="space-y-4 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-2xs text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200/80">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Our Vision & Human Accountability</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Engineering the Zero-Server Document Revolution
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          FileZenith was founded to solve a massive industry flaw: uploading confidential contracts, medical records, marksheets, and identity photos to unknown remote cloud servers just to compress a file or convert an image.
        </p>
      </section>

      {/* Founder & Lead Developer E-E-A-T Spotlight */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 p-1 shrink-0 shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-white font-black text-3xl">
              AP
            </div>
          </div>
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Builder & Maintainer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Aaradhya Pathak
              </h2>
              <p className="text-xs sm:text-sm font-bold text-indigo-600">
                Founder & Lead Software Architect at Snab
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Aaradhya is a software engineer based in Nashik, Maharashtra, India. Frustrated by online converters that gatekeep file processing behind subscription paywalls or secretly store sensitive citizen files on third-party cloud buckets, he architected FileZenith from the ground up using client-side WebAssembly, HTML5 Canvas, and modern Web Crypto standards.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-bold">
              {/* Portfolio */}
              <a
                href="https://aaradhyadev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all hover:scale-105 shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>aaradhyadev.vercel.app</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/aaradhyapathak17"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/30 transition-all hover:scale-105 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/aaradhya1774"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-all hover:scale-105 shadow-2xs"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>@aaradhya1774</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/AaradhyaproK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all hover:scale-105 shadow-2xs"
              >
                <Code2 className="w-3.5 h-3.5 text-slate-700" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              {/* Personal Email */}
              <a
                href="mailto:aaradhya1774@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all hover:scale-105 shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-rose-600" />
                <span>aaradhya1774@gmail.com</span>
              </a>

              {/* Snab Studio */}
              <a
                href="https://www.snab.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all hover:scale-105 shadow-2xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Snab Studio</span>
                <ExternalLink className="w-3 h-3 text-amber-500" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Principles Grid */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 text-center">
          Our Core Engineering Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">100% Zero-Server Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Every document compression, format conversion, and encryption algorithm runs purely inside your browser sandbox via WebAssembly. Zero bytes of your files are ever transmitted to our servers.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">Zero Artificial Limits</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We reject the predatory model of limiting users to 2 files per day before demanding credit card subscriptions. FileZenith is built to be genuinely unlimited, free, and watermark-free.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">Sub-Second Local Compute</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              By removing server upload bottlenecks, processing 100MB documents takes milliseconds. Your own device CPU handles the crunching with zero network queue delays.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Standards & Algorithmic Rigor */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-600">
          <BookOpen className="w-4 h-4 text-rose-600" />
          <span>Quality & Algorithmic Rigor</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          How We Maintain Presets & Calculation Accuracy
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          <p>
            Our examination presets (such as RRB Photo Resizer, SSC Photo Resizer, UPSC, and IBPS guidelines) are manually cross-referenced against official recruitment gazette notifications published by the government boards.
          </p>
          <p>
            When state electricity boards update their tariff slabs or tax authorities update income tax rebate rules, our team updates the underlying calculation formulas to ensure zero discrepancies for users.
          </p>
        </div>
      </section>

      {/* Corporate Identity & Physical Address */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-5 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-indigo-300 uppercase tracking-wider bg-indigo-500/20 px-3 py-1 rounded-full w-fit border border-indigo-500/30">
          <span>Corporate & Legal Entity</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
          Snab Software Engineering Studio
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          FileZenith is proudly engineered and operated under <strong>Snab</strong>, an independent digital software studio dedicated to building high-performance, privacy-centric web applications.
        </p>
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 font-semibold border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Nashik, Maharashtra, India (PIN: 422005)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <a href="mailto:hello@snab.co.in" className="hover:text-white transition-colors">Official Inquiries: hello@snab.co.in</a>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-center space-y-3.5 shadow-2xs">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Have feedback or need a custom preset?
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
          We actively review feature requests and bug reports from our global community.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs shadow-xs border border-slate-200/80 transition-all active:scale-95"
          >
            <span>Explore All 50+ Tools</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
