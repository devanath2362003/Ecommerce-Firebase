import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./Fireconfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email Login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate("/posts"); 
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Google login successful");
      navigate("/posts"); // 
    } catch (error) {
      alert("Google login error: " + error.message);
    }
  };

  return (
    <div className="login-container">
  <h2>Login</h2>
  <input
    type="email"
    className="login-input"
    placeholder="Enter Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    type="password"
    className="login-input"
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button className="login-button" onClick={handleEmailLogin}>
    Login with Email
  </button>
  <button className="login-button google-button" onClick={handleGoogleLogin}>
    Login with Google
  </button>
</div>

  );
};

export default Login;
