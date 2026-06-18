const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { updateProfileValidator, changePasswordValidator } = require("../middleware/validators/userValidator");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidator, updateProfile);
router.put("/change-password", protect, changePasswordValidator, changePassword);

module.exports = router;