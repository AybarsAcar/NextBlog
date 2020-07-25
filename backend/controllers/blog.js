//controllers for blog
//this is the callback functionality

//import the relevant models
const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const User = require("../models/user");

//formidable to process photo
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
//node js file system
const fs = require("fs");
//helper methods
const { errorHandler } = require("../helpers/dbErrorHandler");
const { trimContent } = require("../helpers/blog");

//Create Method
exports.create = (req, res) => {
  //get the form data
  let form = new formidable.IncomingForm();

  //keep the files jpeg, png in the form
  form.keepExtensions = true;

  //parse the form data
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    //get the fields from the form data
    const { title, body, categories, tags } = fields;

    //validation
    if (!title || !title.length) {
      return res.status(400).json({
        error: "Title is required",
      });
    }
    if (!body || body.length < 200) {
      return res.status(400).json({
        error: "Content is too short",
      });
    }
    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "At least 1 category is required",
      });
    }
    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: "At least 1 tag is required",
      });
    }

    //create the blog
    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = trimContent(body, 320, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(body.substring(0, 160));
    blog.postedBy = req.user._id;

    //create array of categories and tags
    let arrayOfCategories = categories && categories.split(",");
    let arrayOfTags = tags && tags.split(",");

    //handle the files
    if (files.photo) {
      if (files.photo.size > 10000000) {
        res.status(400).json({
          error: "Image should be less than 1mb",
        });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    //save in the database
    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // res.json(result)
      //find that blog created push the categories and tags
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          Blog.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            } else {
              res.json(result);
            }
          });
        }
      });
    });
  });
};

//List all blogs
exports.list = (req, res) => {
  //find all blogs and populate it with fields linked to other models
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }

      res.json(data);
    });
};

//List all blogs and its components
exports.listAllBlogsCategoriesTags = (req, res) => {
  //
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;
  let tags;

  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }

      //all the blogs
      blogs = data;
      //get all categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        categories = c;
        //get all tags
        Tag.find({}).exec((err, t) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            });
          }

          tags = t;

          //return all -- size will be displayed in the load more
          res.json({ blogs, categories, tags, size: blogs.length });
        });
      });
    });
};

//Read one blog
exports.read = (req, res) => {
  //get the slug from the parameter
  const slug = req.params.slug.toLowerCase();

  //find the blog based on the slug
  Blog.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }

      res.json(data);
    });
};

//Remve one blog
exports.remove = (req, res) => {
  //get the slug from the parameter
  const slug = req.params.slug.toLowerCase();

  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }

    res.json({
      message: "The blog has been deleted successfully",
    });
  });
};

//Update one blog
exports.update = (req, res) => {
  //get the slug from the parameter
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }

    //put that in a form data
    let form = new formidable.IncomingForm();

    //keep the files jpeg, png in the form
    form.keepExtensions = true;

    //parse the form data
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }

      //make sure the slug is persistent
      let slugBeforeMerge = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;

      const { body, desc, categories, tags } = fields;

      //if the body is updated
      if (body) {
        oldBlog.excerpt = trimContent(body, 320, " ", " ...");

        oldBlog.mdesc = stripHtml(body.substring(0, 160));
      }
      //if the categories are updated
      if (categories) {
        oldBlog.categories = categories.split(",");
      }
      //if the tags are updated
      if (tags) {
        oldBlog.tags = tags.split(",");
      }

      //handle the files
      if (files.photo) {
        if (files.photo.size > 10000000) {
          res.status(400).json({
            error: "Image should be less than 1mb",
          });
        }
        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      }

      //save in the database
      oldBlog.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  });
};

//get photo
exports.getPhoto = (req, res) => {
  //
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug })
    .select("photo")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      //return the photo
      res.set("Content-Type", blog.photo.contentType);
      return res.send(blog.photo.data);
    });
};

//grab the related blogs
exports.listRelated = (req, res) => {
  //getting the limit from the body, if nothing the default is 3
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;

  //getting the id and categories of the blog from the body
  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id username name profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "Blogs not found",
        });
      }

      //otherwise send the blogs
      res.json(blogs);
    });
};

//Search implementation Method
//search based on both title and body
exports.listSearch = (req, res) => {
  //send the req.query as search
  const { search } = req.query;

  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }

        res.json(blogs);
      }
    ).select("-photo -body");
  }
};

//get the blogs by the user
exports.listByUser = (req, res) => {
  //find the user based on the username
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let userId = user._id;
    //find the blogs based on the user
    Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select("_id title slug postedBy createdAt updatedAt")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }

        res.json(data);
      })
  });
};
