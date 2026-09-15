'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Zap,
  Calculator,
  Home,
  Tv,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  PieChart,
  Lightbulb,
  Sun,
  ShieldCheck,
  TrendingDown,
  Info,
} from 'lucide-react';

interface TariffState {
  name: string;
  discom: string;
  fixedCharge: number; // per month or per kW
  taxRate: number; // percent
  slabs: Array<{ min: number; max: number; rate: number }>;
  subsidyNotes?: string;
  hasDelhiSubsidy?: boolean;
}

const TARIFF_PRESETS: Record<string, TariffState> = {
  maharashtra: {
    name: 'Maharashtra',
    discom: 'MSEDCL (Mahavitaran)',
    fixedCharge: 128,
    taxRate: 16,
    slabs: [
      { min: 0, max: 100, rate: 5.88 },
      { min: 101, max: 300, rate: 11.26 },
      { min: 301, max: 500, rate: 15.72 },
      { min: 501, max: Infinity, rate: 17.81 },
    ],
  },
  delhi: {
    name: 'Delhi',
    discom: 'BSES Rajdhani / Yamuna / TPDDL',
    fixedCharge: 140,
    taxRate: 5,
    hasDelhiSubsidy: true,
    subsidyNotes: '0–200 units = 100% Free Subsidy (₹0 Bill). 201–400 units = 50% discount up to ₹800.',
    slabs: [
      { min: 0, max: 200, rate: 3.0 },
      { min: 201, max: 400, rate: 4.5 },
      { min: 401, max: 800, rate: 6.5 },
      { min: 801, max: 1200, rate: 7.0 },
      { min: 1201, max: Infinity, rate: 8.0 },
    ],
  },
  uttar_pradesh: {
    name: 'Uttar Pradesh',
    discom: 'UPPCL (Urban Domestic)',
    fixedCharge: 110,
    taxRate: 5,
    slabs: [
      { min: 0, max: 100, rate: 5.5 },
      { min: 101, max: 150, rate: 6.0 },
      { min: 151, max: 300, rate: 6.5 },
      { min: 301, max: Infinity, rate: 7.0 },
    ],
  },
  karnataka: {
    name: 'Karnataka',
    discom: 'BESCOM Bangalore',
    fixedCharge: 110,
    taxRate: 9,
    subsidyNotes: 'Gruha Jyothi provides up to 200 units free power for eligible domestic meters.',
    slabs: [
      { min: 0, max: 100, rate: 4.75 },
      { min: 101, max: Infinity, rate: 7.0 },
    ],
  },
  tamil_nadu: {
    name: 'Tamil Nadu',
    discom: 'TANGEDCO',
    fixedCharge: 50,
    taxRate: 5,
    subsidyNotes: 'First 100 units free for all domestic consumers.',
    slabs: [
      { min: 0, max: 100, rate: 0.0 },
      { min: 101, max: 200, rate: 2.25 },
      { min: 201, max: 400, rate: 4.5 },
      { min: 401, max: 500, rate: 6.0 },
      { min: 501, max: Infinity, rate: 9.0 },
    ],
  },
  gujarat: {
    name: 'Gujarat',
    discom: 'DGVCL / MGVCL / Torrent',
    fixedCharge: 70,
    taxRate: 15,
    slabs: [
      { min: 0, max: 50, rate: 3.05 },
      { min: 51, max: 100, rate: 3.5 },
      { min: 101, max: 250, rate: 4.15 },
      { min: 251, max: Infinity, rate: 5.2 },
    ],
  },
  custom: {
    name: 'Custom Unit Rate',
    discom: 'Generic / Other State or Country',
    fixedCharge: 100,
    taxRate: 0,
    slabs: [{ min: 0, max: Infinity, rate: 8.0 }],
  },
};

interface ApplianceItem {
  id: string;
  name: string;
  watts: number;
  qty: number;
  hoursPerDay: number;
}

const DEFAULT_APPLIANCES: ApplianceItem[] = [
  { id: 'ac', name: '1.5 Ton Inverter AC (24°C)', watts: 1400, qty: 1, hoursPerDay: 8 },
  { id: 'fridge', name: 'Refrigerator (Double Door)', watts: 200, qty: 1, hoursPerDay: 24 },
  { id: 'fans', name: 'Ceiling Fans (BEE 5-Star)', watts: 50, qty: 3, hoursPerDay: 12 },
  { id: 'geyser', name: 'Water Geyser / Heater', watts: 2000, qty: 1, hoursPerDay: 1 },
  { id: 'lights', name: 'LED Bulbs & Tube Lights', watts: 15, qty: 6, hoursPerDay: 6 },
  { id: 'tv', name: 'Smart LED TV 55"', watts: 100, qty: 1, hoursPerDay: 4 },
];

export default function ElectricityBillCalculatorPage() {
  const [calcMode, setCalcMode] = useState<'units' | 'appliances'>('units');
  const [selectedState, setSelectedState] = useState<string>('maharashtra');
  const [monthlyUnits, setMonthlyUnits] = useState<number>(280);
  const [customFlatRate, setCustomFlatRate] = useState<number>(8.0);
  const [solarUnits, setSolarUnits] = useState<number>(0);
  const [appliances, setAppliances] = useState<ApplianceItem[]>(DEFAULT_APPLIANCES);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute monthly units from appliances
  const applianceCalculations = useMemo(() => {
    let totalMonthlyKWh = 0;
    const items = appliances.map((app) => {
      const dailyKWh = (app.watts * app.qty * app.hoursPerDay) / 1000;
      const monthlyKWh = dailyKWh * 30;
      totalMonthlyKWh += monthlyKWh;
      return {
        ...app,
        dailyKWh: Math.round(dailyKWh * 10) / 10,
        monthlyKWh: Math.round(monthlyKWh),
      };
    });
    return {
      items,
      totalMonthlyKWh: Math.round(totalMonthlyKWh),
    };
  }, [appliances]);

  // Effective units to bill
  const effectiveUnits = useMemo(() => {
    const rawUnits = calcMode === 'units' ? monthlyUnits : applianceCalculations.totalMonthlyKWh;
    return Math.max(0, rawUnits - solarUnits);
  }, [calcMode, monthlyUnits, applianceCalculations.totalMonthlyKWh, solarUnits]);

  // Bill calculation based on state slabs
  const billData = useMemo(() => {
    const tariff = TARIFF_PRESETS[selectedState] || TARIFF_PRESETS.maharashtra;

    let energyCharge = 0;
    const slabBreakdown: Array<{ range: string; unitsInSlab: number; rate: number; cost: number }> = [];

    if (selectedState === 'custom') {
      energyCharge = effectiveUnits * customFlatRate;
      slabBreakdown.push({
        range: `0 - ${effectiveUnits} units`,
        unitsInSlab: effectiveUnits,
        rate: customFlatRate,
        cost: Math.round(energyCharge),
      });
    } else {
      let unitsLeft = effectiveUnits;

      for (const slab of tariff.slabs) {
        if (unitsLeft <= 0) break;
        const slabCapacity = slab.max === Infinity ? Infinity : slab.max - slab.min + 1;
        const billedInSlab = Math.min(unitsLeft, slabCapacity);

        const cost = billedInSlab * slab.rate;
        energyCharge += cost;

        slabBreakdown.push({
          range: `${slab.min} - ${slab.max === Infinity ? 'Above' : slab.max} units`,
          unitsInSlab: billedInSlab,
          rate: slab.rate,
          cost: Math.round(cost),
        });

        unitsLeft -= billedInSlab;
      }
    }

    // Apply Delhi Government Subsidy Rules
    let subsidyDiscount = 0;
    if (tariff.hasDelhiSubsidy) {
      if (effectiveUnits <= 200) {
        subsidyDiscount = energyCharge + tariff.fixedCharge; // 100% Free
      } else if (effectiveUnits <= 400) {
        subsidyDiscount = Math.min(800, energyCharge * 0.5); // up to ₹800
      }
    }

    const fixedCharge = effectiveUnits === 0 ? 0 : tariff.fixedCharge;
    const subtotal = Math.max(0, energyCharge + fixedCharge - subsidyDiscount);
    const taxAmount = (subtotal * tariff.taxRate) / 100;
    const totalBill = Math.round(subtotal + taxAmount);

    return {
      tariff,
      effectiveUnits,
      energyCharge: Math.round(energyCharge),
      fixedCharge,
      subsidyDiscount: Math.round(subsidyDiscount),
      taxAmount: Math.round(taxAmount),
      totalBill,
      slabBreakdown,
    };
  }, [selectedState, effectiveUnits, customFlatRate]);

  const updateAppliance = (id: string, field: keyof ApplianceItem, val: number) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [field]: Math.max(0, val) } : app))
    );
  };

  const handleShareWhatsApp = () => {
    const msg = `⚡ Electricity Bill Estimate: Monthly Consumption = ${billData.effectiveUnits} Units (kWh) | Estimated Bill = ₹${billData.totalBill.toLocaleString('en-IN')} (${billData.tariff.name} - ${billData.tariff.discom}). Calculate your electricity bill accurately: https://www.filezenith.com/utility/electricity-bill-calculator`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopySummary = async () => {
    const text = `Electricity Bill Summary:
State / DISCOM: ${billData.tariff.name} (${billData.tariff.discom})
Monthly Consumption: ${billData.effectiveUnits} kWh (Units)
Energy Charges: ₹${billData.energyCharge.toLocaleString('en-IN')}
Fixed Charges: ₹${billData.fixedCharge}
Government Subsidy: -₹${billData.subsidyDiscount}
Electricity Duty / Taxes: ₹${billData.taxAmount}
Estimated Payable Bill: ₹${billData.totalBill.toLocaleString('en-IN')}

Calculated with FileZenith Electricity Bill Calculator`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied bill summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy summary.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/electricity-bill-calculator"
      title="Electricity Bill Calculator (India & Global Tariff Slabs)"
      subtitle="Calculate your monthly electricity bill, state-wise tariff slabs (MSEDCL, BSES Delhi with subsidy, UPPCL, BESCOM, TANGEDCO), and appliance power consumption."
      badgeText="Utility & Finance Tool"
    >
      <div className="max-w-4xl mx-auto space-y-6 text-slate-900">
        {/* Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCalcMode('units')}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                calcMode === 'units'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" /> By Monthly Units (kWh)
            </button>
            <button
              type="button"
              onClick={() => setCalcMode('appliances')}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                calcMode === 'appliances'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" /> By Home Appliances
            </button>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Current 2026 Tariff Slabs
          </span>
        </div>

        {/* State / Tariff Board Selector */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Select State Electricity Board / DISCOM
            </label>
            <span className="text-xs text-slate-500">
              {TARIFF_PRESETS[selectedState]?.discom}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(TARIFF_PRESETS).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedState(key)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedState === key
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-xs sm:text-sm text-slate-900">{t.name}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{t.discom}</p>
              </button>
            ))}
          </div>

          {TARIFF_PRESETS[selectedState]?.subsidyNotes && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{TARIFF_PRESETS[selectedState].subsidyNotes}</span>
            </div>
          )}

          {selectedState === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Custom Flat Rate per Unit (₹/kWh or $/kWh):</label>
                <input
                  type="number"
                  step="0.1"
                  value={customFlatRate}
                  onChange={(e) => setCustomFlatRate(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Input Parameters: Units Mode or Appliances Mode */}
        {calcMode === 'units' ? (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
              <span>Total Monthly Electricity Units (kWh)</span>
              <span className="text-indigo-600 font-extrabold text-base sm:text-lg">
                {monthlyUnits} Units
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={monthlyUnits}
              onChange={(e) => setMonthlyUnits(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[100, 200, 300, 500, 800].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyUnits(preset)}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    {preset} Units
                  </button>
                ))}
              </div>
              <div className="w-28 shrink-0">
                <input
                  type="number"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-2 text-right rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                />
              </div>
            </div>

            {/* Solar Net Metering Deduction */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700">
                  Solar Rooftop Net-Metering Generation:
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={solarUnits}
                  onChange={(e) => setSolarUnits(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-20 p-1.5 text-right rounded-lg border border-slate-300 text-xs font-bold bg-slate-50"
                />
                <span className="text-xs text-slate-500">Units</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Home Appliances Power Consumption</h3>
                <p className="text-xs text-slate-500">Adjust wattage and daily usage hours</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase">Estimated Total:</span>
                <p className="text-base font-black text-indigo-600">
                  {applianceCalculations.totalMonthlyKWh} Units / Month
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {applianceCalculations.items.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                >
                  <div className="sm:col-span-5">
                    <p className="font-bold text-slate-900">{app.name}</p>
                    <p className="text-[11px] text-slate-500">{app.watts} Watts</p>
                  </div>
                  <div className="sm:col-span-3 flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={app.qty}
                      onChange={(e) => updateAppliance(app.id, 'qty', parseInt(e.target.value) || 1)}
                      className="w-14 p-1 rounded-lg border border-slate-300 font-bold text-center bg-white"
                    />
                  </div>
                  <div className="sm:col-span-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={app.hoursPerDay}
                        onChange={(e) => updateAppliance(app.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                        className="w-14 p-1 rounded-lg border border-slate-300 font-bold text-center bg-white"
                      />
                      <span className="text-[11px] text-slate-500">hrs/day</span>
                    </div>
                    <span className="font-extrabold text-indigo-600 text-xs">
                      {app.monthlyKWh} kWh
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bill Summary Result Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold text-indigo-200">Estimated Monthly Electricity Bill</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                ₹{billData.totalBill.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-800/80 border border-indigo-400/30 rounded-xl text-xs font-bold">
                {billData.effectiveUnits} kWh (Units)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <p className="text-indigo-200 font-medium">Energy Charges</p>
              <p className="text-base font-bold mt-1">₹{billData.energyCharge.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <p className="text-indigo-200 font-medium">Fixed Charges</p>
              <p className="text-base font-bold mt-1">₹{billData.fixedCharge}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <p className="text-emerald-300 font-medium">Subsidy Savings</p>
              <p className="text-base font-bold text-emerald-400 mt-1">
                {billData.subsidyDiscount > 0 ? `-₹${billData.subsidyDiscount}` : '₹0'}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <p className="text-indigo-200 font-medium">Duty & Taxes</p>
              <p className="text-base font-bold mt-1">₹{billData.taxAmount}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
                copied ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Bill Summary
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Slab-by-Slab Calculation Table */}
        {billData.slabBreakdown.length > 0 && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-indigo-600" />
              Slab-wise Energy Charge Calculation
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Tariff Slab</th>
                    <th className="p-2.5">Billed Units</th>
                    <th className="p-2.5">Rate / Unit</th>
                    <th className="p-2.5 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billData.slabBreakdown.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800">{s.range}</td>
                      <td className="p-2.5 text-slate-600">{s.unitsInSlab} units</td>
                      <td className="p-2.5 font-mono text-slate-600">₹{s.rate.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-slate-900 text-right">₹{s.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Energy Saving Tips */}
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            Top Electricity Saving Tips to Lower Your Bill
          </div>
          <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside">
            <li>
              <strong>Set AC temperature to 24°C:</strong> Every 1°C increase in AC temperature saves approximately 6% of electricity!
            </li>
            <li>
              <strong>Upgrade to BEE 5-Star BLDC Fans:</strong> BLDC ceiling fans consume only 28–35 Watts compared to 75 Watts for traditional induction motor fans (over 50% energy savings).
            </li>
            <li>
              <strong>Unplug standby chargers:</strong> Phantom power draw from TV set-top boxes, microwave displays, and phone chargers accounts for up to 5% of monthly consumption.
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
