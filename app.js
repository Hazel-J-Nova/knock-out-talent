//jshint esversion:9


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// const dbUrl = "mongodb://localhost:27017/kate";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");


mongoose.connect("mongodb://localhost:27017/katetest", {
	useNewUrlParser: true,
});

const db = mongoose.connection;


db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
	console.log("i am in");
});
app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/login", (req, res) => {
    res.render("login")
})

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port);