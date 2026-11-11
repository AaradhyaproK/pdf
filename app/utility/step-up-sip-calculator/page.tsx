'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateStepUpSIP } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  Percent,
  Share2,
  Copy,
  ShieldCheck,
  Check,
  PiggyBank,
} from 'lucide-react';

export default function StepUpSIPCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [stepUp, setStepUp] = useState(10);
  const [copied, setCopied] = useState(false);

  const data = useMemo(
    () => calculateStepUpSIP(monthlyInvestment, rate, years, stepUp),
    [monthlyInvestment, rate, years, stepUp],
  );

  const handleShareWhatsApp = () => {
    const msg = `📈 Step-Up SIP: Start ₹${data.startingMonthlySIP.toLocaleString('en-IN')}/mo, step up ${stepUp}% yearly → ₹${data.finalMonthlySIP.toLocaleString('en-IN')}/mo in year ${years}. Invested ₹${data.investedAmount.toLocaleString('en-IN')} → Value ₹${data.totalValue.toLocaleString('en-IN')} (${rate}% p.a.). Calculate at FileZenith: https://www.filezenith.com/utility/step-up-sip-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `Step-Up SIP Plan:\nStarting Monthly SIP: ₹${data.startingMonthlySIP.toLocaleString('en-IN')}\nAnnual Step-Up: ${stepUp}%\nFinal Monthly SIP (Year ${years}): ₹${data.finalMonthlySIP.toLocaleString('en-IN')}\nTotal Invested: ₹${data.investedAmount.toLocaleString('en-IN')}\nEstimated Value: ₹${data.totalValue.toLocaleString('en-IN')}\nEstimated Returns: ₹${data.estimatedReturns.toLocaleString('en-IN')}\nExpected Return: ${rate}% p.a.\nTenure: ${years} Years`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied Step-Up SIP plan to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy summary.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/step-up-sip-calculator"
      title="Step-Up SIP Calculator — Increase Your SIP Every Year"
      subtitle="See how much more you can build by raising your monthly SIP by a fixed percentage each year, with a full year-by-year projection."
      badgeText="Mutual Fund Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starting SIP */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Starting Monthly SIP</span>
                <span className="text-emerald-700 font-extrabold text-sm">
                  ₹{monthlyInvestment.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                aria-label="Starting Monthly SIP Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="100"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                aria-label="Starting Monthly SIP"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Step-up % */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Annual Step-Up</span>
                <span className="text-emerald-700 font-extrabold text-sm">{stepUp}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={stepUp}
                onChange={(e) => setStepUp(Number(e.target.value))}
                aria-label="Annual Step-Up Percentage Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="0"
                max="50"
                value={stepUp}
                onChange={(e) => setStepUp(Number(e.target.value))}
                aria-label="Annual Step-Up Percentage"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                The percentage by which your SIP increases every April. 10% is the most commonly
                used step-up.
              </p>
            </div>

            {/* Return rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Expected Return (% P.A.)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{rate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Expected Return Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="1"
                max="25"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Expected Return Percentage"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Equity mutual funds are long-term instruments. 10–12% is a commonly used planning
                assumption, not a guarantee.
              </p>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Investment Tenure</span>
                <span className="text-emerald-700 font-extrabold text-sm">{years} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                aria-label="Investment Tenure Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="1"
                max="40"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                aria-label="Investment Tenure in Years"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Estimated Corpus Value
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                ₹{data.totalValue.toLocaleString('en-IN')}
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                after {years} years with a {stepUp}% yearly step-up
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Share WhatsApp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Total Invested</p>
              <p className="text-xl font-black text-slate-100 mt-1">
                ₹{data.investedAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Estimated Returns</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                ₹{data.estimatedReturns.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Final Monthly SIP</p>
              <p className="text-xl font-black text-amber-400 mt-1">
                ₹{data.finalMonthlySIP.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Starting Monthly SIP</p>
              <p className="text-xl font-black text-slate-100 mt-1">
                ₹{data.startingMonthlySIP.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Step-up visual */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-400">Your SIP grows automatically</p>
              <p className="text-sm font-black text-white mt-1">
                ₹{data.startingMonthlySIP.toLocaleString('en-IN')} → ₹
                {data.finalMonthlySIP.toLocaleString('en-IN')} per month by year {years}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                A {stepUp}% annual step-up means you invest ₹
                {(data.investedAmount / (years * 12)).toLocaleString('en-IN')} more per month on
                average than a flat SIP of ₹{monthlyInvestment.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
        </div>

        {/* Year-by-year schedule */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Year-by-Year Growth Projection
            </h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              SIP · Invested · Value
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-3 font-black text-slate-900">Year</th>
                  <th className="p-3 font-black text-slate-900">Monthly SIP</th>
                  <th className="p-3 font-black text-slate-900">Total Invested</th>
                  <th className="p-3 font-black text-slate-900">Est. Value</th>
                  <th className="p-3 font-black text-slate-900">Est. Gains</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="p-3 font-black">{row.year}</td>
                    <td className="p-3 font-bold text-slate-900">
                      ₹{row.monthlySIP.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold text-slate-700">
                      ₹{row.invested.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-black text-emerald-700">
                      ₹{row.value.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold text-amber-700">
                      ₹{row.gains.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why step-up */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" /> Why a Step-Up Beats a Flat SIP
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Outpaces Inflation',
                body: 'A fixed SIP buys less every year as prices rise. A step-up keeps your real contribution steady.',
              },
              {
                title: 'Compounds Harder',
                body: 'Every extra rupee is invested for more years, so later step-ups contribute disproportionately to the final corpus.',
              },
              {
                title: 'Matches Your Income',
                body: 'Raises typically track salary revisions, so the SIP grows with you instead of staying flat for 15 years.',
              },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-black text-slate-900">{item.title}</p>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1.5">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed flex items-start gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              These are projections computed in your browser using monthly compounding. Mutual fund
              returns are not guaranteed, and actual returns vary year to year.
            </span>
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
