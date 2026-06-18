const mongoose = require("mongoose");

const showcaseItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
});

const siteSettingsSchema = new mongoose.Schema({
  heroVideo: { type: String, default: "" },
  promoVideo1: { type: String, default: "" },
  promoVideo2: { type: String, default: "" },
  showcaseItems: [showcaseItemSchema]
});

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
