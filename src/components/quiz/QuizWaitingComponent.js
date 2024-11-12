// frontend/src/components/quiz/QuizWaitingComponent.js

import React, { useEffect, useState } from "react";
import { Card } from "antd";
import moment from "moment";

const QuizWaitingComponent = ({ startTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const now = moment();
    const diff = startTime.diff(now);

    if (diff <= 0) {
      onTimeUp();
    } else {
      setTimeLeft(diff);
      const timer = setInterval(() => {
        const newDiff = startTime.diff(moment());
        if (newDiff <= 0) {
          clearInterval(timer);
          onTimeUp();
        } else {
          setTimeLeft(newDiff);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, onTimeUp]);

  return (
    <Card title="Quiz will start soon">
      {timeLeft !== null ? (
        <p>Time remaining: {moment.utc(timeLeft).format("HH:mm:ss")}</p>
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};

export default QuizWaitingComponent;
