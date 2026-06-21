const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Address = require("../models/Address");
const { calculateOrderTotal } = require("../utils/calculateOrderTotal");

const generateOrderId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${Date.now()}-${random}`;
};

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, addressId, paymentMethod } = req.body;

    // 1. Validate Address
    const address = await Address.findOne({ _id: addressId, user: req.user.id });
    if (!address) {
      throw new Error("Invalid shipping address");
    }

    const validatedItems = [];

    // 2. Check stock and calculate price
    for (let item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });

      // Decrement stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    const { subtotal, gstRate, gstAmount, totalAmount } = calculateOrderTotal(validatedItems);

    // 3. Create the order
    const orderArr = await Order.create([{
      orderId: generateOrderId(),
      user: req.user.id,
      items: validatedItems,
      subtotal,
      gstRate,
      gstAmount,
      totalAmount,
      shippingAddress: addressId,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Send COD email
    if (paymentMethod === "COD") {
      try {
        const User = require("../models/User");
        const sendEmail = require("../utils/email");
        const { orderConfirmationEmail } = require("../utils/emailTemplates");
        
        const user = await User.findById(req.user.id);
        const populatedOrder = await Order.findById(orderArr[0]._id)
          .populate("items.product")
          .populate("shippingAddress");
          
        if (user && user.email && populatedOrder) {
          const emailContent = orderConfirmationEmail(populatedOrder, user);
          await sendEmail({
            email: user.email,
            subject: emailContent.subject,
            message: emailContent.text,
            html: emailContent.html
          });
        }
      } catch (emailErr) {
        console.error("Failed to send COD email", emailErr);
      }
    }

    res.json(orderArr[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// ================= USER ORDERS =================
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product")
    .populate("shippingAddress")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// ================= GET SINGLE ORDER BY ID =================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN ALL ORDERS =================
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Order.countDocuments();

    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE ORDER STATUS (ADMIN) =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body; // ✅ SAME NAME AS FRONTEND

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;

    // Status dates tracking
    if (orderStatus === "Confirmed") {
      order.statusDates.confirmedAt = new Date();
    }

    if (orderStatus === "Shipped") {
      order.statusDates.shippedAt = new Date();
    }

    if (orderStatus === "Out for Delivery") {
      order.statusDates.outForDeliveryAt = new Date();
    }

    if (orderStatus === "Delivered") {
      order.statusDates.deliveredAt = new Date();
      order.paymentStatus = "Paid";
    }

    if (orderStatus === "Cancelled") {
      order.statusDates.cancelledAt = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user")
      .populate("items.product")
      .populate("shippingAddress");

    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};