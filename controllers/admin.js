if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const getLastMonth = require("../utils/dateTime");
const Content = require("../models/Content");
const { createObject, getObject, upload } = require("../aws/aws");
const Categories = require("../models/categories");

module.exports.adminDashBoard = (req, res) => {
  res.render("admin/dashboard");
};

module.exports.newContentForm = (req, res) => {
  res.render("admin/newcontent");
};

module.exports.uploadNewContent = async (req, res) => {
  const newContent = new Content(req.body.content);
  newContent.creator = req.user.id;

  let cat = await Categories.findOne({ title: newContent.category });
  if (!cat.length === 0) {
    cat.content.push(newContent);
    await cat.save();
  } else {
    cat = await new Categories({ title: newContent.category });
    cat.content.push(newContent);
    await cat.save();
  }
  await newContent.save();
  const params = {
    Bucket: process.env.BUCKET,
    Key: newContent._id.toString(),
    Body: req.files[0].buffer,
    ContentType: req.files[0].mimetype,
    ACL: "public-read",
  };
  const object = createObject(params);
  res.redirect(`/admin/newcontent/image/${newContent._id}`);
};

module.exports.newImageForm = async (req, res) => {
  const { id } = req.params;
  res.render("admin/newimage", { id });
};

module.exports.uploadNewImage = async (req, res) => {
  const id = req.params.id;
  const content = await Content.findOne({ _id: id });

  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await content.images.push(...imgs);
  await content.save();
  res.redirect("/admin/allcontent");
};

module.exports.showAllContent = async (req, res) => {
  const allContent = await Content.find({});
  for (let content of allContent) {
    const params = { Bucket: process.env.BUCKET, Key: content._id.toString() };
  }
  res.render("admin/allcontent", { allContent });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const content = await Content.findById(id);
  content.aws = getObject({ Bucket: proccess.env.BUCKET, Key: id });
  if (!content) {
    req.flash("error", "Cannot find that content!");
    return res.redirect("/admin/allcontent");
  }
  res.render("admin/edit", { content });
};
