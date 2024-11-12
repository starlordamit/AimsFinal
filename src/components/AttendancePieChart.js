import React, { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Typography,
  Row,
  Col,
  Card,
  Table,
  Slider,
  Alert,
  Divider,
} from "antd";
import { useMediaQuery } from "react-responsive";
import "./AttendancePieChart.css"; // Import custom CSS styles

import Loginquiz from "../components/quiz/LoginComponent";

const { Title } = Typography;

function AttendancePieChart() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // Simulated data retrieval
  const attendanceData = localStorage.getItem("data");
  const attendanceJson = JSON.parse(attendanceData);
  const attendanceSummary =
    attendanceJson[attendanceJson.length - 1].attendance_summary;

  const [targetAttendance, setTargetAttendance] = useState(75); // Default target attendance percentage

  // Function to calculate lectures needed to reach target attendance
  function calculateLecturesNeededForTarget(present, total, target) {
    const requiredAttendance = target / 100;
    if (present / total >= requiredAttendance) {
      return 0;
    }
    const lecturesNeeded = Math.ceil(
      (requiredAttendance * total - present) / (1 - requiredAttendance)
    );
    return lecturesNeeded;
  }

  // Function to calculate lectures that can be missed while maintaining target attendance
  function calculateLecturesCanBeMissedForTarget(present, total, target) {
    const requiredAttendance = target / 100;
    if (present / total <= requiredAttendance) {
      return 0;
    }
    const lecturesCanMiss = Math.floor(
      (present - requiredAttendance * total) / requiredAttendance
    );
    return lecturesCanMiss;
  }

  const lecturesNeededForTarget = calculateLecturesNeededForTarget(
    attendanceSummary.Present,
    attendanceSummary.Total,
    targetAttendance
  );
  const lecturesCanBeMissedForTarget = calculateLecturesCanBeMissedForTarget(
    attendanceSummary.Present,
    attendanceSummary.Total,
    targetAttendance
  );

  const COLORS = ["#00C49F", "#FF8042"]; // Updated color scheme
  const data = [
    { name: "Present", value: attendanceSummary.Present },
    {
      name: "Absent",
      value: attendanceSummary.Total - attendanceSummary.Present,
    },
  ];

  // Define table columns
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <span style={{ color: record.color, fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: "Lectures",
      dataIndex: "lectures",
      key: "lectures",
      align: "center",
      render: (text, record) => (
        <span style={{ color: record.color, fontWeight: 500 }}>{text}</span>
      ),
    },
  ];

  // Prepare table data
  const tableData = [
    {
      key: "1",
      description: "Total Lectures",
      lectures: attendanceSummary.Total,
      color: "#000",
    },
    {
      key: "2",
      description: "Lectures Attended",
      lectures: attendanceSummary.Present,
      color: COLORS[0],
    },
    {
      key: "3",
      description: "Lectures Absent",
      lectures: attendanceSummary.Total - attendanceSummary.Present,
      color: COLORS[1],
    },
  ];

  // Prepare message based on calculations
  let attendanceMessage = null;
  if (lecturesNeededForTarget > 0) {
    attendanceMessage = (
      <Alert
        message={`You need to attend ${lecturesNeededForTarget} more lecture(s) to reach ${targetAttendance}% attendance.`}
        type="warning"
        showIcon
      />
    );
  } else if (lecturesCanBeMissedForTarget > 0) {
    attendanceMessage = (
      <Alert
        message={`You can miss ${lecturesCanBeMissedForTarget} lecture(s) and still maintain ${targetAttendance}% attendance.`}
        type="success"
        showIcon
      />
    );
  } else {
    attendanceMessage = (
      <Alert
        message={`Your attendance is exactly at ${targetAttendance}%.`}
        type="info"
        showIcon
      />
    );
  }

  return (
    <div className="attendance-container">
      {/* Attendance Summary Card */}
      <Card className="attendance-card">
        <Title level={3} className="attendance-title">
          Attendance Summary
        </Title>
        <Row gutter={[24, 24]} justify="center" align="middle">
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value, entry) => (
                    <span style={{ color: "#595959", fontWeight: 500 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={24} md={12}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered
              className="attendance-table"
            />
          </Col>
        </Row>
        <Divider />
        {/* Slider for Target Attendance */}
        <div style={{ padding: "0 16px" }}>
          <Title level={4}>Set Your Target Attendance Percentage:</Title>
          <Slider
            min={1}
            max={99}
            value={targetAttendance}
            onChange={(value) => setTargetAttendance(value)}
            tooltipVisible
            marks={{
              1: "1%",
              99: "99%",
            }}
          />
          <div style={{ marginTop: "16px" }}>{attendanceMessage}</div>
        </div>
      </Card>

      {/* Quiz Component */}
      <Card className="quiz-card">
        BETA STAGE DONT DO QUIZ FROM HERE CHANCES OF NO SUBMISSION
        <Loginquiz />
      </Card>
    </div>
  );
}

export default AttendancePieChart;
