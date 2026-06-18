import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import OrderTracking from "../components/OrderTracking";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem("user");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load order.");
    }
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return <div style={{ maxWidth: "900px", margin: "40px auto" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div
        onClick={() => navigate("/my-orders")}
        style={{
          cursor: "pointer",
          marginBottom: "20px",
          fontWeight: "600",
          color: "#007bff",
        }}
      >
        ← Back to Orders
      </div>

      <h2>Order Details</h2>

      {order.items.map((item) => (
        <div key={item._id} style={{ marginTop: "20px" }}>
          {/* PRODUCT */}
          <div style={{ display: "flex", gap: "20px" }}>
            <img
              src={item.product?.mainImage}
              alt={item.product?.name}
              width="120"
              style={{ borderRadius: "10px" }}
            />

            <div>
              <h3>{item.product?.name}</h3>
              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        </div>
      ))}

      {/* ORDER ID */}
      <div style={{ marginTop: "25px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "600",
          }}
        >
          {order.orderId}

          <span
            onClick={() => copyOrderId(order.orderId)}
            style={{
              cursor: "pointer",
              color: "#2874f0",
              fontSize: "18px",
            }}
          >
            📋
          </span>
        </div>

        {copied && (
          <div style={{ color: "green", marginTop: "5px" }}>
            Order ID Copied!
          </div>
        )}
      </div>

      {/* TRACKING TIMELINE */}
      <OrderTracking order={order} />

      {/* DELIVERY DETAILS */}
      <div style={{ marginTop: "25px" }}>
        <h3>Delivery details</h3>
        <div
          style={{
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "10px",
          }}
        >
          <div>
            {order.shippingAddress?.firstName}{" "}
            {order.shippingAddress?.lastName}
          </div>
          <div>{order.shippingAddress?.address}</div>
          <div>{order.shippingAddress?.city}</div>
          <div>
            {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.pinCode}
          </div>
          <div>Phone: {order.shippingAddress?.phone}</div>
        </div>
      </div>

      {/* PRICE DETAILS */}
      <div style={{ marginTop: "25px", marginBottom: "40px" }}>
        <h3>Price Details</h3>
        <div
          style={{
            border: "1px solid #eee",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px"
            }}
          >
            <span>Subtotal</span>
            <span>₹ {order.subtotal?.toFixed(2) || "0.00"}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px"
            }}
          >
            <span>Tax (18%)</span>
            <span>₹ {order.gstAmount?.toFixed(2) || "0.00"}</span>
          </div>

          <div style={{ borderTop: "1px dashed #E2E8F0", margin: "15px 0" }}></div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold"
            }}
          >
            <span>Total Amount</span>
            <span>₹ {order.totalAmount?.toFixed(2) || "0.00"}</span>
          </div>

          <div style={{ marginTop: "15px", color: "#555" }}>
            Payment Method:{" "}
            {order.paymentMethod === "COD"
              ? "Cash On Delivery"
              : order.paymentMethod}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
