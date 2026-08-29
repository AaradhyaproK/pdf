'use client';

import { useState } from 'react';
import Script from 'next/script';
import { SEO_REGISTRY, generateToolSchemas } from '@/lib/seo-config';
import { ChevronDown, CheckCircle2, Cpu } from 'lucide-react';

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

  return (
    <div className="w-full space-y-12 mt-16 pt-12 border-t border-slate-200 text-slate-700">
      {/* Inject JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <Script
          key={idx}
          id={`json-ld-${slug.replace(/\//g, '-')}-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* How-To Step-by-Step Guide */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How to Use {tool.title}
          </h2>
          <p className="text-sm text-slate-500">
            Follow these 3 simple steps to complete your task directly in your browser with zero server uploads.
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
              Why Choose OmniTool Client-Side Engine?
            </h2>
            <p className="text-sm text-slate-500">
              See how OmniTool browser WebAssembly compares against cloud PDF converters.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 font-bold text-slate-900">Feature</th>
                  <th className="p-4 font-bold text-indigo-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    OmniTool Suite
                  </th>
                  <th className="p-4 font-bold text-slate-500">
                    Standard Cloud Tools
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
          Unlike traditional web tools that upload your sensitive documents to remote servers over the internet, OmniTool Suite uses compiled <strong className="text-indigo-900 font-bold">WebAssembly (Wasm)</strong> binaries and HTML5 Canvas APIs inside background Web Workers. This guarantees absolute data privacy, instantaneous zero-latency conversions, and offline capability.
        </p>
      </section>

      {/* Frequently Asked Questions */}
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
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
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
    </div>
  );
}
