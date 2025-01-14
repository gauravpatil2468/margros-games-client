import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material"; // Using MUI Box for layout styling
import SelectionPage from "./components/selectionPage";
import SpinWheel from "./components/spinWheel";
import CardGame from "./components/cardGame";
import DiceGame from "./components/diceGame";
import UserForm from "./components/form";

// Import image from 'src/assets'
import backgroundImage from './assets/logo.jpg';

function App() {
  // Use useLocation hook to access the current URL query parameters
  const location = useLocation();

  useEffect(() => {
    // Extract the token from the query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store the token in localStorage for later use
      localStorage.setItem('token', token);
    }
  }, [location]); // Re-run this when the location changes (e.g., route changes)

  return (
    <Box
      sx={{
        position: "relative", // Needed for overlay positioning
        backgroundImage: `url(${backgroundImage})`, // Apply the imported background image
        backgroundSize: "cover", // Ensure the image covers the whole screen
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent repeating the image
        height: "100vh", // Full screen height
        width: "100%", // Full width
        display: "flex",
        justifyContent: "center", // Center the content horizontally
        alignItems: "center", // Center the content vertically
      }}
    >
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Selection Page Route */}
        <Route path="/home" element={<SelectionPage />} />
        
        {/* Game Routes */}
        <Route path="/spin-wheel" element={<SpinWheel />} />
        <Route path="/card-game" element={<CardGame />} />
        <Route path="/dice-game" element={<DiceGame />} />
        <Route path="/register" element={<UserForm />} />
      </Routes>
    </Box>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
