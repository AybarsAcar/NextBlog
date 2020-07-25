//Tag related validations
//imports
const { check } = require("express-validator");

//signup validator
exports.tagCreateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];