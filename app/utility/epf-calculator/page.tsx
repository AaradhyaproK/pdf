'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Calculator,
  TrendingUp,
  Coins,
  ShieldCheck,
  Building,
  UserCheck,
  Percent,
  Copy,
  Share2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface YearlyEPFRow {
  year: number;
  age: number;
  monthlyBasic: number;
  employeeContribAnnual: number;
  employerContribAnnual: number;
  interestEarnedAnnual: number;
  closingBalance: number;
}

export default function EPFCalculatorPage() {
  const [basicSalary, setBasicSalary] = useState<number>(40000);
  const [currentBalance, setCurrentBalance] = useState<number>(50000);
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [employeeContribRate, setEmployeeContribRate] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(8.25);
  const [annualIncrement, setAnnualIncrement] = useState<number>(5);

  const epfResults = useMemo(() => {
    const tenureYears = Math.max(1, retirementAge - currentAge);
    const monthlyInterestRate = interestRate / 100 / 12;

    let runningBalance = currentBalance;
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    let totalInterestEarned = 0;

    const yearlySchedule: YearlyEPFRow[] = [];

    for (let y = 1; y <= tenureYears; y++) {
      const yearFactor = Math.pow(1 + annualIncrement / 100, y - 1);
      const monthlyBasicYear = basicSalary * yearFactor;

      const monthlyEmp = monthlyBasicYear * (employeeContribRate / 100);
      const monthlyEps = Math.min(monthlyBasicYear * 0.0833, 1250);
      const monthlyEmprEpf = monthlyBasicYear * 0.12 - monthlyEps;

      const monthlyTotalPfAdded = monthlyEmp + monthlyEmprEpf;

      let yearInterest = 0;
      const yearStartBalance = runningBalance;

      for (let m = 1; m <= 12; m++) {
        runningBalance += monthlyTotalPfAdded;
        const monthInterest = runningBalance * monthlyInterestRate;
        yearInterest += monthInterest;
      }

      runningBalance += yearInterest;

      const empAnnual = monthlyEmp * 12;
      const emprAnnual = monthlyEmprEpf * 12;

      totalEmployeeContrib += empAnnual;
      totalEmployerContrib += emprAnnual;
      totalInterestEarned += yearInterest;

      yearlySchedule.push({
        year: y,
        age: currentAge + y,
        monthlyBasic: Math.round(monthlyBasicYear),
        employeeContribAnnual: Math.round(empAnnual),
        employerContribAnnual: Math.round(emprAnnual),
        interestEarnedAnnual: Math.round(yearInterest),
        closingBalance: Math.round(runningBalance),
      });
    }

    const totalAccumulated = Math.round(runningBalance);

    return {
      tenureYears,
      totalAccumulated,
      totalEmployeeContrib: Math.round(totalEmployeeContrib),
      totalEmployerContrib: Math.round(totalEmployerContrib),
      totalInterestEarned: Math.round(totalInterestEarned),
      yearlySchedule,
    };
  }, [basicSalary, currentBalance, currentAge, retirementAge, employeeContribRate, interestRate, annualIncrement]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopySummary = () => {
    const text = `📊 EPF Retirement Growth Projection (EPFO 8.25%):\n• Monthly Basic: ${formatCurrency(basicSalary)}\n• Total Maturity Corpus at Age ${retirementAge}: ${formatCurrency(epfResults.totalAccumulated)}\n• Total Employee Contribution: ${formatCurrency(epfResults.totalEmployeeContrib)}\n• Total Employer EPF Contribution: ${formatCurrency(epfResults.totalEmployerContrib)}\n• Total Interest Earned: ${formatCurrency(epfResults.totalInterestEarned)}\nCalculate your EPF maturity on FileZenith: https://www.filezenith.com/utility/epf-calculator`;
    navigator.clipboard.writeText(text);
    toast.success('EPF calculation summary copied to clipboard!');
  };

  return (
    <ToolLayout
      slug="/utility/epf-calculator"
      title="EPF / PF Balance Growth Calculator (EPFO 8.25%)"
      subtitle="Calculate your Employee Provident Fund (EPF) retirement corpus, monthly interest accumulation, employee vs employer contribution split, and salary increment projections."
      badgeText="EPFO 8.25% Rate Engine"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Main Inputs Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Coins className="w-6 h-6 text-emerald-600" />
                <span>EPF Maturity Calculator Inputs</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Based on current EPFO official interest rate of 8.25% p.a.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              8.25% EPFO Rate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Monthly Basic + DA */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Monthly Basic Salary + DA (₹)</span>
                <span className="text-emerald-600 font-extrabold">{formatCurrency(basicSalary)}</span>
              </label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Math.max(1000, Number(e.target.value)))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Existing EPF Balance */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Current EPF Balance (₹)</span>
                <span className="text-emerald-600 font-extrabold">{formatCurrency(currentBalance)}</span>
              </label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Math.max(0, Number(e.target.value)))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Current Age & Retirement Age */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Math.max(18, Math.min(57, Number(e.target.value))))}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">Retirement</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Number(e.target.value)))}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Annual Increment % */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Annual Increment (%)</span>
                <span className="text-emerald-600 font-extrabold">{annualIncrement}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={annualIncrement}
                onChange={(e) => setAnnualIncrement(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Employee EPF Rate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Employee Contribution</span>
                <span className="text-emerald-600 font-extrabold">{employeeContribRate}%</span>
              </label>
              <input
                type="range"
                min="8"
                max="20"
                step="1"
                value={employeeContribRate}
                onChange={(e) => setEmployeeContribRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>EPFO Interest Rate (%)</span>
                <span className="text-emerald-600 font-extrabold">{interestRate}%</span>
              </label>
              <input
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Results Overview Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white space-y-6 border border-slate-800 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Total EPF Maturity Corpus at Age {retirementAge}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-300 tracking-tight mt-1">
                {formatCurrency(epfResults.totalAccumulated)}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Breakdown</span>
            </button>
          </div>

          {/* Breakdown Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Employee Contribution</span>
              <div className="text-2xl font-black text-rose-300 mt-1">
                {formatCurrency(epfResults.totalEmployeeContrib)}
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Employer EPF Contribution</span>
              <div className="text-2xl font-black text-sky-300 mt-1">
                {formatCurrency(epfResults.totalEmployerContrib)}
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Interest Earned</span>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {formatCurrency(epfResults.totalInterestEarned)}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Employer 12% contribution is split into 3.67% EPF + 8.33% EPS (capped at ₹1,250/mo under EPFO rules).
            </span>
          </div>
        </div>

        {/* Year-by-Year Schedule Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 overflow-hidden">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Yearly EPF Growth Schedule ({epfResults.tenureYears} Years)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-black border-b border-slate-200">
                <tr>
                  <th className="p-3">Year / Age</th>
                  <th className="p-3">Monthly Basic</th>
                  <th className="p-3">Emp Contrib (Yr)</th>
                  <th className="p-3">Empr EPF (Yr)</th>
                  <th className="p-3">Interest (Yr)</th>
                  <th className="p-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {epfResults.yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="p-3 font-sans font-bold text-slate-900">
                      Yr {row.year} <span className="text-[11px] text-slate-500 font-normal">({row.age} yrs)</span>
                    </td>
                    <td className="p-3">{formatCurrency(row.monthlyBasic)}</td>
                    <td className="p-3 text-rose-600">{formatCurrency(row.employeeContribAnnual)}</td>
                    <td className="p-3 text-sky-600">{formatCurrency(row.employerContribAnnual)}</td>
                    <td className="p-3 text-amber-600">{formatCurrency(row.interestEarnedAnnual)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{formatCurrency(row.closingBalance)}</td>
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
