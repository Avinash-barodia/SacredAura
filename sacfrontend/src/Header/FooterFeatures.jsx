import React, { useEffect, useState } from "react";

/* ================= COMPONENT ================= */

export default function FooterFeatures() {

  const [screen, setScreen] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ✅ RESPONSIVE GRID */
  const featureGrid = {
    display: "grid",
    gridTemplateColumns:
      screen > 900
        ? "repeat(3, 1fr)"   // desktop same
        : screen > 600
        ? "repeat(2, 1fr)"   // tablet
        : "1fr",             // mobile
    gap: screen < 500 ? 20 : 40,
  };

  return (
    <div
      style={{
        background: "#ffffff",
        maxWidth: 1250,
        margin: "0 auto",
        padding: screen < 500 ? "30px 15px" : "50px 20px",
        position: "relative",
        zIndex: 4,
        marginBottom: -30,
      }}
    >
      <div style={featureGrid}>
        
        <Feature
          title="Damage-Free Delivery"
          desc="Your order, our responsibility delivered safe & sound!"
          icon="🚚"
          screen={screen}
        />

        <Feature
          title="Returns & Exchanges"
          desc="Shop with confidence return or exchange within 30 days!"
          icon="🔄"
          screen={screen}
        />

        <Feature
          title="Installation Service"
          desc="Find your perfect fit & leave the installation to our experts."
          icon="⚙️"
          screen={screen}
        />

      </div>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

const Feature = ({ title, desc, icon, screen }) => (
  <div
    style={{
      display: "flex",
      gap: screen < 500 ? 12 : 16,
      alignItems: "center",
      flexDirection: screen < 500 ? "column" : "row",
      textAlign: screen < 500 ? "center" : "left",
    }}
  >
    <div
      style={{
        fontSize: screen < 500 ? 28 : 36,
        minWidth: 40,
        textAlign: "center",
      }}
    >
      {icon}
    </div>

    <div>
      <h4
        style={{
          fontSize: screen < 500 ? 14 : 16,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: screen < 500 ? 13 : 14,
          color: "#666",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </div>
  </div>
);