// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please fill in both username and password');
      return;
    }
    onLogin({ username });
    navigate('/home');
  };

  return (
    <div className="loginpage">
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-overlay">
        <h1 className="login-heading">Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            placeholder="Your Name"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            placeholder="Put some random password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">
            <span className="login-text">
              {Array.from("Login").map((letter, index) => (
                <span key={index} className="letter">
                  {letter}
                </span>
              ))}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
