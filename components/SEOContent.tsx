'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { SEO_REGISTRY, generateToolSchemas } from '@/lib/seo-config';
import { ChevronDown, CheckCircle2, Cpu, ArrowRight, Sparkles, FileText, Image as ImageIcon, Wrench } from 'lucide-react';

export interface SEOContentProps {
  slug: string;
}

export function SEOContent({ slug }: SEOContentProps) {
  const tool = SEO_REGISTRY[slug];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!tool) return null;

  const schemas = generateToolSchemas(slug);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Internal Link Recommendations per category
  const relatedTools =
    tool.category === 'pdf'
      ? [
          { name: 'Compress PDF Online (Under 200KB)', slug: '/pdf/compress-to-200kb', desc: 'Reduce PDF file size for portal submissions.' },
          { name: 'Merge PDF Files Free', slug: '/pdf/merge', desc: 'Combine multiple PDF documents into one.' },
          { name: 'Convert PDF to Image (JPG/PNG)', slug: '/pdf/to-image', desc: 'Save PDF pages as high-resolution images.' },
          { name: 'Interactive PDF Editor', slug: '/pdf/edit', desc: 'Add text, whiteout content, and draw annotations.' },
        ]
      : tool.category === 'image'
      ? [
          { name: 'Convert PNG to JPG Online', slug: '/image/png-to-jpg', desc: 'Bulk convert PNG images to JPG with custom quality.' },
          { name: 'Turn Pics to PDF Document', slug: '/image/pics-to-pdf', desc: 'Combine photos, scans, and receipts into PDF.' },
          { name: 'PNG to PDF Converter', slug: '/image/png-to-pdf', desc: 'Save PNG pictures directly as structured PDF.' },
          { name: 'AI Image Background Remover', slug: '/image/remove-background', desc: 'Isolate subjects and export transparent PNG cutouts.' },
        ]
      : [
          { name: 'Free Vector QR Code Generator', slug: '/utility/qr-generator', desc: 'Create SVG/PNG QR codes with custom logos.' },
          { name: 'Word Counter & Density Analyzer', slug: '/utility/word-counter', desc: 'Count words, characters, reading speed, and SEO keywords.' },
          { name: 'JSON Formatter & CSV Converter', slug: '/utility/json-formatter', desc: 'Validate, format, and convert JSON arrays to CSV/YAML.' },
        ];

  return (
    <div className="w-full space-y-6 sm:space-y-10 mt-6 sm:mt-12 pt-6 sm:pt-10 border-t border-slate-200/80 text-slate-700">
      {/* Inject Structured Data JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <Script
          key={idx}
          id={`json-ld-${slug.replace(/\//g, '-')}-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Tool Overview & Privacy Benefits Card */}
      <section className="space-y-3 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-base sm:text-2xl font-black text-slate-900">
            About {tool.title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {tool.description} FileZenith provides a 100% free, browser-native solution engineered specifically for office professionals, students, researchers, and freelancers who demand maximum document processing speed and absolute data privacy.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Unlike traditional online file converters that require you to upload confidential documents to remote cloud servers, FileZenith processes every document locally using client-side WebAssembly binaries inside your web browser’s memory. This means your files never leave your computer or phone, eliminating all cybersecurity risks while delivering zero-latency performance with no daily file conversion caps.
        </p>
      </section>

      {/* How-To Step-by-Step Guide (Mobile App Timeline Cards) */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            How to Use {tool.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Follow these 3 simple steps to complete your task directly in your browser with zero server file uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {tool.howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-xs">
                  Step {idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-400">100% Free</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      {tool.comparisonTable && (
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Why Choose FileZenith Client-Side Engine?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              See how FileZenith browser WebAssembly compares against standard cloud PDF converters.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 sm:p-4 font-black text-slate-900">Feature</th>
                  <th className="p-3 sm:p-4 font-black text-indigo-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    FileZenith Engine
                  </th>
                  <th className="p-3 sm:p-4 font-bold text-slate-500">
                    Standard Cloud Converters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tool.comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-3 sm:p-4 font-extrabold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-emerald-700 bg-emerald-50/30">
                      {row.omnitool}
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500 font-medium">
                      {row.standardCloud}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Technical Explanation - Dark App Security Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-xl font-black text-white">100% Client-Side Browser Architecture</h3>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            Wasm Engine
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Unlike traditional web tools that upload your sensitive documents to remote servers over the internet, FileZenith uses compiled <strong className="text-white font-black">WebAssembly (Wasm)</strong> binaries and HTML5 Canvas APIs inside background Web Workers. This guarantees absolute data privacy, instantaneous zero-latency conversions, and offline capability.
        </p>
      </section>

      {/* Frequently Asked Questions (People Also Ask Targeted) */}
      <section className="space-y-4 sm:space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Everything you need to know about {tool.title} privacy, speed, and limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-2xs'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50/60'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 sm:p-5 flex items-center justify-between text-left gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`text-xs sm:text-sm font-black shrink-0 ${isOpen ? 'text-indigo-600' : 'text-slate-400'}`}>
                      Q{idx + 1}.
                    </span>
                    <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 border-t border-indigo-100/60 animate-in fade-in duration-200">
                    <div className="pl-3.5 sm:pl-5 border-l-2 border-indigo-400/80">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Tools Internal Links Section */}
      <section className="space-y-4 sm:space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-2xl font-black text-slate-900">
            Explore Related FileZenith Tools
          </h2>
          <Link href="/" className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {relatedTools.map((rel, idx) => (
            <Link
              key={idx}
              href={rel.slug}
              className="p-3.5 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 active:scale-[0.99]"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-black text-indigo-700 group-hover:underline block leading-snug">
                  {rel.name}
                </span>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {rel.desc}
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-black text-slate-400 group-hover:text-indigo-600">
                <span>Use Tool Now &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
