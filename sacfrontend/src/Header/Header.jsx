import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "../Assest/logo.png";
import userIcon from "../Assest/login.png";
import { useCart } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const ref = useRef();

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={inner}>

          {/* LEFT */}
          <div style={leftBlock}>

            {/*LOGO FIRST */}
            <Link to="/" className="logoBox">
              <img src={logo} alt="logo" />
            </Link>

            {/* HAMBURGER AFTER LOGO */}
            <div
              className="hamburger"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <FaBars />
            </div>

            {/* DESKTOP SEARCH */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }} className="searchInput">
              <div style={{ position: "relative", width: "100%", maxWidth: "600px", minWidth: "150px" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  style={searchBox}
                />
              </div>
            </div>

            {/* DESKTOP NAV */}
            <nav style={navStyle} className="desktopNav">
              <Link to="/" style={location.pathname === "/" ? { ...linkStyle, color: "#0077FF", borderBottom: "2px solid #0077FF", paddingBottom: "4px" } : linkStyle}>Home</Link>
              <Link to="/shop" style={location.pathname.startsWith("/shop") || location.pathname.startsWith("/product") ? { ...linkStyle, color: "#0077FF", borderBottom: "2px solid #0077FF", paddingBottom: "4px" } : linkStyle}>Shop</Link>
              <Link to="/about" style={location.pathname === "/about" ? { ...linkStyle, color: "#0077FF", borderBottom: "2px solid #0077FF", paddingBottom: "4px" } : linkStyle}>About Us</Link>
            </nav>

          </div>

          {/* RIGHT */}
          <div style={rightStyle} ref={ref}>

            {/* USER */}
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setOpen(!open)}>
               <img src={userIcon} alt="user" style={{ width: 20, height: 20, filter: "brightness(0) invert(1)" }} />
            </div>

            {/* POPUP */}
            {open && (
              <div style={popupStyle}>
                {user ? (
                  <>
                    <div style={{ padding: "14px" }}>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {user.email}
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid #eee" }} />

                    <div style={gridStyle}>
                      <div style={itemStyle} onClick={() => navigate("/my-orders")}>
                        📦 Orders
                      </div>
                      <div style={itemStyle} onClick={() => navigate("/wishlist")}>
                        ❤️ Wishlist
                      </div>
                      <div style={itemStyle} onClick={() => navigate("/adresses")}>
                        📍 Address
                      </div>
                      <div style={itemStyle} onClick={() => navigate("/accsettings")}>
                        ⚙ Settings
                      </div>
                    </div>

                    <div style={{ padding: "10px" }}>
                      <button onClick={handleLogout} style={logoutBtn}>
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    style={{ padding: "12px", cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    ➜ Login
                  </div>
                )}
              </div>
            )}

            {/* CART */}
            <Link
              to="/cart"
              style={{ color: "#fff", position: "relative", fontSize: 22 }}
            >
              <FaShoppingCart />
              {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
            </Link>

          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            className="mobileMenu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", background: "#041C32" }}
          >
          <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
          <Link to="/about" onClick={() => setMobileMenu(false)}>About Us</Link>
          <Link to="/shop" onClick={() => setMobileMenu(false)}>Shop</Link>
          <Link to="/contact" onClick={() => setMobileMenu(false)}>Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS */}
      <style>{`
        .hamburger {
          display: none;
          font-size: 22px;
          color: white;
          cursor: pointer;
        }

        .logoBox img {
          width: 120px;
        }

        .mobileMenu {
          background: black;
          display: flex;
          flex-direction: column;
          padding: 15px;
          gap: 12px;
        }

        .mobileMenu a {
          color: white;
          text-decoration: none;
        }

        @media (max-width: 768px) {

          .desktopNav {
            display: none !important;
          }

          .searchInput {
            display: none;
          }

          .hamburger {
            display: block;
          }

          .logoBox img {
            width: 100px;
          }
        }
      `}</style>
    </>
  );
}

/* ================= STYLES ================= */

const headerStyle = {
  background: "#041C32",
  height: "100px",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
};

const inner = {
  width: "100%",
  maxWidth: 1440,
  margin: "0 auto",
  padding: "0 40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "30px",
};

const leftBlock = {
  display: "flex",
  alignItems: "center",
  flex: 1,
  gap: "20px",
};

const navStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  whiteSpace: "nowrap",
  fontWeight: "600",
  fontSize: "16px",
  transition: "color 0.2s",
};

const searchBox = {
  padding: "14px 14px 14px 44px",
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "14px",
  border: "none",
  background: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  outline: "none",
  fontSize: "15px",
};

const rightStyle = {
  display: "flex",
  gap: 15,
  alignItems: "center",
  position: "relative",
};

const popupStyle = {
  position: "absolute",
  top: 50,
  right: 0,
  width: 250,
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  zIndex: 10000,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
  padding: 10,
};

const itemStyle = {
  padding: 8,
  background: "#f3f4f6",
  borderRadius: 6,
  cursor: "pointer",
};

const logoutBtn = {
  width: "100%",
  padding: 8,
  background: "red",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const badgeStyle = {
  position: "absolute",
  top: -8,
  right: -10,
  background: "#0077FF",
  color: "#fff",
  fontSize: 12,
  fontWeight: "bold",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};