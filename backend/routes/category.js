const express = require("express");
const router = express.Router();

//importing the controllers
const {create, list, read, remove} = require("../controllers/category");
//validators & validations
const { runValidation } = require("../validators");
const { categoryCreateValidator } = require("../validators/category");
const {
  authMiddleware,
  adminMiddleware,
  requireSignin,
} = require("../controllers/auth");

//creating a category
router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

//get all the categories
router.get("/categories", list);

//get one category
router.get("/category/:slug", read);

//delere one category
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
