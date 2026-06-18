const express = require("express");
const multer = require("multer");
const { getSettings, updateSettings } = require("../controllers/settingsController");

const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getSettings);
router.put(
  "/",
  protect,
  isAdmin,
  upload.fields([
    { name: "heroVideo", maxCount: 1 },
    { name: "promoVideo1", maxCount: 1 },
    { name: "promoVideo2", maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
