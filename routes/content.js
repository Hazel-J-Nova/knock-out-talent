//jshint esversion:9

const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const Category = require("../models/Categories")


router.get("/:categoryId", async (req, res)=>{
   const {categoryId} = req.params
   const category = await Category.findOne({_id:categoryId}).populate("content")
   const allContent = category.content.map(x =>x);
   console.log(allContent)
   res.render("content/index" ,{allContent})

})

module.exports = router;
