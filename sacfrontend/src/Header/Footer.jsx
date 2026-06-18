import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import logo from "../Assest/logo.png";

export default function Footer() {
  const [screen, setScreen] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const footerGrid = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: screen > 900 ? "2fr 1fr 1fr 1fr" : screen > 600 ? "repeat(2, 1fr)" : "1fr",
    gap: "40px",
    textAlign: screen < 600 ? "center" : "left",
  };

  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #041C32, #062548, #041C32)",
        color: "#EAF4FF",
        padding: screen < 500 ? "60px 20px 20px" : "80px 40px 20px",
        minHeight: "280px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={footerGrid}>
        {/* Column 1: Logo & Description */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", justifyContent: screen < 600 ? "center" : "flex-start" }}>
            <img src={logo} alt="SacredAura Logo" style={{ width: "40px", filter: "brightness(0) invert(1)" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0, color: "#0077FF", letterSpacing: "1px" }}>
              SACREDAURA
            </h3>
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#9CA3AF", marginBottom: "24px" }}>
            Smart solutions for a connected<br />and automated tomorrow.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: screen < 600 ? "center" : "flex-start" }}>
            <Icon><FaFacebookF /></Icon>
            <Icon><FaTwitter /></Icon>
            <Icon><FaInstagram /></Icon>
            <Icon><FaLinkedinIn /></Icon>
          </div>
        </div>

        {/* Column 2: Shop */}
        <div>
          <FooterTitle title="Shop" />
          <FooterLink text="All Products" to="/shop" />
          <FooterLink text="Home Automation" to="/shop" />
          <FooterLink text="Light Automation" to="/shop" />
          <FooterLink text="Hygiene Automation" to="/shop" />
        </div>

        {/* Column 3: Company */}
        <div>
          <FooterTitle title="Company" />
          <FooterLink text="About Us" to="/about" />
          <FooterLink text="Blog" to="/blog" />
          <FooterLink text="Contact Us" to="/contact" />
        </div>

        {/* Column 4: Customer Support */}
        <div>
          <FooterTitle title="Customer Support" />
          <FooterLink text="FAQs" to="/faq" />
          <FooterLink text="Shipping Policy" to="/shipping-policy" />
          <FooterLink text="Returns & Refunds" to="/refund-policy" />
          <FooterLink text="Terms & Conditions" to="/terms-conditions" />
          <FooterLink text="Privacy Policy" to="/privacy-policy" />
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        style={{
          marginTop: "60px",
          textAlign: "center",
          fontSize: "13px",
          color: "#64748B",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "20px",
        }}
      >
        © 2025 SacredAura Technologies. All Rights Reserved.
      </div>
    </footer>
  );
}

const FooterTitle = ({ title }) => (
  <h4 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>{title}</h4>
);

const FooterLink = ({ text, to }) => (
  <Link to={to} style={{ textDecoration: "none", display: "block", marginBottom: "12px" }}>
    <span
      style={{
        fontSize: "14px",
        cursor: "pointer",
        color: "#9CA3AF",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.target.style.color = "#0077FF")}
      onMouseLeave={(e) => (e.target.style.color = "#9CA3AF")}
    >
      {text}
    </span>
  </Link>
);

const Icon = ({ children }) => (
  <div
    style={{
      width: "36px",
      height: "36px",
      background: "rgba(255,255,255,0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      cursor: "pointer",
      color: "#9CA3AF",
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#0077FF";
      e.currentTarget.style.color = "#FFFFFF";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      e.currentTarget.style.color = "#9CA3AF";
    }}
  >
    {children}
  </div>
);