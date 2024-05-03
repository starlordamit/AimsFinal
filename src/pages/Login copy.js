import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CssBaseline,
} from "@mui/material";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://abes.platform.simplifii.com/api/v1/admin/authenticate",
        {
          username: username,
          password: password,
        }
      );
      if (response.data.status === 1) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userDetails", JSON.stringify(response.data));

        const apiUrl =
          "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";

        const fetchData = async () => {
          const token = sessionStorage.getItem("token");
          if (!token) {
            navigate("/login");
            return;
          }

          try {
            const response = await fetch(apiUrl, {
              headers: new Headers({
                Authorization: `Bearer ${token}`,
              }),
            });
            const json = await response.json();

            //   setData(json.response.data); // Adjust according to actual API response structure
            sessionStorage.setItem("data", JSON.stringify(json.response.data));
          } catch (error) {
            console.error("Failed to fetch data:", error);
            navigate("/login"); // Redirect to login on failure
          }
        };

        // Store the entire response for user details
        console.log("User details:");
        await fetchData();
        navigate("/dashboard");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
