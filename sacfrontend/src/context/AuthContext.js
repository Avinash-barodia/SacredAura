import React, { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

const getUserFromStorage = () => {
  try {
    const item = localStorage.getItem("user");
    if (!item || item === "undefined") {
      localStorage.removeItem("user");
      return null;
    }
    return JSON.parse(item);
  } catch (err) {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());

  /* ===== LOGIN ===== */
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data; 
  };

  const signup = async (data) => {
    const res = await api.post("/auth/signup", data);
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch(err) {}
    localStorage.removeItem("user");
    setUser(null);
  };

  const googleLogin = async (token) => {
    const res = await api.post("/auth/google", { token });
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
