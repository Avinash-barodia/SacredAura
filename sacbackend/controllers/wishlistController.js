const Wishlist = require("../models/Wishlist");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.create({
      user: req.user.id,
      product: req.body.productId,
    });

    res.json(wishlist);
  } catch (err) {
    res.status(400).json({ message: "Already in wishlist" });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  const items = await Wishlist.find({ user: req.user.id })
    .populate("product");

  res.json(items);
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  await Wishlist.findOneAndDelete({
    user: req.user.id,
    product: req.params.productId,
  });

  res.json({ message: "Removed" });
};
