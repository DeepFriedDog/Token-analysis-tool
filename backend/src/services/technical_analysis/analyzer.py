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
        delta = self.price_data['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi.iloc[-1]

    def calculate_volatility(self, period: int = 20) -> float:
        """Calculate volatility (standard deviation of returns)"""
        returns = self.price_data['close'].pct_change()
        return returns.std() * np.sqrt(period)

    def analyze(self) -> Dict:
        """Perform complete technical analysis"""
        support_levels, resistance_levels = self.sr_analyzer.find_levels()
        trend = 'up' if self.price_data['close'].iloc[-1] > self.price_data['close'].iloc[0] else 'down'
        
        return {
            'support_levels': support_levels,
            'resistance_levels': resistance_levels,
            'fibonacci_levels': self.fib_analyzer.calculate_levels(trend),
            'rsi': self.calculate_rsi(),
            'volatility': self.calculate_volatility()
        } 