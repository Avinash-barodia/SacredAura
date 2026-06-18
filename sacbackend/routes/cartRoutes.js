const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addToCartValidator, removeFromCartValidator } = require("../middleware/validators/cartValidator");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");

router.post("/add", protect, addToCartValidator, addToCart);
router.get("/", protect, getCart);
router.post("/remove", protect, removeFromCartValidator, removeFromCart);

module.exports = router;
