import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { blue } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icon for time

function TimeTable() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeTableData, setTimeTableData] = useState([]);

  useEffect(() => {
    fetchTimeTableData(selectedDate);
  }, [selectedDate]);

  const getTimeFromString = (data) => {
    if (typeof data === "string") {
      const matches = data.match(/\d{2}:\d{2}/);
      return matches ? matches[0] : undefined;
    }
    return undefined;
  };

  const fetchTimeTableData = async (date) => {
    const dayOfMonth = date.getDate();
    const token = sessionStorage.getItem("token");
    const url =
      "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent";

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (
        response.data &&
        response.data.response &&
        response.data.response.data
      ) {
        const filteredData = response.data.response.data
          .filter((row) => row[`c${dayOfMonth}`] && row.course_name)
          .map((item) => ({
            ...item,
            [`c${dayOfMonth}`]: stripHtml(item[`c${dayOfMonth}`]),
          }))
          .sort((a, b) => a.course_name.localeCompare(b.course_name));
        setTimeTableData(filteredData);
      }
    } catch (error) {
      console.error("Failed to fetch time table:", error);
    }
  };

  // Utility function to remove HTML tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", ,];

  const handleWeekdayChange = (dayIndex) => {
    const today = new Date();
    const currentWeekday = today.getDay();
    const targetWeekday = dayIndex + 1;

    const difference = targetWeekday - currentWeekday;
    const newDate = new Date(today.setDate(today.getDate() + difference));
    setSelectedDate(newDate);
  };

  return (
    <Box sx={{ maxWidth: 650, mx: "auto", mr: 1 }}>
      <Typography
        variant="h1"
        gutterBottom
        component="div"
        textAlign="center"
        fontSize={14}
      >
        Time Table for {selectedDate.toDateString()}
      </Typography>
      <Paper
        elevation={5}
        sx={{
          mb: 1,
          p: 0,
          display: "inline-block",
          alignContent: "center",
          width: "100%",
          textAlign: "center",
        }}
      >
        {weekdays.map((day, index) => (
          <Button
            key={day}
            onClick={() => handleWeekdayChange(index)}
            sx={{
              m: 0.5,
              borderBottom:
                selectedDate.getDay() === index + 1
                  ? `2px solid ${blue[500]}`
                  : "none",
            }}
          >
            {selectedDate.getDay() === index + 1 ? day.slice(0, 3) : day[0]}
          </Button>
        ))}
        {/* <Typography
          variant="h6"
          gutterBottom
          component="div"
          textAlign="center"
          fontSize={14}
        >
          Time Table for {selectedDate.toDateString()}
        </Typography> */}
      </Paper>
      <List sx={{ bgcolor: "background.paper" }}>
        {timeTableData
          .filter((item) => item[`c${selectedDate.getDate()}`])
          .sort((a, b) => {
            const timeA = getTimeFromString(a[`c${selectedDate.getDate()}`]);
            const timeB = getTimeFromString(b[`c${selectedDate.getDate()}`]);
            return (timeA || "").localeCompare(timeB || "");
          })
          .map((item, index) => {
            const key = item.cf_id
              ? `${item.cf_id}-${item.course_id || index}`
              : `fallback-${index}`;
            // console.log(`Rendering item with key: ${key}`);

            return (
              <ListItem key={key}>
                <ListItemIcon>
                  <path
                    fill="currentColor"
                    d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                  />
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.course_name.split("/")[2]}
                  secondary={
                    <>
                      {item.faculty_name}
                      <br />
                      {new DOMParser()
                        .parseFromString(
                          item[`c${selectedDate.getDate()}`],
                          "text/html"
                        )
                        .body.textContent.slice(0, 13)}
                      {"  "}
                      {new DOMParser()
                        .parseFromString(
                          item[`c${selectedDate.getDate()}`],
                          "text/html"
                        )
                        .body.textContent.slice(13)}
                    </>
                  }
                  primaryTypographyProps={{ component: "div" }}
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
}

export default TimeTable;
