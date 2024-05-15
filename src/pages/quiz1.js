import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import axios from "axios";

function QuestionListPage() {
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizUC, setQuizUC] = useState("OG40");
  const [userUniqueCode, setUserUniqueCode] = useState("2022B1541129");
  const [pin, setPin] = useState("1233");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/getQuestionsForQuiz",
          {
            quiz_uc: quizUC,
            user_unique_code: userUniqueCode,
            pin: pin,
          }
        );
        console.log("API Response:", response.data);
        setQuestionsData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch questions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizUC, userUniqueCode, pin]);

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!questionsData) {
    return (
      <Container>
        <Typography variant="h6" gutterBottom>
          Failed to load questions data.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Question List
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      {questionsData.map((question) => {
        const userAnswerIndex = question.submitted_answer.answer - 1;
        const correctAnswerIndex = question.correct_choices - 1;
        return (
          <Paper
            key={question.id}
            sx={{
              padding: 2,
              marginBottom: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography variant="h6" gutterBottom>
              <div dangerouslySetInnerHTML={{ __html: question.question }} />
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {question.topic_name}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={userAnswerIndex}>
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={
                      <span dangerouslySetInnerHTML={{ __html: option }} />
                    }
                    sx={{
                      backgroundColor:
                        index === correctAnswerIndex
                          ? "#c8e6c9"
                          : index === userAnswerIndex &&
                            userAnswerIndex !== correctAnswerIndex
                          ? "#ffcdd2"
                          : "inherit",
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        );
      })}
    </Container>
  );
}

export default QuestionListPage;
