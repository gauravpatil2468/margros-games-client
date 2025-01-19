import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import FeedbackComponent from './feedback'; // Import FeedbackComponent

const SpinWheelGame = () => {
  const navigate = useNavigate();
  const wheelRef = useRef(null);
  const spinBtnRef = useRef(null);
  const [finalValue, setFinalValue] = useState("Click 'Play' to start");
  const [gamePlayed, setGamePlayed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const tableName = localStorage.getItem("tableName"); // Defined here
    const winProbability = parseFloat(localStorage.getItem("winProbability") || 0.3);

  const rotationValues = useMemo(() => {
    const storedOffers = JSON.parse(localStorage.getItem("offers"));
    const spinWheelOffers = storedOffers?.spin_wheel || [];
    
     // Defined here
    
    return [
      { minDegree: 0, maxDegree: 30, value: spinWheelOffers[0] || "" },
      { minDegree: 31, maxDegree: 90, value: "" },
      { minDegree: 91, maxDegree: 150, value: spinWheelOffers[1] || "" },
      { minDegree: 151, maxDegree: 210, value: spinWheelOffers[2] || "" },
      { minDegree: 211, maxDegree: 270, value: spinWheelOffers[3] || "" },
      { minDegree: 271, maxDegree: 330, value: "" },
      { minDegree: 331, maxDegree: 360, value: spinWheelOffers[0] || "" },
    ];
  }, []);

  const labels = useMemo(() => {
    const storedOffers = JSON.parse(localStorage.getItem("offers"));
    const spinWheelOffers = storedOffers?.spin_wheel || [];

    return [
      "",
      spinWheelOffers[0] || "",
      "",
      spinWheelOffers[1] || "",
      spinWheelOffers[2] || "",
      spinWheelOffers[3] || "",
    ];
  }, []);

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
    const playedGame = localStorage.getItem("playedGame");
    if (playedGame === "true") {
      setGamePlayed(true);
    }

    const chartInstance = new Chart(wheelRef.current, {
      plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: labels,
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
                return label.split(" ").join("\n");
              }
              return "Better luck\nnext time!";
            },
            font: {
              size: 10,
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
  }, [data, pieColors, labels]);

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
          ? `You won ${i.value}!`
          : "Better luck next time!";
        setFinalValue(message);
        spinBtnRef.current.disabled = false;
        setShowFeedback(true);
        break;
      }
    }
  };

  let count = 0;
  let resultValue = 101;

  const handleSpin = () => {
    spinBtnRef.current.disabled = true;
    setFinalValue("Good Luck!");

    let randomDegree;

    // Use dynamic winProbability to calculate chances
   // Define winProbability here
    const randomChance = Math.random();
    if (randomChance < winProbability) {
      do {
        randomDegree = Math.floor(Math.random() * 355);
      } while (
        (randomDegree >= 31 && randomDegree <= 90) ||
        (randomDegree >= 271 && randomDegree <= 330)
      );
    } else {
      const range1 = Math.floor(Math.random() * (90 - 31 + 1)) + 31;
      const range2 = Math.floor(Math.random() * (330 - 271 + 1)) + 271;
      randomDegree = Math.random() < 0.5 ? range1 : range2;
    }

    const rotationInterval = setInterval(() => {
      chartRef.current.options.rotation += resultValue;
      chartRef.current.update();

      if (chartRef.current.options.rotation >= 360) {
        count += 1;
        resultValue -= 5;
        chartRef.current.options.rotation = 0;
      } else if (count > 15 && chartRef.current.options.rotation === randomDegree) {
        valueGenerator(randomDegree);
        clearInterval(rotationInterval);
        count = 0;
        resultValue = 101;
        localStorage.setItem("playedGame", "true");
        setGamePlayed(true);
        const token = localStorage.getItem('userToken');
        if (token) {
          fetch('https://margros-games-server.onrender.com/api/game-played', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, tableName }),
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
    }, 10);
  };

  const handleCancel = () => {
    navigate("/home");
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
        width: "100%",
        maxWidth: "300px",
        marginLeft: "auto",
        marginRight: "auto",
        "@media (max-width: 600px)": {
          width: "90%",
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
            height: "150px",
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
          disabled={gamePlayed}
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

      {showFeedback && <FeedbackComponent />}
    </Box>
  );
};

export default SpinWheelGame
