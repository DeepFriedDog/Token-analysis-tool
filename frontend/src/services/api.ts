import axios from 'axios';
import { AnalysisResult } from '../types/analysis';
import env from '../config/env';

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AnalysisParams {
  contractAddress: string;
  timeframe: string;
  intervalDays: number;
  investmentAmount: number;
}

export const analyzeToken = async (params: AnalysisParams): Promise<AnalysisResult> => {
  try {
    const requestData = {
      contract_address: params.contractAddress,
      timeframe: params.timeframe,
      interval_days: params.intervalDays,
      investment_amount: params.investmentAmount
    };
    
    console.log('API Request:', requestData);
    const { data } = await api.post('/api/analyze', requestData);
    console.log('API Response:', data);
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Analysis failed';
      
      if (error.response?.status === 404) {
        throw new Error('No liquidity found for this token in Uniswap pools');
      }
      if (error.response?.status === 400) {
        throw new Error(errorMessage);
      }
      if (error.response?.status === 503 || error.response?.status === 500) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorMessage);
    }
    throw error;
  }
}; 