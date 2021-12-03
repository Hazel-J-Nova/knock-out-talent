const User = require("../models/Users");
const Categories = require("../models/categories");
const Content = require("../models/Content");
const Creator = require("../models/Creators");
const { createObject, getObject, upload } = require("../aws/aws");
const { buildParams, sendEmail } = require("../email/email");
const path = require("path");
const fs = require("fs");
let emailPath = path.resolve(__dirname, "..");

const { getLastMonth } = require("../utils/dateTime");

module.exports.registerEmail = async (req, res) => {
  const { emailId } = req.params;
  const user = await User.findByIdAndUpdate(emailId, { emailVerified: true });
  res.redirct("/");
};

module.exports.categories = async (req, res) => {
  const categories = await Categories.find();
  res.json(categories);
};

module.exports.latestContent = async (req, res) => {
  const lastMonth = getLastMonth();
  const latestContent = await Content.find({ date: { $gte: lastMonth } });
  let latestImages = latestContent.filter((el) => el.category);
  latestImages = latestImages.map((el) => ({
    image: el.images,
    id: el._id.toString(),
    category: el.category,
    title: el.title,
  }));
  res.json(latestImages);
};

module.exports.userInfo = (req, res) => {
  const session = req.user;
  res.json(session);
};

module.exports.passwordResetForm = async (req, res) => {
  const userId = req.params.userId;
  const token = req.params.token;
  const user = await User.findById(userId);
  if (!user) {
    req.flash("failure", "User not found");
    res.redirect("/");
  }
  if (token.length === 0 || token !== user.token) {
    req.flash("failure", "User not found");
    res.redirect("/");
  }
  res.redirect(`/users/passwordResetForm/${user.id}/${user.token}`);
};

module.exports.registerCreator = async (req, res) => {
  let files = req.files;
  let updateForm = req.params.updateForm;
  let userID = req.user._id.toString();
  for (let [index, file] of files.entries()) {
    const params = {
      Bucket: process.env.BUCKET,
      Key: `${userId}/${updateForm}/verification`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    content.fileTypes.push(files.mimetype);
    const object = createObject(params);
  }
};

module.exports.createCreator = async (req, res) => {
  let creator = new Creator();
  creator.user = req.user._id;
  creator.name = req.body.name;
  creator.bio = req.body.aboutYou;
  //await creator.save();
  req.flash(
    "success",
    "Please watch your email to let you know when you are verified"
  );
  res.redirect("/");
};

module.exports.linkBankAccount = async (req, res) => {
  let { userId } = req.params;
  let creator = await Creator.find({ user: userId });
  if (!creator.account) {
    const stripeAccount = await stripe.accounts.create({ type: "express" });
    creator.account = stripeAccount;
    const accountLink = await stripe.accountLinks.create({
      account: creator.account,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });
    await creator.save();
  }
  res.send(creator.account);
};

module.exports.test = (req, res) => {
  res.render("api/test");
};

module.exports.testPost = (req, res) => {
  console.log(req.body);
};
