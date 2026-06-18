import { useState, useEffect } from "react";
import api from "../utils/api";

function AdminHomeProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  // Store selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const mainCategories = categories.filter((cat) => !cat.parent);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    setSelectedProductIds([]);
    setProducts([]);

    const filteredSubs = categories.filter(
      (cat) => cat.parent && cat.parent.toString() === categoryId.toString()
    );
    setSubCategories(filteredSubs);
    
    // Fetch products for main category to allow selecting those assigned directly to it
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    }
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    if (subCategoryId) {
      fetchProductsByCategory(subCategoryId);
    } else if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      setProducts([]);
      setSelectedProductIds([]);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const res = await api.get(`/products?category=${categoryId}`);
      const fetchedProducts = res.data;
      setProducts(fetchedProducts);

      // Initialize selected products based on their isFeatured status
      const featuredIds = fetchedProducts
        .filter((p) => p.isFeatured)
        .map((p) => p._id);
      setSelectedProductIds(featuredIds);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleToggleProduct = (productId) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSave = async () => {
    const targetCategory = selectedSubCategory || selectedCategory;
    if (!targetCategory) {
      alert("Please select a category first.");
      return;
    }

    if (selectedProductIds.length > 4) {
      if (!window.confirm(`You have selected ${selectedProductIds.length} products. Only the first 4 might be displayed on the home page depending on your layout. Do you want to continue?`)) {
        return;
      }
    }

    setIsSaving(true);
    try {
      await api.put("/products/home/featured", {
        categoryId: targetCategory,
        productIds: selectedProductIds,
      });
      alert("Featured products updated successfully! ✅");
      fetchProductsByCategory(targetCategory);
    } catch (error) {
      console.error("Failed to update featured products", error);
      alert("Failed to update featured products.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "40px", background: "#f9fafb", minHeight: "80vh" }}>
      <div style={formCard}>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Manage Home Page Products
        </h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Select up to 4 products per category to display on the home page.
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "30px", flexWrap: "wrap" }}>
          {/* MAIN CATEGORY */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Main Category</option>
            {mainCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* SUB CATEGORY */}
          {subCategories.length > 0 && (
            <select
              value={selectedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {(selectedCategory || selectedSubCategory) && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>
              Products ({products.length}) - Selected ({selectedProductIds.length}/4)
            </h3>
            <button 
              onClick={handleSave} 
              style={{...btnStyle, opacity: isSaving ? 0.7 : 1}}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Selections"}
            </button>
          </div>
        )}

        {(selectedCategory || selectedSubCategory) && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No products found in this category.
          </div>
        )}

        {(selectedCategory || selectedSubCategory) && products.length > 0 && (
          <div style={gridContainer}>
            {products.map((product) => {
              const isSelected = selectedProductIds.includes(product._id);
              
              return (
                <div 
                  key={product._id} 
                  style={{
                    ...productCard,
                    border: isSelected ? "3px solid #2563EB" : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer"
                  }}
                  onClick={() => handleToggleProduct(product._id)}
                >
                  {isSelected && (
                    <div style={badgeStyle}>🌟 Selected</div>
                  )}
                  
                  <img src={product.mainImage} alt={product.name} style={productImage} />
                  <h4 style={{ margin: "10px 0 5px", fontSize: "15px" }}>{product.name}</h4>
                  <p style={{ margin: "0 0 10px", color: "#444" }}>₹ {product.price}</p>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => {}} // handled by parent onClick
                      style={{ transform: "scale(1.2)", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: isSelected ? "bold" : "normal", color: isSelected ? "#2563EB" : "#555" }}>
                      {isSelected ? "Featured" : "Not Featured"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const formCard = {
  background: "#fff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  maxWidth: "1200px",
  margin: "0 auto",
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  minWidth: "250px",
  fontSize: "15px",
};

const btnStyle = {
  background: "#2563EB",
  color: "#fff",
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "all 0.2s",
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const productCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  textAlign: "center",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const productImage = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "8px",
};

const badgeStyle = {
  position: "absolute",
  top: "-10px",
  right: "-10px",
  background: "#facc15",
  color: "#000",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
};

export default AdminHomeProducts;
