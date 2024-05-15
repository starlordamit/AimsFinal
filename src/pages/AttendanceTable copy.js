import React from "react";
import { styled } from "@mui/material/styles";
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
import { tableCellClasses } from "@mui/material/TableCell";
import ResponsiveNavBar from "../components/Navbar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark, // Change the header color here
    color: theme.palette.common.white,
    cursor: "default", // Make it appear non-clickable
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    cursor: "default", // Make body cells appear non-clickable
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  cursor: "default", // Make rows non-clickable
}));

// Assuming data is imported or defined somewhere above this component
const d = sessionStorage.getItem("data");
const data = JSON.parse(d);

function AttendanceTable() {
  return (
    <div>
      {ResponsiveNavBar && <ResponsiveNavBar />}
      <TableContainer component={Paper} sx={{ p: 2, mt: 7 }}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Course Name</StyledTableCell>
              {/* <StyledTableCell align="right">Faculty Name</StyledTableCell> */}
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
                {/* <StyledTableCell align="right">
                  {item.faculty_name}
                </StyledTableCell> */}
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
