import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider
import StockState from "./context/StockState"; // ✅ Keep StockState
import Navbar from "./components/Navbar";
import Stock from "./components/Stock";
import Allstock from "./components/Allstockitem";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PortfolioValueChart from "./components/Portfoloiovaluechart";
import Transactions from "./components/Transactionfile";
import TrendingStocks from "./components/TrendingStocks";
import MarketNews from "./components/MarketNewa";
import About from './components/About';
import Footer from './components/Footer';
import ComparePortfolioChart from './components/CompareChart';
import StockPrediction from './components/StockPrediction';
import SentimentAnalysis from './components/SentimentAnalysis';

function App() {
  return (
    <AuthProvider> 
      <StockState>  
        <Router>
          <div className="app-container"> {/* Add this wrapper */}
            <Navbar />
            <div className="container">
              <Routes>
                <Route exact path="/" element={<MarketNews />} />
                <Route exact path="/Userstocks" element={<Stock />} />
                <Route exact path="/Allstocks" element={<Allstock />} />
                <Route exact path="/Login" element={<Login />} />
                <Route exact path="/Signup" element={<Signup />} />
                <Route exact path="/Transaction" element={<Transactions />} />
                <Route exact path="/Top" element={<TrendingStocks />} />
                <Route exact path="/Valuechart" element={<PortfolioValueChart />} />
                <Route exact path="/About" element={<About />} />
                <Route exact path="/Compare" element={<ComparePortfolioChart/>} />
                <Route exact path="/Predit" element={<StockPrediction/>} />
                <Route exact path="/Analyis" element={<SentimentAnalysis/>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </StockState>
    </AuthProvider>
  );
}


export default App;
