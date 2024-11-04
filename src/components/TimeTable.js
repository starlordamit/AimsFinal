import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Spin,
  Button,
  Divider,
  Timeline,
  Badge,
  Empty,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "./TimeTable.css"; // Import custom CSS for styling

dayjs.extend(isBetween);

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
          .map((item) => ({
            ...item,
            timeText: stripHtml(item[`c${dayOfMonth}`]),
          }))
          .sort((a, b) => {
            const timeA = getTimeFromString(a.timeText);
            const timeB = getTimeFromString(b.timeText);
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
    return doc.body.textContent || "";
  };

  const hasValidTime = (text) => {
    // Check if text contains a valid time slot in HH:MM - HH:MM format
    return /\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/.test(text);
  };

  const getTimeFromString = (text) => {
    const match = text.match(/\d{2}:\d{2}/);
    return match ? match[0] : "";
  };

  const handleDateChange = (direction) => {
    let newDate = selectedDate.add(direction, "day");
    // Skip weekends
    while (newDate.day() === 0 || newDate.day() === 6) {
      newDate = newDate.add(direction, "day");
    }
    setSelectedDate(newDate);
  };

  const isCurrentClass = (timeString) => {
    const currentTime = dayjs();

    const timeSlots = timeString.match(/\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/g);
    if (!timeSlots) return false;

    return timeSlots.some((slot) => {
      const [startTimeString, endTimeString] = slot.split("-");
      const startTime = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${startTimeString.trim()}`,
        "YYYY-MM-DD HH:mm"
      );
      const endTime = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${endTimeString.trim()}`,
        "YYYY-MM-DD HH:mm"
      );
      return currentTime.isBetween(startTime, endTime, null, "[)");
    });
  };

  const renderTimeTable = () => {
    return (
      <Timeline mode="left">
        {timeTableData.map((item, index) => {
          const isCurrent = isCurrentClass(item.timeText);
          return (
            <Timeline.Item
              key={index}
              dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
              color={isCurrent ? "red" : "blue"}
            >
              <div
                className={`timeline-item-content ${
                  isCurrent ? "current-class" : ""
                }`}
              >
                <Text strong>{item.course_name.split("/")[2]}</Text>
                <br />
                <Text>{item.faculty_name}</Text>
                <br />
                <Text>{item.timeText}</Text>
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
