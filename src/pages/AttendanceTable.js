import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Row,
  Col,
  Tooltip,
  Progress,
  Layout,
  Spin,
} from "antd";
import { useMediaQuery } from "react-responsive";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  InfoCircleTwoTone,
  StopTwoTone,
} from "@ant-design/icons";
import ResponsiveNavBar from "../components/Navbar";

const { Content } = Layout;

function AttendanceTable() {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    const fetchData = () => {
      const d = sessionStorage.getItem("data");
      if (d) {
        const parsedData = JSON.parse(d);
        setData(parsedData);
        const formattedData = parsedData.map((item, index) => ({
          key: item.id || index,
          course_name: item.cdata.course_name,
          present: item.attendance_summary.Present,
          absent: item.attendance_summary.Absent,
          leave: item.attendance_summary.Leave,
          exempt: item.attendance_summary.Exempt,
          total: item.attendance_summary.Total,
          percent: item.attendance_summary.Percent,
        }));
        setTableData(formattedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Present",
      dataIndex: "present",
      key: "present",
      align: "right",
    },
    {
      title: "Absent",
      dataIndex: "absent",
      key: "absent",
      align: "right",
    },
    {
      title: "Leave",
      dataIndex: "leave",
      key: "leave",
      align: "right",
    },
    {
      title: "Exempt",
      dataIndex: "exempt",
      key: "exempt",
      align: "right",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right",
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
      align: "right",
      render: (percent) => (
        <Tooltip title={`${percent}%`} placement="top" arrowPointAtCenter>
          <span>{percent}%</span>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <ResponsiveNavBar />
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin tip="Loading..." size="large" />
        </Content>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <ResponsiveNavBar />
        <Content style={{ padding: "24px", marginTop: "1px" }}>
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            No data available
          </Typography.Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <ResponsiveNavBar />
      <Content style={{ padding: "24px", marginTop: "1px" }}>
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Attendance Summary
        </Typography.Title>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {data.map((item) => (
              <Col xs={24} key={item.id}>
                <Card style={{ marginBottom: "1px" }}>
                  <Typography.Title level={5}>
                    {item.cdata.course_name}
                  </Typography.Title>
                  <Row align="middle">
                    <Col span={2}>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Present: {item.attendance_summary.Present}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={2}>
                      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Absent: {item.attendance_summary.Absent}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={2}>
                      <InfoCircleTwoTone twoToneColor="#1890ff" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Leave: {item.attendance_summary.Leave}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={2}>
                      <StopTwoTone twoToneColor="#595959" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Exempt: {item.attendance_summary.Exempt}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={24}>
                      <Typography.Text>
                        Total: {item.attendance_summary.Total}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Tooltip
                    title={`${item.attendance_summary.Percent}%`}
                    placement="top"
                    arrow
                  >
                    <Progress
                      percent={parseFloat(item.attendance_summary.Percent || 0)}
                      status="active"
                      style={{ marginTop: "8px" }}
                    />
                  </Tooltip>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
          />
        )}
      </Content>
    </Layout>
  );
}

export default AttendanceTable;
