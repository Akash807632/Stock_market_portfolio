import React, { useState, useEffect, useContext } from "react";
import StockContext from "../context/StockContext";
import axios from "axios";
import '../css/Stockitem.css'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "IHDYRNRR617IDRWQ";

export default function StockCard(props) {
  const { stock } = props;
  const { fetchCurrentPrice, sellStock} = useContext(StockContext);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [totalValue, setTotalValue] = useState(null);
  const [profitLoss, setProfitLoss] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [sellQuantity, setSellQuantity] = useState(1);

  useEffect(() => {
    const getCurrentPrice = async () => {
      try {
        const price = await fetchCurrentPrice(stock.symbol);
        setCurrentPrice(price ? Number(price) : 150);

        const profitLossValue = (price - stock.purchasePrice) * stock.quantity;
        setTotalValue(stock.quantity * price);
        setProfitLoss(profitLossValue);
      } catch (error) {
        console.error("Error fetching stock price:", error);
      }
    };

    const getHistoricalData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.symbol}&apikey=${API_KEY}`
        );
        console.log("API Response:", response.data);
        if (!response.data || !response.data["Time Series (Daily)"]) {
          throw new Error("No historical data available");
        }

        const timeSeries = response.data["Time Series (Daily)"];
        const historicalData = Object.entries(timeSeries || {})
          .slice(0, 7)
          .map(([date, data]) => ({
            date,
            price: parseFloat(data["4. close"]) || 0,
          }));

        setChartData(historicalData.reverse());
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setChartData([
          { date: "2024-03-01", price: 150 },
          { date: "2024-03-02", price: 152 },
          { date: "2024-03-03", price: 148 },
          { date: "2024-03-04", price: 155 },
          { date: "2024-03-05", price: 153 },
          { date: "2024-03-06", price: 157 },
          { date: "2024-03-07", price: 160 },
        ]);
      }
    };

    getCurrentPrice();
    getHistoricalData();
  }, [stock.symbol, fetchCurrentPrice, stock.quantity, stock.purchasePrice]);

  const handleSellStock = async () => {
    if (sellQuantity <= 0 || sellQuantity > stock.quantity) {
      alert("Invalid quantity. You cannot sell more than you own.");
      return;
    }
  
    try {
      const success = await sellStock(stock.symbol, sellQuantity, currentPrice);
  
      if (success) {
        alert("Stock sold successfully!");
      } else {
        alert("Error selling stock. Please try again.");
      }
    } catch (error) {
      console.error("Sell error:", error);
      alert("Failed to sell stock. Check console for details.");
    }
  };
  
  return (
    <div className="stock-card">
      <h3 className="stock-name">{stock.name} ({stock.symbol})</h3>
      <div className="stock-info">
        <p><strong>Quantity:</strong> {stock.quantity}</p>
        <p><strong>Purchase Price:</strong> ${stock.purchasePrice.toFixed(2)}</p>
        <p><strong>Current Price:</strong>  
          {currentPrice !== null && !isNaN(currentPrice)  
            ? `$${Number(currentPrice).toFixed(2)}`  
            : "Loading..."}  
        </p>
        <p><strong>Total Value:</strong> {totalValue !== null ? `$${totalValue.toFixed(2)}` : "Calculating..."}</p>
        <p className={`profit-loss ${profitLoss >= 0 ? "profit" : "loss"}`}>
          <strong>Profit/Loss:</strong> {profitLoss !== null ? `$${profitLoss.toFixed(2)}` : "Calculating..."}
        </p>
      </div>

      <div className="sell-section">
        <h5>Sell Stock</h5>
        <input
          type="number"
          min="1"
          max={stock.quantity}
          value={sellQuantity}
          onChange={(e) => setSellQuantity(Number(e.target.value))}
          className="sell-input"
        />
       <button onClick={handleSellStock} className="sell-button">Sell</button>
      </div>

      <div className="chart-container">
        <h5>7-Day Price Trend</h5>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#666" }} tickLine={false} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#333" }}
              cursor={{ stroke: "#4f46e5", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ stroke: "#4f46e5", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
