import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Updated path
import Dashboard from "./pages/Dashboard"; // Updated path
// import ResponsiveNavBar from "./components/Navbar";
// import TimeTable from "./components/TimeTable";
// import AttendancePieChart from "./components/AttendancePieChart";
import AttendanceTable from "./pages/AttendanceTable";
// import CssBaseline from "@mui/material/CssBaseline";
// import { Box } from "@mui/material";
// import ResponsiveNavBar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseTable from "./components/CourseTable";
import TodayLectures from "./components/TodayTimeTable";
import { Analytics } from "@vercel/analytics/react";
import CompletedQuizzes from "./pages/CompletedQuizzes";
import AttemptQuiz from "./pages/QuizPage";
// import { useTheme } from "@mui/material/styles";
// import { useMediaQuery } from "@mui/material";

function App() {
  // const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    // <Router>
    //   <Routes>
    //     {" "}
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/" element={<Login />} />
    //     <Route path="/timetable" element={<TimeTable />} />
    //     <Route path="/attendance" element={<AttendanceTable />} />
    //     <Route path="/dashboard" element={<Dashboard />} />
    //     {/* <Route path="/at" element={<AttendanceTable />} /> */}
    //   </Routes>
    // </Router>
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/a" element={<TodayLectures />} />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <CourseTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/timetable" element={<TimeTable />} /> */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendanceTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <CompletedQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz1"
          element={
            <ProtectedRoute>
              <AttemptQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Add more protected routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
