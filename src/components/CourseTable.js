import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { tableCellClasses } from "@mui/material/TableCell";

import ResponsiveNavBar from "../components/Navbar";
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
//   cursor: "default", // Make rows non-clickable
// }));
function CourseTable() {
  const data1 = sessionStorage.getItem("data");
  const data = JSON.parse(data1);

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
  return (
    <div>
      {ResponsiveNavBar && <ResponsiveNavBar />}
      <TableContainer component={Paper} sx={{ p: 2, mt: 7 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell align="right">Faculty Name</StyledTableCell>
              <StyledTableCell align="right">Course Code</StyledTableCell>
              {/* <TableCell align="right">Dept</TableCell>
            <TableCell align="right">Semester</TableCell> */}
              {/* <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Total Lectures</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, data.length - 1).map((item, index) => (
              <TableRow
                key={item.id || index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {item.cdata.course_name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.faculty_name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.cdata.course_code}
                </StyledTableCell>
                {/* <StyledTableCell align="right">{item.status}</StyledTableCell>
                <StyledTableCell align="right">
                  {item.attendance_summary.Total}
                </StyledTableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CourseTable;
