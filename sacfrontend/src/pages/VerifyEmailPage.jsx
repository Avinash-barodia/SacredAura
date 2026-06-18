import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { CheckCircle, XCircle, Loader, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [resendStatus, setResendStatus] = useState(""); // "", "loading", "success", "error"
  const [emailForResend, setEmailForResend] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No token provided");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        login(res.data.user);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.response?.data?.message || "Verification failed");
      }
    };

    verifyToken();
  }, [token, navigate, login]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!emailForResend) return;
    
    setResendStatus("loading");
    try {
      await api.post("/auth/resend-verification", { email: emailForResend });
      setResendStatus("success");
    } catch (err) {
      setResendStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to resend");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {status === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <Loader className="spinner" size={48} color="#0077FF" style={{ animation: "spin 1s linear infinite" }} />
            <h2 style={{ fontSize: "24px", color: "#111827", margin: 0 }}>Verifying your email...</h2>
            <p style={{ color: "#6B7280", margin: 0 }}>Please wait while we validate your link.</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === "success" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <CheckCircle size={64} color="#10B981" />
            <h2 style={{ fontSize: "24px", color: "#111827", margin: 0 }}>Email Verified!</h2>
            <p style={{ color: "#6B7280", margin: 0 }}>Your account is now active. Redirecting you home...</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <XCircle size={64} color="#EF4444" />
            <h2 style={{ fontSize: "24px", color: "#111827", margin: 0 }}>Verification Failed</h2>
            <p style={{ color: "#6B7280", margin: 0 }}>{errorMessage}</p>

            {resendStatus !== "success" ? (
              <form onSubmit={handleResend} style={{ width: "100%", marginTop: "10px" }}>
                <p style={{ color: "#374151", fontSize: "14px", marginBottom: "12px", fontWeight: "500" }}>Need a new link?</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={emailForResend}
                  onChange={(e) => setEmailForResend(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #D1D5DB", marginBottom: "12px", outline: "none", fontFamily: "inherit" }}
                />
                <button
                  type="submit"
                  disabled={resendStatus === "loading"}
                  style={{
                    width: "100%", padding: "12px", background: "#0077FF", color: "white", border: "none", borderRadius: "8px",
                    fontWeight: "600", cursor: resendStatus === "loading" ? "not-allowed" : "pointer", opacity: resendStatus === "loading" ? 0.7 : 1,
                    transition: "all 0.2s"
                  }}
                >
                  {resendStatus === "loading" ? "Sending..." : "Resend Verification Email"}
                </button>
              </form>
            ) : (
              <div style={{ background: "#ECFDF5", color: "#065F46", padding: "16px", borderRadius: "8px", width: "100%", boxSizing: "border-box" }}>
                <p style={{ margin: 0, fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Mail size={18} /> New link sent!
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "14px", opacity: 0.9 }}>Check your inbox.</p>
              </div>
            )}
            
            <Link to="/login" style={{ marginTop: "10px", color: "#0077FF", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
