//bring in the tag model
const Tag = require("../models/tag");
const slugify = require("slugify");
//bring in the blog model
const Blog = require("../models/blog");
//error handler for db
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  //grab the name from the body
  const { name } = req.body;

  //then generage the slug
  let slug = slugify(name).toLowerCase();

  let tag = new Tag({ name, slug });

  tag.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    res.json(data); //we can access it with tag.data
  });
};

//list all the tags
exports.list = (req, res) => {
  Tag.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

//get one tag
exports.read = (req, res) => {
  //we need the slug from the parameters
  const slug = req.params.slug.toLowerCase();

  Tag.findOne({ slug }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: "Tag not found",
      });
    }
    //find the associated Blogs
    Blog.find({tags: tag})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    .select(
      "_id title slug excerpt categories postedBy tags createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      res.json({tag: tag, blogs: data})
    })
  });
};

//remove a tag
exports.remove = (req, res) => {
  //we need the slug from the parameters
  const slug = req.params.slug.toLowerCase();

  Tag.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Tag is successfully deleted"
    });
  });
};
