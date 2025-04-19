import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Signup.css'; // Import external CSS for styling

export default function Signup() {
  let navigate = useNavigate();
  const [credential, setCredential] = useState({ name: '', email: '', password: '' });

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credential;
    try {
      const response = await fetch("http://localhost:3000/api/auth/createU", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log("API Response:", json);

      if (response.ok && json.Token) {
        localStorage.setItem("token", json.Token);
        navigate("/Userstocks");
        console.log("Signup successful!");
      } else {
        console.error("Signup failed:", json);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  // Handle Input Change
  const onChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input type="text" required minLength={3} name="name" value={credential.name} id="name" onChange={onChange} />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input type="email" required minLength={3} name="email" value={credential.email} id="email" onChange={onChange} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" required minLength={3} name="password" value={credential.password} id="password" onChange={onChange} />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="signup-footer">Already have an account? <a href="/login">Log in</a></p>
      </div>
    </div>
  );
}
