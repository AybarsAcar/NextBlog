const express = require("express");
const router = express.Router();

//importing the controllers
const {contactForm, contactBlogAuthorForm} = require("../controllers/form");
//validators & validations
const { runValidation } = require("../validators");
const { contactFormValidator } = require("../validators/form");

//contact
router.post(
  "/contact",
  contactFormValidator,
  runValidation,
  contactForm
);

//contact the blog author
router.post(
  "/contact-blog-author",
  contactFormValidator,
  runValidation,
  contactBlogAuthorForm
);

module.exports = router;
