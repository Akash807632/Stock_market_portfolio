from flask import Flask, request, jsonify
import requests
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from flask_cors import CORS

nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

app = Flask(__name__)
CORS(app)

NEWS_API_KEY = "2033a9ba9e864c6db2ceeacc04b4068c"

# Fetch Stock Market News
def get_stock_news():
    url = f"https://newsapi.org/v2/everything?q=stock+market&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    news_data = response.json()
    articles = news_data.get("articles", [])
    
    return [
        {
            "title": article["title"],
            "source": article["source"]["name"],
            "url": article["url"],  # ✅ Include URL in the response
        }
        for article in articles
    ]

# Analyze Sentiment
def analyze_sentiment(news_headlines):
    results = []
    for news in news_headlines:
        sentiment_score = sia.polarity_scores(news["title"])["compound"]
        sentiment = "Positive" if sentiment_score > 0.2 else "Negative" if sentiment_score < -0.2 else "Neutral"
        results.append({
            "title": news["title"],
            "source": news["source"],
            "url": news["url"],  # ✅ Include URL in the final response
            "sentiment": sentiment
        })
    return results

@app.route('/analyze-news', methods=['GET'])
def analyze_news():
    news_headlines = get_stock_news()
    sentiment_results = analyze_sentiment(news_headlines)
    return jsonify(sentiment_results)

if __name__ == '__main__':
    app.run(port=5001, debug=True)  # Runs on port 5001
