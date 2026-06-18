const { body } = require("express-validator");
const validate = require("../validate");

const signupValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/\d/).withMessage("Password must contain at least 1 number"),
  validate
];

const loginValidator = [
  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
  validate
];

const forgotPasswordValidator = [
  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  validate
];

const resetPasswordValidator = [
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  validate
];

module.exports = {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
};
