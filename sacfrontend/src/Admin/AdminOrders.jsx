import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("user");

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNum) => {
    try {
      const res = await api.get(`/orders/admin?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend returns { orders, totalPages, currentPage }
      setOrders(res.data.orders || res.data);
      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to fetch orders.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(
        `/orders/${id}`,
        { orderStatus: status }, // ✅ SAME NAME
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? res.data : order
        )
      );
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update order status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff3cd", color: "#856404", border: "#ffeeba" };
      case "Confirmed":
        return { bg: "#cce5ff", color: "#004085", border: "#b8daff" };
      case "Shipped":
        return { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" };
      case "Out for Delivery":
        return { bg: "#e2e3e5", color: "#383d41", border: "#d6d8db" };
      case "Delivered":
        return { bg: "#d4edda", color: "#155724", border: "#c3e6cb" };
      case "Cancelled":
        return { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" };
      default:
        return { bg: "#e2e3e5", color: "#383d41", border: "#d6d8db" };
    }
  };

  return (
    <div style={{ marginBottom: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>All Orders</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        {orders.map((order) => (
          <div key={order._id} style={{ 
            border: "1px solid #eaeaea", 
            borderRadius: "12px", 
            padding: "20px", 
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            background: "#fff"
          }}>
            {/* Header: Order ID & Status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #eaeaea", paddingBottom: "15px", marginBottom: "15px" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#1a1a1a" }}>Order #{order.orderId.replace("ORD-", "")}</h3>
                <span style={{ fontSize: "12px", color: "#777" }}>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div style={{
                background: getStatusColor(order.orderStatus).bg,
                color: getStatusColor(order.orderStatus).color,
                border: `1px solid ${getStatusColor(order.orderStatus).border}`,
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {order.orderStatus}
              </div>
            </div>

            {/* Grid: Customer, Address, Payment */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px", fontSize: "14px", color: "#444" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span style={{ color: "#777" }}>Customer:</span> <span style={{ fontWeight: "600", color: "#222" }}>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span style={{ color: "#777" }}>Email:</span> <span style={{ fontWeight: "500" }}>{order.user?.email || "Guest"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span style={{ color: "#777" }}>Phone:</span> <span style={{ fontWeight: "500" }}>{order.shippingAddress?.phone || "N/A"}</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: "2px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span style={{ color: "#777", whiteSpace: "nowrap" }}>Address:</span>
                  <div style={{ fontWeight: "500" }}>
                    {order.shippingAddress?.address}<br />
                    City: {order.shippingAddress?.city}<br />
                    State: {order.shippingAddress?.state}<br />
                    Pincode: {order.shippingAddress?.pinCode}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: "#777" }}>$</span> <span style={{ color: "#777" }}>Payment:</span> <span style={{ fontWeight: "bold" }}>{order.paymentMethod}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: "#777" }}>≡</span> <span style={{ color: "#777" }}>AWB:</span> <span style={{ fontWeight: "600" }}>DUMMY7D129</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#777" }}>Track:</span> <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>Track</a> | <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>Label</a>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", marginBottom: "15px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Order Items ({order.items.length})</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {order.items.map((item) => (
                  <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f9f9", padding: "10px 15px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <img src={item.product?.mainImage} alt={item.product?.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#222" }}>{item.product?.name}</div>
                        <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold", color: "#00b25c", fontSize: "15px" }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: Total & Actions */}
            <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#444" }}>Update Status:</span>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {/* Note: Update is automatic on change in the current implementation, but adding a visually similar button as requested */}
                <button 
                  onClick={() => toast.success("Status is automatically saved on selection!")}
                  style={{
                    background: "#6658a6",
                    color: "white",
                    border: "none",
                    padding: "9px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Update Status
                </button>
                <button 
                  style={{
                    background: "#0c7b6d",
                    color: "white",
                    border: "none",
                    padding: "9px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Print Delivery Receipt
                </button>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>Order Total:</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#00b25c" }}>₹{order.totalAmount}</div>
                {order.paymentMethod === "COD" && (
                  <div style={{ fontSize: "12px", color: "#d9534f", fontWeight: "500", marginTop: "2px" }}>
                    Includes ₹0.00 COD (If applicable)
                  </div>
                )}
              </div>

            </div>

          </div>
        ))}

        {orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#777", background: "#f9f9f9", borderRadius: "8px" }}>
            No orders found.
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "30px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", cursor: page === 1 ? "not-allowed" : "pointer", background: page === 1 ? "#f5f5f5" : "#fff" }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold", color: "#444" }}>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", cursor: page >= totalPages ? "not-allowed" : "pointer", background: page >= totalPages ? "#f5f5f5" : "#fff" }}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default AdminOrders;