const express = require("express");
const multer = require("multer");
const path = require("path");
const apicache = require("apicache");
const cache = apicache.middleware;
const Product = require("../models/Product");

const {
  createProduct,
  getProducts,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  updateFeaturedProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { createProductValidator, updateProductValidator } = require("../middleware/validators/productValidator");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  protect,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProductValidator,
  createProduct
);

router.get("/", cache("5 minutes"), getProducts);
router.get("/admin", protect, isAdmin, getAdminProducts);

router.get("/home/:subcategoryId", cache("5 minutes"), async (req, res) => {
  try {
    let products = await Product.find({
      category: req.params.subcategoryId,
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(4);

    if (products.length === 0) {
      products = await Product.find({
        category: req.params.subcategoryId,
      })
        .sort({ createdAt: -1 }) // latest first
        .limit(4); // only 4 products
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/home/featured", protect, isAdmin, updateFeaturedProducts);

router.get("/:id", cache("5 minutes"), getProductById);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProductValidator,
  updateProduct
);


router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
