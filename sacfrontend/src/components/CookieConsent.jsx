import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        boxSizing: "border-box",
        background: "#0F172A",
        color: "#F8FBFF",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "16px",
        zIndex: 9999,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ flex: "1 1 600px", fontSize: "14px", lineHeight: "1.5", textAlign: "center" }}>
        We use cookies to improve your experience and keep you logged in. By using SacredAura, you agree to our use of cookies.{" "}
        <Link to="/privacy-policy" style={{ color: "#0077FF", textDecoration: "underline", fontWeight: "600" }}>
          Learn more
        </Link>
      </div>
      <button
        onClick={handleAccept}
        style={{
          background: "#0077FF",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 24px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        Accept
      </button>
    </div>
  );
}

export default CookieConsent;
