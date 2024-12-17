export interface AnalysisResult {
  token_info: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    is_valid: boolean;
  };
  technical_analysis: {
    support_levels: number[];
    resistance_levels: number[];
    fibonacci_levels: Array<{ level: number; price: number }>;
    rsi: number;
    volatility: number;
  };
  dca_strategy: {
    entry_points: Array<{ price: number; percentage: number }>;
    exit_points: Array<{ price: number; percentage: number }>;
    risk_score: number;
    expected_return: number;
    investment_distribution: Array<{
      amount: number;
      price_target: number;
      timestamp?: string;
    }>;
  };
  backtest_results: {
    historical_performance: number;
    win_rate: number;
    average_return: number;
    max_drawdown: number;
    risk_adjusted_return: number;
  };
  priceData: Array<{
    timestamp: string;
    close: number;
    volume: number;
    high?: number;
    low?: number;
    open?: number;
  }>;
} 