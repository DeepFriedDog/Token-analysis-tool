from .support_resistance import SupportResistanceAnalyzer
from .fibonacci import FibonacciAnalyzer
from .base import BaseTechnicalAnalysis
import pandas as pd
import numpy as np
from typing import Dict

class TechnicalAnalyzer:
    def __init__(self, price_data: pd.DataFrame):
        self.price_data = price_data
        self.sr_analyzer = SupportResistanceAnalyzer(price_data)
        self.fib_analyzer = FibonacciAnalyzer(price_data)

    def calculate_rsi(self, period: int = 14) -> float:
        """Calculate RSI for the latest period"""
        try:
            delta = self.price_data['close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            return float(rsi.iloc[-1]) if not pd.isna(rsi.iloc[-1]) else 50.0
        except Exception:
            return 50.0

    def calculate_volatility(self, period: int = 20) -> float:
        """Calculate volatility (standard deviation of returns)"""
        try:
            # Calculate returns with explicit fill_method=None
            returns = self.price_data['close'].pct_change(fill_method=None)
            # Fill any NaN values with 0 after calculation
            returns = returns.fillna(0)
            vol = returns.std() * np.sqrt(period)
            return float(vol) if not pd.isna(vol) else 0.0
        except Exception:
            return 0.0

    def analyze(self) -> Dict:
        """Perform complete technical analysis"""
        try:
            support_levels, resistance_levels = self.sr_analyzer.find_levels()
            trend = 'up' if self.price_data['close'].iloc[-1] > self.price_data['close'].iloc[0] else 'down'
            
            # Ensure all values are JSON serializable
            return {
                'support_levels': [float(level) for level in support_levels if not pd.isna(level)],
                'resistance_levels': [float(level) for level in resistance_levels if not pd.isna(level)],
                'fibonacci_levels': [
                    {
                        'level': float(level['level']),
                        'price': float(level['price']) if not pd.isna(level['price']) else 0.0,
                        'type': level['type']
                    }
                    for level in self.fib_analyzer.calculate_levels(trend)
                ],
                'rsi': self.calculate_rsi(),
                'volatility': self.calculate_volatility()
            }
        except Exception as e:
            print(f"[Analysis] ⚠️ Error in analysis: {str(e)}")
            return {
                'support_levels': [],
                'resistance_levels': [],
                'fibonacci_levels': [],
                'rsi': 50.0,
                'volatility': 0.0
            } 