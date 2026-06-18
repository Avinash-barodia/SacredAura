import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  const renderLeftBrandSection = () => (
    <div className="brand-section">
      <div className="brand-badge">Smart Home Automation</div>
      <h1 className="brand-headline">
        Smart Living.<br />
        Connected Homes.
      </h1>
      <div className="brand-subheading">
        Control Lights.<br />
        Control Fans.<br />
        Control Security.<br />
        Control Everything.
      </div>
      <div className="brand-graphics">
        {/* Abstract technology shapes / glowing circles */}
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="150" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />
          <circle cx="200" cy="200" r="100" stroke="rgba(0,119,255,0.2)" strokeWidth="20" />
          <circle cx="200" cy="200" r="50" fill="rgba(0,119,255,0.4)" />
          <path d="M200 50 L200 0 M200 400 L200 350 M50 200 L0 200 M400 200 L350 200" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="auth-page-container">
      <style>{`
        .auth-page-container {
            min-height: calc(100vh - 160px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #F5FAFF 0%, #EAF3FF 100%);
            padding: 40px 20px;
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow: hidden;
        }
        .auth-page-container::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: radial-gradient(#0077FF 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.05;
            pointer-events: none;
        }
        .auth-layout {
            display: grid;
            grid-template-columns: 60% 40%;
            gap: 48px;
            max-width: 1400px;
            width: 100%;
            z-index: 1;
        }
        .brand-section {
            background: linear-gradient(135deg, #041C32, #062548, #0077FF);
            border-radius: 32px;
            padding: 64px;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .brand-badge {
            display: inline-block;
            padding: 8px 16px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
            backdrop-filter: blur(10px);
            width: max-content;
        }
        .brand-headline {
            font-size: 48px;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 24px;
        }
        .brand-subheading {
            font-size: 20px;
            color: rgba(255,255,255,0.8);
            line-height: 1.5;
        }
        .brand-graphics {
            position: absolute;
            bottom: -50px;
            right: -50px;
            opacity: 0.5;
            pointer-events: none;
        }
        .auth-card-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        .auth-card {
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(20px);
            border-radius: 28px;
            box-shadow: 0 20px 60px rgba(0,90,200,0.12);
            border: 1px solid rgba(255,255,255,0.5);
            width: 100%;
            max-width: 480px;
            padding: 48px;
            transition: all 0.3s ease;
        }
        .auth-header {
            font-size: 28px;
            font-weight: 800;
            color: #0F172A;
            margin-bottom: 8px;
        }
        .auth-subtext {
            color: #64748B;
            font-size: 15px;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        .input-group {
            margin-bottom: 24px;
            position: relative;
        }
        .input-group label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #0F172A;
            margin-bottom: 8px;
        }
        .input-icon {
            position: absolute;
            bottom: 16px;
            left: 16px;
            color: #94A3B8;
            pointer-events: none;
        }
        .input-field {
            width: 100%;
            height: 56px;
            border-radius: 14px;
            border: 1px solid #DCE8F5;
            background: white;
            padding: 0 16px 0 48px;
            font-size: 15px;
            color: #0F172A;
            outline: none;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        .input-field:focus {
            border-color: #0077FF;
            box-shadow: 0 0 0 4px rgba(0,119,255,0.1);
        }
        .primary-btn {
            width: 100%;
            height: 56px;
            border-radius: 14px;
            background: linear-gradient(135deg, #0077FF, #0052CC);
            color: white;
            border: none;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(0,119,255,0.3);
        }
        .footer-text {
            text-align: center;
            margin-top: 24px;
            font-size: 15px;
            color: #64748B;
        }
        .footer-text span {
            color: #0077FF;
            font-weight: 600;
            cursor: pointer;
        }
        .fade-in {
            animation: fadeIn 300ms ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 992px) {
            .auth-layout {
                grid-template-columns: 1fr;
                gap: 32px;
            }
            .brand-section {
                padding: 40px;
                border-radius: 24px;
            }
        }
        @media (max-width: 768px) {
            .auth-page-container {
                padding: 20px 16px;
                display: block;
                height: auto;
            }
            .brand-section {
                display: none;
            }
            .auth-card {
                padding: 32px 24px;
            }
        }
      `}</style>

      <div className="auth-layout">
        {renderLeftBrandSection()}
        
        <div className="auth-card-container">
          <div className="auth-card fade-in" key={isSuccess ? "success" : "form"}>
            {isSuccess ? (
              <div style={{ textAlign: "center" }}>
                <CheckCircle2 size={64} color="#16A34A" style={{ margin: "0 auto 24px" }} />
                <h2 className="auth-header">Check Your Email</h2>
                <p className="auth-subtext" style={{ marginBottom: "24px" }}>
                  We've sent a password reset link to your email address.
                </p>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <h2 className="auth-header">Forgot Password?</h2>
                <p className="auth-subtext">
                  Enter your email address and we'll send you a reset link.
                </p>

                {error && (
                  <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>Email</label>
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <button type="submit" className="primary-btn">
                    Send Reset Link
                  </button>
                </form>

                <div className="footer-text">
                  <span onClick={() => navigate("/login")}>Back to Login</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
