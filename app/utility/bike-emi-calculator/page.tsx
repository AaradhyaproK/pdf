'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateBikeLoan } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Bike,
  IndianRupee,
  Calendar,
  Percent,
  Share2,
  Copy,
  ShieldCheck,
  Check,
  TrendingUp,
} from 'lucide-react';

export default function BikeEMICalculatorPage() {
  const [onRoadPrice, setOnRoadPrice] = useState(150000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [rate, setRate] = useState(11.5);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [copied, setCopied] = useState(false);

  const data = useMemo(
    () => calculateBikeLoan(onRoadPrice, downPaymentPercent, rate, tenureMonths),
    [onRoadPrice, downPaymentPercent, rate, tenureMonths],
  );

  const handleShareWhatsApp = () => {
    const msg = `🏍️ Bike Loan EMI: Monthly EMI = ₹${data.monthlyEMI.toLocaleString('en-IN')}/mo | On-road ₹${data.totalPrice.toLocaleString('en-IN')} | Down payment ₹${data.downPayment.toLocaleString('en-IN')} | Loan ₹${data.loanAmount.toLocaleString('en-IN')} | Interest ₹${data.totalInterest.toLocaleString('en-IN')} (${rate}% for ${tenureMonths} mo). Calculate at FileZenith: https://www.filezenith.com/utility/bike-emi-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `Bike Loan EMI Details:\nMonthly EMI: ₹${data.monthlyEMI.toLocaleString('en-IN')}\nOn-Road Price: ₹${data.totalPrice.toLocaleString('en-IN')}\nDown Payment (${downPaymentPercent}%): ₹${data.downPayment.toLocaleString('en-IN')}\nLoan Amount: ₹${data.loanAmount.toLocaleString('en-IN')}\nTotal Interest: ₹${data.totalInterest.toLocaleString('en-IN')}\nTotal Repayment: ₹${data.totalPayment.toLocaleString('en-IN')}\nInterest Rate: ${rate}%\nTenure: ${tenureMonths} Months`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied bike loan summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy summary.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/bike-emi-calculator"
      title="Bike Loan EMI Calculator — Two-Wheeler Monthly Instalment"
      subtitle="Calculate the exact monthly EMI on your bike or scooter loan from the on-road price, down payment, interest rate and tenure."
      badgeText="Two-Wheeler Finance Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* On-Road Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>On-Road Price</span>
                <span className="text-emerald-700 font-extrabold text-sm">
                  ₹{onRoadPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="5000"
                value={onRoadPrice}
                onChange={(e) => setOnRoadPrice(Number(e.target.value))}
                aria-label="On-Road Price Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="10000"
                value={onRoadPrice}
                onChange={(e) => setOnRoadPrice(Number(e.target.value))}
                aria-label="On-Road Price"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Ex-showroom + RTO/registration + insurance + accessories. This is the figure the
                dealer quotes you, and it is what gets financed.
              </p>
            </div>

            {/* Down Payment */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Down Payment (%)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{downPaymentPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                aria-label="Down Payment Percentage Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                aria-label="Down Payment Percentage"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Equals ₹{data.downPayment.toLocaleString('en-IN')} paid today. Most two-wheeler
                dealers ask 15–25% upfront.
              </p>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Interest Rate (% P.A.)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{rate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="24"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Interest Rate Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="1"
                max="40"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Interest Rate"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Two-wheeler loans typically run 9–14%. Newer EV models often qualify for lower rates.
              </p>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Loan Tenure</span>
                <span className="text-emerald-700 font-extrabold text-sm">{tenureMonths} Months</span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="6"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                aria-label="Loan Tenure Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="6"
                max="96"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                aria-label="Loan Tenure in Months"
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Most two-wheeler loans run 24–48 months. A longer tenure lowers the EMI but raises the
                total interest.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Monthly Bike EMI
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                ₹{data.monthlyEMI.toLocaleString('en-IN')}
                <span className="text-sm font-semibold text-slate-400">/mo</span>
              </h2>
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
              <p className="text-xs font-bold text-slate-400">On-Road Price</p>
              <p className="text-xl font-black text-slate-100 mt-1">
                ₹{data.totalPrice.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Down Payment ({downPaymentPercent}%)</p>
              <p className="text-xl font-black text-slate-100 mt-1">
                ₹{data.downPayment.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Amount Financed</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                ₹{data.loanAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Total Interest</p>
              <p className="text-xl font-black text-amber-400 mt-1">
                ₹{data.totalInterest.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Cost-of-loan insight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-400">Interest as % of Loan</p>
                <p className="text-lg font-black text-white mt-0.5">{data.interestRatio.toFixed(1)}%</p>
              </div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-400">Total Repayment</p>
                <p className="text-lg font-black text-white mt-0.5">
                  ₹{data.totalPayment.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-400">Number of Instalments</p>
                <p className="text-lg font-black text-white mt-0.5">{data.tenureMonths}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization schedule */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Yearly Repayment Schedule
            </h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Principal vs Interest
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-3 font-black text-slate-900">Year</th>
                  <th className="p-3 font-black text-slate-900">Principal Paid</th>
                  <th className="p-3 font-black text-slate-900">Interest Paid</th>
                  <th className="p-3 font-black text-slate-900">Balance Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="p-3 font-black">Year {row.year}</td>
                    <td className="p-3 text-emerald-700 font-bold">
                      ₹{row.principalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-amber-700 font-bold">
                      ₹{row.interestPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      ₹{row.balance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick reference */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Bike className="w-5 h-5 text-emerald-600" /> Bike Loan EMI at a Glance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Your Bike', value: `₹${onRoadPrice.toLocaleString('en-IN')} on-road` },
              { label: 'You Pay Today', value: `₹${data.downPayment.toLocaleString('en-IN')}` },
              {
                label: 'Every Month',
                value: `₹${data.monthlyEMI.toLocaleString('en-IN')} × ${tenureMonths} months`,
              },
            ].map((row) => (
              <div key={row.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {row.label}
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">{row.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed flex items-start gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All figures are estimates computed in your browser using the standard reducing-balance
              EMI formula. Final sanction, insurance, and processing charges are decided by your
              lender.
            </span>
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
