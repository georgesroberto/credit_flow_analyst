export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface FinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  transactionCount: number;
  businessType: string;
}

export interface AnalysisResult {
  score: number;
  riskLevel: RiskLevel;
  recommendedLoanRange: string;
  strengths: string[];
  risks: string[];
}
