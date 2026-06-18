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

  return (
    <div style={{ marginBottom:"20px" }}>
      <h2 style={{ textAlign: "center" }}>All Orders</h2>

      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>User Mail</th>
              <th>Address</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) =>
              order.items.map((item) => (
                <tr key={item._id}>
                  <td>{order.orderId}</td>

                  <td style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <img
                      src={item.product?.mainImage}
                      width="40"
                      alt=""
                    />
                    {item.product?.name}
                  </td>

                  <td>₹ {item.price * item.quantity}</td>

                  <td>{order.user?.email}</td>

                  <td style={{ fontSize: "13px" }}>
                    {order.shippingAddress?.firstName}{" "}
                    {order.shippingAddress?.lastName},
                    {order.shippingAddress?.address},
                    {order.shippingAddress?.city},
                    {order.shippingAddress?.state} -
                    {order.shippingAddress?.pinCode}
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        background:
                          order.orderStatus === "Confirmed"
                            ? "#d4edda"
                            : order.orderStatus === "Shipped"
                            ? "#d1ecf1"
                            : order.orderStatus === "Delivered"
                            ? "#c3e6cb"
                            : "#fff3cd",
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", cursor: page === 1 ? "not-allowed" : "pointer" }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold" }}>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default AdminOrders;