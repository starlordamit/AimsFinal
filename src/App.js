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
// import { useTheme } from "@mui/material/styles";
// import { useMediaQuery } from "@mui/material";
import QuizReviewPage from "./pages/quiz";
import QuestionListPage from "./pages/quiz1";
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
        <Route path="/quiz" element={<QuizReviewPage />} />
        <Route path="/quiz1" element={<QuestionListPage />} />
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
