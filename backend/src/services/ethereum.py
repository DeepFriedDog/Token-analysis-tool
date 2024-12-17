from web3 import Web3
from typing import Dict
import aiohttp
import pandas as pd
from datetime import datetime, timedelta
from fastapi import HTTPException
from ..config import ETHEREUM_RPC_ENDPOINTS

class EthereumService:
    def __init__(self):
        # Try each RPC endpoint until one works
        for rpc_url in ETHEREUM_RPC_ENDPOINTS:
            try:
                self.w3 = Web3(Web3.HTTPProvider(rpc_url))
                if self.w3.is_connected():
                    break
            except Exception:
                continue
        
        if not hasattr(self, 'w3') or not self.w3.is_connected():
            raise Exception("Failed to connect to any Ethereum RPC endpoint")

    async def validate_token(self, contract_address: str) -> Dict:
        """Validates token contract and returns basic token information"""
        try:
            # First verify contract exists on-chain
            contract_code = self.w3.eth.get_code(Web3.to_checksum_address(contract_address))
            if contract_code == '0x' or contract_code == b'':
                raise ValueError("Contract does not exist on-chain")

            # Try to get ERC20 basic info directly from the contract
            try:
                contract = self.w3.eth.contract(
                    address=Web3.to_checksum_address(contract_address),
                    abi=[
                        {"constant": True, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"}], "type": "function"},
                        {"constant": True, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"}], "type": "function"},
                        {"constant": True, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "type": "function"}
                    ]
                )
                
                name = contract.functions.name().call()
                symbol = contract.functions.symbol().call()
                decimals = contract.functions.decimals().call()
                
                token_info = {
                    "address": contract_address,
                    "name": name,
                    "symbol": symbol.upper(),
                    "decimals": decimals,
                    "is_valid": True
                }
                
                # Try CoinGecko as additional data source, but don't fail if unavailable
                try:
                    async with aiohttp.ClientSession() as session:
                        url = f"https://api.coingecko.com/api/v3/coins/ethereum/contract/{contract_address}"
                        async with session.get(url) as response:
                            if response.status == 200:
                                data = await response.json()
                                token_info.update({
                                    "coingecko_id": data.get('id'),
                                    "market_cap": data.get('market_data', {}).get('market_cap', {}).get('usd'),
                                    "total_supply": data.get('market_data', {}).get('total_supply')
                                })
                except Exception:
                    pass  # Ignore CoinGecko errors
                    
                return token_info

            except Exception as contract_error:
                raise ValueError(f"Invalid ERC20 contract: {str(contract_error)}")

        except Exception as e:
            raise ValueError(f"Invalid token contract: {str(e)}")

    async def fetch_price_data(self, contract_address: str, timeframe: str, interval_days: int) -> pd.DataFrame:
        """
        Fetch historical price data from a price API (example using CoinGecko)
        You might want to replace this with your preferred price data provider
        """
        end_time = datetime.now()
        start_time = end_time - timedelta(days=interval_days)
        
        # Convert timeframe to seconds for API
        timeframe_seconds = {
            "15m": 900,
            "1h": 3600,
            "4h": 14400,
            "1d": 86400
        }
        
        async with aiohttp.ClientSession() as session:
            # Replace with your preferred price API endpoint
            url = f"https://api.coingecko.com/api/v3/coins/ethereum/contract/{contract_address}/market_chart/range"
            params = {
                "vs_currency": "usd",
                "from": int(start_time.timestamp()),
                "to": int(end_time.timestamp())
            }
            
            async with session.get(url, params=params) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status, detail="Failed to fetch price data")
                
                data = await response.json()
                
                # Convert to DataFrame
                df = pd.DataFrame(data['prices'], columns=['timestamp', 'close'])
                df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
                
                # Resample to desired timeframe
                df.set_index('timestamp', inplace=True)
                df = df.resample(timeframe).agg({
                    'close': 'last'
                }).dropna()
                
                # Add OHLC data (you should replace this with actual OHLC data from your API)
                df['open'] = df['close'].shift(1)
                df['high'] = df['close'] * 1.001  # Placeholder
                df['low'] = df['close'] * 0.999   # Placeholder
                df['volume'] = 0                   # Placeholder
                
                return df