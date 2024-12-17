import React from 'react';

interface TechnicalIndicatorsProps {
  analysis: {
    support_levels: number[];
    resistance_levels: number[];
    fibonacci_levels: Array<{ level: number; price: number }>;
    rsi: number;
    volatility: number;
  };
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ analysis }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Price Levels</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Support:</span>
              {analysis.support_levels.map((level, i) => (
                <span key={i} className="ml-2 text-green-600">${level.toFixed(2)}</span>
              ))}
            </div>
            <div>
              <span className="text-gray-600">Resistance:</span>
              {analysis.resistance_levels.map((level, i) => (
                <span key={i} className="ml-2 text-red-600">${level.toFixed(2)}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
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