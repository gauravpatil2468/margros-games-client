import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const SpinWheelGame = () => {
  const navigate = useNavigate();
  const wheelRef = useRef(null);
  const spinBtnRef = useRef(null);
  const [finalValue, setFinalValue] = useState("Click 'Play' to start");
  const [gamePlayed, setGamePlayed] = useState(false); // State to track if game has been played

  const rotationValues = [
    { minDegree: 0, maxDegree: 30, value: "mojito" },
    { minDegree: 31, maxDegree: 90, value: "" },
    { minDegree: 91, maxDegree: 150, value: "gulab jamun" },
    { minDegree: 151, maxDegree: 210, value: "5% off next visit" },
    { minDegree: 211, maxDegree: 270, value: "samosa chutney" },
    { minDegree: 271, maxDegree: 330, value: "" },
    { minDegree: 331, maxDegree: 360, value: "mojito" },
  ];

  const data = useMemo(() => [16, 16, 16, 16, 16, 16], []);
  const pieColors = useMemo(
    () => [
      "rgba(64, 25, 20, 0.95)",
      "rgba(54, 20, 15, 0.95)",
      "rgba(63, 23, 18, 0.95)",
      "rgba(51, 14, 9, 0.95)",
      "rgba(64, 29, 24, 0.95)",
      "rgba(54, 15, 10, 0.95)",
    ],
    []
  );

  const chartRef = useRef(null);

  useEffect(() => {
    // Check localStorage if the game has been played
    const playedGame = localStorage.getItem("playedGame");
    if (playedGame === "true") {
      setGamePlayed(true); // Set state to true if game was played previously
    }

    const chartInstance = new Chart(wheelRef.current, {
      plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: [
          "",
          "mojito",
          "",
          "samosa chutney",
          "5% off next visit",
          "gulab jamun",
        ],
        datasets: [
          {
            backgroundColor: pieColors,
            data: data,
            borderColor: "#b59e87",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: { display: false },
          datalabels: {
            color: "#ffffff",
            formatter: (value, context) => {
              const label = context.chart.data.labels[context.dataIndex];
              if (label) {
                return label.split(" ").join("\n"); // Insert line breaks between words
              }
              return "Better luck\nnext time!"; // Handle blank segments
            },
            font: {
              size: 10, // Reduced font size even further for labels to avoid overflow on small screens
            },
            align: "center",
          },
        },
      },
    });
    chartRef.current = chartInstance;

    return () => {
      chartInstance.destroy();
    };
  }, [data, pieColors]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        const message = i.value
          ? `You won ${i.value}!` // If the segment has a value
          : "Better luck next time!"; // If the segment is blank
        setFinalValue(message);
        spinBtnRef.current.disabled = false; // Enable the play button after spinning
        break;
      }
    }
  };

  let count = 0;
  let resultValue = 101;

  const handleSpin = () => {
    spinBtnRef.current.disabled = true; // Disable play button during spin
    setFinalValue("Good Luck!"); // Show message during spin

    let randomDegree;

    // 70% chance to land in blank segments (31–90 or 271–330)
    const randomChance = Math.random();
    if (randomChance < 0.75) {
      const range1 = Math.floor(Math.random() * (90 - 31 + 1)) + 31;
      const range2 = Math.floor(Math.random() * (330 - 271 + 1)) + 271;
      randomDegree = Math.random() < 0.5 ? range1 : range2;
    } else {
      // 30% chance to land outside the blank segments (0–30, 150–270, 330–360)
      do {
        randomDegree = Math.floor(Math.random() * 355); // Random value between 0 and 366 (inclusive)
      } while (
        (randomDegree >= 31 && randomDegree <= 90) ||  // Exclude range 31-90
        (randomDegree >= 271 && randomDegree <= 330)   // Exclude range 271-330
      );
    }

    // Spin the wheel with an interval to create smooth spinning animation
    const rotationInterval = setInterval(() => {
      chartRef.current.options.rotation += resultValue; // Update the wheel's rotation angle
      chartRef.current.update();

      if (chartRef.current.options.rotation >= 360) {
        count += 1;
        resultValue -= 5; // Gradually reduce the speed to slow the wheel
        chartRef.current.options.rotation = 0; // Reset rotation to prevent overflow
      }

      // Once wheel rotation gets close to the target, stop and show result
      else if (count > 15 && chartRef.current.options.rotation === randomDegree) {
        valueGenerator(randomDegree); // Update value when the wheel stops at the correct segment
        clearInterval(rotationInterval); // Stop the wheel rotation
        count = 0; // Reset count for next spin
        resultValue = 101; // Reset speed value
        // Set gamePlayed to true and store in localStorage
        localStorage.setItem("playedGame", "true");
        setGamePlayed(true); // Update game state
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
      }
    }, 10); // Interval speed for smoother animation
  };

  const handleCancel = () => {
    navigate("/home"); // Redirect to the home page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        margin: 2,
        backgroundColor: "rgba(60, 44, 60, 0.6)",
        borderRadius: "16px",
        boxShadow: 3,
        border: "4px solid #b59e87",
        minHeight: "auto",
        height: "auto",
        width: "100%", // Full width of the parent container
        maxWidth: "300px",
        "@media (max-width: 600px)": {
          width: "90%", // Shrink to 90% width for smaller screens
        },
        "@media (max-height: 500px)": {
          height: "300px", // Set height to 200px if viewport height is less than 500px
        },
      }}
    >
      <Typography variant="h4" sx={{ color: "#F7E9C8" }}>
        Spin the Wheel
      </Typography>
      <Box
        sx={{
          position: "relative",
          marginTop: 3,
          width: "90%",
          maxWidth: "400px",
          aspectRatio: "1 / 1",
          "@media (max-height: 500px)": {
          height: "150px", // Set height to 200px if viewport height is less than 500px
        },
        }}
      >
        <canvas
          ref={wheelRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: "-20px",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "20px solid #F7E9C8",
            zIndex: 10,
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ marginTop: 2, color: "#F7E9C8" }}>
        {finalValue}
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <Button
          ref={spinBtnRef}
          onClick={handleSpin}
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
          disabled={gamePlayed} // Disable if game has already been played
        >
          Play
        </Button>
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="secondary"
          sx={{
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

export default SpinWheelGame;
