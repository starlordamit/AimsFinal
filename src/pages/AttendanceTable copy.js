import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ResponsiveNavBar from "../components/Navbar";

// import UserDialog from "../pages/UserDialog";

// Custom Styled Components for better visual appearance
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  fontWeight: "bold",
}));
// const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hover effects for rows
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));
const d = sessionStorage.getItem("data");
const data = JSON.parse(d);

function AttendanceTable({ data1 }) {
  return (
    <div>
      {/* {ResponsiveNavBar && <ResponsiveNavBar />} */}
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell align="right">Faculty Name</StyledTableCell>
              <StyledTableCell align="right">Present</StyledTableCell>
              <StyledTableCell align="right">Absent</StyledTableCell>
              <StyledTableCell align="right">Leave</StyledTableCell>
              <StyledTableCell align="right">Exempt</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">Percent</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell component="th" scope="row">
                  {item.cdata.course_name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.faculty_name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.attendance_summary.Present}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.attendance_summary.Absent}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.attendance_summary.Leave}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.attendance_summary.Exempt}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.attendance_summary.Total}
                </StyledTableCell>
                <Tooltip
                  title={`${item.attendance_summary.Percent}%`}
                  placement="top"
                  arrow
                >
                  <StyledTableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {item.attendance_summary.Percent}
                    </Typography>
                  </StyledTableCell>
                </Tooltip>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AttendanceTable;
