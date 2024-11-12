// frontend/src/components/quiz/QuizComponent.js

import React, { useState, useEffect } from "react";
import { Button, Card, List, Radio, message } from "antd";

const QuizComponent = ({
  questions,
  onSubmitAnswer,
  onSubmitQuiz,
  loading,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleSubmitAnswer = (questionId) => {
    if (selectedAnswers[questionId] !== undefined) {
      onSubmitAnswer(questionId, selectedAnswers[questionId]);
    } else {
      message.error("Please select an answer first");
    }
  };

  return (
    <Card title="Quiz" loading={loading}>
      <List
        itemLayout="vertical"
        dataSource={questions}
        renderItem={(question) => (
          <List.Item key={question.id}>
            <Card
              title={
                <div dangerouslySetInnerHTML={{ __html: question.question }} />
              }
            >
              <Radio.Group
                onChange={(e) =>
                  handleAnswerSelect(question.id, e.target.value)
                }
                value={selectedAnswers[question.id]}
              >
                <List
                  dataSource={question.options}
                  renderItem={(option, index) => (
                    <List.Item>
                      <Radio value={index}>
                        <div dangerouslySetInnerHTML={{ __html: option }} />
                      </Radio>
                    </List.Item>
                  )}
                />
              </Radio.Group>
              <Button
                onClick={() => handleSubmitAnswer(question.id)}
                type="primary"
                style={{ marginTop: 10 }}
              >
                Submit Answer
              </Button>
            </Card>
          </List.Item>
        )}
      />
      <Button
        onClick={() => onSubmitQuiz(selectedAnswers)}
        type="primary"
        danger
        style={{ marginTop: 20 }}
      >
        Submit Quiz
      </Button>
    </Card>
  );
};

export default QuizComponent;
