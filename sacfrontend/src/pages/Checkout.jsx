import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { FaMapMarkerAlt, FaCreditCard, FaLock, FaShieldAlt, FaShoppingBag, FaArrowLeft, FaTimes, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("user");
  const { cart, subtotal, gstAmount, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [newAddress, setNewAddress] = useState({});

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      fetchAddresses();
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.length > 0) {
        setAddresses(res.data);              
        setSelectedAddress(res.data[0]._id); 
      } else {
        setAddresses([]);
        setSelectedAddress(null);
        setShowNewForm(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load addresses.");
    }
  };

  const saveAddress = async () => {
    try {
      const res = await api.post("/address", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses([...addresses, res.data]);
      setSelectedAddress(res.data._id);
      setShowNewForm(false);
      toast.success("Address saved successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save address.");
    }
  };

  if (cart.length === 0)
    return (
      <div style={{ padding: "120px 20px", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        <Helmet>
          <title>Checkout | SacredAura</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <FaShoppingBag style={{ fontSize: "64px", color: "#DCE8F5", marginBottom: "20px" }} />
        <h2 style={{ fontSize: "32px", color: "#0F172A", fontWeight: "800", marginBottom: "16px" }}>No Order Found</h2>
        <button 
          onClick={() => navigate("/shop")}
          style={{ background: "#0077FF", color: "white", padding: "14px 32px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,119,255,0.2)" }}
        >
          Return to Shop
        </button>
      </div>
    );

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await api.post("/coupons/apply", { 
        code: couponCode.toUpperCase(),
        totalAmount: subtotal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...res.data });
      toast.success("Coupon applied successfully!");
    } catch (err) {
      setCouponError(err?.response?.data?.message || "Invalid or expired coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const discountVal = appliedCoupon?.discount || 0;
  const discountedSubtotal = Math.max(0, subtotal - discountVal);
  const calculatedGstAmount = parseFloat(((discountedSubtotal * 18) / 100).toFixed(2));
  const finalTotalAmount = parseFloat((discountedSubtotal + calculatedGstAmount).toFixed(2));

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address.");
      return;
    }

    if (paymentMethod === "RAZORPAY") {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      try {
        const mongoOrderRes = await api.post("/orders", {
          addressId: selectedAddress,
          paymentMethod,
          totalAmount: finalTotalAmount,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          items: cart.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        const createdOrder = mongoOrderRes.data;

        const rzpOrderRes = await api.post("/payment/create-order", {
          orderId: createdOrder._id
        });

        const rzpOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mocked",
          amount: rzpOrderRes.data.amount,
          currency: rzpOrderRes.data.currency,
          name: "SacredAura",
          description: "Smart Home Automation",
          order_id: rzpOrderRes.data.id,
          handler: async function (response) {
            try {
              await api.post("/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mongo_order_id: createdOrder._id
              });

              clearCart();
              navigate("/order-success", { state: { orderId: createdOrder.orderId } });
            } catch (err) {
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
          },
          theme: {
            color: "#0077FF",
          },
        };

        const paymentObject = new window.Razorpay(rzpOptions);
        paymentObject.open();

      } catch (err) {
        alert("Failed to initialize payment: " + (err.response?.data?.message || err.message));
      }
      return;
    }

    try {
      const res = await api.post(
        "/orders",
        {
          addressId: selectedAddress,
          paymentMethod,
          totalAmount: finalTotalAmount,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          items: cart.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
        }
      );

      const createdOrder = res.data;
      clearCart();
      navigate("/order-success", { state: { orderId: createdOrder.orderId } });
    } catch (err) {
      alert("Failed to place order: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 80px", fontFamily: "'Inter', sans-serif" }}>
      <Helmet>
        <title>Checkout | SacredAura</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* PAGE HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
        <button onClick={() => navigate("/cart")} style={{ width: "48px", height: "48px", background: "white", borderRadius: "14px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,90,200,0.08)", cursor: "pointer", color: "#0077FF", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
          <FaArrowLeft fontSize="20px" />
        </button>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0" }}>Checkout</h1>
          <div style={{ color: "#64748B", fontSize: "14px", fontWeight: "500" }}>Home &gt; Cart &gt; <span style={{ color: "#0077FF" }}>Checkout</span></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* ================= LEFT SIDE (65%) ================= */}
        <div className="checkoutLeft" style={{ flex: "1 1 60%", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ADDRESS SECTION */}
          <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,90,200,0.06)", padding: "32px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0 0 24px 0" }}>
              <span style={{ background: "#EAF4FF", color: "#0077FF", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}><FaMapMarkerAlt /></span>
              Delivery Address
            </h3>

            {/* Saved Addresses List */}
            {!showNewForm && addresses.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                {addresses.map((addr) => (
                  <div 
                    key={addr._id} 
                    onClick={() => setSelectedAddress(addr._id)}
                    style={{ 
                      padding: "20px", 
                      border: selectedAddress === addr._id ? "2px solid #0077FF" : "2px solid #E2E8F0", 
                      borderRadius: "16px", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "flex-start", 
                      gap: "16px",
                      background: selectedAddress === addr._id ? "#F8FBFF" : "white",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ marginTop: "2px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: selectedAddress === addr._id ? "6px solid #0077FF" : "2px solid #CBD5E1", background: "white", boxSizing: "border-box" }}></div>
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "#0F172A", marginBottom: "4px", fontSize: "16px" }}>{addr.firstName} {addr.lastName}</div>
                      <div style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.5" }}>
                        {addr.address}, {addr.apartment && `${addr.apartment},`} <br/>
                        {addr.city}, {addr.state} - {addr.pinCode}
                      </div>
                      <div style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>📞 {addr.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showNewForm && (
              <button 
                onClick={() => setShowNewForm(true)}
                style={{ background: "#EAF4FF", color: "#0077FF", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "background 0.2s", width: "100%" }}
              >
                + Add New Address
              </button>
            )}

            {/* New Address Form */}
            {showNewForm && (
              <div>
                <div className="addressGrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <input style={inputStyle} placeholder="Country" onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                  <input style={inputStyle} placeholder="First Name" onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })} />
                  <input style={inputStyle} placeholder="Last Name" onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })} />
                  <input style={inputStyle} placeholder="Address" onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                  <input style={inputStyle} placeholder="Apartment / House No." onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })} />
                  <input style={inputStyle} placeholder="City" onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <input style={inputStyle} placeholder="State" onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                  <input style={inputStyle} placeholder="Pin Code" value={newAddress.pinCode || ""} onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value.replace(/\D/g, '') })} />
                  <input className="fullWidthInput" style={{...inputStyle, gridColumn: "span 2"}} placeholder="Phone Number" value={newAddress.phone || ""} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })} />
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <button onClick={saveAddress} style={{ background: "#0077FF", color: "white", border: "none", borderRadius: "10px", padding: "14px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer", flex: 1 }}>
                    Save Address
                  </button>
                  {addresses.length > 0 && (
                    <button onClick={() => setShowNewForm(false)} style={{ background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "10px", padding: "14px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT SECTION */}
          <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,90,200,0.06)", padding: "32px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0 0 24px 0" }}>
              <span style={{ background: "#EAF4FF", color: "#0077FF", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}><FaCreditCard /></span>
              Payment Method
            </h3>

            <div className="paymentGrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* COD Option */}
              <div 
                onClick={() => setPaymentMethod("COD")}
                style={{ 
                  padding: "20px", 
                  border: paymentMethod === "COD" ? "2px solid #0077FF" : "2px solid #E2E8F0", 
                  borderRadius: "16px", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "16px",
                  background: paymentMethod === "COD" ? "#F8FBFF" : "white",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: paymentMethod === "COD" ? "6px solid #0077FF" : "2px solid #CBD5E1", background: "white", boxSizing: "border-box" }}></div>
                <div>
                  <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaMoneyBillWave color="#0077FF" /> Cash on Delivery
                  </div>
                  <div style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>Pay when you receive</div>
                </div>
              </div>

              {/* Razorpay Option */}
              <div 
                onClick={() => setPaymentMethod("RAZORPAY")}
                style={{ 
                  padding: "20px", 
                  border: paymentMethod === "RAZORPAY" ? "2px solid #0077FF" : "2px solid #E2E8F0", 
                  borderRadius: "16px", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "16px",
                  background: paymentMethod === "RAZORPAY" ? "#F8FBFF" : "white",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: paymentMethod === "RAZORPAY" ? "6px solid #0077FF" : "2px solid #CBD5E1", background: "white", boxSizing: "border-box" }}></div>
                <div>
                  <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCreditCard color="#0077FF" /> Razorpay
                  </div>
                  <div style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>UPI, Cards, Netbanking & more</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="checkoutAction" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={placeOrder}
              style={{
                background: "#0077FF", color: "white", border: "none", borderRadius: "12px", padding: "16px 40px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 24px rgba(0,119,255,0.3)"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <FaLock /> Place Order
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B", fontSize: "14px", fontWeight: "600" }}>
              <FaShieldAlt color="#0077FF" size={18} /> Secure Checkout
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE: ORDER DETAILS (35%) ================= */}
        <div className="checkoutRight" style={{ flex: "1 1 35%", minWidth: "320px", position: "sticky", top: "120px" }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0,90,200,0.06)",
            padding: "32px",
          }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0 0 24px 0" }}>
              <span style={{ background: "#EAF4FF", color: "#0077FF", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}><FaShoppingBag /></span>
              Order Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "20px", borderBottom: "1px solid #F1F5F9" }}>
                  <img src={item.mainImage || item.image} alt={item.name} style={{ width: "64px", height: "64px", objectFit: "contain", background: "#F8FBFF", borderRadius: "12px", padding: "4px" }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "8px", lineHeight: "1.3" }}>{item.name}</div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", background: "#F8FBFF", border: "1px solid #DCE8F5", borderRadius: "8px", height: "28px", padding: "0 4px" }}>
                        <button onClick={() => updateQuantity(item._id, -1)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", width: "20px", color: "#0F172A" }}>-</button>
                        <span style={{ fontWeight: "700", fontSize: "13px", width: "24px", textAlign: "center", color: "#0F172A" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", width: "20px", color: "#0F172A" }}>+</button>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item._id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.2)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                    <FaTimes fontSize="16px" />
                  </button>
                </div>
              ))}
            </div>

            {/* COUPON UI */}
            <div style={{ marginBottom: "24px" }}>
              {!appliedCoupon ? (
                <>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      style={{ ...inputStyle, flex: 1, height: "40px", fontSize: "13px", background: "white" }}
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={couponLoading}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      style={{
                        background: couponLoading || !couponCode.trim() ? "#CBD5E1" : "#0077FF",
                        color: "white", border: "none", borderRadius: "10px", padding: "0 20px", fontWeight: "700", cursor: couponLoading || !couponCode.trim() ? "not-allowed" : "pointer", transition: "all 0.2s"
                      }}
                    >
                      {couponLoading ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>{couponError}</div>}
                </>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ECFDF5", border: "1px solid #10B981", borderRadius: "10px", padding: "12px 16px", color: "#047857", fontWeight: "600", fontSize: "14px" }}>
                  <span>🎉 {appliedCoupon.code} applied! (-₹{discountVal.toFixed(2)})</span>
                  <button onClick={removeCoupon} style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#64748B", marginBottom: "12px" }}>
              <span>Subtotal</span>
              <span style={{ color: "#0F172A", fontWeight: "600" }}>₹{subtotal.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#10B981", marginBottom: "12px", fontWeight: "600" }}>
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{discountVal.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#64748B", marginBottom: "12px" }}>
              <span>Shipping</span>
              <span style={{ color: "#10B981", fontWeight: "600" }}>₹0.00</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#64748B", marginBottom: "20px" }}>
              <span>Tax (18%)</span>
              <span style={{ color: "#0F172A", fontWeight: "600" }}>₹{calculatedGstAmount.toFixed(2)}</span>
            </div>

            <div style={{ borderTop: "1px dashed #E2E8F0", margin: "20px 0" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>Total Amount</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#0077FF" }}>₹{finalTotalAmount.toFixed(2)}</span>
            </div>

            <div style={{ background: "#F8FBFF", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", color: "#0077FF", fontSize: "13px", fontWeight: "600" }}>
              <FaShieldAlt fontSize="20px" /> Your data is safe and secure with us.
            </div>

          </div>
        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .checkoutLeft, .checkoutRight {
            flex: 1 1 100% !important;
          }
          .checkoutRight {
            position: static !important;
            margin-top: 12px !important;
            min-width: 100% !important;
          }
          .addressGrid, .paymentGrid {
            grid-template-columns: 1fr !important;
          }
          .fullWidthInput {
            grid-column: span 1 !important;
          }
          .checkoutAction {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          .checkoutAction button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "48px",
  border: "1px solid #DCE8F5",
  borderRadius: "10px",
  padding: "0 16px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  background: "#F8FBFF",
  transition: "border 0.2s"
};

export default Checkout;
