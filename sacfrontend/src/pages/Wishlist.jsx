import { useEffect, useState } from "react";
import api from "../utils/api";

function Wishlist() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("user");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const res = await api.get("/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(res.data);
  };

  const removeItem = async (id) => {
    await api.delete(`/wishlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWishlist();
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto" }}>
      <h2>My Wishlist</h2>

      {items.map((item) => (
        <div key={item._id} style={{ display: "flex", gap: "20px" }}>
          <img src={item.product.mainImage} width="100" />
          <div>
            <h3>{item.product.name}</h3>
            <p>₹ {item.product.price}</p>
            <button onClick={() => removeItem(item.product._id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;
