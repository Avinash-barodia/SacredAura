import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function TopBar() {
  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        padding: "10px 20px",
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "Arial, sans-serif",
        letterSpacing: 0.3,
        borderBottom: "2px solid #ffffff",
      }}
    >

      {/* LEFT TEXT — shifted slightly right */}
      <div style={{ marginLeft: 100,fontSize:'16px' }}>
        Minimum order will be accepted Rs.500 |{" "}
        <span style={{ color: "#ffe600", fontWeight: "bold" }}>
          Use code " TECH " for 10% off!
        </span>{" "}
        | Order arrives in 7 days.
      </div>

      {/* SOCIAL ICONS — shifted more to the right */}
      <div
        style={{
          display: "flex",
          gap: "22px",
          fontSize: 20,
          cursor: "pointer",
          marginRight: 100, 
        }}
      >
        <FaFacebookF />
        <FaInstagram />
        <FaLinkedinIn />
      </div>

    </div>
  );
}
