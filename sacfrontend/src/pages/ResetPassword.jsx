import React, { useState } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", marginBottom: "20px", textAlign: "center" }}>Reset Password</h2>

        {message && <div style={{ background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", textAlign: "center" }}>{message}</div>}
        {error && <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#0F172A", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              minLength={6}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#0F172A", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
              minLength={6}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button type="submit" style={{ width: "100%", background: "#0077FF", color: "white", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "700", cursor: "pointer", transition: "background 0.2s" }}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
