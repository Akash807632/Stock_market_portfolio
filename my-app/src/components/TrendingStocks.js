import React, { useEffect, useState } from "react";
import '../css/StockCard.css'

export default function TrendingStocks() {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      try {
        const response = await fetch("http://localhost:3000/Portfolio/trending");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging log

        if (!data || !data.top_gainers) {
          throw new Error("Unexpected API response format.");
        }

        // ✅ Merge all stock categories into one array
        const combinedStocks = [
          ...data.top_gainers,
          ...data.top_losers,
          ...data.most_actively_traded
        ];

        console.log("Final Trending Stocks:", combinedStocks);
        setTrendingStocks(combinedStocks);
      } catch (error) {
        console.error("Error fetching trending stocks:", error);
        setError(error.message || "Failed to load trending stocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingStocks();
  }, []);

  return (
    <div className="trending-container">
      <h2>📈 Trending Stocks</h2>

      {error && <p className="error-message"></p>}
      {loading ? (
        <p>Loading stocks...</p>
      ) : trendingStocks.length > 0 ? (
        <div className="stock-grid">
          {trendingStocks.map((stock, index) => {
            console.log("Stock Object:", stock); // Debugging log

            return (
              <div key={index} className="stock-card">
                <h3>{stock.ticker || "🔴 No Symbol"}</h3>
                <p><strong>Price:</strong> {stock.price ? `$${stock.price}` : "🔴 No Price"}</p>
                <p><strong>Change:</strong> 📊 {stock.change_percentage ? `${stock.change_percentage}` : "🔴 No Data"}</p>
                <p><strong>Volume:</strong> {stock.volume ? stock.volume : "🔴 No Volume"}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No trending stocks available.</p>
      )}
    </div>
  );
}
