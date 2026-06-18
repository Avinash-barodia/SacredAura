import React, { useEffect, Suspense } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Header from "./Header/Header";
import Footer from "./Header/Footer";
import Home from "./Homepage/Home";
import LoginSignup from "./Homepage/LoginSignup";
import AdminDashbaord from "./Admin/AdminDashboard";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./Admin/AdminOrders";
import Wishlist from "./pages/Wishlist";
import AccountSettings from "./pages/AccountSettings";
import SavedAddresses from "./pages/SavedAddresses";
import AboutUs from "./components/AboutUs";
import TermsConditions from "./components/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import RefundPolicy from "./components/RefundPolicy";
import ShippingPolicy from "./components/ShippingPolicy";
import Contact from "./components/Contact";
import FAQ from "./Homepage/FAQ";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmailPage from "./pages/VerifyEmailPage";

const OrderDetail = React.lazy(() => import("./pages/OrderDetail"));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOrderSuccess = location.pathname === "/order-success";

  
  const hideLayout = isAdminRoute || isOrderSuccess;

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/terms-conditions" element={<TermsConditions/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/refund-policy" element={<RefundPolicy/>} />
        <Route path="/shipping-policy" element={<ShippingPolicy/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
             path="/admin"
             element={
             <ProtectedAdminRoute>
             <AdminDashbaord />
             </ProtectedAdminRoute>
          }
        />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={
          <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>}>
            <OrderDetail />
          </Suspense>
        } />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/accsettings" element={<AccountSettings/>} />
        <Route path="/adresses" element={<SavedAddresses/>} />
        <Route path="/faq" element={<FAQ/>} />
        
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
