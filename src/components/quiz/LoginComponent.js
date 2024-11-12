// components/Login.js
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

const Loginquiz = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (userDetails && userDetails.response) {
      const { username, string10 } = userDetails.response;

      // Redirect to quiz page with pre-filled code
      navigate(`/quiz1?req_id=${values.quiz_uc}`, {
        state: {
          username: username,
          pin: string10,
          quiz_uc: values.quiz_uc,
        },
      });
    } else {
      message.error("User details not found. Please log in.");
    }
  };

  return (
    <Card title="Enter Quiz Code" style={{ maxWidth: "400px", margin: "auto" }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="quiz_uc"
          label="Quiz Code"
          rules={[{ required: true, message: "Please input the quiz code!" }]}
        >
          <Input placeholder="Enter Quiz Code" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Start Quiz
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Loginquiz;
