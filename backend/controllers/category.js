//bring in the category model
const Category = require("../models/category");
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

  let category = new Category({ name, slug });

  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    res.json(data); //we can access it with category.data
  });
};

//list all the categoreis
exports.list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

//get one category
exports.read = (req, res) => {
  //we need the slug from the parameters
  const slug = req.params.slug.toLowerCase();

  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    // res.json(category);
    Blog.find({ categories: category })
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

        res.json({category: category, blogs: data})
      })
  });
};

//remove a category
exports.remove = (req, res) => {
  //we need the slug from the parameters
  const slug = req.params.slug.toLowerCase();

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Category is successfully deleted",
    });
  });
};
