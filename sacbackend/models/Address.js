const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    country: String,
    firstName: String,
    lastName: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    pinCode: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
