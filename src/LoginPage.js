// frontend/src/pages/LoginPage.js

import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { fetchQuizDetails } from "../api/dummyQuizServer";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetchQuizDetails(values);
      if (response && response.response) {
        // उपयोगकर्ता डेटा को localStorage में संग्रहीत करें
        localStorage.setItem("quizDetails", JSON.stringify(response));
        localStorage.setItem("userInfo", JSON.stringify(values));
        message.success("Login successful!");
        history.push("/quiz-waiting");
      } else {
        message.error("Quiz not found or invalid credentials");
      }
    } catch (error) {
      message.error("Error fetching quiz details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quiz Login">
      <Form onFinish={onFinish}>
        <Form.Item
          name="quiz_uc"
          label="Quiz Code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="user_unique_code"
          label="Admission Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="pin" label="PIN" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
