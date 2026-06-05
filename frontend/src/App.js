import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000";

function App() {
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [result, setResult] = useState(null);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadDashboard();
    loadTransactions();
  }, []);

  const loadDashboard = async () => {
    const res = await fetch(`${API_URL}/dashboard-stats`);
    const data = await res.json();
    setStats(data);
  };

  const loadTransactions = async () => {
    const res = await fetch(`${API_URL}/transactions`);
    const data = await res.json();
    setTransactions(data);
  };

  const checkFraud = async () => {
    const features = Array(29).fill(0);
    features.push(Number(amount));

    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }),
    });

    const data = await res.json();

    setResult(data);

    loadDashboard();
    loadTransactions();
  };

  return (
    <div className="container">

      <h1 className="title">
        Credit Card Fraud Detection System
      </h1>

      <div className="stats-grid">

        <div className="card">
          <h3>Total Transactions</h3>
          <p>{stats.dataset_transactions}</p>
        </div>

        <div className="card fraud">
          <h3>Fraud Transactions</h3>
          <p>{stats.dataset_frauds}</p>
        </div>

        <div className="card legit">
          <h3>Legitimate</h3>
          <p>{stats.dataset_legitimate}</p>
        </div>

        <div className="card accuracy">
          <h3>Accuracy</h3>
          <p>{stats.accuracy}%</p>
        </div>

      </div>

      <div className="predict-box">

        <h2>Check Transaction</h2>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={checkFraud}>
          Analyze Transaction
        </button>

        {result && (
          <div
            className={
              result.prediction === "Fraud"
                ? "result fraud-result"
                : "result legit-result"
            }
          >
            <h3>{result.prediction}</h3>

            <p>
              Amount: ₹{result.amount}
            </p>

            <p>
              Fraud Probability:
              {result.fraud_probability}%
            </p>

            <p>
              Risk Level:
              {result.risk_level}
            </p>
          </div>
        )}

      </div>

      <div className="table-box">

        <h2>Recent Transactions</h2>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Prediction</th>
              <th>Probability</th>
              <th>Risk</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>₹{item.amount}</td>
                <td>{item.prediction}</td>
                <td>{item.fraud_probability}%</td>
                <td>{item.risk_level}</td>
                <td>{item.created_at}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;