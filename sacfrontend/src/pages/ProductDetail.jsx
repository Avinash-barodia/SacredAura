import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { Heart, HeartPlus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";



function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const token = localStorage.getItem("user");


  useEffect(() => {
    fetchProduct();
  }, []);

  const handleAddToCart = (action = "cart") => {
    const existingItem = cart.find(item => item._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty >= product.stock) {
      toast.error("You've added the maximum available quantity");
      return;
    }
    addToCart(product);
    if (action === "cart") {
      navigate("/cart");
    } else {
      navigate("/checkout");
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const found = res.data;
      setProduct(found);

      if (found?.mainImage) {
        setActiveImage(found.mainImage);
      } else if (found?.image) {
        setActiveImage(found.image);
      }
    } catch (err) {
      console.error("Failed to load product", err);
    }
  };

  const addToWishlist = async () => {
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    await api.post(
      "/wishlist",
      { productId: product._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Added to Wishlist ❤️");
  } catch (err) {
    alert("Already in Wishlist");
  }
};


  if (!product) return (
    <>
      <Helmet>
        <title>SacredAura | Premium Smart Home Products</title>
        <meta name="description" content="Explore our range of premium smart home automation products at SacredAura." />
      </Helmet>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#006895' }}>
        <div className="spinner"></div>
      <p style={{ marginTop: '16px', fontWeight: '600', fontSize: '18px' }}>Loading amazing product...</p>
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 104, 149, 0.1);
          border-top: 4px solid #006895;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </>
  );

  const metaDesc = product.description ? product.description.slice(0, 155).replace(/\s+\S*$/, '') + (product.description.length > 155 ? '...' : '') : "";

  return (
  <div style={{ background: "#ffffff", padding: "40px 0" }}>
    <Helmet>
      <title>{`${product.name} | SacredAura`}</title>
      <meta name="description" content={metaDesc} />
      <meta property="og:title" content={`${product.name} | SacredAura`} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={product.mainImage || product.image || ""} />
      <meta property="og:type" content="product" />
    </Helmet>
    {/* CENTER CONTAINER */}
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      {/* BACK BUTTON */}
      {/* <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "25px",
          padding: "6px 10px",
          border: "1px solid #ccc",
          background: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back to Product
      </button> */}
      {/* TOP SECTION */}
      <div
        className="productTopSection"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "50px",
        }}
      >
        {/* LEFT IMAGE SECTION */}
           <div className="productLeft" style={{ flex: "1 1 500px" }}>
           <div
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "20px",
              background: "#fff",
              height: "450px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative", // IMPORTANT
             }}
            >
              {/* ❤️ Wishlist Icon */}
            <div
              onClick={addToWishlist}
              style={{
                 position: "absolute",
                 top: "15px",
                 right: "15px",
                 width: "40px",
                 height: "40px",
                 borderRadius: "50%",
                 background: "#fff",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 cursor: "pointer",
                 fontSize: "20px",
                }}
               >
                <HeartPlus size={30} strokeWidth={2} />
            </div>

              <img
                src={activeImage}
                alt={product.name}
                style={{
                 maxWidth: "100%",
                 maxHeight: "100%",
                 objectFit: "contain",
                 transition: "0.3s ease",
               }}
              />
              </div>
           {/* THUMBNAILS */}
        <div
          style={{
          display: "flex",
          gap: "12px",
          marginTop: "15px",
          }}
        >
         {[product.mainImage || product.image, ...(product.images || [])]
         .filter(Boolean)
         .map((img, i) => (
         <img
          key={i}
          src={img}
          alt="thumb"
          onMouseEnter={() => setActiveImage(img)}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            cursor: "pointer",
            borderRadius: "8px",
            border:
              activeImage === img
                ? "2px solid #007bff"
                : "1px solid #ddd",
          }}
         />
        ))}
        </div>
      </div>

        {/* RIGHT DETAILS SECTION */}
        <div className="productRight" style={{ flex: "1 1 400px" }}>
          <h2 style={{ marginBottom: "10px" }}>{product.name}</h2>

          <p style={{ color: "#6c757d" }}>
            Model No: {product.modelNumber || "N/A"}
          </p>

          <h3 style={{ marginTop: "15px" }}>
            ₹ {product.price}

            {product.discount > 0 && (
                <>
                  <span style={{
                    textDecoration: "line-through",
                    marginLeft: "10px",
                    color: "#999"
                  }}>
                    ₹ {product.originalPrice}
                  </span>

                  <span style={{ color: "green", marginLeft: "8px" }}>
                    {product.discount}% OFF
                  </span>
                </>
              )}
          </h3>

          <div style={{ marginTop: "20px", lineHeight: "1.8" }}>
            {product.weight && (
            <p><b>Weight:</b> {product.weight}</p>
           )}

           {product.height && (
           <p><b>Height:</b> {product.height}</p>
           )}

           {product.capacity && (
           <p><b>Capacity:</b> {product.capacity}</p>
            )} 

           {product.warranty && (
            <p><b>Warranty:</b> {product.warranty}</p>
           )}
          </div>

          {/* Highlights Section */}
          {product.highlights && product.highlights.length > 0 && (
           <>
            <h4 style={{ marginTop: "20px" }}>Highlights:</h4>
            <ul style={{ paddingLeft: "20px" }}>
      {product.highlights.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </>
)}

<div style={{ marginTop: "10px" }}>
              {product.stock === 0 ? (
                <span style={{ color: "red", fontWeight: "600" }}>
                  Out of Stock
                </span>
              ) : (
                <span style={{ color: "green" }}>
                  In Stock ({product.stock})
                </span>
              )}
            </div>

          <div className="productActionButtons" style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
  {product.stock === 0 ? (
    <button
      style={{
        padding: "12px 50px",
        background: "red",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "not-allowed",
      }}
    >
      Out of Stock
    </button>
  ) : (
    <>
      {/* 🔵 ADD TO CART (LEFT) */}
      <button
        onClick={() => handleAddToCart("cart")}
        className="actionBtn"
        style={{
          padding: "12px 50px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Add to Cart
      </button>

      {/* 🟢 BUY NOW (RIGHT) */}
      <button
        onClick={() => handleAddToCart("checkout")}
        className="actionBtn"
        style={{
          padding: "12px 50px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Buy Now
      </button>
    </>
  )}
</div>
          {/* ⭐ RATING (SAME AS SHOP CARD) */}
     {/* 🔥 HEADING */}
<h4 style={{ marginTop: "10px",marginBottom: "6px",marginBottom: "6px", }}>Customer Reviews</h4>    
<div
  style={{

    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
  
> 
  {/* ⭐ STARS */}
  <span style={{ color: "#facc15", fontSize: "18px" }}>
    {"⭐".repeat(Math.round(product.rating || 0))}
  </span>

  {/* 🔢 VALUE */}
  <span style={{ fontWeight: "600", fontSize: "14px" }}>
    {product.rating?.toFixed(1) || "0.0"}
  </span>

  {/* 📊 REVIEWS */}
  <span style={{ color: "#555", fontSize: "13px" }}>
    ({product.reviews?.length || 0} reviews)
  </span>
</div>
       
        </div>
      </div>
           {/* BOTTOM SECTION */}
           <div
             style={{
             marginTop: "40px",
             background: "rgb(249, 250, 251)",
             padding: "30px",
             borderRadius: "12px",
             //lineHeight: "1.5",
             }}
            >
            {product.description && (
           <>
            <h3 style={{ marginTop: "10px" }}>Description</h3>
              <div
                 style={{
                 height: "1px",
                 background: "#e5e7eb",
                 width: "12%",      
                 margin: "10px 0 20px",
                }}
             />
              <p>{product.description}</p>
            </>
           )}

             {product.keyIngredients && (
            <>
             <h3 style={{ marginTop: "10px" }}>Key Ingredients</h3>
            <div
              style={{
              height: "1px",
              background: "#e5e7eb",
              width: "12%",   
              margin: "10px 0 20px",
              }}
            />
             <p>{product.keyIngredients}</p>
            </>
            )}

             {product.howToUse && (
            <>
                <h3 style={{ marginTop: "10px" }}>How To Use</h3>
                 <div
                  style={{
                  height: "1px",
                  background: "#e5e7eb",
                  width: "12%",   
                  margin: "10px 0 20px",
                 }}
              />
                <p>{product.howToUse}</p>
               </>
              )}

              {product.caution && (
             <>
                <h3 style={{ marginTop: "10px" }}>Caution</h3>
               <div
                 style={{
                    height: "1px",
                    background: "#e5e7eb",
                    width: "12%",   
                    margin: "10px 0 20px",
                  }}
                />
                 <p>{product.caution}</p>
                   </>
                 )}
              </div>
    </div>
    <style>{`
      @media (max-width: 768px) {
        .productTopSection {
          gap: 30px !important;
        }
        .productLeft, .productRight {
          flex: 1 1 100% !important;
        }
        .productActionButtons {
          flex-direction: column !important;
          gap: 12px !important;
        }
        .actionBtn {
          width: 100% !important;
        }
      }
    `}</style>
  </div>
);

}

export default ProductDetail;
