import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Typography, Row, Col, Table, Card, Divider } from "antd";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;

function AttendancePieChart() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // Simulated data retrieval
  const aa = localStorage.getItem("data");
  const xx = JSON.parse(aa);
  const new1 = xx[xx.length - 1].attendance_summary;

  // Function to calculate lectures needed to reach 75% attendance
  function calculateLecturesNeededFor75(present, total) {
    const requiredAttendance = 0.75;
    if (present / total >= requiredAttendance) {
      return 0;
    }
    const lecturesNeeded = Math.ceil(
      (requiredAttendance * total - present) / (1 - requiredAttendance)
    );
    return lecturesNeeded - present;
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
    new1.Present,
    new1.Total
  );
  const lecturesCanBeMissedFor75 = calculateLecturesCanBeMissedFor75(
    new1.Present,
    new1.Total
  );

  const COLORS = ["#a0d468", "#ff9f89"]; // Light green for Present, Light red for Absent
  const data = [
    { name: "Present", value: new1.Present },
    { name: "Absent", value: new1.Total - new1.Present },
  ];

  // Render customized label for the pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={isMobile ? 12 : 14}
      >
        {`${data[index].name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Define table columns
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <span style={{ color: record.color, fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Lectures",
      dataIndex: "lectures",
      key: "lectures",
      align: "center",
      render: (text, record) => (
        <span style={{ color: record.color, fontWeight: "bold" }}>{text}</span>
      ),
    },
  ];

  // Prepare table data
  const tableData = [
    {
      key: "1",
      description: "Total Lectures",
      lectures: new1.Total,
      color: "black",
    },
    {
      key: "2",
      description: "Lectures Attended",
      lectures: new1.Present,
      color: "#a0d468", // Light green
    },
    {
      key: "3",
      description: "Lectures Absent",
      lectures: new1.Total - new1.Present,
      color: "#ff9f89", // Light red
    },
  ];

  if (lecturesNeededFor75 > 0) {
    tableData.push({
      key: "4",
      description: "Lectures needed to reach 75% attendance",
      lectures: lecturesNeededFor75,
      color: "red",
    });
  } else if (lecturesCanBeMissedFor75 > 0) {
    tableData.push({
      key: "5",
      description: "Lectures you can miss and still maintain 75% attendance",
      lectures: lecturesCanBeMissedFor75,
      color: "green",
    });
  } else {
    tableData.push({
      key: "6",
      description: "Your attendance is exactly at 75%",
      lectures: "-",
      color: "black",
    });
  }

  return (
    <div>
      <Row justify="center" style={{ marginBottom: "16px" }}>
        <Col>
          <Title level={4} style={{ textAlign: "center", margin: 0 }}>
            Attendance Summary
          </Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} md={24}>
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 70 : 80}
                outerRadius={isMobile ? 100 : 120}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <Divider />
      <Row justify="center">
        <Col xs={24} md={12}>
          <Card>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AttendancePieChart;
