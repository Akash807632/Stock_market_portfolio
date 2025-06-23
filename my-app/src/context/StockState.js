import React, { useState } from "react";
import StockContext from "./StockContext";
import axios from "axios";
const StockState = (props) => {
  const [stocks, setStocks] = useState([]);
  
  const getAuthToken = () => localStorage.getItem("token");
  
  const getAllStock = async () => {
    try {
      const response = await fetch("http://localhost:3000/Portfolio/getall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getAuthToken(), // Use dynamic token
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const json = await response.json();
      setStocks(json);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };
  
  //  Refresh portfolio after transactions
  const refreshPortfolio = async () => {
    await getAllStock();
  };
  
  //  Add a new stock
  const addStock = async (symbol, name, quantity, price) => {
    try {
      const response = await fetch("http://localhost:3000/Portfolio/CreateS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getAuthToken(),
        },
        body: JSON.stringify({ symbol, name, quantity, price }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const stock = await response.json();
      setStocks([...stocks, stock]); 
      refreshPortfolio(); //  Refresh after adding
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };
  
  //  Sell a stock
  const sellStock = async (symbol, quantity, price) => {
    try {
      const response = await fetch("http://localhost:3000/Portfolio/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getAuthToken(),
        },
        body: JSON.stringify({ symbol, quantity, price }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        refreshPortfolio(); //  Refresh portfolio
        return true;
      } else {
        console.error("Sell failed:", data);
        return false;
      }
    } catch (error) {
      console.error("Error selling stock:", error);
      return false;
    }
  };
  
  //  Fetch current stock price
  const fetchCurrentPrice = async (symbol) => {
    // const API_KEY = "ZZEVRVN9I5UABETB";
    const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
    const priceURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    
    try {
      const response = await axios.get(priceURL);
      const data = response.data;
      
      //  Ensure data format is correct
      const price = data?.["Global Quote"]?.["05. price"];
      return price ? parseFloat(price).toFixed(2) : 150;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return "N/A";
    }
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        setStocks,
        getAllStock,
        refreshPortfolio,
        addStock,
        sellStock,
        fetchCurrentPrice,
      }}
    >
      {props.children}
    </StockContext.Provider>
  );
};

export default StockState;
