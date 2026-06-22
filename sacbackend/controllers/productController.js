const Product = require("../models/Product");
const apicache = require("apicache");
const cloudinary = require("../config/cloudinary");
const Category = require("../models/Category");

const randomNames = ["Rohit", "Amit", "Sneha", "Priya", "Rahul", "Neha"];

const comments = [
  "Excellent product 🔥",
  "Worth buying 👍",
  "Quality is good",
  "Very useful",
  "Highly recommended ⭐",
];

// 🔥 AUTO REVIEW GENERATOR
const generateReviews = () => {
  const reviewCount = Math.floor(Math.random() * 50) + 5;

  return Array.from({ length: reviewCount }).map(() => ({
    name: randomNames[Math.floor(Math.random() * randomNames.length)],
    rating: Math.floor(Math.random() * 3) + 3,
    comment: comments[Math.floor(Math.random() * comments.length)],
  }));
};

// ================= CREATE =================
exports.createProduct = async (req, res) => {
  try {
    let mainImageUrl = "";
    let extraImages = [];

    if (req.files?.mainImage) {
      const upload = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: "products" }
      );
      mainImageUrl = upload.secure_url;
    }

    if (req.files?.images) {
      for (let file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        extraImages.push(upload.secure_url);
      }
    }

    const price = Number(req.body.price);

    let discount = req.body.discount
      ? Number(req.body.discount)
      : 0;

    let originalPrice;

    if (discount > 0) {
      originalPrice = Math.round(
        price / (1 - discount / 100)
      );
    } else {
      originalPrice = price;
    }

    // 🔥 REVIEWS AUTO
    const reviews = generateReviews();
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    const product = await Product.create({
      ...req.body,
      price,
      originalPrice,
      discount,
      stock: req.body.stock ? Number(req.body.stock) : 0,

      highlights: req.body.highlights
        ? req.body.highlights.split(",").map((h) => h.trim())
        : [],

      mainImage: mainImageUrl,
      images: extraImages,

      reviews,
      rating: Number(avgRating.toFixed(1)),
    });

    apicache.clear();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET =================
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      let categoryId = category;
      
      // If category is a name instead of an ObjectId, try to find the actual category
      const mongoose = require("mongoose");
      if (!mongoose.Types.ObjectId.isValid(category)) {
        // Use loose regex (without ^ and $) so "Water Taps" matches "Autoamtic Water Taps"
        const catByName = await Category.findOne({ name: { $regex: category, $options: "i" } });
        if (catByName) {
          categoryId = catByName._id.toString();
        } else {
          // Prevent CastError if category string doesn't match anything
          categoryId = new mongoose.Types.ObjectId().toString();
        }
      }

      const subCategories = await Category.find({ parent: categoryId });

      const categoryIds = [
        categoryId,
        ...subCategories.map((sub) => sub._id),
      ];

      filter.category = { $in: categoryIds };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { modelNumber: { $regex: search, $options: "i" } },
        { highlights: { $regex: search, $options: "i" } },
        { keyIngredients: { $regex: search, $options: "i" } }
      ];
    }

    const MAX_LIMIT = 1000;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const totalCount = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalProducts: totalCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN GET PRODUCTS (PAGINATION) =================
exports.getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // 🔥 MAIN IMAGE
    if (req.files?.mainImage) {
      const upload = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: "products" }
      );
      updateData.mainImage = upload.secure_url;
    }

    // 🔥 EXTRA IMAGES
    if (req.files?.images) {
      let extraImages = [];

      for (let file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        extraImages.push(upload.secure_url);
      }

      updateData.images = extraImages;
    }

    // 🔥 HIGHLIGHTS
    if (updateData.highlights) {
      updateData.highlights = updateData.highlights
        .split(",")
        .map((h) => h.trim());
    }

    // 🔥 ⭐ ADD THIS (IMPORTANT)
    if (!updateData.reviews || updateData.reviews.length === 0) {
      const reviews = generateReviews();

      const avgRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

      updateData.reviews = reviews;
      updateData.rating = Number(avgRating.toFixed(1));
    }

    // 🔥 PRICE FIX
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    let discount = updateData.discount
      ? Number(updateData.discount)
      : 0;

    updateData.discount = discount;

    if (discount > 0) {
      updateData.originalPrice = Math.round(
        updateData.price / (1 - discount / 100)
      );
    } else {
      updateData.originalPrice = updateData.price;
    }

    // 🔥 STOCK FIX
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    apicache.clear();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    apicache.clear();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE FEATURED PRODUCTS =================
exports.updateFeaturedProducts = async (req, res) => {
  try {
    const { categoryId, productIds } = req.body;

    // 1. Reset all products in this category to NOT featured
    await Product.updateMany(
      { category: categoryId },
      { $set: { isFeatured: false } }
    );

    // 2. Set the selected products to featured
    if (productIds && productIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { isFeatured: true } }
      );
    }

    apicache.clear();
    res.json({ message: "Featured products updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};