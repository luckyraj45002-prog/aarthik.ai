import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  CheckCircle2,
  Award,
  Send,
  Building,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Calculator,
  Sliders,
  DollarSign,
  PieChart,
  Target,
  Zap,
  Info,
  X,
  BookmarkCheck,
  Check,
} from 'lucide-react';

interface PersonalizedPlanModuleProps {
  onOpenAdvisorModal: () => void;
}

export interface InvestmentOption {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  tickerExample: string;
  category: 'Safe' | 'Balanced' | 'Growth' | 'Diversifier';
  goalAlignment: 'House Down Payment' | 'Emergency Liquidity' | 'Tax & Retirement' | 'Capital Hedge';
  allocationPercent: number; // Decimal % of surplus (e.g., 0.25 = 25%)
  timeHorizon: string;
  targetYears: number;
  expectedCagr: number; // Annual % return estimate
  minMonthlyAmount: number;
  
  // Why this
  whyThis: string;
  whyThisHighlights: string[];

  // Benefits
  benefits: {
    returns: string;
    taxAdvantage: string;
    liquidity: string;
    safetyCompounding: string;
  };

  // Downsides
  downside: string;
  riskLevel: 'Low' | 'Moderate' | 'High';

  // How to invest
  howToInvest: {
    recommendedPlatforms: string[];
    planType: 'Direct - Growth' | 'Sovereign / Demat' | 'CAMS / NPS Portal';
    minimumSip: string;
    recommendedDate: string;
    steps: string[];
    proTip: string;
  };
}

export const INVESTMENT_OPTIONS: InvestmentOption[] = [
  {
    id: 'opt-equity-sip',
    number: 1,
    title: 'Step-up Equity Index SIP (Nifty 50 / LargeMidcap 250)',
    subtitle: 'Primary House Goal Accumulation Engine',
    tickerExample: 'UTI Nifty 50 Index Fund Direct-Growth / Navi LargeMidcap 250',
    category: 'Balanced',
    goalAlignment: 'House Down Payment',
    allocationPercent: 0.25, // 25% of surplus
    timeHorizon: '4 Years (Matches House Goal Deadline)',
    targetYears: 4,
    expectedCagr: 12.5,
    minMonthlyAmount: 1000,
    whyThis:
      'Provides systematic inflation-beating growth without individual stock picking risk. Designed to increase contributions by 10% annually with salary appraisals to reach the ₹60 Lakh house down payment 9 months ahead of schedule.',
    whyThisHighlights: [
      'Captures the top 50–250 corporate giants driving Indian GDP growth',
      'Ultra-low expense ratio (~0.10–0.20%) vs 1.5% active mutual funds',
      'Automated annual step-up neutralizes lifestyle inflation',
    ],
    benefits: {
      returns: '12–14% historical annualized CAGR across 4+ year rolling windows.',
      taxAdvantage: 'LTCG tax exempt up to ₹1.25 Lakh per financial year; gains above taxed at flat 12.5%.',
      liquidity: 'No lock-in period; T+1 redemption directly into your verified bank account.',
      safetyCompounding: 'Rupee-cost averaging mitigates market volatility by accumulating more units during market dips.',
    },
    downside:
      'Equity markets undergo periodic short-term corrections of 10–15%. Requires strict behavioral discipline to avoid stopping SIPs during corrections.',
    riskLevel: 'Moderate',
    howToInvest: {
      recommendedPlatforms: ['Zerodha Coin', 'Groww', 'MF Central (Official Karvy/CAMS)', 'Kuvera'],
      planType: 'Direct - Growth',
      minimumSip: '₹500 / month (Recommended: Allocate full live monthly share)',
      recommendedDate: '3rd or 5th of every month (Immediately post salary credit)',
      steps: [
        'Open your chosen zero-commission investment platform (Zerodha Coin, Groww, or MF Central).',
        'Search for the fund name: Make sure it says "DIRECT - GROWTH", not "Regular". Direct plans save 1.2% in annual commissions.',
        'Choose "Monthly SIP" and set auto-debit date to 3rd of the month.',
        'Set Mandate via UPI Autopay or e-NACH NetBanking mandate.',
        'Toggle "Annual Step-Up" to 10% so contributions scale automatically with salary appraisals.',
      ],
      proTip: 'Never opt for "Dividend / IDCW" payout options for goal accumulation. Always select "Growth" so earnings reinvest automatically.',
    },
  },
  {
    id: 'opt-target-maturity',
    number: 2,
    title: 'Target Maturity Debt Index Fund (2028-2029 Maturity)',
    subtitle: 'Predictable Fixed-Income House Goal Anchor',
    tickerExample: 'Bharat Bond ETF / Edelweiss CRISIL IBX 50:50 Gilt Plus SDL 2028',
    category: 'Safe',
    goalAlignment: 'House Down Payment',
    allocationPercent: 0.16, // 16% of surplus
    timeHorizon: '4 Years (Locked to House Purchase Year)',
    targetYears: 4,
    expectedCagr: 7.4,
    minMonthlyAmount: 1000,
    whyThis:
      'Unlike open-ended bond funds where interest rates fluctuate your capital, Target Maturity Funds roll down maturity to 2028. You lock in a predictable yield (~7.2–7.5%) with zero credit risk because underlying papers are Sovereign Government of India Gilts and State Development Loans.',
    whyThisHighlights: [
      'Eliminates interest rate duration risk as maturity approaches',
      'Backed 100% by Sovereign Govt of India & State Loans (AAA Equivalent)',
      'Locks in known maturity value for the ₹60 Lakh house down payment',
    ],
    benefits: {
      returns: 'Predictable Yield-to-Maturity (YTM ~7.4% p.a.) if held to maturity.',
      taxAdvantage: 'No annual tax until redemption; interest compounds pre-tax inside the fund.',
      liquidity: 'Traded on exchange or redeemable with AMC anytime, but holding to maturity guarantees the target yield.',
      safetyCompounding: 'Zero default risk; backed by Sovereign Government and State guarantees.',
    },
    downside:
      'Post-April 2023 tax changes, gains are taxed at your income tax slab rate upon withdrawal. Yield is capped to the entry YTM.',
    riskLevel: 'Low',
    howToInvest: {
      recommendedPlatforms: ['Zerodha Kite', 'Groww', 'Edelweiss Mutual Fund Direct', 'CAMS'],
      planType: 'Direct - Growth',
      minimumSip: '₹1,000 / month',
      recommendedDate: '5th of each month',
      steps: [
        'Search for "Bharat Bond 2028" or "CRISIL SDL Gilt 2028 Direct Plan".',
        'Verify that the maturity year matches your house goal target year (4 years out).',
        'Enter monthly SIP allocation amount.',
        'Authorize auto-debit mandate via your primary salary bank.',
      ],
      proTip: 'Target Maturity funds are far superior to Bank Fixed Deposits because you do NOT pay tax every year on accrued interest. Tax is deferred until the house is purchased.',
    },
  },
  {
    id: 'opt-liquid-fund',
    number: 3,
    title: 'Instant Liquid Fund (Safeguard Lockbox Tier 2)',
    subtitle: '3 to 6 Month Family Crisis Cushion',
    tickerExample: 'Parag Parikh Liquid Fund Direct / HDFC Liquid Fund Direct-Growth',
    category: 'Safe',
    goalAlignment: 'Emergency Liquidity',
    allocationPercent: 0.14, // 14% of surplus
    timeHorizon: 'Instant to T+1 Working Day',
    targetYears: 1,
    expectedCagr: 6.8,
    minMonthlyAmount: 500,
    whyThis:
      'Your Tier 1 bank account covers ₹2L instant cash for parents and bills. This Tier 2 Liquid Fund houses the remaining ₹4.5L emergency buffer, earning 6.7–7.0% (vs 2.7% in bank savings) with instant withdrawal up to ₹50,000 within 30 seconds.',
    whyThisHighlights: [
      'Instant redemption facility: up to ₹50,000 or 90% credited to bank in 30 seconds 24/7',
      'Invests only in 91-day Treasury Bills and top-tier commercial paper',
      'Zero equity risk; immune to stock market crashes',
    ],
    benefits: {
      returns: '6.7–7.1% annualized yield, significantly outpacing standard savings accounts.',
      taxAdvantage: 'Tax is deducted only upon redemption, not quarterly like bank savings.',
      liquidity: 'Instant instant-redemption API + balance within 24 hours (T+1).',
      safetyCompounding: 'Protected against stock crashes; principal remains rock-solid during emergencies.',
    },
    downside:
      'Not designed for wealth creation. Retaining more than 6 months of living expenses here creates cash drag against long-term inflation.',
    riskLevel: 'Low',
    howToInvest: {
      recommendedPlatforms: ['Direct AMC Portal (HDFC / Parag Parikh)', 'Groww', 'Zerodha Coin'],
      planType: 'Direct - Growth',
      minimumSip: '₹500 / month (or lump-sum surplus allocation)',
      recommendedDate: 'Immediately upon salary intake',
      steps: [
        'Visit Parag Parikh or HDFC Mutual Fund directly (or use Groww/Coin).',
        'Choose "Liquid Fund Direct Growth".',
        'Setup monthly transfer until Tier 2 emergency fund target (₹4,50,000) is filled.',
        'Verify your bank account for 1-click Instant Redemption.',
      ],
      proTip: 'Keep the AMC app installed on your phone. In case of medical emergencies, hit "Instant Redeem" and money lands in your bank in 60 seconds.',
    },
  },
  {
    id: 'opt-gold-etf',
    number: 4,
    title: 'Sovereign / Digital Gold ETF',
    subtitle: 'Sovereign Digital Inflation & Geopolitical Hedge',
    tickerExample: 'Nippon India Gold ETF / SGB Secondary Tranche / ICICI Gold ETF',
    category: 'Diversifier',
    goalAlignment: 'Capital Hedge',
    allocationPercent: 0.05, // 5% of surplus
    timeHorizon: '5–10+ Years',
    targetYears: 5,
    expectedCagr: 9.5,
    minMonthlyAmount: 500,
    whyThis:
      'Acts as an essential shock absorber for your family net worth during global macroeconomic turmoil, crude oil spikes, and currency devaluation. Unlike physical jewelry, digital gold has zero making charges, zero storage risk, and guaranteed 99.5% purity.',
    whyThisHighlights: [
      'Eliminates 15–25% jewelry making-charge and locker storage costs',
      'Historically has zero or negative correlation with equity market drawdowns',
      'Provides purchasing power protection against rupee currency depreciation',
    ],
    benefits: {
      returns: '9–11% historical long-term rupee inflation hedge.',
      taxAdvantage: 'If purchased as Sovereign Gold Bond in secondary market and held to maturity, capital gains are 100% TAX-FREE.',
      liquidity: 'Can be bought or sold instantly in seconds during stock market hours via Demat.',
      safetyCompounding: 'Regulated by SEBI; backed 1:1 by physical allocated gold in secure vaults.',
    },
    downside:
      'Gold generates no business profits, interest, or dividends. Allocation must be capped at 5–8% of net worth.',
    riskLevel: 'Moderate',
    howToInvest: {
      recommendedPlatforms: ['Zerodha Kite', 'Groww', 'Upstox', 'ICICI Direct'],
      planType: 'Sovereign / Demat',
      minimumSip: '1 gram or ₹500 ETF units',
      recommendedDate: 'Any market trading day',
      steps: [
        'Log in to your Demat broker account (Zerodha, Groww, etc.).',
        'Search for ticker: "GOLDBEES" or "SGB" (Sovereign Gold Bond on NSE/BSE).',
        'Set up a monthly SIP for 1–2 units (approx 5% of your surplus).',
        'Units are credited directly to your CDSL/NSDL Demat account.',
      ],
      proTip: 'Look for Sovereign Gold Bonds (SGB) trading at a discount on the secondary market. They pay an additional 2.5% annual cash interest on initial value!',
    },
  },
  {
    id: 'opt-nps',
    number: 5,
    title: 'National Pension System (NPS Tier I - Active Choice)',
    subtitle: 'Section 80CCD(1B) Tax Shield & Retirement Compounding',
    tickerExample: 'NPS Tier 1 (75% Equity E + 25% Corporate Bonds C)',
    category: 'Growth',
    goalAlignment: 'Tax & Retirement',
    allocationPercent: 0.10, // 10% of surplus
    timeHorizon: 'Until Age 60 (Retirement Compounder)',
    targetYears: 32,
    expectedCagr: 11.2,
    minMonthlyAmount: 500,
    whyThis:
      'Offers an exclusive ₹50,000 tax deduction under Section 80CCD(1B) over and above Section 80C. For someone in the 30% tax bracket, this saves ₹15,600 in direct tax cash every year while running on the lowest expense ratio in the world (0.09%).',
    whyThisHighlights: [
      'Lowest investment management fee in the world (0.09% p.a.)',
      'Exclusive ₹50,000 additional tax shield saves ~₹15,600 cash in taxes',
      'Forced lock-in prevents impulsive early liquidation of retirement capital',
    ],
    benefits: {
      returns: '10–12% historical annualized returns with 75% equity allocation (Scheme E).',
      taxAdvantage: 'Tax deduction under 80CCD(1B) + 60% lump-sum withdrawal at retirement is 100% tax-free.',
      liquidity: 'Partial withdrawals permitted for house construction, child education, or medical treatment.',
      safetyCompounding: 'Regulated by PFRDA with fund managers like HDFC, ICICI, SBI Pension Funds.',
    },
    downside:
      'Strict lock-in until age 60. At retirement, minimum 40% of maturity corpus must be converted into a monthly pension annuity.',
    riskLevel: 'Moderate',
    howToInvest: {
      recommendedPlatforms: ['NPS Trust Portal (enps.nsdl.com)', 'CAMS NPS', 'Groww NPS / Zerodha'],
      planType: 'CAMS / NPS Portal',
      minimumSip: '₹1,000 / contribution (₹50,000/year optimizes tax)',
      recommendedDate: 'Monthly or quarterly SIP',
      steps: [
        'Visit enps.nsdl.com or your banking netbanking portal (HDFC/ICICI).',
        'Register for PRAN (Permanent Retirement Account Number) using Aadhaar KYC.',
        'Choose "Active Choice" and select Pension Fund Manager (e.g. HDFC Pension Management).',
        'Select Asset Allocation: 75% Equity (E), 15% Corporate Bonds (C), 10% Govt Bonds (G).',
        'Contribute via UPI or NetBanking and download Section 80CCD(1B) tax receipt.',
      ],
      proTip: 'Always choose "Active Choice" with 75% Equity (Scheme E) when under age 35. Do not use default Auto-Choice which allocates too conservatively.',
    },
  },
  {
    id: 'opt-arbitrage-baf',
    number: 6,
    title: 'Balanced Advantage or Arbitrage Fund',
    subtitle: 'Dynamic Valuation Hedging for Volatility Cushion',
    tickerExample: 'ICICI Prudential Balanced Advantage / Kotak Arbitrage Fund Direct',
    category: 'Balanced',
    goalAlignment: 'House Down Payment',
    allocationPercent: 0.20, // 20% of surplus
    timeHorizon: '3–4 Years',
    targetYears: 4,
    expectedCagr: 9.8,
    minMonthlyAmount: 1000,
    whyThis:
      'Dynamically shifts allocation between equities and debt based on market P/E valuations. When markets peak, it automatically books profits into debt; when markets fall, it aggressively buys cheap equities. You get smooth compounding without panic.',
    whyThisHighlights: [
      'Automated counter-cyclical asset allocation without tax incidence',
      'Provides 70–80% of equity upside with only 40–50% of the downside volatility',
      'Treated as Equity Fund for tax purposes (enjoys 12.5% LTCG benefit)',
    ],
    benefits: {
      returns: '9–11% CAGR with significantly lower standard deviation than pure equities.',
      taxAdvantage: 'Taxed as an equity mutual fund (LTCG 12.5% after ₹1.25L exemption) despite holding high debt/hedged positions.',
      liquidity: 'Redeemable anytime with T+1 settlement.',
      safetyCompounding: 'Internal automated hedging protects house goal capital from bear market shocks.',
    },
    downside:
      'Underperforms pure equity mutual funds during furious speculative bull runs.',
    riskLevel: 'Moderate',
    howToInvest: {
      recommendedPlatforms: ['Groww', 'Zerodha Coin', 'Kuvera', 'ICICI Prudential AMC'],
      planType: 'Direct - Growth',
      minimumSip: '₹1,000 / month',
      recommendedDate: '5th of every month',
      steps: [
        'Open platform and search for "ICICI Prudential Balanced Advantage Direct-Growth" or "Edelweiss Balanced Advantage".',
        'Select "Direct Plan - Growth".',
        'Schedule Monthly SIP with your primary account.',
      ],
      proTip: 'Ideal bridge asset for the house goal: In year 3 and 4, this fund preserves accumulated profits from stock market drops.',
    },
  },
  {
    id: 'opt-reit',
    number: 7,
    title: 'Real Estate Investment Trust (REIT)',
    subtitle: 'Commercial Grade-A Rental Income & Capital Growth',
    tickerExample: 'Embassy Office Parks REIT / Brookfield India Real Estate Trust',
    category: 'Balanced',
    goalAlignment: 'Capital Hedge',
    allocationPercent: 0.08, // 8% of surplus
    timeHorizon: '5+ Years',
    targetYears: 5,
    expectedCagr: 10.5,
    minMonthlyAmount: 1000,
    whyThis:
      'Allows you to own fractions of premier Grade-A commercial tech parks (tenanted by Google, Microsoft, TCS) starting from just ₹400. Mandated by SEBI to distribute 90% of net rental income to unit holders as quarterly dividends.',
    whyThisHighlights: [
      'Own high-end IT parks without dealing with physical tenants, maintenance, or registration fees',
      'Mandatory 90% rental cash-flow distribution to your bank account every quarter',
      'Inflation-linked rent escalation clauses (10–15% rent hikes every 3 years)',
    ],
    benefits: {
      returns: '6–7% annual distribution dividend yield + 4–5% capital appreciation.',
      taxAdvantage: 'Portion of dividend and repayment of capital is tax-exempt for investors.',
      liquidity: 'Traded on NSE/BSE stock exchanges like regular shares with instant liquidity.',
      safetyCompounding: 'Institutional Grade-A occupancy with 5–10 year lease contracts.',
    },
    downside:
      'Prices fluctuate with commercial office demand, work-from-home trends, and interest rate cycles.',
    riskLevel: 'Moderate',
    howToInvest: {
      recommendedPlatforms: ['Zerodha Kite', 'Groww', 'Upstox'],
      planType: 'Sovereign / Demat',
      minimumSip: '1 unit (Approx ₹350–₹400)',
      recommendedDate: 'Quarterly or monthly accumulation',
      steps: [
        'Log in to your Demat broker.',
        'Search for: "EMBASSY" or "BIRET" or "NEXUS" on NSE.',
        'Buy units directly during market hours (9:15 AM - 3:30 PM).',
        'Dividends will be credited directly to your linked bank account every quarter.',
      ],
      proTip: 'Reinvest the quarterly dividend payouts back into your Equity Index SIP to compound returns exponentially.',
    },
  },
  {
    id: 'opt-micro-sip',
    number: 8,
    title: 'Round-Up Auto Micro-SIP',
    subtitle: 'Daily Spare-Change Consistency Engine',
    tickerExample: 'Daily Nifty Index / Liquid Micro-SIP (₹50–₹100/day)',
    category: 'Safe',
    goalAlignment: 'Emergency Liquidity',
    allocationPercent: 0.02, // 2% of surplus
    timeHorizon: 'Continuous Habit Building',
    targetYears: 1,
    expectedCagr: 11.5,
    minMonthlyAmount: 100,
    whyThis:
      'Turns daily digital spending habits into effortless wealth accumulation. Rounds up everyday UPI grocery or coffee spends to the nearest ₹50 or ₹100 and sweeps the difference into a micro-SIP.',
    whyThisHighlights: [
      'Painless investing: accumulates wealth from daily cash change without feeling any budget pinch',
      'Instills continuous financial discipline without manual intervention',
      'Builds an auxiliary travel or gadget fund without touching core income',
    ],
    benefits: {
      returns: '11–13% compounding from otherwise idle daily transaction rounding.',
      taxAdvantage: 'Standard mutual fund tax rules apply.',
      liquidity: 'Can be paused or withdrawn at any time.',
      safetyCompounding: 'Daily micro-dollar cost averaging eliminates market timing anxiety.',
    },
    downside:
      'Requires Open Banking / Account Aggregator integration. Transaction amounts are small, so results become noticeable after 12+ months.',
    riskLevel: 'Low',
    howToInvest: {
      recommendedPlatforms: ['Jar App', 'Siply', 'Jupiter Money', 'Fi Money'],
      planType: 'Direct - Growth',
      minimumSip: '₹10 / day or spare change round-up',
      recommendedDate: 'Daily automated trigger',
      steps: [
        'Download an account aggregator micro-savings app like Jupiter or Jar.',
        'Link your primary UPI handle.',
        'Enable "Round-up transactions to nearest ₹50".',
        'Set daily cap (e.g. max ₹150/day).',
      ],
      proTip: 'Great psychological trick: whenever you feel the urge to order takeout, transfer ₹200 to this micro-SIP instead.',
    },
  },
];

export const PersonalizedPlanModule: React.FC<PersonalizedPlanModuleProps> = ({
  onOpenAdvisorModal,
}) => {
  const {
    profile,
    monthlySurplus,
    advisorVerified,
    advisorNotes,
    dossierDispatched,
    dispatchDossier,
    addToast,
  } = useFinancialStore();

  const [activeGoalFilter, setActiveGoalFilter] = useState<string>('all');
  const [selectedOptionForModal, setSelectedOptionForModal] = useState<InvestmentOption | null>(null);
  const [configuredOptions, setConfiguredOptions] = useState<Record<string, boolean>>({
    'opt-equity-sip': true,
    'opt-liquid-fund': true,
  });

  // Interactive Calculator state in modal
  const [calcMonthly, setCalcMonthly] = useState<number>(15000);
  const [calcYears, setCalcYears] = useState<number>(4);
  const [calcRate, setCalcRate] = useState<number>(12);

  const filteredOptions = useMemo(() => {
    if (activeGoalFilter === 'all') return INVESTMENT_OPTIONS;
    return INVESTMENT_OPTIONS.filter((opt) => opt.goalAlignment === activeGoalFilter);
  }, [activeGoalFilter]);

  // Total allocated surplus
  const totalAllocatedAmount = useMemo(() => {
    return Math.round(
      INVESTMENT_OPTIONS.reduce((sum, item) => sum + monthlySurplus * item.allocationPercent, 0)
    );
  }, [monthlySurplus]);

  // Open How to Invest Modal
  const openInvestModal = (option: InvestmentOption) => {
    const defaultMonthly = Math.round(monthlySurplus * option.allocationPercent);
    setSelectedOptionForModal(option);
    setCalcMonthly(defaultMonthly > 0 ? defaultMonthly : 5000);
    setCalcYears(option.targetYears);
    setCalcRate(option.expectedCagr);
  };

  // Toggle configured status
  const toggleConfigured = (id: string) => {
    setConfiguredOptions((prev) => {
      const next = !prev[id];
      addToast({
        type: next ? 'success' : 'info',
        title: next ? 'Instrument Configured' : 'Status Updated',
        description: next
          ? 'Marked as active in your monthly financial mandate.'
          : 'Removed from active tracking list.',
      });
      return { ...prev, [id]: next };
    });
  };

  // SIP Future Value Projection Calculation
  const projectedCorpus = useMemo(() => {
    const P = calcMonthly;
    const n = calcYears * 12;
    const r = calcRate / 100 / 12;
    if (r === 0 || n === 0) {
      const inv = P * n;
      return { invested: inv, returns: 0, total: inv };
    }
    const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const returns = fv - invested;
    return {
      invested: Math.round(invested),
      returns: Math.round(returns),
      total: Math.round(fv),
    };
  }, [calcMonthly, calcYears, calcRate]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO STRATEGIC BLUEPRINT HEADER */}
      <div className="clay-card-warm p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Core Architectural Prototype · Main Module</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold clay-badge-green">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SEBI Fiduciary Formulated</span>
              </span>

              {advisorVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800">
                  <Award className="w-3.5 h-3.5 text-purple-700" />
                  RIA Certified Sign-Off
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-warm-900 tracking-tight">
              Personalized Investment Blueprint
            </h1>

            <p className="text-sm font-semibold text-warm-700 leading-relaxed">
              Every single rupee of your <span className="text-purple-800 font-black">{formatINR(monthlySurplus)}/mo</span> surplus is mathematically mapped to a specific goal, time period, and risk-calibrated asset class. AI diagnoses and optimizes cash flow; registered fiduciary experts audit the instruments.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!dossierDispatched ? (
              <button
                onClick={dispatchDossier}
                className="clay-btn-primary px-5 py-3.5 text-xs font-black flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-purple-200" />
                <span>Submit to Certified Planner</span>
              </button>
            ) : (
              <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2 shadow-clay-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dossier Active in Review Queue</span>
              </div>
            )}

            <button
              onClick={onOpenAdvisorModal}
              className="clay-btn-secondary px-5 py-3.5 text-xs font-black flex items-center justify-center gap-2"
            >
              <Building className="w-4 h-4 text-warm-700" />
              <span>B2B2C Advisor Portal</span>
            </button>
          </div>
        </div>

        {/* 4 Diagnostic Anchor Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-warm-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Dynamic Monthly Surplus</span>
              <DollarSign className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-lg font-black text-warm-900">{formatINR(monthlySurplus)}</p>
            <span className="text-[10px] text-warm-400 font-semibold block">Calculated from income - EMIs</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-warm-500">
              <span className="text-[10px] font-black uppercase tracking-wider">House Goal Deadline</span>
              <Target className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-emerald-900">4 Years (2028)</p>
            <span className="text-[10px] text-warm-400 font-semibold block">Target: ₹60 Lakh down payment</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-warm-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Allocated Portfolio</span>
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-lg font-black text-warm-900">{formatINR(totalAllocatedAmount)}/mo</p>
            <span className="text-[10px] text-warm-400 font-semibold block">100% of diagnostic surplus mapped</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-warm-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Execution Readiness</span>
              <BookmarkCheck className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-lg font-black text-purple-900">
              {Object.values(configuredOptions).filter(Boolean).length} of {INVESTMENT_OPTIONS.length} Active
            </p>
            <span className="text-[10px] text-warm-400 font-semibold block">Interactive mandate checklist</span>
          </div>
        </div>
      </div>

      {/* 2. GOAL FILTER PILLS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-black text-warm-500 uppercase tracking-wider mr-1">Filter Goal:</span>
          {[
            { id: 'all', label: 'All 8 Investment Options' },
            { id: 'House Down Payment', label: '🏠 House Goal (4 Years)' },
            { id: 'Emergency Liquidity', label: '🛡️ Emergency Safeguard' },
            { id: 'Tax & Retirement', label: '🌱 Tax & Retirement' },
            { id: 'Capital Hedge', label: '🪙 Hedges & Alternative Yield' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveGoalFilter(filter.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeGoalFilter === filter.id
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-warm-500">
          Showing {filteredOptions.length} of {INVESTMENT_OPTIONS.length} Options
        </div>
      </div>

      {/* 3. CORE INVESTMENT OPTIONS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOptions.map((option) => {
          const allocatedVal = Math.round(monthlySurplus * option.allocationPercent);
          const isConfigured = !!configuredOptions[option.id];

          return (
            <div
              key={option.id}
              className="clay-card p-6 sm:p-7 rounded-3xl border border-warm-200 transition-all hover:border-purple-300 space-y-6"
            >
              {/* Option Top Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-warm-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 font-black text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                    {option.number}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-warm-900">
                        {option.title}
                      </h3>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          option.category === 'Safe'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : option.category === 'Balanced'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : option.category === 'Growth'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {option.category} Asset Class
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
                        {option.goalAlignment}
                      </span>
                    </div>
                    <p className="text-xs text-warm-500 font-semibold mt-0.5">{option.subtitle}</p>
                    <p className="text-[11px] text-purple-700 font-mono font-medium mt-1">
                      Example: {option.tickerExample}
                    </p>
                  </div>
                </div>

                {/* Right Allocation Stat & Actions */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-base font-black text-purple-900 block leading-tight">
                      {formatINR(allocatedVal)} / mo
                    </span>
                    <span className="text-[10px] text-warm-400 font-bold">
                      {Math.round(option.allocationPercent * 100)}% of monthly surplus
                    </span>
                  </div>

                  <button
                    onClick={() => toggleConfigured(option.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      isConfigured
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-warm-100 text-warm-600 hover:text-warm-900'
                    }`}
                    title={isConfigured ? 'Active in your plan' : 'Mark as active'}
                  >
                    <Check className={`w-3.5 h-3.5 ${isConfigured ? 'text-emerald-700' : 'text-warm-400'}`} />
                    <span>{isConfigured ? 'Active' : 'Mark Active'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Pillars Grid (Why This, Time Period, Benefits, Downsides) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. WHY THIS */}
                <div className="p-4 rounded-2xl bg-white border border-warm-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-purple-800">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider">1. Why This?</span>
                  </div>
                  <p className="text-xs text-warm-700 font-medium leading-relaxed">
                    {option.whyThis}
                  </p>
                  <ul className="space-y-1 pt-1 border-t border-warm-100">
                    {option.whyThisHighlights.map((hl, i) => (
                      <li key={i} className="text-[10px] text-warm-600 flex items-start gap-1.5 font-semibold">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. TIME PERIOD */}
                <div className="p-4 rounded-2xl bg-white border border-warm-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-purple-800">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider">2. Time Horizon</span>
                  </div>
                  <p className="text-xs font-black text-warm-900">
                    {option.timeHorizon}
                  </p>
                  <div className="p-2.5 rounded-xl bg-purple-50 text-[11px] text-purple-900 font-semibold space-y-1">
                    <span className="block font-black text-[10px] text-purple-700 uppercase">Holding Rule:</span>
                    <span>Hold for at least {option.targetYears} years to smooth economic cycles and secure optimal compounding.</span>
                  </div>
                  <div className="text-[10px] text-warm-500 font-semibold">
                    Expected Historical Return: <span className="font-bold text-warm-800">~{option.expectedCagr}% CAGR</span>
                  </div>
                </div>

                {/* 3. BENEFITS */}
                <div className="p-4 rounded-2xl bg-white border border-warm-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider">3. Key Benefits</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <span className="font-black text-warm-900 block">Returns:</span>
                      <span className="text-warm-600 font-medium">{option.benefits.returns}</span>
                    </div>
                    <div>
                      <span className="font-black text-warm-900 block">Tax Advantage:</span>
                      <span className="text-warm-600 font-medium">{option.benefits.taxAdvantage}</span>
                    </div>
                    <div>
                      <span className="font-black text-warm-900 block">Liquidity:</span>
                      <span className="text-warm-600 font-medium">{option.benefits.liquidity}</span>
                    </div>
                  </div>
                </div>

                {/* 4. DOWNSIDES & RISKS */}
                <div className="p-4 rounded-2xl bg-white border border-warm-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider">4. Downsides &amp; Risks</span>
                  </div>
                  <p className="text-xs text-warm-700 font-medium leading-relaxed">
                    {option.downside}
                  </p>
                  <div className="p-2 rounded-xl bg-red-50 text-[10px] font-bold text-red-800">
                    Risk Classification: {option.riskLevel}
                  </div>
                </div>
              </div>

              {/* How to Invest CTA Ribbon */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-purple-50 to-warm-50 p-4 rounded-2xl border border-purple-200">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-xs font-black text-purple-900 block">
                    Ready to execute {option.title}?
                  </span>
                  <p className="text-[11px] text-warm-600 font-medium">
                    Recommended Platforms: {option.howToInvest.recommendedPlatforms.slice(0, 3).join(', ')} · Plan: {option.howToInvest.planType}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openInvestModal(option)}
                  className="clay-btn-primary px-4 py-2.5 text-xs font-black flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>How to Invest in This (Full Guide)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. 5-STEP EXECUTION BLUEPRINT FOOTER */}
      <div className="clay-card-warm p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-6">
        <div className="border-b border-warm-200 pb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
            Execution Playbook
          </span>
          <h3 className="text-xl font-black text-warm-900">5-Week Systematic Rollout Roadmap</h3>
          <p className="text-xs text-warm-600 font-medium">Follow this exact sequence to deploy without liquidity strain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs font-black text-warm-900">Week 1 · Insurance Shield</h4>
            <p className="text-[11px] text-warm-600 font-medium leading-relaxed">
              Never invest surplus before securing liabilities. Get ₹3 Cr pure term life + ₹10L base family health floater.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs font-black text-warm-900">Week 2 · Emergency Buffer</h4>
            <p className="text-[11px] text-warm-600 font-medium leading-relaxed">
              Allocate ₹2L in Tier 1 Instant UPI/ATM + ₹4.5L into Tier 2 Liquid Fund before market exposure.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-black text-warm-900">Week 3 · Start Goal SIPs</h4>
            <p className="text-[11px] text-warm-600 font-medium leading-relaxed">
              Automate salary day auto-debit: Index Equity SIP, Target Maturity Fund 2028, and Gold ETF.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="text-xs font-black text-warm-900">Month 6 · Drift Audit</h4>
            <p className="text-[11px] text-warm-600 font-medium leading-relaxed">
              Review asset class divergence, verify insurance cashless TPA cards, strictly zero panic tweaks.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
              5
            </span>
            <h4 className="text-xs font-black text-warm-900">Every Year · 10% Step-Up</h4>
            <p className="text-[11px] text-warm-600 font-medium leading-relaxed">
              Increase monthly SIPs by 10% whenever appraisal happens. Compresses 4-year house timeline by ~9 months.
            </p>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE HOW-TO-INVEST & SIP CALCULATOR MODAL */}
      {selectedOptionForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="clay-card p-6 sm:p-8 max-w-2xl w-full space-y-6 relative border border-warm-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOptionForModal(null)}
              className="absolute top-4 right-4 text-warm-400 hover:text-warm-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="border-b border-warm-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                Execution Guide &amp; Wealth Projection
              </span>
              <h3 className="text-xl font-black text-warm-900">
                How to Invest in: {selectedOptionForModal.title}
              </h3>
              <p className="text-xs text-warm-600 font-semibold mt-0.5">
                Recommended Scheme: {selectedOptionForModal.tickerExample}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-warm-800">
                Step-by-Step Execution Checklist
              </h4>

              <div className="space-y-2.5">
                {selectedOptionForModal.howToInvest.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-warm-200">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-semibold text-warm-800 leading-relaxed">{st}</p>
                  </div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-black">Pro Tip: </strong>
                  {selectedOptionForModal.howToInvest.proTip}
                </span>
              </div>
            </div>

            {/* Live Interactive Wealth Calculator */}
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-black text-purple-900">Interactive Wealth Projection Simulator</span>
                </div>
                <span className="text-[10px] text-purple-700 font-bold">Formula: FV = P × ((1+r)^n - 1) / r</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Monthly Amount Input */}
                <div>
                  <label className="block text-[11px] font-bold text-warm-800 mb-1">
                    Monthly Allocation
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={calcMonthly}
                    onChange={(e) => setCalcMonthly(Math.max(500, Number(e.target.value)))}
                    className="w-full px-3 py-2 clay-input text-xs font-black text-warm-900"
                  />
                </div>

                {/* Years Input */}
                <div>
                  <label className="block text-[11px] font-bold text-warm-800 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={calcYears}
                    onChange={(e) => setCalcYears(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 clay-input text-xs font-black text-warm-900"
                  />
                </div>

                {/* Expected Return Input */}
                <div>
                  <label className="block text-[11px] font-bold text-warm-800 mb-1">
                    Expected Return (% CAGR)
                  </label>
                  <input
                    type="number"
                    step={0.5}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full px-3 py-2 clay-input text-xs font-black text-warm-900"
                  />
                </div>
              </div>

              {/* Projection Result Cards */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 bg-white rounded-xl text-center border border-purple-100">
                  <span className="text-[9px] uppercase font-bold text-warm-500 block">Total Invested</span>
                  <span className="text-xs font-black text-warm-900">{formatINR(projectedCorpus.invested)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl text-center border border-purple-100">
                  <span className="text-[9px] uppercase font-bold text-emerald-600 block">Wealth Gain</span>
                  <span className="text-xs font-black text-emerald-700">+{formatINR(projectedCorpus.returns)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl text-center border border-purple-300 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-purple-700 block">Maturity Value</span>
                  <span className="text-xs font-black text-purple-950">{formatINR(projectedCorpus.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOptionForModal(null)}
                className="clay-btn-secondary px-4 py-2.5 text-xs font-bold"
              >
                Close Guide
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleConfigured(selectedOptionForModal.id);
                  setSelectedOptionForModal(null);
                }}
                className="clay-btn-primary px-5 py-2.5 text-xs font-black flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>
                  {configuredOptions[selectedOptionForModal.id]
                    ? 'Keep as Active in Mandate'
                    : 'Mark as Active in My Mandate'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedPlanModule;
