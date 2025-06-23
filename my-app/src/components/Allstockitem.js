import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Papa from "papaparse";
import StockContext from "../context/StockContext";
import "../css/AllStockCards.css"; // Ensure styles are updated accordingly
// const dotenv = require ('dotenv')
// require('dotenv').config();
const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
// const API_KEY = "ZZEVRVN9I5UABETB";

    //hardcoded stocks
    const fallbackStocks = [
        { symbol: "AAPL", name: "Apple Inc.", currentPrice: 150 },
        { symbol: "GOOGL", name: "Alphabet Inc.", currentPrice: 2800 },
        { symbol: "MSFT", name: "Microsoft Corp.", currentPrice: 320 },
    ];
const StockCards = () => {
    const { addStock } = useContext(StockContext);
    const [stocks, setStocks] = useState([]);
    const [stockLimit, setStockLimit] = useState(10);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

    // Load more stocks
    const loadMoreStocks = () => {
        setStockLimit((prevLimit) => prevLimit + 10);
    };
    


    // Fetch current stock price
    const fetchCurrentPrice = async (symbol) => {
        const priceURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
        try {
            const response = await axios.get(priceURL);
            return response.data["Global Quote"]?.["05. price"] || "N/A";
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            return "N/A";
        }
    };

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            setError("");
          

            const URL = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${API_KEY}`;
            try {
                const response = await axios.get(URL, { responseType: "text" });

                console.log("API Response:", response.data); // Debugging

                if (!response.data || response.data.trim() === "") {
                    setError("No stock data received from API.");
                    setLoading(false);
                    return;
                }

                const parsedData = Papa.parse(response.data, {
                    header: true,
                    skipEmptyLines: true,
                });

                console.log("Parsed Data:", parsedData);

                if (!parsedData.data || parsedData.data.length === 0) {
                    setError("No stock data found. Possible parsing issue.");
                    setLoading(false);
                    return;
                }

                // Fetch current prices
                const newStocks = await Promise.all(
                    parsedData.data.slice(0, stockLimit).map(async (stock) => ({
                        ...stock,
                        currentPrice: await fetchCurrentPrice(stock.symbol),
                    }))
                );
               

                setStocks(newStocks);
            } catch (error) {
                console.error("Error fetching stock data:", error);
                setError("Failed to fetch stock data.");
                setStocks(fallbackStocks);
            }

            setLoading(false);
        };

        fetchStocks();
    }, [stockLimit]);

    // Increase quantity
    const increaseQuantity = (symbol) => {
        setQuantities((prev) => ({
            ...prev,
            [symbol]: (prev[symbol] || 0) + 1,
        }));
    };

    // Decrease quantity
    const decreaseQuantity = (symbol) => {
        setQuantities((prev) => ({
            ...prev,
            [symbol]: Math.max((prev[symbol] || 0) - 1, 0),
        }));
    };

    // Add a single stock
    const handleAddStock = (stock) => {
        if (quantities[stock.symbol] > 0) {
            addStock(stock.symbol, stock.name, quantities[stock.symbol], stock.currentPrice);
            alert("stock added");
        } else {
            alert("Please select a quantity greater than 0.");
        }
    };

    return (
        <div className="container dark-theme">
            
            <h2 className="title">Available Stocks</h2>

            {error && <p className="error-msg">{error}</p>} {/* Show error if parsing fails */}
           
            <div className="stock-grid">
                {stocks.length > 0 ? (
                    stocks.map((stock, index) => (
                        <div className="stock-card" key={index}>
                            <h3>{stock.name}</h3>
                            <p><strong>Symbol:</strong> {stock.symbol}</p>
                            <p><strong>Current Price:</strong> ${stock.currentPrice}</p>

                            {/* Quantity Controls */}
                            <div className="quantity-control">
                                <button className="qty-btn" onClick={() => decreaseQuantity(stock.symbol)}>-</button>
                                <p>{quantities[stock.symbol] || 0}</p>
                                <button className="qty-btn" onClick={() => increaseQuantity(stock.symbol)}>+</button>
                            </div>

                            {/* Add Stock Button (Disabled if quantity is 0) */}
                            <button
                                className="add-stock-btn"
                                onClick={() => handleAddStock(stock)}
                                disabled={quantities[stock.symbol] <= 0}
                            >
                                Add Stock
                            </button>
                        </div>
                    ))
                ) : (
                    // !loading && <p>No stocks available.</p>   
                    fallbackStocks.map((stock, index) => (
                        <div className="stock-card" key={index}>
                            <h3>{stock.name}</h3>
                            <p><strong>Symbol:</strong> {stock.symbol}</p>
                            <p><strong>Current Price:</strong> ${stock.currentPrice}</p>

                            {/* Quantity Controls */}
                            <div className="quantity-control">
                                <button className="qty-btn" onClick={() => decreaseQuantity(stock.symbol)}>-</button>
                                <p>{quantities[stock.symbol] || 0}</p>
                                <button className="qty-btn" onClick={() => increaseQuantity(stock.symbol)}>+</button>
                            </div>

                            {/* Add Stock Button (Disabled if quantity is 0) */}
                            <button
                                className="add-stock-btn"
                                onClick={() => handleAddStock(stock)}
                                disabled={quantities[stock.symbol] <= 0}
                            >
                                Add Stock
                            </button>
                        </div>
                    ))                
                )}
            </div>

            {/* Load More Stocks */}
            <button className="load-more-btn" onClick={loadMoreStocks} disabled={loading}>
                {loading ? "Loading..." : "Load More Stocks"}
            </button>
            {/*<button className="button-64" onClick={() => addStock("symbol", "Akash", 2, 124563)} role="button"><span className="text">Add Stock</span></button> */}

        </div>
    );
};

export default StockCards;


  // <div className="container">
        //     <h2 className="title">Available Stocks</h2>
        //     <div className="row">
        //             <div className="col-md-3" >
        //                 <div className="center">
        //                     <div className="property-card">
        //                         <a href="#">
        //                             <div className="property-image">
        //                                 <div className="property-image-title"></div>
        //                             </div>
        //                         </a>
        //                         <div className="property-description">
        //                             <h5>Stock</h5>
        //                             <p><strong>SYMBOL:</strong> symbol</p>
        //                             <p><strong>NAME:</strong> akash</p>
        //                             <p><strong>Current Price:</strong> 12345</p>

        //                             {/* Quantity Controls */}
        //                             <div>
        //                                 <p><strong>Quantity:</strong> 2</p>
        //                                 <button className="button-64" >
        //                                     <span className="text">+</span>
        //                                 </button>
        //                             </div>

        //                             {/* Add Stock Button */}
        //                             <button 
        //                                 className="button-64" 
        //                                 onClick={() => addstock("symbol", "Akash", 2, 124563, 0)}
        //                                 role="button">
        //                                 <span className="text">Add Stock</span>
        //                             </button>

        //                             {/* Load More Stocks */}
        //                             {/* <button onClick={loadMoreStocks}>Load More Stocks</button> */}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
                
        //     </div>
        // </div>