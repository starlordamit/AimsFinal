import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function UserDetailsDialog({ open, handleClose, userDetails }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Sample data for the subjects
  const attendanceData = {
    labels: ["Mathematics", "Science", "English", "Total"],
    datasets: [
      {
        label: "Attendance Percentage",
        data: [85, 65, 90, 80], // Example attendance data
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set y-axis max to 100 for percentage
        ticks: {
          callback: function (value) {
            return value + "%"; // Append percentage sign to y-axis ticks
          },
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 75,
            yMax: 75,
            borderColor: "red",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: "Minimum required (75%)",
              enabled: true,
              position: "end",
              backgroundColor: "rgba(255, 99, 132, 0.75)",
            },
          },
        },
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        User Details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ p: 2, bgcolor: "#f3f6f9" }}>
          {/* Existing content remains here */}
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#1976d2", mt: 2 }}
          >
            Attendance Chart
          </Typography>
          <Bar data={attendanceData} options={options} />
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailsDialog;
