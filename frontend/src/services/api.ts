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
    
    const { data } = await api.post('/api/analyze', requestData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorDetail = error.response?.data?.detail || error.response?.data?.error;
      
      if (error.response?.status === 404) {
        throw new Error(errorDetail || 'No liquidity found for this token in Uniswap V3 pools');
      }
      if (error.response?.status === 400) {
        throw new Error(errorDetail || 'Invalid token contract address');
      }
      if (error.response?.status === 503 || error.response?.status === 500) {
        throw new Error(errorDetail || 'Service temporarily unavailable. Please try again later.');
      }
      
      throw new Error(typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : (errorDetail || 'Analysis failed'));
    }
    throw error;
  }
}; 