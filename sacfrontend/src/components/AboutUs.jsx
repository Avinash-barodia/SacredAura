import React from "react";

const AboutUs = () => {

  const sectionStyle = {
    padding: "10px 20px",
    background: "#f2f2f2",
    fontFamily: "Arial, sans-serif"
  };

  const container = {
    maxWidth: "1200px",
    margin: "auto",
    padding: "50px 30px",
    borderRadius: "15px"
  };

  const heading = {
    textAlign: "center",
    marginBottom: "40px"
  };

  const missionBox = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "40px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
  };

  const grid = {
    display: "grid",
    gridTemplateColumns:
      window.innerWidth < 600
        ? "1fr"
        : window.innerWidth < 992
        ? "repeat(2,1fr)"
        : "repeat(3,1fr)",
    gap: "25px"
  };

  const card = {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
    transition: "0.3s"
  };

  const footer = {
    marginTop: "50px",
    textAlign: "center",
    color: "#334155",
    fontSize: "17px",
    lineHeight: "1.8"
  };

  return (
    <section style={sectionStyle}>
      <div style={container}>

        {/* Heading */}
        <div style={heading}>

          <p
            style={{
              color: "#006895",
              fontWeight: "600",
              letterSpacing: "2px",
              marginBottom: "10px"
            }}
          >
            ABOUT US
          </p>

          <h1
            style={{
              color: "#0f172a",
              fontSize: window.innerWidth < 600 ? "28px" : "38px",
              marginBottom: "20px",
              fontWeight: "700"
            }}
          >
            SACREDAURA TECHNOLOGIES LLP
          </h1>

          <p
            style={{
              color: "#475569",
              fontSize: "18px",
              lineHeight: "1.9",
              maxWidth: "900px",
              margin: "auto"
            }}
          >
            Sacredaura Technologies LLP is a fast-growing firm dedicated to
            delivering cutting-edge automation solutions for modern living and
            commercial spaces. Our smart automation systems are designed to
            enhance comfort, operational efficiency, safety, and sustainability
            through intelligent technology integration. We specialize in
            creating connected environments where lighting, climate control,
            security, and hygiene systems can be managed seamlessly through
            mobile devices or voice-enabled platforms.
          </p>

        </div>

        {/* Mission */}
        <div style={missionBox}>
          <h2 style={{ color: "#22c55e" }}>Our Mission</h2>

          <p style={{ color: "#475569", lineHeight: "1.8" }}>
            Our mission is to enhance comfort, efficiency, and sustainability by
            implementing intelligent automation technologies that simplify
            everyday living while optimizing energy usage for residential,
            commercial, and industrial environments.
          </p>
        </div>

        {/* Services */}
        <div style={grid}>

          <div style={card}>
            <h3 style={{ color: "#006895" }}>🏠 Home Automation</h3>
            <p style={{ color: "#475569" }}>
              Seamless control of lighting, climate, security, and appliances
              through smartphone or voice-enabled automation systems.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ color: "#006895" }}>💡 Light Automation</h3>
            <p style={{ color: "#475569" }}>
              Energy-efficient LED lighting solutions featuring adaptive
              dimming, daylight harvesting, and centralized remote management.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ color: "#006895" }}>🚿 Hygiene Automation</h3>
            <p style={{ color: "#475569" }}>
              Touch-free hygiene solutions including automatic faucets,
              urinal flush sensors, and sanitary dispensers that improve
              cleanliness while conserving water and power.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div style={footer}>
          <p>
            Our solutions are built on reliable hardware, intuitive software,
            and a strong commitment to quality, ensuring easy installation,
            seamless integration, and minimal maintenance requirements.
          </p>

          <p style={{ color: "#22c55e", fontWeight: "600" }}>
            We would be delighted to support your upcoming projects and explore
            partnerships that bring smarter and healthier environments to your
            customers.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;