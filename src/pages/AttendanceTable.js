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
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ResponsiveNavBar from "../components/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BlockIcon from "@mui/icons-material/Block";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const d = sessionStorage.getItem("data");
const data = JSON.parse(d);

const WideLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
  [`& .${theme.palette.progressBar}`]: {
    borderRadius: 5,
  },
}));

function AttendanceTable() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <div>
      {ResponsiveNavBar && <ResponsiveNavBar />}
      <Box sx={{ p: 2, mt: 7 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Summary
        </Typography>
        {isMobile ? (
          <Grid container spacing={2}>
            {data.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {item.cdata.course_name}
                    </Typography>
                    {item.attendance_summary.Present ? (
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <CheckCircleIcon color="success" />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body2">
                            Present: {item.attendance_summary.Present}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}
                    {item.attendance_summary.Absent ? (
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <CancelIcon color="error" />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body2">
                            Absent: {item.attendance_summary.Absent}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}
                    {item.attendance_summary.Leave ? (
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <EventAvailableIcon color="info" />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body2">
                            Leave: {item.attendance_summary.Leave}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}
                    {item.attendance_summary.Exempt ? (
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <BlockIcon color="action" />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body2">
                            Exempt: {item.attendance_summary.Exempt}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Typography variant="body2">
                          Total: {item.attendance_summary.Total}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Tooltip
                      title={`${item.attendance_summary.Percent}`}
                      placement="top"
                      arrow
                    >
                      <Box sx={{ mt: 1, position: "relative" }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {/* Attendance Percent: */}
                        </Typography>
                        <WideLinearProgress
                          variant="determinate"
                          value={parseFloat(
                            item.attendance_summary.Percent || 0
                          )}
                          sx={{ width: "100%", position: "relative" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {`${item.attendance_summary.Percent}`}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Course Name</StyledTableCell>
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
                      title={`${item.attendance_summary.Percent}`}
                      placement="top"
                      arrow
                    >
                      <StyledTableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {item.attendance_summary.Percent}
                        </Typography>
                      </StyledTableCell>
                    </Tooltip>
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

export default AttendanceTable;
