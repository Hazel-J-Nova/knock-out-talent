const express = require("express");
const router = express.Router();
const api = require("../controllers/api");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/Users");
const Categories = require("../models/categories");
const Content = require("../models/Content");
const multer = require("multer");
const s3Storage = multer.memoryStorage();
const upload = multer({ storage: s3Storage });
const { isLoggedIn, isCreator } = require("../utils/middleware");
const { buildParams, sendConfirmationEmail } = require("../email/email");
const fs = require("fs");
const path = require("path");
let emailPath = path.resolve(__dirname, "..");

const { getLastMonth } = require("../utils/dateTime");

router.route("/register/:emailId").get(catchAsync(api.registerEmail));

router.route("/categories");
catchAsync(api.categories);

router.route("/latestcontent");
catchAsync(api.latestContent);
router.route("/test").get(api.test).post(api.testPost);

router.route("/userInfo").get(api.userInfo);
router.route("/createcreator").post(api.createCreator);
router.route("/:userId/linkBankAccount").post(api.linkBankAccount);

router.route("/:userId/:token").get(catchAsync(api.passwordResetForm));

router
  .route("/register/creator/:updateForm")
  .post(upload.array("image"), api.registerCreator);

module.exports = router;


