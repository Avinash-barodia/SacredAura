import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

function AccountSettings() {
  const token = localStorage.getItem("user");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= GET PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async () => {
    try {
      await api.put("/users/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    try {
      await api.put("/users/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Account Settings</h2>

      {/* ================= EDIT PROFILE ================= */}
      <div style={{ marginTop: "30px" }}>
        <h3>Edit Profile</h3>

        <input
          placeholder="Name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Mobile"
          value={profile.mobile}
          onChange={(e) =>
            setProfile({ ...profile, mobile: e.target.value })
          }
          style={inputStyle}
        />

        <button onClick={handleUpdateProfile} style={buttonStyle}>
          Save Changes
        </button>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}
      <div style={{ marginTop: "50px" }}>
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
          style={inputStyle}
        />

        <button onClick={handleChangePassword} style={buttonStyle}>
          Update Password
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#8b4a76",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AccountSettings;