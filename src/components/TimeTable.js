import React, { useState, useEffect } from "react";
import { List, Typography, Button, Layout, Card, Row, Col, Spin } from "antd";
import axios from "axios";
import { blue } from "@ant-design/colors";
import { ClockCircleOutlined } from "@ant-design/icons";
const { Content } = Layout;

const TimeTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeTableData, setTimeTableData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const dayOfMonth = date.getDate();
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
    setLoading(false);
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
    const currentDay = selectedDate.getDate();
    return timeTableData
      .filter((item) => item[`c${currentDay}`])
      .sort((a, b) => {
        const timeA = getTimeFromString(a[`c${currentDay}`]);
        const timeB = getTimeFromString(b[`c${currentDay}`]);
        return (timeA || "").localeCompare(timeB || "");
      })
      .map((item, index) => {
        const key = item.cf_id
          ? `${item.cf_id}-${item.course_id || index}`
          : `fallback-${index}`;

        const isCurrentClass = isCurrentOrConsecutiveClass(
          new DOMParser().parseFromString(item[`c${currentDay}`], "text/html")
            .body.textContent
        );

        return (
          <List.Item key={key}>
            <Card
              style={{
                backgroundColor:
                  selectedDate.getDay() === new Date().getDay() &&
                  isCurrentClass
                    ? "#FFB5A1"
                    : "transparent",
                marginBottom: "8px",
              }}
              bodyStyle={{ padding: "8px" }}
            >
              <Card.Meta
                avatar={<ClockCircleOutlined />}
                title={
                  <Typography.Text strong>
                    {item.course_name.split("/")[2]}
                  </Typography.Text>
                }
                description={
                  <>
                    <Typography.Text>{item.faculty_name}</Typography.Text>
                    <br />
                    <Typography.Text>
                      {new DOMParser()
                        .parseFromString(item[`c${currentDay}`], "text/html")
                        .body.textContent.slice(0, 13)}
                      {"  "}
                      {new DOMParser()
                        .parseFromString(item[`c${currentDay}`], "text/html")
                        .body.textContent.slice(13)}
                    </Typography.Text>
                  </>
                }
              />
            </Card>
          </List.Item>
        );
      });
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <Layout style={{ minHeight: "100vh", position: "relative" }}>
      <Content style={{ maxWidth: 300, margin: "auto", padding: "1rem" }}>
        <Typography.Title
          level={2}
          style={{ textAlign: "center", fontSize: "16px" }}
        >
          Time Table for {selectedDate.toDateString()}
        </Typography.Title>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          {weekdays.map((day, index) => (
            <Button
              key={day}
              onClick={() => handleWeekdayChange(index)}
              type={selectedDate.getDay() === index + 1 ? "primary" : "default"}
              style={{
                margin: "3px",
                borderBottom:
                  selectedDate.getDay() === index + 1
                    ? `1px solid ${blue[5]}`
                    : "none",
                fontSize: "12px",
              }}
            >
              {selectedDate.getDay() === index + 1 ? day.slice(0, 3) : day[0]}
            </Button>
          ))}
        </div>
        <Row justify="center">
          <Col xs={24} sm={24} md={24} lg={24}>
            {loading ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 9999,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.8)",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <Spin tip="Loading..." size="large" />
              </div>
            ) : (
              <List itemLayout="vertical" style={{ width: "100%" }}>
                {renderTimeTableList()}
              </List>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default TimeTable;
