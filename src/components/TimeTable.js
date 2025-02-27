import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Spin,
  Button,
  Divider,
  Timeline,
  Empty,
  Tag,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import customParseFormat from "dayjs/plugin/customParseFormat"; // Import customParseFormat plugin
import "./TimeTable.css"; // Import custom CSS for styling

dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.extend(customParseFormat); // Extend dayjs with customParseFormat

const { Content } = Layout;
const { Title, Text } = Typography;

function TimeTable() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [timeTableData, setTimeTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeTableData(selectedDate);
  }, [selectedDate]);

  const fetchTimeTableData = async (date) => {
    setLoading(true);
    const dayOfMonth = date.date();
    const token = localStorage.getItem("token");
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
          .filter((row) => {
            const lectureInfo = row[`c${dayOfMonth}`];
            return lectureInfo && row.course_name && hasValidTime(lectureInfo);
          })
          .map((item) => {
            const rawText = stripHtml(item[`c${dayOfMonth}`]);
            // Extract time slots
            const timeSlots = extractTimeSlots(rawText);
            // Convert time slots to 12-hour format
            const formattedTimeSlots = timeSlots.map((slot) =>
              convertTo12HourFormat(slot)
            );
            // Extract additional info (if any)
            const additionalInfo = rawText
              .replace(/\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/g, "")
              .trim();
            return {
              ...item,
              timeSlots,
              formattedTimeSlots,
              additionalInfo,
            };
          })
          .sort((a, b) => {
            const timeA = getTimeFromString(a.timeSlots[0]);
            const timeB = getTimeFromString(b.timeSlots[0]);
            return timeA.localeCompare(timeB);
          });
        setTimeTableData(filteredData);
      } else {
        setTimeTableData([]);
      }
    } catch (error) {
      console.error("Failed to fetch time table:", error);
      setTimeTableData([]);
    }
    setLoading(false);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    // Insert space between concatenated time slots
    return text.replace(
      /(\d{2}:\d{2}\s*-\s*\d{2}:\d{2})(?=\d{2}:\d{2}\s*-\s*\d{2}:\d{2})/g,
      "$1 "
    );
  };

  const hasValidTime = (text) => {
    // Check if text contains at least one valid time slot in HH:MM - HH:MM format
    return /\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/.test(text);
  };

  const extractTimeSlots = (text) => {
    // Extract all time slots from the text
    return text.match(/\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/g) || [];
  };

  const convertTo12HourFormat = (timeRange) => {
    const [startTime, endTime] = timeRange.split("-");
    const startTimeFormatted = dayjs(startTime.trim(), "HH:mm").format(
      "h:mm A"
    );
    const endTimeFormatted = dayjs(endTime.trim(), "HH:mm").format("h:mm A");
    return `${startTimeFormatted} - ${endTimeFormatted}`;
  };

  const getTimeFromString = (timeRange) => {
    const [startTime] = timeRange.split("-");
    return startTime.trim();
  };

  const handleDateChange = (direction) => {
    let newDate = selectedDate.add(direction, "day");
    // Skip weekends
    while (newDate.day() === 0 || newDate.day() === 6) {
      newDate = newDate.add(direction, "day");
    }
    setSelectedDate(newDate);
  };

  const getClassStatus = (item) => {
    const currentTime = dayjs();

    const { timeSlots } = item;
    if (!timeSlots || timeSlots.length === 0) {
      return "unknown";
    }

    // Parse all start and end times
    let startTimes = [];
    let endTimes = [];

    timeSlots.forEach((slot) => {
      const [startTimeString, endTimeString] = slot.split("-");
      const startTime = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${startTimeString.trim()}`,
        "YYYY-MM-DD HH:mm"
      );
      const endTime = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${endTimeString.trim()}`,
        "YYYY-MM-DD HH:mm"
      );
      startTimes.push(startTime);
      endTimes.push(endTime);
    });

    const earliestStartTime = dayjs.min(startTimes);
    const latestEndTime = dayjs.max(endTimes);

    if (currentTime.isBefore(earliestStartTime)) {
      return "upcoming";
    } else if (currentTime.isAfter(latestEndTime)) {
      return "completed";
    } else {
      return "ongoing";
    }
  };

  const renderTimeTable = () => {
    return (
      <Timeline mode="left">
        {timeTableData.map((item, index) => {
          const status = getClassStatus(item);

          // Choose icon based on status
          let icon;
          if (status === "completed") {
            icon = (
              <CheckCircleOutlined
                style={{ fontSize: "16px", color: "green" }}
              />
            );
          } else if (status === "ongoing") {
            icon = (
              <ClockCircleOutlined style={{ fontSize: "16px", color: "red" }} />
            );
          } else {
            icon = (
              <ClockCircleOutlined
                style={{ fontSize: "16px", color: "blue" }}
              />
            );
          }

          return (
            <Timeline.Item
              key={index}
              dot={icon}
              color={
                status === "ongoing"
                  ? "red"
                  : status === "completed"
                  ? "green"
                  : "blue"
              }
            >
              <div className="timeline-item-content">
                <Text strong>{item.course_name.split("/")[2]}</Text>
                <br />
                <Text>{item.faculty_name}</Text>
                <br />
                {/* Display time slots as box-type tags in 12-hour format */}
                <div className="time-slots">
                  {item.formattedTimeSlots.map((slot, idx) => (
                    <Tag color="blue" key={idx}>
                      {slot}
                    </Tag>
                  ))}
                </div>
                {item.additionalInfo && (
                  <>
                    <br />
                    <Text>{item.additionalInfo}</Text>
                  </>
                )}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  };

  return (
    <Layout className="layout">
      <Content className="content">
        <Title level={3} className="title">
          Timetable
        </Title>
        <div className="stepper">
          <Button
            icon={<LeftOutlined />}
            onClick={() => handleDateChange(-1)}
          />
          <Text className="date-text">
            {selectedDate.format("dddd, MMMM D, YYYY")}
          </Text>
          <Button
            icon={<RightOutlined />}
            onClick={() => handleDateChange(1)}
          />
        </div>
        <Divider />
        {loading ? (
          <div className="loading-container">
            <Spin tip="Loading..." size="large" />
          </div>
        ) : timeTableData.length > 0 ? (
          renderTimeTable()
        ) : (
          <Empty description="No classes scheduled for this day." />
        )}
      </Content>
    </Layout>
  );
}

export default TimeTable;
