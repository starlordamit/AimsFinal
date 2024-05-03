import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Button,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import UserDialog from "../pages/UserDialog";
import IndianClock from "./IndianClock";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";
import AutorenewTwoToneIcon from "@mui/icons-material/AutorenewTwoTone";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
function ResponsiveNavBar() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  //   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (prop) => (event) => {
    setPasswords({ ...passwords, [prop]: event.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };
  const atUrl =
    "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1";
  const ttUrl =
    "https://abes.platform.simplifii.com/api/v1/custom/getMyScheduleStudent";

  const fetchTimeTableData = async (date) => {
    const dayOfMonth = new Date().getDate();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(ttUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.response?.data) {
        const filteredData = response.data.response.data
          .filter((row) => row[`c${dayOfMonth}`] && row.course_name)
          .map((item) => ({
            ...item,
            timeText: new DOMParser().parseFromString(
              item[`c${dayOfMonth}`],
              "text/html"
            ).body.textContent,
          }));
        sessionStorage.setItem("timeTableData", JSON.stringify(filteredData));
        setSnackbarMessage("TIME TABLE DATA FETCHED");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Failed to fetch time table:", error);
    }
  };

  const fetchAttendanceData = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(atUrl, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });
      const json = await response.json();
      sessionStorage.setItem("data", JSON.stringify(json.response.data));
      //   alert("ATTENDANCE DATA FETCHED");
    } catch (error) {
      alert(error);
      console.error("Failed to fetch data:", error);
    }
  };

  const refreshPage = async () => {
    try {
      // Store the entire response for user details
      await fetchAttendanceData();
      await fetchTimeTableData();
      setSnackbarMessage("Data Refreshed Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      setSnackbarMessage("Data Refresh Error", error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      //   toast.error(error.response.data.msg || "Login error!");
    }
  };

  const token = sessionStorage.getItem("token");
  const username = JSON.parse(sessionStorage.getItem("userDetails")).response
    .username;

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setSnackbarMessage("Passwords does not match.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      Authorization: `Bearer ${token}`,
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Host: "abes.platform.simplifii.com",
      Origin: "https://abes.web.simplifii.com",
      Referer: "https://abes.web.simplifii.com/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    };
    const url = "https://abes.platform.simplifii.com/api/v1/cards";
    const data = {
      card_unique_code: username,
      action: "ChangePassword",
      current_password: passwords.currentPassword,
      password: passwords.newPassword,
    };

    try {
      const response = await axios.patch(url, data, { headers });
      if (response.data) {
        setSnackbarMessage("Password successfully changed!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setDialogOpen(false);
      } else {
        setSnackbarMessage("Failed to change password. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(
        error.response.data.msg || "Failed to change password."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Failed to change password:", error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ width: 250, paddingTop: theme.spacing(7) }}>
      <List>
        <ListItem
          button
          onClick={() => {
            navigate("/dashboard");
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setUserDialogOpen(true);
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" secondary="Change PIN Here" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            navigate("/subjects");
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon>
            <LocalLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Subjects Details" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            navigate("/attendance");
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="Attendance Details" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setDialogOpen(true);
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText
            primary="Change Password"
            color="primary"
            variant="contained"
          />
        </ListItem>
        <ListItem onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" color="primary" variant="contained" />
        </ListItem>

        {/* <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 0, display: false ? "none" : "inline-flex" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AIMS 2.0
          </Typography>
          <IndianClock />
          <IconButton
            color="inherit"
            aria-label="refresh"
            edge="end"
            onClick={refreshPage}
          >
            <AutorenewTwoToneIcon />
          </IconButton>

          {/* <Button color="inherit" onClick={() => setDialogOpen(true)}>
            Change Password
          </Button> */}

          {/* <Button
            onClick={logout}
            startIcon={<LogoutIcon />}
            color="inherit"
          ></Button> */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" },
          width: 250,
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          //   width: { sm: `calc(100% - ${false && drawerOpen ? 250 : 0}px)` },
          ml: { sm: `${false && drawerOpen ? 250 : 0}px` },
          mt: 8,
        }}
      >
        {/* Main content goes here */}
      </Box>
      <UserDialog
        open={userDialogOpen}
        handleClose={() => setUserDialogOpen(false)}
        userDetails={userDetails}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          Change Password
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type={showPassword.current ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={passwords.currentPassword}
            onChange={handleChange("currentPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => togglePasswordVisibility("current")}
                    edge="end"
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={passwords.newPassword}
            onChange={handleChange("newPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => togglePasswordVisibility("new")}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type={showPassword.confirm ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={passwords.confirmPassword}
            onChange={handleChange("confirmPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => togglePasswordVisibility("confirm")}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordChange} color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResponsiveNavBar;
