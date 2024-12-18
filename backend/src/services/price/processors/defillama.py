import aiohttp
import pandas as pd
from datetime import datetime, timedelta
from .base import BaseProcessor
from ..exceptions import PriceDataError
import asyncio

class DefiLlamaProcessor(BaseProcessor):
    def __init__(self):
        self.base_url = "https://coins.llama.fi"
        
    async def fetch_data(self, contract_address: str, timeframe: str, interval_days: int) -> pd.DataFrame:
        """Fetch historical price data from DefiLlama using historical endpoint"""
        try:
            token_id = f"ethereum:{contract_address.lower()}"
            end_time = int(datetime.now().timestamp())
            start_time = end_time - (interval_days * 24 * 60 * 60)
            interval = self._get_interval_seconds(timeframe)
            
            print(f"\n[DefiLlama] 🌐 Fetching historical price data")
            print(f"[DefiLlama] ⏰ Time Range: {datetime.fromtimestamp(start_time)} to {datetime.fromtimestamp(end_time)}")
            print(f"[DefiLlama] 📊 Timeframe: {timeframe}")
            
            price_data = []
            async with aiohttp.ClientSession() as session:
                current_time = start_time
                while current_time <= end_time:
                    url = f"{self.base_url}/prices/historical/{current_time}/{token_id}"
                    
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            if data and 'coins' in data and token_id in data['coins']:
                                price_info = data['coins'][token_id]
                                price_data.append({
                                    'timestamp': datetime.fromtimestamp(current_time),
                                    'close': float(price_info['price']),
                                    'open': float(price_info['price']),  # For technical analysis
                                    'high': float(price_info['price']),  # For technical analysis
                                    'low': float(price_info['price']),   # For technical analysis
                                    'volume': 0.0                        # For technical analysis
                                })
                        
                    current_time += interval
                    await asyncio.sleep(0.2)  # Rate limiting
                
            if not price_data:
                print("[DefiLlama] ���️ No price data found")
                return pd.DataFrame()
                
            # Create DataFrame with all required columns
            df = pd.DataFrame(price_data)
            df.set_index('timestamp', inplace=True)
            df.sort_index(inplace=True)
            
            # Calculate OHLC data from consecutive prices
            df['high'] = df['close'].rolling(2, min_periods=1).max()
            df['low'] = df['close'].rolling(2, min_periods=1).min()
            df['open'] = df['close'].shift(1)
            df['open'] = df['open'].fillna(df['close'])
            
            print(f"[DefiLlama] ✅ Found {len(df)} price points")
            return df
                    
        except Exception as e:
            print(f"[DefiLlama] ❌ Error: {str(e)}")
            return pd.DataFrame()
            
    def _get_interval_seconds(self, timeframe: str) -> int:
        """Convert timeframe to seconds"""
        interval_map = {
            '15m': 15 * 60,
            '1h': 60 * 60,
            '4h': 4 * 60 * 60,
            '1d': 24 * 60 * 60
        }
        return interval_map.get(timeframe, 60 * 60)  # default to 1h
        