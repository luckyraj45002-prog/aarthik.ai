import React from 'react';
import { Lock, ShieldCheck, Database, Key, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Cryptographic Fiduciary Charter</span>
        </div>
        <h1 className="text-3xl font-black text-warm-900 tracking-tight">
          Zero-Knowledge Privacy Architecture &amp; Data Policy
        </h1>
        <p className="text-sm font-medium text-warm-600">
          Last revised: October 2026 · Compliant with RBI Account Aggregator Framework &amp; Digital Personal Data Protection Act (DPDPA)
        </p>
      </div>

      <div className="clay-card p-6 sm:p-10 space-y-8 text-warm-800 text-sm leading-relaxed">
        {/* Section 1: Zero-Knowledge Privacy Architecture */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Key className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              1. Zero-Knowledge Privacy Architecture
            </h2>
          </div>
          <p>
            At Aarthik.ai, privacy is not a contractual afterthought—it is baked into our cryptographic architecture. All client financial data, monthly cash flow records, salary slips, and portfolio holdings are encrypted client-side using industry-standard <strong>AES-256-GCM</strong> encryption keys derived from your primary credentials.
          </p>
          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2 text-xs">
            <span className="font-extrabold text-warm-900 uppercase tracking-wider block">
              Architectural Key Principle
            </span>
            <p className="text-warm-700">
              Our backend cloud servers never possess the cryptographic keys needed to decrypt your raw financial assets, bank statements, or family balance sheets. In mathematical terms, the platform operates as a zero-knowledge computational pipeline.
            </p>
          </div>
        </section>

        {/* Section 2: Strict Non-Monetization Pledge */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              2. Strict Non-Monetization Pledge
            </h2>
          </div>
          <p>
            Traditional fintech applications subsidize &quot;free&quot; tools by surreptitiously selling user data to insurance brokers, loan telemarketers, and aggressive credit card distributors.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold space-y-1">
            <p className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Aarthik.ai Absolute Non-Monetization Commitment:</span>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-900">
              <li>Your financial figures, income statements, and cash flows are <strong>NEVER sold, rented, or bartered</strong>.</li>
              <li>We receive <strong>zero kickbacks, referral bounties, or commissions</strong> from financial institutions.</li>
              <li>You will never receive unsolicited marketing calls or spam from third-party lenders.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Account Aggregator (AA) Consent Framework */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              3. Account Aggregator (AA) Consent Framework
            </h2>
          </div>
          <p>
            Our Impulse Guard and diagnostic cash flow features link through RBI-licensed Account Aggregators (AAs) using electronic, cryptographically verifiable consent artifacts.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-warm-700">
            <li><strong>Read-Only Access:</strong> The Account Aggregator connection is strictly read-only. Aarthik.ai has zero transactional initiation privileges and cannot debit funds.</li>
            <li><strong>Granular &amp; Revocable:</strong> You may instantly revoke bank feed consent from your dashboard at any time, terminating all background synchronization immediately.</li>
            <li><strong>Purpose Limitation:</strong> Data pulled via Account Aggregators is processed ephemerally solely to compute your Safeguard Lockbox and Leisure Limits.</li>
          </ul>
        </section>

        {/* Section 4: Demo Account Isolation */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-black text-warm-900">
              4. Demo Account Sandbox Isolation
            </h2>
          </div>
          <p>
            When utilizing the <strong>Interactive Demo Account (Rohit Kumar)</strong>:
          </p>
          <p className="text-xs text-warm-700 leading-relaxed">
            All variables, balance sheet adjustments, and what-if simulations execute entirely within your browser&apos;s ephemeral local memory (localStorage). No personally identifiable information (PII) is captured, tracked, or sent to external analytical telemetry. Clicking <strong>Reset Demo Data</strong> immediately flushes all sandbox variables.
          </p>
        </section>
      </div>
    </div>
  );
};
