const User = require("../models/user");
const Blog = require("../models/blog");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");
//google
const { OAuth2Client } = require("google-auth-library");
//facebook -- manually fetch
const fetch = require("node-fetch");
const { errorHandler } = require("../helpers/dbErrorHandler");
//import the sendgrid and pass the API key
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Pre Sign up for email authentication
exports.preSignup = (req, res) => {
  //user info from the request body
  const { email, name, password } = req.body;

  //check if the email already exists
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }

    //create a token with the information
    const token = jwt.sign(
      { email, name, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    //create and email data with the token
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account Activation Link`,
      html: `
        <h2>Please use the following link to activate your account:</h2>
        <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://seoblog.com</p>
      `,
    };

    sgMail.send(emailData).then((sent) => {
      return res.json({
        message: `Email has successfully been sent to ${email}. Follow the instructions to activate your account`,
      });
    });
  });
};

//Sign Up Method
// exports.signup = (req, res) => {
//   //user info from the request body
//   const { email, name, password } = req.body;

//   //check if the user exists
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is already taken",
//       });
//     }

//     //create a new user
//     let username = shortId.generate();
//     let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//     let newUser = new User({ name, email, password, profile, username });
//     newUser.save((err, success) => {
//       if (err) {
//         return res.status(400).json({
//           error: err,
//         });
//       }

//       res.json({
//         message: "Signup success! Please sign in",
//         // user: success
//       });
//     });
//   });
// };

//Sign Up Method
exports.signup = (req, res) => {
  //get the token from body
  const token = req.body.token;

  if (token) {
    //verify the token
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Link has been expired. Please signup again",
        });
      }

      //get the user info from the token
      const { name, email, password } = jwt.decode(token);

      //create a new user
      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({ name, email, password, profile, username });
      user.save((err, user) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        }

        return res.json({
          message: "You have successfully signed up. Please sign in",
        });
      });
    });
  } else {
    return res.status(401).json({
      error: "Oops.. Something went wrong. Please try again",
    });
  }
};

//Sign In Method
exports.signin = (req, res) => {
  //grab user details from the body
  const { email, password } = req.body;

  //check if the user exists in db
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with the email does not exist. Please sign up",
      });
    }
    //authenticate to match the password
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    //generate the json web token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { expiresIn: "7d" });

    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  });
};

//Sign Out Method
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signed out successfully",
  });
};

//middleware to implement on the protected routes
//apply this to protected routes
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//middleware for authenticated users
exports.authMiddleware = (req, res, next) => {
  //get the user from the user
  const authUserId = req.user._id;

  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    //otherwise return the user and make it available in the profile
    req.profile = user;
    next();
  });
};

//middleware for admins
exports.adminMiddleware = (req, res, next) => {
  //get the user from the user
  const adminUserId = req.user._id;

  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    //make sure the user is admin before the creating the profile
    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }
    //otherwise return the user and make it available in the profile
    req.profile = user;
    next();
  });
};

//check if the user can update
exports.canUpdateDeleteBlog = (req, res, next) => {
  //get the slug
  const slug = req.params.slug.toLowerCase();

  //find the blog based on slug
  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    //check if authorised
    let autherizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();

    if (!autherizedUser) {
      return res.status(400).json({
        error: "You are not authorised",
      });
    }

    next();
  });
};

//forgot password contorller
exports.forgotPassword = (req, res) => {
  //grab the email from the body
  const { email } = req.body;

  //find the user based on the email
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist",
      });
    }

    //otherwise generate a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    //create and email data with the token
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset Link`,
      html: `
        <h2>Please use the following link to reset your password:</h2>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://seoblog.com</p>
      `,
    };

    //populating the db with user resetPasswordLink
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sgMail.send(emailData).then((sent) => {
          return res.json({
            message: `Email has successfully been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes`,
          });
        });
      }
    });
  });
};

//reset password
exports.resetPassword = (req, res) => {
  //get the resetPasswordLink and the newPassword
  const { resetPasswordLink, newPassword } = req.body;

  //find the user based on the resetPasswordLink
  if (resetPasswordLink) {
    //verify if the token has expired
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "The Link has been expired. Please try again ",
        });
      }

      //find the user now if the token still valid
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            error: "Oops.. Something went wrong. Please try again",
          });
        }

        //update the user
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);
        //save the updated user
        user.save((err, result) => {
          if (err || !user) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }

          //success
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};

//google login controller method
//initialising the client first
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  //send the id token from the client side
  const idToken = req.body.tokenId;

  //verify the token
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      //response has the user info
      // console.log(response);
      const { email_verified, name, email, jti } = response.payload;

      if (email_verified) {
        //check if the user already exists in our database
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            // console.log(user);
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            res.cookie("token", token, { expiresIn: "7d" });

            const { _id, email, name, role, username } = user;
            return res.json({
              token,
              user: { _id, email, name, role, username },
            });
          } else {
            //if the user with the google email doesnt exist
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti + process.env.JWT_SECRET;

            user = new User({ name, email, password, profile, username });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              }

              //generate a token and set in the cookie
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              res.cookie("token", token, { expiresIn: "7d" });

              const { _id, email, name, role, username } = data;
              return res.json({
                token,
                user: { _id, email, name, role, username },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Please try again",
        });
      }
    });
};

//facebook login controller
exports.facebookLogin = (req, res) => {
  //get the userID and accessToken from the body
  const { userID, accessToken } = req.body;

  // console.log(req.body);
  

  //request to facebooks url
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  //make request to facebook
  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;

      // console.log(email);
      
      //query the db to check if the user already exists
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          // console.log(user);
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          res.cookie("token", token, { expiresIn: "7d" });

          const { _id, email, name, role, username } = user;
          return res.json({
            token,
            user: { _id, email, name, role, username },
          });
        } else {
          //if the user with the google email doesnt exist
          let username = shortId.generate();
          let profile = `${process.env.CLIENT_URL}/profile/${username}`;
          let password = email + process.env.JWT_SECRET;

          user = new User({ name, email, password, profile, username });
          user.save((err, data) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }

            //generate a token and set in the cookie
            const token = jwt.sign(
              { _id: data._id },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );
            res.cookie("token", token, { expiresIn: "7d" });

            const { _id, email, name, role, username } = data;
            return res.json({
              token,
              user: { _id, email, name, role, username },
            });
          });
        }
      });
    })
    .catch((error) => {
      res.json({
        error: "Facebook Login failed. Please try again",
      });
    });
};
