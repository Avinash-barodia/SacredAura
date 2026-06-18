const { body } = require("express-validator");
const validate = require("../validate");

const addToCartValidator = [
  body("productId")
    .isMongoId().withMessage("Valid product ID is required"),
  body("quantity")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  validate
];

const removeFromCartValidator = [
  body("productId")
    .isMongoId().withMessage("Valid product ID is required"),
  validate
];

module.exports = {
  addToCartValidator,
  removeFromCartValidator
};
