import React, { useState, useEffect } from "react";

const faqs = [
  {
    q: "What products does SACREDAURA offer?",
    a: "We offer a complete range of hygiene and automation products including hand dryers, automatic taps, urinal flush systems, soap dispensers, aroma diffusers, and more.",
  },
  {
    q: "Are your products suitable for commercial use?",
    a: "Yes, all our products are designed for heavy-duty commercial use such as offices, malls, hotels, and restaurants.",
  },
  {
    q: "Do you provide installation service?",
    a: "Yes, we provide professional installation support through our expert team to ensure proper setup.",
  },
  {
    q: "Is warranty available on products?",
    a: "Yes, all our products come with warranty and we also provide reliable after-sales support.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery usually takes 3–7 working days depending on your location.",
  },
  {
    q: "Do you provide spare parts?",
    a: "Yes, we ensure availability of genuine spare parts for all our products.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "Yes, we have a return and exchange policy. You can request within the allowed time period.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can contact us via phone, email, or our contact page. Our team is always ready to help.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [screen, setScreen] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: screen < 600 ? "0 12px" : "0 20px", 
      }}
    >
      <h2
        style={{
          fontSize: screen < 500 ? 20 : 28, 
          fontWeight: 700,
          marginBottom: 20,
          textAlign: "center",
          color: "#1e6fb8",
        }}
      >
        Frequently Asked Questions
      </h2>

      {faqs.map((item, i) => (
        <div
          key={i}
          style={{
            borderBottom: "1px solid #ddd",
            padding: screen < 500 ? "12px 0" : "15px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: screen < 500 ? 14 : 16, 
              gap: 10,
            }}
            onClick={() =>
              setOpenIndex(openIndex === i ? null : i)
            }
          >
            <span>{item.q}</span>
            <span>{openIndex === i ? "−" : "+"}</span>
          </div>

          {openIndex === i && (
            <div
              style={{
                marginTop: 10,
                color: "#555",
                lineHeight: 1.6,
                fontSize: screen < 500 ? 13 : 14,
              }}
            >
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}



