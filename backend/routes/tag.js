const express = require("express");
const router = express.Router();

//importing the controllers
const {create, list, read, remove} = require("../controllers/tag");
//validators & validations
const { runValidation } = require("../validators");
const { tagCreateValidator } = require("../validators/tag");
const {
  authMiddleware,
  adminMiddleware,
  requireSignin,
} = require("../controllers/auth");

//creating a category
router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

//get all the categories
router.get("/tags", list);

//get one category
router.get("/tag/:slug", read);

//delere one category
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
