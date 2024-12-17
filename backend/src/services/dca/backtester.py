from typing import Dict, List
import pandas as pd
import numpy as np
from datetime import datetime

class DCABacktester:
    def __init__(self, price_data: pd.DataFrame, dca_strategy: Dict):
        self.price_data = price_data
        self.entry_points = dca_strategy['entry_points']
        self.exit_points = dca_strategy['exit_points']
        self.investment_distribution = dca_strategy['investment_distribution']
        
    def run_backtest(self) -> Dict:
        """Run backtest simulation on historical data"""
        trades = self._simulate_trades()
        
        if not trades:
            return self._empty_results()
        
        trades_df = pd.DataFrame(trades)
        
        return {
            "historical_performance": self._calculate_performance(trades_df),
            "win_rate": self._calculate_win_rate(trades_df),
            "average_return": trades_df['return_pct'].mean(),
            "max_drawdown": self._calculate_max_drawdown(trades_df),
            "risk_adjusted_return": self._calculate_sharpe_ratio(trades_df)
        }
    
    def _simulate_trades(self) -> List[Dict]:
        trades = []
        for investment in self.investment_distribution:
            entry_price = investment['price_target']
            amount = investment['amount']
            
            # Find entry points in historical data
            entry_hits = self.price_data[self.price_data['low'] <= entry_price]
            if entry_hits.empty:
                continue
                
            entry_date = entry_hits.index[0]
            quantity = amount / entry_price
            
            # Find exit points
            for exit_point in self.exit_points:
                exit_price = exit_point['price']
                exit_hits = self.price_data.loc[entry_date:][self.price_data['high'] >= exit_price]
                
                if not exit_hits.empty:
                    exit_date = exit_hits.index[0]
                    return_pct = (exit_price - entry_price) / entry_price * 100
                    trades.append({
                        "entry_date": entry_date,
                        "exit_date": exit_date,
                        "entry_price": entry_price,
                        "exit_price": exit_price,
                        "quantity": quantity,
                        "return_pct": return_pct,
                        "profit_loss": (exit_price - entry_price) * quantity
                    })
                    break
        
        return trades
    
    def _calculate_performance(self, trades_df: pd.DataFrame) -> float:
        """Calculate total return percentage"""
        total_invested = trades_df['quantity'] * trades_df['entry_price'].sum()
        total_value = trades_df['quantity'] * trades_df['exit_price'].sum()
        return ((total_value - total_invested) / total_invested) * 100
    
    def _calculate_win_rate(self, trades_df: pd.DataFrame) -> float:
        """Calculate percentage of profitable trades"""
        winning_trades = len(trades_df[trades_df['profit_loss'] > 0])
        return (winning_trades / len(trades_df)) * 100 if len(trades_df) > 0 else 0
    
    def _calculate_max_drawdown(self, trades_df: pd.DataFrame) -> float:
        """Calculate maximum drawdown percentage"""
        cumulative_returns = (1 + trades_df['return_pct'] / 100).cumprod()
        rolling_max = cumulative_returns.expanding().max()
        drawdowns = (cumulative_returns - rolling_max) / rolling_max * 100
        return abs(drawdowns.min())
    
    def _calculate_sharpe_ratio(self, trades_df: pd.DataFrame) -> float:
        """Calculate risk-adjusted return (Sharpe ratio)"""
        returns = trades_df['return_pct'] / 100
        if returns.std() == 0:
            return 0
        return (returns.mean() / returns.std()) * np.sqrt(252)  # Annualized
    
    def _empty_results(self) -> Dict:
        """Return empty results when no trades are executed"""
        return {
            "historical_performance": 0.0,
            "win_rate": 0.0,
            "average_return": 0.0,
            "max_drawdown": 0.0,
            "risk_adjusted_return": 0.0
        } 