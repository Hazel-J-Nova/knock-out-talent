//jshint esversion:9

const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const Category = require("../models/Categories")
const Content = require("../models/Content")


router.get("/", async (req,res)=>{
   const categories = await Category.find({}).populate("content")
   console.log(categories)
   const blue = "blue"
   res.render("content/allcategories", {categories, blue})
})


router.get("/category/:categoryId", async (req, res)=>{
   const {categoryId} = req.params
   const category = await Category.findOne({_id:categoryId}).populate("content")
   const allContent = category.content.map(x =>x);
   res.render("content/category" ,{allContent})

})

router.get("/:contentId", async(req, res)=>{
   const {contentId} = req.params
   const content =await Content.findOne({_id:contentId})
   res.render("content/content", {content})
})


module.exports = router;
