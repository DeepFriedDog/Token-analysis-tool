from .base import BaseTechnicalAnalysis
import numpy as np
import pandas as pd
from scipy.signal import argrelextrema, find_peaks
from typing import List, Tuple

class SupportResistanceAnalyzer(BaseTechnicalAnalysis):
    def __init__(self, price_data: pd.DataFrame, window: int = 20):
        super().__init__(price_data)
        self.window = window

    def find_levels(self, n_points: int = 5) -> Tuple[List[float], List[float]]:
        """Find support and resistance levels using local minima/maxima"""
        # Get local maxima and minima
        local_max = argrelextrema(self.df['high'].values, np.greater, order=self.window)[0]
        local_min = argrelextrema(self.df['low'].values, np.less, order=self.window)[0]

        resistance_levels = self.df['high'].iloc[local_max]
        support_levels = self.df['low'].iloc[local_min]

        # Cluster nearby levels
        def cluster_levels(levels: pd.Series, threshold: float = 0.02) -> List[float]:
            if len(levels) == 0:
                return []
            
            clusters = []
            current_cluster = [levels.iloc[0]]

            for level in levels.iloc[1:]:
                if abs(level - np.mean(current_cluster)) / np.mean(current_cluster) < threshold:
                    current_cluster.append(level)
                else:
                    clusters.append(np.mean(current_cluster))
                    current_cluster = [level]
            
            clusters.append(np.mean(current_cluster))
            return sorted(clusters, reverse=True)[:n_points]

        return (
            cluster_levels(support_levels),
            cluster_levels(resistance_levels)
        ) 