import React, { useState } from 'react';
import { useFinancialStore, HouseholdMemberItem } from '../context/FinancialContext';
import { formatINR } from '../utils/financialSolvers';
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit2,
  HeartHandshake,
  ShieldAlert,
  X,
  CheckCircle2,
} from 'lucide-react';

export const HouseholdModule: React.FC = () => {
  const {
    dynamicHouseholdList,
    totalHouseholdIncome,
    totalHouseholdObligations,
    monthlySurplus,
    addExtraHouseholdItem,
    removeExtraHouseholdItem,
    updateHouseholdRow,
  } = useFinancialStore();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HouseholdMemberItem | null>(null);

  // Invite form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newAmount, setNewAmount] = useState<number>(25000);

  // Edit row form state
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');

  const obligationPercentage =
    totalHouseholdIncome > 0
      ? Math.min(100, Math.round((totalHouseholdObligations / totalHouseholdIncome) * 100))
      : 0;

  const surplusPercentage =
    totalHouseholdIncome > 0 ? Math.max(0, 100 - obligationPercentage) : 0;

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addExtraHouseholdItem({
      title: newTitle,
      subtitle: newSubtitle || (newType === 'income' ? 'Household Inflow' : 'Household Outflow'),
      amount: newType === 'income' ? Math.abs(newAmount) : -Math.abs(newAmount),
    });

    setNewTitle('');
    setNewSubtitle('');
    setNewAmount(25000);
    setIsInviteModalOpen(false);
  };

  const startEditing = (item: HouseholdMemberItem) => {
    setEditingItem(item);
    setEditAmount(Math.abs(item.amount));
    setEditTitle(item.title);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const finalAmount = editingItem.amount >= 0 ? Math.abs(editAmount) : -Math.abs(editAmount);
    updateHouseholdRow(editingItem.id, finalAmount, editTitle);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-warm-100 to-warm-50 p-6 sm:p-8 rounded-3xl border border-warm-200 shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold clay-badge-green mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Joint Family Balance Sheet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-900 tracking-tight">
            Household &amp; Joint Finance Mode
          </h1>
          <p className="text-sm font-semibold text-warm-600 mt-1">
            Indian financial planning isn&apos;t individualistic. Model variable shop cash flows, parental healthcare buffers, and joint liabilities in one collective framework.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="clay-btn-primary px-5 py-3 text-xs font-black flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-purple-200" />
          <span>Invite family member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Card 1 — My Household Breakdown List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="clay-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-warm-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-warm-900">
                  Card 1 — My Household Breakdown List
                </h2>
                <p className="text-xs text-warm-500 font-medium">Live collective inflows &amp; outflows</p>
              </div>
              <span className="text-xs font-bold text-warm-700 bg-warm-100 px-3 py-1 rounded-full">
                {dynamicHouseholdList.length} Accounts Linked
              </span>
            </div>

            <div className="space-y-3">
              {dynamicHouseholdList.map((member) => {
                const isIncome = member.amount > 0;
                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl bg-[#FCFAF7] border border-warm-200/80 shadow-clay-sm flex items-center justify-between gap-4 transition-all hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isIncome ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-warm-900">{member.title}</h4>
                          {member.isCoreProfileLink && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">
                              Profile Synced
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-warm-500 font-medium">{member.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-base font-black ${
                          isIncome ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {isIncome ? `+${formatINR(member.amount)}` : `-${formatINR(Math.abs(member.amount))}`}
                      </span>

                      {/* Edit Button */}
                      <button
                        onClick={() => startEditing(member)}
                        className="p-1.5 text-warm-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit amount"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button (Only for extra members) */}
                      {!member.isCoreProfileLink && (
                        <button
                          onClick={() => removeExtraHouseholdItem(member.id)}
                          className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from joint sheet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="clay-btn-primary px-4 py-2.5 text-xs font-extrabold flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-purple-200" />
                <span>Invite family member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 — Monthly Balance Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-card-warm p-6 sm:p-8 space-y-6">
            <div className="border-b border-warm-200 pb-3">
              <h3 className="text-lg font-black text-warm-900">
                Card 2 — Monthly balance Summary
              </h3>
              <p className="text-xs text-warm-600 font-medium">Deterministic Net Family Surplus</p>
            </div>

            {/* Income Progress Metric with Full Purple Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-warm-800">Total Income:</span>
                <span className="text-base font-black text-purple-900">
                  {formatINR(totalHouseholdIncome)}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-warm-200 overflow-hidden p-0.5 border border-warm-300 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-500 w-full transition-all duration-500"
                  title="Full purple progress bar"
                />
              </div>
            </div>

            {/* Obligations Proportional Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-warm-800">Total Obligations:</span>
                <span className="text-base font-black text-red-600">
                  {formatINR(totalHouseholdObligations)}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-warm-200 overflow-hidden p-0.5 border border-warm-300 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                  style={{ width: `${obligationPercentage}%` }}
                  title={`${obligationPercentage}% obligations`}
                />
              </div>
              <span className="text-[10px] text-warm-500 font-semibold block text-right">
                {obligationPercentage}% of joint family earnings committed
              </span>
            </div>

            {/* Surplus Highlighted in Green */}
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-clay-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Net Monthly Family Surplus
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-700">
                  {formatINR(monthlySurplus)}
                </span>
                <span className="text-xs font-bold text-emerald-800 px-2.5 py-1 rounded-full bg-emerald-100">
                  {surplusPercentage}% Retained
                </span>
              </div>
              <p className="text-xs text-emerald-900 pt-1 leading-relaxed font-medium">
                This {formatINR(monthlySurplus)} unencumbered surplus is available to fund Rohit&apos;s ₹60 Lakh house down payment and parental medical safeguards simultaneously.
              </p>
            </div>

            {/* Parental Medical Buffer Insight */}
            <div className="p-4 bg-white rounded-2xl border border-warm-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Parental Medical Safety Note</span>
              </div>
              <p className="text-warm-600 leading-relaxed font-medium">
                Mother&apos;s ongoing medical care is budgeted. Ensure a dedicated <strong>Super Top-Up Health Floater</strong> (₹50L above ₹10L base) protects the family from hospital bill shocks without depleting house savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Household Row Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="clay-card p-6 sm:p-8 max-w-md w-full space-y-5 relative border border-warm-200">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-1.5 text-warm-400 hover:text-warm-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-warm-900">
                Edit {editingItem.title}
              </h3>
              <p className="text-xs text-warm-500 font-medium">
                {editingItem.isCoreProfileLink
                  ? 'Note: Updating this will also update your Tab 1 Profile!'
                  : 'Update monthly inflow or outflow amount'}
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Monthly Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-warm-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3.5 py-2.5 clay-input text-base font-black text-warm-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="clay-btn-secondary px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn-primary px-5 py-2 text-xs font-black flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-200" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Family Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="clay-card p-6 sm:p-8 max-w-lg w-full space-y-6 relative border border-warm-200">
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 text-warm-400 hover:text-warm-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-warm-100 pb-3">
              <h3 className="text-xl font-black text-warm-900">
                Invite Family Member to Joint Sheet
              </h3>
              <p className="text-xs text-warm-500 font-medium mt-1">
                Add spouse, parent, sibling cash flow, medical buffer, or child education expense
              </p>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Family Member &amp; Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spouse (IT Freelance) or Sister (College Fees)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-input text-sm font-semibold text-warm-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Cash Flow Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2.5 clay-input text-xs font-bold text-warm-900 bg-[#F6F1E9]"
                  >
                    <option value="income">Income (Inflow +)</option>
                    <option value="expense">Obligation / Living Cost (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Monthly Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 clay-input text-sm font-bold text-warm-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Description / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Consulting retainers or Quarter-end bonus"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 clay-input text-xs text-warm-800 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-warm-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="clay-btn-secondary px-4 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn-primary px-5 py-2.5 text-xs font-black flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-200" />
                  <span>Add to Joint Balance Sheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
