// src/pages/CompletedQuizzes.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Row,
  Col,
  Layout,
  Spin,
  notification,
  Button,
} from "antd";
import { useMediaQuery } from "react-responsive";
import ResponsiveNavBar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

function CompletedQuizzes() {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://abes.platform.simplifii.com/api/v1/custom/myEvaluatedQuizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = response.data.response.data;
        if (result && Array.isArray(result)) {
          setData(result);
          const formattedData = result.map((item, index) => ({
            key: item.sl_num || index,
            correct: item.correct != null ? item.correct : "N/A",
            incorrect: item.incorrect != null ? item.incorrect : "N/A",
            not_attempted:
              item.not_attempted != null ? item.not_attempted : "N/A",
            marks_obtained:
              item.marks_obtained != null ? item.marks_obtained : "N/A",
            master_course_code: item.master_course_code || "N/A",
            quiz_link: item.quiz_link,
            quiz_uc: item.quiz_uc || "N/A",
          }));
          setTableData(formattedData);
        } else {
          notification.error({
            message: "Invalid data format received from server",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Failed to fetch data",
        });
        navigate("/login"); // Redirect to login on failure
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const columns = [
    {
      title: "Master Course Code",
      dataIndex: "master_course_code",
      key: "master_course_code",
    },
    {
      title: "Quiz UC",
      dataIndex: "quiz_uc",
      key: "quiz_uc",
    },
    {
      title: "Quiz Link",
      dataIndex: "quiz_uc",
      key: "quiz_link",
      render: (quiz_uc) => (
        <Button
          type="primary"
          onClick={() => navigate(`/quiz1?req_id=${quiz_uc}`)}
          style={{ transition: "all 0.3s ease" }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.backgroundColor = "#40a9ff";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.backgroundColor = "#1890ff";
          }}
        >
          View Quiz
        </Button>
      ),
    },
    {
      title: "Marks Obtained",
      dataIndex: "marks_obtained",
      key: "marks_obtained",
      align: "right",
    },
    {
      title: "Correct Answers",
      dataIndex: "correct",
      key: "correct",
      align: "right",
    },
    {
      title: "Incorrect Answers",
      dataIndex: "incorrect",
      key: "incorrect",
      align: "right",
    },
    {
      title: "Not Attempted",
      dataIndex: "not_attempted",
      key: "not_attempted",
      align: "right",
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
          Completed Quizzes
        </Typography.Title>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {data.map((item) => (
              <Col xs={24} key={item.sl_num || item.key}>
                <Card style={{ marginBottom: "1px" }}>
                  <Typography.Title level={5}>
                    {item.master_course_code || "N/A"}
                  </Typography.Title>
                  <Row align="middle">
                    <Col span={24}>
                      <Typography.Text>
                        Quiz UC: {item.quiz_uc || "N/A"}
                      </Typography.Text>
                    </Col>
                  </Row>

                  <Row align="middle">
                    <Col span={24}>
                      <Typography.Text>
                        Marks Obtained:{" "}
                        {item.marks_obtained != null
                          ? item.marks_obtained
                          : "N/A"}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={24}>
                      <Typography.Text>
                        Correct Answers:{" "}
                        {item.correct != null ? item.correct : "N/A"}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={24}>
                      <Typography.Text>
                        Incorrect Answers:{" "}
                        {item.incorrect != null ? item.incorrect : "N/A"}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={24}>
                      <Typography.Text>
                        Not Attempted:{" "}
                        {item.not_attempted != null
                          ? item.not_attempted
                          : "N/A"}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row align="middle" style={{ marginTop: "20px" }}>
                    <Col span={24}>
                      <Button
                        type="primary"
                        onClick={() =>
                          navigate(`/quiz1?req_id=${item.quiz_uc}`)
                        }
                        style={{
                          width: "100%",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.backgroundColor = "#40a9ff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.backgroundColor = "#1890ff";
                        }}
                      >
                        View Quiz
                      </Button>
                    </Col>
                  </Row>
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

export default CompletedQuizzes;
