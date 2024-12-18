from datetime import datetime
import pandas as pd
from ..ethereum import EthereumService
from .exceptions import PriceDataError
from .processors.defillama import DefiLlamaProcessor
from ..technical_analysis.analyzer import TechnicalAnalyzer

class PriceService:
    def __init__(self):
        self.defillama_processor = DefiLlamaProcessor()

    async def fetch_price_data(self, contract_address: str, timeframe: str, interval_days: int) -> pd.DataFrame:
        """Fetch price data from DefiLlama"""
        try:
            print(f"\n[Price] 🔍 Analyzing {contract_address}")
            print(f"[Price] ⚙️ Parameters: {timeframe} intervals, {interval_days} days")
            
            df = await self.defillama_processor.fetch_data(contract_address, timeframe, interval_days)
            
            if df.empty:
                raise PriceDataError(
                    message="No price data available",
                    source="data",
                    status_code=404
                )
                
            # Rename price column to close for compatibility with TechnicalAnalyzer
            df = df.rename(columns={'price': 'close'})
            
            print(f"[Price] ✅ Successfully fetched {len(df)} price points")
            return df
            
        except PriceDataError:
            raise
        except Exception as e:
            raise PriceDataError(
                message=f"Error fetching price data: {str(e)}",
                source="fetch",
                status_code=500
            )

    def calculate_technical_indicators(self, df: pd.DataFrame) -> dict:
        """Calculate technical indicators using TechnicalAnalyzer"""
        try:
            print("[Analysis] 📊 Calculating technical indicators...")
            
            analyzer = TechnicalAnalyzer(df)
            result = analyzer.analyze()
            
            print("[Analysis] ✅ Technical analysis complete")
            return result
            
        except Exception as e:
            print(f"[Analysis] ❌ Error calculating indicators: {str(e)}")
            raise PriceDataError(
                message=f"Error calculating technical indicators: {str(e)}",
                source="analysis",
                status_code=500
            )