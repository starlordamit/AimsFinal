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

  function calc75(present, total) {
    const temp1 = present;
    let temp = (present / total) * 100;
    while (temp < 75) {
      total++;
      present++;
      temp = (present / total) * 100;
    }
    return present - temp1;
  }

  function leavefor75(present, total) {
    const temp1 = present;
    let temp = (present / total) * 100;
    while (temp > 75) {
      total++;
      present--;
      temp = (present / total) * 100;
    }
    return temp1 - present;
  }

  const lectureneedfor75 = calc75(new1.Present, new1.Total);
  const leactureleavefor75 = leavefor75(new1.Present, new1.Total);

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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      align: "right",
    },
    {
      title: "For 75% [L]",
      dataIndex: "for75",
      key: "for75",
      align: "right",
    },
  ];

  const tableData = [
    {
      key: "1",
      type: "Present",
      count: new1.Present,
      for75: lectureneedfor75,
    },
    {
      key: "2",
      type: "Absent",
      count: new1.Total - new1.Present,
      for75: leactureleavefor75,
    },
    {
      key: "3",
      type: "Total",
      count: new1.Total,
      for75: leactureleavefor75 - lectureneedfor75,
    },
  ];

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
        <Col xs={24} md={24}>
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
