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
} from "@ant-design/icons";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

const { Text, Title } = Typography;

function UserDialog({ open, handleClose, userDetails }) {
  const [pin, setPin] = useState("");
  const [editPin, setEditPin] = useState(false);
  const { response } = userDetails;
  const response1 = JSON.parse(localStorage.getItem("userDetails"));
  const pin1 = localStorage.getItem("pin");

  const updatePin = async () => {
    const token = localStorage.getItem("token");

    if (!pin.match(/^\d{4}$/) || pin < 1000 || pin > 9999) {
      notification.error({
        message: "PIN must be a four-digit number between 1000 and 9999.",
      });
      return;
    }

    try {
      const response = await axios.patch(
        "https://abes.platform.simplifii.com/api/v1/cards",
        {
          card_unique_code: response1.response.unique_code,
          action: "SetPin",
          pin,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.msg) {
        notification.success({
          message: response.data.msg,
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
      setEditPin(false); // Close edit mode
    }
  };

  const d = localStorage.getItem("data");
  const data = JSON.parse(d);

  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Modal
      title="User Details"
      visible={open}
      onCancel={handleClose}
      footer={null}
      width={isSmallScreen ? "100%" : "600px"}
      style={{ borderRadius: isSmallScreen ? 0 : 15 }}
      // bodyStyle={{ padding: '1px' }}
    >
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: 8 }}>
              {response.name || "N/A"}
            </Title>
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <IdcardOutlined /> Department & Section:
                  </Text>
                  <Text>{`${data[0].dept} - ${data[0].section}` || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <MailOutlined /> Email:
                  </Text>
                  <Text>{response.email || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <PhoneOutlined /> Mobile:
                  </Text>
                  <Text>{response.mobile || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <SafetyOutlined /> Admission Number:
                  </Text>
                  <Text>{response.username || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <LockOutlined /> Roll Number:
                  </Text>
                  <Text>{response.string4 || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <CalendarOutlined /> Term:
                  </Text>
                  <Text>
                    {`Year: ${response.int3} Semester: ${response.int4}` ||
                      "N/A"}
                  </Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <CalendarOutlined /> Passing Year (IFN back):
                  </Text>
                  <Text>{response.int6 || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <FieldTimeOutlined /> Last Login Time:
                  </Text>
                  <Text>{response.last_login_time || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <SafetyOutlined /> Role:
                  </Text>
                  <Text>{response.role || "N/A"}</Text>
                </Space>
              </Col>
              <Col span={isSmallScreen ? 24 : 12}>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <KeyOutlined /> PIN:
                  </Text>
                  {editPin ? (
                    <Input
                      placeholder="Edit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      addonAfter={
                        <>
                          <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={updatePin}
                          />
                          <Button
                            type="danger"
                            icon={<CloseOutlined />}
                            onClick={() => setEditPin(false)}
                          />
                        </>
                      }
                      status={
                        pin.length > 0 &&
                        (!pin.match(/^\d{4}$/) || pin < 1000 || pin > 9999)
                          ? "error"
                          : ""
                      }
                      help={
                        pin.length > 0 &&
                        (!pin.match(/^\d{4}$/) || pin < 1000 || pin > 9999)
                          ? "PIN must be a four-digit number between 1000 and 9999"
                          : ""
                      }
                    />
                  ) : (
                    <Text onClick={() => setEditPin(true)}>
                      {pin1 || "N/A"}
                    </Text>
                  )}
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Text type="secondary" style={{ padding: "0 16px" }}>
        Instructions: To change PIN, click on the PIN.
      </Typography.Text>
    </Modal>
  );
}

export default UserDialog;
