# Token Analysis Tool

A comprehensive DCA (Dollar-Cost Averaging) analysis tool for Ethereum tokens that provides technical analysis and investment strategies.

## Project Overview

This tool analyzes Ethereum tokens and provides data-driven insights for DCA investment strategies. It combines technical analysis with historical backtesting to suggest optimal entry and exit points for token investments.

## Features

- Token contract validation and information retrieval
- Multiple timeframe analysis (1h, 4h, 1d)
- Price data sourcing:
  - Primary: DefiLlama API (reliable, high-quality price data)
  - Historical price data with customizable intervals
- Technical indicators:
  - Support and resistance levels
  - Fibonacci retracement levels
  - Volatility metrics
  - Momentum indicators
- DCA strategy generation:
  - Time-based entry points
  - Price-based entry points
  - Risk assessment
  - Historical performance backtesting
- Interactive visualization of analysis results

## Technical Stack

### Backend
- Python FastAPI
- Web3.py for Ethereum interaction
- pandas for data analysis
- scipy/numpy for technical analysis
- Technical indicators libraries (TA-Lib)
- Price data: DefiLlama API

### Frontend
- Next.js/React
- TailwindCSS
- TradingView lightweight charts
- TypeScript

## API Documentation

### Token Analysis Endpoint

#### Request Body
```json
{
  "contract_address": "string",    // Ethereum token contract address
  "timeframe": "string",          // "15m", "1h", "4h", "1d"
  "interval_days": integer,       // Analysis period (default: 30)
  "investment_amount": float      // Amount to invest (default: 100.0)
}
```

#### Response
```json
{
  "token_info": {
    "address": "string",
    "name": "string",
    "symbol": "string",
    "decimals": integer,
    "is_valid": boolean
  },
  "technical_analysis": {
    "support_levels": [float],
    "resistance_levels": [float],
    "fibonacci_levels": [
      {
        "level": float,
        "price": float,
        "type": string
      }
    ],
    "rsi": float,
    "volatility": float
  },
  "dca_strategy": {
    "entry_points": [
      {
        "price": float,
        "percentage": float,
        "timestamp": string
      }
    ],
    "exit_points": [
      {
        "price": float,
        "percentage": float,
        "type": string
      }
    ],
    "risk_score": float,
    "expected_return": float,
    "investment_distribution": [
      {
        "amount": float,
        "timestamp": string,
        "price_target": float
      }
    ]
  },
  "backtest_results": {
    "historical_performance": float,
    "win_rate": float,
    "average_return": float,
    "max_drawdown": float,
    "risk_adjusted_return": float
  }
}
```

### Error Responses

```json
{
  "error": "string",
  "detail": "string",
  "status_code": integer
}
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/token-analysis-tool.git
cd token-analysis-tool
```

2. Install TA-Lib (required for technical analysis):

Windows:
- Download ta-lib-0.4.0-msvc.zip from https://ta-lib.org/hdr_dw.html
- Extract to C:\ta-lib
- Add C:\ta-lib\lib to your system's PATH environment variable
- Alternative: Download pre-built wheel from https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib

Linux:
```bash
wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz
tar -xzf ta-lib-0.4.0-src.tar.gz
cd ta-lib/
./configure --prefix=/usr
make
sudo make install
```

3. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/MacOS
python -m venv venv
source venv/bin/activate
```

4. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

5. Install frontend dependencies
```bash
cd frontend
npm install
```

## Environment Variables

Backend:
```env
ETHEREUM_PROVIDER_URL=your_provider_url
```

Frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn src.main:app --reload
# Server will run on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

## Price Data Sources

The application uses DefiLlama's API as the primary source for price data. This provides several advantages:
- Reliable and accurate price data
- High availability
- No API key required
- Support for historical prices
- Multiple timeframe support

## Rate Limits

DefiLlama API rate limits:
- 10-200 requests per minute
- Automatic rate limiting implemented in the backend
- Retry mechanism for failed requests

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Note: This project uses free public APIs for Ethereum RPC and price data. The endpoints are configured in `backend/src/config.py`.

Public APIs used:
- Ethereum RPC: Ankr, Cloudflare, Public RPC
- Price Data: DefiLlama API