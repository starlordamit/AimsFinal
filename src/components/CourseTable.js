import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ResponsiveNavBar from "../components/Navbar";
import PersonIcon from "@mui/icons-material/Person";
import CodeIcon from "@mui/icons-material/Code";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    cursor: "default",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    cursor: "default",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  cursor: "default",
}));

function CourseTable() {
  const data1 = sessionStorage.getItem("data");
  const data = JSON.parse(data1);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <div>
      {ResponsiveNavBar && <ResponsiveNavBar />}
      <Box sx={{ p: 2, mt: 7 }}>
        <Typography variant="h6" gutterBottom>
          Course Details
        </Typography>
        {isMobile ? (
          <Grid container spacing={2}>
            {data.slice(0, data.length - 1).map((item, index) => (
              <Grid item xs={12} key={item.id || index}>
                <Card sx={{ p: 1 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 16, fontWeight: 600 }}
                    >
                      {item.cdata.course_name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ fontSize: 14 }}>
                        <strong>Faculty Name:</strong> {item.faculty_name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <CodeIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ fontSize: 14 }}>
                        <strong>Course Code:</strong> {item.cdata.course_code}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Course Name</StyledTableCell>
                  <StyledTableCell align="right">Faculty Name</StyledTableCell>
                  <StyledTableCell align="right">Course Code</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, data.length - 1).map((item, index) => (
                  <StyledTableRow key={item.id || index}>
                    <StyledTableCell component="th" scope="row">
                      {item.cdata.course_name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {item.faculty_name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {item.cdata.course_code}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
}

export default CourseTable;
