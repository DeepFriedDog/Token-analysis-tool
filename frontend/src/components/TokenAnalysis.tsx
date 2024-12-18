import React, { useState } from 'react';
import { TokenInput } from './TokenInput';
import { TimeframeSelector } from './TimeframeSelector';
import { PriceChart } from './PriceChart';
import { TechnicalIndicators } from './TechnicalIndicators';
import { DCAStrategy } from './DCAStrategy';
import { validateAnalysisParams, ValidationError } from '../utils/validation';
import { AnalysisResult } from '../types/analysis';
import { analyzeToken, AnalysisParams } from '../services/api';
import env from '../config/env';

export const TokenAnalysis: React.FC = () => {
  const [analysisParams, setAnalysisParams] = useState<AnalysisParams>({
    contractAddress: '',
    timeframe: '1h',
    intervalDays: 30,
    investmentAmount: 100,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleAnalyze = async () => {
    let ws: WebSocket | null = null;
    
    try {
      setLoading(true);
      setError(null);
      setProgress([]);
      setValidationErrors([]);
      
      const errors = validateAnalysisParams(analysisParams);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setError(errors[0].message);
        return;
      }

      // Connect to WebSocket
      try {
        ws = new WebSocket(`${env.WS_URL}/ws/analysis`);
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'progress') {
            setProgress(prev => [...prev, message.data]);
          }
        };
      } catch (wsError) {
        console.warn('WebSocket connection failed:', wsError);
        // Continue without WebSocket
      }

      console.log('Sending analysis request with params:', analysisParams);
      const result = await analyzeToken(analysisParams);
      
      console.log('Raw API Response:', result);
      console.log('Price Data Sample:', result.priceData?.slice(0, 2));
      console.log('Technical Analysis:', result.technical_analysis);
      
      if (!result.priceData || !result.technical_analysis) {
        throw new Error('Invalid response format from API');
      }

      setAnalysisResult(result);
      
    } catch (err) {
      console.error('Analysis error:', err);
      if (err instanceof Error) {
        setError(err.message);
        setAnalysisResult(null);
      } else {
        setError('An unexpected error occurred while analyzing the token');
      }
    } finally {
      setLoading(false);
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.close();
        } catch (closeError) {
          console.warn('Error closing WebSocket:', closeError);
        }
      }
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <TokenInput 
          value={analysisParams.contractAddress}
          onChange={(value) => setAnalysisParams(prev => ({...prev, contractAddress: value}))}
          error={getFieldError('contractAddress')}
        />
        <TimeframeSelector
          timeframe={analysisParams.timeframe}
          intervalDays={analysisParams.intervalDays}
          investmentAmount={analysisParams.investmentAmount}
          onChange={(updates) => setAnalysisParams(prev => ({...prev, ...updates}))}
          errors={{
            timeframe: getFieldError('timeframe'),
            intervalDays: getFieldError('intervalDays'),
            investmentAmount: getFieldError('investmentAmount')
          }}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full mt-4 px-4 py-2 rounded-md text-white font-medium ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Token'}
        </button>
      </div>
      
      {analysisResult && (
        <div className="space-y-6">
          <PriceChart 
            data={analysisResult.priceData} 
            loading={loading} 
          />
          <TechnicalIndicators 
            analysis={analysisResult.technical_analysis} 
          />
          <DCAStrategy 
            strategy={analysisResult.dca_strategy} 
          />
        </div>
      )}
    </div>
  );
}; 