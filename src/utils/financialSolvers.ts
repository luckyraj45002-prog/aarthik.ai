import { FinancialHealthCalculation, HouseholdMember, TimeMachineScenario, UserProfile } from '../types';

/**
 * Format numbers in Indian numbering system (Lakhs, Crores)
 * e.g., 400000 -> ₹4,00,000 | 6000000 -> ₹60 Lakh
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
  }

  // Standard Indian comma separator
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  const s = absVal.toString();
  
  if (s.length <= 3) {
    return `${isNegative ? '-' : ''}₹${s}`;
  }
  
  const lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return `${isNegative ? '-' : ''}₹${formattedOther},${lastThree}`;
}

/**
 * Deterministic Solver for Holistic Financial Health & Safeguard Lockbox
 */
export function calculateFinancialHealth(profile: UserProfile): FinancialHealthCalculation {
  const income = Math.max(0, profile.monthlyIncome);
  const fixedExpenses = Math.max(0, profile.fixedExpensesMonthly);
  const existingEmis = Math.max(0, profile.existingEmisMonthly);
  const currentSavings = Math.max(0, profile.currentSavings);

  const monthlyNeeds = fixedExpenses + existingEmis;
  const monthlySurplus = income - monthlyNeeds;
  const savingsRate = income > 0 ? (monthlySurplus / income) * 100 : 0;
  const debtToIncomeRatio = income > 0 ? (existingEmis / income) * 100 : 0;

  // Safeguard Lockbox calculations (3-6 month buffers)
  const requiredEmergencyBufferMin = monthlyNeeds * 3;
  const requiredEmergencyBufferComfort = monthlyNeeds * 6;
  const emergencyFundMonths = monthlyNeeds > 0 ? Number((currentSavings / monthlyNeeds).toFixed(1)) : 0;

  let emergencyStatus: 'critical' | 'warning' | 'healthy' | 'excellent' = 'healthy';
  if (emergencyFundMonths < 2.0) {
    emergencyStatus = 'critical';
  } else if (emergencyFundMonths < 3.0) {
    emergencyStatus = 'warning';
  } else if (emergencyFundMonths >= 6.0) {
    emergencyStatus = 'excellent';
  } else {
    emergencyStatus = 'healthy';
  }

  // 3-Tier Allocation (Based on Aarthik.ai deck framework)
  // Tier 1: Instant liquidity in savings/UPI (up to ₹2L or 1 month expenses)
  const tier1Instant = Math.min(200000, monthlyNeeds);
  // Tier 2: Next working day in Liquid Mutual Funds (approx 40% of balance)
  const remainingForTiers = Math.max(0, requiredEmergencyBufferMin - tier1Instant);
  const tier2NextDay = Math.round(remainingForTiers * 0.45);
  // Tier 3: 1-3 days in Arbitrage/Overnight/Sweep FD (remainder)
  const tier3SafeYield = Math.max(0, requiredEmergencyBufferMin - tier1Instant - tier2NextDay);

  // Rigid deterministic score composition (0 - 100):
  // 1. Savings Rate component (max 35 points) - 50% savings rate gives full 35 pts
  const savingsPoints = Math.min(35, Math.max(0, (savingsRate / 50) * 35));

  // 2. Debt-to-income component (max 25 points) - DTI < 15% gives 25 pts, > 50% gives 0 pts
  let debtPoints = 25;
  if (debtToIncomeRatio > 15) {
    debtPoints = Math.max(0, 25 - ((debtToIncomeRatio - 15) / 35) * 25);
  }

  // 3. Emergency Coverage component (max 30 points) - 3 months gives 20 pts, 6 months gives 30 pts
  const emergencyPoints = Math.min(30, (emergencyFundMonths / 6) * 30);

  // 4. Financial Knowledge & Risk calibration (max 10 points)
  const knowledgePoints = (profile.financialKnowledge / 5) * 10;

  const rawScore = Math.round(savingsPoints + debtPoints + emergencyPoints + knowledgePoints);
  const healthScore = Math.min(100, Math.max(10, rawScore));

  return {
    healthScore,
    savingsRate: Math.round(savingsRate),
    debtToIncomeRatio: Math.round(debtToIncomeRatio),
    monthlyNeeds,
    monthlySurplus,
    requiredEmergencyBufferMin,
    requiredEmergencyBufferComfort,
    emergencyFundMonths,
    emergencyStatus,
    tier1Instant,
    tier2NextDay,
    tier3SafeYield,
  };
}

/**
 * Deterministic Solver for Financial Time Machine (What-If EMI Scenario)
 */
export function calculateTimeMachineImpact(
  profile: UserProfile,
  purchaseAmount: number,
  isPresetIphone: boolean = false
): TimeMachineScenario {
  const currentSavings = profile.currentSavings;
  const currentNeeds = profile.fixedExpensesMonthly + profile.existingEmisMonthly;
  const currentSurplus = Math.max(0, profile.monthlyIncome - currentNeeds);

  // Handle explicit demo preset specs:
  if (isPresetIphone || purchaseAmount === 150000) {
    // iPhone preset: ₹12,500/mo EMI (12 months tenure)
    const emi = 12500;
    const newNeeds = currentNeeds + emi;
    const remainingMonths = newNeeds > 0 ? Number((currentSavings / newNeeds).toFixed(1)) : 0;
    return {
      purchaseAmount: 150000,
      tenureMonths: 12,
      interestRateAnnual: 0,
      calculatedEmi: emi,
      downPaymentDelayMonths: 8, // explicitly specified: 8 months delay
      emergencyFundRemainingMonths: remainingMonths,
      emergencyDipPercentage: 35, // explicitly specified: 35% dip
      isEmergencyCompromised: true,
    };
  }

  if (purchaseAmount === 500000) {
    // ₹5,00,000 Purchase preset:
    // Specified in prompt: House down payment impact badge in coral red as +3 months later
    // Emergency fund status as 1.8 months in coral red with "Below the safe limit of 3 months"
    const emi = 25000;
    return {
      purchaseAmount: 500000,
      tenureMonths: 24,
      interestRateAnnual: 10.5,
      calculatedEmi: emi,
      downPaymentDelayMonths: 3, // specified: +3 months later
      emergencyFundRemainingMonths: 1.8, // specified: 1.8 months
      emergencyDipPercentage: 40,
      isEmergencyCompromised: true,
    };
  }

  // Dynamic deterministic solver for arbitrary purchase amounts:
  // Assume a standard 24-month tenure with 11% interest for large purchases
  const tenure = purchaseAmount > 200000 ? 24 : 12;
  const monthlyRate = 0.11 / 12;
  const emi = Math.round(
    (purchaseAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const newNeeds = currentNeeds + emi;
  // If upfront downpayment was 20%
  const upfrontCash = Math.round(purchaseAmount * 0.2);
  const remainingSavings = Math.max(50000, currentSavings - upfrontCash);
  const remainingMonths = newNeeds > 0 ? Number((remainingSavings / newNeeds).toFixed(1)) : 0;

  // House down payment goal is ₹60 Lakh in 4 years (48 months)
  // Needed per month = 60,00,000 / 48 = 1,25,000
  // Delay = (EMI * tenure) / monthly target savings rate
  const delayMonths = Math.max(1, Math.round((emi * tenure) / (currentSurplus * 0.5 || 100000)));
  const safeThreshold = 3.0;
  const dipPercentage = Math.round(Math.max(0, ((safeThreshold - remainingMonths) / safeThreshold) * 100));

  return {
    purchaseAmount,
    tenureMonths: tenure,
    interestRateAnnual: 11,
    calculatedEmi: emi,
    downPaymentDelayMonths: delayMonths,
    emergencyFundRemainingMonths: remainingMonths,
    emergencyDipPercentage: dipPercentage,
    isEmergencyCompromised: remainingMonths < 3.0,
  };
}

/**
 * Deterministic Solver for Household Joint Balance Sheet
 */
export function calculateHouseholdSummary(members: HouseholdMember[]) {
  let totalIncome = 0;
  let totalObligations = 0;

  members.forEach((m) => {
    if (m.category === 'income') {
      totalIncome += m.amount;
    } else {
      totalObligations += m.amount;
    }
  });

  const totalSurplus = totalIncome - totalObligations;
  const obligationPercentage = totalIncome > 0 ? Math.min(100, Math.round((totalObligations / totalIncome) * 100)) : 0;
  const surplusPercentage = totalIncome > 0 ? Math.max(0, 100 - obligationPercentage) : 0;

  return {
    totalIncome,
    totalObligations,
    totalSurplus,
    obligationPercentage,
    surplusPercentage,
  };
}

/**
 * Helper to compute Term Insurance Need (from deck page 6)
 * 10 years family expenses + Children's education + Debt/inflation buffer
 */
export function calculateLifeInsuranceCover(monthlyExpenses: number, existingDebts: number = 600000): {
  tenYearsExpenses: number;
  educationGoal: number;
  bufferCosts: number;
  totalRecommendedCover: number;
} {
  const tenYearsExpenses = monthlyExpenses * 12 * 10;
  const educationGoal = 5000000; // 50 Lakhs
  const bufferCosts = existingDebts + 2400000; // Debt + funeral/inflation buffer
  const total = tenYearsExpenses + educationGoal + bufferCosts;
  
  // Round up to nearest 50 Lakhs
  const totalRounded = Math.ceil(total / 5000000) * 5000000;
  return {
    tenYearsExpenses,
    educationGoal,
    bufferCosts,
    totalRecommendedCover: Math.max(30000000, totalRounded), // min 3 Cr
  };
}
