// frontend/src/api/dummyQuizServer.js

export const fetchQuizDetails = async (params) => {
  // Dummy API call
  if (
    params.quiz_uc === "OG40" &&
    params.user_unique_code === "2022B1541129" &&
    params.pin === "1486"
  ) {
    return {
      response: {
        data: {
          total_marks: "40",
          id: 8809,
          cdata: {
            subject: "",
            course_name: "Human Values",
            instructions: "OK",
            date_formatted: "02-May-2024",
            start_end_time: "10:45am - 11:30am",
            academic_session: "2023-24",
            end_time_formatted: "11:30am 02-May-2024",
            login_time_formatted: "10:35am 02-May-2024",
            start_time_formatted: "10:45am 02-May-2024",
            debarred_students_count: "0",
            exempted_students_count: "0",
          },
          unique_code: "OG40",
          login_time: "2024-05-02 10:35:00",
          batch: "2026",
          section: "A",
          faculty_name: "ROHIT RASTOGI",
          master_course_code: "BVE401",
          dept: "CSE (DS)",
          list_id: "15362",
          group: null,
          course_id: 6793343,
          batch_id: 961,
          semester: 4,
          faculty_id: 5697753,
          dept_id: 771,
          cf_id: 6793345,
          duration: 45,
          login_window: 10,
          questions_count: "40",
          start_time: "2024-05-02 10:45:00",
          end_time: "2024-05-02 11:30:00",
        },
      },
      time_now: "2024-05-02 10:35:00",
    };
  } else {
    return null;
  }
};

export const fetchQuestions = async () => {
  // Return the list of questions as dummy data
  return {
    response: {
      data: [
        {
          CO: "CO4",
          id: 6719778,
          type: "MSQ",
          marks: 1,
          options: [
            "<p>Plants and Animals</p>",
            "<p>Recyclability and self-regulation</p>",
            "<p>Extremism and tolerance</p>",
            "<p>Demand and supply</p>",
          ],
          question:
            "<p><strong>There is _____________ and __________ in nature</strong></p><p>&nbsp;</p>",
          topic_name:
            "Whole existence as Co-existence Understanding the harmony in Nature CO4",
          bloom_level: "K1",
          time_to_solve: 1,
          submitted_answer: null,
          multiple_correct: 0,
        },
        {
          CO: "CO3",
          id: 6711516,
          type: "MSQ",
          marks: 1,
          options: [
            "<p>Purpose</p>",
            "<p>Person</p>",
            "<p>Intention</p>",
            "<p>Competence</p>",
          ],
          question:
            "<p>Doubt on ____________ is a major reason for problems in relationship.</p>",
          topic_name:
            "Difference between intention and competence, Understanding the meaning of Samman, CO3",
          bloom_level: "K1",
          time_to_solve: 1,
          submitted_answer: null,
          multiple_correct: 0,
        },
        // Include all other questions provided
        // For brevity, only a few are shown here
        {
          CO: "CO4",
          id: 6719745,
          type: "MSQ",
          marks: 1,
          options: [
            "<p>Composition</p>",
            "<p>Decomposition</p>",
            "<p>Composition and decomposition</p>",
            "<p>None of the above</p>",
          ],
          question:
            "<p><strong>The activities in material order is/are&nbsp;</strong></p>",
          topic_name:
            "Inter connectedness, and mutual fulfillment among the four orders of nature- recyclability and self-regulation in nature CO4",
          bloom_level: "K1",
          time_to_solve: 1,
          submitted_answer: null,
          multiple_correct: 0,
        },
        // ... Add the rest of the questions here
        // You can copy all the question objects from your data
      ],
    },
  };
};

export const submitAnswer = async (params) => {
  // Simulate submitting an answer to the dummy server
  return {
    msg: "Answer successfully recorded",
    time_now: "2024-05-02 10:51:05",
    start_time: "2024-05-02 10:45:00",
    end_time: "2024-05-02 11:30:00",
    response: {
      data: {},
    },
  };
};

export const submitQuiz = async (params) => {
  // Simulate submitting the quiz to the dummy server
  return {
    msg: "Quiz submitted successfully",
    quiz_uc: params.quiz_uc,
    user_unique_code: params.user_unique_code,
    pin: params.pin,
  };
};
