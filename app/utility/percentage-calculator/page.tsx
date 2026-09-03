'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculatePercentage } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Percent,
  TrendingUp,
  ShoppingBag,
  GraduationCap,
  Calculator,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function PercentageCalculatorPage() {
  const [activeTab, setActiveTab] = useState<'of' | 'change' | 'is_what' | 'discount' | 'marks'>('of');

  // Input states
  const [val1, setVal1] = useState<string>('15');
  const [val2, setVal2] = useState<string>('500');
  const [taxVal, setTaxVal] = useState<string>('5');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    const v3 = parseFloat(taxVal) || 0;
    return calculatePercentage(activeTab, v1, v2, v3);
  }, [activeTab, val1, val2, taxVal]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.explanation}`);
      setCopied(true);
      toast.success('Copied calculation to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/percentage-calculator"
      title="All-in-One Online Percentage Calculator"
      subtitle="Calculate percentage of a number, percentage increase/decrease, shopping discounts with tax, and student exam marks with letter grades."
      badgeText="Real-Time Percent Math"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Mode Tab Switches */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar flex-nowrap sm:flex-wrap">
          {[
            { id: 'of', label: 'What is X% of Y?', icon: Percent },
            { id: 'change', label: '% Increase / Decrease', icon: TrendingUp },
            { id: 'is_what', label: 'X is what % of Y?', icon: Calculator },
            { id: 'discount', label: 'Shopping Discount', icon: ShoppingBag },
            { id: 'marks', label: 'Exam Marks %', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'of') { setVal1('15'); setVal2('500'); }
                  else if (tab.id === 'change') { setVal1('500'); setVal2('750'); }
                  else if (tab.id === 'is_what') { setVal1('45'); setVal2('200'); }
                  else if (tab.id === 'discount') { setVal1('1200'); setVal2('20'); setTaxVal('5'); }
                  else if (tab.id === 'marks') { setVal1('432'); setVal2('500'); }
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Calculator Workspace Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="space-y-4">
            {/* Mode 1: What is X% of Y? */}
            {activeTab === 'of' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-rose-600" /> Calculate Percentage of a Value
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Percentage (X %)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Total Number (Y)</label>
                    <input
                      type="number"
                      value={val2}
                      onChange={(e) => setVal2(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: % Increase / Decrease */}
            {activeTab === 'change' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Calculate Percentage Increase or Decrease
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Initial Value (From X)</label>
                    <input
                      type="number"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Final Value (To Y)</label>
                    <input
                      type="number"
                      value={val2}
                      onChange={(e) => setVal2(e.target.value)}
                      placeholder="e.g. 750"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: X is what % of Y? */}
            {activeTab === 'is_what' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" /> What Percentage is X of Y?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Part Value (X)</label>
                    <input
                      type="number"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Total Value (Y)</label>
                    <input
                      type="number"
                      value={val2}
                      onChange={(e) => setVal2(e.target.value)}
                      placeholder="e.g. 200"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 4: Shopping Discount */}
            {activeTab === 'discount' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-500" /> Shopping Discount & Savings Calculator
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Original Price (₹ / $)</label>
                    <input
                      type="number"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      placeholder="e.g. 1200"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Discount (% Off)</label>
                    <input
                      type="number"
                      value={val2}
                      onChange={(e) => setVal2(e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Sales Tax (% GST / VAT)</label>
                    <input
                      type="number"
                      value={taxVal}
                      onChange={(e) => setTaxVal(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 5: Exam Marks */}
            {activeTab === 'marks' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" /> Student Exam Marks & Grade Calculator
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      placeholder="e.g. 432"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Total Maximum Marks</label>
                    <input
                      type="number"
                      value={val2}
                      onChange={(e) => setVal2(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result Card Output */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Calculation Result
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {result.formatted}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {result.explanation}
            </p>

            {/* Additional details for discount / marks */}
            {result.details && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-800 text-xs">
                {Object.entries(result.details).map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block truncate">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <strong className="text-sm font-black text-white">{String(val)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
