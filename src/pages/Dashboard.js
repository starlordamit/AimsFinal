import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Grid } from "@mui/material";
import ResponsiveNavBar from "../components/Navbar";
import TimeTable from "../components/TimeTable";
import AttendancePieChart from "../components/AttendancePieChart";
import NoticeBoard from "../components/NoticeBoard";

function Dashboard() {
  const navigate = useNavigate();
  const notices =
    "Follow me On Instagram @i.am.amit.yadav 👀 , UPDATE !!! FIXED Leave Calculation for Maintain 75%";

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

        localStorage.setItem("data", JSON.stringify(json.response.data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <div>
      <ResponsiveNavBar />

      <Container component="main" maxWidth="100%">
        <Box
          sx={{
            mt: 1,
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        ></Box>
       {noticeArray.map((notice, index) => (
          <NoticeBoard key={index} notice={notice} />
        ))}

        <Box sx={{ mt: 4, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AttendancePieChart />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimeTable />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default Dashboard;
