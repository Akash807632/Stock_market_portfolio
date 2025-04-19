import React, { useState } from "react";
import "../css/StockPrediction.css";

export default function StockPrediction() {
  const [symbol, setSymbol] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [predictedDate, setPredictedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ List of popular stock symbols
  const stockSymbols = [
    { name: "Apple", symbol: "AAPL" },
    { name: "Google", symbol: "GOOGL" },
    { name: "Microsoft", symbol: "MSFT" },
    { name: "Tesla", symbol: "TSLA" },
    { name: "Amazon", symbol: "AMZN" },
    { name: "Netflix", symbol: "NFLX" },
    { name: "NVIDIA", symbol: "NVDA" },
    { name: "Meta (Facebook)", symbol: "META" },
    { name: "AMD", symbol: "AMD" },
    { name: "IBM", symbol: "IBM" }
  ];

  const fetchPrediction = async () => {
    if (!symbol) {
      setError("Please enter or select a stock symbol");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.predicted_price);
        setPredictedDate(data.predicted_date);
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div className="stock-container">
      <h2>📈 Stock Price Prediction</h2>

      {/* ✅ Search Feature */}
      <input
        type="text"
        placeholder="Type stock symbol (e.g. AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        className="stock-input"
      />

      {/* ✅ Dropdown Feature */}
      <select
        className="stock-dropdown"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      >
        <option value="">Or Select from List</option>
        {stockSymbols.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.name} ({stock.symbol})
          </option>
        ))}
      </select>

      <button onClick={fetchPrediction} className="stock-button">
        Predict Price
      </button>

      {loading && <p className="loading">⏳ Predicting...</p>}
      {error && <p className="error">❌ {error}</p>}

      {prediction !== null && predictedDate && (
        <div className="stock-result">
          <p>📊 Predicted Price for <b>{symbol}</b>: <b>${prediction}</b></p>
          <p>📅 Prediction Date: <b>{predictedDate}</b></p>
        </div>
      )}
    </div>
  );
}
