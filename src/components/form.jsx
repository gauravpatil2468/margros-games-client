import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation and location

const UserForm = () => {
  const [message, setMessage] = useState(""); // State for displaying response messages
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Get location object from react-router
  const searchParams = new URLSearchParams(location.search);
  const restaurantName = searchParams.get("restaurantName"); // Extract restaurantName from query

  // Helper function to check if a date is today's date
  const isToday = (dateString) => {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds

    const todayUTC = new Date();
    const inputUTC = new Date(dateString);

    // Convert both dates to IST by adding the offset
    const todayIST = new Date(todayUTC.getTime() + IST_OFFSET);
    const inputIST = new Date(inputUTC.getTime() + IST_OFFSET);

    // Compare IST components
    return (
      todayIST.getFullYear() === inputIST.getFullYear() &&
      todayIST.getMonth() === inputIST.getMonth() &&
      todayIST.getDate() === inputIST.getDate()
    );
  };

  // Formik form initialization and validation schema
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email format")
        .notRequired(), // Email is optional
    }),
    onSubmit: async (values) => {
      setMessage(""); // Reset message on form submission

      try {
        const response = await fetch(
          `https://margros-games-server.onrender.com/api/register?restaurantName=${restaurantName}`, // Pass restaurantName in the query
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              phone: values.phone,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "An unexpected error occurred.");
        } else {
          const { token, latestPlayedTimestamp, offers, tableName, winProbability } = data;

          // Store the token and other response data in localStorage
          localStorage.setItem("userToken", token);
          localStorage.setItem("latestPlayedTimestamp", latestPlayedTimestamp);
          localStorage.setItem("offers", JSON.stringify(offers)); // Save as string
          localStorage.setItem("tableName", tableName);
          localStorage.setItem("winProbability", winProbability);

          // Check if latestPlayedTimestamp exists and is today's date
          if (latestPlayedTimestamp && isToday(latestPlayedTimestamp)) {
            localStorage.setItem("playedGame", "true");
          } else {
            localStorage.setItem("playedGame", "false");
          }

          // Redirect to /home
          navigate("/home");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred while registering the user.");
      }
    },
  });

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
        maxWidth: "400px",
        "@media (max-width: 600px)": {
          width: "90%",
        },
      }}
    >
      <Typography variant="h4" sx={{ color: "#F7E9C8" }}>
        Enter Details
      </Typography>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            InputProps={{
              style: { color: "#F7E9C8" },
            }}
            InputLabelProps={{
              style: { color: "#F7E9C8" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#F7E9C8",
                },
                "&:hover fieldset": {
                  borderColor: "#F7E9C8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#F7E9C8",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            InputProps={{
              style: { color: "#F7E9C8" },
            }}
            InputLabelProps={{
              style: { color: "#F7E9C8" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#F7E9C8",
                },
                "&:hover fieldset": {
                  borderColor: "#F7E9C8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#F7E9C8",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              style: { color: "#F7E9C8" },
            }}
            InputLabelProps={{
              style: { color: "#F7E9C8" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#F7E9C8",
                },
                "&:hover fieldset": {
                  borderColor: "#F7E9C8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#F7E9C8",
                },
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
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
          Submit
        </Button>

        {message && (
          <Typography variant="body2" sx={{ color: "#e57373", marginTop: 2 }}>
            {message}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default UserForm;
