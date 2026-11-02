import Link from 'next/link';
import {
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Stamp,
  GraduationCap,
  CreditCard,
  UserCheck,
} from 'lucide-react';

export function HomepageCSCBanner() {
  const QUICK_TOOLS = [
    {
      name: 'Aadhaar Card Print (A4 & PVC)',
      slug: '/tools/aadhaar-card-print',
      badge: 'A4 & PVC',
      icon: Printer,
    },
    {
      name: 'PAN Card Photo 213x213',
      slug: '/tools/pan-card-photo-resizer',
      badge: 'NSDL / UTI',
      icon: UserCheck,
    },
    {
      name: 'Combine Marksheets (<500KB)',
      slug: '/pdf/combine-marksheets',
      badge: '<500KB',
      icon: GraduationCap,
    },
    {
      name: 'Signature Resizer 10-20KB',
      slug: '/tools/signature-resizer-10-to-20kb',
      badge: '10-20KB',
      icon: Stamp,
    },
    {
      name: 'Photo Name & Date Stamp',
      slug: '/tools/photo-name-date-generator',
      badge: 'DOP Stamp',
      icon: UserCheck,
    },
    {
      name: 'Free Invoice & Rent Receipt',
      slug: '/utility/invoice-generator',
      badge: 'HRA / Bill',
      icon: FileCheck,
    },
  ];

  return (
    <section
      aria-label="CSC & Cyber Cafe Fast Toolkit Spotlight"
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-indigo-500/10 border-2 border-amber-300/80 p-5 sm:p-8 lg:p-10 shadow-lg shadow-amber-500/5">
        {/* Ambient background glow accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                  <Printer className="w-3.5 h-3.5" />
                  CSC VLE &amp; Cyber Cafe Workstation
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300/80 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Private In-Browser
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Fast Daily Toolkit for <span className="text-amber-800">CSC Centers</span>, <span className="text-indigo-900">Jan Seva Kendras</span> &amp; Cyber Cafes
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Crop e-Aadhaar for 1-click A4 &amp; PVC card printing, resize PAN photos to exact 213×213 px, merge customer marksheets strictly under 500KB, and clean signatures to 10–20KB without Photoshop.
              </p>
            </div>

            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
              <Link
                href="/csc-cyber-cafe-tools"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Open CSC &amp; Cafe Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-[10px] text-slate-500 font-semibold text-right">
                12+ Pre-Calibrated Sarkari Presets
              </span>
            </div>
          </div>

          {/* Quick-Access Tools Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            {QUICK_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="group/item p-3 rounded-2xl bg-white hover:bg-amber-50/80 border border-amber-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-2.5 cursor-pointer active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      {tool.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover/item:text-amber-800 transition-colors line-clamp-2 leading-tight">
                      {tool.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Trust Guarantee Highlights */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-200/80 text-[11px] sm:text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Zero Customer Data Stored or Uploaded</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant Local Canvas (No Photoshop Action Needed)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Free for Shop Owners &amp; Students</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
