//Category related validations
//imports
const { check } = require("express-validator");

//signup validator
exports.contactFormValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Email address must be valid"),
  check("message")
    .not()
    .isEmpty()
    .isLength({ min: 20 })
    .withMessage("Message needs to be at least 20 character long"),
];
