const { body } = require("express-validator");
const validate = require("../validate");

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  validate
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters long")
    .matches(/\d/).withMessage("New password must contain at least 1 number"),
  validate
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator
};
