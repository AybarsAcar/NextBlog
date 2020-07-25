const express = require("express");
const router = express.Router();

//importing the controllers
const {authMiddleware, adminMiddleware, requireSignin} = require("../controllers/auth");
const {read, republicProfile, update, photo} = require("../controllers/user");


//make sure the user is required
router.get("/user/profile", requireSignin, authMiddleware, read);

//public profile
router.get("/user/:username", republicProfile);

//update user profile
router.put("/user/update", requireSignin, authMiddleware, update)

//get the user profile photo
router.get("/user/photo/:username", photo);


module.exports = router;