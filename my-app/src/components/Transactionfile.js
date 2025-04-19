import React, { useEffect, useState } from "react";
import '../css/Transactions.css'
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/Portfolio/transactions", {
        method: "GET",
        headers: {
          "Authorization": localStorage.getItem('token'),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const downloadFile = async (format) => {
    try {
      const response = await fetch(`http://localhost:3000/Portfolio/export/${format}`, {
        method: "GET",
        headers: {
          "Authorization": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="transactions-container">
      <h2>Transaction History</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Stock</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.symbol}</td>
                <td className={txn.type === "BUY" ? "buy" : "sell"}>{txn.type}</td>
                <td>{txn.quantity}</td>
                <td>${txn.price.toFixed(2)}</td>
                <td>${(txn.quantity * txn.price).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="download-buttons">
        <button className="download-btn" onClick={() => downloadFile("csv")}>
          Download CSV
        </button>
        <button className="download-btn" onClick={() => downloadFile("pdf")}>
          Download PDF
        </button>
      </div>
    </div>
  );
}
