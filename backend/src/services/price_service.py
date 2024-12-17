import aiohttp
import pandas as pd
from datetime import datetime, timedelta
import asyncio
from typing import Optional
from ..config import UNISWAP_V3_SUBGRAPH, RATE_LIMITS, ETHEREUM_RPC_ENDPOINTS
import talib
from web3 import Web3
import json
from decimal import Decimal
from contextlib import asynccontextmanager

@asynccontextmanager
async def timeout(seconds: float):
    try:
        async with asyncio.timeout(seconds):
            yield
    except asyncio.TimeoutError:
        raise

class PriceDataError(Exception):
    """Custom exception for price data fetching errors"""
    def __init__(self, message: str, source: str, status_code: int = None):
        self.message = message
        self.source = source
        self.status_code = status_code
        super().__init__(self.message)

# Uniswap V2 Factory address
UNISWAP_V2_FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
# Minimal ABI for price calculation
UNISWAP_V2_PAIR_ABI = json.loads('''[
    {"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"amount0","type":"uint256"},{"indexed":false,"name":"amount1","type":"uint256"}],"name":"Sync","type":"event"},
    {"constant":true,"inputs":[],"name":"token0","outputs":[{"name":"","type":"address"}],"type":"function"},
    {"constant":true,"inputs":[],"name":"token1","outputs":[{"name":"","type":"address"}],"type":"function"},
    {"constant":true,"inputs":[],"name":"getReserves","outputs":[{"name":"_reserve0","type":"uint112"},{"name":"_reserve1","type":"uint112"},{"name":"_blockTimestampLast","type":"uint32"}],"type":"function"}
]''')

# Add these constants at the top with other constants
UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

UNISWAP_V3_FACTORY_ABI = json.loads('''[
    {"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"}],"name":"getPool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
]''')

UNISWAP_V3_POOL_ABI = [
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "int256",
                "name": "amount0",
                "type": "int256"
            },
            {
                "indexed": False,
                "internalType": "int256",
                "name": "amount1",
                "type": "int256"
            },
            {
                "indexed": False,
                "internalType": "uint160",
                "name": "sqrtPriceX96",
                "type": "uint160"
            },
            {
                "indexed": False,
                "internalType": "uint128",
                "name": "liquidity",
                "type": "uint128"
            },
            {
                "indexed": False,
                "internalType": "int24",
                "name": "tick",
                "type": "int24"
            }
        ],
        "name": "Swap",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "token0",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token1",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "slot0",
        "outputs": [
            {"internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160"},
            {"internalType": "int24", "name": "tick", "type": "int24"},
            {"internalType": "uint16", "name": "observationIndex", "type": "uint16"},
            {"internalType": "uint16", "name": "observationCardinality", "type": "uint16"},
            {"internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16"},
            {"internalType": "uint8", "name": "feeProtocol", "type": "uint8"},
            {"internalType": "bool", "name": "unlocked", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class PriceService:
    def __init__(self):
        self.weth_address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        
        # Initialize Web3 with public RPC
        for rpc_url in ETHEREUM_RPC_ENDPOINTS:
            try:
                self.w3 = Web3(Web3.HTTPProvider(rpc_url))
                if self.w3.is_connected():
                    break
            except Exception:
                continue
        
        if not hasattr(self, 'w3') or not self.w3.is_connected():
            raise Exception("Failed to connect to any Ethereum RPC endpoint")

    async def fetch_price_data(self, contract_address: str, timeframe: str, interval_days: int, websocket=None) -> pd.DataFrame:
        try:
            # Validate token first
            if not await self._validate_token(contract_address):
                raise PriceDataError(
                    message="Invalid token contract or not an ERC20 token",
                    source="validation",
                    status_code=400
                )

            print("Fetching Uniswap V3 data...")
            df = await self._fetch_v3_data(contract_address, timeframe, interval_days, websocket)
            if not df.empty and self._validate_price_data(df):
                print("Successfully fetched from Uniswap V3")
                return df

            print("Trying Uniswap V2...")
            df = await self._fetch_v2_data(contract_address, timeframe, interval_days, websocket)
            if not df.empty and self._validate_price_data(df):
                print("Successfully fetched from Uniswap V2")
                return df

            raise PriceDataError(
                message="No liquidity found for this token in Uniswap pools",
                source="liquidity",
                status_code=404
            )
            
        except PriceDataError:
            raise
        except Exception as e:
            raise PriceDataError(
                message=f"Failed to fetch price data: {str(e)}",
                source="fetch",
                status_code=503
            )

    async def _fetch_v3_data(self, contract_address: str, timeframe: str, interval_days: int, websocket=None) -> pd.DataFrame:
        """Fetch from Uniswap V3"""
        # Pool finding logic remains the same
        factory = self.w3.eth.contract(
            address=Web3.to_checksum_address(UNISWAP_V3_FACTORY),
            abi=UNISWAP_V3_FACTORY_ABI
        )
        
        # Try different fee tiers (0.05%, 0.3%, 1%)
        fee_tiers = [500, 3000, 10000]
        pool_address = None
        
        for fee in fee_tiers:
            try:
                pool_address = factory.functions.getPool(
                    Web3.to_checksum_address(contract_address),
                    Web3.to_checksum_address(self.weth_address),
                    fee
                ).call()
                if pool_address != "0x0000000000000000000000000000000000000000":
                    print(f"Found V3 pool with fee {fee/10000}%: {pool_address}")
                    break
            except Exception as e:
                print(f"Error checking fee tier {fee}: {str(e)}")
                continue

        if not pool_address or pool_address == "0x0000000000000000000000000000000000000000":
            print("No V3 pool found")
            return pd.DataFrame()

        # Get pool contract and token info
        pool_contract = self.w3.eth.contract(address=pool_address, abi=UNISWAP_V3_POOL_ABI)
        token0 = pool_contract.functions.token0().call()
        token1 = pool_contract.functions.token1().call()
        
        # Get decimals
        decimals0 = self.w3.eth.contract(
            address=token0,
            abi=[{"constant":True,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"}]
        ).functions.decimals().call()
        decimals1 = self.w3.eth.contract(
            address=token1,
            abi=[{"constant":True,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"}]
        ).functions.decimals().call()

        is_token0 = Web3.to_checksum_address(contract_address) == token0
        decimals_ratio = 10 ** (decimals1 - decimals0 if is_token0 else decimals0 - decimals1)

        # Fetch historical prices using slot0
        end_block = self.w3.eth.block_number
        blocks_per_day = 7200
        start_block = max(0, end_block - (interval_days * blocks_per_day))
        block_step = 100  # Sample every 100 blocks
        
        print(f"Fetching prices from block {start_block} to {end_block}")
        print(f"Total blocks to process: {end_block - start_block}")
        
        price_data = []
        current_block = start_block
        last_progress = -1  # Start at -1 to ensure first progress is shown
        total_blocks = end_block - start_block
        
        while current_block < end_block:
            try:
                # Calculate progress percentage
                progress = int(((current_block - start_block) / total_blocks) * 100)
                
                # Print progress every 5%
                if progress > last_progress and progress % 5 == 0:
                    print(f"Progress: {progress}% - Block: {current_block}/{end_block}")
                    last_progress = progress

                slot0_data = pool_contract.functions.slot0().call(block_identifier=current_block)
                sqrt_price_x96 = Decimal(slot0_data[0])
                
                price = ((sqrt_price_x96 * sqrt_price_x96 * decimals_ratio) / Decimal(2 ** 192))
                if not is_token0:
                    price = Decimal(1) / price
                
                block = self.w3.eth.get_block(current_block)
                timestamp = datetime.fromtimestamp(block['timestamp'])
                
                price_data.append({
                    'timestamp': timestamp,
                    'price': float(price)
                })
                
            except Exception as e:
                print(f"Error at block {current_block}: {str(e)}")
            
            current_block += block_step
            await asyncio.sleep(0.1)

        print(f"Collected {len(price_data)} price points")
        return self._process_price_data(pd.DataFrame(price_data), timeframe)

    def _process_price_data(self, df: pd.DataFrame, timeframe: str) -> pd.DataFrame:
        """Process price data into OHLCV format"""
        if df.empty:
            return df
        
        df.set_index('timestamp', inplace=True)
        df['close'] = df['price']
        df['volume'] = 0  # Volume data not available from sync events
        df['open'] = df['close'].shift(1)
        df['high'] = df.groupby(df.index.date)['close'].transform('max')
        df['low'] = df.groupby(df.index.date)['close'].transform('min')

        # Resample to desired timeframe
        if timeframe != '1d':
            df = df.resample(timeframe).agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum'
            }).dropna()

        return df

    def _validate_price_data(self, df: pd.DataFrame) -> bool:
        """Validate the price data quality"""
        if df.empty:
            return False
        
        required_columns = {'open', 'high', 'low', 'close', 'volume'}
        if not all(col in df.columns for col in required_columns):
            return False
            
        if df[list(required_columns)].isnull().mean().mean() > 0.2:  # 20% missing data threshold
            return False
            
        price_change = df['close'].pct_change().abs()
        if price_change.max() > 0.5:  # 50% price change threshold
            return False
            
        return True

    async def calculate_technical_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate technical indicators for the price data"""
        # Convert pandas series to numpy array for TA-Lib
        close_prices = df['close'].to_numpy()
        
        # Add technical indicators
        df['sma_20'] = talib.SMA(close_prices, timeperiod=20)
        df['rsi'] = talib.RSI(close_prices, timeperiod=14)
        df['macd'], df['macd_signal'], df['macd_hist'] = talib.MACD(
            close_prices, 
            fastperiod=12, 
            slowperiod=26, 
            signalperiod=9
        )
        
        return df

    async def _validate_token(self, contract_address: str) -> bool:
        """Validate if the given address is a valid ERC20 token"""
        try:
            if not Web3.is_address(contract_address):
                raise PriceDataError(
                    message="Invalid Ethereum address format",
                    source="validation",
                    status_code=400
                )
            
            checksum_address = Web3.to_checksum_address(contract_address)
            
            # Check if contract exists
            code = await asyncio.get_event_loop().run_in_executor(
                None, 
                self.w3.eth.get_code, 
                checksum_address
            )
            
            if len(code) == 0:
                raise PriceDataError(
                    message="Address is not a contract",
                    source="validation",
                    status_code=400
                )

            return True
            
        except PriceDataError:
            raise
        except Exception as e:
            raise PriceDataError(
                message=f"Token validation failed: {str(e)}",
                source="validation",
                status_code=400
            )