if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const getLastMonth = require("../utils/dateTime");
const { buildParams, sendEmail } = require("../email/email");
const Email = require("../models/Emails");

const Content = require("../models/Content");
const Users = require("../models/Users");
const { createObject, getObject, upload, downloadURL } = require("../aws/aws");
const Categories = require("../models/categories");
const { EmailAddress } = require("@sendgrid/helpers/classes");

module.exports.adminDashBoard = (req, res) => {
  res.render("admin/dashboard");
};

module.exports.newContentForm = (req, res) => {
  res.render("admin/newcontent");
};

module.exports.uploadNewContent = async (req, res) => {
  const newContent = new Content(req.body.content);
  newContent.creator = req.user.id;
  if (!newContent.date) {
    newContent.date = Date.now();
  }
  let cat = await Categories.findOne({ title: newContent.category });
  if (!cat === null) {
    cat.content.push(newContent);
    await cat.save();
  } else {
    cat = await new Categories({ title: newContent.category });
    cat.content.push(newContent);
    await cat.save();
  }
  let files = req.files;
  for (let [index, file] of files.entries()) {
    const params = {
      Bucket: process.env.BUCKET,
      Key: `${newContent._id.toString()}/${index}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    content.fileTypes.push(files.mimetype);
    const object = createObject(params);
  }
  newContent.numberOfFiles = files.length;
  await newContent.save();

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
    res.redirect("/admin/allcontent");
  }
  res.render("admin/edit", { content });
};

module.exports.verifyCreatorList = async (req, res) => {
  const creators = await Users.find({ appliedForCreator: true });
  let descriptorArray = ["Id", "Face", "FaceID"];

  for (let creator of creators) {
    let creatorId = creator._id.toString;
    creator.urls = [];
    for (let item of descriptorArray) {
      const params = {
        Bucket: process.env.Bucket,
        Key: `${creatorId}/${item}/verification`,
      };
      const object = await downloadURL(params);
      creator.url.push(object);
    }
  }
  res.render("admin/verifyCreator", { creators, descriptorArray });
};

module.exports.verifyCreator = async (req, res) => {
  const { creatorId } = req.params;
  const creator = await Creator.findById(creatorId);
  const urls = req.body;
  let descriptorarray = ["Id", "Face", "FaceID"];
  for (let key in urls.key()) {
    if (!creator.key) {
      creator.key = true;
    }
    await creator.save();
  }
  if (creator.Id && creator.Face && creator.FaceId) {
    const responseEmail = await Email.find({
      subject: "Succesfully verified your account",
    });
    const user = await User.findById(creator.user);
    user.creator = true;
    await creator.save();
    const params = buildParams(
      user.email,
      responseEmail.subject,
      responseEmail.textBody,
      responseEmail.htmlBody
    );
    sendEmail(params);
  } else {
    const responseEmail = await Email.find({ subject: "Verification failed" });
  }
  const params = buildParams(
    user.email,
    responseEmail.subject,
    responseEmail.textBody,
    responseEmail.htmlBody
  );
  sendEmail(params);
  res.redirect("/admin/verifyCreator");
};

module.exports.renderEmailForm = async (req, res) => {
  res.render("admin/emailForm");
};

module.exports.emailForm = async (req, res) => {
  let emailBody = req.body;
  let email = await new Email();
  email.subject = emailBody.subject;
  email.htmlBody = emailBody.htmlBody;
  email.textBody = emailBody.textBody;
  await email.save();
  req.flash("success", "email template created");
  res.redirect("/admin/allEmail");
};

module.exports.allEmail = async (req, res) => {
  let allEmail = await Email.find({});
  res.render("admin/allEmail", { allEmail });
};

module.exports.deleteEmail = async (req, res) => {
  let { emailId } = req.params;

  let email = await Email.findByIdAndDelete(emailId);

  req.flash("success", "email template deleted");
  res.redirect("/admin/allEmail");
};

module.exports.updateEmailForm = async (req, res) => {
  let { emailId } = req.params;
  let email = await Email.findById(emailId);
  res.render("admin/updateEmail", { email });
};

module.exports.updateEmail = async (req, res) => {
  let { emailId } = req.params;
  let email = await Email.findById(emailId);
  email.subject = req.body.subject;
  email.htmlBody = req.body.htmlBody;
  email.textBody = req.body.textBody;
  await email.save();
  req.flash("success", "email updated");
  res.redirct("/admin/allEmail");
};
