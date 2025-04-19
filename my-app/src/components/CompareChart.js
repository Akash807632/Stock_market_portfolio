import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import "../css/Comparechart.css";

export default function ComparePortfolioChart() {
    const [chartData, setChartData] = useState([]);
    const [altChartData, setAltChartData] = useState([]);
    const [stocks, setStocks] = useState([
        { symbol: "AAPL", name: "Apple Inc.", quantity: 1 },
        { symbol: "MSFT", name: "Microsoft Corp.", quantity: 1 },
        { symbol: "GOOGL", name: "Alphabet Inc.", quantity: 1 }
    ]);
    const [selectedStocks, setSelectedStocks] = useState([]);
    const [stockLimit, setStockLimit] = useState(10); // Limit initially to 10 stocks
    const API_KEY = "IHDYRNRR617IDRWQ";

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
                if (!Array.isArray(data)) {
                    console.error("Invalid data format:", data);
                    return;
                }
        
                let formattedData = data.map(stock => ({
                    date: stock.transactions.length > 0
                        ? new Date(stock.transactions[stock.transactions.length - 1].date).toISOString().split("T")[0]
                        : "Unknown",
                    value: stock.quantity * stock.purchasePrice,
                }));
        
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching portfolio data:", error);
            }
        };
        
        const fetchStockList = async () => {
            try {
                const response = await fetch(`https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${API_KEY}`);
                const csvText = await response.text();
        
                if (!csvText || csvText.trim().length === 0 || csvText === "{}") {
                    console.error("Alpha Vantage returned an empty response. Using hardcoded stocks.");
                    return;
                }
        
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        if (result.errors.length > 0) {
                            console.error("Parsing errors:", result.errors);
                        }
                        if (result.data.length > 0) {
                            const fetchedStocks = result.data
                                .map(stock => ({
                                    symbol: stock["symbol"] || stock["Symbol"],
                                    name: stock["name"] || stock["Name"],
                                }))
                                .filter(stock => stock.symbol && stock.name);
        
                            if (fetchedStocks.length > 0) {
                                setStocks(prevStocks => {
                                    const stockMap = new Map(prevStocks.map(stock => [stock.symbol, stock.quantity]));
        
                                    return [
                                        ...prevStocks,
                                        ...fetchedStocks
                                            .filter(stock => !stockMap.has(stock.symbol))
                                            .map(stock => ({
                                                ...stock,
                                                quantity: 1,
                                            })),
                                    ];
                                });
                            } else {
                                console.error("No valid stocks found. Using default stocks.");
                            }
                        }
                    },
                });
            } catch (error) {
                console.error("Error fetching stock list from Alpha Vantage:", error);
            }
        };
        
        fetchStockList();
        fetchPortfolioData();
    }, []);

    const handleStockSelection = (event) => {
        const { value, checked } = event.target;
        setSelectedStocks(prevSelected =>
            checked ? [...prevSelected, value] : prevSelected.filter(symbol => symbol !== value)
        );
    };
    const fetchStockHistory = async () => {
        try {
            let dateSet = new Set(chartData.map(d => d.date)); // Get all dates from actual portfolio data
            let totalPortfolioValue = [];
    
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split("T")[0];
    
                dateSet.add(dateString);
            }
    
            let sortedDates = Array.from(dateSet).sort(); // Ensure dates are sorted
    
            sortedDates.forEach(date => {
                const totalValue = selectedStocks.reduce((acc, symbol) => {
                    const stock = stocks.find(s => s.symbol === symbol);
                    return stock ? acc + (Math.random() * 200 + 100) * stock.quantity : acc;
                }, 0);
    
                totalPortfolioValue.push({
                    date,
                    value: totalValue
                });
            });
    
            setAltChartData(totalPortfolioValue);
        } catch (error) {
            console.error("Error fetching stock history:", error);
        }
    };
    
    const handleQuantityChange = (symbol, newQuantity) => {
        setStocks(prevStocks =>
            prevStocks.map(stock => stock.symbol === symbol ? { ...stock, quantity: newQuantity } : stock)
        );
    };

    const loadMoreStocks = () => {
        setStockLimit(prevLimit => prevLimit + 10); // Load 10 more stocks
    };

    return (
        <div className="chart-container">
            <h2 className="chart-title">📊 Portfolio Comparison</h2>
            
            <div className="stock-selection-container">
                <div className="dropdown-container">
                    {stocks.slice(0, stockLimit).map(stock => (
                        <label key={stock.symbol} className="stock-label">
                            <input type="checkbox" value={stock.symbol} onChange={handleStockSelection} />
                            {stock.name} ({stock.symbol})
                            <input
                                type="number"
                                value={stock.quantity}
                                onChange={(e) => handleQuantityChange(stock.symbol, Number(e.target.value))}
                                min="1"
                                className="quantity-input"
                            />
                        </label>
                    ))}
                </div>
                {stockLimit < stocks.length && (
                    <button className="load-more-button" onClick={loadMoreStocks}>Load More</button>
                )}
            </div>

            <button className="compare-button" onClick={fetchStockHistory}>Compare</button>

            <div className="charts-wrapper">
                <div className="chart-container">
                    <h3>📈 Actual Portfolio</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" tick={{ fill: "#ddd" }} />
                            <YAxis tick={{ fill: "#ddd" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
                            <Line type="monotone" dataKey="value" stroke="#00bcd4" strokeWidth={3} dot={{ r: 4, fill: "#00bcd4" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-container">
                    <h3>📊 Comparison Chart</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={altChartData}>
                            <XAxis dataKey="date" tick={{ fill: "#ddd" }} />
                            <YAxis tick={{ fill: "#ddd" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
                            <Line type="monotone" dataKey="value" stroke="#00bcd4" strokeWidth={3} dot={{ r: 4, fill: "#00bcd4" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
