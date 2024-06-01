import React, { useState } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Typography,
  Form,
  Input,
  Alert,
  message,
  Modal,
} from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  LogoutOutlined,
  KeyOutlined,
  ReloadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import IndianClock from "./IndianClock";
import UserDialog from "../pages/UserDialog";

const { Header, Content } = Layout;
const { Text } = Typography;

function ResponsiveNavBar() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleChange = (prop) => (event) => {
    setPasswords({ ...passwords, [prop]: event.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const atUrl =
      "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";
  const ttUrl =
      "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent";

  const fetchTimeTableData = async (date) => {
    const dayOfMonth = new Date().getDate();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(ttUrl, {
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
        sessionStorage.setItem("timeTableData", JSON.stringify(filteredData));
        setSnackbarMessage("TIME TABLE DATA FETCHED");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Failed to fetch time table:", error);
    }
  };

  const fetchAttendanceData = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(atUrl, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });
      const json = await response.json();
      sessionStorage.setItem("data", JSON.stringify(json.response.data));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const refreshPage = async () => {
    try {
      await fetchAttendanceData();
      await fetchTimeTableData();
      setSnackbarMessage("Data Refreshed Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      setSnackbarMessage("Data Refresh Error", error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const token = sessionStorage.getItem("token");
  const username = JSON.parse(sessionStorage.getItem("userDetails")).response
      .username;

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      Authorization: `Bearer ${token}`,
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Host: "abes.platform.simplifii.com",
      Origin: "https://abes.web.simplifii.com",
      Referer: "https://abes.web.simplifii.com/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    };
    const url = "https://abes.platform.simplifii.com/api/v1/cards";
    const data = {
      card_unique_code: username,
      action: "ChangePassword",
      current_password: passwords.currentPassword,
      password: passwords.newPassword,
    };

    try {
      const response = await axios.patch(url, data, { headers });
      if (response.data) {
        message.success("Password successfully changed!");
        setDialogOpen(false);
      } else {
        message.error("Failed to change password. Please try again.");
      }
    } catch (error) {
      message.error(
          error.response.data.msg || "Failed to change password."
      );
      console.error("Failed to change password:", error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate("/login");
  };

  return (
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleDrawer}
              style={{ marginRight: '16px', color: 'white' }}
          />
          <Typography.Title level={3} style={{ color: 'white', flex: 1, margin: 0 }}>
            AIMS 2.0
          </Typography.Title>
          <IndianClock />
          <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={refreshPage}
              style={{ color: 'white' }}
          />
        </Header>
        <Drawer
            title="Menu"
            placement="left"
            onClose={toggleDrawer}
            visible={drawerOpen}
            bodyStyle={{ padding: 0 }}
        >
          <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              onClick={toggleDrawer}
          >
            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate("/dashboard")}>
              Home
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />} onClick={() => setUserDialogOpen(true)}>
              Profile
            </Menu.Item>
            <Menu.Item key="3" icon={<BookOutlined />} onClick={() => navigate("/subjects")}>
              Subjects Details
            </Menu.Item>
            <Menu.Item key="4" icon={<CalendarOutlined />} onClick={() => navigate("/attendance")}>
              Attendance Details
            </Menu.Item>
            <Menu.Item key="5" icon={<KeyOutlined />} onClick={() => setDialogOpen(true)}>
              Change Password
            </Menu.Item>
            <Menu.Item key="6" icon={<LogoutOutlined />} onClick={logout}>
              Log Out
            </Menu.Item>
          </Menu>
        </Drawer>
        {/*<Content style={{ padding: '24px', marginTop: '64px' }}>*/}
        {/*  /!* Main content goes here *!/*/}
        {/*</Content>*/}
        <UserDialog
            open={userDialogOpen}
            handleClose={() => setUserDialogOpen(false)}
            userDetails={userDetails}
        />
        <Modal
            title="Change Password"
            visible={dialogOpen}
            onCancel={() => setDialogOpen(false)}
            footer={[
              <Button key="back" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handlePasswordChange}>
                Change Password
              </Button>,
            ]}
        >
          <Form layout="vertical">
            <Form.Item label="Current Password">
              <Input.Password
                  value={passwords.currentPassword}
                  onChange={handleChange("currentPassword")}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item label="New Password">
              <Input.Password
                  value={passwords.newPassword}
                  onChange={handleChange("newPassword")}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item label="Confirm New Password">
              <Input.Password
                  value={passwords.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </Form>
        </Modal>
        {openSnackbar && (
            <Alert
                message={snackbarMessage}
                type={snackbarSeverity}
                showIcon
                closable
                afterClose={handleSnackbarClose}
                style={{ position: 'fixed', bottom: 16, right: 16 }}
            />
        )}
      </Layout>
  );
}

export default ResponsiveNavBar;
