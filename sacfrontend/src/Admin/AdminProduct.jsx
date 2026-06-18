import { useState, useEffect } from "react";
import api from "../utils/api";

function AdminProduct() {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [filterSubCategories, setFilterSubCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    modelNumber: "",
    price: "",
    discount: "",
    originalPrice: "", 
    stock: "",
    weight: "",
    height: "",
    capacity: "",
    warranty: "",
    highlights: "",
    description: "",
    keyIngredients: "",
    howToUse: "",
    caution: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const fetchProducts = async (pageNum) => {
    const res = await api.get(`/products/admin?page=${pageNum}&limit=8`);
    setProducts(res.data.products || res.data);
    if (res.data.totalPages) {
      setTotalPages(res.data.totalPages);
    }
  };

  const mainCategories = categories.filter((cat) => !cat.parent);

  // ✅ FIXED CATEGORY CHANGE
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");

    const filteredSubs = categories.filter(
      (cat) =>
        cat.parent &&
        cat.parent.toString() === categoryId.toString()
    );

    setSubCategories(filteredSubs);
  };

  const handleFilterCategoryChange = (categoryId) => {
    setFilterCategory(categoryId);
    setFilterSubCategory("");

    const filteredSubs = categories.filter(
      (cat) =>
        cat.parent &&
        cat.parent.toString() === categoryId.toString()
    );
    setFilterSubCategories(filteredSubs);
  };

  // 🔥 AUTO PRICE CALCULATION
  const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedForm = { ...form, [name]: value };

  const price = Number(updatedForm.price);
  const discount = Number(updatedForm.discount);

  // 🔥 Only when discount > 0 → calculate
 if (price > 0 && discount > 0) {
  updatedForm.originalPrice = Math.round(
    price / (1 - discount / 100)
  );
} else if (price > 0 && discount === 0) {
  updatedForm.originalPrice = price; // 🔥 RESET
}
  setForm(updatedForm);
};
  const resetForm = () => {
    setForm({
      name: "",
      modelNumber: "",
      price: "",
      discount: "",        // 🔥 ADD
      originalPrice: "",   // 🔥 ADD
      stock: "",  
      weight: "",
      height: "",
      capacity: "",
      warranty: "",
      highlights: "",
      description: "",
      keyIngredients: "",
      howToUse: "",
      caution: "",
    });

    setSelectedCategory("");
    setSelectedSubCategory("");
    setEditingId(null);
    setMainImage(null);
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    const finalCategory =
      selectedSubCategory || selectedCategory;

    formData.append("category", finalCategory);

    if (mainImage) formData.append("mainImage", mainImage);

    Array.from(images).forEach((img) =>
      formData.append("images", img)
    );

    if (editingId) {
      await api.put(`/products/${editingId}`, formData);
      alert("Product Updated ✅");
    } else {
      await api.post("/products", formData);
      alert("Product Added ✅");
    }

    resetForm();
    fetchProducts();
  };

  // ✅ EDIT WITH SUBCATEGORY FIX
  const handleEdit = (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setForm({
      name: product.name || "",
      modelNumber: product.modelNumber || "",
      price: product.price || "",
      discount: product.discount || "",
      originalPrice: product.originalPrice || "",
      stock: product.stock || "",
      weight: product.weight || "",
      height: product.height || "",
      capacity: product.capacity || "",
      warranty: product.warranty || "",
      highlights: product.highlights?.join(", ") || "",
      description: product.description || "",
      keyIngredients: product.keyIngredients || "",
      howToUse: product.howToUse || "",
      caution: product.caution || "",
    });

    const categoryId = product.category?._id;

    setSelectedCategory(categoryId);

    const filteredSubs = categories.filter(
      (cat) =>
        cat.parent &&
        cat.parent.toString() === categoryId?.toString()
    );

    setSubCategories(filteredSubs);

    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    let isMatch = true;

    if (searchTerm) {
      isMatch = isMatch && (
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.modelNumber && product.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory) {
      const productCatId = product.category?._id || product.category;
      const productCat = categories.find(c => c._id === productCatId);
      const isMain = productCat && productCat._id === filterCategory;
      const isChild = productCat && productCat.parent && productCat.parent === filterCategory;
      isMatch = isMatch && (isMain || isChild);
    }

    if (filterSubCategory) {
      const productCatId = product.category?._id || product.category;
      isMatch = isMatch && productCatId === filterSubCategory;
    }

    return isMatch;
  });

  return (
    <div style={{ padding: "40px", background: "#f9fafb" }}>

      {/* ================= FORM ================= */}
      <div style={formCard}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} style={formGrid}>

          <input name="name" placeholder="Product Title" value={form.name} onChange={handleChange} style={inputStyle} required />
          <input name="price" placeholder="Selling Price (₹)" value={form.price} onChange={handleChange} style={inputStyle} />
          <input name="discount" placeholder="Discount %" value={form.discount} onChange={handleChange} style={inputStyle} />
          <input name="originalPrice" placeholder="Original Price" value={form.originalPrice} readOnly style={{ ...inputStyle, background: "#eee" }} />
          <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} style={inputStyle} />
          <input name="modelNumber" placeholder="Model Number" value={form.modelNumber} onChange={handleChange} style={inputStyle} />
          <input name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} style={inputStyle} />
          <input name="height" placeholder="Height" value={form.height} onChange={handleChange} style={inputStyle} />
          <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} style={inputStyle} />
          <input name="warranty" placeholder="Warranty" value={form.warranty} onChange={handleChange} style={inputStyle} />
          <input name="highlights" placeholder="Highlights (comma separated)" value={form.highlights} onChange={handleChange} style={inputStyle} />

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={textareaStyle} />
          <textarea name="keyIngredients" placeholder="Key Ingredients" value={form.keyIngredients} onChange={handleChange} style={textareaStyle} />
          <textarea name="howToUse" placeholder="How To Use" value={form.howToUse} onChange={handleChange} style={textareaStyle} />
          <textarea name="caution" placeholder="Caution" value={form.caution} onChange={handleChange} style={textareaStyle} />

          {/* MAIN CATEGORY */}
          <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} style={inputStyle} required>
            <option value="">Select Main Category</option>
            {mainCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* SUB CATEGORY */}
          {subCategories.length > 0 && (
            <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} style={inputStyle}>
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          )}

          <div>
            <label>Main Image</label>
            <input type="file" onChange={(e) => setMainImage(e.target.files[0])} />
          </div>

          <div>
            <label>Additional Images</label>
            <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
          </div>

          <button style={btnStyle}>
            {editingId ? "Update Product" : "Add Product"}
          </button>

        </form>
      </div>

      {/* ================= PRODUCTS GRID ================= */}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "60px", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h2>All Products</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select value={filterCategory} onChange={(e) => handleFilterCategoryChange(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
            <option value="">All Categories</option>
            {mainCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          
          {filterSubCategories.length > 0 && (
            <select value={filterSubCategory} onChange={(e) => setFilterSubCategory(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
              <option value="">All Sub Categories</option>
              {filterSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Search by name or model no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", width: "250px" }}
          />
        </div>
      </div>

      <div style={gridContainer}>
        {filteredProducts.map((product) => (
          <div key={product._id} style={productCard}>
            <img src={product.mainImage} alt="" style={productImage} />
            <h4>{product.name}</h4>
            <p>
              ₹ {product.price}{" "}

                {product.discount > 0 && (
               <>
                 <span style={{ textDecoration: "line-through", color: "#999" }}>
                  ₹ {product.originalPrice}
                 </span>

                  <span style={{ color: "green", marginLeft: "6px" }}>
                   {product.discount}% OFF
                  </span>
               </>
              )}
             </p>

            <div style={{ margin: "10px 0", fontSize: "14px", fontWeight: "bold" }}>
              {product.stock > 0 ? (
                <span style={{ color: "#10b981" }}>Stock Available: {product.stock}</span>
              ) : (
                <span style={{ color: "#ef4444" }}>Out of Stock</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button style={editBtn} onClick={() => handleEdit(product)}>Edit</button>
              <button style={deleteBtn} onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "40px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid #ccc", cursor: page === 1 ? "not-allowed" : "pointer" }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold" }}>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid #ccc", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
        >
          Next
        </button>
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
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "80px",
};

const btnStyle = {
  background: "#10b981",
  color: "#fff",
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
};

const productCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  textAlign: "center",
};

const productImage = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "8px",
};

const editBtn = {
  background: "#f59e0b",
  border: "none",
  padding: "6px 10px",
  color: "#fff",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#ef4444",
  border: "none",
  padding: "6px 10px",
  color: "#fff",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminProduct;