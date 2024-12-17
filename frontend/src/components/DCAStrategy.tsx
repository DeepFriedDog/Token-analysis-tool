import React from 'react';

interface DCAStrategyProps {
  strategy: {
    entry_points: Array<{ price: number; percentage: number }>;
    exit_points: Array<{ price: number; percentage: number }>;
    risk_score: number;
    expected_return: number;
    investment_distribution: Array<{
      amount: number;
      price_target: number;
    }>;
  };
}

export const DCAStrategy: React.FC<DCAStrategyProps> = ({ strategy }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">DCA Strategy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Entry Points</h3>
          <div className="space-y-2">
            {strategy.entry_points.map((point, i) => (
              <div key={i}>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2">${point.price.toFixed(2)}</span>
                <span className="ml-2 text-green-600">(-{point.percentage.toFixed(2)}%)</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Investment Distribution</h3>
          <div className="space-y-2">
            {strategy.investment_distribution.map((dist, i) => (
              <div key={i}>
                <span className="text-gray-600">${dist.amount.toFixed(2)}</span>
                <span className="ml-2">@ ${dist.price_target.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 