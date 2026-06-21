const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const sendEmail = require("../utils/email");
const { calculateOrderTotal } = require("../utils/calculateOrderTotal");
const OrderLog = require("../models/OrderLog");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mocked",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_mocked",
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const { totalAmount } = calculateOrderTotal(order.items);
    
    const options = {
      amount: totalAmount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${order._id}`,
    };

    const rzpOrder = await razorpay.orders.create(options);
    res.json(rzpOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mongo_order_id
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "rzp_secret_mocked")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is authentic
      const order = await Order.findById(mongo_order_id).populate("user");
      if (order) {
        order.paymentStatus = "Paid";
        order.paymentId = razorpay_payment_id;
        await order.save();

        // Send email
        try {
          const { orderConfirmationEmail } = require("../utils/emailTemplates");
          if (order.user && order.user.email) {
            const emailContent = orderConfirmationEmail(order, order.user);
            await sendEmail({
              email: order.user.email,
              subject: emailContent.subject,
              message: emailContent.text,
              html: emailContent.html
            });
          }
        } catch (emailErr) {
          console.error("Failed to send Payment email", emailErr);
        }

        // Log the successful payment
        try {
          await OrderLog.findOneAndUpdate(
            { mongoOrderId: order._id },
            { 
              action: "SUCCESS",
              paymentStatus: "Paid",
              razorpayOrderId: razorpay_order_id 
            }
          );
        } catch (logErr) {
          console.error("Failed to log payment success:", logErr);
        }
      }
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      // Log failed payment signature
      try {
        await OrderLog.findOneAndUpdate(
          { mongoOrderId: mongo_order_id },
          { 
            action: "FAILED",
            paymentStatus: "Failed",
            errorReason: "Invalid Razorpay signature",
            razorpayOrderId: razorpay_order_id 
          }
        );
      } catch (logErr) {
        console.error("Failed to log payment failure:", logErr);
      }
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
