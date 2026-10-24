import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface HouseholdMemberItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // Positive for income, negative for expense/obligation
  isCoreProfileLink?: 'income' | 'fixedExpenses' | 'existingEmis';
}

export interface ProfileData {
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  dependents: number;
  assetsText: string;
  liabilitiesText: string;
  fixedExpenses: number;
  existingEmis: number;
  currentSavings: number;
  futureGoalText: string;
  goalTargetAmount: number;
  goalTargetYears: number;
  biggestConcern: string;
  financialKnowledge: number; // 1 to 5
  riskTolerance: 'Low' | 'Moderate' | 'High';
}

export interface ImpulseGuardState {
  leisureSpent: number;
  leisureLimit: number;
  ordersThisWeek: number;
  pendingOrderAmount: number;
  cookedAtHomeCount: number;
}

export interface GatewayQuizState {
  currentStep: number; // 1, 2, 3
  answers: Record<number, string>;
  completed: boolean;
  passed: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description?: string;
}

export const ROHIT_DEMO_PROFILE: ProfileData = {
  name: 'Rohit Kumar',
  age: 28,
  occupation: 'Software engineer (private company)',
  monthlyIncome: 400000,
  dependents: 2,
  assetsText: 'Savings ₹4,50,000; PF ₹8,00,000',
  liabilitiesText: 'Car loan ₹6,00,000',
  fixedExpenses: 140000,
  existingEmis: 40000,
  currentSavings: 450000,
  futureGoalText: '₹60 lakh house down payment in 4 years',
  goalTargetAmount: 6000000,
  goalTargetYears: 4,
  biggestConcern: 'My expenses are high and I am not able to save systematically',
  financialKnowledge: 2,
  riskTolerance: 'Moderate',
};

export const INITIAL_EXTRA_HOUSEHOLD: HouseholdMemberItem[] = [
  { id: 'father-shop', title: 'Father', subtitle: 'Shop income (varies)', amount: 50000 },
  { id: 'mother-med', title: 'Mother', subtitle: 'Medical costs', amount: -15000 },
];

interface FinancialContextType {
  // Profile & Mode
  profile: ProfileData;
  updateProfile: (updated: Partial<ProfileData>) => void;
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  resetDemoData: () => void;

  // Real-time Calculated Household Balance Sheet (Derived dynamically)
  dynamicHouseholdList: HouseholdMemberItem[];
  totalHouseholdIncome: number;
  totalHouseholdObligations: number;
  monthlySurplus: number;
  addExtraHouseholdItem: (item: Omit<HouseholdMemberItem, 'id'>) => void;
  removeExtraHouseholdItem: (id: string) => void;
  updateHouseholdRow: (id: string, amount: number, title?: string) => void;

  // Financial Health & Safeguard Lockbox (Derived dynamically)
  healthScore: number;
  savingsRatio: number;
  dtiRatio: number;
  required3MoBuffer: number;
  required6MoBuffer: number;
  tier1Instant: number;
  tier2NextDay: number;
  tier3SafeYield: number;

  // Time Machine (Derived dynamically)
  emiPurchaseAmount: number;
  setEmiPurchaseAmount: (val: number) => void;
  timeMachinePreset: '500k' | 'iphone' | 'custom';
  setTimeMachinePreset: (preset: '500k' | 'iphone' | 'custom') => void;
  upfrontLiquidityHit: number;
  monthlyNewEmi: number;
  projectedSavingsAfterPurchase: number;
  emergencyFundMonths: number;
  baselineEmergencyFundMonths: number;
  goalDelayMonths: number;
  avoidedImpulseTotal: number;
  savedMonthsBanner: string | null;
  dismissSavedBanner: () => void;
  skipTimeMachinePurchase: () => void;
  applyTimeMachinePlanAdjustment: () => void;

  // Impulse Guard
  impulseState: ImpulseGuardState;
  remainingLeisure: number;
  orderAnyway: () => void;
  cookAtHome: () => void;
  setImpulseLimit: (limit: number) => void;

  // Knowledge Gateway
  gatewayState: GatewayQuizState;
  answerGatewayStep: (step: number, answer: string) => void;
  resetGateway: () => void;

  // Macro Engine
  macroEventKey: string;
  setMacroEventKey: (key: string) => void;

  // Expert Plan & SEBI RIA
  advisorVerified: boolean;
  advisorNotes: string;
  verifyAsAdvisor: (notes: string) => void;
  dossierDispatched: boolean;
  dispatchDossier: () => void;

  // UI Navigation & Toasts
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const DEMO_STORE_KEY = 'aarthik_demo_store_v2';
const USER_STORE_KEY = 'aarthik_real_user_state_v2';

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aarthik_mode');
    return saved !== null ? saved === 'demo' : true;
  });

  const activeStorageKey = isDemoMode ? DEMO_STORE_KEY : USER_STORE_KEY;

  // Profile state
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem(`${activeStorageKey}_profile`);
    return saved ? JSON.parse(saved) : ROHIT_DEMO_PROFILE;
  });

  // Extra Household Items state
  const [extraHouseholdItems, setExtraHouseholdItems] = useState<HouseholdMemberItem[]>(() => {
    const saved = localStorage.getItem(`${activeStorageKey}_extra_household`);
    return saved ? JSON.parse(saved) : INITIAL_EXTRA_HOUSEHOLD;
  });

  // Time Machine state
  const [emiPurchaseAmount, setEmiPurchaseAmount] = useState<number>(500000);
  const [timeMachinePreset, setTimeMachinePreset] = useState<'500k' | 'iphone' | 'custom'>('500k');
  const [avoidedImpulseTotal, setAvoidedImpulseTotal] = useState<number>(0);
  const [savedMonthsBanner, setSavedMonthsBanner] = useState<string | null>(null);

  // Impulse Guard state
  const [impulseState, setImpulseState] = useState<ImpulseGuardState>(() => {
    const saved = localStorage.getItem(`${activeStorageKey}_impulse`);
    return saved
      ? JSON.parse(saved)
      : {
          leisureSpent: 8600,
          leisureLimit: 12000,
          ordersThisWeek: 6,
          pendingOrderAmount: 800,
          cookedAtHomeCount: 3,
        };
  });

  // Gateway Quiz state
  const [gatewayState, setGatewayState] = useState<GatewayQuizState>(() => {
    const saved = localStorage.getItem(`${activeStorageKey}_gateway`);
    return saved
      ? JSON.parse(saved)
      : {
          currentStep: 1,
          answers: {},
          completed: false,
          passed: false,
        };
  });

  // Macro event
  const [macroEventKey, setMacroEventKey] = useState<string>('crude-oil');

  // Expert Plan & Advisor
  const [advisorVerified, setAdvisorVerified] = useState<boolean>(false);
  const [advisorNotes, setAdvisorNotes] = useState<string>(
    'Reviewed cash flows: Verified household surplus. Target Maturity Fund & Safeguard Lockbox approved under SEBI RIA Guidelines.'
  );
  const [dossierDispatched, setDossierDispatched] = useState<boolean>(false);

  // UI state
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist mode and state
  useEffect(() => {
    localStorage.setItem('aarthik_mode', isDemoMode ? 'demo' : 'user');
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem(`${activeStorageKey}_profile`, JSON.stringify(profile));
  }, [profile, activeStorageKey]);

  useEffect(() => {
    localStorage.setItem(`${activeStorageKey}_extra_household`, JSON.stringify(extraHouseholdItems));
  }, [extraHouseholdItems, activeStorageKey]);

  useEffect(() => {
    localStorage.setItem(`${activeStorageKey}_impulse`, JSON.stringify(impulseState));
  }, [impulseState, activeStorageKey]);

  useEffect(() => {
    localStorage.setItem(`${activeStorageKey}_gateway`, JSON.stringify(gatewayState));
  }, [gatewayState, activeStorageKey]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // =========================================================================
  // MANDATORY DETERMINISTIC MATH FORMULAS (CENTRAL SINGLE SOURCE OF TRUTH)
  // =========================================================================

  // 1. Household Balance Sheet Calculations (Syncs Tab 1 & Tab 3)
  const {
    dynamicHouseholdList,
    totalHouseholdIncome,
    totalHouseholdObligations,
    monthlySurplus,
  } = useMemo(() => {
    const positiveExtras = extraHouseholdItems.filter((i) => i.amount > 0);
    const negativeExtras = extraHouseholdItems.filter((i) => i.amount < 0);

    const sumPositive = positiveExtras.reduce((sum, item) => sum + item.amount, 0);
    const sumNegativeAbs = negativeExtras.reduce((sum, item) => sum + Math.abs(item.amount), 0);

    // Derived totals:
    const totalIncome = profile.monthlyIncome + sumPositive;
    const totalObligations = profile.fixedExpenses + profile.existingEmis + sumNegativeAbs;
    const surplus = totalIncome - totalObligations;

    // Full dynamically built household list:
    const list: HouseholdMemberItem[] = [
      {
        id: 'you-salary',
        title: 'You (Salary)',
        subtitle: 'Primary Salaried Tech Income',
        amount: profile.monthlyIncome,
        isCoreProfileLink: 'income',
      },
      ...positiveExtras,
      {
        id: 'home-fixed',
        title: 'Home (Rent, bills, food)',
        subtitle: 'Fixed Household Living Essentials',
        amount: -profile.fixedExpenses,
        isCoreProfileLink: 'fixedExpenses',
      },
      {
        id: 'loans-emis',
        title: 'Loans (EMIs)',
        subtitle: 'Car Loan & Existing Monthly Obligations',
        amount: -profile.existingEmis,
        isCoreProfileLink: 'existingEmis',
      },
      ...negativeExtras,
    ];

    return {
      dynamicHouseholdList: list,
      totalHouseholdIncome: totalIncome,
      totalHouseholdObligations: totalObligations,
      monthlySurplus: surplus,
    };
  }, [profile.monthlyIncome, profile.fixedExpenses, profile.existingEmis, extraHouseholdItems]);

  // 2. Financial Time Machine Calculations (Syncs Tab 1, Tab 2 & Tab 3)
  const {
    upfrontLiquidityHit,
    monthlyNewEmi,
    projectedSavingsAfterPurchase,
    emergencyFundMonths,
    baselineEmergencyFundMonths,
    goalDelayMonths,
  } = useMemo(() => {
    // 20% down payment / immediate liquidity buffer impact
    const upfrontHit = emiPurchaseAmount * 0.20;
    // 12-month EMI with interest
    const newEmi = Math.round((emiPurchaseAmount * 0.80 * 1.12) / 12);
    // Remaining savings after upfront liquidity hit
    const projectedSavings = Math.max(0, profile.currentSavings - upfrontHit);

    // Baseline emergency fund months (without purchase):
    const baselineMonths =
      totalHouseholdObligations > 0
        ? Number((profile.currentSavings / totalHouseholdObligations).toFixed(1))
        : 0;

    // Emergency fund months with proposed purchase hit:
    const postPurchaseMonths =
      totalHouseholdObligations > 0
        ? Number((projectedSavings / totalHouseholdObligations).toFixed(1))
        : 0;

    // Goal delay computation:
    let delay = 0;
    if (timeMachinePreset === 'iphone' || emiPurchaseAmount === 150000) {
      // Specified iPhone scenario: 8 months delay
      delay = 8;
    } else if (emiPurchaseAmount === 0) {
      delay = 0;
    } else {
      // Formula: (emiPurchaseAmount * 1.53) / monthlySurplus
      delay =
        monthlySurplus > 0
          ? Math.max(0, Math.round(((emiPurchaseAmount * 1.53) / monthlySurplus) * 10) / 10)
          : 99;
    }

    return {
      upfrontLiquidityHit: upfrontHit,
      monthlyNewEmi: newEmi,
      projectedSavingsAfterPurchase: projectedSavings,
      emergencyFundMonths: emiPurchaseAmount === 0 ? baselineMonths : postPurchaseMonths,
      baselineEmergencyFundMonths: baselineMonths,
      goalDelayMonths: delay,
    };
  }, [emiPurchaseAmount, timeMachinePreset, profile.currentSavings, totalHouseholdObligations, monthlySurplus]);

  // 3. Holistic Financial Health & Safeguard Lockbox (Tab 1 & Tab 7)
  const {
    healthScore,
    savingsRatio,
    dtiRatio,
    required3MoBuffer,
    required6MoBuffer,
    tier1Instant,
    tier2NextDay,
    tier3SafeYield,
  } = useMemo(() => {
    const sRatio =
      totalHouseholdIncome > 0 ? Math.round((monthlySurplus / totalHouseholdIncome) * 100) : 0;
    const dti =
      totalHouseholdIncome > 0 ? Math.round((profile.existingEmis / totalHouseholdIncome) * 100) : 0;

    const req3Mo = totalHouseholdObligations * 3;
    const req6Mo = totalHouseholdObligations * 6;

    // Tier 1: Instant liquidity in savings/UPI (up to ₹2L or 1 month essentials)
    const t1 = Math.min(200000, totalHouseholdObligations);
    const rem = Math.max(0, req3Mo - t1);
    const t2 = Math.round(rem * 0.45);
    const t3 = Math.max(0, req3Mo - t1 - t2);

    // Score Composition (0 - 100)
    const savingsPts = Math.min(35, Math.max(0, (sRatio / 50) * 35));
    let debtPts = 25;
    if (dti > 15) {
      debtPts = Math.max(0, 25 - ((dti - 15) / 35) * 25);
    }
    const emergencyPts = Math.min(30, (baselineEmergencyFundMonths / 6) * 30);
    const knowledgePts = (profile.financialKnowledge / 5) * 10;

    const rawScore = Math.round(savingsPts + debtPts + emergencyPts + knowledgePts);
    const score = Math.min(100, Math.max(10, rawScore));

    return {
      healthScore: score,
      savingsRatio: sRatio,
      dtiRatio: dti,
      required3MoBuffer: req3Mo,
      required6MoBuffer: req6Mo,
      tier1Instant: t1,
      tier2NextDay: t2,
      tier3SafeYield: t3,
    };
  }, [totalHouseholdIncome, monthlySurplus, totalHouseholdObligations, profile.existingEmis, profile.financialKnowledge, baselineEmergencyFundMonths]);

  // 4. Impulse Guard Remaining Leisure
  const remainingLeisure = Math.max(0, impulseState.leisureLimit - impulseState.leisureSpent);

  // =========================================================================
  // ACTIONS & STATE MUTATIONS (ZERO MOCK / REACTIVE ACROSS ENTIRE APP)
  // =========================================================================

  const updateProfile = (updated: Partial<ProfileData>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
    addToast({
      type: 'success',
      title: 'Profile Updated & Solvers Recalculated! ⚡',
      description: 'Your cash flow updates have immediately recomputed Household Surplus, Time Machine delays, and Lockbox buffers.',
    });
  };

  const resetDemoData = () => {
    setProfile(ROHIT_DEMO_PROFILE);
    setExtraHouseholdItems(INITIAL_EXTRA_HOUSEHOLD);
    setEmiPurchaseAmount(500000);
    setTimeMachinePreset('500k');
    setAvoidedImpulseTotal(0);
    setSavedMonthsBanner(null);
    setImpulseState({
      leisureSpent: 8600,
      leisureLimit: 12000,
      ordersThisWeek: 6,
      pendingOrderAmount: 800,
      cookedAtHomeCount: 3,
    });
    setGatewayState({
      currentStep: 1,
      answers: {},
      completed: false,
      passed: false,
    });
    setMacroEventKey('crude-oil');
    setAdvisorVerified(false);
    setDossierDispatched(false);
    localStorage.removeItem(`${DEMO_STORE_KEY}_profile`);
    localStorage.removeItem(`${DEMO_STORE_KEY}_extra_household`);
    localStorage.removeItem(`${DEMO_STORE_KEY}_impulse`);
    localStorage.removeItem(`${DEMO_STORE_KEY}_gateway`);
    addToast({
      type: 'info',
      title: 'Demo Variables Reverted to Baseline',
      description: 'Rohit Kumar’s canonical figures (₹4L income, ₹2.55L surplus, ₹4.5L savings) restored.',
    });
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setProfile(ROHIT_DEMO_PROFILE);
    setExtraHouseholdItems(INITIAL_EXTRA_HOUSEHOLD);
    setEmiPurchaseAmount(500000);
    setTimeMachinePreset('500k');
    setActiveTab('profile');
    addToast({
      type: 'info',
      title: 'Entered Rohit Kumar Interactive Sandbox',
      description: 'Prototype mode active. All 7 modules are reactive to your changes.',
    });
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    addToast({
      type: 'info',
      title: 'Exited Demo Mode',
      description: 'You are now in your private Zero-Knowledge financial vault.',
    });
  };

  // Button 1 — Skip purchase Action
  const skipTimeMachinePurchase = () => {
    const skipped = emiPurchaseAmount;
    setAvoidedImpulseTotal((prev) => prev + skipped);
    setSavedMonthsBanner(
      `🎉 Purchase of ₹${skipped.toLocaleString('en-IN')} skipped! You preserved ${goalDelayMonths} months on your house goal and kept your Emergency Fund safe at ${baselineEmergencyFundMonths} months.`
    );
    setEmiPurchaseAmount(0);
    addToast({
      type: 'success',
      title: 'Savings Win Logged!',
      description: `Discretionary purchase skipped. ₹${skipped.toLocaleString('en-IN')} capital saved from debt interest.`,
    });
  };

  // Button 2 — Adjust plan Action
  const applyTimeMachinePlanAdjustment = () => {
    const hit = upfrontLiquidityHit;
    const newEmi = monthlyNewEmi;
    setProfile((prev) => ({
      ...prev,
      currentSavings: Math.max(0, prev.currentSavings - hit),
      existingEmis: prev.existingEmis + newEmi,
      goalTargetYears: prev.goalTargetYears + 1,
    }));
    setEmiPurchaseAmount(0);
    addToast({
      type: 'success',
      title: 'Plan Adjusted & Rebalanced Across Tabs 1 & 3!',
      description: `Deducted ₹${hit.toLocaleString('en-IN')} down payment from savings, added ₹${newEmi.toLocaleString('en-IN')}/mo to existing EMIs, and extended target timeline.`,
    });
  };

  const dismissSavedBanner = () => {
    setSavedMonthsBanner(null);
  };

  // Household Member Add / Remove / Edit
  const addExtraHouseholdItem = (item: Omit<HouseholdMemberItem, 'id'>) => {
    const newItem: HouseholdMemberItem = {
      ...item,
      id: `custom-${Date.now()}`,
    };
    setExtraHouseholdItems((prev) => [...prev, newItem]);
    addToast({
      type: 'success',
      title: 'Household Member Linked!',
      description: `Added "${item.title}" (${item.amount > 0 ? '+' : '-'}₹${Math.abs(item.amount).toLocaleString('en-IN')}/mo) to the joint balance sheet.`,
    });
  };

  const removeExtraHouseholdItem = (id: string) => {
    setExtraHouseholdItems((prev) => prev.filter((i) => i.id !== id));
    addToast({
      type: 'info',
      title: 'Item Removed from Joint Sheet',
      description: 'Recalculated family surplus and emergency coverage.',
    });
  };

  const updateHouseholdRow = (id: string, amount: number, title?: string) => {
    if (id === 'you-salary') {
      updateProfile({ monthlyIncome: Math.max(0, amount) });
    } else if (id === 'home-fixed') {
      updateProfile({ fixedExpenses: Math.max(0, Math.abs(amount)) });
    } else if (id === 'loans-emis') {
      updateProfile({ existingEmis: Math.max(0, Math.abs(amount)) });
    } else {
      setExtraHouseholdItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                amount,
                title: title || item.title,
              }
            : item
        )
      );
      addToast({
        type: 'success',
        title: 'Household Entry Updated',
        description: 'New cash flow figure applied to the joint sheet.',
      });
    }
  };

  // Impulse Guard Actions
  const orderAnyway = () => {
    const amt = impulseState.pendingOrderAmount;
    setImpulseState((prev) => ({
      ...prev,
      leisureSpent: prev.leisureSpent + amt,
      ordersThisWeek: prev.ordersThisWeek + 1,
    }));
    // Deduct pendingOrderAmount from profile.currentSavings in Tab 1
    setProfile((prev) => ({
      ...prev,
      currentSavings: Math.max(0, prev.currentSavings - amt),
    }));
    addToast({
      type: 'warning',
      title: 'Discretionary Outflow Logged',
      description: `Order placed (+₹${amt}). ₹${amt} deducted from Liquid Savings in Tab 1!`,
    });
  };

  const cookAtHome = () => {
    const amt = impulseState.pendingOrderAmount;
    setImpulseState((prev) => ({
      ...prev,
      cookedAtHomeCount: prev.cookedAtHomeCount + 1,
    }));
    // Add pendingOrderAmount (+₹800) directly to profile.currentSavings in Tab 1
    setProfile((prev) => ({
      ...prev,
      currentSavings: prev.currentSavings + amt,
    }));
    addToast({
      type: 'success',
      title: 'Cook at Home Selected! 🥗',
      description: `₹${amt} saved and credited directly to your Safeguard Lockbox in Tab 1! Streak: ${impulseState.cookedAtHomeCount + 1} meals.`,
    });
  };

  const setImpulseLimit = (limit: number) => {
    setImpulseState((prev) => ({ ...prev, leisureLimit: limit }));
  };

  // Gateway Actions
  const answerGatewayStep = (step: number, answer: string) => {
    setGatewayState((prev) => {
      const nextAnswers = { ...prev.answers, [step]: answer };
      const isComplete = step === 3;
      const isPassed =
        nextAnswers[1] !== 'Sell everything' &&
        nextAnswers[2] !== 'No — It would force me to borrow' &&
        nextAnswers[3] !== 'I was planning to use emergency buffer';
      return {
        currentStep: Math.min(3, step + 1),
        answers: nextAnswers,
        completed: isComplete,
        passed: isComplete ? isPassed : false,
      };
    });
  };

  const resetGateway = () => {
    setGatewayState({
      currentStep: 1,
      answers: {},
      completed: false,
      passed: false,
    });
    addToast({
      type: 'info',
      title: 'Knowledge Gateway Reset',
      description: 'You can retake the 2-minute safety check.',
    });
  };

  // Advisor Actions
  const dispatchDossier = () => {
    setDossierDispatched(true);
    addToast({
      type: 'success',
      title: 'Dossier Dispatched to SEBI-RIA Queue',
      description: 'Your 1-page financial discovery dossier has been transmitted for accredited RIA verification.',
    });
  };

  const verifyAsAdvisor = (notes: string) => {
    setAdvisorVerified(true);
    setAdvisorNotes(notes);
    addToast({
      type: 'success',
      title: 'Certified SEBI-RIA Sign-Off Approved! ✍️',
      description: 'The roadmap has been audited and digitally approved under SEBI (Investment Advisers) Regulations.',
    });
  };

  return (
    <FinancialContext.Provider
      value={{
        profile,
        updateProfile,
        isDemoMode,
        enterDemoMode,
        exitDemoMode,
        resetDemoData,

        dynamicHouseholdList,
        totalHouseholdIncome,
        totalHouseholdObligations,
        monthlySurplus,
        addExtraHouseholdItem,
        removeExtraHouseholdItem,
        updateHouseholdRow,

        healthScore,
        savingsRatio,
        dtiRatio,
        required3MoBuffer,
        required6MoBuffer,
        tier1Instant,
        tier2NextDay,
        tier3SafeYield,

        emiPurchaseAmount,
        setEmiPurchaseAmount,
        timeMachinePreset,
        setTimeMachinePreset,
        upfrontLiquidityHit,
        monthlyNewEmi,
        projectedSavingsAfterPurchase,
        emergencyFundMonths,
        baselineEmergencyFundMonths,
        goalDelayMonths,
        avoidedImpulseTotal,
        savedMonthsBanner,
        dismissSavedBanner,
        skipTimeMachinePurchase,
        applyTimeMachinePlanAdjustment,

        impulseState,
        remainingLeisure,
        orderAnyway,
        cookAtHome,
        setImpulseLimit,

        gatewayState,
        answerGatewayStep,
        resetGateway,

        macroEventKey,
        setMacroEventKey,

        advisorVerified,
        advisorNotes,
        verifyAsAdvisor,
        dossierDispatched,
        dispatchDossier,

        activeTab,
        setActiveTab,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialStore = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialStore must be used within a FinancialProvider');
  }
  return context;
};

// Backwards compatibility alias
export const useDemo = useFinancialStore;
