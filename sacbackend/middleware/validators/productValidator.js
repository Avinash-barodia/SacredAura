const { body } = require("express-validator");
const validate = require("../validate");

const createProductValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("price")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("category")
    .notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Valid category ID is required"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
  validate
];

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("category")
    .optional()
    .isMongoId().withMessage("Valid category ID is required"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
  validate
];

module.exports = {
  createProductValidator,
  updateProductValidator
};
