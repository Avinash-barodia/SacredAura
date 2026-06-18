const express = require("express");
const router = express.Router();
const { saveAddress, getUserAddress } = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");
const { createAddressValidator } = require("../middleware/validators/addressValidator");

router.post("/", protect, createAddressValidator, saveAddress);
router.get("/", protect, getUserAddress);

module.exports = router;
