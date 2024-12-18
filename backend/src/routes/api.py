from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional
from ..services.price import PriceService, PriceDataError
import numpy as np
import pandas as pd
from ..services.technical_analysis.analyzer import TechnicalAnalyzer
from ..services.dca.calculator import DCACalculator

router = APIRouter()
price_service = PriceService()

class TokenAnalysisRequest(BaseModel):
    contract_address: str = Field(pattern=r'^0x[a-fA-F0-9]{40}$')
    timeframe: str = "1d"
    interval_days: int = Field(default=30, ge=1, le=365)
    investment_amount: float = Field(default=100.0, ge=0.0)

@router.post("/api/analyze")
async def analyze_token(request: TokenAnalysisRequest):
    """Analyze token price data"""
    try:
        print(f"\n[API] 📊 Analyzing token: {request.contract_address}")
        print(f"[API] 📊 Parameters: timeframe={request.timeframe}, interval_days={request.interval_days}")
        
        df = await price_service.fetch_price_data(
            contract_address=request.contract_address,
            timeframe=request.timeframe,
            interval_days=request.interval_days
        )
        
        if df.empty:
            return {
                "priceData": [],
                "technical_analysis": {
                    "support_levels": [],
                    "resistance_levels": [],
                    "rsi": 50.0,
                    "volatility": 0.0
                },
                "dca_strategy": None
            }
        
        # Ensure price data is numeric and non-zero
        df['close'] = pd.to_numeric(df['close'], errors='coerce')
        df = df[df['close'] > 0]  # Filter out zero prices
        
        # Format price data for frontend
        price_data = df.reset_index()
        formatted_price_data = [
            {
                "timestamp": record["timestamp"].isoformat() if isinstance(record["timestamp"], pd.Timestamp) else str(record["timestamp"]),
                "price": float(record["close"]),
                "close": float(record["close"])
            }
            for record in price_data.to_dict('records')
        ]
        
        # Calculate technical analysis
        analyzer = TechnicalAnalyzer(df)
        analysis_result = analyzer.analyze()
        
        # Calculate DCA strategy
        dca_calculator = DCACalculator(df, request.investment_amount)
        entry_points = dca_calculator.calculate_entry_points(
            analysis_result['support_levels'],
            analysis_result['resistance_levels']
        )
        
        technical_analysis = {
            "support_levels": [round(float(level), 8) for level in analysis_result['support_levels']],
            "resistance_levels": [round(float(level), 8) for level in analysis_result['resistance_levels']],
            "rsi": round(float(analysis_result['rsi']), 2),
            "volatility": round(float(analysis_result['volatility'] * 100), 2)
        }
        
        return {
            "priceData": formatted_price_data,
            "technical_analysis": technical_analysis,
            "dca_strategy": {
                "entry_points": entry_points,
                "investment_distribution": dca_calculator.distribute_investment(entry_points)
            }
        }
        
    except Exception as e:
        print(f"[API] ❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 