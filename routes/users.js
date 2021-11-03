const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const User = require("../models/Users");
const users = require("../controllers/users");

router
  .route("/register")
  .get(catchAsync(users.renderRegister))
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(catchAsync(users.renderLogin))
  .post(
    catchAsync,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

router
  .route("/resetPassword")
  .get(users.renderResetPassword)
  .post(users.resetPassword);

router
  .route("/passwordResetForm/:userId/:token")
  .get(users.renderPasswordResetForm)
  .post(users.passwordResetForm);

router.route("/:userId").get(users.userProfile).post(users.updateProfile);

module.exports = router;
