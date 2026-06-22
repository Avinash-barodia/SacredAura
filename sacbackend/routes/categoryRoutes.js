const express = require("express");
const apicache = require("apicache");
const cache = apicache.middleware;
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
  createCategory,
  getCategories,deleteCategory
} = require("../controllers/categoryController");

router.post("/", protect, isAdmin, createCategory);
router.get("/", cache("30 minutes"), getCategories);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
