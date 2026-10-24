import React, { useState, useEffect } from 'react';
import { useFinancialStore, ProfileData } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const {
    profile,
    updateProfile,
    healthScore,
    savingsRatio,
    dtiRatio,
    totalHouseholdObligations,
    monthlySurplus,
    required3MoBuffer,
    required6MoBuffer,
    baselineEmergencyFundMonths,
    tier1Instant,
    tier2NextDay,
    tier3SafeYield,
    isDemoMode,
  } = useFinancialStore();

  const [formData, setFormData] = useState<ProfileData>(profile);

  // Sync formData whenever store profile updates (e.g. on Reset Demo Data)
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold clay-badge-green mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Sign in and tell us about yourself
          </h1>
          <p className="text-sm font-semibold text-warm-600 mt-1">
            {isDemoMode
              ? 'Sample user is pre-filled for the demo. Modifying values below updates all math solvers across all 7 tabs instantly.'
              : 'Enter your verified cash flows to compute your Emergency Lockbox and SEBI Fiduciary Roadmap.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white border border-warm-200 shadow-clay-sm text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-warm-500 block">
              Emergency Moat
            </span>
            <span
              className={`text-lg font-black ${
                baselineEmergencyFundMonths < 3.0 ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              {baselineEmergencyFundMonths} Months
            </span>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-purple-700 to-warm-900 text-white shadow-clay-btn text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200 block">
              Health Score
            </span>
            <span className="text-lg font-black">{healthScore}/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Interactive Diagnostic Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="clay-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-warm-900">Personal Cash Flow Profile</h3>
                <p className="text-xs text-warm-500 font-medium">Live deterministic inputs</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 font-bold">
                Tab 1 of 7
              </span>
            </div>

            {/* Row 1: Name, Age, Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900"
                  required
                />
              </div>
            </div>

            {/* Row 2: Monthly Income, Dependents, Current Savings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Monthly Income (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-warm-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange('monthlyIncome', parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 clay-input text-sm font-bold text-emerald-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">Dependents</label>
                <input
                  type="number"
                  value={formData.dependents}
                  onChange={(e) => handleChange('dependents', parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Current Liquid Savings (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-warm-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.currentSavings}
                    onChange={(e) => handleChange('currentSavings', parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 clay-input text-sm font-bold text-warm-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Fixed Expenses & Existing EMIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Fixed Expenses / Month (Rent, food, bills)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-warm-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.fixedExpenses}
                    onChange={(e) => handleChange('fixedExpenses', parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 clay-input text-sm font-bold text-red-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Existing EMIs / Month (Car loan, debts)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-warm-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.existingEmis}
                    onChange={(e) => handleChange('existingEmis', parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 clay-input text-sm font-bold text-red-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Assets & Liabilities details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-warm-50/80 p-4 rounded-2xl border border-warm-200">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Assets Summary
                </label>
                <input
                  type="text"
                  value={formData.assetsText}
                  onChange={(e) => handleChange('assetsText', e.target.value)}
                  className="w-full px-3.5 py-2 clay-input text-xs font-semibold text-warm-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Liabilities Summary
                </label>
                <input
                  type="text"
                  value={formData.liabilitiesText}
                  onChange={(e) => handleChange('liabilitiesText', e.target.value)}
                  className="w-full px-3.5 py-2 clay-input text-xs font-semibold text-warm-900"
                />
              </div>
            </div>

            {/* Row 5: Goals & Concerns */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Future Financial Goals
                </label>
                <input
                  type="text"
                  value={formData.futureGoalText}
                  onChange={(e) => handleChange('futureGoalText', e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm text-warm-900 font-medium"
                  placeholder="e.g. ₹60 lakh house down payment in 4 years"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Biggest Financial Concern
                </label>
                <textarea
                  rows={2}
                  value={formData.biggestConcern}
                  onChange={(e) => handleChange('biggestConcern', e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm text-warm-900 font-medium"
                  placeholder="e.g. My expenses are high and I am not able to save systematically"
                />
              </div>
            </div>

            {/* Row 6: Dropdowns for Knowledge & Risk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Financial Knowledge (1 to 5)
                </label>
                <select
                  value={formData.financialKnowledge}
                  onChange={(e) => handleChange('financialKnowledge', parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900 bg-[#F6F1E9]"
                >
                  <option value={1}>1 - Beginner (No market exposure)</option>
                  <option value={2}>2 - Basic (Knows FDs, basic mutual funds)</option>
                  <option value={3}>3 - Intermediate (Active SIPs, understands index)</option>
                  <option value={4}>4 - Advanced (Equity, bonds, macro comprehension)</option>
                  <option value={5}>5 - Expert (Institutional / derivatives aware)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Risk Tolerance
                </label>
                <select
                  value={formData.riskTolerance}
                  onChange={(e) => handleChange('riskTolerance', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900 bg-[#F6F1E9]"
                >
                  <option value="Low">Low / Conservative (Capital preservation priority)</option>
                  <option value="Moderate">Moderate (Balanced equity & fixed income)</option>
                  <option value="High">High / Aggressive (High equity allocation, 10+ yrs)</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-xs text-warm-500 font-medium">
                Changes recalculate Safeguard Lockbox instantly
              </span>
              <button
                type="submit"
                className="clay-btn-primary px-6 py-3 font-extrabold text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-200" />
                <span>Submit &amp; Recalculate Solvers</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: System Deliverables Card & Safeguard Lockbox */}
        <div className="lg:col-span-5 space-y-6">
          {/* Deliverables Card: Holistic Financial Health Score */}
          <div className="clay-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-warm-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-warm-900">
                    Holistic Financial Health Score
                  </h3>
                  <p className="text-[11px] text-warm-500">Audited Mathematical Solver</p>
                </div>
              </div>
              <span className="text-2xl font-black text-purple-700">
                {healthScore}
                <span className="text-xs font-semibold text-warm-400">/100</span>
              </span>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 rounded-full bg-warm-100 overflow-hidden p-0.5 border border-warm-200 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-emerald-500 transition-all duration-700"
                  style={{ width: `${healthScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-warm-500 px-1">
                <span>0 Needs Attention</span>
                <span>50 Stable</span>
                <span>80+ Excellent</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-warm-50 border border-warm-200/80">
                <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
                  Savings Rate
                </span>
                <span className="text-base font-black text-emerald-700">
                  {savingsRatio}%
                </span>
                <span className="text-[10px] text-warm-500 block mt-0.5">
                  Surplus {formatINR(monthlySurplus)}/mo
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-warm-50 border border-warm-200/80">
                <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
                  Debt-to-Income (DTI)
                </span>
                <span
                  className={`text-base font-black ${
                    dtiRatio > 35 ? 'text-red-600' : 'text-warm-800'
                  }`}
                >
                  {dtiRatio}%
                </span>
                <span className="text-[10px] text-warm-500 block mt-0.5">
                  EMIs {formatINR(profile.existingEmis)}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Safeguard Lockbox (Emergency Liquidity Lockbox) */}
          <div className="clay-card-warm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-warm-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-warm-900">
                    Safeguard Lockbox (Emergency Reserve)
                  </h3>
                  <p className="text-[11px] text-warm-600">3–6 Month Liquidity Buffer</p>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  baselineEmergencyFundMonths < 2.0
                    ? 'clay-badge-coral'
                    : baselineEmergencyFundMonths < 3.0
                    ? 'clay-badge-amber'
                    : 'clay-badge-green'
                }`}
              >
                {baselineEmergencyFundMonths} Months Covered
              </span>
            </div>

            {/* Threshold comparison */}
            <div className="space-y-3 bg-white/80 p-4 rounded-2xl border border-warm-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-warm-700">Fixed Monthly Outflow (Needs):</span>
                <span className="font-bold text-warm-900">{formatINR(totalHouseholdObligations)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-warm-700">3-Month Safe Minimum Threshold:</span>
                <span className="font-bold text-purple-700">
                  {formatINR(required3MoBuffer)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-warm-200">
                <span className="font-semibold text-warm-700">Current Liquid Savings:</span>
                <span
                  className={`font-black ${
                    profile.currentSavings < required3MoBuffer
                      ? 'text-red-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {formatINR(profile.currentSavings)}
                </span>
              </div>

              {profile.currentSavings < required3MoBuffer && (
                <div className="flex items-start gap-2 pt-1 text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Safety Deficit:</strong> Current savings of{' '}
                    {formatINR(profile.currentSavings)} fall short of the{' '}
                    {formatINR(required3MoBuffer)} safe threshold by{' '}
                    {formatINR(required3MoBuffer - profile.currentSavings)}.
                  </p>
                </div>
              )}
            </div>

            {/* 3-Tier Allocation (From Deck Page 4 Reference) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-warm-800">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-700" />
                  <span>3-Tier Lockbox Architecture</span>
                </span>
                <span className="text-[10px] text-warm-500">Instant to 3-Day Liquidity</span>
              </div>

              <div className="space-y-2">
                {/* Tier 1 */}
                <div className="p-3 bg-white rounded-xl border border-warm-200 flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-warm-900 block">Tier 1 · Instant (UPI / ATM)</span>
                    <span className="text-[10px] text-warm-500">Savings account, first month &amp; surprises</span>
                  </div>
                  <span className="font-extrabold text-warm-800">{formatINR(tier1Instant)}</span>
                </div>

                {/* Tier 2 */}
                <div className="p-3 bg-white rounded-xl border border-warm-200 flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-warm-900 block">Tier 2 · Next Working Day</span>
                    <span className="text-[10px] text-warm-500">Liquid Mutual Fund (~6.75% yield, low risk)</span>
                  </div>
                  <span className="font-extrabold text-purple-700">{formatINR(tier2NextDay)}</span>
                </div>

                {/* Tier 3 */}
                <div className="p-3 bg-white rounded-xl border border-warm-200 flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-warm-900 block">Tier 3 · 1–3 Days</span>
                    <span className="text-[10px] text-warm-500">Arbitrage / Overnight fund / sweep-in FD</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">{formatINR(tier3SafeYield)}</span>
                </div>
              </div>
            </div>

            {/* Cash Flow Allocation Split */}
            <div className="p-4 bg-warm-900 text-white rounded-2xl shadow-clay-sm space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                Cash Flow Allocation Split
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span>Needs: {formatINR(totalHouseholdObligations)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span>Surplus &amp; Goal SIPs: {formatINR(monthlySurplus)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
