const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const User = require("../models/Users");
const users = require("../controllers/users");
const multer = require("multer");
const s3Storage = multer.memoryStorage();
const upload = multer({ storage: s3Storage });
const { isLoggedIn } = require("../utils/middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

router
  .route("/resetPassword")
  .get(catchAsync(users.renderResetPassword))
  .post(catchAsync(users.resetPassword));

router
  .route("/passwordResetForm/:userId/:token")
  .get(users.renderPasswordResetForm)
  .post(users.passwordResetForm);

router
  .route("/updateProfile/:userName")
  .get(users.updateUserProfileForm)
  .post(catchAsync(users.updateUserProfile));

router
  .route("/register/creator")
  .get(users.renderCreatorRegisterForm)
  .post(upload.array("image"), catchAsync(users.registerNewCreator));
router.route("/purchases/:userId").get(isLoggedIn, catchAsync(users.purchases));

router.route("/:userName").get(users.userProfile);

module.exports = router;
