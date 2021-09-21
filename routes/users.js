const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const User = require('../models/users');
const users = require('../controllers/users');



router.get("/register", users.register);

router.post("/register", catchAsync(users.register));

router.get("/login", users.renderLogin);

router.get("/logout", users.logout);

router.post(
	"/login",
	//passport.authenticate("local", {
	//	failureFlash: true,
	//	failureRedirect: "/login",
	//}),
	catchAsync(users.login)
);

module.exports = router;
