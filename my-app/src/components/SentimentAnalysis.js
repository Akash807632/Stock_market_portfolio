import React, { useState, useEffect } from "react";
import "../css/SentimentAnalysis.css";

export default function NewsSentiment() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5001/analyze-news");
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError("Failed to fetch news");
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h2>📰 Stock Market News Sentiment</h2>
      {loading && <p className="loading">Loading news...</p>}
      {error && <p className="error">❌ {error}</p>}

      {!loading && !error && (
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={index} className="news-card">
              <h3>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>
              <p><strong>Source:</strong> {item.source}</p>
              <p className={`sentiment ${item.sentiment.toLowerCase()}`}>
                <strong>Sentiment:</strong> {item.sentiment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
