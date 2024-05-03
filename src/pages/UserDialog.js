// import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Typography,
  Divider,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { TextField } from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";
// import Input from "@mui/material/Input";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/PersonOutline";
import ClassIcon from "@mui/icons-material/Class";
import EmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Smartphone";
// import SchoolIcon from "@mui/icons-material/ImportContacts";
import CalendarTodayIcon from "@mui/icons-material/EventNote";
import TimerIcon from "@mui/icons-material/Timer";
import KeyIcon from "@mui/icons-material/Key";
import SecurityIcon from "@mui/icons-material/Security";
// import Class from "@mui/icons-material/Class";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";

import * as React from "react";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Input from "@mui/material/Input";
// import FilledInput from "@mui/material/FilledInput";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
// import FormHelperText from "@mui/material/FormHelperText";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

function UserDialog({ open, handleClose, userDetails }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const [pin, setPin] = useState("");
  const [editPin, setEditPin] = useState(false);
  //   const token = sessionStorage.getItem("token");
  //   const [showPassword, setShowPassword] = React.useState(false);

  const { response } = userDetails;
  const uu = sessionStorage.getItem("userDetails");
  const response1 = JSON.parse(uu);
  //   const [values, setValues] = React.useState({
  //     password: "",

  //     showPassword: false,
  //   });
  const pin1 = sessionStorage.getItem("pin");
  //   setPin(sessionStorage.getItem("pin"));
  const updatePin = async () => {
    // const url = "https://abes.platform.simplifii.com/api/v1/cards";
    const t = sessionStorage.getItem("token");
    const token = t;
    // const newPin = pin;

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

    // const data = {
    //   card_unique_code: response1.unique_code,
    //   action: "SetPin",
    //   pin: newPin,
    // };
    // console.log(response.username);
    if (!pin.match(/^\d{4}$/) || pin < 1000 || pin > 9999) {
      setSnackbarMessage(
        "PIN must be a four-digit number between 1000 and 9999."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.patch(
        "https://abes.platform.simplifii.com/api/v1/cards",
        {
          card_unique_code: response1.response.unique_code,
          action: "SetPin",
          pin,
        },
        { headers }
      );

      if (response.data && response.data.msg) {
        setSnackbarMessage(response.data.msg);
        setSnackbarSeverity("success");
        sessionStorage.setItem("pin", pin);
      } else {
        setSnackbarMessage("Unknown response from server.");
        setSnackbarSeverity("warning");
      }
    } catch (error) {
      setSnackbarMessage("Failed to update PIN.");
      setSnackbarSeverity("error");
      console.error("Error updating PIN:", error);
    } finally {
      setSnackbarOpen(true);
      setEditPin(false); // Close edit mode
    }
  };
  //   const handleChange = (prop) => (event) => {
  //     setValues({ ...values, [prop]: event.target.value });
  //   };

  //   const handleClickShowPassword = () => {
  //     setValues({ ...values, showPassword: !values.showPassword });
  //   };

  //   const handleMouseDownPassword = (event) => {
  //     event.preventDefault();
  //   };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const d = sessionStorage.getItem("data");
  const data = JSON.parse(d);
  //   updatePin("2022b1541129", 7777);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={fullScreen ? "xs" : "sm"}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: theme.spacing(1, 2),
        }}
      >
        User Details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List sx={{ padding: 0 }}>
          <ListItem divider>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Name" secondary={response.name || "N/A"} />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <ClassIcon />
            </ListItemIcon>
            <ListItemText
              primary="Department & Section"
              secondary={data[0].dept + " - " + data[0].section || "N/A"}
            />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Email" secondary={response.email || "N/A"} />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText
              primary="Mobile"
              secondary={response.mobile || "N/A"}
            />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText
              primary="Admission Number"
              secondary={response.username || "N/A"}
            />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Roll Number"
              secondary={response.string4 || "N/A"}
            />
          </ListItem>
          <divider />
          <ListItem>
            <ListItemIcon>
              <KeyIcon />
            </ListItemIcon>
            {editPin ? (
              <TextField
                fullWidth
                label="Edit PIN"
                variant="outlined"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="submit new pin"
                        onClick={updatePin}
                        edge="end"
                        color="primary"
                      >
                        <DoneIcon color="#556BD6" />
                      </IconButton>
                      <IconButton
                        aria-label="cancel edit"
                        onClick={() => {
                          setEditPin(false);
                          setSnackbarOpen(false);
                        }}
                        edge="end"
                        color="secondary"
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  pin.length > 0 &&
                  (!pin.match(/^\d{4}$/) || pin < 1000 || pin > 9999)
                }
                helperText={
                  pin.length > 0 &&
                  (!pin.match(/^\d{4}$/) || pin < 1000 || pin > 9999)
                    ? "PIN must be a four-digit number between 1000 and 9999"
                    : ""
                }
              />
            ) : (
              <ListItemText
                primary="PIN (Click to Edit)"
                secondary={pin1 || "N/A"}
                onClick={() => {
                  setEditPin(true);
                  setPin(pin1);
                }}
              />
            )}
          </ListItem>

          <Divider />
          <ListItem divider>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText
              primary="Term"
              secondary={
                "Year : " + response.int3 + " Semester : " + response.int4 ||
                "N/A"
              }
            />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText
              primary="Passing Year (IFN back)"
              secondary={response.int6 || "N/A"}
            />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <TimerIcon />
            </ListItemIcon>
            <ListItemText
              primary="Last Login Time"
              secondary={response.last_login_time || "N/A"}
            />
          </ListItem>
          {/* <ListItem divider>
              <ListItemIcon>
                <KeyIcon />
              </ListItemIcon>
              <ListItemText
                primary="PIN"
                secondary={response.string10 || "N/A"}
              />
            </ListItem> */}

          <Divider />

          <InputAdornment position="end"></InputAdornment>

          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText primary="Role" secondary={response.role || "N/A"} />
          </ListItem>
          <Divider />
          <ListItem>
            <Typography variant="h9" sx={{ padding: theme.spacing(1, 0) }}>
              Instructions : To Change PIN Click on the PIN
            </Typography>
          </ListItem>
        </List>
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default UserDialog;
