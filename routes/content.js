const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const Category = require("../models/categories");
const Content = require("../models/Content");

router.route("/allcategories").get(catchAsync(content.allCategories));

 

// router.get("/:contentId", async (req, res) => {
//   const { contentId } = req.params;
//   const content = await Content.findOne({ _id: contentId });
//   res.render("content/content", { content });
// });

module.exports = router;
