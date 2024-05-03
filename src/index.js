import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Ensure this path is correct
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
// import { TextField } from "@mui/material";

const container = document.getElementById("root");
const root = createRoot(container);

const theme = createTheme({
  palette: {
    mode: "light", // default light mode
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
