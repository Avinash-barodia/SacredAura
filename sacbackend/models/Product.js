const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, default: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: "Good product 👍" },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    modelNumber: String,

    // 💰 PRICE SYSTEM
    price: { type: Number, required: true }, // selling price
    originalPrice: { type: Number }, // compare price
    discount: { type: Number, default: 0 }, // %

    // 📦 STOCK
    stock: { type: Number, default: 0 },

    // ⭐ REVIEWS
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],

    // 📊 PRODUCT DETAILS
    weight: String,
    height: String,
    capacity: String,
    warranty: String,

    highlights: [String],
    description: String,
    keyIngredients: String,
    howToUse: String,
    caution: String,

    // 🖼 IMAGES
    mainImage: String,
    images: [String],

    // 📂 CATEGORY
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    // 🌟 FEATURED ON HOME PAGE
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  description: "text",
  highlights: "text",
  modelNumber: "text",
  keyIngredients: "text"
});

module.exports = mongoose.model("Product", productSchema);