import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');  
  };

  return ( 
    <div className="landing-container">
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" /> 
        Your browser does not support the video tag.
      </video>
      <div className="text-overlay">
        <p className="sub-heading">welcome to</p>
        <h1 className="main-heading">Baaki Verse</h1>
        <p className="animated-text-description">Your ultimate destination for trip-share splits!</p>
        <button className="login-button" onClick={handleLoginClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
