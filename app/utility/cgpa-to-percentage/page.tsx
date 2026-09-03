'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { convertCGPAToPercentage } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calculator,
  Copy,
  Check,
  Table,
  Plus,
  Trash2,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function CGPAToPercentagePage() {
  const [activeTab, setActiveTab] = useState<'quick' | 'multi'>('quick');

  // Quick Mode state
  const [cgpaInput, setCgpaInput] = useState<string>('8.5');
  const [university, setUniversity] = useState<
    'cbse' | 'mumbai' | 'vtu' | 'du' | 'gtu' | 'aktu' | 'sppu' | 'custom'
  >('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<string>('9.5');
  const [copied, setCopied] = useState(false);

  // Multi-semester state
  const [semesters, setSemesters] = useState<Array<{ sem: number; sgpa: string; credits: string }>>([
    { sem: 1, sgpa: '8.2', credits: '20' },
    { sem: 2, sgpa: '8.6', credits: '20' },
    { sem: 3, sgpa: '8.8', credits: '22' },
    { sem: 4, sgpa: '8.4', credits: '22' },
  ]);

  const quickResult = useMemo(() => {
    const cgpa = parseFloat(cgpaInput) || 0;
    const mult = parseFloat(customMultiplier) || 9.5;
    return convertCGPAToPercentage(cgpa, university, mult);
  }, [cgpaInput, university, customMultiplier]);

  const multiResult = useMemo(() => {
    let totalWeightedSgpa = 0;
    let totalCredits = 0;

    for (const sem of semesters) {
      const s = parseFloat(sem.sgpa) || 0;
      const c = parseFloat(sem.credits) || 0;
      if (s > 0 && c > 0) {
        totalWeightedSgpa += s * c;
        totalCredits += c;
      }
    }

    const calculatedCGPA = totalCredits > 0 ? totalWeightedSgpa / totalCredits : 0;
    const mult = parseFloat(customMultiplier) || 9.5;
    return {
      cgpa: parseFloat(calculatedCGPA.toFixed(2)),
      conversion: convertCGPAToPercentage(calculatedCGPA, university, mult),
      totalCredits,
    };
  }, [semesters, university, customMultiplier]);

  const addSemester = () => {
    if (semesters.length >= 10) return;
    setSemesters((prev) => [
      ...prev,
      { sem: prev.length + 1, sgpa: '', credits: '20' },
    ]);
  };

  const removeSemester = (idx: number) => {
    setSemesters((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSemester = (idx: number, field: 'sgpa' | 'credits', val: string) => {
    setSemesters((prev) => {
      const updated = [...prev];
      updated[idx][field] = val;
      return updated;
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied grade summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  const handleShareWhatsApp = (text: string) => {
    const msg = `🎓 My Official Result: ${text}. Calculated via FileZenith CGPA Converter: https://www.filezenith.com/utility/cgpa-to-percentage`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <ToolLayout
      slug="/utility/cgpa-to-percentage"
      title="CGPA to Percentage Converter"
      subtitle="Convert CGPA to Percentage instantly for CBSE, Mumbai University, VTU, DU, GTU, AKTU, SPPU, and all Indian universities for job applications."
      badgeText="Official University Formulas"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Single CGPA Converter</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('multi')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'multi'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Multi-Semester SGPA Calculator</span>
          </button>
        </div>

        {/* Quick Mode Workspace */}
        {activeTab === 'quick' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* University Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700">
                  Select University / Grading Standard
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value as any)}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="cbse">CBSE (CGPA × 9.5)</option>
                  <option value="mumbai">Mumbai University (10 × CGPA - 7.5)</option>
                  <option value="vtu">VTU Belagavi ((CGPA - 0.75) × 10)</option>
                  <option value="du">Delhi University (CGPA × 9.5)</option>
                  <option value="gtu">GTU Gujarat ((CGPA - 0.5) × 10)</option>
                  <option value="aktu">AKTU Uttar Pradesh ((CGPA - 0.75) × 10)</option>
                  <option value="sppu">SPPU Pune (CGPA × 9.5)</option>
                  <option value="custom">Custom Multiplier</option>
                </select>
              </div>

              {/* CGPA Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700">
                  Cumulative CGPA Score (0.0 to 10.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpaInput}
                  onChange={(e) => setCgpaInput(e.target.value)}
                  placeholder="e.g. 8.5"
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Custom Multiplier Input if custom */}
              {university === 'custom' && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-slate-700">
                    Custom Multiplier Factor (e.g. 9.5 or 10.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMultiplier}
                    onChange={(e) => setCustomMultiplier(e.target.value)}
                    placeholder="9.5"
                    className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* Quick Result Highlight Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-rose-950 text-white space-y-5 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Official Percentage Result
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleShareWhatsApp(
                        `CGPA: ${quickResult.cgpa} = ${quickResult.percentage}% (${quickResult.division})`
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `CGPA: ${quickResult.cgpa} | Percentage: ${quickResult.percentage}% | Grade: ${quickResult.grade} | Division: ${quickResult.division}`
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-4">
                <div className="text-4xl sm:text-6xl font-black text-rose-400 tracking-tight">
                  {quickResult.percentage}%
                </div>
                <div className="text-sm font-bold text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                  Equivalent Percentage
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Formula Used</span>
                  <div className="font-extrabold text-white">{quickResult.formulaUsed}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Grade & Class Division</span>
                  <div className="font-extrabold text-emerald-400">{quickResult.grade} &bull; {quickResult.division}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Semester Mode Workspace */}
        {activeTab === 'multi' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-600" /> Semester-wise SGPA Table
              </h3>
              <button
                type="button"
                onClick={addSemester}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Semester</span>
              </button>
            </div>

            <div className="space-y-3">
              {semesters.map((sem, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-black text-slate-900 w-16 shrink-0">Sem {sem.sem}</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="SGPA (e.g. 8.5)"
                        value={sem.sgpa}
                        onChange={(e) => updateSemester(idx, 'sgpa', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Credits (e.g. 20)"
                        value={sem.credits}
                        onChange={(e) => updateSemester(idx, 'credits', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-900"
                      />
                    </div>
                  </div>
                  {semesters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSemester(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Cumulative Result Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Cumulative CGPA & Percentage
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Cumulative CGPA</span>
                  <div className="text-3xl sm:text-5xl font-black text-white">{multiResult.cgpa}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Overall Percentage</span>
                  <div className="text-3xl sm:text-5xl font-black text-rose-400">{multiResult.conversion.percentage}%</div>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-300 border-t border-slate-800 pt-2">
                Class Division: <strong className="text-emerald-400 font-bold">{multiResult.conversion.division}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Conversion Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Quick Reference CGPA to Percentage Table (CBSE × 9.5)
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-black text-slate-900">
                <tr>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Percentage (%)</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Division</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {[
                  { cgpa: 10.0, pct: '95.0%', grade: 'O', div: 'First Class with Distinction' },
                  { cgpa: 9.5, pct: '90.25%', grade: 'O', div: 'First Class with Distinction' },
                  { cgpa: 9.0, pct: '85.5%', grade: 'O', div: 'First Class with Distinction' },
                  { cgpa: 8.5, pct: '80.75%', grade: 'A+', div: 'First Class with Distinction' },
                  { cgpa: 8.0, pct: '76.0%', grade: 'A+', div: 'First Class' },
                  { cgpa: 7.5, pct: '71.25%', grade: 'A', div: 'First Class' },
                  { cgpa: 7.0, pct: '66.5%', grade: 'A', div: 'First Class' },
                  { cgpa: 6.5, pct: '61.75%', grade: 'B+', div: 'First Class' },
                  { cgpa: 6.0, pct: '57.0%', grade: 'B+', div: 'Second Class' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-black text-slate-900">{row.cgpa}</td>
                    <td className="p-3 font-bold text-rose-600">{row.pct}</td>
                    <td className="p-3">{row.grade}</td>
                    <td className="p-3">{row.div}</td>
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
