from typing import List, Dict
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DCACalculator:
    def __init__(self, price_data: pd.DataFrame, investment_amount: float):
        self.price_data = price_data
        self.total_investment = investment_amount
        
    def calculate_entry_points(self, support_levels: List[float], resistance_levels: List[float]) -> List[Dict]:
        """Calculate optimal entry points based on technical levels"""
        current_price = self.price_data['close'].iloc[-1]
        entry_points = []
        
        # Add support levels as entry points
        for level in support_levels:
            if level < current_price:
                percentage = (current_price - level) / current_price * 100
                entry_points.append({
                    "price": level,
                    "percentage": percentage,
                    "timestamp": None  # Will be filled during backtesting
                })
        
        # Add weighted average entries
        ma_20 = self.price_data['close'].rolling(window=20).mean().iloc[-1]
        ma_50 = self.price_data['close'].rolling(window=50).mean().iloc[-1]
        
        if ma_20 < current_price:
            entry_points.append({
                "price": ma_20,
                "percentage": (current_price - ma_20) / current_price * 100,
                "timestamp": None
            })
        
        return sorted(entry_points, key=lambda x: x['price'])
    
    def calculate_exit_points(self, resistance_levels: List[float], fibonacci_levels: List[Dict]) -> List[Dict]:
        """Calculate exit points based on resistance and Fibonacci levels"""
        current_price = self.price_data['close'].iloc[-1]
        exit_points = []
        
        # Add resistance levels as exit points
        for level in resistance_levels:
            if level > current_price:
                percentage = (level - current_price) / current_price * 100
                exit_points.append({
                    "price": level,
                    "percentage": percentage,
                    "type": "resistance"
                })
        
        # Add Fibonacci extension levels
        for fib in fibonacci_levels:
            if fib['price'] > current_price and fib['level'] > 1:
                exit_points.append({
                    "price": fib['price'],
                    "percentage": (fib['price'] - current_price) / current_price * 100,
                    "type": f"fibonacci_{fib['level']}"
                })
        
        return sorted(exit_points, key=lambda x: x['price'])
    
    def distribute_investment(self, entry_points: List[Dict]) -> List[Dict]:
        """Distribute investment amount across entry points"""
        if not entry_points:
            return []
            
        # Weight distribution based on price levels
        total_weight = sum(1 / ep['price'] for ep in entry_points)
        distribution = []
        
        for entry in entry_points:
            weight = (1 / entry['price']) / total_weight
            amount = self.total_investment * weight
            distribution.append({
                "amount": round(amount, 2),
                "price_target": entry['price'],
                "timestamp": entry.get('timestamp')
            })
        
        return distribution 