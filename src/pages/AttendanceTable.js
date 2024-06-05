// src/pages/AttendanceTable.js
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
  notification,
  Button,
  Modal,
  List,
} from "antd";
import { useMediaQuery } from "react-responsive";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  InfoCircleTwoTone,
  StopTwoTone,
} from "@ant-design/icons";
import ResponsiveNavBar from "../components/Navbar";
import axios from "axios";

const { Content } = Layout;

function AttendanceTable() {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectureData, setLectureData] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const stu_id = localStorage.getItem("userDetails").id;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.error({ message: "No token found. Please log in." });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = response.data.response.data;
        if (result && Array.isArray(result)) {
          setData(result);
          const formattedData = result.map((item, index) => ({
            key: item.id || index,
            course_name: item.cdata.course_name,
            present: item.attendance_summary.Present,
            absent: item.attendance_summary.Absent,
            leave: item.attendance_summary.Leave,
            exempt: item.attendance_summary.Exempt,
            total: item.attendance_summary.Total,
            percent: item.attendance_summary.Percent,
            cf_id: item.id,
            fk_student: item.student_id,
          }));
          setTableData(formattedData);
        } else {
          notification.error({
            message: "Invalid data format received from server",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({ message: "Failed to fetch data" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchLectureData = async (cf_id, fk_student) => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({ message: "No token found. Please log in." });
      return;
    }

    try {
      const response = await axios.get(
        `https://abes.platform.simplifii.com/api/v1/cards?type=Attendance&sort_by=+datetime1&equalto___fk_student=${fk_student}&equalto___cf_id=${cf_id}&token=${token}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = response.data.response.data;
      if (result && Array.isArray(result)) {
        const sortedData = result.reverse();
        setLectureData(sortedData);
        setModalVisible(true);
      } else {
        notification.error({
          message: "Invalid data format received from server",
        });
      }
    } catch (error) {
      console.error("Error fetching lecture data:", error);
      notification.error({ message: "Failed to fetch lecture data" });
    }
  };

  const handleShowDetails = (id, stu) => {
    setSelectedLecture(id);
    fetchLectureData(id, stu);
  };

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
        <Tooltip
          title={`${percent}%`}
          placement="top"
          arrow={{ pointAtCenter: true }}
        >
          <span>{percent}%</span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",

      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleShowDetails(record.cf_id, record.fk_student)}
        >
          Show Details
        </Button>
      ),
    },
  ];

  const renderStatusIcon = (status) => {
    if (status === "Present") {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />;
    } else if (status === "Absent") {
      return <CloseCircleTwoTone twoToneColor="#ff4d4f" />;
    }
    return null;
  };

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
        <Content style={{ padding: "24px", marginTop: "16px" }}>
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
      <Content style={{ padding: "24px", marginTop: "16px" }}>
        <Typography.Title
          level={4}
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          Attendance Summary
        </Typography.Title>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {data.map((item) => (
              <Col xs={24} key={item.id}>
                <Card style={{ marginBottom: "16px", borderRadius: "8px" }}>
                  <Typography.Title level={5} style={{ marginBottom: "8px" }}>
                    {item.cdata.course_name}
                  </Typography.Title>
                  <Row align="middle" style={{ marginBottom: "8px" }}>
                    <Col span={2}>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Present: {item.attendance_summary.Present}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle" style={{ marginBottom: "8px" }}>
                    <Col span={2}>
                      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Absent: {item.attendance_summary.Absent}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle" style={{ marginBottom: "8px" }}>
                    <Col span={2}>
                      <InfoCircleTwoTone twoToneColor="#1890ff" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Leave: {item.attendance_summary.Leave}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle" style={{ marginBottom: "8px" }}>
                    <Col span={2}>
                      <StopTwoTone twoToneColor="#595959" />
                    </Col>
                    <Col span={22}>
                      <Typography.Text>
                        Exempt: {item.attendance_summary.Exempt}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle" style={{ marginBottom: "8px" }}>
                    <Col span={24}>
                      <Typography.Text>
                        Total: {item.attendance_summary.Total}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Tooltip
                    title={`${item.attendance_summary.Percent}%`}
                    placement="top"
                    arrow={{ pointAtCenter: true }}
                  >
                    <Progress
                      percent={parseFloat(item.attendance_summary.Percent || 0)}
                      status="active"
                      style={{ marginTop: "8px" }}
                    />
                  </Tooltip>
                  <Button
                    type="primary"
                    onClick={() => handleShowDetails(item.id, item.student_id)}
                    style={{ marginTop: "8px", width: "100%" }}
                  >
                    Show Details
                  </Button>
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
            style={{ borderRadius: "8px" }}
          />
        )}
      </Content>
      <Modal
        title="Lecture Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={isMobile ? "100%" : 800}
      >
        <List
          itemLayout="vertical"
          dataSource={lectureData}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card>
                <Typography.Title level={5}>
                  <CalendarOutlined /> {item.date_formatted}
                </Typography.Title>
                <List.Item.Meta
                  description={
                    <>
                      <Typography.Paragraph>
                        <UserOutlined /> <strong>Faculty Name:</strong>{" "}
                        {item.faculty_name}
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        {renderStatusIcon(item.status)} <strong>Status:</strong>{" "}
                        {item.status}
                      </Typography.Paragraph>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
}

export default AttendanceTable;
