import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from alpha_vantage.timeseries import TimeSeries

# Alpha Vantage API Key
API_KEY = "IHDYRNRR617IDRWQ"  # Replace with your actual API key

# Function to fetch historical stock data
def get_stock_data(symbol):
    ts = TimeSeries(key=API_KEY, output_format="pandas")
    data, meta_data = ts.get_daily(symbol=symbol, outputsize="full")
    df = data[['4. close']].iloc[::-1]  # Reverse to oldest-first order
    return df

# Fetch stock data
symbol = "AAPL"  
df = get_stock_data(symbol)

# Normalize the data
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(df)

# Prepare training data
X_train, y_train = [], []
time_step = 50  # Use last 50 days to predict the next day

for i in range(time_step, len(scaled_data)):
    X_train.append(scaled_data[i-time_step:i, 0])
    y_train.append(scaled_data[i, 0])

X_train, y_train = np.array(X_train), np.array(y_train)
X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

# Build LSTM Model
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(time_step, 1)),
    LSTM(50, return_sequences=False),
    Dense(25),
    Dense(1)
])

# Compile the Model
model.compile(optimizer="adam", loss="mean_squared_error")

# Train the Model
model.fit(X_train, y_train, batch_size=16, epochs=50)

# Save the trained model
model.save("lstm_model.h5")
print("✅ Model trained and saved as 'lstm_model.h5'")
