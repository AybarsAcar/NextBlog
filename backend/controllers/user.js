const User = require("../models/user");
const Blog = require("../models/blog");

const {errorHandler} = require("../helpers/dbErrorHandler");

const _ = require("lodash");
const fromidable = require("formidable");
const fs = require("fs");

//Read Method to get the user info
exports.read = (req, res) => {
  //we dont want to return the hashed_password
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
}


//Get the public profile of the user
exports.republicProfile = (req, res) => {
  //we need the username
  let username = req.params.username;
  let user;
  let blogs;

  User.findOne({username}).exec((err, userFromDB) => {
    if (err || !userFromDB) {
      return res.status(400).json({
        error: "User not found"
      })
    }

    //if user is found in the database
    user = userFromDB;
    let userId = user._id

    //query blogs based on the user id returned from db
    Blog.find({postedBy: userId})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .limit(10)
      .select("_id title slug excerpt categories tags postedBy createdAt updatedAt")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          })
        }

        user.photo = undefined;
        user.hashed_password = undefined;
        user.salt = undefined;
        
        res.json({
          user: user, blogs: data
        })

      })
  })
}


//update user information
exports.update = (req, res) => {
  //we need the form data
  let form = new fromidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }

    //save the user
    let user = req.profile;
    //we extend the profule with the changed fields
    user = _.extend(user, fields)

    //password validation
    if (fields.password && fields.password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      })
    }

    //handle files validation
    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Photo must be less than 1mb"
        })
      }
      //save the photo in the database
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      
      //make sure dont return the hashed password and salt
      user.hashed_password = undefined;
      user.salt = undefined;
      user.photo = undefined;

      res.json(user);
    })
  })
}


//handle user photo upload
exports.photo = (req, res) => {
  //username comes from the request parameter from our route /:username
  const username = req.params.username;

  User.findOne({username}).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      })
    }

    //check if the user photo exists
    if (user.photo.data) {
      res.set("Content-Type", user.photo.contentType);
      return res.send(user.photo.data);
    }
  })
}