const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user", 
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${rawToken}`;
    
    const message = `Verify your account: \n\n ${verificationUrl}`;
    const htmlMessage = `
      <h1>Verify your SacredAura account</h1>
      <p>Thank you for registering! Please verify your email by clicking the link below:</p>
      <br />
      <a href="${verificationUrl}" style="padding: 10px 20px; background: #0077FF; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <br /><br />
      <p>Or copy and paste this link: ${verificationUrl}</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your SacredAura account",
        message,
        html: htmlMessage
      });

      res.status(201).json({ message: "Verification email sent. Please check your inbox." });
    } catch (err) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: "Error sending verification email. Please try again." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGOUT ================= */
exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: "Logged out successfully" });
};

/* ================= VERIFY EMAIL ================= */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESEND VERIFICATION ================= */
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    
    if (!user || user.isVerified) {
      return res.status(400).json({ message: "Invalid request or user already verified" });
    }

    // Rate limit check: 2 minutes
    if (user.emailVerificationExpires) {
      const timeSinceLastEmail = Date.now() - (user.emailVerificationExpires - 24 * 60 * 60 * 1000);
      if (timeSinceLastEmail < 2 * 60 * 1000) {
        return res.status(429).json({ message: "Please wait before requesting another email" });
      }
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${rawToken}`;
    
    const message = `Verify your account: \n\n ${verificationUrl}`;
    const htmlMessage = `
      <h1>Verify your SacredAura account</h1>
      <p>Please verify your email by clicking the link below:</p>
      <br />
      <a href="${verificationUrl}" style="padding: 10px 20px; background: #0077FF; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <br /><br />
      <p>Or copy and paste this link: ${verificationUrl}</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Verify your SacredAura account",
      message,
      html: htmlMessage
    });

    res.status(200).json({ message: "Verification email resent. Please check your inbox." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "There is no user with that email address." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message
      });

      res.status(200).json({ message: "Token sent to email!" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "There was an error sending the email. Try again later!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const resetTokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully! Please login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GOOGLE LOGIN ================= */
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Received Google Token:", token ? "YES" : "NO");
    if (!token) return res.status(400).json({ message: "No Google token provided" });

    const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Google API Status:", googleResponse.status);
    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.log("Google API Error:", errorText);
      return res.status(400).json({ message: "Invalid or expired Google token" });
    }

    const payload = await googleResponse.json();
    console.log("Google User Payload:", payload.email);
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with a random secure password
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        name,
        email,
        mobile: "0000000000", // Default mobile for Google accounts
        password: hashedPassword,
        role: "user",
        isVerified: true, // Google accounts are auto-verified
      });
      console.log("Created new Google user:", email);
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google Login Catch Error:", err);
    res.status(500).json({ message: err.message });
  }
};
