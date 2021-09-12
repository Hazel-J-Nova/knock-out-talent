const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");


router.get("/registerForm", users.register);

router.post("/register", catchAsync(users.register));

router.get("/login", users.loginform);

router.get("/logout", users.logout);

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	catchAsync(users.login)
);

module.exports = router;
