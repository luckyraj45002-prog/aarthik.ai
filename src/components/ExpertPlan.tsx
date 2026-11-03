import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface ExpertPlanProps {
  onOpenAdvisorModal?: () => void;
}

interface AccordionPlanItem {
  id: string;
  number: number;
  title: string;
  reason: string;
  timeHorizon: string;
  downside: string;
  recommendedTag?: string;
  allocationPercent?: number; // % of monthly surplus
}

export const EXPERT_PLAN_ITEMS: AccordionPlanItem[] = [
  {
    id: 'round-up-sip',
    number: 1,
    title: '1. Round-up SIP',
    reason: 'Automatically invests spare change from everyday digital transactions into micro-index baskets.',
    timeHorizon: '1–3 years',
    downside: 'Inflow depends on discretionary spending volume.',
    recommendedTag: 'Habit Consistency',
    allocationPercent: 0.02,
  },
  {
    id: 'step-up-sip',
    number: 2,
    title: '2. Step-up SIP',
    reason: 'Automatically escalates monthly SIP contribution by 10% each year in line with annual salary increments.',
    timeHorizon: '5+ years',
    downside: 'Requires consistent yearly income growth.',
    recommendedTag: 'House Goal Accelerator',
    allocationPercent: 0.25,
  },
  {
    id: 'target-maturity-fund',
    number: 3,
    title: '3. Target Maturity Fund',
    reason: 'Low-risk debt allocation with predictable yields locked to match your house down payment timeline.',
    timeHorizon: '3–4 years',
    downside: 'Pre-tax returns will be lower than pure equity during bull markets.',
    recommendedTag: 'Capital Preservation',
    allocationPercent: 0.16,
  },
  {
    id: 'liquid-fund',
    number: 4,
    title: '4. Liquid fund',
    reason: 'Immediate redemption liquidity for your Safeguard Emergency Lockbox buffer.',
    timeHorizon: 'Instant / Anytime',
    downside: 'Returns just keep pace with savings account/FD rates.',
    recommendedTag: 'Emergency Buffer',
    allocationPercent: 0.14,
  },
  {
    id: 'gold-etf',
    number: 5,
    title: '5. Gold ETF',
    reason: 'Non-correlated hedge against rupee depreciation and inflation without physical making/storage charges.',
    timeHorizon: '3+ years',
    downside: 'Zero dividend or coupon cash flow.',
    recommendedTag: 'Inflation Hedge',
    allocationPercent: 0.05,
  },
  {
    id: 'nps-tier-1',
    number: 6,
    title: '6. NPS Tier I',
    reason: 'Tax benefit and retirement savings.',
    timeHorizon: 'Until retirement',
    downside: 'Money is locked until retirement.',
    recommendedTag: 'Section 80CCD(1B)',
    allocationPercent: 0.10,
  },
  {
    id: 'reit',
    number: 7,
    title: '7. REIT',
    reason: 'Real estate exposure with a small amount.',
    timeHorizon: '5+ years',
    downside: 'Prices can fall and payouts can vary.',
    recommendedTag: 'Commercial Real Estate Yield',
    allocationPercent: 0.08,
  },
  {
    id: 'balanced-advantage',
    number: 8,
    title: '8. Arbitrage or Balanced Advantage fund',
    reason: 'Lower volatility for a calmer ride.',
    timeHorizon: '3 years',
    downside: 'Returns can lag pure equity.',
    recommendedTag: 'Dynamic Asset Allocation',
    allocationPercent: 0.20,
  },
];

export const ExpertPlan: React.FC<ExpertPlanProps> = ({ onOpenAdvisorModal }) => {
  const { monthlySurplus, advisorVerified } = useFinancialStore();

  // Accordion state - items 6, 7, 8 expanded by default (or toggleable)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'round-up-sip': false,
    'step-up-sip': false,
    'target-maturity-fund': false,
    'liquid-fund': false,
    'gold-etf': false,
    'nps-tier-1': true,
    'reit': true,
    'balanced-advantage': true,
  });

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    EXPERT_PLAN_ITEMS.forEach((item) => {
      allExpanded[item.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & Fiduciary Trust Badge */}
      <div className="bg-gradient-to-r from-warm-100 via-white to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pill Badge: Expert-approved options (emerald badge) */}
            <span className="clay-badge-green inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Expert-approved options</span>
            </span>

            {advisorVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                <Award className="w-3.5 h-3.5 text-purple-700" />
                <span>SEBI RIA Certified Sign-Off</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Your expert-prepared plan
          </h1>

          <p className="text-sm font-semibold text-warm-600 max-w-2xl leading-relaxed">
            Delivered 24 hours after submission. AI never chooses your investments. A registered expert does.
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-white border border-warm-200 text-warm-700 hover:bg-warm-50 text-xs font-bold shadow-clay-sm transition-all"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-white border border-warm-200 text-warm-700 hover:bg-warm-50 text-xs font-bold shadow-clay-sm transition-all"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 2. 8 Interactive Accordion Cards */}
      <div className="space-y-4">
        {EXPERT_PLAN_ITEMS.map((item) => {
          const isExpanded = !!expandedItems[item.id];
          const monthlyAmount = item.allocationPercent ? Math.round(monthlySurplus * item.allocationPercent) : 0;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border transition-all duration-200 ${
                isExpanded
                  ? 'border-purple-300 shadow-clay ring-1 ring-purple-100'
                  : 'border-warm-200 shadow-clay-sm hover:border-warm-300'
              }`}
            >
              {/* Accordion Header Row */}
              <div
                onClick={() => toggleItem(item.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-black transition-colors ${
                      isExpanded
                        ? 'bg-[#7C3AED] text-white shadow-clay-btn'
                        : 'bg-warm-100 text-warm-700'
                    }`}
                  >
                    {item.number}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-warm-900 tracking-tight">
                      {item.title}
                    </h3>
                    {item.recommendedTag && (
                      <span className="text-[11px] font-bold text-warm-500 mt-0.5 block">
                        {item.recommendedTag}
                        {monthlyAmount > 0 && ` • ~${formatINR(monthlyAmount)}/mo recommended`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Why this? Expandable Purple/Violet Button */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      isExpanded
                        ? 'bg-[#7C3AED] text-white shadow-clay-btn'
                        : 'bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200'
                    }`}
                  >
                    <span>Why this?</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Accordion Body: Reason, Time horizon, Downside */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-warm-100 space-y-3 text-sm animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200/80 space-y-2.5">
                    {/* Reason */}
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED] flex-shrink-0 mt-1.5" />
                      <div>
                        <strong className="font-black text-warm-900 mr-1.5">Reason:</strong>
                        <span className="text-warm-800 font-medium leading-relaxed">{item.reason}</span>
                      </div>
                    </div>

                    {/* Time horizon */}
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-warm-500 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="font-black text-warm-900 mr-1.5">Time horizon:</strong>
                        <span className="text-warm-800 font-medium">{item.timeHorizon}</span>
                      </div>
                    </div>

                    {/* Downside */}
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="font-black text-rose-600 mr-1.5">Downside:</strong>
                        <span className="text-warm-800 font-medium leading-relaxed">{item.downside}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Draft & Verify Fiduciary Card at Bottom */}
      <div className="bg-gradient-to-br from-warm-100 via-white to-purple-50 rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-900">
              SEBI RIA Governance Protocol
            </span>
          </div>
          <p className="text-sm font-bold text-warm-800 leading-relaxed">
            Draft &amp; Verify (advisor dashboard) is already built. SEBI-registered fee-only planners review your 1-page dossier without commissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAdvisorModal && onOpenAdvisorModal()}
          className="clay-btn-primary px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2.5 shadow-clay-btn hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
        >
          <Award className="w-4 h-4 text-white" />
          <span>Verify with Certified Planner (SEBI RIA)</span>
          <ArrowRight className="w-4 h-4 text-white ml-0.5" />
        </button>
      </div>

    </div>
  );
};

export default ExpertPlan;
