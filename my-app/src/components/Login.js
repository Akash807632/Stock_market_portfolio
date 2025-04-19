import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/Login.css"; // ✅ Import dark-themed CSS

export default function Login() {
  let navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credential, setCredential] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      const json = await response.json();
      console.log("API Response:", json);

      if (response.ok && json.Token) {
        localStorage.setItem("token", json.Token);
        setIsAuthenticated(true);
        navigate("/Userstocks");
      } else {
        console.error("Login failed:", json);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to access your Stock Portfolio</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email address</label>
            <input type="email" name="email" value={credential.email} onChange={(e) => setCredential({ ...credential, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={credential.password} onChange={(e) => setCredential({ ...credential, password: e.target.value })} required />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="signup-link">Don't have an account? <a href="/Signup">Sign up</a></p>
      </div>
    </div>
  );
}
