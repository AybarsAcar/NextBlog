//mongoose schema
const mongoose = require("mongoose");
const crypto = require("crypto");

//create a user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    profile: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

//virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    //create a temp variable called _password
    this._password = password
    //generate salt
    this.salt = this.makeSalt();
    //encryptPassword
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password;
  });


//methods
userSchema.methods = {
  encryptPassword: function(password) {
    if (!password) return "";
    
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
    } catch {
      return "";
    }
  },

  makeSalt: function() {
    return Math.round(new Date() * Math.random() + "");
  },

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
}





module.exports = mongoose.model("User", userSchema);
