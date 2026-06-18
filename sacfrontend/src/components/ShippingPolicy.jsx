import React from "react";
import {
  FaBox,
  FaTruck,
  FaClock,
  FaShippingFast,
  FaMapMarkedAlt,
  FaSearchLocation,
  FaExclamationTriangle,
  FaBan,
  FaGlobeAsia,
  FaPhoneAlt
} from "react-icons/fa";

const ShippingPolicy = () => {

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
          <h1 style={{ color: "#006895" }}>Shipping & Delivery Policy</h1>

          <p style={text}>
            This Shipping & Delivery Policy outlines the terms related
            to order processing, shipment, and delivery of products
            purchased from <strong>SACREDAURA TECHNOLOGY LLP</strong>.
          </p>
        </div>

        {/* 1 */}
        <Block icon={<FaBox />} titleText="Order Processing">
          <ul style={list}>
            <li>Orders processed after successful payment confirmation.</li>
            <li>Processing time: 1–3 business days.</li>
            <li>Weekend or holiday orders processed next working day.</li>
          </ul>
          <p>
            Processing may be delayed due to product availability or
            verification requirements.
          </p>
        </Block>

        {/* 2 */}
        <Block icon={<FaMapMarkedAlt />} titleText="Shipping Coverage">
          We deliver products across India through trusted courier
          and logistics partners. Delivery availability depends on
          serviceable locations.
        </Block>

        {/* 3 */}
        <Block icon={<FaClock />} titleText="Estimated Delivery Time">
          <p>Estimated delivery timeline:</p>

          <ul style={list}>
            <li>5–10 business days from dispatch</li>
            <li>Customer location</li>
            <li>Product availability</li>
            <li>Courier operations</li>
            <li>Remote service areas</li>
          </ul>

          <p>Delivery timelines are estimates and not guaranteed.</p>
        </Block>

        {/* 4 */}
        <Block icon={<FaShippingFast />} titleText="Shipping Charges">
          <ul style={list}>
            <li>Shipping charges displayed during checkout.</li>
            <li>Free shipping offers shown on product page if applicable.</li>
          </ul>
        </Block>

        {/* 5 */}
        <Block icon={<FaSearchLocation />} titleText="Order Shipment & Tracking">
          <ul style={list}>
            <li>Shipment confirmation via Email or SMS.</li>
            <li>Tracking details shared after dispatch.</li>
            <li>Customers can monitor delivery status.</li>
          </ul>
        </Block>

        {/* 6 */}
        <Block icon={<FaTruck />} titleText="Delivery Attempts">
          <ul style={list}>
            <li>Multiple delivery attempts may be made.</li>
            <li>Incorrect address or unavailability may cause return.</li>
            <li>Re-shipping charges may apply.</li>
          </ul>
        </Block>

        {/* 7 */}
        <Block icon={<FaBan />} titleText="Incorrect or Incomplete Address">
          Customers must provide accurate shipping information.
          Delivery failures due to incorrect details are not the
          responsibility of SACREDAURA TECHNOLOGY LLP.
        </Block>

        {/* 8 */}
        <Block icon={<FaExclamationTriangle />} titleText="Delivery Delays">
          <ul style={list}>
            <li>Natural calamities</li>
            <li>Weather conditions</li>
            <li>Transport disruptions</li>
            <li>Government restrictions</li>
            <li>Logistics partner delays</li>
          </ul>
          <p>
            Such delays shall not make the company liable for compensation.
          </p>
        </Block>

        {/* 9 */}
        <Block icon={<FaBox />} titleText="Damaged Package During Delivery">
          <ul style={list}>
            <li>Inspect package during delivery.</li>
            <li>Refuse delivery if visibly damaged.</li>
            <li>Record unboxing video and report within 48 hours.</li>
          </ul>
        </Block>

        {/* 10 */}
        <Block icon={<FaGlobeAsia />} titleText="International Shipping">
          Currently, shipping is available within India only unless
          otherwise specified.
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

export default ShippingPolicy;