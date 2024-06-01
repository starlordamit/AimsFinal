import React from "react";
import { Table, Card, Typography, Row, Col, Layout, Divider } from "antd";
import { useMediaQuery } from "react-responsive";
import { UserOutlined, CodeOutlined } from "@ant-design/icons";
import ResponsiveNavBar from "../components/Navbar";

const { Content } = Layout;

function CourseTable() {
  const data1 = sessionStorage.getItem("data");
  const data = JSON.parse(data1);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Faculty Name",
      dataIndex: "faculty_name",
      key: "faculty_name",
      align: "right",
    },
    {
      title: "Course Code",
      dataIndex: "course_code",
      key: "course_code",
      align: "right",
    },
  ];

  const tableData = data.slice(0, data.length - 1).map((item, index) => ({
    key: item.id || index,
    course_name: item.cdata.course_name,
    faculty_name: item.faculty_name,
    course_code: item.cdata.course_code,
  }));

  return (
      <Layout>
        <ResponsiveNavBar />
        <Content style={{ padding: "24px", marginTop: "1px" }}>
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            Course Details
          </Typography.Title>
          {isMobile ? (
              <Row gutter={[16, 16]}>
                {data.slice(0, data.length - 1).map((item, index) => (
                    <Col xs={24} key={item.id || index}>
                      <Card style={{ marginBottom: "1px" }}>
                        <Typography.Title level={5}>
                          {item.cdata.course_name}
                        </Typography.Title>
                        <Divider />
                        <Typography.Paragraph>
                          <UserOutlined /> <strong>Faculty Name:</strong> {item.faculty_name}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                          <CodeOutlined /> <strong>Course Code:</strong> {item.cdata.course_code}
                        </Typography.Paragraph>
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

export default CourseTable;
