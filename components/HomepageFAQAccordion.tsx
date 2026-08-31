'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export interface FAQItem {
  q: string;
  a: string;
}

export function HomepageFAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mb-8 sm:mb-16">
      <div className="p-4 sm:p-10 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 shadow-2xs">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
          <div className="p-2 sm:p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Everything you need to know about FileZenith privacy, zero-server architecture, and limits.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`text-xs sm:text-sm font-black shrink-0 ${isOpen ? 'text-rose-600' : 'text-slate-400'}`}>
                      Q{idx + 1}.
                    </span>
                    <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-rose-100 text-rose-700' : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-1 border-t border-rose-100/60 animate-in fade-in duration-200">
                    <div className="pl-6 sm:pl-7 border-l-2 border-rose-400/80">
                      {faq.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
