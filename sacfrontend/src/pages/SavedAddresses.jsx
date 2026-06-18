import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

function SavedAddresses() {
  const token = localStorage.getItem("user");

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  /* ================= FETCH ADDRESSES ================= */

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to fetch addresses.");
    }
  };

  /* ================= SAVE ADDRESS ================= */

  const handleSaveAddress = async () => {
    try {
      await api.post("/address", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowForm(false);
      setNewAddress({
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        pinCode: "",
        phone: "",
      });

      fetchAddresses();
      toast.success("Address saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save address. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2 style={{ marginBottom: "25px" }}>Delivery Address</h2>

      {/* ================= ADDRESS LIST ================= */}
      {addresses.map((addr) => (
        <div
          key={addr._id}
          style={{
            padding: "15px",
            border: "1px solid #eee",
            borderRadius: "8px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <input
            type="radio"
            checked={selectedId === addr._id}
            onChange={() => setSelectedId(addr._id)}
          />

          <div>
            <div style={{ fontWeight: "600" }}>
              {addr.firstName} {addr.lastName}
            </div>

            <div style={{ color: "#555", fontSize: "14px" }}>
              {addr.address}, {addr.apartment && addr.apartment + ","}{" "}
              {addr.city}, {addr.state} - {addr.pinCode}
            </div>

            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              📞 {addr.phone}
            </div>
          </div>
        </div>
      ))}

      {/* ================= ADD BUTTON ================= */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "8px 14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer",
          background: "#fff",
        }}
      >
        + Add New Address
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #eee",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <input
            placeholder="First Name"
            value={newAddress.firstName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, firstName: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Last Name"
            value={newAddress.lastName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, lastName: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Address"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Apartment / Landmark"
            value={newAddress.apartment}
            onChange={(e) =>
              setNewAddress({ ...newAddress, apartment: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="State"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Pin Code"
            value={newAddress.pinCode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, pinCode: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Phone Number"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
            style={inputStyle}
          />

          <button
            onClick={handleSaveAddress}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#8b4a76",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Save Address
          </button>
        </div>
      )}
    </div>
  );
}

export default SavedAddresses;