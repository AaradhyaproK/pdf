'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { calculateBMIDetailed } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Activity, Heart, Share2, Copy, Check, ShieldCheck } from 'lucide-react';

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [copied, setCopied] = useState(false);

  const bmiData = useMemo(() => {
    return calculateBMIDetailed(weight, height);
  }, [weight, height]);

  const handleShareWhatsApp = () => {
    const msg = `💪 BMI Health Check: My BMI Score is ${bmiData.bmi} (${bmiData.category}). Healthy ideal weight range for my height is ${bmiData.idealWeightMinKg}kg - ${bmiData.idealWeightMaxKg}kg. Check your BMI at FileZenith: https://www.filezenith.com/utility/bmi-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <ToolLayout
      slug="/utility/bmi-calculator"
      title="BMI Calculator & Ideal Body Weight Range"
      subtitle="Calculate Body Mass Index (BMI) and discover your healthy ideal weight range for adults."
      badgeText="Health Calculator"
    >
      <div className="space-y-6 text-slate-900">
        {/* Sliders */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Weight (kg)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{weight} kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                aria-label="Weight Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Height (cm)</span>
                <span className="text-emerald-700 font-extrabold text-sm">{height} cm</span>
              </div>
              <input
                type="range"
                min="100"
                max="230"
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                aria-label="Height Slider"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Your Body Mass Index (BMI)</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl font-black text-slate-900">{bmiData.bmi}</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${bmiData.color}`}>
                  {bmiData.category}
                </span>
              </div>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <Share2 className="w-4 h-4" /> Share Score
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900 mb-1">Health Insights & Advice:</p>
            <p>{bmiData.healthAdvice}</p>
            <p className="mt-2 text-emerald-800 font-bold">
              Target Ideal Healthy Weight Range for {height}cm: {bmiData.idealWeightMinKg} kg – {bmiData.idealWeightMaxKg} kg
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
