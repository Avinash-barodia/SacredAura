import React, { useEffect, Suspense } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header/Header";
import Footer from "./Header/Footer";
import PageLoader from "./components/PageLoader";
import CookieConsent from "./components/CookieConsent";

const Home = React.lazy(() => import("./Homepage/Home"));
const LoginSignup = React.lazy(() => import("./Homepage/LoginSignup"));
const AdminDashbaord = React.lazy(() => import("./Admin/AdminDashboard"));
const Shop = React.lazy(() => import("./pages/Shop"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderSuccess = React.lazy(() => import("./pages/OrderSuccess"));
const MyOrders = React.lazy(() => import("./pages/MyOrders"));
const AdminOrders = React.lazy(() => import("./Admin/AdminOrders"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const AccountSettings = React.lazy(() => import("./pages/AccountSettings"));
const SavedAddresses = React.lazy(() => import("./pages/SavedAddresses"));
const AboutUs = React.lazy(() => import("./components/AboutUs"));
const TermsConditions = React.lazy(() => import("./components/TermsConditions"));
const PrivacyPolicy = React.lazy(() => import("./components/PrivacyPolicy"));
const RefundPolicy = React.lazy(() => import("./components/RefundPolicy"));
const ShippingPolicy = React.lazy(() => import("./components/ShippingPolicy"));
const Contact = React.lazy(() => import("./components/Contact"));
const FAQ = React.lazy(() => import("./Homepage/FAQ"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const VerifyEmailPage = React.lazy(() => import("./pages/VerifyEmailPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOrderSuccess = location.pathname === "/order-success";

  
  const hideLayout = isAdminRoute || isOrderSuccess;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <CookieConsent />
      {!hideLayout && <Header />}

      <Suspense fallback={<PageLoader />}>
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
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/accsettings" element={<AccountSettings/>} />
        <Route path="/adresses" element={<SavedAddresses/>} />
        <Route path="/faq" element={<FAQ/>} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
