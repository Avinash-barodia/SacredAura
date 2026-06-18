import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  Lock,
  Droplets,
  Droplet,
  Wind,
  Lightbulb,
  Waves,
  Trash2,
  Power,
  ArrowRight,
  Award,
  ShieldCheck,
  Leaf,
  Headset
} from "lucide-react";

import lockImg from "../Assest/SMLock/SL1.jpeg";
import tapImg from "../Assest/Water_Taps/SA AT 218.jpeg";
import soapImg from "../Assest/LsDespenser/LSD1.jpeg";
import dryerImg from "../Assest/Handdryers/SA HD PL 100.jpeg";
import lightImg from "../Assest/Smartlighting/SLT1.jpeg";
import flushImg from "../Assest/Urinal_flush/SA UC 311.jpeg";
import dustbinImg from "../Assest/AmDastbins/SSD4.jpeg";
import switchImg from "../Assest/STSwitchs/STS1.jpeg";

// --- DUMMY DATA ---
const categoriesData = [
  {
    id: "locks",
    name: "SMART LOCKS",
    tagline: "Secure. Smart. Seamless.",
    productName: "Face Recognition Lock",
    price: "₹13,000",
    image: lockImg,
    icon: Lock,
    size: "large",
    query: "Smart Locks"
  },
  {
    id: "taps",
    name: "SENSOR TAPS",
    tagline: "Touchless. Hygienic. Efficient.",
    productName: "Deck Mounted Sensor Tap",
    price: "₹4,500",
    image: tapImg,
    icon: Droplets,
    size: "large",
    query: "Water Taps"
  },
  {
    id: "soap",
    name: "SOAP DISPENSERS",
    tagline: "Hygienic. Durable. Elegant.",
    productName: "Automatic Soap Dispenser",
    price: "₹1,800",
    image: soapImg,
    icon: Droplet,
    size: "small",
    query: "Soap Dispenser"
  },
  {
    id: "dryers",
    name: "HAND DRYERS",
    tagline: "Fast. Powerful. Energy Saving.",
    productName: "Automatic Hand Dryer",
    price: "₹12,000",
    image: dryerImg,
    icon: Wind,
    size: "small",
    query: "Hand Dryers"
  },
  {
    id: "lights",
    name: "SMART LIGHTS",
    tagline: "Intelligent Lighting Solutions.",
    productName: "Smart LED Panel Light",
    price: "₹2,200",
    image: lightImg,
    icon: Lightbulb,
    size: "small",
    query: "Light Automation"
  },
  {
    id: "flush",
    name: "FLUSH SYSTEMS",
    tagline: "Modern. Water Saving. Smart.",
    productName: "Sensor Flush Plate",
    price: "₹3,500",
    image: flushImg,
    icon: Waves,
    size: "small",
    query: "Urinal Flush"
  },
  {
    id: "dustbins",
    name: "DUSTBINS",
    tagline: "Automatic. Clean. Reliable.",
    productName: "Automatic Sensor Dustbin",
    price: "₹6,000",
    image: dustbinImg,
    icon: Trash2,
    size: "large",
    query: "Dustbins"
  },
  {
    id: "switches",
    name: "SWITCHES",
    tagline: "Smart Control. Sleek Design.",
    productName: "Smart Touch Switch",
    price: "₹4,200",
    image: switchImg,
    icon: Power,
    size: "large",
    query: "Touch Switches"
  }
];

const benefitsData = [
  {
    title: "Premium Quality",
    desc: "Built to last, engineered for excellence.",
    icon: Award
  },
  {
    title: "Smart & Hygienic",
    desc: "Touch-free solutions for a healthier tomorrow.",
    icon: ShieldCheck
  },
  {
    title: "Sustainable Design",
    desc: "Eco-friendly products for a better future.",
    icon: Leaf
  },
  {
    title: "Reliable Support",
    desc: "Dedicated support for you at every step.",
    icon: Headset
  }
];

// --- COMPONENTS ---

const CategoryCard = ({ item, isEditing, productsList, selectionProductId, onProductSelect }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  const handleClick = () => {
    if (!isEditing) {
      navigate(`/shop?category=${encodeURIComponent(item.query || item.name)}`);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        gridColumn: item.size === "large" ? "span 2" : "span 1",
        minHeight: item.size === "large" ? "480px" : "420px"
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Top Content */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#F0F4F8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            color: "#006895"
          }}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", letterSpacing: "0.5px", marginBottom: "4px" }}>
          {item.name}
        </h3>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
          {item.tagline}
        </p>
      </div>

      {/* Image Area */}
      <div
        style={{
          flex: 1,
          background: "#F8F9FB",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          marginBottom: "16px"
        }}
      >
        <motion.img
          src={item.image}
          alt={item.productName}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.1))"
          }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Bottom Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>
            {item.productName}
          </div>
          <div style={{ fontSize: "14px", color: "#4B5563", marginTop: "4px" }}>
            {item.price}
          </div>
        </div>

        <div style={{ height: "1px", background: "#E5E7EB", margin: "4px 0" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#006895",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          Explore Category
          <motion.div
            animate={{ x: isHovered ? 6 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </div>

      {isEditing && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.85)", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" }} onClick={e => e.stopPropagation()}>
           <p style={{ fontWeight: "bold", marginBottom: "10px", color: "#111", textAlign: "center" }}>Select Product to Showcase</p>
           <select 
             value={selectionProductId || ""} 
             onChange={(e) => onProductSelect(item.id, e.target.value)}
             style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
           >
             <option value="">-- No Product Selected --</option>
             {productsList?.filter(p => {
               const catName = p.category?.name || p.category || "";
               const subCatName = p.subCategory?.name || p.subCategory || "";
               const q = item.query?.toLowerCase() || "";
               return catName.toLowerCase().includes(q) || subCatName.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
             }).map(p => (
               <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>
             ))}
           </select>
        </div>
      )}
    </motion.div>
  );
};

export default function PremiumShowcase({ isEditing, productsList, selections, onProductSelect }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(categoriesData);

  useEffect(() => {
    if (isEditing && selections && productsList) {
       // Local preview mode
       const updatedCategories = categoriesData.map(cat => {
         const dynamicItem = selections.find(s => s.id === cat.id);
         if (dynamicItem && dynamicItem.productId) {
           const prod = productsList.find(p => p._id === dynamicItem.productId);
           if (prod) {
             return {
               ...cat,
               productName: prod.name,
               price: `₹${prod.price}`,
               image: prod.mainImage,
             };
           }
         }
         return cat;
       });
       setCategories(updatedCategories);
       return;
    }

    if (!isEditing) {
      api.get("/settings")
        .then(res => {
          if (res.data?.showcaseItems) {
            const updatedCategories = categoriesData.map(cat => {
              const dynamicItem = res.data.showcaseItems.find(s => s.id === cat.id);
              if (dynamicItem && dynamicItem.product) {
                return {
                  ...cat,
                  productName: dynamicItem.product.name,
                  price: `₹${dynamicItem.product.price}`,
                  image: dynamicItem.product.mainImage,
                };
              }
              return cat;
            });
            setCategories(updatedCategories);
          }
        })
        .catch(err => console.log("Failed to load showcase settings", err));
    }
  }, [isEditing, selections, productsList]);

  return (
    <section style={{ background: "#F8F9FB", padding: "80px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#006895", letterSpacing: "1px", marginBottom: "12px" }}>
            OUR CATEGORIES
          </div>
          <h2 style={{ fontSize: "40px", fontWeight: 800, color: "#111827", marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Smart Solutions For Every Space
          </h2>
          <p style={{ fontSize: "16px", color: "#4B5563", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Explore our range of automation, hygiene and smart infrastructure products designed to elevate your everyday experiences.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid" style={{
          display: "grid",
          gap: "24px",
          marginBottom: "40px"
        }}>
          {categories.map((item) => {
            const sel = selections?.find(s => s.id === item.id);
            return (
              <CategoryCard 
                key={item.id} 
                item={item} 
                isEditing={isEditing}
                productsList={productsList}
                selectionProductId={sel?.productId}
                onProductSelect={onProductSelect}
              />
            );
          })}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <button 
             onClick={() => navigate('/shop')} 
             style={{
                background: "#006895",
                color: "#fff",
                border: "none",
                padding: "16px 32px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 104, 149, 0.3)",
                transition: "all 0.3s ease"
             }}
             onMouseOver={(e) => {
               e.target.style.background = "#004f73";
               e.target.style.transform = "translateY(-2px)";
               e.target.style.boxShadow = "0 6px 20px rgba(0, 104, 149, 0.4)";
             }}
             onMouseOut={(e) => {
               e.target.style.background = "#006895";
               e.target.style.transform = "translateY(0)";
               e.target.style.boxShadow = "0 4px 15px rgba(0, 104, 149, 0.3)";
             }}
          >
            View All Products <ArrowRight size={18} style={{ verticalAlign: "middle", marginLeft: "8px" }} />
          </button>
        </div>

        {/* Benefits Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          borderTop: "1px solid #E5E7EB",
          paddingTop: "60px"
        }}>
          {benefitsData.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ textAlign: "center", padding: "0 10px" }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  color: "#006895"
                }}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
                  {benefit.title}
                </h4>
                <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.5" }}>
                  {benefit.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        .bento-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bento-grid > div {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
