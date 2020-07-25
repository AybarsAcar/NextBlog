const express = require("express");
const router = express.Router();

//importing the controllers
const {
  signup,
  signin,
  signout,
  requireSignin,
  forgotPassword,
  resetPassword,
  preSignup,
  googleLogin,
  facebookLogin,
} = require("../controllers/auth");

//validators & validations
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

//authentication routes
router.post("/pre-signup", userSignupValidator, runValidation, preSignup);
router.post("/signup", signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

//test
router.get("/secret", requireSignin, (req, res) => {
  res.json({
    user: req.user,
  });
});

//forgot password
router.put("/forgot-password", forgotPasswordValidator, runValidation, forgotPassword);

//reset password
router.put("/reset-password", resetPasswordValidator, runValidation, resetPassword);

//social logins
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);


module.exports = router;

