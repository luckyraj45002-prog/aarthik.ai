import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  Award,
  CheckCircle2,
  Building2,
  X,
  Printer,
  ShieldCheck,
} from 'lucide-react';

interface AdvisorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorDashboardModal: React.FC<AdvisorDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    profile,
    totalHouseholdIncome,
    totalHouseholdObligations,
    monthlySurplus,
    baselineEmergencyFundMonths,
    required3MoBuffer,
    advisorVerified,
    advisorNotes,
    verifyAsAdvisor,
  } = useFinancialStore();

  const [notesInput, setNotesInput] = useState<string>(advisorNotes);
  const [advisorName, setAdvisorName] = useState<string>('Priya Nair, CFP®');
  const [sebiRegNumber, setSebiRegNumber] = useState<string>('INA000018942');

  if (!isOpen) return null;

  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAsAdvisor(notesInput);
  };

  const handlePrint = () => {
    window.print();
  };

  const surplusRatio =
    totalHouseholdIncome > 0
      ? Math.round((monthlySurplus / totalHouseholdIncome) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="clay-card max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border border-warm-200">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-warm-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-warm-200 shadow-sm p-1.5 flex items-center justify-center">
              <img src="./aarthik-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  SEBI-RIA B2B2C Verification Portal
                </span>
                {advisorVerified && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified &amp; Signed
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-warm-900 mt-0.5">
                1-Page Draft Financial Dossier
              </h2>
              <p className="text-xs text-warm-500 font-medium">
                Automated Discovery Dossier for {profile.name} · Saves 3–4 hours of manual intake
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-warm-500 hover:text-warm-800 hover:bg-warm-100 rounded-xl transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-warm-400 hover:text-warm-800 hover:bg-warm-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1-Page Standardized Fiduciary Dossier Body */}
        <div className="p-6 rounded-3xl bg-[#FCFAF7] border-2 border-[#E7DFD5] space-y-6 text-warm-900 font-sans print:border-none print:p-0">
          {/* Dossier Header Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-warm-200 shadow-sm text-xs">
            <div>
              <span className="text-warm-400 font-bold block text-[10px] uppercase">Client Name</span>
              <span className="font-extrabold text-warm-900 text-sm">{profile.name}</span>
            </div>
            <div>
              <span className="text-warm-400 font-bold block text-[10px] uppercase">Age / Occupation</span>
              <span className="font-bold text-warm-800">{profile.age} yrs · {profile.occupation}</span>
            </div>
            <div>
              <span className="text-warm-400 font-bold block text-[10px] uppercase">Risk Profile</span>
              <span className="font-bold text-purple-700">{profile.riskTolerance}</span>
            </div>
            <div>
              <span className="text-warm-400 font-bold block text-[10px] uppercase">Dependents</span>
              <span className="font-bold text-warm-800">{profile.dependents} Dependents</span>
            </div>
          </div>

          {/* Core Numbers 3-Column Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-warm-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-warm-500 block">
                Total Household Inflow
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {formatINR(totalHouseholdIncome)}
              </div>
              <span className="text-[11px] text-warm-500 font-medium">
                Combined Salaried &amp; Family Inflows
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-warm-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-warm-500 block">
                Household Obligations
              </span>
              <div className="text-2xl font-black text-red-600 mt-1">
                {formatINR(totalHouseholdObligations)}
              </div>
              <span className="text-[11px] text-warm-500 font-medium">
                Fixed Needs + Debt EMIs + Healthcare
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Audited Net Surplus
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {formatINR(monthlySurplus)}
              </div>
              <span className="text-[11px] font-bold text-emerald-700">
                {surplusRatio}% Net Family Surplus Margin
              </span>
            </div>
          </div>

          {/* Emergency Fund & Goal Feasibility Diagnostics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-warm-200 space-y-2 text-xs">
              <h5 className="font-black text-warm-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Emergency Buffer Diagnosis</span>
              </h5>
              <div className="flex justify-between">
                <span className="text-warm-600 font-medium">Current Liquid Savings:</span>
                <span className="font-bold text-warm-900">{formatINR(profile.currentSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-600 font-medium">3-Month Safe Lockbox Threshold:</span>
                <span className="font-bold text-purple-700">{formatINR(required3MoBuffer)}</span>
              </div>
              <div className="flex justify-between border-t border-warm-100 pt-1">
                <span className="text-warm-600 font-medium">Moat Status:</span>
                <span
                  className={`font-bold ${
                    baselineEmergencyFundMonths < 3.0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {baselineEmergencyFundMonths} Months{' '}
                  {baselineEmergencyFundMonths < 3.0 && '(Refill Recommended)'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-warm-200 space-y-2 text-xs">
              <h5 className="font-black text-warm-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Primary Goal Feasibility</span>
              </h5>
              <div className="flex justify-between">
                <span className="text-warm-600 font-medium">Target Goal:</span>
                <span className="font-bold text-warm-900">{profile.futureGoalText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-600 font-medium">Recommended SIP Allocation:</span>
                <span className="font-bold text-purple-700">
                  {formatINR(Math.round(monthlySurplus * 0.41))} / month
                </span>
              </div>
              <div className="flex justify-between border-t border-warm-100 pt-1">
                <span className="text-warm-600 font-medium">Instrument Vehicles:</span>
                <span className="font-bold text-warm-800">Balanced Advantage &amp; Target Maturity</span>
              </div>
            </div>
          </div>

          {/* SEBI Advisor Annotation & Digital Sign-off Form */}
          <form onSubmit={handleSignOff} className="p-5 rounded-2xl bg-white border border-warm-200 space-y-4">
            <div className="flex items-center justify-between border-b border-warm-100 pb-2">
              <h5 className="font-black text-warm-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-700" />
                <span>Certified SEBI Investment Advisor Sign-Off</span>
              </h5>
              <span className="text-[10px] text-warm-400 font-bold">SEBI (IA) Regulations, 2013</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-warm-700 mb-1">
                  Advisor Name &amp; Designation
                </label>
                <input
                  type="text"
                  value={advisorName}
                  onChange={(e) => setAdvisorName(e.target.value)}
                  className="w-full px-3 py-2 clay-input text-xs font-bold text-warm-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-warm-700 mb-1">
                  SEBI RIA Registration Number
                </label>
                <input
                  type="text"
                  value={sebiRegNumber}
                  onChange={(e) => setSebiRegNumber(e.target.value)}
                  className="w-full px-3 py-2 clay-input text-xs font-bold text-purple-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-warm-700 mb-1">
                Fiduciary Annotations &amp; Tailored Recommendations
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 clay-input text-xs text-warm-800 font-medium"
                placeholder="Enter regulatory notes, risk assessment observations, or asset allocation adjustments..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-warm-500 italic font-medium">
                Digitally sealed and verifiable by client
              </span>
              <button
                type="submit"
                className="clay-btn-primary px-5 py-2.5 text-xs font-black flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-200" />
                <span>{advisorVerified ? 'Update RIA Sign-Off' : 'Approve & Sign Plan as SEBI RIA'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="clay-btn-secondary px-5 py-2.5 text-xs font-bold"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
