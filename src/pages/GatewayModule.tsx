import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  Info,
  AlertTriangle,
} from 'lucide-react';

export const GatewayModule: React.FC = () => {
  const {
    profile,
    monthlySurplus,
    emergencyFundMonths,
    gatewayState,
    answerGatewayStep,
    resetGateway,
  } = useFinancialStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const currentStep = gatewayState.currentStep;

  const handleStepSubmit = () => {
    if (!selectedAnswer) return;
    answerGatewayStep(currentStep, selectedAnswer);
    setSelectedAnswer('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold clay-badge-amber mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Fiduciary Behavioral Guardrail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Knowledge Gateways
          </h1>
          <p className="text-sm font-semibold text-warm-600 mt-1">
            Mandatory 2-minute interactive simulation guardrail that intercepts users before allocating capital to high-risk instruments (Futures &amp; Options, Crypto, volatile micro-caps).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white border border-warm-200 shadow-clay-sm text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-warm-500 block">
              Simulation Status
            </span>
            <span
              className={`text-sm font-black flex items-center gap-1.5 ${
                gatewayState.completed && gatewayState.passed
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}
            >
              {gatewayState.completed && gatewayState.passed ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>Trade Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Safety Guard Active</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Step Navigation & Simulation Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="clay-card p-6 sm:p-8 space-y-6">
            {/* Multi-Step Header Indicator */}
            <div className="flex items-center justify-between border-b border-warm-100 pb-4">
              <div>
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                  Quick check · {currentStep} of 3 · 2 min
                </span>
                <h3 className="text-xl font-black text-warm-900 mt-0.5">
                  {currentStep === 1 && 'Step 1 (Behavioral Drawdown Check)'}
                  {currentStep === 2 && 'Step 2 (Cash Flow Stress Simulation)'}
                  {currentStep === 3 && 'Step 3 (Liquidity & Lock-in Check)'}
                </h3>
              </div>

              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                      currentStep === step
                        ? 'bg-purple-700 text-white shadow-clay-btn'
                        : step < currentStep || (gatewayState.completed && gatewayState.passed)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-warm-100 text-warm-600'
                    }`}
                  >
                    {step < currentStep || (gatewayState.completed && gatewayState.passed) ? '✓' : step}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200">
                  <p className="text-sm font-extrabold text-warm-900 leading-relaxed">
                    Prompt: &quot;Your holding falls 12% in a week. What do you do?&quot;
                  </p>
                  <p className="text-xs text-warm-500 font-medium mt-1">
                    Select your immediate behavioral response to sudden market volatility:
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: 'Sell everything',
                      sub: 'Panic reaction: Locks in paper loss and triggers transaction friction.',
                    },
                    {
                      label: 'Hold and review the plan',
                      sub: 'Prudent reaction: Reassess asset fundamentals before making an emotional decision.',
                    },
                    {
                      label: 'Invest more',
                      sub: 'Aggressive value averaging: Viable if surplus cash flow allows it.',
                    },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      onClick={() => setSelectedAnswer(opt.label)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAnswer === opt.label
                          ? 'bg-purple-50 border-purple-400 shadow-clay-sm ring-2 ring-purple-500/20'
                          : 'bg-[#FCFAF7] border-warm-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-warm-900">{opt.label}</span>
                        <input
                          type="radio"
                          name="step1"
                          checked={selectedAnswer === opt.label}
                          onChange={() => setSelectedAnswer(opt.label)}
                          className="w-4 h-4 text-purple-600"
                        />
                      </div>
                      <p className="text-xs text-warm-600 font-medium mt-1">{opt.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-warm-500 font-medium italic">
                    The trade unlocks after the check.
                  </span>
                  <button
                    onClick={handleStepSubmit}
                    disabled={!selectedAnswer}
                    className="clay-btn-primary px-6 py-2.5 text-xs font-black flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>Proceed to Step 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Live Dynamic Values */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
                  <p className="text-sm font-extrabold text-warm-900 leading-relaxed">
                    Interactive scenario showing: &quot;In a 20% drawdown on a ₹2,00,000 position, your capital drops by ₹40,000 in 3 days. Given your current monthly surplus of {formatINR(monthlySurplus)} and emergency cover of {emergencyFundMonths} months, what is the prudent action?&quot;
                  </p>
                  <p className="text-xs text-warm-600 font-medium">
                    This check links directly to your real-time cash flows from Tabs 1 &amp; 3.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'absorb',
                      label: `Yes — My monthly surplus of ${formatINR(monthlySurplus)} absorbs this ₹40k drawdown without missing EMI payments`,
                      sub: 'Correct understanding: Risk capital should only be committed if monthly cash flow surplus can easily cushion downside.',
                    },
                    {
                      id: 'cannot',
                      label: 'No — It would force me to borrow or stop house SIP contributions',
                      sub: 'Warning: If a 20% loss threatens house goals, high-risk capital allocation must be curtailed.',
                    },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedAnswer(opt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAnswer === opt.id
                          ? 'bg-purple-50 border-purple-400 shadow-clay-sm ring-2 ring-purple-500/20'
                          : 'bg-[#FCFAF7] border-warm-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-warm-900">{opt.label}</span>
                        <input
                          type="radio"
                          name="step2"
                          checked={selectedAnswer === opt.id}
                          onChange={() => setSelectedAnswer(opt.id)}
                          className="w-4 h-4 text-purple-600"
                        />
                      </div>
                      <p className="text-xs text-warm-600 font-medium mt-1">{opt.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-warm-500 font-medium italic">
                    The trade unlocks after the check.
                  </span>
                  <button
                    onClick={handleStepSubmit}
                    disabled={!selectedAnswer}
                    className="clay-btn-primary px-6 py-2.5 text-xs font-black flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>Proceed to Step 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
                  <p className="text-sm font-extrabold text-warm-900 leading-relaxed">
                    Step 3 (Liquidity &amp; Lock-in Check): Evaluates whether speculative allocation compromises your 3-month Emergency Liquidity Lockbox, especially with your existing monthly EMIs of {formatINR(profile.existingEmis)}.
                  </p>
                  <p className="text-xs text-warm-600 font-medium">
                    SEBI Fiduciary Guideline: Never use emergency cash buffers to trade derivatives or high-volatility tokens.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'ringfence',
                      label: 'No — My Emergency Lockbox is ring-fenced in liquid instruments and never touched for trading',
                      sub: 'Compliant: Lockbox is isolated; risk capital is drawn purely from excess discretionary funds.',
                    },
                    {
                      id: 'compromise',
                      label: 'I was planning to use part of my savings buffer for this trading opportunity',
                      sub: 'High Risk: Endangers family resilience in case of unexpected hospitalisation or job disruption.',
                    },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedAnswer(opt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAnswer === opt.id
                          ? 'bg-purple-50 border-purple-400 shadow-clay-sm ring-2 ring-purple-500/20'
                          : 'bg-[#FCFAF7] border-warm-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-warm-900">{opt.label}</span>
                        <input
                          type="radio"
                          name="step3"
                          checked={selectedAnswer === opt.id}
                          onChange={() => setSelectedAnswer(opt.id)}
                          className="w-4 h-4 text-purple-600"
                        />
                      </div>
                      <p className="text-xs text-warm-600 font-medium mt-1">{opt.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-warm-500 font-medium italic">
                    The trade unlocks after the check.
                  </span>
                  <button
                    onClick={handleStepSubmit}
                    disabled={!selectedAnswer}
                    className="clay-btn-primary px-6 py-3 text-xs font-black flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-purple-200" />
                    <span>Submit &amp; Unlock Knowledge Gateway</span>
                  </button>
                </div>
              </div>
            )}

            {/* Gateway Scorecard Banner if completed */}
            {gatewayState.completed && (
              <div
                className={`p-5 rounded-2xl border-2 space-y-3 animate-in fade-in ${
                  gatewayState.passed
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-red-50 border-red-400 text-red-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={`w-5 h-5 ${gatewayState.passed ? 'text-emerald-600' : 'text-red-600'}`}
                  />
                  <h4 className="text-base font-black">
                    {gatewayState.passed
                      ? 'Knowledge Gateway Unlocked — Fiduciary Readiness Verified'
                      : 'Gateway Incomplete — High-Risk Exposure Flagged'}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {gatewayState.passed
                    ? 'You demonstrated disciplined drawdown comprehension. Remember to cap speculative instruments under 5–10% of total assets, keeping your Safeguard Lockbox ring-fenced.'
                    : 'Your answers indicate that a market drop could cause lifestyle strain. Review your Lockbox buffer before engaging in volatile asset trading.'}
                </p>
                <div className="pt-1">
                  <button
                    onClick={resetGateway}
                    className="clay-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Gateway Check</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: SEBI Fiduciary Insight */}
        <div className="lg:col-span-4 space-y-6">
          <div className="clay-card-warm p-6 space-y-5">
            <div className="border-b border-warm-200 pb-3">
              <h4 className="text-base font-black text-warm-900">SEBI Investor Protection</h4>
              <p className="text-xs text-warm-600 font-medium">Why Aarthik.ai uses Gateways</p>
            </div>

            <div className="space-y-3 text-xs text-warm-700 leading-relaxed font-medium">
              <p>
                According to SEBI studies, <strong>9 out of 10 individual traders</strong> in equity Futures &amp; Options incur net financial losses.
              </p>
              <p>
                Aarthik.ai does not restrict your freedom to invest; instead, our <strong>Deterministic Gateway</strong> ensures you never jeopardize your household&apos;s baseline safety before taking speculative risk.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2">
              <span className="text-[11px] font-extrabold text-warm-800 uppercase tracking-wider block">
                Lockbox Quarantine Rule
              </span>
              <p className="text-xs text-warm-600 leading-relaxed font-medium">
                Emergency funds belong in <strong>Tier 1 &amp; Tier 2 Liquid Funds</strong>, completely segregated from trading accounts and broker margins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
