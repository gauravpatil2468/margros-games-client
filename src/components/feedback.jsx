import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const FeedbackComponent = () => {
  const [rating, setRating] = useState(0); // Tracks the selected star rating

  // Handle star click
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // Handle submit
  const handleSubmit = () => {
    // Get userToken from localStorage
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    // Prepare the request data
    const requestData = {
      token: userToken,  // Use userToken instead of token
      rating: rating,    // Send the rating as an integer
    };

    // Make the POST request to submit feedback
    fetch("https://margros-games-server.onrender.com/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Thank you for your feedback! You rated: ${rating} stars.`);
        // Handle successful submission (optional, e.g., reset state, redirect, etc.)
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        alert("An error occurred while submitting your feedback.");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Adjusted to column for stacked layout
        justifyContent: "center",
        alignItems: "center",
        padding: 1, // Reduced padding
        margin: 1,  // Reduced margin
        backgroundColor: "rgba(60, 44, 60, 0.8)",
        borderRadius: "16px",
        border: "4px solid #b59e87",
        boxShadow: 3,
        width: "100%",
        maxWidth: 500, // Max width for container
        "@media (max-width: 400px)": {
          width: "90%", // Set width to 90% for smaller screens
          height: "auto",
        },
      }}
    >
      {/* Rating Title */}
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          color: "#FDF8E2",
          marginBottom: 0.5, // Reduced margin for compactness
          fontSize: { xs: "14px", sm: "16px" }, // Adjusted font size for smaller screens
        }}
      >
        Rate Your Experience
      </Typography>

      {/* Star Rating and Submit Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.2, // Reduced gap between stars and button
        }}
      >
        {[...Array(5)].map((_, index) => (
          <IconButton
            key={index}
            onClick={() => handleStarClick(index)}
            sx={{
              color: index < rating ? "#FFD700" : "#b59e87", // Gold for selected stars
              fontSize: { xs: "30px", sm: "35px", md: "40px" }, // Adjust star size based on screen size
            }}
          >
            {index < rating ? <Star /> : <StarBorder />}
          </IconButton>
        ))}
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#b59e87",
            "&:hover": {
              backgroundColor: "#F7E9C8",
            },
            fontSize: "12px", // Smaller text size for compact layout
            padding: "6px 10px", // Adjusted padding
            marginLeft: 1, // Added small left margin to create space between stars and button
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default FeedbackComponent;
