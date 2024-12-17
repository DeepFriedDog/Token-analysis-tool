import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceData {
  timestamp: string;
  close: number;
  volume: number;
  high?: number;
  low?: number;
  open?: number;
}

interface PriceChartProps {
  data: PriceData[];
  loading?: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-96 w-full mb-8 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading price data...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="h-96 w-full mb-8 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No price data available</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full mb-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip
            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}; 