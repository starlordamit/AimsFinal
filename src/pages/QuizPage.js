// AttemptQuiz.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  message,
  Radio,
  Checkbox,
  Statistic,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  // Title,
} from "antd";
// import Title from "antd/es/skeleton/Title";
import axios from "axios";
import moment from "moment";
import ResponsiveNavBar from "../components/Navbar";

const { Countdown } = Statistic;
const { Content } = Layout;
const { Text, Paragraph } = Typography;

const AttemptQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [quizData, setQuizData] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [questionResults, setQuestionResults] = useState({});
  const [summary, setSummary] = useState(null);

  // Extract req_id (quiz code) from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const req_id = params.get("req_id");

    // If req_id is missing, display the login form for entering quiz code
    if (!req_id) return;

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails && userDetails.response) {
      const { username, string10 } = userDetails.response;
      form.setFieldsValue({ username, pin: string10, quiz_uc: req_id });
      setCredentials({ username, pin: string10, quiz_uc: req_id });
      fetchQuizQuestions({ username, pin: string10, quiz_uc: req_id });
    } else {
      message.error("Please log in first.");
    }
  }, [location, form, navigate]);

  const fetchQuizQuestions = async (values) => {
    setLoading(true);
    try {
      const { username, pin, quiz_uc } = values;
      const response = await axios.post(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/getQuestionsForQuiz",
        { quiz_uc, user_unique_code: username, pin }
      );

      if (response.data.response && response.data.response.data) {
        const questions = response.data.response.data;
        questions.sort((a, b) => a.id - b.id);
        setQuizData(questions);

        const endTime = moment(response.data.end_time);
        const now = moment(response.data.time_now);
        setTimeRemaining(endTime.diff(now));

        if (response.data.summary?.ended_by_student) {
          setQuizSubmitted(true);
          setSummary(response.data.summary);
          message.info("You have already submitted this quiz.");
        }

        if (response.data.result) {
          const submittedAnswers = {};
          const results = {};
          Object.keys(response.data.result).forEach((questionId) => {
            const result = response.data.result[questionId];
            submittedAnswers[questionId] = result.submitted_answer.answer;
            results[questionId] = {
              correctAnswer: result.correct_answer,
              isCorrect: result.correct === 1,
            };
          });
          setAnswers(submittedAnswers);
          setQuestionResults(results);
        }
      } else {
        message.error("Failed to fetch questions.");
      }
    } catch (error) {
      console.log(error.response.data.msg);
      message.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = async (question, value) => {
    if (quizSubmitted) return;

    try {
      await axios.post(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/submitAnswer",
        {
          quiz_uc: credentials.quiz_uc,
          question_id: question.id,
          user_unique_code: credentials.username,
          answer: value,
          pin: credentials.pin,
        }
      );
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    } catch (error) {
      message.error("Failed to submit answer.");
    }
  };

  const handleSubmitQuiz = async () => {
    if (quizSubmitted) return;

    try {
      await axios.post(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/submitAndExitQuiz",
        {
          quiz_uc: credentials.quiz_uc,
          user_unique_code: credentials.username,
          pin: credentials.pin,
        }
      );
      message.success("Quiz submitted successfully.");
      setQuizSubmitted(true);
      await fetchQuizQuestions(credentials);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    let timer;
    if (timeRemaining !== null && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, quizSubmitted]);

  // Helper function to sanitize HTML and contain images within the container
  const sanitizeAndContainImages = (htmlContent) => {
    if (!htmlContent) return "";
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    div.querySelectorAll("img").forEach((img) => {
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.objectFit = "contain";
      img.style.borderRadius = "4px";
      img.style.margin = "8px 0";
    });
    return div.innerHTML;
  };

  // Show a quiz code entry form if quiz code is missing
  const onFinishQuizCode = async ({ quiz_uc }) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails && userDetails.response) {
      const { username, string10 } = userDetails.response;
      form.setFieldsValue({ username, pin: string10, quiz_uc });
      setCredentials({ username, pin: string10, quiz_uc });
      fetchQuizQuestions({ username, pin: string10, quiz_uc });
    } else {
      message.error("Please log in first.");
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <>
      {" "}
      <ResponsiveNavBar />
      <Layout style={{ minHeight: "100vh", background: "#f9f9f9" }}>
        <Content style={{ padding: "10px" }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={16}>
              {/* Show Quiz Code Login Form if quiz data is not yet loaded */}
              {!quizData && (
                <Card
                  title="Enter Quiz Code"
                  style={{ marginTop: "20px", borderRadius: "6px" }}
                >
                  <Form
                    form={form}
                    onFinish={onFinishQuizCode}
                    layout="vertical"
                  >
                    <Form.Item
                      name="quiz_uc"
                      label="Quiz Code"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the quiz code.",
                        },
                      ]}
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
              )}
              {/* Display Quiz Summary if quiz is submitted */}
              {quizSubmitted && summary && (
                <Card
                  style={{
                    // marginTop: "20px",
                    // padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: "#00000",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography.Title
                    level={4} // Adjust level as per your heading preference (1-5)
                    style={{
                      textAlign: "center",
                      color: "#4CAF50",
                      fontSize: 24,
                      fontWeight: 600,
                      marginBottom: 0, // Reduce space below heading
                    }}
                  >
                    Quiz Summary
                  </Typography.Title>
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Subject:</Text> {summary.master_course_code}
                    </Col>
                    <Col span={12}>
                      <Text strong>Total Marks:</Text> {summary.total_marks}
                    </Col>
                    <Col span={12}>
                      <Text strong>Marks Obtained:</Text>{" "}
                      {summary.marks_obtained}
                    </Col>
                    <Col span={12}>
                      <Text strong>Correct Answers:</Text> {summary.correct}
                    </Col>
                    <Col span={12}>
                      <Text strong>Incorrect Answers:</Text> {summary.incorrect}
                    </Col>
                    <Col span={12}>
                      <Text strong>Not Attempted:</Text> {summary.not_attempted}
                    </Col>
                  </Row>
                </Card>
              )}
              {/* Display Quiz Content if quiz data is loaded */}
              {quizData && !quizSubmitted && timeRemaining !== null && (
                <Countdown
                  title="Time Remaining"
                  value={Date.now() + timeRemaining}
                  onFinish={handleSubmitQuiz}
                  style={{
                    marginBottom: "20px",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                />
              )}
              {quizData?.map((question, index) => {
                const userAnswer = answers[question.id];
                const result = questionResults[question.id];
                const correctAnswer = result?.correctAnswer;

                return (
                  <Card
                    key={question.id}
                    title={
                      <Text style={{ fontSize: "18px", fontWeight: 500 }}>
                        Question {index + 1}
                      </Text>
                    }
                    style={{
                      marginTop: "16px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                      background: "#ffffff",
                    }}
                    bordered={false}
                  >
                    <Paragraph
                      style={{ textAlign: "justify", fontSize: "15px" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitizeAndContainImages(question.question),
                        }}
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      />
                    </Paragraph>
                    {question.multiple_correct ? (
                      <Checkbox.Group
                        onChange={(values) =>
                          handleOptionChange(question, values)
                        }
                        value={userAnswer || []}
                        disabled={quizSubmitted}
                        style={{ width: "100%" }}
                      >
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: "8px",
                              padding: "8px",
                              backgroundColor:
                                quizSubmitted &&
                                correctAnswer?.includes(idx + 1)
                                  ? "#e6ffed"
                                  : userAnswer?.includes(idx + 1)
                                  ? "#ffe6e6"
                                  : "#f0f0f0",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Checkbox
                              value={idx + 1}
                              style={{ fontSize: "14px" }}
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeAndContainImages(option),
                                }}
                              />
                            </Checkbox>
                          </div>
                        ))}
                      </Checkbox.Group>
                    ) : (
                      <Radio.Group
                        onChange={(e) =>
                          handleOptionChange(question, e.target.value)
                        }
                        value={userAnswer}
                        disabled={quizSubmitted}
                        style={{ width: "100%" }}
                      >
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: "8px",
                              padding: "8px",
                              backgroundColor:
                                quizSubmitted && correctAnswer === idx + 1
                                  ? "#e6ffed"
                                  : userAnswer === idx + 1
                                  ? "#ffe6e6"
                                  : "#f0f0f0",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Radio value={idx + 1} style={{ fontSize: "14px" }}>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeAndContainImages(option),
                                }}
                              />
                            </Radio>
                          </div>
                        ))}
                      </Radio.Group>
                    )}
                  </Card>
                );
              })}
              {!quizSubmitted && quizData && (
                <Button
                  type="primary"
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    borderRadius: "6px",
                    fontSize: "15px",
                  }}
                  onClick={handleSubmitQuiz}
                  block
                >
                  Submit Quiz
                </Button>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default AttemptQuiz;
