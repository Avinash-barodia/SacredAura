import React from "react";

const OrderTracking = ({ order }) => {
  const steps = [
    {
      key: "Confirmed",
      title: "Order Confirmed",
      date: order.statusDates?.confirmedAt || order.createdAt,
    },
    {
      key: "Shipped",
      title: "Shipped",
      date: order.statusDates?.shippedAt,
    },
    {
      key: "Out for Delivery",
      title: "Out for Delivery",
      date: order.statusDates?.outForDeliveryAt,
    },
    {
      key: "Delivered",
      title: "Delivered",
      date: order.statusDates?.deliveredAt,
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.key === order.orderStatus
  );

  return (
    <div style={{ marginTop: "30px" }}>
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
              marginBottom: "30px",
            }}
          >
            {/* LEFT SIDE (CIRCLE + LINE) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "15px",
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: isActive ? "#28a745" : "#ccc",
                  zIndex: 1,
                }}
              />

              {/* Vertical Line */}
              {!isLast && (
                <div
                  style={{
                    width: "2px",
                    height: "50px",
                    background:
                      index < currentIndex ? "#28a745" : "#ccc",
                  }}
                />
              )}
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: isActive ? "#000" : "#999",
                }}
              >
                {step.title}
              </div>

              {step.date && (
                <div style={{ fontSize: "13px", color: "#666" }}>
                  {new Date(step.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracking;
