import React, { useEffect, useState } from "react";
import f1 from "../Assest/Promo/slider1.jpeg";
import f2 from "../Assest/Promo/slider2.jpeg";
import f3 from "../Assest/Promo/slider3.jpeg";

const wrap = {
  background: "#fff",
  maxWidth: 1250,
  margin: "0 auto",
  padding: "0 20px 28px 20px",
};

export default function FeaturedImage() {
  const images = [f1, f2, f3];
  const [index, setIndex] = useState(0);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={wrap}>
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(3,12,34,0.05)",
        }}
      >
        {/* 🔥 SLIDER TRACK */}
        <div
          style={{
            display: "flex",
            width: `${images.length * 100}%`,
            transform: `translateX(-${index * (100 / images.length)}%)`,
            transition: "transform 0.6s ease-in-out",
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="slide"
              style={{
                width: `${100 / images.length}%`,
                height: 500,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}