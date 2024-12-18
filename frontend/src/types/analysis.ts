export interface PriceData {
  timestamp: string;
  close: number;
  volume?: number;
}

export interface TechnicalAnalysis {
  support_levels: number[];
  resistance_levels: number[];
  rsi: number;
  volatility: number;
  fibonacci_levels: Array<{
    level: number;
    price: number;
    type: string;
  }>;
}

export interface DCAStrategy {
  entry_points: Array<{ price: number; percentage: number }>;
  exit_points: Array<{ price: number; percentage: number }>;
  risk_score: number;
  expected_return: number;
  investment_distribution: Array<{
    amount: number;
    price_target: number;
  }>;
}

export interface AnalysisResult {
  priceData: PriceData[];
  technical_analysis: TechnicalAnalysis;
  dca_strategy?: DCAStrategy;
} 