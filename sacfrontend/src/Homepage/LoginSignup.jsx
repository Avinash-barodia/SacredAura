import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", mobile: "", password: "", confirmPassword: "", agreed: false });
  const [error, setError] = useState("");
  const [verificationSentTo, setVerificationSentTo] = useState("");
  const [resendStatus, setResendStatus] = useState("");

  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const data = await googleLogin(tokenResponse.access_token);
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(`Backend Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => setError(`Popup Error: ${err?.error || "Unknown authentication failure"}`)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (isLogin) {
        const data = await login(form.email, form.password);
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(from, { replace: true });
        }
      } else {
        if (!form.agreed) {
          setError("You must agree to the Terms & Conditions");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const fullName = `${form.firstName} ${form.lastName}`.trim();

        await signup({
          name: fullName,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        });

        setVerificationSentTo(form.email);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleResend = async () => {
    setResendStatus("loading");
    try {
      await api.post("/auth/resend-verification", { email: verificationSentTo });
      setResendStatus("success");
    } catch (err) {
      setResendStatus("error");
      setError(err.response?.data?.message || "Failed to resend");
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
        }
        .input-group {
            margin-bottom: 20px;
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
        .forgot-password-link {
            display: block;
            text-align: right;
            color: #0077FF;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            margin-top: -8px;
            margin-bottom: 24px;
            cursor: pointer;
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
        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 24px 0;
            color: #94A3B8;
            font-size: 14px;
        }
        .divider::before, .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #DCE8F5;
        }
        .divider::before { margin-right: 16px; }
        .divider::after { margin-left: 16px; }
        .social-btn {
            width: 100%;
            height: 56px;
            border-radius: 14px;
            background: white;
            border: 1px solid #DCE8F5;
            color: #0F172A;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .social-btn:hover {
            background: #F8FAFC;
            border-color: #CBD5E1;
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
            margin-left: 4px;
        }
        .fade-in {
            animation: fadeIn 300ms ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }
        .checkbox-group input {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        .checkbox-group label {
            font-size: 14px;
            color: #64748B;
            margin: 0;
            font-weight: normal;
        }
        .row {
            display: flex;
            gap: 16px;
        }
        .row > div {
            flex: 1;
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
            .row {
                flex-direction: column;
                gap: 0;
            }
        }
      `}</style>

      <div className="auth-layout">
        {renderLeftBrandSection()}
        
        <div className="auth-card-container">
          <div className="auth-card fade-in" key={verificationSentTo ? "success" : isLogin ? "login" : "signup"}>
            
            {verificationSentTo ? (
              <div style={{ textAlign: "center" }}>
                <CheckCircle2 size={64} color="#16A34A" style={{ margin: "0 auto 24px" }} />
                <h2 className="auth-header">Check Your Email</h2>
                <p className="auth-subtext" style={{ marginBottom: "24px" }}>
                  We've sent a verification email to <strong>{verificationSentTo}</strong>.<br/>
                  Please check your inbox to activate your account.
                </p>
                {resendStatus === "success" && (
                  <p style={{ color: "#16A34A", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>
                    New link sent successfully!
                  </p>
                )}
                {error && (
                  <p style={{ color: "red", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
                )}
                <button
                  className="primary-btn"
                  onClick={handleResend}
                  disabled={resendStatus === "loading"}
                  style={{ opacity: resendStatus === "loading" ? 0.7 : 1 }}
                >
                  {resendStatus === "loading" ? "Sending..." : "Resend Email"}
                </button>
                <div className="footer-text">
                  <span onClick={() => { setVerificationSentTo(""); setIsLogin(true); }}>
                    Back to Login
                  </span>
                </div>
              </div>
            ) : isLogin ? (
              <>
                <h2 className="auth-header">Welcome Back 👋</h2>
                <p className="auth-subtext">Continue to SacredAura</p>

                {error && (
                  <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>
                )}

                <div className="input-group">
                  <label>Email</label>
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Password</label>
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="forgot-password-link" onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                </div>

                <button className="primary-btn" onClick={handleSubmit}>
                  Sign In
                </button>

                <div className="divider">or continue with</div>

                <button className="social-btn" onClick={() => loginWithGoogle()}>
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="footer-text">
                  Don't have an account?
                  <span onClick={() => setIsLogin(false)}>Create Account</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="auth-header">Create Account</h2>
                <p className="auth-subtext">Start your Smart Home journey</p>

                {error && (
                  <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>
                )}

                <div className="row">
                  <div className="input-group">
                    <label>First Name</label>
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="First name"
                    />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Email address"
                  />
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <Phone className="input-icon" size={20} />
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Phone number"
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Create password"
                  />
                </div>

                <div className="input-group">
                  <label>Confirm Password</label>
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Confirm password"
                  />
                </div>

                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    name="agreed"
                    checked={form.agreed}
                    onChange={handleChange}
                    id="terms" 
                  />
                  <label htmlFor="terms">I agree to Terms & Conditions</label>
                </div>

                <button className="primary-btn" onClick={handleSubmit}>
                  Create Account
                </button>

                <div className="divider">or continue with</div>

                <button className="social-btn" onClick={() => loginWithGoogle()}>
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="footer-text">
                  Already have an account?
                  <span onClick={() => setIsLogin(true)}>Sign In</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
