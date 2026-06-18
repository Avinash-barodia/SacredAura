const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { signup, login, logout, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail, googleLogin } = require("../controllers/authController");
const { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require("../middleware/validators/authValidator");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many requests, please try again later" },
});

router.post("/signup", authLimiter, signupValidator, signup);
router.post("/login", authLimiter, loginValidator, login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationEmail);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPasswordValidator, resetPassword);
router.post("/google", authLimiter, googleLogin);

module.exports = router;
