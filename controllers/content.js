const Content = require("../models/Content");
const Categories = require("../models/categories");

module.exports.allCategories = async (req, res) => {
  const allCategories = await Categories.find({}).populate("content");
  res.render("content/allcategories", { allCategories });
};
