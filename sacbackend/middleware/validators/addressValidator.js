const { body } = require("express-validator");
const validate = require("../validate");

const createAddressValidator = [
  body("fullName")
    .optional()
    .notEmpty().withMessage("Full name is required")
    .trim()
    .escape(),
  body("firstName")
    .optional()
    .notEmpty().withMessage("First name is required")
    .trim()
    .escape(),
  body("phone")
    .isMobilePhone('en-IN').withMessage("Valid Indian mobile phone number is required"),
  body("address")
    .optional()
    .notEmpty().withMessage("Address line is required")
    .trim()
    .escape(),
  body("addressLine")
    .optional()
    .notEmpty().withMessage("Address line is required")
    .trim()
    .escape(),
  body("city")
    .notEmpty().withMessage("City is required")
    .trim()
    .escape(),
  body("state")
    .notEmpty().withMessage("State is required")
    .trim()
    .escape(),
  body("pinCode")
    .optional()
    .isPostalCode('IN').withMessage("Valid Indian pincode is required"),
  body("pincode")
    .optional()
    .isPostalCode('IN').withMessage("Valid Indian pincode is required"),
  validate
];

module.exports = {
  createAddressValidator
};
