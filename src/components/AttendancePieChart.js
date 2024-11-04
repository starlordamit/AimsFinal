import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Typography, Row, Col, Card, Table, List } from "antd";
import { useMediaQuery } from "react-responsive";
import "./AttendancePieChart.css"; // Import custom CSS styles

const { Title } = Typography;

function AttendancePieChart() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // Simulated data retrieval
  const attendanceData = localStorage.getItem("data");
  const attendanceJson = JSON.parse(attendanceData);
  const attendanceSummary =
    attendanceJson[attendanceJson.length - 1].attendance_summary;

  // Function to calculate lectures needed to reach 75% attendance
  function calculateLecturesNeededFor75(present, total) {
    const requiredAttendance = 0.75;
    if (present / total >= requiredAttendance) {
      return 0;
    }
    const lecturesNeeded = Math.ceil(
      (requiredAttendance * total - present) / (1 - requiredAttendance)
    );
    return lecturesNeeded;
  }

  // Function to calculate lectures that can be missed while maintaining 75% attendance
  function calculateLecturesCanBeMissedFor75(present, total) {
    const requiredAttendance = 0.75;
    if (present / total <= requiredAttendance) {
      return 0;
    }
    const lecturesCanMiss = Math.floor(
      (present - requiredAttendance * total) / requiredAttendance
    );
    return lecturesCanMiss;
  }

  const lecturesNeededFor75 = calculateLecturesNeededFor75(
    attendanceSummary.Present,
    attendanceSummary.Total
  );
  const lecturesCanBeMissedFor75 = calculateLecturesCanBeMissedFor75(
    attendanceSummary.Present,
    attendanceSummary.Total
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

  if (lecturesNeededFor75 > 0) {
    tableData.push({
      key: "4",
      description: "Lectures needed to reach 75% attendance",
      lectures: lecturesNeededFor75,
      color: "#FF4D4F", // Red color for warning
    });
  } else if (lecturesCanBeMissedFor75 > 0) {
    tableData.push({
      key: "5",
      description: "Lectures you can miss and still maintain 75% attendance",
      lectures: lecturesCanBeMissedFor75,
      color: "#52C41A", // Green color for success
    });
  } else {
    tableData.push({
      key: "6",
      description: "Your attendance is exactly at 75%",
      lectures: "-",
      color: "#FAAD14", // Yellow color for caution
    });
  }

  // Notice Board Data (constant list)
  const noticeData = [
    {
      key: "1",
      // title: "Follow on Instagram",
      description: "Follow me : @i.am.amit.yadav",
    },
    {
      key: "2",
      // title: "Update !",
      description: "New UI, Fix Attandance calculation,",
    },
    // Add more notices as needed
  ];

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
      </Card>

      {/* Notice Board Card */}
      <Card className="notice-card">
        <Title level={3} className="notice-title">
          Notice Board
        </Title>
        <List
          itemLayout="vertical"
          dataSource={noticeData}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <List.Item.Meta
                title={<a href="#">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default AttendancePieChart;
