import React from "react";
import {
  FaUserShield,
  FaDatabase,
  FaCreditCard,
  FaShareAlt,
  FaCookieBite,
  FaLock,
  FaClock,
  FaUserCheck,
  FaExternalLinkAlt,
  FaChild,
  FaSyncAlt,
  FaPhoneAlt
} from "react-icons/fa";

const PrivacyPolicy = () => {

  const section = {
    background: "#f3f4f6",
    padding: "30px 15px",
   
  };

  const container = {
    maxWidth: "900px",
    margin: "auto"
  };

  const intro = {
    textAlign: "center",
    marginBottom: "40px"
  };

  const card = {
    background: "#ffffff",
    padding: "25px 28px",
    borderRadius: "14px",
    marginBottom: "22px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    display: "flex",
    gap: "15px"
  };

  const iconBox = {
    minWidth: "42px",
    height: "42px",
    background: "#e6f4f9",
    color: "#006895",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    fontSize: "18px"
  };

  const title = {
    color: "#111827",
    marginBottom: "6px"
  };

  const text = {
    color: "#4b5563",
    lineHeight: "1.9",
    fontSize: "15px"
  };

  const list = {
    paddingLeft: "18px",
    marginTop: "8px",
    lineHeight: "1.9"
  };

  const Block = ({ icon, titleText, children }) => (
    <div style={card}>
      <div style={iconBox}>{icon}</div>

      <div style={{ flex: 1 }}>
        <h3 style={title}>{titleText}</h3>
        <div style={text}>{children}</div>
      </div>
    </div>
  );

  return (
    <section style={section}>
      <div style={container}>

        {/* INTRO */}
        <div style={intro}>
          <h1 style={{ color: "#006895" }}>Privacy Policy</h1>

          <p style={text}>
            SACREDAURA TECHNOLOGY LLP values customer privacy and is
            committed to protecting personal information collected
            through our website. By using our website, you agree to
            the practices described in this Privacy Policy.
          </p>
        </div>

        {/* 1 */}
        <Block icon={<FaDatabase />} titleText="Information We Collect">
          <ul style={list}>
            <li>Full Name</li>
            <li>Contact Number</li>
            <li>Email Address</li>
            <li>Billing Address</li>
            <li>Shipping Address</li>
            <li>Company Name (if applicable)</li>
            <li>IP Address & Device Information</li>
          </ul>
          <p>
            Payment information is processed securely via authorized
            gateways and is not stored by SACREDAURA TECHNOLOGY LLP.
          </p>
        </Block>

        {/* 2 */}
        <Block icon={<FaUserCheck />} titleText="How We Use Your Information">
          <ul style={list}>
            <li>Processing and confirming orders</li>
            <li>Product delivery coordination</li>
            <li>Customer service support</li>
            <li>Fraud prevention & verification</li>
            <li>Improving website services</li>
            <li>Sending order updates</li>
          </ul>
          <p>Customer data is never used for unauthorized marketing.</p>
        </Block>

        {/* 3 */}
        <Block icon={<FaCreditCard />} titleText="Payment Security">
          <p>
            Payments are processed securely via trusted gateways such as Razorpay.
          </p>
          <ul style={list}>
            <li>Debit card details</li>
            <li>Credit card details</li>
            <li>Net banking credentials</li>
            <li>UPI authentication data</li>
          </ul>
          <p>These details are never stored by our company.</p>
        </Block>

        {/* 4 */}
        <Block icon={<FaShareAlt />} titleText="Sharing of Information">
          <ul style={list}>
            <li>Payment gateway partners</li>
            <li>Courier & logistics providers</li>
            <li>Technical service providers</li>
            <li>Government authorities when required by law</li>
          </ul>
        </Block>

        {/* 5 */}
        <Block icon={<FaCookieBite />} titleText="Cookies & Tracking Technologies">
          <ul style={list}>
            <li>Enhance browsing experience</li>
            <li>Remember user preferences</li>
            <li>Analyze website performance</li>
            <li>Improve service quality</li>
          </ul>
        </Block>

        {/* 6 */}
        <Block icon={<FaLock />} titleText="Data Protection & Security">
          <ul style={list}>
            <li>Protection against unauthorized access</li>
            <li>Prevention of data misuse</li>
            <li>Safeguards against loss or alteration</li>
          </ul>
          <p>No internet transmission method is completely secure.</p>
        </Block>

        {/* 7 */}
        <Block icon={<FaClock />} titleText="Data Retention">
          <ul style={list}>
            <li>Complete transactions</li>
            <li>Fulfill legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce agreements</li>
          </ul>
        </Block>

        {/* 8 */}
        <Block icon={<FaUserShield />} titleText="User Rights">
          <ul style={list}>
            <li>Request access to personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of personal data</li>
          </ul>
        </Block>

        {/* 9 */}
        <Block icon={<FaExternalLinkAlt />} titleText="Third-Party Links">
          External websites linked from our platform are governed
          by their own privacy policies.
        </Block>

        {/* 10 */}
        <Block icon={<FaChild />} titleText="Children’s Privacy">
          Our services are not intended for individuals under 18 years.
          We do not knowingly collect information from minors.
        </Block>

        {/* 11 */}
        <Block icon={<FaSyncAlt />} titleText="Policy Updates">
          SACREDAURA TECHNOLOGY LLP may update this Privacy Policy
          anytime. Updated versions will be published on this page.
        </Block>

        {/* 12 */}
        <Block icon={<FaPhoneAlt />} titleText="Contact Information">
          <strong>SACREDAURA TECHNOLOGY LLP</strong><br/>
          🌐 www.sacredaura.com
        </Block>

      </div>
    </section>
  );
};

export default PrivacyPolicy;