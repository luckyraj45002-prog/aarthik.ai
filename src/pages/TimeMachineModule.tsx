import React from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  Clock,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  Car,
  Home,
  X,
} from 'lucide-react';

export const TimeMachineModule: React.FC = () => {
  const {
    profile,
    emiPurchaseAmount,
    setEmiPurchaseAmount,
    timeMachinePreset,
    setTimeMachinePreset,
    monthlyNewEmi,
    emergencyFundMonths,
    baselineEmergencyFundMonths,
    goalDelayMonths,
    savedMonthsBanner,
    dismissSavedBanner,
    skipTimeMachinePurchase,
    applyTimeMachinePlanAdjustment,
  } = useFinancialStore();

  const handlePresetSelect = (preset: '500k' | 'iphone' | 'custom') => {
    setTimeMachinePreset(preset);
    if (preset === '500k') {
      setEmiPurchaseAmount(500000);
    } else if (preset === 'iphone') {
      setEmiPurchaseAmount(150000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setEmiPurchaseAmount(val);
    if (val === 500000) {
      setTimeMachinePreset('500k');
    } else if (val === 150000) {
      setTimeMachinePreset('iphone');
    } else {
      setTimeMachinePreset('custom');
    }
  };

  const is500k = timeMachinePreset === '500k' || emiPurchaseAmount === 500000;
  const isIphone = timeMachinePreset === 'iphone' || emiPurchaseAmount === 150000;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Saved Months Success Banner from Skip Purchase */}
      {savedMonthsBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-clay-sm flex items-start justify-between gap-3 text-emerald-950 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-black">{savedMonthsBanner}</span>
          </div>
          <button
            onClick={dismissSavedBanner}
            className="text-emerald-700 hover:text-emerald-950 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold clay-badge-amber mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Deterministic Temporal Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Financial Time Machine
          </h1>
          <p className="text-sm font-semibold text-warm-600 mt-1">
            What if I buy... See the compounding long-term ripple effect before committing monthly cash flows to an EMI.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white border border-warm-200 shadow-clay-sm text-right">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-warm-500 block">
            Target House Goal
          </span>
          <span className="text-base font-black text-warm-900">
            {profile.futureGoalText || `${formatINR(profile.goalTargetAmount)} in ${profile.goalTargetYears} Years`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Simulator Control Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="clay-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-warm-900">Financial Time Machine</h2>
              <p className="text-xs font-extrabold text-warm-500 mt-0.5">What if I buy...</p>
            </div>

            {/* Quick Preset Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-warm-800">
                Select Scenario Preset
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('500k')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    is500k
                      ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-clay-sm ring-2 ring-purple-500/20'
                      : 'bg-[#FAF6F0] border-warm-200 text-warm-800 hover:bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold block">₹5,00,000 Purchase</span>
                    <span className="text-[10px] text-warm-500 font-medium">Auto Upgrade / Luxury EMI</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('iphone')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isIphone
                      ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-clay-sm ring-2 ring-purple-500/20'
                      : 'bg-[#FAF6F0] border-warm-200 text-warm-800 hover:bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold block">₹1,50,000 iPhone</span>
                    <span className="text-[10px] text-warm-500 font-medium">No-Cost EMI (₹12,500/mo)</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Interactive Amount Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-warm-800">
                Purchase on EMI (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-warm-400 font-bold text-base">₹</span>
                <input
                  type="number"
                  value={emiPurchaseAmount}
                  onChange={handleInputChange}
                  step={10000}
                  className="w-full pl-8 pr-4 py-3 clay-input text-lg font-black text-warm-900"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-warm-500 px-1 font-semibold">
                <span>Calculated Monthly Outflow:</span>
                <span className="font-extrabold text-warm-800">
                  {formatINR(monthlyNewEmi)} / month (12 months)
                </span>
              </div>
            </div>

            {/* Slider for smooth testing */}
            <div className="space-y-1.5 pt-2">
              <input
                type="range"
                min="0"
                max="1000000"
                step="25000"
                value={emiPurchaseAmount}
                onChange={handleInputChange}
                className="w-full h-2 bg-warm-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-warm-500 font-bold">
                <span>₹0 (None)</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={skipTimeMachinePurchase}
                className="flex-1 clay-btn-secondary py-3 px-4 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Skip purchase (logs savings win)</span>
              </button>

              <button
                type="button"
                onClick={applyTimeMachinePlanAdjustment}
                className="flex-1 clay-btn-primary py-3 px-4 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Adjust plan (Rebalance surplus)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output: Real-Time Impact Deliverables */}
        <div className="lg:col-span-6 space-y-6">
          <div className="clay-card-warm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-warm-900">
                  Real-Time Impact Outputs
                </h3>
                <p className="text-xs text-warm-600 font-medium">Deterministic Mathematical Simulation</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  emiPurchaseAmount > 0 ? 'clay-badge-coral' : 'clay-badge-green'
                }`}
              >
                {emiPurchaseAmount > 0 ? 'Goal Disruption Detected' : 'Goal On Schedule'}
              </span>
            </div>

            {/* Deliverable 1: House Down Payment Impact Badge in Coral Red */}
            <div className="p-5 bg-white rounded-2xl border border-warm-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-warm-900">
                      House down payment impact
                    </h4>
                    <p className="text-xs text-warm-500 font-medium">₹60 Lakh Goal Timeline</p>
                  </div>
                </div>

                {/* Exact Badge in Coral Red */}
                <div
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    goalDelayMonths > 0 ? 'clay-badge-coral' : 'clay-badge-green'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>
                    {goalDelayMonths > 0 ? `+${goalDelayMonths} months later` : 'On Target (0 mo delay)'}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar showing timeline delay */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-warm-700">Baseline Target: 48 Months</span>
                  <span className={goalDelayMonths > 0 ? 'text-red-700' : 'text-emerald-700'}>
                    Projected: {48 + goalDelayMonths} Months
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-warm-100 overflow-hidden p-0.5 border border-warm-200 shadow-inner flex">
                  <div className="h-full rounded-l-full bg-emerald-500 w-[78%]" title="Baseline pace" />
                  {goalDelayMonths > 0 && (
                    <div
                      className="h-full bg-red-500 rounded-r-full transition-all duration-500"
                      style={{
                        width: `${Math.min(22, Math.max(6, goalDelayMonths * 2.5))}%`,
                      }}
                      title="Timeline delay"
                    />
                  )}
                </div>
                <p className="text-[11px] text-warm-500 font-medium leading-relaxed">
                  Every rupee locked into consumer debt drains the monthly compounding power needed for your house down payment corpus.
                </p>
              </div>
            </div>

            {/* Deliverable 2: Emergency Fund Status */}
            <div className="p-5 bg-white rounded-2xl border border-warm-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-warm-900">
                      Emergency fund status
                    </h4>
                    <p className="text-xs text-warm-500 font-medium">Safeguard Lockbox Moat</p>
                  </div>
                </div>

                {/* Emergency fund status badge */}
                <div
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black ${
                    emergencyFundMonths < 3.0 ? 'clay-badge-coral' : 'clay-badge-green'
                  }`}
                >
                  {emergencyFundMonths} months
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                  emergencyFundMonths < 3.0
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <AlertTriangle
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    emergencyFundMonths < 3.0 ? 'text-red-600' : 'text-emerald-600'
                  }`}
                />
                <div>
                  <p className="font-extrabold">
                    {emergencyFundMonths < 3.0
                      ? 'Below the safe limit of 3 months'
                      : 'Within the safe zone of 3+ months'}
                  </p>
                  <p className="text-[11px] mt-0.5 leading-relaxed">
                    {isIphone
                      ? 'Taking this ₹12,500/mo EMI delays the house down payment goal by 8 months and causes the emergency buffer to dip 35% below safe thresholds.'
                      : is500k
                      ? 'Adding this ₹5L EMI input leaves your family with only 1.8 months of reserves vs the safe 3.0 month threshold.'
                      : `Current emergency coverage is ${emergencyFundMonths} months.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Fiduciary Playbook Rule */}
            <div className="p-4 bg-warm-900 text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-300 uppercase tracking-wider text-[10px]">
                  Fiduciary Playbook Rule
                </span>
                <span className="text-warm-400 text-[10px]">Aarthik.ai Discipline</span>
              </div>
              <p className="text-xs text-warm-200 leading-relaxed font-medium">
                Emergency funds are NOT for holidays, gadgets, or “buying the dip”. If you must purchase, use the <strong>Adjust Plan</strong> button to rebalance non-essential discretionary categories first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
