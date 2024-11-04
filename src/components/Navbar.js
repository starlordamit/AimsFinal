import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Typography,
  Tooltip,
  Avatar,
  Spin,
  Modal,
  message,
  Form,
  Input,
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
import UserDialog from "./UserDialog"; // Ensure this path is correct
import "./ResponsiveNavBar.css"; // Ensure this path is correct

const { Header } = Layout;
const { Title } = Typography;

function ResponsiveNavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userDetails, setUserDetails] = useState(null);
  const [loadingData, setLoadingData] = useState(true); // Loading state for data fetching
  const [changingPassword, setChangingPassword] = useState(false); // Loading state for password change

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user details from API or localStorage
  const fetchUserDetails = async () => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
      setLoadingData(false);
    } else {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          "https://abes.platform.simplifii.com/api/v1/admin/getUserInfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(response.data);
        localStorage.setItem("userDetails", JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        message.error("Failed to fetch user details. Please log in again.");
        navigate("/login");
      } finally {
        setLoadingData(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      message.error("New passwords do not match.");
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }
    setChangingPassword(true);
    try {
      const response = await axios.patch(
        "https://abes.platform.simplifii.com/api/v1/cards",
        {
          card_unique_code: userDetails.response.username,
          action: "ChangePassword",
          current_password: passwords.currentPassword,
          password: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status === 1) {
        message.success("Password successfully changed!");
        setPasswordModalVisible(false);
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        message.error(response.data.msg || "Failed to change password.");
      }
    } catch (error) {
      message.error(error.response?.data?.msg || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        navigate("/dashboard");
        setDrawerOpen(false);
      },
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => {
        setUserDialogOpen(true);
        setDrawerOpen(false);
      },
    },
    {
      key: "3",
      icon: <BookOutlined />,
      label: "Subjects Details",
      onClick: () => {
        navigate("/subjects");
        setDrawerOpen(false);
      },
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Attendance Details",
      onClick: () => {
        navigate("/attendance");
        setDrawerOpen(false);
      },
    },
    {
      key: "5",
      icon: <KeyOutlined />,
      label: "Change Password",
      onClick: () => {
        setPasswordModalVisible(true);
        setDrawerOpen(false);
      },
    },
    {
      key: "6",
      icon: <LogoutOutlined />,
      label: "Log Out",
      onClick: () => {
        logout();
        setDrawerOpen(false);
      },
    },
  ];

  if (loadingData) {
    return (
      <div className="loading-container">
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="left-section">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            className="menu-button"
          />
          <Title
            level={4}
            className="logo"
            onClick={() => navigate("/dashboard")}
          >
            AIMS 2.0.
          </Title>
        </div>
        <div className="right-section">
          <Tooltip title="Refresh Data">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={fetchUserDetails}
              className="icon-button"
            />
          </Tooltip>
          <Avatar
            style={{ backgroundColor: "#87d068", marginLeft: 16 }}
            icon={<UserOutlined />}
            onClick={() => setUserDialogOpen(true)}
          />
        </div>
      </Header>

      <Drawer
        title="Menu"
        placement="left"
        onClose={toggleDrawer}
        visible={drawerOpen}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ borderBottom: "none", borderRadius: "8px 8px 0 0" }}
      >
        <Menu
          mode="inline"
          style={{ height: "100%", borderRight: 0, borderRadius: "8px" }}
          items={menuItems}
        />
      </Drawer>

      {/* User Profile Modal */}
      <UserDialog
        open={userDialogOpen}
        handleClose={() => setUserDialogOpen(false)}
      />

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={handlePasswordChange}
        confirmLoading={changingPassword}
        okText="Change Password"
        cancelButtonProps={{ style: { borderRadius: "8px" } }}
        okButtonProps={{ style: { borderRadius: "8px" } }}
      >
        <Form layout="vertical">
          <Form.Item label="Current Password" required>
            <Input.Password
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
          <Form.Item label="New Password" required>
            <Input.Password
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
          <Form.Item label="Confirm New Password" required>
            <Input.Password
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default ResponsiveNavBar;
