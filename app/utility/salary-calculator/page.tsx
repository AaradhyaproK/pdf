'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateTakeHomeSalary } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Briefcase, IndianRupee, Share2, Copy, Check, ShieldCheck } from 'lucide-react';

export default function SalaryCalculatorPage() {
  const [ctc, setCtc] = useState(1200000);
  const [bonus, setBonus] = useState(100000);
  const [pfOpted, setPfOpted] = useState(true);
  const [copied, setCopied] = useState(false);

  const salaryData = useMemo(() => {
    return calculateTakeHomeSalary(ctc, bonus, pfOpted);
  }, [ctc, bonus, pfOpted]);

  const handleShareWhatsApp = () => {
    const msg = `💼 Salary Breakup: CTC = ₹${ctc.toLocaleString('en-IN')}/yr | Estimated Monthly Take-Home = ₹${salaryData.monthlyTakeHome.toLocaleString('en-IN')}/mo after EPF (₹${salaryData.monthlyPFEmployee}), PT (₹${salaryData.monthlyProfessionalTax}), & TDS (₹${salaryData.monthlyEstTDS}). Calculate your salary in-hand at FileZenith: https://www.filezenith.com/utility/salary-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `CTC to In-Hand Salary Breakup:\nAnnual CTC: ₹${ctc.toLocaleString('en-IN')}\nMonthly Take-Home: ₹${salaryData.monthlyTakeHome.toLocaleString('en-IN')}\nMonthly Gross: ₹${salaryData.monthlyGross.toLocaleString('en-IN')}\nMonthly Employee PF: ₹${salaryData.monthlyPFEmployee.toLocaleString('en-IN')}\nMonthly Professional Tax: ₹${salaryData.monthlyProfessionalTax.toLocaleString('en-IN')}\nEstimated Monthly TDS: ₹${salaryData.monthlyEstTDS.toLocaleString('en-IN')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied salary breakdown to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/salary-calculator"
      title="CTC to In-Hand Take-Home Salary Calculator"
      subtitle="Calculate monthly in-hand salary credited to your bank account after EPF, Professional Tax, and TDS deductions."
      badgeText="Salary Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Input Form */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Annual CTC (Package Offer Amount)</label>
              <input
                type="number"
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Annual Variable Bonus / Incentive</label>
              <input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pfOpt"
              checked={pfOpted}
              onChange={(e) => setPfOpted(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="pfOpt" className="text-xs font-bold text-slate-700 cursor-pointer">
              Deduct Employee Provident Fund (EPF 12% of Basic)
            </label>
          </div>
        </div>

        {/* Monthly Credit Card */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-800/50 pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">Estimated Monthly In-Hand Salary</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                ₹{salaryData.monthlyTakeHome.toLocaleString('en-IN')}<span className="text-sm font-semibold text-slate-400">/mo</span>
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Breakup'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" /> Share WhatsApp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Monthly Gross</p>
              <p className="text-lg font-black text-white mt-1">₹{salaryData.monthlyGross.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">EPF Deduction</p>
              <p className="text-lg font-black text-amber-400 mt-1">₹{salaryData.monthlyPFEmployee.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Professional Tax</p>
              <p className="text-lg font-black text-amber-400 mt-1">₹{salaryData.monthlyProfessionalTax.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Est. Monthly TDS</p>
              <p className="text-lg font-black text-rose-400 mt-1">₹{salaryData.monthlyEstTDS.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
