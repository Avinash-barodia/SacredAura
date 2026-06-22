import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {

  let user = null;
  try {
    const item = localStorage.getItem("user");
    if (!item || item === "undefined") {
      localStorage.removeItem("user");
    } else {
      user = JSON.parse(item);
    }
  } catch (err) {
    localStorage.removeItem("user");
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;