import React from 'react';

interface TechnicalAnalysis {
  support_levels: number[];
  resistance_levels: number[];
  rsi: number;
  volatility: number;
  fibonacci_levels: Array<{
    level: number;
    price: number;
    type: string;
  }>;
}

interface TechnicalIndicatorsProps {
  analysis?: TechnicalAnalysis;
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Price Levels</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Support:</span>
              <div className="ml-2">
                {analysis.support_levels.map((level, i) => (
                  <div key={i} className="text-green-600">${level.toFixed(4)}</div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Resistance:</span>
              <div className="ml-2">
                {analysis.resistance_levels.map((level, i) => (
                  <div key={i} className="text-red-600">${level.toFixed(4)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Indicators</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">RSI:</span>
              <span className="ml-2">{analysis.rsi.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Volatility:</span>
              <span className="ml-2">{(analysis.volatility * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 