import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  CheckCircle2,
  Award,
  Send,
  Building,
} from 'lucide-react';

interface ExpertPlanModuleProps {
  onOpenAdvisorModal: () => void;
}

interface InstrumentDetail {
  id: string;
  title: string;
  subtitle: string;
  allocationPercent: number; // % of monthly surplus
  timeHorizon: string;
  reason: string;
  downside: string;
  recommendedCategory: 'Safe' | 'Balanced' | 'Growth' | 'Diversifier';
}

const INSTRUMENT_PLANS: InstrumentDetail[] = [
  {
    id: 'p1',
    title: '1. Round-up SIP',
    subtitle: 'Automated Habit Consistency Engine',
    allocationPercent: 0.02, // 2% of surplus
    timeHorizon: 'Continuous micro-savings',
    reason: 'Automated micro-investing from daily spare change to build habit consistency without cash-flow strain.',
    downside: 'Small transaction volumes require account aggregator sync; returns accumulate gradually.',
    recommendedCategory: 'Safe',
  },
  {
    id: 'p2',
    title: '2. Step-up SIP',
    subtitle: 'House Goal Accumulation Engine',
    allocationPercent: 0.25, // 25% of surplus
    timeHorizon: '4 years (House Goal)',
    reason: 'Automatically increases SIP contribution annually in line with salary increments to accelerate the ₹60L house down payment goal.',
    downside: 'Requires discipline to avoid lifestyle inflation when annual appraisals happen.',
    recommendedCategory: 'Balanced',
  },
  {
    id: 'p3',
    title: '3. Target Maturity Fund',
    subtitle: 'Fixed-Income Goal Anchor (2028-2029)',
    allocationPercent: 0.16, // 16% of surplus
    timeHorizon: '4 years (matches house deadline)',
    reason: 'Predictable fixed-income allocation aligned with the 4-year house down payment timeline.',
    downside: 'Returns are capped to the portfolio Yield to Maturity (YTM ~7.2%); taxable at slab rate.',
    recommendedCategory: 'Safe',
  },
  {
    id: 'p4',
    title: '4. Liquid fund',
    subtitle: 'Safeguard Lockbox Tier 2',
    allocationPercent: 0.14, // 14% of surplus
    timeHorizon: 'Instant to T+1 Redemption',
    reason: 'Houses the 3–6 month Emergency Liquidity Lockbox with instant T+1 redemption safety.',
    downside: 'Slightly slower than instant UPI ATM cash (requires 1 working day for amounts > ₹50,000).',
    recommendedCategory: 'Safe',
  },
  {
    id: 'p5',
    title: '5. Gold ETF',
    subtitle: 'Sovereign / Digital Inflation Hedge',
    allocationPercent: 0.05, // 5% of surplus
    timeHorizon: '10+ years',
    reason: 'Sovereign/digital hedge against inflation without physical storage or making-charge leakage.',
    downside: 'Gold produces no periodic dividends or interest cash flows; prices fluctuate with international spot rates.',
    recommendedCategory: 'Diversifier',
  },
  {
    id: 'p6',
    title: '6. NPS Tier I',
    subtitle: 'Tax Shield & Retirement Compounding',
    allocationPercent: 0.10, // 10% of surplus
    timeHorizon: 'Until retirement',
    reason: 'Reason: Tax benefit and retirement savings under Section 80CCD(1B); ultralow 0.09% expense ratio.',
    downside: 'Downside: Money is locked until retirement; mandatory 40% annuity conversion upon maturity.',
    recommendedCategory: 'Growth',
  },
  {
    id: 'p7',
    title: '7. REIT',
    subtitle: 'Commercial Real Estate Yield (Grade-A Office)',
    allocationPercent: 0.08, // 8% of surplus
    timeHorizon: '5+ years',
    reason: 'Reason: Real estate exposure with a small amount; provides quarterly dividend yields plus capital appreciation.',
    downside: 'Downside: Prices can fall and payouts can vary with commercial tenancy occupancy cycles.',
    recommendedCategory: 'Balanced',
  },
  {
    id: 'p8',
    title: '8. Arbitrage or Balanced Advantage fund',
    subtitle: 'Dynamic Valuation Hedging',
    allocationPercent: 0.20, // 20% of surplus
    timeHorizon: '3 years',
    reason: 'Reason: Lower volatility for a calmer ride; dynamically reduces equity exposure when market valuations peak.',
    downside: 'Downside: Returns can lag pure equity during sharp, sustained market bull runs.',
    recommendedCategory: 'Balanced',
  },
];

export const ExpertPlanModule: React.FC<ExpertPlanModuleProps> = ({ onOpenAdvisorModal }) => {
  const {
    profile,
    monthlySurplus,
    advisorVerified,
    advisorNotes,
    dossierDispatched,
    dispatchDossier,
  } = useFinancialStore();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    p1: true,
    p2: true,
  });

  const toggleAccordion = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Exact Green Verification Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold clay-badge-green">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Expert-approved options</span>
            </span>

            {advisorVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800">
                <Award className="w-3.5 h-3.5 text-purple-700" />
                SEBI RIA Certified Sign-Off
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Your Expert-Prepared Plan
          </h1>

          {/* Exact Compliance Subtitle */}
          <p className="text-sm font-semibold text-warm-700 mt-1 max-w-2xl leading-relaxed">
            Delivered 24 hours after submission. AI never chooses your investments. A registered expert does.
          </p>
        </div>

        {/* Dual Actions for Advisor Integration */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {!dossierDispatched ? (
            <button
              onClick={dispatchDossier}
              className="clay-btn-primary px-4 py-3 text-xs font-black flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-purple-200" />
              <span>Verify with Certified Planner</span>
            </button>
          ) : (
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dossier in Review Queue</span>
            </div>
          )}

          <button
            onClick={onOpenAdvisorModal}
            className="clay-btn-secondary px-4 py-3 text-xs font-black flex items-center justify-center gap-2"
          >
            <Building className="w-4 h-4 text-warm-700" />
            <span>Open Advisor Dashboard (B2B2C View)</span>
          </button>
        </div>
      </div>

      {/* Section A — Client View (8 Interactive Accordion Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-lg font-black text-warm-900">
              Personalized Investment Instruments
            </h3>
            <span className="text-xs text-warm-500 font-bold">
              Dynamic Surplus: {formatINR(monthlySurplus)}/mo
            </span>
          </div>

          <div className="space-y-3.5">
            {INSTRUMENT_PLANS.map((item, idx) => {
              const isExpanded = !!expandedItems[item.id];
              // Live calculated allocation based on user's real monthly surplus!
              const calculatedAllocation = Math.round(monthlySurplus * item.allocationPercent);

              return (
                <div
                  key={item.id}
                  className="clay-card transition-all overflow-hidden border border-warm-200"
                >
                  {/* Card Header / Summary Bar */}
                  <div
                    onClick={() => toggleAccordion(item.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-warm-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-warm-900">{item.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.recommendedCategory === 'Safe'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.recommendedCategory === 'Balanced'
                                ? 'bg-purple-100 text-purple-800'
                                : item.recommendedCategory === 'Growth'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {item.recommendedCategory}
                          </span>
                        </div>
                        <p className="text-xs text-warm-500 font-medium">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-black text-warm-900 block">
                          {formatINR(calculatedAllocation)} / mo
                        </span>
                        <span className="text-[10px] text-warm-400 font-bold">
                          {Math.round(item.allocationPercent * 100)}% of surplus
                        </span>
                      </div>

                      {/* Clickable ► Why this? toggle as specified */}
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-100 hover:bg-purple-100 text-xs font-black text-purple-900 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAccordion(item.id);
                        }}
                      >
                        <span>{isExpanded ? '▼' : '►'} Why this?</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-warm-100 bg-[#FCFAF7] space-y-3 animate-in fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                        {/* Live Allocation Box */}
                        <div className="p-3.5 rounded-2xl bg-white border border-warm-200 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                            Live Allocation
                          </span>
                          <p className="text-sm font-black text-purple-900">
                            {formatINR(calculatedAllocation)} / month
                          </p>
                          <span className="text-[10px] text-warm-400 block pt-0.5 font-medium">
                            Derived from {profile.riskTolerance} risk &amp; {formatINR(monthlySurplus)} surplus
                          </span>
                        </div>

                        {/* 1. Reason */}
                        <div className="p-3.5 rounded-2xl bg-white border border-warm-200 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                            Reason
                          </span>
                          <p className="text-xs font-medium text-warm-800 leading-relaxed">
                            {item.reason}
                          </p>
                        </div>

                        {/* 2. Time Horizon */}
                        <div className="p-3.5 rounded-2xl bg-white border border-warm-200 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                            Time Horizon
                          </span>
                          <p className="text-xs font-medium text-warm-800 leading-relaxed">
                            {item.timeHorizon}
                          </p>
                        </div>

                        {/* 3. Downside */}
                        <div className="p-3.5 rounded-2xl bg-white border border-warm-200 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-700 block">
                            Downside
                          </span>
                          <p className="text-xs font-medium text-warm-800 leading-relaxed">
                            {item.downside}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: 5-Step Action Roadmap */}
        <div className="lg:col-span-4 space-y-6">
          <div className="clay-card-warm p-6 space-y-5">
            <div className="border-b border-warm-200 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
                Attachment Reference
              </span>
              <h4 className="text-base font-black text-warm-900">5-Step Action Roadmap</h4>
              <p className="text-xs text-warm-600 font-medium">Immediate next steps for execution</p>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3.5 bg-white rounded-2xl border border-warm-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-black text-warm-900">Week 1 · Insurance First</span>
                </div>
                <p className="text-[11px] text-warm-600 pl-7 leading-relaxed font-medium">
                  Buy ₹3 Cr term life plan, ₹10L base family health floater + ₹50L super top-up to cover parental risks.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-white rounded-2xl border border-warm-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-black text-warm-900">Week 2 · Emergency Fund</span>
                </div>
                <p className="text-[11px] text-warm-600 pl-7 leading-relaxed font-medium">
                  Separate bank account. Allocate ₹2L into Tier 1 (UPI/ATM), balance into Tier 2 Liquid Fund.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-white rounded-2xl border border-warm-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="text-xs font-black text-warm-900">Week 3 · Start SIPs</span>
                </div>
                <p className="text-[11px] text-warm-600 pl-7 leading-relaxed font-medium">
                  Auto-debit on salary day: Balanced Advantage for house goal, Target Maturity, Gold ETF.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 bg-white rounded-2xl border border-warm-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <span className="text-xs font-black text-warm-900">Month 6 · First Review</span>
                </div>
                <p className="text-[11px] text-warm-600 pl-7 leading-relaxed font-medium">
                  Audit portfolio drift, verify health insurance cashless cards, zero panic tweaks.
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-3.5 bg-white rounded-2xl border border-warm-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    5
                  </span>
                  <span className="text-xs font-black text-warm-900">Every Year · Step Up</span>
                </div>
                <p className="text-[11px] text-warm-600 pl-7 leading-relaxed font-medium">
                  Increase SIPs by 5–10% annually with salary hike to outpace inflation and compress house timeline.
                </p>
              </div>
            </div>

            {advisorVerified && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>SEBI RIA Advisor Endorsement</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed italic font-medium">
                  &quot;{advisorNotes}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
