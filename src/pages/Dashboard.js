import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Grid } from "@mui/material";
// import TimeTable from "../components/TimeTable";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import ResponsiveNavBar from "../components/Navbar";

// import AttendanceTable from "../pages/AttendanceTable";
import TimeTable from "../components/TimeTable";
import AttendancePieChart from "../components/AttendancePieChart";
// import IndianClock from "../components/IndianClock";
// import UserDialog from "../pages/UserDialog";
// import { useState } from "react";
import NoticeBoard from "../components/NoticeBoard";

function Dashboard() {
  const navigate = useNavigate();
  //   if (!tok) {
  //     navigate("/login");
  //   }
  //   const [showTimeTable, setShowTimeTable] = useState(true);
  //   const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  //   const [data, setData] = useState([]);
  //   const [open, setOpen] = useState(false);
  //   const [showAttendance, setShowAttendance] = useState(false);

  //   const apiUrl =
  //     "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";

  //   const [index, setIndex] = useState(0);
  //   const texts = ["Text 1", "Text 2"];

  //   const handleSwipe = () => {
  //     setIndex((index + 1) % texts.length);
  //   };
  const notices =
    "Follow me On Instagram @i.am.amit.yadav 👀";

  const noticeArray = notices.split(",").map((notice) => notice.trim());

  useEffect(() => {
    const apiUrl =
      "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        });
        const json = await response.json();
        console.log("yes created");

        // setData(json.response.data); // Adjust according to actual API response structure
        localStorage.setItem("data", JSON.stringify(json.response.data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        navigate("/login"); // Redirect to login on failure
      }
    };

    fetchData();
  }, [navigate]);

  //   const handleUserIconClick = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  //   const toggleAttendanceTable = () => {
  //     setShowAttendance(!showAttendance);
  //   };
  //   const toggleTimeTable = () => {
  //     setShowTimeTable(!showTimeTable);
  //   };

  return (
    <div>
      <ResponsiveNavBar />
      {/* <div
        onClick={handleSwipe}
        style={{
          cursor: "pointer",
          padding: "20px",
          border: "1px solid black",
        }}
      >
        {texts[index]}
      </div> */}
      <Container component="main" maxWidth="100%">
        <Box
          sx={{
            mt: 1,
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* <Button
            startIcon={<VisibilityIcon />}
            onClick={toggleAttendanceTable}
            variant="contained"
            color="primary"
          >
            {showAttendance ? "Hide Attendance" : "Show Attendance"}
          </Button> */}
        </Box>
        {noticeArray.map((notice, index) => (
          <NoticeBoard key={index} notice={notice} />
        ))}
        {/* <UserDialog
          open={open}
          handleClose={handleClose}
          userDetails={userDetails}
        /> */}
        {/* <Box sx={{ mt: 4, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AttendancePieChart />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimeTable />
            </Grid>
            <Grid item xs={12}>
              {showAttendance && <AttendanceTable data={data} />}
            </Grid>
          </Grid>
        </Box> */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AttendancePieChart /> {/* Using key to trigger re-render */}
            </Grid>
            <Grid item xs={12} md={6}>
              <TimeTable />
            </Grid>
            {/* <Grid item xs={12}>
              {showAttendance && <AttendanceTable data={data} />}
            </Grid> */}
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default Dashboard;
