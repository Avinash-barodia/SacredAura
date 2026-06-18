import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function HomeCategorySection({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [screen, setScreen] = useState(window.innerWidth);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* ✅ SCREEN RESIZE */
  useEffect(() => {
    const handleResize = () => setScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ✅ FETCH PRODUCTS */
  useEffect(() => {
    if (!categoryId) return;

    api
      .get(`/products/home/${categoryId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load category products.");
      });
  }, [categoryId]);

  /* ✅ RESPONSIVE GRID */
  const grid = {
    display: "grid",
    gridTemplateColumns:
      screen > 1100
        ? "repeat(4,1fr)"   // desktop same
        : screen > 768
        ? "repeat(2,1fr)"   // tablet
        : "1fr",            // mobile
    gap: 18,
  };

  /* ✅ CARD */
  const card = {
    background: "#fff",
    borderRadius: 10,
    padding: screen < 500 ? 12 : 20,
    border: "6px solid #e5e7eb",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
    cursor: "pointer",
    minHeight: screen < 500 ? 240 : 290,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s ease",
  };

  return (
    <section
      style={{
        background: "#fff",
        maxWidth: 1250,
        margin: "0 auto",
        padding: screen < 500 ? "16px" : "24px 20px 40px 20px",
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          color: "#1e6fb8",
          marginBottom: 14,
          fontSize: screen < 500 ? 18 : 25,
          fontWeight: 700,
        }}
      >
        {title.toUpperCase()}
      </h2>

      <div style={grid}>
        {products.map((item, index) => (
          <div
            key={item._id}
            style={card}
            onMouseEnter={(e) => {
              if (screen > 768) {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(0,0,0,0.12)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.04)";
            }}
            onClick={() => navigate(`/product/${item._id}`)}
          >
            {/* IMAGE */}
            <div
              style={{
                height: screen < 500 ? 140 : 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <img
                src={item.mainImage}
                alt={item.name}
                loading={index === 0 ? "eager" : "lazy"}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* CONTENT */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* LEFT */}
              <div style={{ textAlign: "left", flex: 1 }}>
                {/* TITLE */}
                <div
                  style={{
                    fontSize: screen < 500 ? 12 : 14,
                    fontWeight: 600,
                    lineHeight: "1.3",
                  }}
                >
                  {item.name}
                </div>

                {/* ⭐ RATING */}
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ color: "#facc15", fontSize: "13px" }}>
                    {"⭐".repeat(Math.round(item.rating || 0))}
                  </span>

                  <span style={{ fontSize: "12px", fontWeight: "600" }}>
                    {item.rating?.toFixed(1) || "0.0"}
                  </span>

                  <span style={{ fontSize: "11px", color: "#555" }}>
                    ({item.reviews?.length || 0})
                  </span>
                </div>

                {/* PRICE */}
                <div style={{ marginTop: 8, fontWeight: 700 }}>
                  ₹ {item.price}

                  {item.discount > 0 && (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                          marginLeft: "6px",
                          fontSize: "12px",
                        }}
                      >
                        ₹ {item.originalPrice}
                      </span>

                      <span
                        style={{
                          color: "green",
                          marginLeft: "6px",
                          fontSize: "12px",
                        }}
                      >
                        {item.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                style={{
                  border: "2px solid #2e5f2e",
                  borderRadius: "20px",
                  padding: screen < 500 ? "4px 10px" : "6px 14px",
                  fontSize: screen < 500 ? "12px" : "14px",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#2e5f2e",
                  whiteSpace: "nowrap",
                }}
              >
                ADD
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeCategorySection;