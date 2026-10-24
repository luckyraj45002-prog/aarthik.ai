export type RiskTolerance = 'Conservative' | 'Moderate' | 'Aggressive';

export interface UserProfile {
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  dependents: number;
  assets: {
    savings: number;
    pf: number;
    otherAssets?: number;
  };
  liabilities: {
    carLoan: number;
    otherLoans?: number;
  };
  fixedExpensesMonthly: number;
  existingEmisMonthly: number;
  currentSavings: number;
  futureFinancialGoals: string;
  biggestFinancialConcern: string;
  financialKnowledge: number; // 1 to 5
  riskTolerance: RiskTolerance;
}

export interface HouseholdMember {
  id: string;
  name: string;
  category: 'income' | 'expense' | 'medical' | 'education' | 'loan';
  label: string;
  amount: number; // monthly
  isSelf?: boolean;
  notes?: string;
}

export interface FinancialHealthCalculation {
  healthScore: number; // 0 - 100
  savingsRate: number; // %
  debtToIncomeRatio: number; // %
  monthlyNeeds: number; // fixed expenses + EMIs
  monthlySurplus: number; // income - expenses - EMIs
  requiredEmergencyBufferMin: number; // 3 months
  requiredEmergencyBufferComfort: number; // 6 months
  emergencyFundMonths: number; // current savings / monthly needs
  emergencyStatus: 'critical' | 'warning' | 'healthy' | 'excellent';
  tier1Instant: number; // ₹2L
  tier2NextDay: number; // liquid mutual fund
  tier3SafeYield: number; // overnight / arbitrage / sweep FD
}

export interface TimeMachineScenario {
  purchaseAmount: number;
  tenureMonths: number;
  interestRateAnnual: number;
  calculatedEmi: number;
  downPaymentDelayMonths: number;
  emergencyFundRemainingMonths: number;
  emergencyDipPercentage: number;
  isEmergencyCompromised: boolean;
}

export interface MacroChainStep {
  worldEvent: string;
  economicImpact: string;
  sectorImpact: string;
  marketEffect: string;
  assetImplication: string;
  recommendedStance: string;
}

export interface ExpertPlanItem {
  id: string;
  title: string;
  subtitle: string;
  allocationAmount: string;
  timeHorizon: string;
  reason: string;
  downside: string;
  instrumentType: string;
  recommendedCategory: 'Safe' | 'Balanced' | 'Growth' | 'Diversifier';
  verifiedByExpert: boolean;
}
