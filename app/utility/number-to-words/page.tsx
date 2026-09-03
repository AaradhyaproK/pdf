'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { convertNumberToWords } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  DollarSign,
  Copy,
  Check,
  Share2,
  Building2,
  FileSpreadsheet,
  Sparkles,
  CreditCard,
} from 'lucide-react';

export default function NumberToWordsPage() {
  const [amountInput, setAmountInput] = useState<string>('150000');
  const [payeeName, setPayeeName] = useState<string>('John Doe');
  const [bankName, setBankName] = useState<string>('GLOBAL BANK');

  const [system, setSystem] = useState<'indian' | 'international'>('international');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP' | 'NONE'>('USD');
  const [caseType, setCaseType] = useState<'title' | 'upper' | 'lower'>('title');
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return convertNumberToWords(amountInput, { system, currency, caseType });
  }, [amountInput, system, currency, caseType]);

  const handleCopy = async () => {
    if (!result.words) return;
    try {
      await navigator.clipboard.writeText(result.words);
      setCopied(true);
      toast.success('Copied amount in words to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  const handleShareWhatsApp = () => {
    const msg = `Amount: ${result.currencySymbol} ${result.formattedNumber}\nIn Words: ${result.words}\nConverted via FileZenith: https://www.filezenith.com/utility/number-to-words`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <ToolLayout
      slug="/utility/number-to-words"
      title="Number to Words Converter (Worldwide & Cheque)"
      subtitle="Convert numbers into words online free for bank cheques, invoices, contracts, and financial receipts in USD, EUR, GBP, INR, and all currencies worldwide."
      badgeText="Global Currency Ready"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Settings & Input Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-slate-700">
              Enter Number Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-50 font-black text-lg sm:text-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-extrabold">
            {/* System selector */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 uppercase">Numbering System</label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="international">International System (Millions & Billions - Global)</option>
                <option value="indian">Indian System (Lakhs & Crores)</option>
              </select>
            </div>

            {/* Currency selector */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 uppercase">Currency Unit</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="USD">Dollars (USD - $)</option>
                <option value="EUR">Euros (EUR - €)</option>
                <option value="GBP">Pounds (GBP - £)</option>
                <option value="INR">Rupees (INR - ₹)</option>
                <option value="NONE">Plain Number (No Currency)</option>
              </select>
            </div>

            {/* Letter Case selector */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-500 uppercase">Letter Case</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="title">Title Case (One Hundred Fifty Thousand...)</option>
                <option value="upper">UPPERCASE (ONE HUNDRED FIFTY THOUSAND...)</option>
                <option value="lower">lowercase (one hundred fifty thousand...)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Primary Result Words Display Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-5 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Amount in Words
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Words'}</span>
              </button>
            </div>
          </div>

          <div className="text-xl sm:text-3xl font-black tracking-tight text-white leading-relaxed select-all">
            {result.words}
          </div>

          <div className="text-xs font-bold text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Formatted Figure: <strong className="text-emerald-400 font-black">{result.currencySymbol} {result.formattedNumber}</strong></span>
            <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{system} System</span>
          </div>
        </div>

        {/* Bank Cheque Visualizer Preview Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" /> Live Bank Cheque Preview
            </h3>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Cheque Writing Spec
            </span>
          </div>

          {/* Interactive Cheque Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Payee Name</label>
              <input
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Payee Name (e.g. John Doe)"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name (e.g. Global Bank)"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Simulated Bank Cheque Graphic Box */}
          <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 border-2 border-indigo-200/80 shadow-md space-y-4 text-slate-900 relative font-serif">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="font-bold text-sm tracking-wider uppercase text-indigo-900">{bankName}</span>
                <p className="text-[10px] text-slate-500 font-sans">MAIN BRANCH • OFFICIAL BANK CHEQUE PREVIEW</p>
              </div>
              <div className="border border-slate-300 px-3 py-1 rounded bg-white text-xs font-mono font-bold">
                DATE: {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-baseline border-b border-dashed border-slate-400 pb-1 text-sm">
                <span className="font-sans text-xs font-bold text-slate-500 w-24">PAY TO</span>
                <strong className="font-sans font-bold text-slate-900">{payeeName || 'Self'}</strong>
                <span className="ml-auto text-xs font-sans font-bold text-slate-400">OR BEARER</span>
              </div>

              <div className="flex items-baseline border-b border-dashed border-slate-400 pb-1 text-sm">
                <span className="font-sans text-xs font-bold text-slate-500 w-24">
                  {currency === 'INR' ? 'RUPEES' : currency === 'USD' ? 'DOLLARS' : currency === 'EUR' ? 'EUROS' : currency === 'GBP' ? 'POUNDS' : 'AMOUNT'}
                </span>
                <strong className="font-sans font-bold text-slate-900 text-xs sm:text-sm">{result.words}</strong>
              </div>

              <div className="flex justify-end pt-2">
                <div className="border-2 border-indigo-400 bg-white px-4 py-2 rounded-xl text-base font-black font-mono text-slate-900 shadow-2xs">
                  {result.currencySymbol} {result.formattedNumber}/-
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
