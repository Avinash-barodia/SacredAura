const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { applyCouponValidator } = require("../middleware/validators/couponValidator");
const { applyCoupon } = require("../controllers/couponController");

router.post("/apply", protect, applyCouponValidator, applyCoupon);

module.exports = router;
