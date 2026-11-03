import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ArrowDown,
  CheckCircle2,
  Bell,
  Utensils,
  Share2,
  X,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';

interface MobilePrototypeProps {
  onOpenAdvisorModal?: () => void;
}

export const MobilePrototype: React.FC<MobilePrototypeProps> = ({ onOpenAdvisorModal }) => {
  // Active Tab state (1 to 7)
  const [activeTab, setActiveTab] = useState<'profile' | 'time-machine' | 'household' | 'gateway' | 'impulse-guard' | 'macro' | 'expert-plan'>('profile');

  // Global Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // ----------------------------------------------------
  // TAB 1: Profile State
  // ----------------------------------------------------
  const [profileData, setProfileData] = useState({
    name: 'Rohit Kumar',
    age: '28',
    occupation: 'Software engineer (private company)',
    monthlyIncome: '₹4,00,000',
    dependents: '2',
    assets: 'Savings ₹4,50,000; PF ₹8,00,000',
    liabilities: 'Car loan ₹6,00,000',
    fixedExpenses: '₹1,40,000',
    existingEmis: '₹40,000',
    currentSavings: '₹4,50,000',
    futureGoals: '₹60 lakh house down payment in 4 years',
    biggestConcern: 'My expenses are high and I am not able',
    financialKnowledge: '2',
    riskTolerance: 'Moderate',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile saved & calculations synced');
  };

  // ----------------------------------------------------
  // TAB 2: Time Machine State
  // ----------------------------------------------------
  const [purchaseAmount, setPurchaseAmount] = useState<number>(500000);
  const [purchaseSkipped, setPurchaseSkipped] = useState(false);

  // Dynamic calculations:
  // If 500,000, exactly +3 months and 1.8 months as specified in the reference specs
  const delayMonths = purchaseAmount === 500000 
    ? 3 
    : Math.max(1, Math.ceil(purchaseAmount / 160000));

  const emergencyMonths = purchaseAmount === 500000 
    ? '1.8' 
    : (450000 / (180000 + (purchaseAmount * 0.05))).toFixed(1);

  // ----------------------------------------------------
  // TAB 3: Household State
  // ----------------------------------------------------
  const [showInviteModal, setShowInviteModal] = useState(false);

  // ----------------------------------------------------
  // TAB 4: Gateway State
  // ----------------------------------------------------
  const [gatewaySelectedOption, setGatewaySelectedOption] = useState<string>('Hold and review the plan');
  const [gatewayUnlocked, setGatewayUnlocked] = useState<boolean>(false);

  const handleGatewaySubmit = () => {
    setGatewayUnlocked(true);
    showToast('Check completed • Trade unlocked!');
  };

  // ----------------------------------------------------
  // TAB 5: Impulse Guard State
  // ----------------------------------------------------
  const [cookStreak, setCookStreak] = useState<number>(4);
  const [leisureSpent, setLeisureSpent] = useState<number>(8600);
  const leisureLimit = 12000;
  const leisureProgress = Math.min(100, (leisureSpent / leisureLimit) * 100);

  const handleCookAtHome = () => {
    setCookStreak((prev) => prev + 1);
    showToast('Streak +1! ₹800 saved into Lockbox');
  };

  const handleOrderAnyway = () => {
    setLeisureSpent((prev) => Math.min(leisureLimit, prev + 600));
    showToast('Order placed. Weekend budget updated.');
  };

  // ----------------------------------------------------
  // TAB 6: Macro State
  // ----------------------------------------------------
  const [selectedMacroEvent, setSelectedMacroEvent] = useState<'crude' | 'repo' | 'tech'>('crude');

  const macroChains = {
    crude: {
      worldEvent: 'Crude oil prices spike',
      economicImpact: 'Transport and import costs rise',
      sectorImpact: 'Auto and paints: margins shrink',
      marketEffect: 'Money rotates to IT and pharma',
    },
    repo: {
      worldEvent: 'RBI raises repo rate by 50 bps',
      economicImpact: 'Cost of capital & home loan borrowing rises',
      sectorImpact: 'Banking margins expand; Real estate cools',
      marketEffect: 'Money shifts to short-term debt and arbitrage',
    },
    tech: {
      worldEvent: 'Global tech supply chain shortage',
      economicImpact: 'Manufacturing lead times and freight costs rise',
      sectorImpact: 'Hardware & electronics face inventory lags',
      marketEffect: 'Defensive dividend stocks and Gold see inflows',
    },
  };

  // ----------------------------------------------------
  // TAB 7: Expert Plan State (Items 6, 7, 8 expanded by default)
  // ----------------------------------------------------
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': true, // NPS Tier I
    '7': true, // REIT
    '8': true, // Arbitrage or Balanced Advantage
  });

  const togglePlan = (id: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const plans = [
    {
      id: '1',
      title: '1. Round-up SIP',
      reason: 'Automated micro-investing from daily spare change to build habit consistency without cash-flow strain.',
      timeHorizon: 'Continuous micro-savings',
      downside: 'Small transaction amounts accumulate gradually over time.',
    },
    {
      id: '2',
      title: '2. Step-up SIP',
      reason: 'Automatically increases SIP contribution annually in line with salary increments to accelerate the ₹60L house down payment goal.',
      timeHorizon: '4 years (House Goal)',
      downside: 'Requires discipline to avoid lifestyle inflation when annual appraisals happen.',
    },
    {
      id: '3',
      title: '3. Target Maturity Fund',
      reason: 'Predictable fixed-income allocation aligned with the 4-year house down payment timeline.',
      timeHorizon: '4 years (matches house deadline)',
      downside: 'Returns are capped to portfolio Yield to Maturity (YTM ~7.2%); taxable at slab rate.',
    },
    {
      id: '4',
      title: '4. Liquid fund',
      reason: 'Houses the 3–6 month Emergency Liquidity Lockbox with instant T+1 redemption safety.',
      timeHorizon: 'Instant to T+1 Redemption',
      downside: 'Yields are conservative (~6.5–6.8%) compared to long-term equity growth.',
    },
    {
      id: '5',
      title: '5. Gold ETF',
      reason: 'Sovereign/digital hedge against inflation without physical storage or making-charge leakage.',
      timeHorizon: '10+ years',
      downside: 'Gold produces no periodic dividends or interest cash flows; prices fluctuate with global spot rates.',
    },
    {
      id: '6',
      title: '6. NPS Tier I',
      reason: 'Tax benefit and retirement savings.',
      timeHorizon: 'Until retirement',
      downside: 'Money is locked until retirement.',
    },
    {
      id: '7',
      title: '7. REIT',
      reason: 'Real estate exposure with a small amount.',
      timeHorizon: '5+ years',
      downside: 'Prices can fall and payouts can vary.',
    },
    {
      id: '8',
      title: '8. Arbitrage or Balanced Advantage fund',
      reason: 'Lower volatility for a calmer ride.',
      timeHorizon: '3 years',
      downside: 'Returns can lag pure equity.',
    },
  ];

  const currentMacro = macroChains[selectedMacroEvent];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 text-slate-900 border-x border-slate-200 shadow-xl pb-16 relative font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 shadow-xs">
        <h1 className="text-xl font-bold text-[#6C5CE7] tracking-tight">
          Aarthik.ai
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Prototype demo · all figures are sample data
        </p>
      </header>

      {/* 2. HORIZONTALLY SCROLLABLE TAB BAR */}
      <nav className="sticky top-[57px] z-20 bg-white border-b border-slate-100 px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'profile'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          1 Profile
        </button>

        <button
          onClick={() => setActiveTab('time-machine')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'time-machine'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          2 Time Machine
        </button>

        <button
          onClick={() => setActiveTab('household')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'household'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          3 Household
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'gateway'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          4 Gateway
        </button>

        <button
          onClick={() => setActiveTab('impulse-guard')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'impulse-guard'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          5 Impulse Guard
        </button>

        <button
          onClick={() => setActiveTab('macro')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'macro'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          6 Macro
        </button>

        <button
          onClick={() => setActiveTab('expert-plan')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
            activeTab === 'expert-plan'
              ? 'bg-[#6C5CE7] text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          7 Expert Plan
        </button>
      </nav>

      {/* MAIN VIEW CONTAINER */}
      <main className="p-4 space-y-4">
        
        {/* ==================================================== */}
        {/* TAB 1: 1 Profile (Diagnostic Intake)                  */}
        {/* ==================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Sign in and tell us about yourself
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sample user is pre-filled for the demo.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3.5">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Age
                </label>
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Occupation
                </label>
                <input
                  type="text"
                  value={profileData.occupation}
                  onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Monthly Income */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Monthly income
                </label>
                <input
                  type="text"
                  value={profileData.monthlyIncome}
                  onChange={(e) => setProfileData({ ...profileData, monthlyIncome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Dependents */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Dependents
                </label>
                <input
                  type="number"
                  value={profileData.dependents}
                  onChange={(e) => setProfileData({ ...profileData, dependents: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Assets */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Assets
                </label>
                <input
                  type="text"
                  value={profileData.assets}
                  onChange={(e) => setProfileData({ ...profileData, assets: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Liabilities */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Liabilities
                </label>
                <input
                  type="text"
                  value={profileData.liabilities}
                  onChange={(e) => setProfileData({ ...profileData, liabilities: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Fixed Expenses */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Fixed expenses per month
                </label>
                <input
                  type="text"
                  value={profileData.fixedExpenses}
                  onChange={(e) => setProfileData({ ...profileData, fixedExpenses: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Existing EMIs */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Existing EMIs per month
                </label>
                <input
                  type="text"
                  value={profileData.existingEmis}
                  onChange={(e) => setProfileData({ ...profileData, existingEmis: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Current Savings */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Current savings
                </label>
                <input
                  type="text"
                  value={profileData.currentSavings}
                  onChange={(e) => setProfileData({ ...profileData, currentSavings: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Future Financial Goals */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Future financial goals
                </label>
                <input
                  type="text"
                  value={profileData.futureGoals}
                  onChange={(e) => setProfileData({ ...profileData, futureGoals: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              {/* Biggest Financial Concern */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Biggest financial concern
                </label>
                <textarea
                  rows={2}
                  value={profileData.biggestConcern}
                  onChange={(e) => setProfileData({ ...profileData, biggestConcern: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] resize-none"
                />
              </div>

              {/* Financial Knowledge */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Financial knowledge (1 to 5)
                </label>
                <select
                  value={profileData.financialKnowledge}
                  onChange={(e) => setProfileData({ ...profileData, financialKnowledge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                >
                  <option value="1">1 - Beginner (No knowledge)</option>
                  <option value="2">2 - Basic (Fixed Deposits / Gold)</option>
                  <option value="3">3 - Intermediate (Mutual Funds / SIP)</option>
                  <option value="4">4 - Advanced (Stocks &amp; Portfolios)</option>
                  <option value="5">5 - Expert (Institutional / Derivatives)</option>
                </select>
              </div>

              {/* Risk Tolerance */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Risk tolerance
                </label>
                <select
                  value={profileData.riskTolerance}
                  onChange={(e) => setProfileData({ ...profileData, riskTolerance: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Primary Submit CTA */}
              <button
                type="submit"
                className="w-full bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white font-semibold py-3 rounded-xl shadow-sm transition-all text-sm mt-2 flex items-center justify-center gap-2"
              >
                <span>Submit</span>
              </button>
            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: 2 Time Machine (Financial Time Machine)       */}
        {/* ==================================================== */}
        {activeTab === 'time-machine' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Financial Time Machine
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                What if I buy...
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Purchase on EMI
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={10000}
                    value={purchaseAmount}
                    onChange={(e) => {
                      setPurchaseAmount(Number(e.target.value) || 0);
                      setPurchaseSkipped(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                  />
                  <div className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                    INR
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => { setPurchaseAmount(500000); setPurchaseSkipped(false); }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      purchaseAmount === 500000
                        ? 'bg-[#6C5CE7]/10 border-[#6C5CE7] text-[#6C5CE7] font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    ₹5L Car
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPurchaseAmount(150000); setPurchaseSkipped(false); }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      purchaseAmount === 150000
                        ? 'bg-[#6C5CE7]/10 border-[#6C5CE7] text-[#6C5CE7] font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    ₹1.5L iPhone
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPurchaseAmount(50000); setPurchaseSkipped(false); }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      purchaseAmount === 50000
                        ? 'bg-[#6C5CE7]/10 border-[#6C5CE7] text-[#6C5CE7] font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    ₹50k Vacation
                  </button>
                </div>
              </div>

              {/* Output Cards */}
              <div className="space-y-2.5 pt-1">
                {/* Card 1: House down payment */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-800 block">
                      House down payment
                    </span>
                    <span className="text-xs text-slate-500">
                      Goal impact delay
                    </span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg text-xs border border-amber-200 shadow-xs">
                    {purchaseSkipped ? 'On Track (0 delay)' : `+${delayMonths} months later`}
                  </span>
                </div>

                {/* Card 2: Emergency fund */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-800 block">
                        Emergency fund
                      </span>
                      <span className="text-xs text-slate-500">
                        Coverage runway
                      </span>
                    </div>
                    <span className="bg-rose-50 text-rose-600 font-bold px-2.5 py-1 rounded-lg text-xs border border-rose-200 shadow-xs">
                      {purchaseSkipped ? '2.5 months' : `${emergencyMonths} months`}
                    </span>
                  </div>
                  <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                    <span>Below the safe limit of 3 months</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseSkipped(true);
                    showToast('Good decision! House goal kept on track by 3 months');
                  }}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-all text-center text-sm shadow-xs"
                >
                  Skip purchase
                </button>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Plan adjusted. Emergency buffer prioritized.');
                  }}
                  className="flex-1 bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white font-medium py-2.5 rounded-xl shadow-sm transition-all text-center text-sm"
                >
                  Adjust plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: 3 Household (Indian Family Balance Sheet)     */}
        {/* ==================================================== */}
        {activeTab === 'household' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Household
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Joint cash flows and household balance sheet
              </p>
            </div>

            {/* Income & Outflow Items */}
            <div className="space-y-2.5">
              {/* You / Salary */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">You</h3>
                  <p className="text-xs text-slate-500">Salary</p>
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  +₹4,00,000
                </span>
              </div>

              {/* Father / Shop income */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Father</h3>
                  <p className="text-xs text-slate-500">Shop income (varies)</p>
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  +₹50,000
                </span>
              </div>

              {/* Mother / Medical costs */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Mother</h3>
                  <p className="text-xs text-slate-500">Medical costs</p>
                </div>
                <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                  -₹15,000
                </span>
              </div>

              {/* Home / Rent, bills, food */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Home</h3>
                  <p className="text-xs text-slate-500">Rent, bills, food</p>
                </div>
                <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                  -₹1,40,000
                </span>
              </div>

              {/* Loans / EMIs */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Loans</h3>
                  <p className="text-xs text-slate-500">EMIs</p>
                </div>
                <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                  -₹40,000
                </span>
              </div>
            </div>

            {/* Monthly Balance Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3.5 mt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Monthly balance
              </h3>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">Income</span>
                <span className="font-semibold text-slate-900">₹4,50,000</span>
              </div>

              {/* Dual-color segmented progress bar */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: '43.3%' }}
                  className="bg-[#6C5CE7] h-full"
                  title="Obligations: 43.3%"
                />
                <div
                  style={{ width: '56.7%' }}
                  className="bg-emerald-500 h-full"
                  title="Surplus: 56.7%"
                />
              </div>

              {/* Legend rows */}
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
                    <span className="text-slate-600 font-medium">Obligations</span>
                  </div>
                  <span className="font-bold text-slate-800">₹1,95,000</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 font-medium">Surplus</span>
                  </div>
                  <span className="font-bold text-emerald-600">₹2,55,000</span>
                </div>
              </div>
            </div>

            {/* Bottom Invite Family CTA */}
            <button
              type="button"
              onClick={() => {
                setShowInviteModal(true);
                showToast('Invite link generated: aarthik.ai/join/family-rohit');
              }}
              className="w-full border-2 border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7]/5 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-3"
            >
              <Share2 className="w-4 h-4" />
              <span>Invite family member</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: 4 Gateway (Interactive Safety Gate)           */}
        {/* ==================================================== */}
        {activeTab === 'gateway' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Quick check • 1 of 3 • 2 min
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Fiduciary Safety Check
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                Your holding falls 12% in a week. What do you do?
              </h3>

              {/* 3 Selectable Radio Option Cards */}
              <div className="space-y-2.5">
                {[
                  'Sell everything',
                  'Hold and review the plan',
                  'Invest more',
                ].map((option) => {
                  const isSelected = gatewaySelectedOption === option;
                  return (
                    <div
                      key={option}
                      onClick={() => setGatewaySelectedOption(option)}
                      className={`rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all select-none ${
                        isSelected
                          ? 'border-2 border-[#6C5CE7] bg-[#6C5CE7]/5 shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'border-[#6C5CE7] bg-[#6C5CE7]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Unlocked confirmation if submitted */}
              {gatewayUnlocked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in duration-200">
                  <Unlock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Check passed • Trade execution unlocked!</span>
                </div>
              )}

              <p className="text-xs text-slate-400 text-center">
                The trade unlocks after the check.
              </p>

              <button
                type="button"
                onClick={handleGatewaySubmit}
                className="w-full bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white font-medium py-3 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: 5 Impulse Guard (Behavioral Nudge)            */}
        {/* ==================================================== */}
        {activeTab === 'impulse-guard' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Impulse Guard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Linked via Account Aggregator
              </p>
            </div>

            {/* Metric Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-medium">Weekend leisure budget</span>
                <span className="font-bold text-slate-900">
                  ₹{leisureSpent.toLocaleString('en-IN')} of ₹{leisureLimit.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Progress bar filled to 71.6% */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${leisureProgress}%` }}
                  className="bg-[#6C5CE7] h-full rounded-full transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <span>6 food-delivery orders this week</span>
                <span className="font-semibold text-slate-700">Streak: {cookStreak} Home Meals</span>
              </div>
            </div>

            {/* Simulated Push Notification / Live Alert Banner */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-slate-800 flex items-center gap-1.5 uppercase">
                  <Bell className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  Aarthik.ai • NOW
                </span>
                <span className="text-[10px] bg-purple-50 text-[#6C5CE7] font-bold px-2 py-0.5 rounded-full">
                  Nudge
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Pause before you order
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You are ₹3,400 away from your weekend leisure limit. Ordering in today will dip into your emergency buffer.
              </p>

              {/* Action Row */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleOrderAnyway}
                  className="flex-1 border border-slate-300 text-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-slate-50 text-center transition-all"
                >
                  Order anyway
                </button>

                <button
                  type="button"
                  onClick={handleCookAtHome}
                  className="flex-1 bg-[#6C5CE7] text-white rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#5b4cdb] text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Cook at home</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: 6 Macro (Market Impact Causal Chain)          */}
        {/* ==================================================== */}
        {activeTab === 'macro' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Market Impact
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Why markets move, explained
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
              {/* Dropdown: Choose an event */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Choose an event
                </label>
                <select
                  value={selectedMacroEvent}
                  onChange={(e) => setSelectedMacroEvent(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                >
                  <option value="crude">Crude oil prices spike</option>
                  <option value="repo">RBI raises repo rate by 50 bps</option>
                  <option value="tech">Global tech supply chain shortage</option>
                </select>
              </div>

              {/* Dynamic 4-Tier Vertical Causal Chain */}
              <div className="space-y-1.5 pt-1">
                {/* Box 1: WORLD EVENT */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-[#6C5CE7] tracking-wider uppercase block mb-0.5">
                    WORLD EVENT
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800">
                    {currentMacro.worldEvent}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-[#6C5CE7]" />
                </div>

                {/* Box 2: ECONOMIC IMPACT */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-[#6C5CE7] tracking-wider uppercase block mb-0.5">
                    ECONOMIC IMPACT
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800">
                    {currentMacro.economicImpact}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-[#6C5CE7]" />
                </div>

                {/* Box 3: SECTOR IMPACT */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-[#6C5CE7] tracking-wider uppercase block mb-0.5">
                    SECTOR IMPACT
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800">
                    {currentMacro.sectorImpact}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-[#6C5CE7]" />
                </div>

                {/* Box 4: MARKET EFFECT */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-[#6C5CE7] tracking-wider uppercase block mb-0.5">
                    MARKET EFFECT
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800">
                    {currentMacro.marketEffect}
                  </p>
                </div>
              </div>

              {/* Educational Disclaimer */}
              <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
                For education only. No buy or sell tips.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 7: 7 Expert Plan (Fiduciary Hybrid Plan)         */}
        {/* ==================================================== */}
        {activeTab === 'expert-plan' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold mb-1">
                Expert-approved options
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Your expert-prepared plan
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Delivered 24 hours after submission. AI never chooses your investments. A registered expert does.
              </p>
            </div>

            {/* 8 Accordion Cards */}
            <div className="space-y-2.5">
              {plans.map((p) => {
                const isExpanded = !!expandedPlans[p.id];
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 transition-all"
                  >
                    <div
                      onClick={() => togglePlan(p.id)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                        {p.title}
                      </h3>
                      <button
                        type="button"
                        className="text-[#6C5CE7] text-xs font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>Why this?</span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        )}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                        <div>
                          <strong className="font-semibold text-slate-800">Reason: </strong>
                          <span className="text-slate-600">{p.reason}</span>
                        </div>
                        <div>
                          <strong className="font-semibold text-slate-800">Time horizon: </strong>
                          <span className="text-slate-600">{p.timeHorizon}</span>
                        </div>
                        <div>
                          <strong className="font-semibold text-rose-600">Downside: </strong>
                          <span className="text-slate-600">{p.downside}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Informational Card */}
            <div
              onClick={() => onOpenAdvisorModal && onOpenAdvisorModal()}
              className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-center mt-6 cursor-pointer hover:bg-slate-200/70 transition-all"
            >
              Draft &amp; Verify (advisor dashboard) is already built. Show it through a screenshot or demo video.
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default MobilePrototype;

