from typing import Dict

def calculate_risk_score(technical_analysis: Dict) -> float:
    """Calculate risk score based on technical indicators"""
    rsi = technical_analysis['rsi']
    volatility = technical_analysis['volatility']
    
    # RSI risk component (higher RSI = higher risk)
    rsi_risk = (rsi / 100) * 0.4  # 40% weight
    
    # Volatility risk component
    volatility_risk = min(volatility * 2, 1) * 0.4  # 40% weight
    
    # Support/Resistance risk component
    price_levels_risk = len(technical_analysis['resistance_levels']) / \
                       (len(technical_analysis['support_levels']) + 1) * 0.2  # 20% weight
    
    return round(rsi_risk + volatility_risk + price_levels_risk, 2)

def calculate_expected_return(entry_points: list, exit_points: list) -> float:
    """Calculate expected return based on entry and exit points"""
    if not entry_points or not exit_points:
        return 0.0
        
    avg_entry = sum(ep['price'] for ep in entry_points) / len(entry_points)
    avg_exit = sum(ep['price'] for ep in exit_points) / len(exit_points)
    
    return round(((avg_exit - avg_entry) / avg_entry) * 100, 2) 