import React from "react";
import {
  FaUndo,
  FaClock,
  FaBoxOpen,
  FaTimesCircle,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaBan,
  FaTruck,
  FaExclamationTriangle,
  FaPhoneAlt
} from "react-icons/fa";

const RefundPolicy = () => {

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
          <h1 style={{ color: "#006895" }}>Refund & Return Policy</h1>

          <p style={text}>
            Thank you for shopping with <strong>SACREDAURA TECHNOLOGY LLP</strong>.
            We strive to provide high-quality hygiene automation and smart
            automation products. This policy outlines conditions for returns,
            replacements, cancellations and refunds.
          </p>
        </div>

        {/* 1 */}
        <Block icon={<FaUndo />} titleText="Eligibility for Return or Replacement">
          <ul style={list}>
            <li>Product damaged during transit</li>
            <li>Manufacturing defect</li>
            <li>Incorrect product delivered</li>
          </ul>
          <p>All requests are subject to verification and approval.</p>
        </Block>

        {/* 2 */}
        <Block icon={<FaClock />} titleText="Return Request Timeframe">
          <p>Requests must be reported within 48 hours of delivery.</p>
          <ul style={list}>
            <li>Order details</li>
            <li>Invoice copy</li>
            <li>Product images or video proof</li>
          </ul>
        </Block>

        {/* 3 */}
        <Block icon={<FaBoxOpen />} titleText="Return Conditions">
          <ul style={list}>
            <li>Product must be unused</li>
            <li>Original packaging & accessories required</li>
            <li>Invoice must be available</li>
            <li>Product must not be installed or tampered</li>
          </ul>
        </Block>

        {/* 4 */}
        <Block icon={<FaTimesCircle />} titleText="Non-Returnable Items">
          <ul style={list}>
            <li>Products damaged after delivery</li>
            <li>Used or installed products</li>
            <li>Improper installation damage</li>
            <li>Electrical fluctuation or misuse</li>
            <li>Normal wear and tear</li>
            <li>Discount or clearance sale products</li>
          </ul>
        </Block>

        {/* 5 */}
        <Block icon={<FaMoneyBillWave />} titleText="Refund Process">
          <ul style={list}>
            <li>Refund approval communicated to customer</li>
            <li>Processed within 7–10 business days</li>
            <li>Refund credited to original payment method</li>
          </ul>
        </Block>

        {/* 6 */}
        <Block icon={<FaExchangeAlt />} titleText="Replacement Process">
          <ul style={list}>
            <li>Replacement shipped subject to stock availability</li>
            <li>Delivery timelines may vary by location</li>
          </ul>
        </Block>

        {/* 7 */}
        <Block icon={<FaBan />} titleText="Order Cancellation Policy">
          <ul style={list}>
            <li>Orders cancellable before dispatch only</li>
            <li>No cancellation after shipment</li>
            <li>Refund processed within 5–7 business days</li>
          </ul>
        </Block>

        {/* 8 */}
        <Block icon={<FaTruck />} titleText="Return Shipping Charges">
          <ul style={list}>
            <li>Company bears cost for defective delivery</li>
            <li>Shipping may be deducted in exceptional cases</li>
          </ul>
        </Block>

        {/* 9 */}
        <Block icon={<FaExclamationTriangle />} titleText="Important Product Notice">
          <ul style={list}>
            <li>Incorrect installation</li>
            <li>Unauthorized modification</li>
            <li>Improper electrical or plumbing connection</li>
          </ul>
          <p>Damage caused by above conditions is not eligible for refund.</p>
        </Block>

        {/* CONTACT */}
        <Block icon={<FaPhoneAlt />} titleText="Contact for Returns & Refunds">
          <strong>SACREDAURA TECHNOLOGY LLP</strong><br/>
          🌐 www.sacredaura.com
        </Block>

      </div>
    </section>
  );
};

export default RefundPolicy;