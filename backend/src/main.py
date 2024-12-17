from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import pandas as pd
import aiohttp
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
from starlette.websockets import WebSocketState

from .services.ethereum import EthereumService
from .services.technical_analysis.analyzer import TechnicalAnalyzer
from .config import ETHEREUM_RPC_ENDPOINTS
from .services.price_service import PriceService, PriceDataError
from .services.dca.calculator import DCACalculator
from .services.dca.backtester import DCABacktester
from .services.analysis.risk_calculator import calculate_risk_score, calculate_expected_return

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/api/analyze"
        }
    }

# Initialize services
ethereum_service = EthereumService()
price_service = PriceService()

class TokenAnalysisRequest(BaseModel):
    contract_address: str
    timeframe: str  # 15m, 1h, 4h, 1d
    interval_days: int = 30
    investment_amount: float = 100.0

class TechnicalAnalysis(BaseModel):
    support_levels: list[float]
    resistance_levels: list[float]
    fibonacci_levels: list[dict]
    rsi: float
    volatility: float

class DCAStrategy(BaseModel):
    entry_points: list[dict]
    exit_points: list[dict]
    risk_score: float
    expected_return: float
    investment_distribution: list[dict]

class AnalysisResponse(BaseModel):
    token_info: dict
    technical_analysis: TechnicalAnalysis
    dca_strategy: DCAStrategy
    backtest_results: dict

@app.websocket("/ws/analysis")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Keep the connection open but don't wait for messages
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("WebSocket client disconnected")

@app.post("/api/analyze")
async def analyze_token(request: TokenAnalysisRequest, websocket: WebSocket = None):
    try:
        print(f"Received analysis request: {request.dict()}")
        
        # Validate request parameters
        if request.interval_days <= 0 or request.interval_days > 365:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="interval_days must be between 1 and 365"
            )
        
        if request.timeframe not in ["15m", "1h", "4h", "1d"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid timeframe"
            )
        
        if request.investment_amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="investment_amount must be positive"
            )

        # Validate token contract
        token_info = await ethereum_service.validate_token(request.contract_address)

        # Fetch price data with progress updates
        price_data = await price_service.fetch_price_data(
            request.contract_address,
            request.timeframe,
            request.interval_days,
            websocket
        )

        # Perform analysis with the fetched data
        analyzer = TechnicalAnalyzer(price_data)
        technical_analysis = analyzer.analyze()
        
        dca_calc = DCACalculator(price_data, request.investment_amount)
        entry_points = dca_calc.calculate_entry_points(
            technical_analysis['support_levels'],
            technical_analysis['resistance_levels']
        )
        exit_points = dca_calc.calculate_exit_points(
            technical_analysis['resistance_levels'],
            technical_analysis['fibonacci_levels']
        )
        investment_distribution = dca_calc.distribute_investment(entry_points)
        
        dca_strategy = {
            "entry_points": entry_points,
            "exit_points": exit_points,
            "risk_score": calculate_risk_score(technical_analysis),
            "expected_return": calculate_expected_return(entry_points, exit_points),
            "investment_distribution": investment_distribution
        }
        
        backtester = DCABacktester(price_data, dca_strategy)
        backtest_results = backtester.run_backtest()
        
        return {
            "token_info": token_info,
            "technical_analysis": technical_analysis,
            "dca_strategy": dca_strategy,
            "backtest_results": backtest_results
        }

    except PriceDataError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Add error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "detail": jsonable_encoder(exc.errors()),
            "status_code": 422
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"Unexpected error: {str(exc)}")  # Debug log
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "status_code": 500
        }
    )