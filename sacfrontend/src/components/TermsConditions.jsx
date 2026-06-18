import React from "react";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaUserShield,
  FaShoppingCart,
  FaCreditCard,
  FaTools,
  FaShieldAlt,
  FaCopyright,
  FaExclamationTriangle,
  FaTruck,
  FaUndo,
  FaLock,
  FaSyncAlt,
  FaBalanceScale,
  FaPhoneAlt
} from "react-icons/fa";

const TermsConditions = () => {

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
          <h1 style={{ color: "#006895" }}>Terms & Conditions</h1>

          <p style={text}>
            Welcome to <strong>SACREDAURA TECHNOLOGY LLP</strong>.
            These Terms & Conditions outline the rules and regulations
            for the use of our website and purchase of products offered
            through our online platform.
          </p>
        </div>

        {/* USE WEBSITE */}
        <Block icon={<FaCheckCircle />} titleText="Use of Website">
          <p>By accessing this website, you agree to:</p>
          <ul style={list}>
            <li>Provide accurate and complete information.</li>
            <li>Use the website only for lawful purposes.</li>
            <li>Not engage in fraudulent activities.</li>
            <li>Not disrupt website functionality or security.</li>
            <li>Not misuse website or product content.</li>
          </ul>
        </Block>

        {/* PRODUCTS */}
        <Block icon={<FaBoxOpen />} titleText="Products & Services">
          <ul style={list}>
            <li>Automatic Water Taps</li>
            <li>Automatic Urinal Flush Systems</li>
            <li>Soap & Sanitizer Dispensers</li>
            <li>Tissue & Paper Dispensers</li>
            <li>Hand Dryers</li>
            <li>Smart Switches & Locks</li>
            <li>Smart Lighting Systems</li>
            <li>Aroma Dispensers</li>
            <li>Sanitary Disposal Machines</li>
            <li>Automation Accessories</li>
          </ul>
          <p>
            Product appearance may vary due to manufacturer updates.
          </p>
        </Block>

        {/* ACCOUNT */}
        <Block icon={<FaUserShield />} titleText="Account Responsibility">
          <ul style={list}>
            <li>Maintain confidentiality of login credentials.</li>
            <li>You are responsible for all account activities.</li>
            <li>Report unauthorized use immediately.</li>
          </ul>
        </Block>

        {/* ORDERS */}
        <Block icon={<FaShoppingCart />} titleText="Orders & Acceptance">
          <ul style={list}>
            <li>Product stock unavailability</li>
            <li>Incorrect pricing or technical errors</li>
            <li>Payment authorization failure</li>
            <li>Suspected fraudulent transactions</li>
          </ul>
        </Block>

        {/* PAYMENT */}
        <Block icon={<FaCreditCard />} titleText="Pricing & Payment">
          <ul style={list}>
            <li>All prices are in INR.</li>
            <li>Prices may change without notice.</li>
            <li>Secure payment via Razorpay.</li>
            <li>No storage of card details.</li>
          </ul>
        </Block>

        {/* INSTALL */}
        <Block icon={<FaTools />} titleText="Installation & Usage">
          <ul style={list}>
            <li>Professional installation may be required.</li>
            <li>Installation may be chargeable.</li>
            <li>Improper installation damage not covered.</li>
          </ul>
        </Block>

        {/* WARRANTY */}
        <Block icon={<FaShieldAlt />} titleText="Warranty Disclaimer">
          <ul style={list}>
            <li>Physical or accidental damage</li>
            <li>Electrical fluctuations</li>
            <li>Unauthorized repair</li>
            <li>Normal wear & tear</li>
          </ul>
        </Block>

        {/* IP */}
        <Block icon={<FaCopyright />} titleText="Intellectual Property">
          Website logos, images, text, graphics and design belong to
          SACREDAURA TECHNOLOGY LLP.
        </Block>

        {/* LIABILITY */}
        <Block icon={<FaExclamationTriangle />} titleText="Limitation of Liability">
          Company is not liable for indirect damages,
          delivery delays or temporary downtime.
        </Block>

        {/* THIRD PARTY */}
        <Block icon={<FaTruck />} titleText="Third-Party Services">
          Payment gateways and courier partners operate independently.
        </Block>

        {/* CANCEL */}
        <Block icon={<FaUndo />} titleText="Cancellation Policy">
          Orders may be cancelled only before dispatch.
        </Block>

        {/* PRIVACY */}
        <Block icon={<FaLock />} titleText="Privacy & Data Protection">
          Customer information is handled according to our Privacy Policy.
        </Block>

        {/* MODIFICATION */}
        <Block icon={<FaSyncAlt />} titleText="Modification of Terms">
          Terms may be updated anytime without prior notice.
        </Block>

        {/* LAW */}
        <Block icon={<FaBalanceScale />} titleText="Governing Law">
          Governed by Indian law under Pune jurisdiction.
        </Block>

        {/* CONTACT */}
        <Block icon={<FaPhoneAlt />} titleText="Contact Information">
          <strong>SACREDAURA TECHNOLOGY LLP</strong><br/>
          🌐 www.sacredaura.com
        </Block>

      </div>
    </section>
  );
};

export default TermsConditions;