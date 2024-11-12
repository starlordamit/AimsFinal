// frontend/src/pages/QuizWaitingPage.js

import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { useHistory } from "react-router-dom";
import moment from "moment";

const QuizWaitingPage = () => {
  const history = useHistory();
  const [timeLeft, setTimeLeft] = useState(null);
  const quizDetails = JSON.parse(localStorage.getItem("quizDetails"));

  useEffect(() => {
    if (!quizDetails) {
      history.push("/");
      return;
    }

    const startTime = moment(quizDetails.response.data.start_time);
    const now = moment(quizDetails.time_now);
    const diff = startTime.diff(now);

    if (diff <= 0) {
      history.push("/quiz");
    } else {
      setTimeLeft(diff);
      const timer = setInterval(() => {
        const newDiff = startTime.diff(moment());
        if (newDiff <= 0) {
          clearInterval(timer);
          history.push("/quiz");
        } else {
          setTimeLeft(newDiff);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [history, quizDetails]);

  return (
    <Card title="Quiz will start soon">
      {timeLeft !== null ? (
        <p>Time remaining: {moment.utc(timeLeft).format("HH:mm:ss")}</p>
      ) : (
        <p>Loading...</p>
      )}
      <Button
        type="primary"
        onClick={() => history.push("/quiz")}
        disabled={timeLeft > 0}
      >
        Go to Quiz
      </Button>
    </Card>
  );
};

export default QuizWaitingPage;
