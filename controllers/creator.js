if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Content = require("../models/Content");
const { createObject, getObject, upload } = require("../aws/aws");
const Categories = require("../models/Categories");
const Creator = require("../models/Creators");
const User = require("../models/Users");

module.exports.userDashBoard = (req, res) => {
  res.render("user/dashboard");
};

module.exports.newContentForm = (req, res) => {
  res.render("user/newcontent");
};

module.exports.uploadNewContent = async (req, res) => {
  const newContent = new Content(req.body.content);
  const scheduled = req.body.content.scheduledDate;

  const creator = await Creator.findOne({
    user: req.session.passport.user,
  }).populate("content");
  creator.contnent.push(newContent);
  let cat = await Categories.find({ title: newContent.category });
  if (cat.length === 0) {
    cat = await new Categories({ title: newContent.category });
    cat.content.push(newContent);
    await cat.save();
  } else {
    cat[0].content.push(newContent);
    await cat.save();
  }
  await creator.save();
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
  res.render("creator/newimage", { id });
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
  const creator = await Creator.findOne({
    user: req.session.passport.user,
  }).populate("content");
  const allContent = creator.content;

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
  res.render("creator/edit", { content });
};
