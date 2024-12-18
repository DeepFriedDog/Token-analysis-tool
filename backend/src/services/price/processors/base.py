from abc import ABC, abstractmethod
import pandas as pd
from web3 import Web3

class BaseProcessor(ABC):
    def __init__(self, w3: Web3, ethereum_service):
        self.w3 = w3
        self.ethereum_service = ethereum_service
        self.eth_price_cache = {}

    @abstractmethod
    async def fetch_data(self, contract_address: str, timeframe: str, interval_days: int) -> pd.DataFrame:
        """Fetch price data for the given token"""
        pass

    def _validate_price_data(self, df: pd.DataFrame) -> bool:
        """Validate the price data DataFrame"""
        if df.empty:
            return False
        if not all(col in df.columns for col in ['timestamp', 'price']):
            return False
        if df['price'].isnull().any() or (df['price'] <= 0).any():
            return False
        return True

    def _process_price_data(self, df: pd.DataFrame, timeframe: str) -> pd.DataFrame:
        """Process and resample price data"""
        if df.empty:
            return df
            
        # Set timestamp as index if not already
        if not isinstance(df.index, pd.DatetimeIndex):
            df.set_index('timestamp', inplace=True)
            
        # Resample based on timeframe
        rule_map = {'1m': '1Min', '5m': '5Min', '15m': '15Min', '1h': '1H', '4h': '4H', '1d': '1D'}
        rule = rule_map.get(timeframe, '1H')
        
        resampled = df.resample(rule).agg({
            'price': 'last',
            'volume': 'sum' if 'volume' in df.columns else None
        }).dropna()
        
        return resampled 