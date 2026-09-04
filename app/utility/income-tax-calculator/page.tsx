'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateIncomeTax } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { IndianRupee, Sparkles, CheckCircle2, ShieldCheck, Share2, Copy, ArrowRight } from 'lucide-react';

export default function IncomeTaxCalculatorPage() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [deductions80D, setDeductions80D] = useState(25000);
  const [hra, setHra] = useState(100000);
  const [copied, setCopied] = useState(false);

  const taxData = useMemo(() => {
    return calculateIncomeTax(grossIncome, deductions80C, deductions80D, hra);
  }, [grossIncome, deductions80C, deductions80D, hra]);

  const handleShareWhatsApp = () => {
    const msg = `📊 Income Tax Comparison (FY 2024-25 / FY 2025-26):\nGross Salary: ₹${grossIncome.toLocaleString('en-IN')}\nNew Regime Tax: ₹${taxData.totalTaxNew.toLocaleString('en-IN')}\nOld Regime Tax: ₹${taxData.totalTaxOld.toLocaleString('en-IN')}\n💡 ${taxData.recommendedRegime === 'NEW' ? 'New Tax Regime saves you ₹' + taxData.taxSavings.toLocaleString('en-IN') : 'Old Tax Regime saves you ₹' + taxData.taxSavings.toLocaleString('en-IN')}\nCalculate your tax savings on FileZenith: https://www.filezenith.com/utility/income-tax-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <ToolLayout
      slug="/utility/income-tax-calculator"
      title="Income Tax Calculator (Old vs New Tax Regime FY 2024-25 & FY 2025-26)"
      subtitle="Compare Income Tax liability side-by-side under Old Regime vs New Regime. Calculate deductions and maximize your tax savings."
      badgeText="Tax Season"
    >
      <div className="space-y-6 text-slate-900">
        {/* Income & Deductions Input Panel */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider">Salary & Tax Deduction Inputs</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Gross Annual Income (₹ CTC)</label>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Section 80C Deductions (PPF, ELSS, EPF, LIC - Max 1.5L)</label>
              <input
                type="number"
                value={deductions80C}
                onChange={(e) => setDeductions80C(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Section 80D Health Insurance (Mediclaim)</label>
              <input
                type="number"
                value={deductions80D}
                onChange={(e) => setDeductions80D(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">HRA Exemption / Home Loan Interest</label>
              <input
                type="number"
                value={hra}
                onChange={(e) => setHra(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Highlight Recommendation */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-100">Recommended Tax Regime</p>
              <h3 className="text-xl font-black">
                {taxData.recommendedRegime === 'NEW' ? 'New Tax Regime is Better!' : 'Old Tax Regime is Better!'}
              </h3>
              <p className="text-xs font-semibold text-emerald-100 mt-0.5">
                Saves you ₹{taxData.taxSavings.toLocaleString('en-IN')} in total annual tax.
              </p>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-100 transition shrink-0"
          >
            <Share2 className="w-4 h-4 text-emerald-600" /> Share Tax Breakdown
          </button>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Tax Regime Card */}
          <div className={`p-6 rounded-3xl border ${taxData.recommendedRegime === 'NEW' ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500' : 'bg-white border-slate-200'} space-y-4 shadow-md`}>
            <div className="flex justify-between items-center">
              <h4 className="text-base font-black text-slate-900">New Tax Regime (FY 2024-25)</h4>
              {taxData.recommendedRegime === 'NEW' && (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-full">Lowest Tax</span>
              )}
            </div>

            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b pb-1.5">
                <span>Gross Income</span>
                <span className="font-bold">₹{taxData.grossIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Standard Deduction</span>
                <span className="font-bold text-emerald-700">-₹75,000</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Taxable Income</span>
                <span className="font-bold">₹{taxData.taxableIncomeNew.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Health & Edu Cess (4%)</span>
                <span className="font-bold">₹{taxData.cessNew.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500">Total Tax Payable</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">₹{taxData.totalTaxNew.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Old Tax Regime Card */}
          <div className={`p-6 rounded-3xl border ${taxData.recommendedRegime === 'OLD' ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500' : 'bg-white border-slate-200'} space-y-4 shadow-md`}>
            <div className="flex justify-between items-center">
              <h4 className="text-base font-black text-slate-900">Old Tax Regime</h4>
              {taxData.recommendedRegime === 'OLD' && (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-full">Lowest Tax</span>
              )}
            </div>

            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b pb-1.5">
                <span>Gross Income</span>
                <span className="font-bold">₹{taxData.grossIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Total Deductions (80C, 80D, HRA)</span>
                <span className="font-bold text-emerald-700">-₹{taxData.totalDeductionsOld.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Taxable Income</span>
                <span className="font-bold">₹{taxData.taxableIncomeOld.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Health & Edu Cess (4%)</span>
                <span className="font-bold">₹{taxData.cessOld.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500">Total Tax Payable</p>
              <p className="text-3xl font-black text-slate-900 mt-1">₹{taxData.totalTaxOld.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
