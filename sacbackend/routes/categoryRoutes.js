const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
  createCategory,
  getCategories,deleteCategory
} = require("../controllers/categoryController");

router.post("/", protect, isAdmin, createCategory);
router.get("/", getCategories);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
