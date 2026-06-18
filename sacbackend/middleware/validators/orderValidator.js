const { body } = require("express-validator");
const validate = require("../validate");

const createOrderValidator = [
  body("items")
    .isArray({ min: 1 }).withMessage("Items array is required and cannot be empty"),
  body("items.*.product")
    .isMongoId().withMessage("Valid product ID is required for each item"),
  body("items.*.quantity")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("addressId")
    .isMongoId().withMessage("Valid address ID is required"),
  body("paymentMethod")
    .isIn(['razorpay', 'cod', 'COD', 'Razorpay']).withMessage("Invalid payment method"),
  validate
];

module.exports = {
  createOrderValidator
};
