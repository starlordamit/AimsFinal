import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Typography, Row, Col } from "antd";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;

function AttendancePieChart() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const aa = localStorage.getItem("data");
  const xx = JSON.parse(aa);
  const new1 = xx[xx.length - 1].attendance_summary;

  function calculateLecturesNeededFor75(present, total) {
    const N = Math.max(0, Math.ceil(3 * total - 4 * present));
    return N;
  }

  function calculateLecturesCanBeMissedFor75(present, total) {
    const numerator = 4 * present - 3 * total;
    const M = Math.max(0, Math.floor(numerator / 3));
    return M;
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

  // Render customized label for the center of the pie chart
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
      <Row justify="center" style={{ marginTop: "16px" }}>
        <Col>
          {lecturesNeededFor75 > 0 ? (
            <Title
              level={4}
              style={{ color: "red", textAlign: "center" }}
            >
              You need to attend {lecturesNeededFor75} more lecture
              {lecturesNeededFor75 > 1 ? "s" : ""} to reach 75% attendance.
            </Title>
          ) : lecturesCanBeMissedFor75 > 0 ? (
            <Title
              level={4}
              style={{ color: "green", textAlign: "center" }}
            >
              You can miss {lecturesCanBeMissedFor75} more lecture
              {lecturesCanBeMissedFor75 > 1 ? "s" : ""} and still maintain
              75% attendance.
            </Title>
          ) : (
            <Title level={4} style={{ textAlign: "center" }}>
              Your attendance is exactly at 75%.
            </Title>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default AttendancePieChart;
