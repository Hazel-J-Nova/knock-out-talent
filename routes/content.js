const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const Category = require("../models/categories");
const Content = require("../models/Content");

router.get("/", async (req, res) => {
  const allCategories = await Category.find({}).populate("content");
  for (let el of allCategories) {
    if (el.title) {
      console.log(el.title);
    }
  }
  res.render("content/allcategories", { allCategories });
});

router.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findOne({ _id: categoryId }).populate(
    "content"
  );
  const allContent = category.content.map((x) => x);
  res.render("content/category", { allContent });
});

router.get("/:contentId", async (req, res) => {
  const { contentId } = req.params;
  const content = await Content.findOne({ _id: contentId });
  res.render("content/content", { content });
});

module.exports = router;
