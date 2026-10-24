import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  Zap,
  UtensilsCrossed,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const ImpulseGuardModule: React.FC = () => {
  const {
    profile,
    impulseState,
    remainingLeisure,
    orderAnyway,
    cookAtHome,
    setImpulseLimit,
  } = useFinancialStore();

  const [previewSimulated600, setPreviewSimulated600] = useState(false);

  const displaySpent = previewSimulated600
    ? impulseState.leisureLimit - 600
    : impulseState.leisureSpent;
  const displayRemaining = previewSimulated600 ? 600 : remainingLeisure;
  const spendPercentage = Math.min(
    100,
    Math.round((displaySpent / impulseState.leisureLimit) * 100)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-2">
            <Zap className="w-3.5 h-3.5 text-purple-700" />
            <span>Behavioral Spend Coach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Impulse Guard
          </h1>
          <p className="text-sm font-semibold text-warm-600 mt-1">
            Empathetic, real-time behavioral nudges powered by Account Aggregator notifications to intercept impulsive leisure outflows before they derail long-term safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white border border-warm-200 shadow-clay-sm text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-warm-900">
                Streak: {impulseState.cookedAtHomeCount} Meals
              </span>
            </div>
            <span className="text-[10px] font-bold text-warm-500 mt-0.5 block">
              {formatINR(impulseState.cookedAtHomeCount * 800)} Saved to Lockbox
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Card 1 — Impulse Guard Tracker */}
        <div className="lg:col-span-6 space-y-6">
          <div className="clay-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-warm-900">Card 1 — Impulse Guard Tracker</h2>
                <p className="text-xs text-warm-500 font-medium">Subtitle: Linked via Account Aggregator</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AA Live Feed</span>
              </span>
            </div>

            {/* Metric Display */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-warm-600 uppercase tracking-wider block">
                    Weekend Leisure Budget
                  </span>
                  <div className="text-3xl font-black text-warm-900 mt-1">
                    {formatINR(displaySpent)}{' '}
                    <span className="text-base font-semibold text-warm-400">
                      of {formatINR(impulseState.leisureLimit)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-warm-500 block">Remaining</span>
                  <span
                    className={`text-xl font-black ${
                      displayRemaining <= 1000 ? 'text-red-600' : 'text-purple-700'
                    }`}
                  >
                    {formatINR(displayRemaining)}
                  </span>
                </div>
              </div>

              {/* Purple/Amber Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-4 rounded-full bg-warm-100 overflow-hidden p-0.5 border border-warm-200 shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      spendPercentage > 85
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-purple-700 to-amber-500'
                    }`}
                    style={{ width: `${spendPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-warm-500 px-1">
                  <span>₹0 Spent</span>
                  <span className="text-warm-700 font-bold">{spendPercentage}% utilized</span>
                  <span>Limit: {formatINR(impulseState.leisureLimit)}</span>
                </div>
              </div>

              {/* Exact Caption */}
              <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 flex items-center justify-between text-xs font-semibold">
                <span className="text-warm-700">
                  {impulseState.ordersThisWeek} food-delivery orders this week
                </span>
                <span className="text-purple-700 font-bold">
                  Pending Order: {formatINR(impulseState.pendingOrderAmount)}
                </span>
              </div>
            </div>

            {/* Interactive Threshold State Simulator */}
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-warm-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-warm-800">
                  Interactive Alert State Simulator:
                </label>
                <span className="text-xs font-extrabold text-purple-700">
                  {displayRemaining <= 1000 ? 'Critical Alert Trigger' : 'Safe Operating Zone'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewSimulated600(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    !previewSimulated600
                      ? 'bg-purple-700 text-white shadow-clay-sm'
                      : 'bg-white border border-warm-200 text-warm-700 hover:bg-warm-50'
                  }`}
                >
                  Live State ({formatINR(remainingLeisure)} remaining)
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewSimulated600(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    previewSimulated600
                      ? 'bg-amber-600 text-white shadow-clay-sm'
                      : 'bg-white border border-warm-200 text-warm-700 hover:bg-warm-50'
                  }`}
                >
                  ₹600 Alert State Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 — Real-Time Nudge Alert (AARTHIK.AI · NOW) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="clay-card-warm p-6 sm:p-8 space-y-6">
            <div className="border-b border-warm-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-warm-900">
                  Card 2 — Real-Time Nudge Alert
                </h3>
                <p className="text-xs text-warm-600 font-medium">Real-time lockscreen intervention</p>
              </div>
              <span className="text-[10px] font-black tracking-widest text-warm-600 uppercase">
                AARTHIK.AI · NOW
              </span>
            </div>

            {/* Mobile Notification Mockup */}
            <div className="p-5 rounded-3xl bg-white border-2 border-purple-200 shadow-clay-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-warm-200 shadow-sm p-1 flex items-center justify-center">
                    <img src="./aarthik-logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-black text-warm-900">AARTHIK.AI · NOW</span>
                </div>
                <span className="text-[10px] font-bold text-warm-400">Just now</span>
              </div>

              {/* Exact Headline: "Pause before you order." */}
              <div>
                <h4 className="text-base font-black text-warm-900 flex items-center gap-2">
                  <span>Pause before you order.</span>
                  {displayRemaining <= 1000 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  )}
                </h4>

                {/* Exact Body Copy */}
                <p className="text-xs font-semibold text-warm-700 mt-2 leading-relaxed">
                  {previewSimulated600 ? (
                    <>
                      &quot;You are <strong>₹600 away</strong> from exceeding your weekend leisure limit. Ordering in today will dip into your emergency buffer.&quot;
                    </>
                  ) : (
                    <>
                      &quot;You are <strong>{formatINR(displayRemaining)} away</strong> from your weekend leisure limit. Ordering in today will dip into your emergency buffer.&quot;
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons: Outlined Order anyway vs Primary Cook at home */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={orderAnyway}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-warm-300 bg-white hover:bg-warm-50 text-warm-800 text-xs font-bold transition-all text-center"
                >
                  Order anyway
                </button>

                <button
                  type="button"
                  onClick={cookAtHome}
                  className="flex-1 clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4 text-purple-200" />
                  <span>Cook at home</span>
                </button>
              </div>
            </div>

            {/* Positive Reinforcement & Lockbox Sync */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs">
                <h5 className="font-black text-emerald-900">
                  Live Lockbox Feedback Loop
                </h5>
                <p className="text-emerald-800 mt-0.5 leading-relaxed font-medium">
                  Clicking <strong>Cook at home</strong> credits +₹800 directly into your current liquid savings in Tab 1 (currently {formatINR(profile.currentSavings)}). Clicking <strong>Order anyway</strong> deducts ₹800 from your liquid savings buffer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
