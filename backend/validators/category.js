//Category related validations
//imports
const { check } = require("express-validator");

//signup validator
exports.categoryCreateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];