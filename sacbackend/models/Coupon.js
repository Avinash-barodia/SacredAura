const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT"],
      required: true,
    },
    discountValue: Number,
    minAmount: Number,
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
