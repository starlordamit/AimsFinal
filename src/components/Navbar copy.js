import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  ListItemIcon,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import UserDialog from "../pages/UserDialog";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DateRangeIcon from "@mui/icons-material/DateRange";

function ResponsiveNavBar({ pro }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate(); // Hook for navigation
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");

  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  //   const a1 = sessionStorage.getItem("token");
  //   const a2 = sessionStorage.getItem("userDetails");
  //   const a3 = sessionStorage.getItem("data");
  //   const chk = a1 && a2 && a3;
  //   navigate(chk ? "/dashboard" : "/login");

  const logout = () => {
    sessionStorage.removeItem("token"); // Assuming token is stored in sessionStorage
    sessionStorage.removeItem("userDetails");
    sessionStorage.removeItem("data");
    localStorage.removeItem("timeTableData");
    navigate("/login");
  };
  const handleUserIconClick = () => {
    setOpen(true);
  };

  const drawer = (
    <Box sx={{ width: 250, paddingTop: theme.spacing(2) }}>
      <List>
        <ListItem
          button
          onClick={() => {
            setDrawerOpen(false);
            navigate("/dashboard");
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={handleUserIconClick}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setDrawerOpen(false);
            navigate("/attendance");
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
            setDrawerOpen(false);
            logout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar
      position="static"
      sx={{ width: "100%", boxShadow: 3, bgcolor: "primary.dark" }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ marginRight: theme.spacing(2) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              AIMS ka PAPA
            </Typography>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="div">
              AIMS ka PAPA
            </Typography>
            <Box>
              <Button
                startIcon={<HomeIcon />}
                color="inherit"
                onClick={() => navigate("/dashboard")}
              ></Button>
              <Button
                color="inherit"
                onClick={handleUserIconClick}
                // startIcon={<AccountBoxIcon />}
              >
                Profile
              </Button>
              <Button color="inherit" onClick={() => navigate("/attendance")}>
                Attendance Details
              </Button>
              <Button
                color="inherit"
                onClick={logout}
                startIcon={<LogoutIcon />}
              ></Button>
            </Box>
          </Box>
        )}
      </Toolbar>
      <UserDialog
        open={open}
        handleClose={handleClose}
        userDetails={userDetails}
      />
    </AppBar>
  );
}

export default ResponsiveNavBar;
