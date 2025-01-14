import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

// Import images
import spinWheelImage from "../assets/spin-wheel.png";
import cardGameImage from "../assets/card-game.png";
import diceGameImage from "../assets/dice-game.png";

const SelectionPage = () => {
  const [gamePlayed, setGamePlayed] = useState(false); 
  const [isTokenValid, setIsTokenValid] = useState(false); // Track if token is present

  // Check localStorage for token and game played status
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token
    const playedGame = localStorage.getItem("playedGame"); // Retrieve game played status
    
    if (token) {
      setIsTokenValid(true); // Token is present, user is valid
      if (playedGame) {
        setGamePlayed(true); // If a game is played, update the state
      }
    } else {
      setIsTokenValid(false); // If token is not present, invalidate the user
    }
  }, []);

  // If token is not present, display invalid user message
  if (!isTokenValid) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgba(60, 44, 60, 0.6)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#F7E9C8",
            fontWeight: "bold",
            fontSize: "2.5rem",
          }}
        >
          Invalid User. Please log in to access the games.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        margin: 2,
        backgroundColor: "rgba(60, 44, 60, 0.6)", // Outer container with more transparency
        borderRadius: "16px", // Rounded corners for the outer container
        boxShadow: 3, // Optional: Adds shadow for more contrast
        border: "4px solid #b59e87", // Border for the outer container
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#F7E9C8", // Slightly different shade of #FDF8E2
          fontWeight: "bold", // Bold font style
          fontSize: "2.5rem", // Larger font size
        }}
      >
        Select a Game
      </Typography>

      {/* Cards Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          width: "100%",
          maxWidth: 800,
          marginTop: 3, // Increased gap between the title and the cards container
        }}
      >
        {/* Spin Wheel Card */}
        <Card
          sx={{
            width: 200,
            cursor: gamePlayed ? "not-allowed" : "pointer",
            transition: "transform 0.2s",
            backgroundColor: "rgba(60, 44, 60, 0.8)", // Cards with less transparency
            borderRadius: 2,
            border: "2px solid #b59e87", // Border for each card
            "&:hover": !gamePlayed ? { transform: "scale(1.05)" } : {},
          }}
          component={Link}
          to="/spin-wheel"
          style={{ textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            height="140"
            image={spinWheelImage}
            alt="Spin Wheel Game"
          />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ textDecoration: "none", color: "#FDF8E2" }}>
              Tasty Wheel
            </Typography>
          </CardContent>
        </Card>

        {/* Card Game */}
        <Card
          sx={{
            width: 200,
            cursor: gamePlayed ? "not-allowed" : "pointer",
            transition: "transform 0.2s",
            backgroundColor: "rgba(60, 44, 60, 0.8)", // Same color for all cards
            borderRadius: 2,
            border: "2px solid #b59e87", // Border for each card
            "&:hover": !gamePlayed ? { transform: "scale(1.05)" } : {},
          }}
          component={Link}
          to="/card-game"
          style={{ textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            height="140"
            image={cardGameImage}
            alt="Card Game"
          />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ textDecoration: "none", color: "#FDF8E2" }}>
              Lucky Card
            </Typography>
          </CardContent>
        </Card>

        {/* Dice Game */}
        <Card
          sx={{
            width: 200,
            cursor: gamePlayed ? "not-allowed" : "pointer",
            transition: "transform 0.2s",
            backgroundColor: "rgba(60, 44, 60, 0.8)", // Same color and transparency for all game cards
            borderRadius: 2,
            border: "2px solid #b59e87", // Border for each card
            "&:hover": !gamePlayed ? { transform: "scale(1.05)" } : {},
          }}
          component={Link}
          to="/dice-game"
          style={{ textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            height="140"
            image={diceGameImage}
            alt="Dice Game"
          />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ textDecoration: "none", color: "#FDF8E2" }}>
              Dice & Dine
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Description Text */}
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          marginTop: 2,
          color: "#FDF8E2",
          fontSize: "1.2rem",
        }}
      >
        Choose any one game and get 1 chance to play.
      </Typography>
    </Box>
  );
};

export default SelectionPage;
