import React from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  Globe2,
  ArrowDown,
  Info,
  ShieldCheck,
  User,
} from 'lucide-react';

interface MacroChainData {
  title: string;
  subtitle: string;
  worldEvent: string;
  economicImpact: string;
  sectorImpact: string;
  marketEffect: string;
  assetImplication: string;
  portfolioAdvice: (name: string, occupation: string, emis: number, risk: string) => string;
}

const MACRO_CHAINS: Record<string, MacroChainData> = {
  'crude-oil': {
    title: 'Crude oil prices spike',
    subtitle: 'Global energy price shock and its transmission through India’s economy',
    worldEvent: 'Crude oil prices spike above $95/barrel on supply constraints',
    economicImpact: 'Transport and import costs rise, widening India’s trade deficit & putting pressure on the Rupee',
    sectorImpact: 'Auto and paints: margins shrink due to higher raw material and petrochemical input costs',
    marketEffect: 'Money rotates to IT and pharma exporters benefiting from Rupee depreciation and USD cash flows',
    assetImplication: 'Fixed income yields rise; large-cap exporters and sovereign Gold outshine domestic cyclical stocks.',
    portfolioAdvice: (name, occupation, emis, risk) =>
      `As a ${occupation} with ${formatINR(emis)}/mo in EMIs and a ${risk} risk profile, crude spikes increase domestic fuel and logistics inflation. Maintain your Balanced Advantage SIPs and ensure your Safeguard Lockbox is held in Liquid Funds rather than equity.`,
  },
  'repo-rate': {
    title: 'RBI Repo Rate Hike (+50 bps)',
    subtitle: 'Central Bank tightens monetary policy to curb sticky headline inflation',
    worldEvent: 'RBI Monetary Policy Committee increases Repo Rate by 50 bps',
    economicImpact: 'Cost of capital rises; home loan borrowing rates surge, compressing household discretionary margins',
    sectorImpact: 'Banking Net Interest Margins (NIM) expand temporarily; real estate sales velocity slows down',
    marketEffect: 'Short-term debt funds and Arbitrage funds yield higher returns; high-P/E growth equities face valuation compressions',
    assetImplication: 'Fixed deposits and Target Maturity Funds become attractive for 3–5 year capital preservation.',
    portfolioAdvice: (name, occupation, emis, risk) =>
      `With existing monthly EMIs of ${formatINR(emis)}, rate hikes can extend floating loan tenures. Prioritize prepayment prep buffers from your monthly surplus while keeping your 4-year house fund in Target Maturity Funds.`,
  },
  'global-slowdown': {
    title: 'US Tech & Global Export Slowdown',
    subtitle: 'Cross-border enterprise IT budget freezes and supply chain realignments',
    worldEvent: 'US and European enterprise software spending decelerates amidst tight corporate fiscal budgets',
    economicImpact: 'Indian service export growth moderates; corporate hiring freezes reduce tech salary increments',
    sectorImpact: 'IT services & staffing firms see multiple re-ratings; domestic FMCG and infrastructure leaders gain favor',
    marketEffect: 'Capital rotates from mid-cap tech into defensive healthcare, sovereign Gold ETFs, and PSU utilities',
    assetImplication: 'Multi-asset allocation funds and Gold ETFs cushion temporary market drawdowns.',
    portfolioAdvice: (name, occupation, emis, risk) =>
      `Since ${name} works in tech (${occupation}), a sector cooldown highlights the necessity of your 3–6 month Safeguard Lockbox. Do not take on additional non-essential EMIs until the macro cycle stabilizes.`,
  },
  'monsoon-deficit': {
    title: 'Monsoon Deficit & Food Inflation',
    subtitle: 'Spatial distribution shortfall impacting agricultural output and headline CPI',
    worldEvent: 'El Niño weather patterns lead to a 9% deficit in seasonal monsoon rainfall across rural belts',
    economicImpact: 'Food grain and vegetable prices spike; headline CPI touches 6.8%, delaying anticipated rate cuts',
    sectorImpact: 'Tractor and rural two-wheeler volumes soften; agricultural chemical providers see mixed demand',
    marketEffect: 'Consumer staples face gross margin compression; short-duration debt and Gold offer reliable hedging',
    assetImplication: 'Idle cash in traditional bank savings accounts losing real purchasing power at 3% vs 6.8% inflation.',
    portfolioAdvice: (name, occupation, emis, risk) =>
      `Inflation erodes bank savings. Move all surplus above your Tier 1 Instant buffer into Liquid and Arbitrage funds to preserve real purchasing power.`,
  },
};

export const MacroModule: React.FC = () => {
  const { profile, macroEventKey, setMacroEventKey } = useFinancialStore();

  const currentMacro = MACRO_CHAINS[macroEventKey] || MACRO_CHAINS['crude-oil'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-2">
            <Globe2 className="w-3.5 h-3.5 text-purple-700" />
            <span>Macro Causal Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Market Impact
          </h1>
          <p className="text-sm font-semibold text-warm-600 mt-1">
            Why markets move, explained. Understanding transmission mechanisms prevents panic selling during global headlines.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-white border border-warm-200 shadow-clay-sm text-xs text-warm-700 font-extrabold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Objective Educational Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Dropdown & Causal Flow Diagram */}
        <div className="lg:col-span-8 space-y-6">
          <div className="clay-card p-6 sm:p-8 space-y-6">
            {/* Dropdown Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-warm-800 uppercase tracking-wider">
                Choose an event
              </label>
              <div className="relative">
                <select
                  value={macroEventKey}
                  onChange={(e) => setMacroEventKey(e.target.value)}
                  className="w-full px-4 py-3.5 clay-input text-base font-bold text-warm-900 bg-[#F6F1E9] cursor-pointer"
                >
                  <option value="crude-oil">Crude oil prices spike (Default)</option>
                  <option value="repo-rate">RBI Repo Rate Hike (+50 bps)</option>
                  <option value="global-slowdown">US Tech &amp; Global Export Slowdown</option>
                  <option value="monsoon-deficit">Monsoon Deficit &amp; Food Inflation</option>
                </select>
              </div>
              <p className="text-xs text-warm-500 font-medium italic mt-1">{currentMacro.subtitle}</p>
            </div>

            {/* 4-Tier Causal Chain Flow */}
            <div className="space-y-4 pt-2">
              {/* Tier 1: WORLD EVENT */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-warm-50 border border-purple-200 shadow-sm relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-700 text-white">
                    WORLD EVENT
                  </span>
                </div>
                <h4 className="text-base font-black text-warm-900">{currentMacro.worldEvent}</h4>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-white border border-warm-200 shadow-clay-sm flex items-center justify-center text-purple-700">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              {/* Tier 2: ECONOMIC IMPACT */}
              <div className="p-5 rounded-2xl bg-warm-50 border border-warm-200 shadow-sm relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-warm-700 text-white">
                    ECONOMIC IMPACT
                  </span>
                </div>
                <h4 className="text-sm font-bold text-warm-900">{currentMacro.economicImpact}</h4>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-white border border-warm-200 shadow-clay-sm flex items-center justify-center text-purple-700">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              {/* Tier 3: SECTOR IMPACT */}
              <div className="p-5 rounded-2xl bg-warm-50 border border-warm-200 shadow-sm relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-700 text-white">
                    SECTOR IMPACT
                  </span>
                </div>
                <h4 className="text-sm font-bold text-warm-900">{currentMacro.sectorImpact}</h4>
              </div>

              {/* Arrow 3 */}
              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-white border border-warm-200 shadow-clay-sm flex items-center justify-center text-purple-700">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              {/* Tier 4: MARKET EFFECT */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-warm-50 border border-emerald-200 shadow-sm relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                    MARKET EFFECT
                  </span>
                </div>
                <h4 className="text-sm font-black text-emerald-950">{currentMacro.marketEffect}</h4>
              </div>
            </div>

            {/* Footer Compliance Note */}
            <div className="pt-4 border-t border-warm-100 flex items-center justify-between text-xs text-warm-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-warm-400" />
                <strong>Compliance Note:</strong> For education only. No buy or sell tips.
              </span>
              <span className="font-bold text-purple-700">SEBI Investor Education Standard</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Impact on User Portfolio */}
        <div className="lg:col-span-4 space-y-6">
          <div className="clay-card-warm p-6 space-y-5">
            {/* Live Portfolio Impact Box */}
            <div className="border-b border-warm-200 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
                Personalized Relevance
              </span>
              <h4 className="text-base font-black text-warm-900">
                Impact on {profile.name}&apos;s Portfolio
              </h4>
              <p className="text-xs text-warm-600 font-medium">
                Tailored for {profile.occupation} · {profile.riskTolerance} Risk
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-warm-900">
                <User className="w-4 h-4 text-purple-700" />
                <span>Contextual Advisory Rationale</span>
              </div>
              <p className="text-xs text-warm-700 leading-relaxed font-medium">
                {currentMacro.portfolioAdvice(
                  profile.name,
                  profile.occupation,
                  profile.existingEmis,
                  profile.riskTolerance
                )}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                Asset Allocation Implication
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                {currentMacro.assetImplication}
              </p>
            </div>

            {/* Risk-Time Horizon Principle */}
            <div className="p-4 bg-warm-900 text-white rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                Rule of Thumb: Match Risk to Time
              </span>
              <p className="text-xs text-warm-200 leading-relaxed font-medium">
                Short goals (0–3 yrs) get <strong>Safe</strong> liquid funds. Medium goals (3–6 yrs) like Rohit&apos;s house get <strong>Balanced</strong> funds. Only long goals (10+ yrs) take equity volatility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
