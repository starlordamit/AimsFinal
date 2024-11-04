import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Typography, Row, Col, Table, Card, Divider } from "antd";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;

function AttendancePieChart() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const aa = localStorage.getItem("data");
  const xx = JSON.parse(aa);
  const new1 = xx[xx.length - 1].attendance_summary;

  function calculateLecturesNeededFor75(present, total) {
    const N = Math.max(0, Math.ceil((0.75 * total - present) / 0.25));
    return N;
  }

  function calculateLecturesCanBeMissedFor75(present, total) {
    const M = Math.max(
      0,
      Math.floor((present - 0.75 * total) / 0.75)
    );
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

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <span style={{ color: record.color }}>{text}</span>
      ),
    },
    {
      title: "Lectures",
      dataIndex: "lectures",
      key: "lectures",
      align: "center",
      render: (text, record) => (
        <span style={{ color: record.color }}>{text}</span>
      ),
    },
  ];

  const tableData = [];

  if (lecturesNeededFor75 > 0) {
    tableData.push({
      key: "1",
      description: "Lectures needed to reach 75% attendance",
      lectures: lecturesNeededFor75,
      color: "red",
    });
  } else if (lecturesCanBeMissedFor75 > 0) {
    tableData.push({
      key: "2",
      description: "Lectures you can miss and still maintain 75% attendance",
      lectures: lecturesCanBeMissedFor75,
      color: "green",
    });
  } else {
    tableData.push({
      key: "3",
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
              showHeader={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AttendancePieChart;
