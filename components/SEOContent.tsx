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
    <div className="w-full space-y-12 mt-16 pt-12 border-t border-slate-200 text-slate-700">
      {/* Inject Structured Data JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <Script
          key={idx}
          id={`json-ld-${slug.replace(/\//g, '-')}-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 150+ Word Tool Overview & Benefits */}
      <section className="space-y-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            About {tool.title}
          </h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {tool.description} FileZenith provides a 100% free, browser-native solution engineered specifically for office professionals, students, researchers, and freelancers who demand maximum document processing speed and absolute data privacy.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Unlike traditional online file converters that require you to upload confidential documents to remote cloud servers, FileZenith processes every document locally using client-side WebAssembly binaries inside your web browser’s memory. This means your files never leave your computer or phone, eliminating all cybersecurity risks while delivering zero-latency performance with no daily file conversion caps.
        </p>
      </section>

      {/* How-To Step-by-Step Guide */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How to Use {tool.title}
          </h2>
          <p className="text-sm text-slate-500">
            Follow these 3 simple steps to complete your task directly in your browser with zero server file uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-base mb-4 border border-indigo-100">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      {tool.comparisonTable && (
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Choose FileZenith Client-Side Engine?
            </h2>
            <p className="text-sm text-slate-500">
              See how FileZenith browser WebAssembly compares against standard cloud PDF converters.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 font-bold text-slate-900">Feature</th>
                  <th className="p-4 font-bold text-indigo-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    FileZenith Engine
                  </th>
                  <th className="p-4 font-bold text-slate-500">
                    Standard Cloud Converters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tool.comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-4 font-semibold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="p-4 font-semibold text-emerald-700">
                      {row.omnitool}
                    </td>
                    <td className="p-4 text-slate-500">
                      {row.standardCloud}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Technical Explanation - Light Card */}
      <section className="bg-indigo-50/60 border border-indigo-100 text-slate-800 rounded-3xl p-8 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">100% Client-Side Browser Architecture</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Unlike traditional web tools that upload your sensitive documents to remote servers over the internet, FileZenith uses compiled <strong className="text-indigo-900 font-bold">WebAssembly (Wasm)</strong> binaries and HTML5 Canvas APIs inside background Web Workers. This guarantees absolute data privacy, instantaneous zero-latency conversions, and offline capability.
        </p>
      </section>

      {/* Frequently Asked Questions (People Also Ask Targeted) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about {tool.title} privacy, speed, and limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 text-slate-400 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Tools Internal Links Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Explore Related FileZenith Tools
          </h2>
          <Link href="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.map((rel, idx) => (
            <Link
              key={idx}
              href={rel.slug}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-indigo-700 group-hover:underline block">
                  {rel.name}
                </span>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {rel.desc}
                </p>
              </div>
              <div className="pt-3 flex items-center text-[11px] font-bold text-slate-400 group-hover:text-indigo-600">
                <span>Use Tool Now &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
