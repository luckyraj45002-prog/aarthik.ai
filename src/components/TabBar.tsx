import React from 'react';
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
      id: 'personalized-plan',
      number: '7',
      label: 'Personalized Plan',
      icon: <FileCheck2 className="w-4 h-4" />,
      subtitle: advisorVerified ? 'RIA Approved' : 'Core Blueprint',
    },
  ];

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-2 no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all select-none text-left ${
                isActive
                  ? 'bg-[#7C3AED] text-white shadow-clay-btn scale-[1.02]'
                  : 'bg-white hover:bg-[#FAF6F0] text-warm-800 border border-[#E4DACF] shadow-clay-sm hover:scale-[1.01]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black ${
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
      </div>
    </nav>
  );
};
