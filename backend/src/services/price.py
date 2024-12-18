import aiohttp
from datetime import datetime, timedelta
import pandas as pd

class PriceService:
    def __init__(self):
        self.eth_service = EthereumService()

    async def fetch_price_data(self, contract_address: str, timeframe: str, interval_days: int) -> pd.DataFrame:
        """Fetch historical price data from DefiLlama"""
        print(f"\n[Price] 🔍 Analyzing {contract_address}")
        print(f"[Price] ⚙️ Parameters: {timeframe} intervals, {interval_days} days")
        
        try:
            print("\n[DefiLlama] 🌐 Fetching price data")
            
            # Format the contract address for DefiLlama
            token_id = f"ethereum:{contract_address.lower()}"
            
            # Calculate timestamps
            end_time = datetime.now()
            start_time = end_time - timedelta(days=interval_days)
            
            print(f"[DefiLlama] 📍 URL: https://coins.llama.fi/chart/{token_id}")
            print(f"[DefiLlama] ⏰ Time Range: {start_time} to {end_time}")
            print(f"[DefiLlama] 📊 Timeframe: {timeframe}")
            
            async with aiohttp.ClientSession() as session:
                url = f"https://coins.llama.fi/chart/{token_id}"
                params = {
                    "start": int(start_time.timestamp()),
                    "span": f"{interval_days}d",
                    "period": "1h" if timeframe == "1h" else "1d"
                }
                
                async with session.get(url, params=params) as response:
                    if response.status != 200:
                        error_data = await response.text()
                        print(f"[DefiLlama] ❌ Error: {error_data}")
                        raise PriceDataError(f"DefiLlama API error: {error_data}")
                    
                    data = await response.json()
                    prices = data.get('prices', [])
                    
                    if not prices:
                        print("[DefiLlama] ⚠️ No price data found")
                        return pd.DataFrame()
                    
                    # Convert to DataFrame
                    df = pd.DataFrame(prices, columns=['timestamp', 'close'])
                    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')
                    df.set_index('timestamp', inplace=True)
                    
                    # Resample to desired timeframe if needed
                    if timeframe != "1h":
                        df = df.resample(timeframe).last().dropna()
                    
                    print(f"[Price] ✅ Successfully fetched {len(df)} price points")
                    return df
                    
        except Exception as e:
            print(f"[Price] ❌ Error fetching price data: {str(e)}")
            raise PriceDataError(f"Failed to fetch price data: {str(e)}") 