'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateEMI } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Calculator, DollarSign, Calendar, Percent, Share2, Copy, PieChart, ShieldCheck, Check } from 'lucide-react';

export default function EMICalculatorPage() {
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [copied, setCopied] = useState(false);

  const emiData = useMemo(() => {
    return calculateEMI(amount, rate, tenureYears * 12);
  }, [amount, rate, tenureYears]);

  const handleShareWhatsApp = () => {
    const msg = `💰 Loan EMI Summary: Monthly EMI = ₹${emiData.monthlyEMI.toLocaleString('en-IN')}/mo | Loan Amount = ₹${emiData.principal.toLocaleString('en-IN')} | Total Interest = ₹${emiData.totalInterest.toLocaleString('en-IN')} (${rate}% for ${tenureYears} yrs). Calculate your loan EMI at FileZenith: https://www.filezenith.com/utility/emi-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `Loan EMI Details:\nMonthly EMI: ₹${emiData.monthlyEMI.toLocaleString('en-IN')}\nPrincipal Amount: ₹${emiData.principal.toLocaleString('en-IN')}\nTotal Interest: ₹${emiData.totalInterest.toLocaleString('en-IN')}\nTotal Repayment: ₹${emiData.totalPayment.toLocaleString('en-IN')}\nInterest Rate: ${rate}%\nTenure: ${tenureYears} Years (${tenureYears * 12} months)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied EMI summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy summary.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/emi-calculator"
      title="Home Loan, Car Loan & Personal Loan EMI Calculator"
      subtitle="Calculate exact monthly EMI repayments, interest payable, and total loan cost with visual amortization schedule."
      badgeText="Financial Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Controls & Inputs */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loan Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Loan Amount (Principal)</span>
                <span className="text-emerald-700 font-extrabold text-sm">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                aria-label="Loan Amount Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Interest Rate (% P.A.)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{rate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Interest Rate Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Loan Tenure (Years)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                aria-label="Loan Tenure Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">Monthly EMI Repayment</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                ₹{emiData.monthlyEMI.toLocaleString('en-IN')}<span className="text-sm font-semibold text-slate-400">/mo</span>
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" /> Share WhatsApp
              </button>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Principal Loan Amount</p>
              <p className="text-xl font-black text-slate-100 mt-1">₹{emiData.principal.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Total Interest Payable</p>
              <p className="text-xl font-black text-amber-400 mt-1">₹{emiData.totalInterest.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Total Payment (Principal + Interest)</p>
              <p className="text-xl font-black text-emerald-400 mt-1">₹{emiData.totalPayment.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" /> Yearly Loan Amortization Schedule
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-3 font-black text-slate-900">Year</th>
                  <th className="p-3 font-black text-slate-900">Principal Paid</th>
                  <th className="p-3 font-black text-slate-900">Interest Paid</th>
                  <th className="p-3 font-black text-slate-900">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emiData.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="p-3 font-black">Year {row.year}</td>
                    <td className="p-3 text-emerald-700 font-bold">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-amber-700 font-bold">₹{row.interestPaid.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-slate-900">₹{row.balance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
