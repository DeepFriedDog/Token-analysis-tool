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

      // Connect to WebSocket for progress updates
      ws = new WebSocket(`${env.WS_URL}/ws/analysis`);
      
      // Set up WebSocket handlers before making the API call
      const wsPromise = new Promise<void>((resolve, reject) => {
        if (!ws) return reject(new Error('WebSocket not initialized'));
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          resolve();
        };
        
        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          // Don't reject here, we still want to continue with analysis
          resolve(); // Continue even if WebSocket fails
        };
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'progress') {
              setProgress(prev => [...prev, message.data]);
            }
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        };
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(), 3000);
      });

      // Wait for WebSocket to connect (or timeout)
      await wsPromise;

      // Make the API call
      const result = await analyzeToken(analysisParams);
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
        ws.close();
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
          <PriceChart data={analysisResult.priceData} />
          <TechnicalIndicators analysis={analysisResult.technical_analysis} />
          <DCAStrategy strategy={analysisResult.dca_strategy} />
        </div>
      )}
    </div>
  );
}; 