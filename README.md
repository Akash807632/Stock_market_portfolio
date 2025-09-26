final view
![image alt](https://github.com/Akash807632/Stock_market_portfolio/blob/main/Picture1.jpg)


# Stock Market Portfolio App — with Stock Price Prediction (LSTM)

> **One‑stop MERN portfolio manager** + transaction logging + LSTM-based price prediction and sentiment analysis.

---

## Table of Contents

* [Project Overview]
* [Key Features]
* [Architecture]
* [Tech Stack]
* [Getting Started]

  * [Prerequisites]
  * [Installation]
  * [Environment variables]
  * [Running the app]
* [Stock Price Prediction (LSTM)]

  * [Data source]
  * [Model training & evaluation]
  * [How predictions are used in the app]
* [Sentiment Analysis of Market News]
* [Database & Exports]
* [Deployment]
* [Development Notes & Roadmap]
* [Contributing]
* [License]
* [Acknowledgements]

---

## Project Overview

This repository contains a full-stack Stock Market Portfolio application built with the MERN stack (MongoDB, Express, React, Node). The app allows users to:

* Create and manage a personal stock portfolio
* Log buy/sell transactions with timestamps and metadata
* Auto-adjust holdings & portfolio analytics after each transaction
* Export transaction history as CSV or PDF
* View charts and performance graphs (historical P/L, allocations)
* See trending stocks and market predictions
* Run an LSTM-based stock price predictor (trained on historical OHLC data)
* Run sentiment analysis on market news to inform trading signals

The project is intended to be a practical, GitHub-ready starter kit for building portfolio tools and experimenting with ML-driven signals.

---

## Key Features

* User authentication & per-user portfolios
* Buy/sell transaction logging with timestamps
* Auto portfolio reconciliation and position history
* Interactive charts (e.g., portfolio value over time, individual stock price chart)
* Trending Stocks component (based on volume and price movement)
* Stock Price Prediction using LSTM (Python backend) with model versioning
* Sentiment analysis pipeline for news headlines (optional) to provide sentiment scores
* Export to CSV and PDF for transactions

---

## Architecture

```
[React Frontend] <--> [Node/Express API] <--> [MongoDB Atlas / Local MongoDB]
                          |
                          +--> [Python ML Service] (Flask/FastAPI) -- uses Alpha Vantage API
                          |
                          +--> [Scheduler/Worker] (for periodic data fetch & retraining)
```

* Frontend: React (Create React App / Vite) with charting libraries (e.g., Recharts / Chart.js)
* Backend: Node.js + Express for REST API and auth (JWT)
* DB: MongoDB for users, portfolios, transactions, cached historical price data, and model metadata
* ML Service: Python (virtualenv) running LSTM training/prediction endpoints (FastAPI recommended)

---

## Tech Stack

* Frontend: React, React Router, Tailwind CSS (optional)
* Backend: Node.js (v18+), Express, Mongoose
* Database: MongoDB (Atlas or local)
* ML: Python 3.9+ with packages: numpy, pandas, scikit-learn, tensorflow/keras, matplotlib
* Data source: **Alpha Vantage** API for historical price data (per user context preference)
* Optional: Redis for caching, Celery/RQ for background jobs

---

## Getting Started

### Prerequisites

* Node.js v18+ and npm/yarn
* Python 3.9+ and pip
* MongoDB running locally or a MongoDB Atlas URI
* Alpha Vantage API key (free tier available)

### Installation

Clone the repo and install both server and client:

```bash
git clone <repo-url>
cd stock-market-portfolio

# Server
cd server
npm install

# Client
cd ../client
npm install

# ML service
cd ../ml_service
python -m venv .venv
source .venv/bin/activate     # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Environment variables

Create `.env` files in the `server` and `ml_service` directories.

**server/.env** (example):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
ALPHA_VANTAGE_KEY=YOUR_ALPHA_VANTAGE_API_KEY
ML_SERVICE_URL=http://localhost:8000
```

**ml_service/.env** (example):

```
ALPHA_VANTAGE_KEY=YOUR_ALPHA_VANTAGE_API_KEY
MODEL_DIR=./models
DATA_DIR=./data
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
```

### Running the app

Run MongoDB (local or ensure Atlas is reachable), then start services:

```bash
# Start backend API
cd server
npm run dev

# Start frontend
cd ../client
npm start

# Start ML service (FastAPI uvicorn)
cd ../ml_service
source .venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

---

## Stock Price Prediction (LSTM)

This project contains an LSTM model implementation in `ml_service/` that predicts a selected stock's next-day close price (or multi-step forecasts).

### Data source

* Historical OHLCV data is fetched from Alpha Vantage (TIME_SERIES_DAILY_ADJUSTED) and stored in `ml_service/data/` or the MongoDB cache.
* Data is preprocessed: missing days handled, features normalized (MinMaxScaler), and training windows created (e.g., lookback of 60 days).

### Model training & evaluation

* The LSTM model uses Keras (TensorFlow backend). Training script `train.py` supports:

  * configurable lookback window
  * train/validation split
  * model checkpoints & saving in `MODEL_DIR`
* Evaluation metrics used: MAE, MSE, RMSE.
* Example training command:

```bash
cd ml_service
source .venv/bin/activate
python train.py --symbol AAPL --epochs 50 --lookback 60
```

**Notes & best practices**:

* Use more data for stability; Alpha Vantage has rate limits on free tier — cache API responses.
* Avoid overfitting: early stopping, dropout, and simple architectures first.

### How predictions are used in the app

* The frontend can call the ML service prediction endpoint to show the LSTM forecast for a selected symbol.
* Predictions are advisory and displayed with confidence/uncertainty bands.
* Optionally, combine sentiment scores with the LSTM prediction to form a composite signal.

---

## Sentiment Analysis of Market News

* News headlines fetched from a news API (or scraped) are stored and analyzed.
* A sentiment pipeline in `ml_service/sentiment.py` tokenizes headlines and returns a score (-1 to +1).
* You can use a simple pre-trained transformer (e.g., distilBERT via Hugging Face) or a rule-based VADER approach for faster serving.

---

## Database & Exports

* MongoDB schema includes: Users, Portfolios, Transactions, CachedPrices, Models, Predictions.
* Transactions include: symbol, type (buy/sell), quantity, price, fee, timestamp, userNotes.
* Exports: CSV export endpoint and PDF generation (server-side via Puppeteer or jsPDF on client).

---

## Deployment

* Containerize services using Docker (one container for server, client, and ML service or split them).
* Use a process manager (PM2) for Node; uvicorn/gunicorn for ML service.
* Consider GPU-enabled environment if training large models.

---

## Development Notes & Roadmap

Planned improvements:

* Add model explainability (SHAP) for predictions
* Integrated backtest engine to simulate strategies
* Realtime websocket updates for price ticks
* CI/CD, Docker Compose, and k8s manifests

---

## Troubleshooting

* Rate limits from Alpha Vantage: implement local caching & backoff
* Model performance issues: try longer lookback, more data, or simpler models
* Timezones: store timestamps in UTC and convert on the client

---

## Contributing

Contributions are welcome. Please open issues or PRs. Follow project coding standards, run tests, and add documentation for major changes.

Suggested workflow:

1. Fork the repo
2. Create a feature branch `feature/xxx`
3. Add tests and update README
4. Open a PR with a clear description

---

## License

MIT License — see `LICENSE` file for details.

---

## Acknowledgements

* Alpha Vantage for time series data
* TensorFlow / Keras for LSTM modelling
* Open-source chart libraries used in frontend

---

If you'd like, I can also:

* Add a short `train.md` specifically explaining how to run experiments and manage model checkpoints.
* Provide a Dockerfile and a `docker-compose.yml` that wires frontend, backend, and ML service together.
* Generate example `.env` templates and Postman collection for the API.

