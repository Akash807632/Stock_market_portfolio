from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import Flask-CORS
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from alpha_vantage.timeseries import TimeSeries
from datetime import datetime, timedelta
app = Flask(__name__)
CORS(app) 

API_KEY = "IHDYRNRR617IDRWQ"  

# Load the trained LSTM model
model = load_model("lstm_model.h5")
def get_next_trading_day():
    """Find the next trading day (excluding weekends)."""
    next_day = datetime.today() + timedelta(days=1)
    
    
    if next_day.weekday() == 5:
        next_day += timedelta(days=2)
   
    elif next_day.weekday() == 6:
        next_day += timedelta(days=1)
    
    return next_day.strftime('%Y-%m-%d')
# Function to fetch historical stock data
def get_stock_data(symbol):
    ts = TimeSeries(key=API_KEY, output_format="pandas")
    data, meta_data = ts.get_daily(symbol=symbol, outputsize="full")
    df = data[['4. close']].iloc[::-1]  # Reverse to oldest-first order
    return df

# Function to predict the next day's stock price
def predict_stock_price(symbol):
    df = get_stock_data(symbol)

    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    # Prepare last 50 days for prediction
    last_50_days = scaled_data[-50:]
    X_test = np.reshape(last_50_days, (1, 50, 1))

    # Make prediction
    predicted_price = model.predict(X_test)
    predicted_price = scaler.inverse_transform(predicted_price)

    return float(predicted_price[0][0]), get_next_trading_day()  # Return price + date

# Flask API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    symbol = data.get("symbol")

    if not symbol:
        return jsonify({"error": "Stock symbol is required"}), 400

    try:
        predicted_price, predicted_date = predict_stock_price(symbol)
        return jsonify({
            "symbol": symbol,
            "predicted_price": round(predicted_price, 2),
            "predicted_date": predicted_date
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)  # Runs on port 5000

