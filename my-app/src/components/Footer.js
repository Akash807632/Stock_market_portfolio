import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa"; // Import social icons

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo & Tagline */}
        <div className="footer-left">
          <h2 className="footer-logo">📈 StockApp</h2>
          <p>Your smart way to track and manage investments.</p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="footer-middle">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Allstocks">All Stocks</Link></li>
            <li><Link to="/Top">Trending Stocks</Link></li>
            <li><Link to="/Userstocks">My Portfolio</Link></li>
            <li><Link to="/About">About Us</Link></li>
          </ul>
        </div>

        {/* Right Section - Social Media */}
        <div className="footer-right">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 StockApp. All rights reserved.</p>
      </div>
    </footer>
  );
}
