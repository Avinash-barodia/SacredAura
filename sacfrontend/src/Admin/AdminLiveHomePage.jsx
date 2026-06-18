import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Hero from "../components/Hero";
import PremiumShowcase from "../components/PremiumShowcase";
import PromoBanners from "../components/PromoBanners";

const AdminLiveHomePage = () => {
  const [settings, setSettings] = useState({
    heroVideo: "",
    promoVideo1: "",
    promoVideo2: "",
    showcaseItems: []
  });
  const [products, setProducts] = useState([]);
  
  // Local state for file uploads before saving
  const [heroVideoFile, setHeroVideoFile] = useState(null);
  const [heroVideoPreview, setHeroVideoPreview] = useState(null);
  
  const [video1File, setVideo1File] = useState(null);
  const [video2File, setVideo2File] = useState(null);
  const [video1Preview, setVideo1Preview] = useState(null);
  const [video2Preview, setVideo2Preview] = useState(null);

  // Local state for product selections
  const [showcaseSelections, setShowcaseSelections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, productsRes] = await Promise.all([
        api.get("/settings"),
        api.get("/products")
      ]);
      
      setSettings(settingsRes.data);
      setProducts(productsRes.data.products || productsRes.data || []);
      
      if (settingsRes.data && settingsRes.data.showcaseItems) {
        setShowcaseSelections(settingsRes.data.showcaseItems.map(item => ({
          id: item.id,
          productId: item.product?._id || ""
        })));
      }
    } catch (err) {
      console.error("Failed to load admin live home data", err);
      setErrorMsg("Failed to connect to the server. Showing offline preview.");
      
      // Fallback
      setSettings({
        heroVideo: "",
        promoVideo1: "",
        promoVideo2: "",
        showcaseItems: [
          { id: "locks" }, { id: "taps" }, { id: "soap" }, { id: "dryers" },
          { id: "lights" }, { id: "flush" }, { id: "dustbins" }, { id: "switches" }
        ]
      });
      setProducts([
        { _id: "1", name: "Mock Product 1", price: 1000 },
        { _id: "2", name: "Mock Product 2", price: 2000 }
      ]);
      setShowcaseSelections([
          { id: "locks", productId: "" }, { id: "taps", productId: "" }, { id: "soap", productId: "" }, { id: "dryers", productId: "" },
          { id: "lights", productId: "" }, { id: "flush", productId: "" }, { id: "dustbins", productId: "" }, { id: "switches", productId: "" }
      ]);
    }
  };

  const handleHeroVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroVideoFile(file);
      setHeroVideoPreview(URL.createObjectURL(file));
    }
  };

  const handlePromoChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (index === 1) {
        setVideo1File(file);
        setVideo1Preview(previewUrl);
      } else {
        setVideo2File(file);
        setVideo2Preview(previewUrl);
      }
    }
  };

  const handleProductSelect = (slotId, productId) => {
    setShowcaseSelections(prev => prev.map(item => 
      item.id === slotId ? { ...item, productId } : item
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (heroVideoFile) formData.append("heroVideo", heroVideoFile);
      if (video1File) formData.append("promoVideo1", video1File);
      if (video2File) formData.append("promoVideo2", video2File);
      
      formData.append("showcaseItems", JSON.stringify(showcaseSelections));

      await api.put("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      alert("Home Page updated successfully! ✅");
      fetchData(); // refresh data
      
      // Clear local file states
      setHeroVideoFile(null);
      setHeroVideoPreview(null);
      setVideo1File(null);
      setVideo2File(null);
      setVideo1Preview(null);
      setVideo2Preview(null);
    } catch (err) {
      console.error("Failed to save settings", err);
      alert("Failed to save Home Page updates.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", paddingBottom: "100px", fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER FOR EDITOR */}
      <div style={{ background: "#fff", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 1000 }}>
        <div>
          <h2 style={{ margin: 0, color: "#111" }}>Home Page Live Editor</h2>
          <p style={{ margin: "5px 0 0", color: "#666" }}>Changes made here will directly reflect on the public Home Page.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{
            background: "#2563EB", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "15px 40px", textAlign: "center", fontWeight: "bold" }}>
          {errorMsg}
        </div>
      )}

      {/* LIVE COMPOSITION OF THE HOME PAGE */}
      <div style={{ pointerEvents: isSaving ? "none" : "auto", opacity: isSaving ? 0.6 : 1 }}>
        <Hero 
          isEditing={true} 
          heroVideoUrl={heroVideoPreview} 
          onHeroVideoChange={handleHeroVideoChange} 
        />
        
        <PremiumShowcase 
          isEditing={true}
          productsList={products}
          selections={showcaseSelections}
          onProductSelect={handleProductSelect}
        />

        <PromoBanners 
          isEditing={true}
          promo1Preview={video1Preview}
          promo2Preview={video2Preview}
          onPromo1Change={(e) => handlePromoChange(e, 1)}
          onPromo2Change={(e) => handlePromoChange(e, 2)}
        />
      </div>

    </div>
  );
};

export default AdminLiveHomePage;
