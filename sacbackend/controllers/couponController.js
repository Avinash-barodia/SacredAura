const Coupon = require("../models/Coupon");

exports.applyCoupon = async (req, res) => {
  const { code, totalAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isActive)
    return res.status(400).json({ message: "Invalid Coupon" });

  if (coupon.expiryDate < new Date())
    return res.status(400).json({ message: "Coupon Expired" });

  if (totalAmount < coupon.minAmount)
    return res.status(400).json({ message: "Minimum amount not met" });

  let discount = 0;

  if (coupon.discountType === "PERCENT") {
    discount = (totalAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    discount,
    finalAmount: totalAmount - discount,
  });
};
