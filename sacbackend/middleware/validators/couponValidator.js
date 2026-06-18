const { body } = require("express-validator");
const validate = require("../validate");

const applyCouponValidator = [
  body("code")
    .notEmpty().withMessage("Coupon code is required")
    .trim()
    .escape()
    .toUpperCase()
    .isLength({ min: 3, max: 20 }).withMessage("Coupon code must be between 3 and 20 characters"),
  validate
];

module.exports = {
  applyCouponValidator
};
