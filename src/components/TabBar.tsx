import React, { useEffect } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import {
  UserCircle2,
  Clock,
  Users,
  ShieldAlert,
  Zap,
  Globe2,
  FileCheck2,
} from 'lucide-react';

interface TabItem {
  id: string;
  number: string;
  label: string;
  icon: React.ReactNode;
  subtitle: string;
}

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab, healthScore, gatewayState, advisorVerified } =
    useFinancialStore();

  // Automatically scroll active tab into view so it is never clipped
  useEffect(() => {
    const el = document.getElementById(`tab-pill-${activeTab}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  const tabs: TabItem[] = [
    {
      id: 'profile',
      number: '1',
      label: 'Profile',
      icon: <UserCircle2 className="w-4 h-4" />,
      subtitle: `Score ${healthScore}/100`,
    },
    {
      id: 'time-machine',
      number: '2',
      label: 'Time Machine',
      icon: <Clock className="w-4 h-4" />,
      subtitle: 'What-If Decisions',
    },
    {
      id: 'household',
      number: '3',
      label: 'Household',
      icon: <Users className="w-4 h-4" />,
      subtitle: 'Joint Balance Sheet',
    },
    {
      id: 'gateway',
      number: '4',
      label: 'Gateway',
      icon: <ShieldAlert className="w-4 h-4" />,
      subtitle: gatewayState.completed && gatewayState.passed ? 'Unlocked' : 'Safety Net',
    },
    {
      id: 'impulse-guard',
      number: '5',
      label: 'Impulse Guard',
      icon: <Zap className="w-4 h-4" />,
      subtitle: 'Spend Coach',
    },
    {
      id: 'macro',
      number: '6',
      label: 'Macro',
      icon: <Globe2 className="w-4 h-4" />,
      subtitle: 'Causal Engine',
    },
    {
      id: 'expert-plan',
      number: '7',
      label: 'Expert Plan',
      icon: <FileCheck2 className="w-4 h-4" />,
      subtitle: advisorVerified ? 'RIA Approved' : 'Why-First Dossier',
    },
  ];

  return (
    <div className="w-full sticky top-[57px] z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* 1. Primary Smooth Horizontally Swipeable Tab Bar */}
      <nav
        className="w-full overflow-x-auto flex items-center justify-start gap-2.5 px-4 py-3 bg-slate-50/90 no-scrollbar scroll-smooth snap-x"
        aria-label="Features navigation"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-pill-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 snap-start min-w-max flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-left transition-all select-none ${
                isActive
                  ? 'bg-[#7C3AED] text-white shadow-clay-btn scale-[1.02]'
                  : 'bg-white hover:bg-[#FAF6F0] text-warm-800 border border-[#E4DACF] shadow-clay-sm hover:scale-[1.01]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-warm-100 text-warm-700'
                }`}
              >
                {tab.number}
              </div>

              <div className="flex flex-col pr-1">
                <span className={`text-sm font-extrabold leading-tight ${isActive ? 'text-white' : 'text-warm-900'}`}>
                  {tab.label}
                </span>
                <span className={`text-[10px] font-semibold leading-none mt-0.5 ${isActive ? 'text-purple-200' : 'text-warm-500'}`}>
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 2. Compact 1-Tap Quick Jump Bar for Instant Mobile Access to All 7 Features */}
      <div className="w-full max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-1 border-t border-slate-200/60 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[42px] py-1 px-1 rounded-xl text-center transition-all ${
                isActive
                  ? 'bg-[#7C3AED] text-white font-black shadow-xs ring-1 ring-purple-300 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 font-bold'
              }`}
              title={`${tab.number}. ${tab.label} (${tab.subtitle})`}
            >
              <div className="text-[11px] font-black leading-none">{tab.number}</div>
              <div className="text-[8px] sm:text-[9px] truncate tracking-tighter opacity-90 leading-tight mt-0.5">
                {tab.label.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
