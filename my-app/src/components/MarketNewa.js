import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/MarketNews.css"; // Import CSS for styling

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Display 10 news cards initially

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Portfolio/market-news");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  // Function to load more news (in increments of 10)
  const loadMoreNews = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="market-news-container">
      <h2 className="news-heading">Market News</h2>
      <div className="news-grid">
        {news.slice(0, visibleCount).map((article, index) => (
          <div key={index} className="news-card">
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="news-image" />
            )}
            <div className="news-content">
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (Only show if there is more news to load) */}
      {visibleCount < news.length && (
        <button className="load-more-btn" onClick={loadMoreNews}>
          Load More
        </button>
      )}
    </div>
  );
};

export default MarketNews;
