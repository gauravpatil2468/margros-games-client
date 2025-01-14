import React, { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useSpring, animated } from "react-spring"; // Import react-spring for animation
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { useEffect } from "react";


const CardGame = () => {
  const [flipped, setFlipped] = useState(false); // Track whether the card is flipped
  const [message, setMessage] = useState("");
  const [gamePlayed, setGamePlayed] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
        // Check localStorage if the game has been played
        const playedGame = localStorage.getItem("playedGame");
        if (playedGame === "true") {
          setGamePlayed(true); // Set state to true if game was played previously
        }
      },[])

  // Animation for the card flip
  const flipAnimation = useSpring({
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 300, friction: 20 }, // Custom spring configuration for a smooth flip
  });

  // Handle flipping the card
  const handleFlip = () => {
    setFlipped(!flipped);

    // 80% chance for "Better Luck Next Time" and 20% for one of the rolls
    const randomOutcome = Math.random() < 0.8 
      ? "Better Luck Next Time" 
      : Math.random() < 0.5 
        ? "Tawa Fried Chicken Roll" 
        : "Paneer Tikka Roll"; // Randomly pick one of the rolls for the 20% chance

    setMessage(randomOutcome); // Set the message
    localStorage.setItem("playedGame", "true");
    setGamePlayed(true);
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (token) {
          fetch('http://localhost:3001/api/game-played', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }), // Send the token in the request body
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Game played status updated:', data);
            })
            .catch((error) => {
              console.error('Error updating game played status:', error);
            });
        } else {
          console.log('No token found in localStorage');
        }
  };

  // Handle cancel button click to navigate to '/'
  const handleCancel = () => {
    navigate("/home"); // Navigate to the root URL
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        marginTop: 4,
        padding: 3,
        backgroundColor: "rgba(60, 44, 60, 0.6)",
        borderRadius: "16px",
        boxShadow: 3,
        border: "4px solid #b59e87",
        [theme.breakpoints.down("sm")]: {
          padding: 2,
          margin: 1,
        },
      
      }}
    >
      <Typography variant="h4" sx={{ color: "#F7E9C8" }}>
        Card Game
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 2, color: "#F7E9C8" }}>
        Flip the card and see your luck!
      </Typography>

      {/* Prizes Section - Shows before flipping */}
      {!flipped && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" sx={{ color: "#F7E9C8" }}>
            Possible Prizes:
          </Typography>
          <Box
            sx={{
              marginTop: 2,
              padding: 2,
              backgroundColor: "#f5b0b0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              color: "#000000",
              fontSize: "1rem",
            }}
          >
            Tawa Fried Chicken Roll, Paneer Tikka Roll!!
          </Box>
        </Box>
      )}

      <Box
        sx={{
          marginTop: 4,
          perspective: "1000px", // Necessary for 3D effect
        }}
      >
        <animated.div
          style={{
            ...flipAnimation, // Apply the flip animation
            width: "200px",
            height: "300px",
            margin: "0 auto",
            transformStyle: "preserve-3d", // Maintain 3D perspective
            transition: "transform 0.5s ease-in-out",
             // Smooth transition
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden", // Hide the back side during the flip
              backgroundColor: "#F7E9C8",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              color: "#000000",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {!flipped ? "Click to Flip" : ""}
          </Box>

          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden", // Hide the back side during the flip
              backgroundColor: "#f5b0b0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              color: "#000000",
              fontSize: "1.5rem",
              fontWeight: "bold",
              transform: "rotateY(180deg)", // Rotate to the back side
            }}
          >
            {flipped && message}
          </Box>
        </animated.div>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Button
          onClick={handleFlip}
          variant="contained"
          color="primary"
          sx={{
            marginRight: 2,
            backgroundColor: "#F7E9C8",
            color: "#000000",
            borderColor: "#b59e87",
            "&:hover": {
              backgroundColor: "#e0cda6",
              color: "#000000",
            },
          }}
          disabled={gamePlayed}
        >
          Flip
        </Button>
        
        {/* Cancel Button */}
        <Button
          onClick={handleCancel}
          variant="contained"
          color="secondary"
          sx={{
            marginLeft: 2,
            backgroundColor: "#F7E9C8",
            color: "#000000",
            borderColor: "#b59e87",
            "&:hover": {
              backgroundColor: "#e0cda6",
              color: "#000000",
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CardGame;
