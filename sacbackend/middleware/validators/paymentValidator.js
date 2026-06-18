const { body } = require("express-validator");
const validate = require("../validate");

const createPaymentOrderValidator = [
  body("amount")
    .isFloat({ min: 1 }).withMessage("Amount must be at least 1"),
  body("currency")
    .optional()
    .isIn(['INR']).withMessage("Currency must be INR"),
  validate
];

const verifyPaymentValidator = [
  body("razorpay_order_id")
    .notEmpty().withMessage("Razorpay order ID is required")
    .trim()
    .escape(),
  body("razorpay_payment_id")
    .notEmpty().withMessage("Razorpay payment ID is required")
    .trim()
    .escape(),
  body("razorpay_signature")
    .notEmpty().withMessage("Razorpay signature is required")
    .trim()
    .escape(),
  validate
];

module.exports = {
  createPaymentOrderValidator,
  verifyPaymentValidator
};
