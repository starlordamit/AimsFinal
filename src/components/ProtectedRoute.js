// src/components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Ensure the path is correct based on your folder structure

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  console.log("Is Authenticated:", isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
