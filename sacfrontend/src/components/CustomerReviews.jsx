import React, { useEffect, useState } from "react";

const reviews = [
  {
    name: "Facility Manager, Pune",
    rating: 5,
    comment:
      "We installed SACREDAURA hand dryers across our offices last quarter. The build is truly premium quality — sturdy, fast, and looks great. What impressed us most was the after-sale service. Their team was quick to respond and fixed a sensor issue within 24 hours. Highly recommended.",
  },
  {
    name: "Operations Head, Hospitality Group",
    rating: 5,
    comment:
      "SACREDAURA TECHNOLOGIES delivers on both product and service. The hand dryers are premium quality with fast 10–12 second drying and low maintenance.",
  },
  {
    name: "Verified Buyer",
    rating: 5,
    comment:
      "Premium quality product with best after sale service. Installation was smooth and service team is responsive.",
  },
  {
    name: "Facilities Manager, Restaurant Chain",
    rating: 5,
    comment:
      "Automatic water taps are top quality. Installation easy and maintenance minimal. Saves water and looks premium.",
  },
  {
    name: "Admin Head, Pune",
    rating: 5,
    comment:
      "Complete hygiene range installed. Great quality and reliable after-sales support.",
  },
  {
    name: "Procurement Lead",
    rating: 5,
    comment:
      "All products from one place with warranty and excellent service. Highly reliable.",
  },
];

export default function CustomerReviews() {

  const [screen, setScreen] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ✅ RESPONSIVE GRID */
  const grid = {
    display: "grid",
    gridTemplateColumns:
      screen > 1100
        ? "repeat(3,1fr)"   // desktop same
        : screen > 768
        ? "repeat(2,1fr)"   // tablet
        : "1fr",            // mobile
    gap: screen < 500 ? 15 : 25,
  };

  return (
    <div
      style={{
        background: "#ffffff",
        maxWidth: 1250,
        margin: "0 auto",
        padding: screen < 500 ? "10px" : "20px",
      }}
    >
      <div>
        {/* HEADING */}
        <h2
          style={{
            fontSize: screen < 500 ? 18 : 24,
            fontWeight: 700,
            marginBottom: 25,
            color: "#1e6fb8",
          }}
        >
          What our Customers Say ?
        </h2>

        <div style={grid}>
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#f9f9f9",
                padding: screen < 500 ? 16 : 24,
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                minHeight: screen < 500 ? 220 : 260,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: "5px solid #1e6fb8",
              }}
            >
              {/* QUOTE */}
              <div
                style={{
                  fontSize: screen < 500 ? 28 : 40,
                  color: "#fca5a5",
                }}
              >
                “
              </div>

              {/* COMMENT */}
              <p
                style={{
                  fontSize: screen < 500 ? 13 : 15,
                  color: "#444",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {r.comment}
              </p>

              {/* NAME */}
              <div
                style={{
                  fontSize: screen < 500 ? 14 : 16,
                  fontWeight: "700",
                  color: "#1e6fb8",
                }}
              >
                {r.name}
              </div>

              {/* STARS */}
              <div
                style={{
                  color: "#facc15",
                  fontSize: screen < 500 ? 14 : 16,
                }}
              >
                {"⭐".repeat(r.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}