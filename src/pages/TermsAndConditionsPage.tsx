import React from 'react';
import { ShieldCheck, Scale, Award, AlertCircle, ArrowLeft } from 'lucide-react';

interface TermsAndConditionsPageProps {
  onBack: () => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      <button
        onClick={onBack}
        className="clay-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Application</span>
      </button>

      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-8 rounded-3xl border border-warm-200 shadow-clay-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold clay-badge-green">
          <Scale className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fiduciary Regulatory Alignment</span>
        </div>
        <h1 className="text-3xl font-black text-warm-900 tracking-tight">
          Terms &amp; Conditions &amp; SEBI Fiduciary Disclosures
        </h1>
        <p className="text-sm font-medium text-warm-600">
          Governed under SEBI (Investment Advisers) Regulations, 2013 and Most Important Terms and Conditions (MITC)
        </p>
      </div>

      <div className="clay-card p-6 sm:p-10 space-y-8 text-warm-800 text-sm leading-relaxed">
        {/* Section 1: Fiduciary & SEBI Alignment */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Award className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              1. Fiduciary &amp; SEBI Regulatory Alignment
            </h2>
          </div>
          <p>
            Aarthik.ai operates on an uncompromising <strong>product-agnostic, fee-only fiduciary model</strong>. In full alignment with the Securities and Exchange Board of India (Investment Advisers) Regulations, 2013:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-warm-700">
            <li>We do not accept commission or distribution fees from mutual fund Asset Management Companies (AMCs), insurance underwriters, or lending institutions.</li>
            <li>All recommendations strictly prioritize Direct Mutual Funds and institutional-grade sovereign instruments over high-commission regular distributor plans.</li>
            <li>Every conflict of interest is proactively disclosed through our transparent &quot;Why-First&quot; rationales.</li>
          </ul>
        </section>

        {/* Section 2: Role of AI vs Registered Human Experts */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              2. Rigid Deterministic Solvers vs. Explainable AI
            </h2>
          </div>
          <p className="font-semibold text-warm-900">
            Critical Compliance Standard: AI Never Hallucinates Financial Figures.
          </p>
          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2 text-xs">
            <p>
              All quantitative calculations on Aarthik.ai—including your Emergency Liquidity Lockbox thresholds, Debt-to-Income ratios, and Time Machine goal delay metrics—are governed by <strong>rigid, audited mathematical solvers</strong>.
            </p>
            <p>
              Large Language Models (LLMs) are restricted strictly to narrative explainability and conversational literacy. <strong>AI never selects your investments.</strong> Final investment plans and tailored dossiers are reviewed, annotated, and verified by certified SEBI-Registered Investment Advisors (RIAs).
            </p>
          </div>
        </section>

        {/* Section 3: No Unsolicited Trade Execution */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              3. No Unsolicited Trade Execution
            </h2>
          </div>
          <p>
            Aarthik.ai is an objective advisory and diagnostic platform, not an execution broker. The platform will <strong>never execute transactions, buy orders, or loan applications without your explicit, separate, positive authentication</strong>.
          </p>
          <p className="text-xs text-warm-700">
            Content displayed in the Macro module (World News &amp; Market Impact Engine) is provided solely for economic literacy. It does not constitute investment advice, equity research reports, or specific buy/sell recommendations under SEBI (Research Analysts) Regulations.
          </p>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="space-y-2 pt-2 border-t border-warm-100 text-xs text-warm-500">
          <p>
            Mutual fund investments are subject to market risks. Past performance does not guarantee future results. Simulated returns in the Time Machine and Goal roadmaps are calculated assumptions designed for scenario stress-testing, not contractual guarantees.
          </p>
        </section>
      </div>
    </div>
  );
};
