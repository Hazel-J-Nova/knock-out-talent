const User = require("../models/Users");
const { buildParams, sendEmail } = require("../email/email");
const fs = require("fs");
const path = require("path");
const flash = require("express-flash");
let dirName = path.resolve(__dirname, "..");
const Creator = require("../models/Creators");
let verifyEmailPath = `${dirName}\\email\\register.html`;
let resetEmailPath = `${dirName}\\email\\resetPassword.html`;
const Content = require("../models/Content");
const Categories = require("../models/categories");
const { createObject, getObject, upload, downloadURL } = require("../aws/aws");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Knockout Talent!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");

  res.redirect("/");
};

module.exports.logout = (req, res) => {
  req.logout();
  // req.session.destroy();
  req.flash("success", "Goodbye!");
  res.redirect("/");
};

module.exports.renderResetPassword = (req, res) => {
  res.render("users/resetPassword");
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ username: userName });
    if (!user) {
      req.flash("error", "sorry there is no user with that name");
      res.redirect("/");
    }
    let htmlTemplate = fs.readFileSync(resetEmailPath, "utf8");
    htmlTemplate = htmlTemplate
      .replace("username", userName)
      .replace(
        "registerLink",
        `https://www.knockouttalent/api/${user._id}/${user.token}`
      );
    let email = "knockout.talent.models@gmail.com";

    let params = buildParams(
      email,
      "Reset your password",
      htmlTemplate,
      htmlTemplate
    );
    sendEmail(params);
    req.flash("success", "please check your email");
    res.redirect("/");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/");
  }
};

module.exports.renderPasswordResetForm = (req, res) => {
  const params = req.params;
  res.render("users/passwordResetForm", { params });
};

module.exports.passwordResetForm = async (req, res) => {
  const newPassword = req.body.password;
  const userName = req.body.userName;

  const { token } = req.params;
  const user = await User.findOne({ username: userName });
  if (!user || userName !== user.username || user.token !== token || !token) {
    req.flash("error", "sorry no user with that Id");
    res.redirect("/");
  }
  user.setPassword(req.body.password);
  user.token = "";
  req.flash("success", "password updated");
  res.redirect("/user/login");
};

module.exports.userProfile = async (req, res) => {
  const { userName } = req.params;
  const currentUser = await User.findOne({ username: userName });

  const creator = await Creator.findOne({ user: currentUser.id })
    .populate("content")
    .populate("categories");
  res.render("users/profile", { creator, currentUser });
};

module.exports.updateUserProfileForm = async (req, res) => {
  res.render("users/updateProfile");
};

module.exports.updateUserProfile = async (req, res) => {
  let { userName } = req.params;
  const currentUser = await User.findOne({ username: userName });
  const creator = await Creator.findOne({ user: currentUser.id });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));

  await creator.avatar.push(...imgs);
  await creator.save();
  res.redirect(`user/${userName}`, currentUser);
};

module.exports.renderCreatorRegisterForm = async (req, res) => {
  if (!req.user) {
    req.flash("error", "Please login or signup");
    res.redirect("/users/login");
  }
  res.render("users/registerCreator");
};

module.exports.purchases = async (req, res) => {
  let { userId } = req.params;

  let currentUser = await User.findById(userId).populate("purchases");
  let userPurchases = currentUser.purchases;
  let purchaseArray = [];
  for (let purchase of userPurchases) {
    let contentCreator = await Creator.findById(purchase.creator);
    let fileStore = {};
    fileStore.contentTitle = purchase.title;
    fileStore.creator = contentCreator.name;
    fileStore.description = purchase.description;
    fileStore.urls = [];
    fileStore.fileType = [];

    for (let numStep = 0; numStep <= purchase.numberOfFiles; numStep++) {
      const params = {
        Bucket: process.env.Bucket,
        Key: `${req.params.id}/${numStep}`,
      };
      const object = await downloadURL(params);

      fileStore.urls.push(object);
      fileStore.fileType.push(purchase.fileType[numStep]);
      purchaseArray.push(fileStore);
    }
  }
  res.render("users/purchases", { purchaseArray });
};
