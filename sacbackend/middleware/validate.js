const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ field: err.path || err.param, message: err.msg }));

    return res.status(400).json({
      errors: extractedErrors,
    });
  }
  next();
};

module.exports = validate;
