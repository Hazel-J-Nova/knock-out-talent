const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/Users");
const Categories = require("../models/Categories");
const Content = require("../models/Content");
const { buildParams, sendConfirmationEmail } = require("../email/email");
const fs = require("fs");
const path = require("path");
let emailPath = path.resolve(__dirname, "..");

const { getLastMonth } = require("../utils/dateTime");

router.post(
  "/register/:emailId",
  catchAsync(async (req, res) => {
    const { emailId } = req.params;
    const user = await User.findByIdAndUpdate(emailId, { emailVerified: true });
    res.redirct("/");
  })
);

router.get(
  "/categories",
  catchAsync(async (req, res) => {
    const categories = await Categories.find();
    res.json(categories);
  })
);

router.get(
  "/latestcontent",
  catchAsync(async (req, res) => {
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
  })
);

router.get("/sessioninfo", (req, res) => {
  const session = req.session;
  console.log(session);
  res.json(session);
});

router.get(
  "/:userId/:token",
  catchAsync(async (req, res) => {
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
  })
);
module.exports = router;
