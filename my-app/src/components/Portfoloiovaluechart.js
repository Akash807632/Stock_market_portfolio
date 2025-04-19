import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import "../css/PortfolioChart.css"; // New CSS file for styling

export default function PortfolioValueChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch("http://localhost:3000/Portfolio/History", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token'),
          },
        });
  
        const data = await response.json();
        console.log("Fetched Data:", data); // ✅ Debugging step
  
        // Ensure `data` is an array before using `.map()`
        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data);
          return; // Stop execution if data is not an array
        }
  
        const formattedData = data.map(stock => {
          // Find the latest transaction
          const latestTransaction = stock.transactions.length > 0
            ? stock.transactions[stock.transactions.length - 1] // Last transaction
            : null;
        
          return {
            date: latestTransaction 
              ? new Date(latestTransaction.date).toISOString().split("T")[0] 
              : "Unknown",
            value: stock.quantity * stock.purchasePrice,
          };
        });
        
  
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };
  
    fetchPortfolioData();
  }, []);
  

  return (
    <div className="chart-container">
      <h2 className="chart-title">📈 Portfolio Performance</h2>
      {chartData.length > 1 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" tick={{ fill: "#ddd" }} />
            <YAxis tick={{ fill: "#ddd" }} />
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Bar dataKey="value" fill="url(#colorUv)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4b5c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff4b5c" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fill: "#ddd" }} />
            <YAxis tick={{ fill: "#ddd" }} />
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Line type="monotone" dataKey="value" stroke="#00bcd4" strokeWidth={3} dot={{ r: 4, fill: "#00bcd4" }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
