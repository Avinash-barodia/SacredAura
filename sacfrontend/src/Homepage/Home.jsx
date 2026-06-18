import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import PromoBanners from "../components/PromoBanners";
import FeaturedImage from "../components/FeaturedImage";
import FooterFeatures from "../Header/FooterFeatures";
import PremiumShowcase from "../components/PremiumShowcase";
import CustomerReviews from "../components/CustomerReviews";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#f3f4f6",
        color: "#111",
      }}
    >
      <Helmet>
        <title>SacredAura | Your Smart Sanctuary</title>
        <meta name="description" content="Discover premium smart home automation products that transform your living space into a modern sanctuary with SacredAura." />
      </Helmet>
      <Hero />
      <main>
        {/* sections */}
        <PremiumShowcase />
        <PromoBanners />
        <FeaturedImage />
        <CustomerReviews/>
        <FooterFeatures/>
      </main>

      {/* Back To Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          right: 20,
          bottom: 22,
          background: "#fff",
          border: "1px solid #e5e7eb",
          padding: 10,
          borderRadius: 999,
          boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
          cursor: "pointer",
        }}
      >
        ↑
      </button>
    </div>
  );
}
