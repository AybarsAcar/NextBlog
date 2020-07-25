const express = require("express");
const router = express.Router();

//importing the controllers
const {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  getPhoto,
  listRelated,
  listSearch,
  listByUser,
} = require("../controllers/blog");

//user middlewares
const {
  requireSignin,
  adminMiddleware,
  authMiddleware,
  canUpdateDeleteBlog,
} = require("../controllers/auth");

//FOR ADMIN ONLY -----------------------------------------------------
//create a new blog end point
router.post("/blog", requireSignin, adminMiddleware, create);

//list all the blogs
router.get("/blogs", list);

//return all
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);

//return a single blog
router.get("/blog/:slug", read);

//delete a blog
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);

//update a blog
router.put("/blog/:slug", requireSignin, adminMiddleware, update);

//getting the photo
router.get("/blog/photo/:slug", getPhoto);

//grab related blogs by category
router.post("/blogs/related", listRelated);

//search end point
router.get("/blogs/search", listSearch);

//FOR USER ONLY -------------------------------------------------------
//create a new blog end point for user
router.post("/user/blog", requireSignin, authMiddleware, create);

//delete a blog
router.delete(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  remove
);

//update a blog
router.put(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  update
);

//grab blogs by the user
router.get("/:username/blogs", listByUser);

module.exports = router;
