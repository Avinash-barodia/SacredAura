import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import api from "../utils/api";

import leftimg from "../Assest/Banner/b1.jpeg";
import rightimg from "../Assest/Banner/b2.jpeg";
import heroVideo from "../Assest/banner video.mp4";

const heroWrap = {
  position: "relative",
  color: "#fff",
  padding: "48px 0 80px 0",
  overflow: "hidden",
  minHeight: "80vh",
  zIndex: 1
};

const inner = {
  position: "relative",
  zIndex: 2,
  maxWidth: 1180,
  margin: "0 auto",
  padding: "80px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
};

export default function Hero({ isEditing, heroVideoUrl, onHeroVideoChange }) {

  const navigate = useNavigate(); // ✅ INIT
  const [dbHeroVideo, setDbHeroVideo] = useState(null);

  useEffect(() => {
    if (!isEditing) {
      api.get("/settings")
        .then(res => {
          if (res.data?.heroVideo) {
            setDbHeroVideo(res.data.heroVideo);
          }
        })
        .catch(err => console.log("Failed to load hero settings", err));
    }
  }, [isEditing]);

  const displayVideo = isEditing && heroVideoUrl ? heroVideoUrl : (dbHeroVideo || heroVideo);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section style={heroWrap}>

        {/* BACKGROUND VIDEO */}
        <video
          src={displayVideo}
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={(e) => {
            if (e.target.currentTime >= 7.5) {
              e.target.currentTime = 0;
            }
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0
          }}
        />

        {isEditing && (
          <div style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
            background: "rgba(255,255,255,0.9)",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#111" }}>Upload New Hero Video</p>
            <input 
              type="file" 
              accept="video/*" 
              onChange={onHeroVideoChange} 
              style={{ color: "#333" }}
            />
          </div>
        )}

        {/* DARK OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1
          }}
        />

        {/* HERO CONTENT */}
        <div style={inner}>
          <div>

            <h1
              style={{
                fontSize: 48,
                fontWeight: 700,
                marginBottom: 16,
                lineHeight: 1.1
              }}
            >
              Smart Hygiene & Home Automation
            </h1>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "#cfe9ff",
                maxWidth: 820,
                margin: "0 auto",
                lineHeight: 1.4
              }}
            >
              Automatic Taps, Hygiene, Lighting & Home Automation
            </h2>

            {/* ✅ CTA BUTTON FIX */}
            <div style={{ marginTop: 30 }}>
              <button
                onClick={() => navigate("/shop")} 
                style={{
                  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                  color: "#fff",
                  padding: "14px 26px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 16
                }}
              >
                Shop Now!
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS ================= */}
      <div
        className="hero-feature-cards"
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 1285,
          margin: "0 auto",
          marginTop: -40,
          padding: "0 20px",
          display: "grid",
          gap: 18
        }}
      >

        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
          }}
        >
          <img
            src={leftimg}
            alt="feat left"
            style={{ width: "100%", height: 300, objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
          }}
        >
          <img
            src={rightimg}
            alt="feat right"
            style={{ width: "100%", height: 300, objectFit: "cover" }}
          />
        </div>

      </div>
      <style>{`
        .hero-feature-cards {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .hero-feature-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}