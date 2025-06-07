import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "./Fireconfig";
import './Signup.css';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! Please login.");
      navigate("/login");  // Navigate to Login page
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Google signup successful!");
      navigate("/login");  // Navigate after Google signup too
    } catch (error) {
      alert("Google signup error: " + error.message);
    }
  };

  return (
    <div className="signupbg">

   
    <div className="signup-container">
  <h2>Signup</h2>
  <input
    type="email"
    className="signup-input"
    placeholder="Enter Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    type="password"
    className="signup-input"
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button className="signup-button" onClick={handleEmailSignup}>
    Signup with Email
  </button>
  <button className="signup-button google-button" onClick={handleGoogleSignup}>
    Signup with Google
  </button>
  <Link to="/login">
                    Already Signup 
                  </Link>
</div>
 </div>
  );
};

export default Signup;
