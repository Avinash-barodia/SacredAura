import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("user");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load your orders.");
    }
  };

  const getStatusDate = (order) => {
    switch (order.orderStatus) {
      case "Confirmed":
        return order.statusDates?.confirmedAt
          ? new Date(order.statusDates.confirmedAt).toLocaleDateString()
          : new Date(order.createdAt).toLocaleDateString();

      case "Shipped":
        return order.statusDates?.shippedAt
          ? new Date(order.statusDates.shippedAt).toLocaleDateString()
          : "";

      case "Out for Delivery":
        return order.statusDates?.outForDeliveryAt
          ? new Date(order.statusDates.outForDeliveryAt).toLocaleDateString()
          : "";

      case "Delivered":
        return order.statusDates?.deliveredAt
          ? new Date(order.statusDates.deliveredAt).toLocaleDateString()
          : "";

      default:
        return new Date(order.createdAt).toLocaleDateString();
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2>Your Orders</h2>

      {orders.length === 0 && <p>No Orders Found</p>}

      {orders.map((order) =>
        order.items.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            <img
              src={item.product?.mainImage}
              alt={item.product?.name}
              width="90"
              style={{ borderRadius: "8px" }}
            />

            <div style={{ marginLeft: "20px", flex: 1 }}>
              <div style={{ fontWeight: "600" }}>
                {order.orderStatus}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#777",
                  marginTop: "4px",
                }}
              >
                {getStatusDate(order)}
              </div>

              <div style={{ color: "#666", marginTop: "5px" }}>
                {item.product?.name}
              </div>
            </div>

            <div style={{ fontSize: "22px", color: "#888" }}>›</div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
