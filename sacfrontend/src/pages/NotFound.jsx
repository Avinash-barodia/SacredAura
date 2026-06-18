import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "40px 20px", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
      <FaExclamationTriangle style={{ fontSize: "72px", color: "#DCE8F5", marginBottom: "24px" }} />
      <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", margin: "0 0 16px 0" }}>404</h1>
      <p style={{ fontSize: "18px", color: "#64748B", marginBottom: "32px", maxWidth: "400px" }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <button 
          onClick={() => navigate("/")}
          style={{ background: "#0077FF", color: "white", padding: "14px 32px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,119,255,0.2)", transition: "transform 0.2s" }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          Go back home
        </button>
        <button 
          onClick={() => navigate("/shop")}
          style={{ background: "#F8FBFF", color: "#0077FF", padding: "14px 32px", borderRadius: "12px", border: "2px solid #DCE8F5", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#0077FF"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#DCE8F5"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Browse our shop
        </button>
      </div>
    </div>
  );
}

export default NotFound;
