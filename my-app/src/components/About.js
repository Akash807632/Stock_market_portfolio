import React from "react";
import "../css/About.css"; // Import the CSS file for styling

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">📈 About Stock Market Portfolio</h1>
      <p className="about-description">
        Welcome to the Stock Market Portfolio App, your **ultimate tool** for tracking and managing investments! 🚀
      </p>

      <div className="about-features">
        <div className="feature-card">
          <h3>📊 Real-time Tracking</h3>
          <p>Monitor your stocks and portfolio performance **live** with up-to-date market data.</p>
        </div>
        
        <div className="feature-card">
          <h3>📈 Profit & Loss Insights</h3>
          <p>Get instant calculations on gains, losses, and overall portfolio value.</p>
        </div>

        <div className="feature-card">
          <h3>📅 Transaction History</h3>
          <p>Keep track of all your **buy/sell** transactions with timestamps and price details.</p>
        </div>

        <div className="feature-card">
          <h3>📰 Market Trends</h3>
          <p>Stay updated with **trending stocks, market news, and predictions**.</p>
        </div>
      </div>

      <p className="about-footer">
        Built with ❤️ using **React, Node.js, Express, and MongoDB**. Start investing smartly today! 🚀
      </p>
    </div>
  );
}
