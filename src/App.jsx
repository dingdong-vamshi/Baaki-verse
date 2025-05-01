// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TripPage from './components/TripPage';
import LandingPage from './components/LandingPage';  // Import Landing Page

function App() {
  const [user, setUser] = useState(null); 
  const [trip, setTrip] = useState(null);
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />  {/* Route to Landing Page */}
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />  {/* Route to Login Page */}
        <Route path="/home" element={<HomePage user={user} onCreateTrip={setTrip} />} />  {/* Route to HomePage */}
        <Route path="/trip" element={<TripPage trip={trip} />} />  {/* Route to Trip Page */}
      </Routes>
    </Router>
  );
} 

export default App;
