import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import promo1Default from "../Assest/Promo/v1.mp4";
import promo2Default from "../Assest/Promo/v2.mp4";
import api from "../utils/api";

const wrap = {
  background: "#fff",
  maxWidth: 1250,
  margin: "0 auto",
  padding: "0 20px 28px 20px",
  display: "grid",
  gap: 18,
};

export default function PromoBanners({ isEditing, promo1Preview, promo2Preview, onPromo1Change, onPromo2Change }) {
  const navigate = useNavigate();
  const [promo1, setPromo1] = useState(promo1Default);
  const [promo2, setPromo2] = useState(promo2Default);

  useEffect(() => {
    if (!isEditing) {
      api.get("/settings")
        .then(res => {
          if (res.data?.promoVideo1) setPromo1(res.data.promoVideo1);
          if (res.data?.promoVideo2) setPromo2(res.data.promoVideo2);
        })
        .catch(err => console.log("Failed to load promo settings", err));
    }
  }, [isEditing]);

  const displayPromo1 = isEditing && promo1Preview ? promo1Preview : promo1;
  const displayPromo2 = isEditing && promo2Preview ? promo2Preview : promo2;

  const cardStyle = {
    position: "relative",
    background: "#fff",
    borderRadius: 10,
    padding: 18,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  const buttonStyle = {
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#2e5f2e",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  };

  return (
    <>
    <div style={wrap} className="promo-grid">
      {/* 🔥 VIDEO 1 */}
      <div style={cardStyle}>
        <video
          src={displayPromo1}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: 500,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />

        {/* 🔥 BUTTON */}
        {!isEditing && (
          <button
            style={buttonStyle}
            onClick={() => navigate("/shop")}
          >
            Shop Now!
          </button>
        )}

        {isEditing && (
          <div style={{ position: "absolute", top: "15px", left: "15px", background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: "8px", zIndex: 10 }}>
             <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Upload Banner 1</p>
             <input type="file" accept="video/*" onChange={onPromo1Change} />
          </div>
        )}
      </div>

      {/* 🔥 VIDEO 2 */}
      <div style={cardStyle}>
        <video
          src={displayPromo2}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: 500,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />

        {/* 🔥 BUTTON */}
        {!isEditing && (
          <button
            style={buttonStyle}
            onClick={() => navigate("/shop")}
          >
            Shop Now!
          </button>
        )}

        {isEditing && (
          <div style={{ position: "absolute", top: "15px", left: "15px", background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: "8px", zIndex: 10 }}>
             <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Upload Banner 2</p>
             <input type="file" accept="video/*" onChange={onPromo2Change} />
          </div>
        )}
      </div>
    </div>
    <style>{`
      .promo-grid {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 768px) {
        .promo-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
    </>
  );
}