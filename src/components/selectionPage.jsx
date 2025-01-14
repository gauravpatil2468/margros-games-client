import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

// Import images
import spinWheelImage from "../assets/spin-wheel.png";
import cardGameImage from "../assets/card-game.png";
import diceGameImage from "../assets/dice-game.png";

const SelectionPage = () => {
  const [gamePlayed, setGamePlayed] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false); // Track if userToken is present

  // Check localStorage for userToken and game played status
  useEffect(() => {
    const userToken = localStorage.getItem("userToken"); // Retrieve userToken
    const playedGame = localStorage.getItem("playedGame"); // Retrieve game played status

    // Check if userToken is present and if a game has been played
    if (userToken) {
      setIsTokenValid(true); // userToken is present, user is valid
      setGamePlayed(playedGame === "true"); // If playedGame is "true", user has played
    } else {
      setIsTokenValid(false); // If userToken is not present, invalidate the user
    }
  }, []);

  // If userToken is not present, display invalid user message
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
        border: "4px solid #b59e87",
        height:"auto",
        "@media (max-width: 400px)": {
      width: "90%", // Set width to 90% for small screens
      height: "auto", // Allow the height to adjust based on content
      marginTop: "15vh", // Add extra space at the top
      marginBottom: "15vh", // Add extra space at the bottom
      padding: 1, // Reduce padding for smaller screens
    },
    "@media (max-width: 600px)": {
      width: "90%", // Set width to 90% for smaller devices
      height: "auto", // Automatically adjust height based on content
      marginTop: "8vh", // Adjust margin for slightly larger small screens
      marginBottom: "8vh", // Adjust margin for slightly larger small screens
    }, // Border for the outer container
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
          fontSize: "2.5rem",
          "@media (max-width: 400px)": {
     fontSize:"2rem" // Optional: Adjust padding for very small screens
    }, // Larger font size
        }}
      >
         "Select a Game"
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
          marginTop: 3,
          "@media (max-width: 400px)": {
      width: "90%", // Set width to 100px for screens smaller than 400px
      height: "auto", // Set height to 100px for screens smaller than 400px
      margin: 0, // Optional: Adjust margin for very small screens
      padding: 0, // Optional: Adjust padding for very small screens
    }, // Increased gap between the title and the cards container
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
          to={gamePlayed ? "#" : "/spin-wheel"}
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
          to={gamePlayed ? "#" : "/card-game"}
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
          to={gamePlayed ? "#" : "/dice-game"}
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
          "@media (max-width: 400px)": {
     fontSize:"0.8rem" // Optional: Adjust padding for very small screens
    }, 
        }}
      >
        {gamePlayed
          ? "Please come back tomorrow to play again."
          : "Choose any one game and get 1 chance to play."}
      </Typography>
    </Box>
  );
};

export default SelectionPage;
