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

const TimeTable = () => {
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

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleWeekdayChange = (dayIndex) => {
    const today = new Date();
    const currentWeekday = today.getDay();
    const targetWeekday = dayIndex + 1;
    const difference = targetWeekday - currentWeekday;
    const newDate = new Date(today.setDate(today.getDate() + difference));
    setSelectedDate(newDate);
  };

  const isCurrentOrConsecutiveClass = (timeString) => {
    const utcCurrentTime = new Date();
    const currentTime = utcCurrentTime;

    const timeSlots = timeString.match(/\d{2}:\d{2} - \d{2}:\d{2}/g);
    if (!timeSlots) return false;

    return timeSlots.some((slot) => {
      const [startTimeString, endTimeString] = slot.split(" - ");
      const [startHours, startMinutes] = startTimeString.split(":").map(Number);
      const [endHours, endMinutes] = endTimeString.split(":").map(Number);

      const startTime = new Date(currentTime);
      startTime.setHours(startHours, startMinutes, 0, 0);

      const endTime = new Date(currentTime);
      endTime.setHours(endHours, endMinutes, 0, 0);

      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  const renderTimeTableList = () => {
    return timeTableData
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

        return (
          <ListItem
            key={key}
            sx={{
              backgroundColor: isCurrentOrConsecutiveClass(
                new DOMParser().parseFromString(
                  item[`c${selectedDate.getDate()}`],
                  "text/html"
                ).body.textContent
              )
                ? "#FFB5A1"
                : "transparent",
            }}
          >
            <ListItemIcon>
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
      });
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <Box sx={{ maxWidth: 650, mx: "auto", mr: 1 }}>
      <Typography
        variant="h1"
        gutterBottom
        component="div"
        textAlign="center"
        fontWeight={400}
        fontSize={24}
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
      </Paper>
      <List sx={{ bgcolor: "background.paper" }}>{renderTimeTableList()}</List>
    </Box>
  );
};

export default TimeTable;
