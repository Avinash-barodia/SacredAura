import React, { useState, useEffect } from "react";
import { FaEnvelope, FaCommentDots } from "react-icons/fa";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* MAIN SECTION */
  const section = {
    background: "rgb(243, 244, 246)", // FIXED
    padding: isMobile ? "40px 20px" : "60px 40px",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh"
  };

  /* TITLE */
  const pageTitle = {
    textAlign: "center",
    color: "#0b2940", // FIXED (dark text)
    fontSize: isMobile ? "28px" : "42px",
    marginBottom: "40px",
    fontWeight: "700"
  };

  /* CONTAINER */
  const container = {
    maxWidth: "1200px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
    gap: isMobile ? "30px" : "60px"
  };

  /* INPUT */
  const input = {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    background: "#ffffff",
    color: "#000"
  };

  const label = {
    color: "#1e293b", // FIXED
    marginBottom: "6px",
    display: "block",
    fontWeight: "600"
  };

  /* BUTTON */
  const button = {
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "30px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 8px 20px rgba(0,114,255,0.3)"
  };

  /* RIGHT CARD */
  const helpCard = {
    background: "#ffffff", // FIXED
    backdropFilter: "blur(10px)",
    padding: isMobile ? "20px" : "35px",
    borderRadius: "20px",
    color: "#000", // FIXED
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
  };

  const iconRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "14px",
    fontSize: "15px",
    color: "#0b2940" // FIXED
  };

  return (
    <section style={section}>
      <h1 style={pageTitle}>Get In Touch</h1>

      <div style={container}>
        {/* LEFT FORM */}
        <div>
          <h3 style={{ color: "#0b2940" }}>Send Us An Email</h3>

          <h2 style={{ color: "#0b2940", marginBottom: "25px" }}>
            Ask us anything! We're here to help.
          </h2>

          <label style={label}>Name</label>
          <input style={input} placeholder="Enter your name" />

          <label style={label}>Phone</label>
          <input style={input} placeholder="Enter your phone" />

          <label style={label}>Email</label>
          <input style={input} placeholder="Enter your email" />

          <label style={label}>Comment</label>
          <textarea
            style={{ ...input, height: "120px" }}
            placeholder="Write your message..."
          />

          <button
            style={button}
            onMouseOver={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) =>
              (e.target.style.transform = "translateY(0)")
            }
          >
            SUBMIT CONTACT
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div style={helpCard}>
          <h1 style={{ fontSize: isMobile ? "26px" : "34px" }}>
            Live Help
          </h1>

          <p style={{ lineHeight: "1.6", color: "#334155" }}>
            If you have any issue or question, contact our support team.
            If we aren’t available, drop us an email and we will respond
            within 24 hours.
          </p>

          <div style={iconRow}>
            <FaCommentDots />
            <span>+91 8806416520</span>
          </div>

          <div style={iconRow}>
            <FaEnvelope />
            <span>support@sacredaura.com</span>
          </div>

          <h3 style={{ marginTop: "20px" }}>Office</h3>
          <p style={{ color: "#334155" }}>
            Parvati Near Shiv Prasad Society<br />
            Sadashiv Peth Pune City<br />
            Maharashtra – 411030
          </p>

          <h3>Opening Hours:</h3>
          <p style={{ color: "#334155" }}>
            MON to SAT: 9:00AM – 06:00PM
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;