import React, { useState, ThemeProvider } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";

import { createTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
function Login() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [timeTableData, setTimeTableData] = useState([]);
  const dayOfMonth = new Date().getDate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      //   toast.warn("Logging in...");
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
        sessionStorage.setItem("pin", response.data.response.string10);

        const apiUrl =
          "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";
        // const tturl =
        //   "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent";

        const fetchTimeTableData = async (date) => {
          const token = sessionStorage.getItem("token");
          const url =
            "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent";

          try {
            const response = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data?.response?.data) {
              const filteredData = response.data.response.data
                .filter((row) => row[`c${dayOfMonth}`] && row.course_name)
                .map((item) => ({
                  ...item,
                  timeText: new DOMParser().parseFromString(
                    item[`c${dayOfMonth}`],
                    "text/html"
                  ).body.textContent,
                }));
              sessionStorage.setItem(
                "timeTableData",
                JSON.stringify(filteredData)
              );
              setTimeTableData(filteredData);
            }
          } catch (error) {
            console.error("Failed to fetch time table:", error);
          }
        };

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
        await fetchTimeTableData();
        toast.success("Login successful!");
        navigate("/dashboard");

        await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:T29bdBNk/user",
          { username: username, password: password }
        );
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response.data.msg || "Login error!");
    }
  };
  const handleForgotPassword = async () => {
    console.log("Admission Number for password reset:", admissionNumber);

    if (!admissionNumber) {
      toast.error("Please enter your admission number.");
      return;
    }

    try {
      const response = await axios.patch(
        "https://abes.platform.simplifii.com/api/v1/forgotpassword",
        {
          username: admissionNumber,
          reset_password_base_url:
            "https://abes.web.simplifii.com/reset_password.php",
        }
      );

      if (response.data && response.data.msg) {
        toast.success(response.data.msg);
      } else {
        toast.error("Unknown error occurred.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error("Enter Valid Admission Number");
      } else {
        toast.error("Failed to send password reset link.");
      }
    }

    setDialogOpen(false); // Close dialog after submission
  };
  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Made With ❤️ by  "}
        <Link color="inherit" href="https://github.com/starlordamit">
          Amit
        </Link>{" "}
        {"."}
      </Typography>
    );
  }

  const defaultTheme = createTheme();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          gutterBottom
          component="div"
          textAlign="center"
          fontSize={24}
          fontWeight={600}
          color={"primary"}
          fontFamily={"Sedan SC"}
        >
          ABES Information Management System
        </Typography>
        <Typography component="h1" variant="h6">
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
          <Button
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="forgot-password-dialog-title"
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "10px", // Rounded corners for a more modern look
            boxShadow: 24, // Subtle shadow to give depth
          },
        }}
      >
        <DialogTitle
          id="forgot-password-dialog-title"
          sx={{
            bgcolor: "primary.main",
            color: "common.white",
            textAlign: "center", // Center-align the title
          }}
        >
          Forgot Password
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "16px 24px",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            sx={{
              marginBottom: "8px",
              textAlign: "center", // Center-align the text
            }}
          >
            Enter your admission number to reset your password.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="admissionNumber"
            label="Admission Number"
            type="text"
            fullWidth
            variant="outlined"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            sx={{
              marginBottom: "16px",
              backgroundColor: "background.paper", // Light background for contrast
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            justifyContent: "center", // Center-align the buttons
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            color="error"
            variant="contained"
            sx={{
              marginRight: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            color="primary"
            variant="contained"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

export default Login;
