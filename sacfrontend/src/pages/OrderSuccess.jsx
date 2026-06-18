import { useNavigate, useLocation } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#c70039",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "#ffeaa7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "#f1c40f",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "60px",
            color: "#fff",
          }}
        >
          ✓
        </div>
      </div>

      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Order Placed Successfully
      </h1>

      {/* ✅ Order ID Display */}
      {orderId && (
        <p style={{ fontWeight: "600", marginTop: "10px" }}>
          Order ID: {orderId}
        </p>
      )}

      <p style={{ opacity: 0.9 }}>
        Thank you for shopping with us ❤️
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "30px",
          padding: "12px 25px",
          background: "#fff",
          color: "#c70039",
          border: "none",
          borderRadius: "6px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default OrderSuccess;
