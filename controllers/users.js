const User = require("../models/Users");
const { buildParams, sendConfirmationEmail } = require("../email/email");
const fs = require("fs");
const path = require("path");
const flash = require("express-flash");
let dirName = path.resolve(__dirname, "..");
const Creator = require("../models/Creators");
let verifyEmailPath = `${dirName}\\email\\register.html`;
let resetEmailPath = `${dirName}\\email\\register.html`;
const Content = require("../models/Content");
const Categories = require("../models/Categories");

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
    late = fs.readFileSync(resetEmailPath, "utf8");
    htmlTemplate = htmlTemplate
      .replace("username", userName)
      .replace(
        "registerLink",
        `http://localhost:3000/api/${user._id}/${user.token}`
      );
    let email = "Hazel.J.Tate@gmail.com";

    let params = buildParams(email, htmlTemplate, "aaaaaaa");
    sendConfirmationEmail(params);
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
  res.redirect("user/login");
};

module.exports.userProfile = async (req, res) => {
  const { userName } = req.params;

  const user = await User.findOne({ username: userName });
  if (!user) {
    req.flash("error", "You do not have permission to view that");
    res.redirect("/");
  }
  const creator = await Creator.findOne({ user: user._id })
    .populate("content")
    .populate("categories");
  res.render("users/profile", { creator, user });
};

module.exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("failure", "You do not have permission to view that");
    res.redirect("/");
  }
  const creator = await Creator.findOne({ user: id });
  res.render("users/updateProfile", { creator });
};
