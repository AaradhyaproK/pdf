'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateSIP } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { TrendingUp, DollarSign, Share2, Copy, PieChart, ShieldCheck, Check } from 'lucide-react';

export default function SIPCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [copied, setCopied] = useState(false);

  const sipData = useMemo(() => {
    return calculateSIP(monthlyInvestment, returnRate, years);
  }, [monthlyInvestment, returnRate, years]);

  const handleShareWhatsApp = () => {
    const msg = `📈 SIP Wealth Summary: Investing ₹${monthlyInvestment.toLocaleString('en-IN')}/mo at ${returnRate}% for ${years} years will grow to ₹${sipData.totalValue.toLocaleString('en-IN')}! Total Invested = ₹${sipData.investedAmount.toLocaleString('en-IN')} | Estimated Returns = ₹${sipData.estimatedReturns.toLocaleString('en-IN')}. Calculate your SIP growth at FileZenith: https://www.filezenith.com/utility/sip-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `SIP Mutual Fund Summary:\nMonthly Investment: ₹${monthlyInvestment.toLocaleString('en-IN')}\nExpected Return: ${returnRate}% CAGR\nTenure: ${years} Years\nTotal Invested Amount: ₹${sipData.investedAmount.toLocaleString('en-IN')}\nEstimated Returns: ₹${sipData.estimatedReturns.toLocaleString('en-IN')}\nTotal Maturity Value: ₹${sipData.totalValue.toLocaleString('en-IN')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied SIP summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/sip-calculator"
      title="SIP Mutual Fund Calculator & Wealth Compounding"
      subtitle="Calculate future returns on monthly Mutual Fund Systematic Investment Plans (SIP) with compounding interest growth."
      badgeText="Wealth Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Input Sliders */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly SIP Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Monthly Investment</span>
                <span className="text-teal-700 font-extrabold text-sm">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="500000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                aria-label="Monthly Investment Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Return Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Expected Return Rate (% p.a.)</span>
                <span className="text-teal-700 font-extrabold text-sm">{returnRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                aria-label="Expected Return Rate Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <input
                type="number"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Time Horizon */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Investment Horizon (Years)</span>
                <span className="text-teal-700 font-extrabold text-sm">{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                aria-label="Investment Horizon Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Wealth Result Card */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-800/60 pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-teal-400">Total Expected Maturity Wealth</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                ₹{sipData.totalValue.toLocaleString('en-IN')}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" /> Share WhatsApp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-teal-950/60 p-5 rounded-2xl border border-teal-800/50">
              <p className="text-xs font-bold text-teal-300">Total Invested Amount</p>
              <p className="text-2xl font-black text-white mt-1">₹{sipData.investedAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-teal-950/60 p-5 rounded-2xl border border-teal-800/50">
              <p className="text-xs font-bold text-teal-300">Estimated Returns (Wealth Gain)</p>
              <p className="text-2xl font-black text-amber-300 mt-1">₹{sipData.estimatedReturns.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
