import React, { useState } from "react";
import {
  Modal,
  Button,
  Typography,
  notification,
  Input,
  Row,
  Col,
  Divider,
  Card,
  Space,
  Avatar,
  Tooltip,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  KeyOutlined,
  LockOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  SafetyOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  HomeOutlined,
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  UserAddOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  BookOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
// import "./UserDialog.css"; // Ensure you have a CSS file for custom styles

const { Text, Title } = Typography;

function UserDialog({ open, handleClose }) {
  const [pin, setPin] = useState("");
  const [editPin, setEditPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  const { response } = userDetails;
  const pinStored = localStorage.getItem("pin");

  const updatePin = async () => {
    const token = localStorage.getItem("token");

    if (!pin.match(/^\d{4}$/)) {
      notification.error({
        message: "PIN must be a four-digit number.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch(
        "https://abes.platform.simplifii.com/api/v1/cards",
        {
          card_unique_code: response.unique_code,
          action: "SetPin",
          pin,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.msg) {
        notification.success({
          message: res.data.msg,
        });
        localStorage.setItem("pin", pin);
      } else {
        notification.warning({
          message: "Unknown response from server.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to update PIN.",
      });
      console.error("Error updating PIN:", error);
    } finally {
      setLoading(false);
      setEditPin(false); // Close edit mode
    }
  };

  const dataStored = localStorage.getItem("data");
  const data = dataStored ? JSON.parse(dataStored) : [];

  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  // Map additional fields
  const additionalFields = [];

  return (
    <Modal
      title="User Details"
      visible={open}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
      width={isSmallScreen ? "100%" : "600px"}
      bodyStyle={{ padding: "24px" }}
    >
      <Spin spinning={loading}>
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} justify="center">
            <Col span={24} style={{ textAlign: "center" }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 8 }}>
                {response?.name || "N/A"}
              </Title>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                {/* Existing Fields */}
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <IdcardOutlined /> Department & Section:
                    </Text>
                    <Text>{`${data[0]?.dept || "N/A"} - ${
                      data[0]?.section || "N/A"
                    }`}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <BookOutlined /> Course:
                    </Text>
                    <Text>{data[0]?.course_name || "N/A"}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <MailOutlined /> Email:
                    </Text>
                    <Text>{response?.email || "N/A"}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <PhoneOutlined /> Mobile:
                    </Text>
                    <Text>{response?.mobile || "N/A"}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <SafetyOutlined /> Admission Number:
                    </Text>
                    <Text>{response?.username || "N/A"}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <LockOutlined /> Roll Number:
                    </Text>
                    <Text>{response?.string4 || "N/A"}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <CalendarOutlined /> Term:
                    </Text>
                    <Text>
                      {`Year: ${response?.int3 || "N/A"} Semester: ${
                        response?.int4 || "N/A"
                      }`}
                    </Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <CalendarOutlined /> Passing Year:
                    </Text>
                    <Text>{response?.int6 || "N/A"}</Text>
                  </Space>
                </Col>
                {/* Additional Fields */}
                {additionalFields.map((field, index) => (
                  <Col span={isSmallScreen ? 24 : 12} key={index}>
                    <Space direction="vertical" size="small">
                      <Text strong>
                        {field.icon} {field.label}:
                      </Text>
                      <Text>{field.value || "N/A"}</Text>
                    </Space>
                  </Col>
                ))}
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <FieldTimeOutlined /> Last Login Time:
                    </Text>
                    <Text>{response?.last_login_time || "N/A"}</Text>
                  </Space>
                </Col>
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <SafetyOutlined /> Role:
                    </Text>
                    <Text>{response?.role || "N/A"}</Text>
                  </Space>
                </Col>
                {/* PIN Field */}
                <Col span={isSmallScreen ? 24 : 12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      <KeyOutlined /> PIN:
                    </Text>
                    {editPin ? (
                      <Input
                        placeholder="Enter 4-digit PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={4}
                        suffix={
                          <Space>
                            <Tooltip title="Save">
                              <Button
                                type="primary"
                                shape="circle"
                                icon={<SaveOutlined />}
                                size="small"
                                onClick={updatePin}
                              />
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <Button
                                shape="circle"
                                icon={<CloseOutlined />}
                                size="small"
                                onClick={() => setEditPin(false)}
                              />
                            </Tooltip>
                          </Space>
                        }
                      />
                    ) : (
                      <Space>
                        <Text>{pinStored || "N/A"}</Text>
                        <Tooltip title="Edit PIN">
                          <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                              setEditPin(true);
                              setPin("");
                            }}
                          />
                        </Tooltip>
                      </Space>
                    )}
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Divider style={{ margin: "8px 0" }} />
        <Typography.Text type="secondary" style={{ padding: "0 16px" }}>
          Instructions: To change PIN, click on the edit icon next to the PIN.
        </Typography.Text>
      </Spin>
    </Modal>
  );
}

export default UserDialog;
