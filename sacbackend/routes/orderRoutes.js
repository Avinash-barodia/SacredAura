const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { createOrderValidator } = require("../middleware/validators/orderValidator");

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controllers/orderController");

router.post("/", protect, createOrderValidator, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/admin", protect, isAdmin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, isAdmin, updateOrderStatus);

module.exports = router;
