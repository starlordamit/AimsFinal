import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { PieChart } from "@mui/x-charts/PieChart";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

function AttendancePieChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const aa = sessionStorage.getItem("data");
  const xx = JSON.parse(aa);
  //   console.log("-----------------");
  //   console.log(xx.length);
  const new1 = xx[xx.length - 1].attendance_summary;

  console.log(new1.Total);
  console.log(new1.Present);

  function calc75(present, total) {
    const temp1 = present;
    var temp = (present / total) * 100;
    while (temp < 75) {
      total++;
      present++;
      temp = (present / total) * 100;
    }

    return present - temp1;
  }
  function leavefor75(present, total) {
    const temp1 = present;
    var temp = (present / total) * 100;
    while (temp > 75) {
      total++;
      present--;
      temp = (present / total) * 100;
    }
    console.log("leavefor75", temp);
    console.log("present", present);
    console.log("total", total);

    return temp1 - present;
  }
  const lectureneedfor75 = calc75(new1.Present, new1.Total);
  const leactureleavefor75 = leavefor75(new1.Present, new1.Total);

  const COLORS = ["#556BD6", "#FF6347", "#FFBB28", "#00C49F"];
  const data = [
    { name: "Present", value: new1.Present }, // Simulated values, replace with actual data from dd
    {
      name: "Absent",
      value: new1.Total - new1.Present,
    },
    { name: "Total", value: new1.Total },
  ];

  //   const renderCustomTooltip = ({ active, payload }) => {
  //     if (active && payload && payload.length) {
  //       return (
  //         <div
  //           style={{
  //             backgroundColor: "#fff",
  //             padding: "10px",
  //             border: "1px solid #ccc",
  //           }}
  //         >
  //           <p>{`${payload[0].name}: ${payload[0].value}`}</p>
  //           <p>{`${(payload[0].percent * 100).toFixed(0)}%`}</p>
  //         </div>
  //       );
  //     }
  //     return null;
  //   };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Typography
            variant="h6"
            align="center"
            fontSize={24}
            fontWeight={550}
          >
            Attendance Summary
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <PieChart>
              <Pie
                data={data.slice(0, 2)}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}`
                }
                outerRadius={isMobile ? 100 : 150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            {/* <PieChart
              series={[
                {
                  data: [data.slice(0, 2)],
                  innerRadius: 54,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 3,
                  startAngle: -96,
                  endAngle: 274,
                  cx: 152,
                  cy: 150,
                },
              ]}
            /> */}
          </ResponsiveContainer>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} mb={4}>
        <TableContainer
          component={Paper}
          style={{ maxWidth: "100%", margin: "auto" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">Count</TableCell>
                <TableCell align="right">For 75% [L]</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell align="right"> {row.value}</TableCell>
                </TableRow>
              ))} */}
              <TableRow>
                <TableCell>Present</TableCell>
                <TableCell align="right">{new1.Present}</TableCell>
                <TableCell align="right"> {lectureneedfor75}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Absent</TableCell>
                <TableCell align="right">{new1.Total - new1.Present}</TableCell>
                <TableCell align="right"> {leactureleavefor75}</TableCell>
                {/* <TableCell align="right"> {new1.Total - new1.Present}</TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell align="right">{new1.Total}</TableCell>
                <TableCell align="right">
                  {" "}
                  {leactureleavefor75 - lectureneedfor75}
                </TableCell>
                {/* <TableCell align="right"> {new1.Total}</TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
}

export default AttendancePieChart;
