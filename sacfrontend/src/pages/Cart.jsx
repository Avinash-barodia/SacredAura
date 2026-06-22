import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaShoppingCart, FaTrashAlt, FaShieldAlt, FaAward, FaUndo, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("user");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Fetch some products for the recommended section
    api.get("/products")
      .then(res => {
        const productList = res.data.products || res.data;
        setRecommended(productList.slice(0, 8));
      })
      .catch(err => {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load recommended products.");
      });
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTotal = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      toast.warning("Enter Coupon Code");
      return;
    }
    try {
      const res = await api.post("/coupons/apply", { code: coupon, totalAmount: subtotal });
      setDiscount(res.data.discount);
      toast.success("Coupon Applied Successfully 🎉");
    } catch (err) {
      console.error(err);
      setDiscount(0);
      toast.error(err.response?.data?.message || "Invalid Coupon Code");
    }
  };

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        <Helmet>
          <title>Your Cart | SacredAura</title>
        </Helmet>
        <FaShoppingCart style={{ fontSize: "64px", color: "#DCE8F5", marginBottom: "20px" }} />
        <h2 style={{ fontSize: "32px", color: "#0F172A", fontWeight: "800", marginBottom: "16px" }}>Your Cart is Empty</h2>
        <p style={{ color: "#64748B", marginBottom: "32px" }}>Looks like you haven't added any smart devices yet.</p>
        <button 
          onClick={() => navigate("/shop")}
          style={{ background: "#0077FF", color: "white", padding: "14px 32px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,119,255,0.2)" }}
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px 80px", fontFamily: "'Inter', sans-serif" }}>
      <Helmet>
        <title>Your Cart | SacredAura</title>
      </Helmet>
      {/* PAGE HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <div style={{ width: "48px", height: "48px", background: "white", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,90,200,0.08)" }}>
          <FaShoppingCart style={{ color: "#0077FF", fontSize: "20px" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0" }}>My Cart ({cart.length})</h1>
          <div style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>Home &gt; <span style={{ color: "#0077FF" }}>Cart</span></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* ================= LEFT SECTION: CART ITEMS (70%) ================= */}
        <div className="cartLeft" style={{ flex: "1 1 65%", display: "flex", flexDirection: "column", gap: "24px" }}>
          {cart.map((item) => (
            <div 
              key={item._id}
              className="cartItem"
              style={{
                background: "white",
                borderRadius: "20px",
                borderTop: "3px solid #0077FF",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,90,200,0.08)",
                display: "flex",
                gap: "20px",
                alignItems: "center",
                transition: "all 0.3s ease",
                position: "relative"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,90,200,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,90,200,0.08)";
              }}
            >
              <img
                src={item.mainImage || item.image}
                alt={item.name}
                className="cartItemImg"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))"
                }}
              />
              
              <div className="cartItemDetails" style={{ flex: 1 }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: "0 0 6px 0", lineHeight: "1.3" }}>
                  {item.name}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <span style={{ color: "#FFC107", fontSize: "14px" }}>
                    {"★".repeat(Math.round(item.rating || 4))}
                    {"☆".repeat(5 - Math.round(item.rating || 4))}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>{item.rating?.toFixed(1) || "4.5"}</span>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>({item.reviews?.length || 45} reviews)</span>
                </div>

                <div style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A" }}>
                  ₹{item.price.toFixed(2)}
                </div>
              </div>

              <div className="cartItemActions" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  background: "#F8FBFF", 
                  border: "1px solid #DCE8F5", 
                  borderRadius: "12px", 
                  height: "40px",
                  padding: "0 6px",
                  opacity: item.stock === 0 ? 0.5 : 1
                }}>
                  <button 
                    onClick={() => item.stock > 0 && updateQuantity(item._id, -1)} 
                    disabled={item.stock === 0}
                    style={{ border: "none", background: "transparent", cursor: item.stock === 0 ? "not-allowed" : "pointer", fontSize: "18px", width: "28px", height: "28px", borderRadius: "8px", color: "#0F172A", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }} 
                    onMouseOver={e => { if (item.stock > 0) { e.target.style.background="#0077FF"; e.target.style.color="white"; } }} 
                    onMouseOut={e => { if (item.stock > 0) { e.target.style.background="transparent"; e.target.style.color="#0F172A"; } }}
                  >
                    -
                  </button>
                  
                  <span style={{ fontWeight: "700", fontSize: "15px", width: "32px", textAlign: "center", color: "#0F172A" }}>{item.quantity}</span>
                  
                  <button 
                    onClick={() => {
                      if (item.quantity < item.stock) {
                        updateQuantity(item._id, 1);
                      }
                    }} 
                    disabled={item.quantity >= item.stock || item.stock === 0}
                    style={{ border: "none", background: "transparent", cursor: (item.quantity >= item.stock || item.stock === 0) ? "not-allowed" : "pointer", fontSize: "18px", width: "28px", height: "28px", borderRadius: "8px", color: (item.quantity >= item.stock || item.stock === 0) ? "#94A3B8" : "#0F172A", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }} 
                    onMouseOver={e => { if (item.quantity < item.stock && item.stock > 0) { e.target.style.background="#0077FF"; e.target.style.color="white"; } }} 
                    onMouseOut={e => { if (item.quantity < item.stock && item.stock > 0) { e.target.style.background="transparent"; e.target.style.color="#0F172A"; } }}
                  >
                    +
                  </button>
                </div>

                {item.stock === 0 ? (
                  <p style={{ color: "#EF4444", fontSize: "13px", fontWeight: "600", margin: "-8px 0 0 0", textAlign: "center" }}>
                    Out of stock — remove this item
                  </p>
                ) : (
                  item.quantity >= item.stock && (
                    <p style={{ color: "#F59E0B", fontSize: "12px", fontWeight: "600", margin: "-8px 0 0 0", textAlign: "center" }}>
                      Only {item.stock} in stock
                    </p>
                  )
                )}

                <div 
                  onClick={() => {
                    removeFromCart(item._id);
                    toast.success("Item removed from cart");
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#ef4444"}
                  onMouseOut={(e) => e.currentTarget.style.color = "#64748B"}
                >
                  <FaTrashAlt /> Remove
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ================= RIGHT SECTION: ORDER SUMMARY (30%) ================= */}
        <div className="cartRight" style={{ flex: "1 1 30%", minWidth: "280px", position: "sticky", top: "120px" }}>
          <div style={{
            background: "linear-gradient(180deg, #FFFFFF, #F8FBFF)",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0,90,200,0.08)",
            padding: "24px",
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "#EAF4FF", color: "#0077FF", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>📋</span>
              Order Summary
            </h3>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#64748B", marginBottom: "12px" }}>
              <span>Subtotal</span>
              <span style={{ color: "#0F172A", fontWeight: "600" }}>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#64748B", marginBottom: "12px" }}>
              <span>Discount</span>
              <span style={{ color: "#16A34A", fontWeight: "600" }}>- ₹{discount.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#64748B", marginBottom: "20px" }}>
              <span>Shipping</span>
              <span style={{ color: "#0F172A", fontWeight: "600" }}>₹0.00</span>
            </div>

            <div style={{ borderTop: "1px dashed #E2E8F0", margin: "20px 0" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>Estimated Total</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A" }}>₹{estimatedTotal.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              <input
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                style={{ flex: 1, height: "44px", border: "1px solid #DCE8F5", borderRadius: "10px", padding: "0 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
              <button
                onClick={applyCoupon}
                style={{ background: "#0077FF", color: "white", border: "none", borderRadius: "10px", padding: "0 20px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "background 0.2s" }}
                onMouseOver={e => e.target.style.background = "#0052CC"}
                onMouseOut={e => e.target.style.background = "#0077FF"}
              >
                Apply
              </button>
            </div>

            <button
              onClick={() => navigate(token ? "/checkout" : "/login", { state: { from: "/checkout" }})}
              style={{
                width: "100%", height: "48px", background: "linear-gradient(135deg, #0077FF, #0052CC)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,119,255,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Proceed to Checkout ➔
            </button>



          </div>
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
      {recommended.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: 0 }}>You may also like</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleScroll('left')} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "white", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F172A", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}><FaChevronLeft fontSize="14px"/></button>
              <button onClick={() => handleScroll('right')} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "white", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F172A", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}><FaChevronRight fontSize="14px"/></button>
            </div>
          </div>
          
          <div 
            ref={carouselRef}
            style={{ 
              display: "flex", 
              gap: "16px", 
              overflowX: "auto", 
              paddingBottom: "16px",
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {recommended.map(prod => (
              <div 
                key={prod._id}
                style={{ 
                  minWidth: "200px", 
                  background: "white", 
                  borderRadius: "16px", 
                  boxShadow: "0 8px 24px rgba(0,90,200,0.08)", 
                  padding: "16px", 
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
                onClick={() => navigate(`/product/${prod._id}`)}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img src={prod.mainImage || prod.image} alt={prod.name} style={{ width: "100%", height: "120px", objectFit: "contain", marginBottom: "12px" }} />
                <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{prod.name}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <span style={{ color: "#FFC107", fontSize: "12px" }}>{"★".repeat(Math.round(prod.rating||4))}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#0F172A" }}>{prod.rating?.toFixed(1) || "4.5"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A" }}>₹{prod.price}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${prod._id}`);
                    }}
                    style={{ background: "#EAF4FF", color: "#0077FF", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseOver={e => {e.target.style.background="#0077FF"; e.target.style.color="white"}}
                    onMouseOut={e => {e.target.style.background="#EAF4FF"; e.target.style.color="#0077FF"}}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cartLeft, .cartRight {
            flex: 1 1 100% !important;
          }
          .cartRight {
            position: static !important;
            margin-top: 12px !important;
          }
          .cartItem {
            flex-wrap: wrap !important;
            padding: 16px !important;
            gap: 16px !important;
          }
          .cartItemImg {
            width: 80px !important;
            height: 80px !important;
          }
          .cartItemDetails {
            flex: 1 1 calc(100% - 100px) !important;
            min-width: 150px !important;
          }
          .cartItemActions {
            flex-direction: row !important;
            width: 100% !important;
            justify-content: space-between !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
            padding-top: 12px !important;
            border-top: 1px dashed #E2E8F0 !important;
          }
          .cartItemActions > p {
            margin: 0 !important;
            text-align: left !important;
            width: 100% !important;
            order: -1 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Cart;
