from typing import List, Dict
import numpy as np
import pandas as pd

class BaseTechnicalAnalysis:
    def __init__(self, price_data: pd.DataFrame):
        """
        Initialize with price data DataFrame containing columns:
        timestamp, open, high, low, close, volume
        """
        self.df = price_data.copy()
        if not isinstance(self.df.index, pd.DatetimeIndex):
            if 'timestamp' in self.df.columns:
                self.df.set_index('timestamp', inplace=True)
            else:
                raise ValueError("DataFrame must have either a DatetimeIndex or a 'timestamp' column")

    def prepare_data(self) -> None:
        """Prepare data for analysis"""
        self.df['returns'] = self.df['close'].pct_change()
        self.df['volatility'] = self.df['returns'].rolling(window=20).std() 