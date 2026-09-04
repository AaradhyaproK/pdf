'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateGST } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Receipt, Percent, Share2, Copy, Check, ShieldCheck } from 'lucide-react';

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);
  const [copied, setCopied] = useState(false);

  const gstData = useMemo(() => {
    return calculateGST(amount, rate, isInclusive);
  }, [amount, rate, isInclusive]);

  const handleShareWhatsApp = () => {
    const msg = `🧾 GST Calculation Details:\nBase Net Price = ₹${gstData.netAmount.toLocaleString('en-IN')}\nGST Rate = ${rate}%\nGST Tax Amount = ₹${gstData.gstAmount.toLocaleString('en-IN')} (CGST ₹${gstData.cgst} + SGST ₹${gstData.sgst})\nTotal Gross Price = ₹${gstData.totalAmount.toLocaleString('en-IN')}\nCalculate GST at FileZenith: https://www.filezenith.com/utility/gst-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `GST Breakup:\nNet Amount: ₹${gstData.netAmount.toLocaleString('en-IN')}\nGST Rate: ${rate}%\nGST Tax Amount: ₹${gstData.gstAmount.toLocaleString('en-IN')}\nCGST (Half): ₹${gstData.cgst.toLocaleString('en-IN')}\nSGST (Half): ₹${gstData.sgst.toLocaleString('en-IN')}\nTotal Gross Amount: ₹${gstData.totalAmount.toLocaleString('en-IN')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied GST breakup!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/gst-calculator"
      title="GST Tax Calculator (Add GST or Remove GST Tax)"
      subtitle="Calculate GST online free for 5%, 12%, 18%, and 28% slab rates with CGST and SGST split."
      badgeText="B2B Tax Tool"
    >
      <div className="space-y-6 text-slate-900">
        {/* Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 max-w-md">
            <button
              onClick={() => setIsInclusive(false)}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${!isInclusive ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Add GST (Exclusive)
            </button>
            <button
              onClick={() => setIsInclusive(true)}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${isInclusive ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Remove GST (Inclusive)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">GST Slab Rate (%)</label>
              <div className="flex gap-2">
                {[5, 12, 18, 28].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRate(s)}
                    className={`flex-1 py-3 rounded-2xl font-black text-xs border transition ${rate === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GST Output Cards */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">Total Gross Amount (Including GST)</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                ₹{gstData.totalAmount.toLocaleString('en-IN')}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy GST Breakup'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" /> Share WhatsApp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">Net Amount (Pre-Tax)</p>
              <p className="text-xl font-black text-white mt-1">₹{gstData.netAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">CGST ({rate / 2}%)</p>
              <p className="text-xl font-black text-amber-400 mt-1">₹{gstData.cgst.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400">SGST ({rate / 2}%)</p>
              <p className="text-xl font-black text-amber-400 mt-1">₹{gstData.sgst.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
